<template>
  <div class="app-container">
    <div class="head-container">
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="danger" style="margin-right: 40px" @click="GoProduct">返回</el-button>
        <el-button type="primary" style="margin-right: 100px" @click="GoProduct2">确认</el-button>
      </div>
      <div style="margin-left:40px;margin-top: 20px">
        <!-- 搜索 -->
        <el-row>
          <el-col :span="9">
        <label class="el-form-item-label">项目名称</label>
        <el-select
          v-model="projectId"
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
            :disabled="disabled"
          />
        </el-select>
          </el-col>
          <el-col :span="9">
        <label class="el-form-item-label" >产品名称</label>
        <el-select
          ref="select"
          clearable
          v-model="productId"
          @change="selectExitSelectConfig2"
          filterable
          remote
          placeholder="请选择产品名称"
        >
          <el-option
            v-for="item in productList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            :disabled="disabled"
          />
        </el-select>
          </el-col>
<!--          <el-col :span="8">-->
<!--          <label class="el-form-item-label">产品名称</label>-->
<!--            <el-input v-model="name" style="width: 300px;" />-->
<!--          </el-col>-->
        </el-row>
        <template>

          <el-upload
            :show-file-list="false"
            ref="fileRefs"
            action="none"
            style="margin-left:78%"
            :auto-upload="true"
            accept=".xls,.xlsx"
            :http-request="upload"
          >
            <el-button
              class="filter-item"
              size="Max"
              style="width: 133px"
              type="primary"
              icon="el-icon-upload"
            >导入数据</el-button>
          </el-upload>
          <slot name="right" />
        </template>


                <el-table ref="table" :data="data" size="small" style="width: 100%;" :row-style="rowStyle" >
                  <el-table-column type="selection" v-if="show" width="55" />
                  <el-table-column prop="id" label="id"   v-if="show" />
                  <el-table-column prop="no" label="序号" >
                    <template scope="scope">
                      <el-input  size="small" v-model="scope.row.no" style="width: 200px; outline: none;"
                                placeholder="请输入序号"  type="number"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="process" label="工序说明" >
                  <template scope="scope">
                    <el-input size="small" v-model="scope.row.process" style="width: 200px;"
                              placeholder="请输入工序说明"></el-input>
                  </template>
                  </el-table-column>
                  <el-table-column prop="notice" label="注" >
                    <template scope="scope">
                      <el-input size="small" v-model="scope.row.notice" style="width: 200px;"
                                placeholder="请输入注"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ask" label="质量要求" >
                    <template scope="scope" >
                      <el-input v-if="scope.row.id!=undefined"  class="input2" size="small" v-model="scope.row.ask" style="width: 200px;"
                                placeholder="请输入质量要求" v-on:click.native="showRO(scope.row)"></el-input>
                      <el-input  v-if="scope.row.id==undefined"  size="small" v-model="scope.row.ask" style="width: 200px;"
                                  placeholder="请输入质量要求" ></el-input>
                    </template>

                  </el-table-column>
                  <el-table-column prop="checkMethod" label="检查方法" >
                    <template scope="scope">
                      <el-input size="small" v-model="scope.row.checkMethod" style="width: 200px;"
                                placeholder="请输入检查方法"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" >
                    <template scope="scope">
                      <el-input size="small" v-model="scope.row.remark" style="width: 200px;"
                                placeholder="请输入备注"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="195px" align="center">
                    <template slot-scope="scope">
                      <el-button type="danger" @click=" handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
        <template>
          <el-button  style="margin-top:20px;margin-left: 48%" type="primary" @click=" handleAdd()">增加产品</el-button>
        </template>

        <el-dialog :close-on-click-modal="false" :before-close="cancelCU" :visible.sync="bigger" title="质量要求" width="1000px">
          <el-form ref="form" :model="form"  size="small" label-width="100px">
            <el-form-item label="自增id" v-if="show">
              <el-input v-model="form.id" style="width: 370px;" />
            </el-form-item>

            <el-form-item label="检验卡片模板" prop="pid">
              <el-input v-model="form.name" style="width: 370px;" disabled="disabled" />
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
                  <el-input v-model="form.no" style="width: 370px;" disabled="disabled" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工序说明">
                  <el-input v-model="form.process" style="width: 370px;" disabled="disabled" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="注">
                  <el-input v-model="form.notice" style="width: 370px;" disabled="disabled" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="质量要求">
                  <el-input v-model="form.ask" style="width: 370px;"   />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="检查方法">
                  <el-input v-model="form.checkMethod" style="width: 370px;" disabled="disabled" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注">
                  <el-input v-model="form.remark" style="width: 370px;" disabled="disabled" />
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
            <el-form-item label="质量要求文件" v-if="form.accessory.length!=0">
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
            <el-button  type="primary" @click="submitCU">确认</el-button>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="bigger2" width="600px" height="800px" >
          <img :src="img+img_path" width="100%">
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
    import {requestPost, urls} from '@/api/system/getpost'
    import {requestFile} from "../../../api/system/getpost";
    const form = {accessory:[],pictures:[]}
    export default {
        name: 'CheckCardTemplateAdd',
        data() {
            return {
                data:[],
                show:false,
                bigger2:false,
                bigger:false,
                img_path: '',
                img: 'http://127.0.0.1:8085/zc/',
                disabled:false,
                form:{
                    accessory:[],
                    pictures:[]
                },
                pictures:[],
                projectId:'',
                project:'',
                productId:'',
                product:'',
                name:'',
                projectList:[],
                productList:[],
                params: this.$route.query.param? this.$route.query.param:'',

            }
        },
        watch: {
            'projectId': function (newValue, oldValue) {

            }
            },

        methods: {
            check(param){
                this.bigger2 = true,
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
            cancelCU(){
                this.pictures=[]
                this.$refs.upload.clearFiles();
                this.bigger=false;
            },
            submitCU(){

               this.form.updateBy=localStorage.getItem("username")
                requestPost(urls + 'checkTemplate/checkTemplateEdit',JSON.parse(JSON.stringify(this.form))).then(result => {
                    this.selectCheckTemplate()
                   this.$message.success("上传成功")
                }).catch(() => {

                })
                this.pictures=[]
                this.$refs.upload.clearFiles();
                this.bigger=false;

            },
            //表格颜色
            rowStyle({row,rowIndex}){
                if(row){
                    if(rowIndex%2==1){
                    return{
                        backgroundColor:"rgba(235,251,255,1)"
                    }
                    }else {
                        return{
                            backgroundColor:"rgba(250,235,215,1)"
                        }
                    }
                }
            },

            selectExitSelectConfig(){
                const formData = new FormData()
                formData.append('type', localStorage.getItem('productType'))

                //查询项目
                requestPost(urls + 'product/selectAllProject',formData).then(result => {
                    this.projectList=result

                }).catch(() => {

                })
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
                this.selectCheckTemplate()
            },
            selectExitSelectConfig2(){
                if(this.projectId!=null){
                    const formData = new FormData()
                    formData.append('projectId', this.projectId)
                    requestPost(urls + 'product/selectAllProduct',formData).then(result => {
                        this.productList=result

                    }).catch(() => {

                    })
                }
                this.selectCheckTemplate()
            },
            //导入
            upload(val){

                if(this.projectId==''){
                    this.$message.info("请先选择项目")
                    return
                }
                if(this.productId==''){
                    this.$message.info("请先选择产品")
                    return
                }
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

                let formData = new FormData();
                formData.append("file", val.file);
                formData.append("projectId", this.projectId);
                formData.append("project", this.project);
                formData.append("productId", this.productId);
                formData.append("product", this.product);
                formData.append("name", val.file.name);
                formData.append("type", localStorage.getItem("productType"));
                formData.append("createTime", new Date().getTime());
                formData.append("createBy", localStorage.getItem("username"));
                requestPost(urls + 'checkCardTemplate/checkTemplateUpload', formData).then(result => {

                    this.$message.success("导入成功")
                    this.selectCheckTemplate()
                }).catch(() => {
                    this.$message.error("导入失败")
                })

            },
            //返回
            GoProduct(){
                this.$router.push({name: 'CheckCardTemplate'})
            },
            //提交
            GoProduct2(){
                if(this.projectId==''){
                    this.$message.info("请先选择项目")
                    return
                }
                if(this.productId==''){
                    this.$message.info("请先选择产品")
                    return
                }
                let  index=1
              this.data.forEach(item=>{
                  if(!item.no){
                      this.$message.info("请先填写序号")
                      index=2
                       return
                  }
                  if(!item.process){
                      this.$message.info("请先填写工序说明")
                      index=2
                      return
                  }

              })
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

                if(index==1){
                var source = {
                    'projectId':this.projectId,
                    'project':this.project,
                    'productId':this.productId,
                    'product':this.product,
                    'type': localStorage.getItem('productType'),
                    'createTime': new Date().getTime(),
                    'createBy': localStorage.getItem("username"),
                    'checkTemplateList':this.data,
                }

                requestPost(urls + 'checkCardTemplate/insertCheckCard',JSON.parse(JSON.stringify(source))).then(result =>
                {
                    if(result.success=="执行成功"){

                        this.selectCheckTemplate()
                        this.$message.success(result.success)
                        //this.$router.push({name: 'CheckCardTemplate'})
                    }else {
                        this.$message.error("执行失败")
                    }

                }).catch(() => {

                })
                }

            },
            //查询
            selectCheckTemplate(){

                if (this.params != '') {
                    this.projectId = this.params.projectId
                    this.productId = this.params.productId
                    this.disabled = true
                }

             if(this.projectId!=undefined&&this.productId!=undefined&&this.projectId!=''&&this.productId!=''){

                 let formData = new FormData();
                 formData.append("projectId", this.projectId);
                 formData.append("productId", this.productId);
                 formData.append("type",localStorage.getItem("productType"))
                 requestPost(urls + 'checkCardTemplate/selectCheckTemplate', formData).then(result => {
                    this.data=result

                 }).catch(() => {

                 })
             }
           },
            //添加行
            handleAdd() {
                if(this.projectId==''){
                    this.$message.info("请先选择项目")
                    return
                }
                if(this.productId==''){
                    this.$message.info("请先选择产品")
                    return
                }
                let row = {
                    no: '',
                    process: '',
                    notice: '',
                    ask: '',
                    checkMethod:'',
                    remark:'',

                }
                this.data.push(row)

            },
            // 删除行
            handleDelete(index, row) {
                if(row.id==null){
                this.data.splice(index, 1)
                }else {
                    const formData = new FormData()
                    formData.append('id',row.id)
                    requestPost(urls + 'checkTemplate/deleteCardTemplate',formData ).then(result => {
                        if(result.success=="删除成功"){
                            this.$message.success(result.success)
                            this.data.splice(index, 1)
                        }else {
                            this.$message.error("删除失败")
                        }

                    }).catch(() => {

                    })
                }

            },
            //上传图片
            uploadFile(file) {
                const formData = new FormData()
                formData.append("file", file.file)
                formData.append("type", "1")

                requestFile(urls + 'upload/upload', formData).then(result => {

                    this.img_path = result.dbPath;
                    this.pictures.push(this.img_path)
                    this.form.pictures=this.pictures

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
            showRO(param){
                // this.form=param
                const formData = new FormData()
                formData.append('id', param.id)
                requestPost(urls + 'checkCardTemplate/findCheckTemplate',formData).then(result => {
                this.form=result
                }).catch(() => {

                })


              this.bigger=true
            },
        },

        mounted() {
            this.selectCheckTemplate()
            this.selectExitSelectConfig()

        }
    }
</script>

<style >
  .upload-demo3{
    position: absolute;
    display: inline-block;
    padding-left: 5px;

  }
  .input2 /deep/.el-input__inner{
    color: #00a0e9 !important;
    text-decoration: underline;
  }
</style>
