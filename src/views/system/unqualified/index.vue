<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <slot name="left" />
      <el-button
        class="filter-item"
        size="max"
        style="width: 100px"
        :style="classObject1"
        @click="selectproduct(0)"
      >
       列表详情
      </el-button>
      <el-button
        class="filter-item"
        size="max"
        style="width: 100px"
        :style="classObject2"
        @click="selectproduct(1)"
      >
       统计分析
      </el-button>
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-row>
          <el-col :span="5">
        <label class="el-form-item-label">产品名称</label>
        <el-select
          v-model="query.productName"
          @change="selectExitSelectConfig"
          filterable
          default-first-option
          remote
          placeholder="请选择产品名称"
        >
          <el-option
            v-for="item in productList"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
          </el-col>
          <el-col :span="5">
        <label class="el-form-item-label">创建人</label>
        <el-select
          v-model="query.createBy"
          @change="selectExitSelectConfig"
          filterable
          default-first-option
          remote
          placeholder="请选择创建人"
        >
          <el-option
            v-for="item in createByList"
            :key="item.createBy"
            :label="item.createBy"
            :value="item.createBy"
          />
        </el-select>
          </el-col>
          <el-col :span="5">
        <label class="el-form-item-label">故障类型</label>
        <el-select
          v-model="query.faultName"
          filterable
          default-first-option
          remote
          placeholder="请选择故障类型"
        >
          <el-option
            v-for="item in dict.fault"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
          </el-col>
          <el-col :span="5">
        <label class="el-form-item-label">故障等级</label>
        <el-select
          v-model="query.faultLevel"
          filterable
          default-first-option
          remote
          placeholder="请选择故障等级"
        >
          <el-option
            v-for="item in dict.fault_level"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
          </el-col>
          <el-col :span="4" style="margin-top: 2px">
        <rrOperation :crud="crud" />
          </el-col>
        </el-row>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <el-dialog :visible.sync="bigger" width="600px" height="800px" >
        <img :src="img+path" width="100%">
      </el-dialog>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="cancelCU" :visible.sync="bigger2" title="查看详情" width="1000px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
          <el-form-item label="自增id" v-if="show">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-row>
            <el-col :span="12">
          <el-form-item label="项目名称">
            <el-input v-model="form.projectName" style="width: 370px;" disabled="disabled"  />
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <el-form-item label="产品名称">
            <el-input v-model="form.productName" style="width: 370px;"  disabled="disabled" />
          </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
          <el-form-item label="故障类型">
            <el-input v-model="form.faultName" style="width: 370px;"  disabled="disabled" />
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <el-form-item label="故障等级">
            <el-input v-model="form.faultLevel" style="width: 370px;" disabled="disabled"  />
          </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
          <el-form-item label="追溯号">
            <el-input v-model="form.trackNo" style="width: 370px;" disabled="disabled"  />
          </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="供应商">
              <el-input v-model="form.supplierName" style="width: 370px;" disabled="disabled"  />
            </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
          <el-form-item label="提出人">
            <el-input v-model="form.createBy" style="width: 370px;" disabled="disabled"  />
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <el-form-item label="提出时间">
            <el-date-picker v-model="form.updateTime" type="datetime" disabled="disabled" style="width: 366px;" />
          </el-form-item>
            </el-col>
          </el-row>
          <el-row>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="form.describe"  :rows="4" style="width: 600px;" disabled="disabled"  />
          </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="照片"  >
              <span v-for="item in form.accessory" style="margin-left: 5px">
              <img  :src="img+item.path" @click="showImg(item.path)"  style="width: 300px; height: 300px" disabled="disabled"  />
              </span>
            </el-form-item>
          </el-row>
          <el-row>
          <el-form-item label="是否解决">

            <el-input v-if="form.isSolve==0" value="是" style="width: 370px;"  disabled="disabled" />
            <el-input v-if="form.isSolve==1" value="否" style="width: 370px;"  disabled="disabled" />
          </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
          <el-form-item label="解决人" v-if="show2">
            <el-input v-model="form.solveBy" style="width: 370px;"  disabled="disabled" />
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <el-form-item label="解决时间" v-if="show2">
            <el-date-picker v-model="form.solveTime" type="datetime" disabled="disabled" style="width: 366px;" />
          </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="解决人描述" v-if="show2">
            <el-input type="textarea" :rows="4" v-model="form.solveDescribe" style="width: 600px;" disabled="disabled" />
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="cancelCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler" >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="自增id"  v-if="show"/>
        <el-table-column prop="checkId" label="检查项id" v-if="show" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="projectName" label="项目名称"  />
        <el-table-column prop="trackNo" label="追溯号" />
        <el-table-column prop="faultId" label="故障类型id" v-if="show"  />
        <el-table-column prop="faultName" label="故障类型">
          <template slot-scope="scope">
            {{ dict.label.fault[scope.row.faultName] }}
          </template>
        </el-table-column>
        <el-table-column prop="faultLevel" label="故障等级" />
        <el-table-column prop="describe" label="问题描述" />
        <el-table-column prop="accessory" label="照片 " >
        <template width="90" slot-scope="scope" >

          <img @click="showImg(scope.row.accessory[0].path)" style="width:80px;height:80px;border:none;" :src="img+scope.row.accessory[0].path">

        </template>
        </el-table-column>
        <el-table-column prop="isSolve" label="是否解决" >
          <template slot-scope="scope">
            <span v-if="scope.row.isSolve==0">是</span>
            <span v-if="scope.row.isSolve==1">否</span>

          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="提出人 " />
        <el-table-column prop="updateTime"  :formatter="formDate" label="时间" />

        <el-table-column v-if="checkPer(['admin','unqualified:edit','unqualified:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button  @click="checkDetails(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
    import crudUnqualified from '@/api/system/unqualified'
    import CRUD, {presenter, header, form, crud} from '../../../components/unqualifiedCrud/crud'
    import rrOperation from '../../../components/unqualifiedCrud/RR.operation'
    import crudOperation from '../../../components/unqualifiedCrud/CRUD.operation'
    import udOperation from '../../../components/unqualifiedCrud/UD.operation'
    import pagination from '../../../components/unqualifiedCrud/Pagination'
    import {requestPost, urls} from '@/api/system/getpost'
    import {formatDate} from "../../../utils/date";
    const defaultForm = { id: null, productName:null,accessory:[],checkId: null, trackNo: null, faultId: null, faultName: null, faultLevel: null, createBy: null, updateTime: null, describe: null, isSolve: null, solveBy: null, solveTime: null, solveDescribe: null, state: null,supplierName:null }
    export default {
        name: 'Unqualified',
        components: { pagination, crudOperation, rrOperation, udOperation },
        mixins: [presenter(), header(), form(defaultForm), crud()],
        dicts: ['fault','fault_level'],
        cruds() {
            return CRUD({ title: '/unqualified', url: 'api/unqualified', idField: 'id', sort: 'id,desc', crudMethod: { ...crudUnqualified }})
        },
        data() {
            return {
                show:false,
                show2:false,
                bigger:false,
                bigger2:false,
                productList:[],
                createByList:[],
                form:[],
                img: 'http://127.0.0.1:8085/zc/',
                path:'',
                classObject1:{
                    background:'#ffdd80'
                },
                classObject2:{
                    background:''
                },
                permission: {
                    add: ['admin', 'unqualified:add'],
                    edit: ['admin', 'unqualified:edit'],
                    del: ['admin', 'unqualified:del']
                },
                rules: {
                },
                queryTypeOptions: [
                    { key: 'checkId', display_name: '检查项id' },
                    { key: 'faultName', display_name: '故障类型名称' },
                    { key: 'faultLevel', display_name: '故障等级' },
                    { key: 'createBy', display_name: '创建人' }
                ]
            }
        },
        methods: {
            //显示照片
            showImg(param){
                this.bigger=true
                this.path=param
            },
            selectproduct(param){
                if(param==0){
                    this.classObject1="ffdd80"
                    this.$router.push({name: 'Unqualified'})
                }else {
                    this.classObject2="ffdd80"
                    this.$router.push({name: 'Piechart'})
                }
            },
            selectExitSelectConfig(){
                requestPost(urls + 'product/selectAllProduct2').then(result => {
                    this.productList=result
                }).catch(() => {

                })
                requestPost(urls + 'unqualified/findCreateBy').then(result => {

                    this.createByList=result

                }).catch(() => {

                })
            },
            //查看详情
            checkDetails(param){
                this.form=param
                console.log(this.form)
                this.bigger2=true
                if(this.form.isSolve==0){

                    this.show2=true
                }else {

                    this.show2=false
                }
            },
            cancelCU(){
                this.bigger2=false
            },
            formDate(row){
                    if(row.updateTime!=null){
                        row.updateTime=formatDate(row.updateTime,'yyyy-MM-dd hh:mm')
                    }
                    return  row.updateTime
            },
            // 钩子：在获取表格数据之前执行，false 则代表不获取数据
            [CRUD.HOOK.beforeRefresh]() {
                return true
            }
        },
        mounted() {
            this.selectExitSelectConfig()

        }
    }
</script>

<style scoped>

</style>
