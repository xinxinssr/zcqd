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
      <el-dialog :visible.sync="bigger" width="600px" height="800px" >
        <img :src="img+img_path" width="100%">
      </el-dialog>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="1000px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
          <el-form-item label="自增id" v-if="show">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>

          <el-form-item label="检验卡片模板" prop="pid">
            <el-select
              style="width: 500px;"
              v-model="form.pid"
              @change="selectExitSelectConfig2"
              filterable
              remote
              placeholder="请选择产品名称"
            >
              <el-option
                v-for="item in checkCardList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="12">
          <el-form-item label="项目名称" >
            <el-input v-model="form.project" style="width: 370px;" disabled="disabled" />
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <el-form-item label="产品名称" >
            <el-input v-model="form.product" style="width: 370px;"  disabled="disabled" />
          </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
          <el-form-item label="序号">
            <el-input v-model="form.no" style="width: 370px;" @keyup.native="proving" />
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <el-form-item label="工序说明">
            <el-input v-model="form.process" style="width: 370px;" />
          </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
          <el-form-item label="注">
            <el-input v-model="form.notice" style="width: 370px;" />
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <el-form-item label="质量要求">
            <el-input v-model="form.ask" style="width: 370px;" />
          </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
          <el-form-item label="检查方法">
            <el-input v-model="form.checkMethod" style="width: 370px;" />
          </el-form-item>
            </el-col>
              <el-col :span="12">
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width: 370px;" />
          </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="图片" v-if="show">
              <el-input v-model="form.pictures" style="width: 370px;" />
            </el-form-item>
            <el-form-item prop="pictures" label="要求文件">
              <el-upload
                ref="upload"
                action="https://jsonplaceholder.typicode.com/posts/"
                :multiple = true
                list-type="picture-card"
                :with-credentials='true'
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-error="handleError"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadFile"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="form.dialogVisible">
                <img width="100%" :src="form.dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>

          </el-row>
          <el-form-item label="质量要求文件"v-if="form.accessory.length!=0">
            <el-table style="width: 75%;" size="small" :data="form.accessory">
              <el-table-column prop="id" label="自增"  v-if="show"/>
              <el-table-column prop="name" label="文件名称"/>
              <el-table-column prop="uploadTime" label="上传时间"/>
              <el-table-column prop="uploadBy" label="上传人"/>
              <el-table-column label="操作" width="250px" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="check(scope.row.path)">查看</el-button>
                  <el-button type="danger" @click="del(scope.row.id)">删除</el-button>

                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" >

          <el-button type="text" @click="cancelCU" >取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="自增id" v-if="show"/>
        <el-table-column prop="no" label="序号" />
        <el-table-column prop="project" label="项目名称" />
        <el-table-column prop="product" label="产品名称" />


        <el-table-column v-if="checkPer(['admin','checkTemplate:edit','checkTemplate:del'])" label="操作" width="150px" align="center">
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
    import crudCheckTemplate from '@/api/system/checkTemplate'
    import CRUD, { presenter, header, form, crud } from '../../../components/CheckTemplateCrud/crud'
    import rrOperation from '../../../components/CheckTemplateCrud/RR.operation'
    import crudOperation from '../../../components/CheckTemplateCrud/CRUD.operation'
    import udOperation from '../../../components/CheckTemplateCrud/UD.operation'
    import pagination from '../../../components/CheckTemplateCrud/Pagination'
    import {requestPost, urls} from '@/api/system/getpost'
    import {requestFile} from "../../../api/system/getpost";
    const defaultForm = { id: null,type:0,projectId:null, productId:null,pid: null, no: null, process: null, notice: null, ask: null, checkMethod: null, remark: null,pictures:[],project:null,product:null,dialogImageUrl:'',dialogVisible:false,accessory:[]}
    export default {
        name: 'CheckTemplate',
        components: { pagination, crudOperation, rrOperation, udOperation },
        mixins: [presenter(), header(), form(defaultForm), crud()],
        cruds() {
            return CRUD({ title: '/检验标准', url: 'api/checkTemplate', idField: 'id', sort: 'id,desc', crudMethod: { ...crudCheckTemplate }})
        },
        data() {
            return {
                show:false,
                show2:false,
                upload:this.$refs.upload,
                bigger:false,
                img_path: '',
                img: 'http://127.0.0.1:8085/zc/',
                isHidden: true,
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
                checkCardList:[],
                permission: {
                    add: ['admin', 'checkTemplate:add'],
                    edit: ['admin', 'checkTemplate:edit'],
                    del: ['admin', 'checkTemplate:del']
                },
                rules: {
                    pid: [
                        {required: true, message: '检验卡片不能为空', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            cancelCU(){

                this.$refs.upload.clearFiles();
                this.crud.cancelCU()
            },
            submitCU(){
                this.$refs.upload.clearFiles();
                this.crud.submitCU()
            },
            check(param){
                this.bigger = true,
                this.img_path = param
            },
            del(param){
                const formData = new FormData()

                formData.append('id', param)
                //查询项目
                requestPost(urls + 'checkTemplate/deleteCheckTemplate',formData).then(result => {
                     this.form.accessory.some((item,i)=>{
                         if(item.id==param){
                             this.form.accessory.splice(i,1)
                           return true
                         }
                     })
                    this.$message.success("删除成功")
                }).catch(() => {

                })
            },
            proving() {
                if(this.form.no){
                this.form.no =this.form.no.replace(/[^\.\d]/g,'');
                this.form.no  = this.form.no.replace('.','');
                }
            },
            //切换类型
            selectproduct(param){

                if(param==0){

                    if(this.$refs.upload){
                    this.$refs.upload.clearFiles();
                    }
                    this.classObject1.background='#ffdd80';
                    this.classObject2.background='';
                    this.classObject3.background='';
                    this.query.type=0
                    this.productList=''
                    this.query.productId=''
                    this.query.projectId=''
                    this.form.pid=''
                    this.form.project=''
                    this.form.product=''
                    localStorage.setItem('productType',  this.query.type)
                    this.selectExitSelectConfig()
                    this.selectCheckCardTemplate()
                    this.crud.toQuery()

                }else if(param==1){
                    if(this.$refs.upload) {
                        this.$refs.upload.clearFiles();
                    }
                    this.classObject1.background='';
                    this.classObject2.background='#ffdd80';
                    this.classObject3.background='';
                    this.query.type=1
                    this.productList=''
                    this.query.productId=''
                    this.query.projectId=''
                    this.form.pid=''
                    this.form.project=''
                    this.form.product=''
                    localStorage.setItem('productType',  this.query.type)
                    this.selectExitSelectConfig()
                    this.selectCheckCardTemplate()
                    this.crud.toQuery()
                }else {
                    if(this.$refs.upload) {
                        this.$refs.upload.clearFiles();
                    }
                    this.classObject1.background='';
                    this.classObject2.background='';
                    this.classObject3.background='#ffdd80';
                    this.query.type=2
                    this.productList=''
                    this.query.productId=''
                    this.query.projectId=''
                    this.form.pid=''
                    this.form.project=''
                    this.form.product=''
                    localStorage.setItem('productType',  this.query.type)
                    this.selectCheckCardTemplate()
                    this.selectExitSelectConfig()
                    this.crud.toQuery()
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
            //查询检查模板
            selectCheckCardTemplate(){
                const formData = new FormData()
                formData.append('type',  this.query.type)
                requestPost(urls + 'checkTemplate/selectCheckCardTemplate',formData).then(result => {
                   this.checkCardList=result

                }).catch(() => {

                })
            },
            //根据pid给project product赋值
            selectExitSelectConfig2(){
                this.checkCardList.forEach(item=>{
                    if(this.form.pid==item.id){
                        this.form.project=item.project
                        this.form.product=item.product

                    }
             })

            },
            //上传图片
            uploadFile(file) {
                const formData = new FormData()
                formData.append("file", file.file)
                formData.append("type", "1")
                //查询供应商信息
                requestFile(urls + 'upload/upload', formData).then(result => {

                    this.img_path = result.dbPath;
                    this.form.pictures.push( this.img_path)

                }).catch(() => {

                })
            },
            //上传图片
            handleRemove(file, fileList) {//移除
                // console.log(file, fileList);
            },
            handlePictureCardPreview(file) {//预览
                // console.log(file)
                this.form.dialogImageUrl = file.url;
                this.form.dialogVisible = true;
            },
            handleError(err, file, fileList){//上传失败
                // console.log(err)
            },
            beforeAvatarUpload(file) {//文件上传之前调用做一些拦截限制
                // console.log(file);
                const isJPG = true;
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            // handleAvatarSuccess(res, file) {//图片上传成功
            //     var files = res.data.file;
            //     console.log(files+"1111111111")
            //     this.form.pictures.push(files)
            //     this.dialogImageUrl = this.IMAGE_URL + '/image/' + res.data.file;
            // },


            // 钩子：在获取表格数据之前执行，false 则代表不获取数据
            [CRUD.HOOK.beforeRefresh]() {
                return true
            }
        },
        mounted() {
            this.selectCheckCardTemplate()
            this.selectExitSelectConfig()
            this.selectproduct(0)
        }
    }
</script>

<style scoped>

</style>
