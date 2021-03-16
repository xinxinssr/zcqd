<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->

      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="text" style="margin-right: 40px" @click="GoSupplier">取消</el-button>
        <el-button type="primary" style="margin-right: 100px" @click="GoSupplier">确认</el-button>
      </div>
      <el-dialog :visible.sync="bigger" width="600px" height="800px" >
        <img :src="img+img_path" width="100%">
      </el-dialog>
      <el-dialog :visible.sync="bigger2" width="900px">
        <el-form ref="form" :rules="rules" size="small" label-width="100px">
          <el-form-item label="证书类型" prop="typeId">
            <el-select v-model="typeId" style="width: 370px;" placeholder="请选择">
              <el-option v-for="item in typeArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证书名称" prop="name">
            <el-input v-model="name" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="选择照片">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              ref="upload"
              accept="image/*"
              :limit="1"
              :http-request="uploadFile"
            >
              <div class="logo_upload_xuan">
                <i slot="default" class="el-icon-circle-plus-outline"></i>
                <span>选择图片</span>
              </div>
            </el-upload>
            <div class="logo_img">
              <div v-if="isHidden" class="logo_img_title"></div>
              <img v-else :src="img+img_path" style="width: 300px; height: 450px"/>
            </div>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="生效时间">
                <el-date-picker v-model="startTime" type="datetime" style="width: 300px;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="到期时间">
                <el-date-picker v-model="endTime" type="datetime" style="width: 300px;"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="quxiao">取消</el-button>
          <el-button type="primary" @click="Tijiaozs">确认</el-button>
        </div>
      </el-dialog>
      <el-form ref="form" :model="from" size="small" label-width="100px">
        <el-form-item label="ID" v-show="show">
          <el-input v-model="from.id" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="供应商名称">
          <el-input v-model="from.name" style="width: 570px;" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="提供产品名称/范围">
          <el-input v-model="from.productScope" style="width: 570px;" disabled="disabled"/>
        </el-form-item>


        <el-form-item label="质量体系证书">
          <el-table style="width: 75%;" size="small" :data="table1">
            <el-table-column prop="id" label="自增id" v-if="show"/>
            <el-table-column prop="name" label="证书名称"/>
            <el-table-column prop="startTime" label="生效时间"/>
            <el-table-column prop="endTime" label="到期时间">
              <template  slot-scope="scope">
                <span style="color: red" v-if="scope.row.endTime.indexOf('即将到期')!=-1 || scope.row.endTime.indexOf('已经到期')!=-1 ">{{scope.row.endTime}}</span>
                <span  v-else>{{scope.row.endTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250px" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="check(scope.row.path)">查看</el-button>
                <el-button type="primary" @click="update(scope.row)">编辑</el-button>
                <el-button type="danger" @click="del(scope.row.id)">删除</el-button>

              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="代理证书">
          <el-table style="width: 75%;" size="small" :data="table2">
            <el-table-column prop="id" label="自增id" v-if="show"/>
            <el-table-column prop="name" label="证书名称"/>
            <el-table-column prop="startTime" label="生效时间"/>
            <el-table-column prop="endTime"  label="到期时间">
              <template  slot-scope="scope">
                <span style="color: red" v-if="scope.row.endTime.indexOf('即将到期')!=-1 || scope.row.endTime.indexOf('已经到期')!=-1 ">{{scope.row.endTime}}</span>
                <span  v-else>{{scope.row.endTime}}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="250px" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="check(scope.row.path)">查看</el-button>
                <el-button type="primary" @click="update(scope.row)">编辑</el-button>
                <el-button type="danger" @click="del(scope.row.id)">删除</el-button>

              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="供方联系人">
              <el-input v-model="from.supplierBy" style="width: 570px;" disabled="disabled"/>
            </el-form-item>

          </el-col>
          <el-col :span="10">
            <el-form-item label="联系电话">
              <el-input v-model="from.supplierPhone" style="width:570px;" disabled="disabled"/>
            </el-form-item>
<!--            <el-form-item label="联系地址">-->
<!--              <el-input v-model="from.supplierAddres" style="width: 570px;" disabled="disabled"/>-->
<!--            </el-form-item>-->
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="warning" style="margin:30px 40px" @click="addZs">添加证书</el-button>

      </div>

    </div>

  </div>

</template>

<script>
    import {requestPost, requestFile, urls} from '@/api/system/getpost'
    import {formatDate, formatTime} from "../../../utils/date";

    export default {
        name: 'Certificate',
        data() {
            return {
                id: this.$route.query.id,
                Cid: '',
                img_path: '',
                img: 'http://127.0.0.1:8085/zc/',
                typeId: '',
                typeName: '',
                name: '',
                uploadTime: '',
                creatBy: '',
                startTime: '',
                endTime: '',
                creatTime: '',
                updateTime:'',
                show: false,
                showTime:false,
                showTime2:true,
                from: {},
                table: {},
                table1: [],
                table2: [],
                bigger: false,
                bigger2: false,
                msg: {
                    type: String,
                    default: '确定删除本条数据吗？'
                },
                isHidden: true,
                normal: '',
                typeArr: [
                    {value: '1', label: '质量体系证书'},
                    {value: '2', label: '代理证书'}
                ],
                rules: {
                    name: [
                        {required: true, validator: this.checkName, trigger: 'blur'}
                    ],
                    typeId: [
                        {required: true, validator: this.checkTypeId, trigger: 'blur'}
                    ]
                }
            }
        },

        methods: {
            //检查证书类型是否为空
            checkTypeId(rule, value, callback) {
                if (!this.typeId) {
                    return callback(new Error('证书类型不能为空'))
                }
            },
            //检查证书名字是否为空
            checkName(rule, value, callback) {
                if (!this.name) {
                    return callback(new Error('证书名称不能为空'))
                }
            },
            //根据id查询数据
            selectById() {
                this.table1 = []
                this.table2 = []
                const formData = new FormData()
                formData.append('id', this.id)
                //查询供应商信息
                requestPost(urls + 'supplier/selectById', formData).then(result => {
                    this.from = result
                }).catch(() => {

                })
                //查询证书信息
                requestPost(urls + 'supplier/findBySId', formData).then(result => {
                    this.table = result.content
                    this.table.forEach(item => {
                        if (item.startTime != null) {
                            item.startTime = formatDate(item.startTime, 'yyyy-MM-dd hh:mm')
                        }
                        if (item.endTime != null) {
                            let nowtime=new Date().getTime()
                            if(item.endTime-nowtime < 3*86400000&&item.endTime-nowtime >0){
                             item.endTime = formatDate(item.endTime, 'yyyy-MM-dd hh:mm')+"(即将到期)"

                            }else if(item.endTime-nowtime <= 0 ){
                                item.endTime = formatDate(item.endTime, 'yyyy-MM-dd hh:mm')+"(已经到期)"
                            }else{
                                item.endTime = formatDate(item.endTime, 'yyyy-MM-dd hh:mm')

                            }

                        }
                        if (item.typeId == 1) {
                            this.table1.push(item)
                        } else {
                            this.table2.push(item)
                        }
                    })

                }).catch(() => {

                })

            },
            //确认取消按钮，返回之前页面
            GoSupplier() {
                this.$router.push({name: 'Supplier'})
            },
            //取消上传
            quxiao() {
                this.bigger2 = false

            },
            //上传图片
            uploadFile(file) {
                const formData = new FormData()
                formData.append("file", file.file)
                formData.append("type", "1")
                //查询供应商信息
                requestFile(urls + 'upload/upload', formData).then(result => {
                    this.img_path = result.dbPath;
                    this.isHidden = false;
                }).catch(() => {

                })
            },
            //查看证书
            check(path) {
                this.bigger = true,
                 this.img_path = path
            },
            //删除证书
            del(id) {
                this.$confirm('确定要删除证书吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //点击确定的操作(调用接口)
                    const formData = new FormData()
                    formData.append('id', id)
                    //查询供应商信息
                    requestPost(urls + 'supplier/delCertificate', formData).then(result => {
                        if (result == 1) {
                            this.$message.success("删除成功")
                            this.selectById()
                        } else {
                            this.$message.error("删除失败")
                        }
                    }).catch(() => {

                    })
                }).catch(() => {
                    //几点取消的提示
                });

            },
            //添加证书
            addZs() {
                if (this.$refs.upload != null) {
                    this.$nextTick(() => {
                        this.$refs.upload.clearFiles();
                    })
                }
                this.img_path = ''
                this.startTime = ''
                this.endTime = ''
                this.name = ''
                this.typeId = ''
                this.Cid =''
                this.isHidden = true
                this.bigger2 = true
            },

            //编辑证书信息
            update(param) {

                this.Cid = param.id
                this.name = param.name
                this.img_path = param.path
                this.startTime = param.startTime
                this.typeId=param.typeName
                this.typeName=param.typeName
                this.bigger2 = true
                this.isHidden = false
                this.endTime = param.endTime.substring(0,16)

            },

            //提交证书信息
            Tijiaozs() {
                if(!this.Cid){
                if (!this.name) {
                    this.$message.info("证书名称不能为空")
                } else if (!this.typeId) {
                    this.$message.info("证书类别不能为空")
                } else if (!this.startTime || !this.endTime) {
                    this.$message.info("生效时间和到期时间不能为空")
                } else {
                    if (this.typeId == 1) {
                        this.typeName = '质量体系证书'
                    } else {
                        this.typeName = '代理证书'
                    }
                    this.uploadTime = formatTime(new Date())
                    this.creatTime = formatTime(new Date())
                    this.startTime = formatTime(this.startTime)
                    this.endTime = formatTime(this.endTime)

                    const formData = new FormData()
                    formData.append('supplierId', this.id)
                    formData.append('name', this.name)
                    formData.append('path', this.img_path)
                    formData.append('typeId', this.typeId)
                    formData.append('typeName', this.typeName)
                    formData.append('startTime', this.startTime)
                    formData.append('endTime', this.endTime)
                    formData.append('uploadTime', this.uploadTime)
                    formData.append('creatTime', this.creatTime)
                    formData.append('creatBy', localStorage.getItem("username"))
                    //查询供应商信息
                    requestPost(urls + 'certificate/InstCertificate', formData).then(result => {
                        if (result == 1) {
                            this.$message.success("提交成功")
                            this.bigger2 = false
                            this.selectById()
                        } else {
                            this.$message.error("提交失败")
                        }
                    }).catch(() => {

                    })
                }
                }else {

                        this.uploadTime=formatTime(new Date())
                        this.uploadTime=formatTime(new Date())
                    if(this.typeId=="质量体系证书"||this.typeId==1){
                        this.typeId=1
                        this.typeName='质量体系证书'
                    }else {
                        this.typeId=2
                        this.typeName='代理证书'
                    }
                    this.startTime=new Date(this.startTime).getTime();
                    this.endTime=new Date(this.endTime).getTime();

                        const formData = new FormData()
                        formData.append('Id', this.Cid)
                        formData.append('name',this.name)
                        formData.append('path',this.img_path)
                        formData.append('typeId',this.typeId)
                        formData.append('typeName',this.typeName)
                        formData.append('startTime',this.startTime)
                        formData.append('endTime',this.endTime)
                        formData.append('uploadTime',this.uploadTime)
                        formData.append('updateTime',this.uploadTime)
                        formData.append('updateBy',localStorage.getItem("username"))
                        //查询供应商信息
                        requestPost(urls + 'certificate/UpdateCertificate', formData).then(result => {
                            if(result==1){
                                this.$message.success("修改成功")
                                this.bigger2=false
                                this.selectById()
                            }else {
                                this.$message.error("修改失败")
                            }
                        }).catch(() => {

                        })
                }

            },



        },

        mounted() {
            this.selectById()

        }
    }
</script>

<style lang="scss">
  .relese_nameP {
    display: flex;

    .logo_upload {
      .logo_upload_xuan {
        width: 250px;
        height: 30px;
        border: 2px solid #DCDFE6;
        display: flex;
        justify-content: center;

        i {
          font-size: 20px;
          color: #666;
          margin: 5px 0;
        }

        span {
          color: #666;
          line-height: 30px;
          margin-left: 10px;
        }
      }

      .logo_img {
        width: 250px;
        height: 250px;
        border: 4px dashed #DCDFE6;
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        img {
          width: 250px;
          height: 250px;
          display: block;
        }
      }
    }
  }
</style>
