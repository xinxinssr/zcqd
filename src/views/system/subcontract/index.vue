<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-row>
          <el-col :span="6">
        <label class="el-form-item-label">供应商名称</label>
        <el-input v-model="query.supplierName" clearable placeholder="供应商名称" style="width: 200px;" class="filter-item"
                  @keyup.enter.native="crud.toQuery"/>
          </el-col>
          <el-col :span="6">
        <label class="el-form-item-label">产品类别</label>
        <el-input v-model="query.productType" clearable placeholder="产品类别" style="width: 200px;" class="filter-item"
                  @keyup.enter.native="crud.toQuery"/>
          </el-col>
          <el-col :span="6">
        <rrOperation :crud="crud"/>
          </el-col>
        </el-row>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>

      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="1000px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
          <el-form-item label="ID" v-if="show">
            <el-input v-model="form.id" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="供应商id" v-if="show">
            <el-input v-model="form.supplierId" style="width: 370px;"/>
          </el-form-item>
          <el-row>
            <el-col :span="12">
          <el-form-item label="供应商名称" prop="supplierName">
            <el-select v-model="form.supplierName" @change="selectByname(form.supplierName)" filterable
                       placeholder="请选择" style="width: 366px;">
              <el-option
                v-for="item in supplierList"
                :key="item.id"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <el-form-item label="提供产品名称" v-if="form.productScope!=null">
            <el-input v-model="form.productScope" style="width: 366px;" disabled="disabled"/>
          </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
          <el-form-item label="供方范围">
            <el-select v-model="form.supplierScope" filterable placeholder="请选择" style="width: 366px;">
              <el-option
                v-for="item in dict.supplier_scope"
                :key="item.id"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <el-form-item label="产品类别">
            <el-input v-model="form.productType" style="width: 366px;"/>
          </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
          <el-form-item label="工序" prop="processScope">
            <el-input  type="textarea" :rows="4" v-model="form.processScope" style="width: 366px;"/>
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <el-form-item label="项目范围">
            <el-input  type="textarea" :rows="4"v-model="form.projectScope" style="width: 366px;"/>
          </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
          <el-form-item label="供方联系人" v-if="form.supplierBy!=null">
            <el-input v-model="form.supplierBy" style="width: 366px;" disabled="disabled"/>
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <el-form-item label="供方联系电话" v-if="form.supplierPhone!=null">
            <el-input v-model="form.supplierPhone" style="width: 366px;" disabled="disabled"/>
          </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
          <el-form-item label="创建时间">
            <el-date-picker v-model="form.createTime" type="datetime" style="width: 366px;" disabled="disabled"/>
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <el-form-item label="创建者">
            <el-input v-model="form.createBy" style="width: 366px;" disabled="disabled"/>
          </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
          <el-form-item label="更新时间">
            <el-date-picker v-model="form.updateTime" type="datetime" style="width: 366px;" disabled="disabled"/>
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <el-form-item label="更新者">
            <el-input v-model="form.updateBy" style="width: 366px;" disabled="disabled"/>
          </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler" >
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="id" label="ID" v-if="show"/>
        <el-table-column prop="supplierId" label="供应商id" v-if="show"/>
        <el-table-column prop="supplierName" label="供应商名称"/>
        <el-table-column prop="supplierScope" label="供方范围">
          <template slot-scope="scope">
            {{ dict.label.supplier_scope[scope.row.supplierScope] }}
          </template>
        </el-table-column>
        <el-table-column prop="productScope" label="提供产品名称/范围"/>
        <el-table-column prop="processScope" label="工序"/>
        <el-table-column prop="projectScope" label="项目范围"/>
        <el-table-column prop="productType" label="产品类别"/>

        <el-table-column v-if="checkPer(['admin','subcontract:edit','subcontract:del'])" label="操作" width="150px"
                         align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
  </div>
</template>

<script>
    import crudSubcontract from '@/api/system/subcontract'
    import CRUD, {presenter, header, form, crud} from '../../../components/subcontractCrud/crud'
    import rrOperation from '../../../components/subcontractCrud/RR.operation'
    import crudOperation from '../../../components/subcontractCrud/CRUD.operation'
    import udOperation from '../../../components/subcontractCrud/UD.operation'
    import pagination from '../../../components/subcontractCrud/Pagination'
    import {requestGet, urls} from '@/api/system/getpost'
    import {formatDate} from "../../../utils/date";
    import {requestPost} from "../../../api/system/getpost";

    const defaultForm = {
        id: null,
        supplierId: null,
        supplierName: null,
        supplierScope: null,
        productScope:null,
        processScope: null,
        projectScope: null,
        productType: null,
        supplierBy:null,
        supplierPhone:null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        state: null
    }
    export default {
        name: 'Subcontract',
        components: {pagination, crudOperation, rrOperation, udOperation},
        mixins: [presenter(), header(), form(defaultForm), crud()],
        dicts: ['supplier_scope'],
        cruds() {
            return CRUD({
                title: '工序分包',
                url: 'api/subcontract',
                idField: 'id',
                sort: 'id,desc',
                crudMethod: {...crudSubcontract}
            })
        },
        data() {
            return {
                permission: {
                    add: ['admin', 'subcontract:add'],
                    edit: ['admin', 'subcontract:edit'],
                    del: ['admin', 'subcontract:del']
                },
                rules: {
                    supplierName: [
                        {required: true, message: '供应商名称不能为空', trigger: 'blur'}
                    ],
                    processScope: [
                        {required: true, message: '工序不能为空', trigger: 'blur'}
                    ]
                },
                queryTypeOptions: [
                    {key: 'supplierName', display_name: '供应商名称'},
                    {key: 'productType', display_name: '产品类别'}
                ],
                show: false,

                supplierList: []
            }
        },
        methods: {
            //查询供应商信息
            selectSupplier() {
                requestGet(urls + 'supplier/selectAll').then(result => {
                    this.supplierList = result

                }).catch(() => {

                })
            },
            //查询一个供应商信息
            selectByname(param) {

                const formDate = new FormData()
                formDate.append('name', param)
                requestPost(urls + 'supplier/selectByName', formDate).then(result => {
                    this.form.supplierId = result.id
                    this.form.productScope = result.product_scope
                    this.form.supplierBy = result.supplier_by
                    this.form.supplierPhone = result.supplier_phone

                }).catch(() => {

                })

            },

            // 钩子：在获取表格数据之前执行，false 则代表不获取数据
            [CRUD.HOOK.beforeRefresh]() {
                return true
            }
        },
        mounted() {
            this.selectSupplier()
        }
    }
</script>

<style scoped>

</style>
