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
        <el-row>
          <el-col :span="6">
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
          <el-col :span="6">
        <label class="el-form-item-label">产品名称</label>
        <el-select
          v-model="query.productId"
          ref="select"
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
          <el-col :span="6" style="margin-top: 2px">
        <rrOperation :crud="crud" />
          </el-col>
        </el-row>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
        <el-dialog :visible.sync="bigger" width="400px" height="500px" >
          <el-row>

              <label class="el-form-item-label">项目名称</label>
              <el-select
                v-model="projectId"
                @change="selectExitSelectConfig2()"
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
          </el-row>
          <el-row>

              <label  class="el-form-item-label">产品名称</label>
              <el-select

                v-model="productId"
                @change="selectExitSelectConfig4()"
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
          </el-row>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="quxiao">取消</el-button>
            <el-button type="primary" @click="Tijiaokp">确认</el-button>
          </div>
        </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="projectId" label="项目id" v-if="show" />
        <el-table-column prop="project" label="项目名称" />
        <el-table-column prop="productId" label="产品id" v-if="show" />
        <el-table-column prop="product" label="产品名称" />
        <el-table-column  prop="复制卡片" label="复制卡片" >
          <template slot-scope="scope">
            <el-button  @click="copyCurd(scope)">复制卡片</el-button>
          </template>>
        </el-table-column>
        <el-table-column v-if="checkPer(['admin','checkCardTemplate:edit','checkCardTemplate:del'])" label="操作" width="150px" align="center">
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
    import crudCheckCardTemplate from '@/api/system/checkCardTemplate'
    import CRUD, { presenter, header, form, crud } from '../../../components/CheckCardTemplateCrud/crud'
    import rrOperation from '../../../components/CheckCardTemplateCrud/RR.operation'
    import crudOperation from '../../../components/CheckCardTemplateCrud/CRUD.operation'
    import udOperation from '../../../components/CheckCardTemplateCrud/UD.operation'
    import pagination from '../../../components/CheckCardTemplateCrud/Pagination'
    import {requestPost, urls} from '@/api/system/getpost'
    const defaultForm = { id: null, projectId: null,project:null, productId: null,product:null, name: null, type: 0, createTime: null, createBy: null, updateTime: null, updateBy: null, state: null }
    export default {
        name: 'CheckCardTemplate',
        components: { pagination, crudOperation, rrOperation, udOperation },
        mixins: [presenter(), header(), form(defaultForm), crud()],
        cruds() {
            return CRUD({ title: '/checkCardTemplate', url: 'api/checkCardTemplate', idField: 'id', sort: 'id,desc', crudMethod: { ...crudCheckCardTemplate }})
        },
        data() {
            return {
                show:false,

                bigger: false,
                param:'',
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
                productId:'',
                projectId:'',
                project:'',
                product:'',
                permission: {
                    add: ['admin', 'checkCardTemplate:add'],
                    edit: ['admin', 'checkCardTemplate:edit'],
                    del: ['admin', 'checkCardTemplate:del']
                },
                rules: {
                },
                queryTypeOptions: [
                    { key: 'projectId', display_name: '项目id' },
                    { key: 'productId', display_name: '产品id' }
                ]
            }
        },

        methods: {
            //切换类型
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
                    localStorage.setItem('productType',  this.query.type)
                    this.selectExitSelectConfig()
                    this.crud.toQuery()
                }

            },
            //查询弹窗产品
            selectExitSelectConfig2(){
                  this.productId=null
                //查询产品
                if(this.projectId!=null){
                    const formData = new FormData()
                    formData.append('projectId', this.projectId)
                    requestPost(urls + 'product/selectAllProduct',formData).then(result => {
                        this.productList=result

                    }).catch(() => {

                    })
                }
            },
            selectExitSelectConfig4(){
                if(this.projectId!=null){
                    const formData = new FormData()
                    formData.append('projectId', this.projectId)
                    requestPost(urls + 'product/selectAllProduct',formData).then(result => {
                        this.productList=result

                    }).catch(() => {

                    })
                }
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
            selectExitSelectConfig3(){
                if(this.query.projectId!=null){

                    const formData = new FormData()
                    formData.append('projectId', this.query.projectId)
                    requestPost(urls + 'product/selectAllProduct',formData).then(result => {
                        this.productList=result

                    }).catch(() => {

                    })
                }

            },

            copyCurd(param) {
             this.param=param
             this.bigger=true;
            },
            quxiao(){
                this.param=''
                this.bigger=false;
            },
            Tijiaokp(){
               const formData = new FormData()
                this.projectList.forEach(item=>{
                    if(item.id==this.projectId){
                        this.project=item.name
                    }
                })
                this.productList.forEach(item=>{
                    if(item.id==this.productId){
                        this.product=item.name
                    }
                })
                    formData.append('id', this.param.row.id)
                    formData.append('type', this.param.row.type)
                    formData.append('projectId', this.projectId)
                    formData.append('project', this.project)
                    formData.append('productId', this.productId)
                    formData.append('product', this.product)
                    formData.append('name', this.param.row.name)
                    formData.append('createBy', localStorage.getItem("username"))
                    formData.append('createTime',  new Date().getTime())
                    requestPost(urls + 'checkCardTemplate/InstCheckCard',formData).then(result => {
                        if(result.success==200){
                            this.$message.success("复制成功")
                            this.bigger=false
                            this.crud.toQuery()
                        }else{
                            this.$message.error(result.success)
                        }
                    }).catch(() => {

                    })

            },

            // 钩子：在获取表格数据之前执行，false 则代表不获取数据
            [CRUD.HOOK.beforeRefresh]() {
                return true
            }
        },
        mounted() {
            this.selectExitSelectConfig()
            this.selectproduct(0)
        }
    }
</script>

<style scoped>

</style>
