<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <slot name="left" />
      <el-button
        class="filter-item"
        size="max"
        style="width: 100px"
        v-model="query.type"
        :style="classObject1"
        @click="selectproduct(0)"
      >
        电气
      </el-button>
      <el-button
        class="filter-item"
        size="max"
        v-model="query.type"
        style="width: 100px"
        :style="classObject2"
        @click="selectproduct(1)"
      >
        机械
      </el-button>
      <el-button
        class="filter-item"
        size="max"
        v-model="query.type"
        style="width: 100px"
        :style="classObject3"
        @click="selectproduct(2)"

      >
        焊接
      </el-button>
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.type" v-if="show" placeholder="类别" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-row>
          <el-col :span="8">
            <label class="el-form-item-label" style="width: 100px">项目平台</label>
            <el-select v-model="query.platformName" filterable placeholder="请选择" tyle="width: 205px;" class="filter-item" @keyup.enter.native="crud.toQuery" >
              <el-option
                v-for="item in dict.project_platform"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-col>
          <el-col :span="8">
            <label class="el-form-item-label">项目名称</label>
            <el-select
              v-model="query.projectId"
              @change="selectExitSelectConfig"
              filterable
              remote
              placeholder="请选择项目名称"
            >
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="8">
            <label class="el-form-item-label">产品名称</label>
            <el-select
              v-model="query.productId"
              @change="selectExitSelectConfig4"
              filterable
              remote
              placeholder="请选择产品名称"
            >
              <el-option
                v-for="item in productList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <label class="el-form-item-label" style="width: 100px">出厂编号</label>
            <el-input v-model="query.factoryCode" clearable placeholder="出厂编号" style="width: 205px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
          </el-col>
          <el-col :span="8">
            <label class="el-form-item-label" >SRI列数</label>
            <el-input v-model="query.sri" clearable placeholder="出厂编号" style="width: 205px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
          </el-col>
          <el-col :span="8">
            <rrOperation :crud="crud" style="margin-left: 100px"/>
          </el-col>
        </el-row>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="1000px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="ID"  v-if="show">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-row>
            <el-col :span="12">
          <el-form-item label="项目平台" prop="platformName" width="80px">
            <el-select v-model="form.platformName" filterable placeholder="请选择" style="width: 370px">
              <el-option
                v-for="item in dict.project_platform"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <label class="el-form-item-label" width="80px">项目名称</label>
          <el-select
            style="width: 370px"
            v-model="form.projectId"
            @change="selectExitSelectConfig2"
            filterable
            remote
            placeholder="请选择项目名称"
          >
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
          <label class="el-form-item-label" width="80px">产品名称</label>
          <el-select
            style="width: 370px"
            v-model="form.productId"
            @change="selectExitSelectConfig3"
            filterable
            remote
            placeholder="请选择产品名称"
          >
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
            </el-col>
            <el-col :span="12">
          <label class="el-form-item-label" width="80px" >产品编号</label>

              <el-input v-model="form.productCode"  disabled="disabled" style="width: 370px;" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
          <el-form-item label="出厂编号">
            <el-input v-model="form.factoryCode" style="width: 370px;" />
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <el-form-item label="SRI列数">
            <el-input v-model="form.sri" style="width: 370px;"  @keyup.native="proving"/>
          </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="创建时间">
                <el-date-picker v-model="form.createTime" type="datetime" disabled="disabled" :default-value="new Date()" style="width: 366px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建人">
                <el-input v-model="form.createBy" style="width: 366px;" disabled="disabled" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="修改时间">
                <el-date-picker v-model="form.updateTime" type="datetime" disabled="disabled" style="width: 366px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="修改人">
                <el-input v-model="form.updateBy" disabled="disabled" style="width: 366px;" />
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
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="序号" />
        <!--        <el-table-column prop="platformId" label="项目平台id" />-->
        <el-table-column prop="platformName" label="项目平台">
          <template slot-scope="scope">
            {{ dict.label.project_platform[scope.row.platformName] }}
          </template>
        </el-table-column>

        <el-table-column prop="projectName" label="项目名称" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="sri" label="SRI列数" />
        <el-table-column prop="factoryCode" label="出厂编号" />
        <el-table-column  prop="检验详情" label="检验详情" >
          <template slot-scope="scope">
            <el-button  @click="checkDetails(scope.row)">查看详情</el-button>
          </template>>
        </el-table-column>


        <el-table-column v-if="checkPer(['admin','product:edit','product:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
    import crudProduct from '@/api/system/checkCard'
    import CRUD, { presenter, header, form, crud } from '../../../components/CheckCardCrud/crud'
    import rrOperation from '../../../components/CheckCardCrud/RR.operation'
    import crudOperation from '../../../components/CheckCardCrud/CRUD.operation'
    import udOperation from '../../../components/CheckCardCrud/UD.operation'
    import pagination from '../../../components/CheckCardCrud/Pagination'
    import {requestPost,urls} from '@/api/system/getpost'
    import {requestGet} from "../../../api/system/getpost";

    const defaultForm = { id: null, type:0, projectId: null,productId:null,sri:null, name: 'pc', platformId: null, platformName: null, productCode: null, factoryCode: null, uploadTime: null, createTime: null, createBy: null, updateTime: null, updateBy: null, state: null }
    export default {
        name: 'CheckCard',
        components: { pagination, crudOperation, rrOperation, udOperation },
        mixins: [presenter(), header(), form(defaultForm), crud()],
        dicts: ['project_platform'],
        cruds() {
            return CRUD({ title: '检验产品', url: 'api/checkCard', idField: 'id', sort: 'id,desc', crudMethod: { ...crudProduct }})
        },
        data() {
            return {
                // productType: localStorage.getItem('productType')?localStorage.getItem('productType'):0,
                show:false,
                show2:false,

                classObject1:{
                    background:'#ffdd80'
                },
                classObject2:{
                    background:''
                },
                classObject3:{
                    background:''
                },
                projectList:[],
                productList:[],
                data:{

                },
                page: {
                    // 页码
                    page: 0,
                    // 每页数据条数
                    size: 10,
                    // 总数据条数
                    total: 0
                },
                permission: {
                    add: ['admin', 'checkCard:add'],
                    edit: ['admin', 'checkCard:edit'],
                    del: ['admin', 'checkCard:del']
                },
                rules: {
                    type: [
                        { required: true, message: '0 电气 / 1 焊接 / 2机械不能为空', trigger: 'blur' }
                    ],
                    // name: [
                    //     { required: true, message: '产品名称不能为空', trigger: 'blur' }
                    // ],
                    platformName: [
                        { required: true, message: '项目平台名称不能为空', trigger: 'blur' }
                    ]
                },
                queryTypeOptions: [
                    { key: 'projectId', display_name: '项目id' },
                     // { key: 'name', display_name: '产品名称' },
                    { key: 'platformName', display_name: '项目平台名称' },
                    { key: 'productCode', display_name: '编号' },
                    { key: 'factoryCode', display_name: '出厂编号' }
                ]
            }
        },
        methods: {
            proving() {
                if(this.form.sri) {
                    this.form.sri = this.form.sri.replace(/[^\.\d]/g, '');
                    this.form.sri = this.form.sri.replace('.', '');
                }
            },
            selectproduct(param){

                if(param==0){
                    this.classObject1.background='#ffdd80';
                    this.classObject2.background='';
                    this.classObject3.background='';
                    this.query.type=0
                    this.productList=''
                    this.query.productId=''
                    this.query.projectId=''

                    localStorage.setItem('productType',  this.query.type)
                    this.selectExitSelectConfig()
                    this.crud.toQuery()
                }else if(param==1){
                    this.classObject1.background='';
                    this.classObject2.background='#ffdd80';
                    this.classObject3.background='';
                    this.query.type=1
                    this.productList=''
                    this.query.productId=''
                    this.query.projectId=''
                    this.query.platformName=''
                    localStorage.setItem('productType',  this.query.type)
                    this.selectExitSelectConfig()
                    this.crud.toQuery()
                }else {
                    this.classObject1.background='';
                    this.classObject2.background='';
                    this.classObject3.background='#ffdd80';
                    this.query.type=2
                    this.productList=''
                    this.query.productId=''
                    this.query.projectId=''
                    this.query.platformName=''
                    localStorage.setItem('productType',  this.query.type)
                    this.selectExitSelectConfig()
                    this.crud.toQuery()
                }

            },
            checkDetails(param){

                 this.$router.push({ name:'Details', query: { param: param }})
            },
            selectExitSelectConfig(){
                const formData = new FormData()
                formData.append('type', this.query.type)
                //查询项目
                requestPost(urls + 'product/selectAllProject',formData).then(result => {
                    this.projectList=result
                }).catch(() => {

                })
                this.query.productId=null
                //查询产品
                if(this.query.projectId!=null){
                    const formData = new FormData()
                    formData.append('projectId', this.query.projectId)
                    requestPost(urls + 'product/selectAllProduct',formData).then(result => {

                        this.productList=result

                    }).catch(() => {

                    })
                }
            },
            selectExitSelectConfig4(){

                //查询产品
                if(this.query.projectId!=null){
                    const formData = new FormData()
                    formData.append('projectId', this.query.projectId)
                    requestPost(urls + 'product/selectAllProduct',formData).then(result => {

                        this.productList=result

                    }).catch(() => {

                    })
                }
            },
            //查询弹窗产品
            selectExitSelectConfig2(){
               this.form.productId=null
                //查询产品
                if(this.form.projectId!=null){
                    const formData = new FormData()
                    formData.append('projectId', this.form.projectId)
                    requestPost(urls + 'product/selectAllProduct',formData).then(result => {
                        this.productList=result
                    }).catch(() => {

                    })
                }
            },
            selectExitSelectConfig3(){
                if(this.form.projectId!=null){
                    const formData = new FormData()
                    formData.append('projectId', this.form.projectId)
                    requestPost(urls + 'product/selectAllProduct',formData).then(result => {
                        this.productList=result
                    }).catch(() => {

                    })
                }
              if(this.form.productId!=null)  {
                  this.productList.forEach(item=>{
                      if(this.form.productId==item.id){
                          this.form.productCode=item.productCode
                          this.show2=true
                      }
                  })
              }
            },
            // 钩子：在获取表格数据之前执行，false 则代表不获取数据
            [CRUD.HOOK.beforeRefresh]() {
                return true
            }
        },
        mounted() {

            this.selectproduct(0)
            this.selectExitSelectConfig()
            this.selectExitSelectConfig2()
            this.selectExitSelectConfig3()
        }
    }
</script>

<style scoped>

</style>
