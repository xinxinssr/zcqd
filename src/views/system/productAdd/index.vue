<template>
  <div class="app-container">
    <div class="head-container">
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="danger" style="margin-right: 40px" @click="GoProduct">返回</el-button>
        <el-button type="primary" style="margin-right: 100px" @click="GoProduct2">确认</el-button>
      </div>
      <div style="margin-top: 20px">
        <el-row>
          <el-col :span="8">
            <label class="el-form-item-label" style="width: 100px">项目平台</label>

            <el-select v-model="platformName" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.project_platform"
                :key="item.id"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-col>
          <el-col :span="8">
            <label class="el-form-item-label" style="width: 100px">项目名称</label>
            <el-select v-model="projectName"  allow-create  default-first-option  filterable placeholder="请选择">
              <el-option
                v-for="item in projectList"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>

          </el-col>

        </el-row>
        <!--表格渲染-->
        <el-table ref="table" :data="data" size="small"   style="width: 100%;" :row-style="rowStyle">
          <el-table-column prop="name" label="产品名称">
            <template scope="scope" >

              <el-form :model="scope.row" :rules="rules" ref="scope.row">
                <el-form-item prop="name">
              <el-input size="small" v-model="scope.row.name" style="width: 200px;" placeholder="请输入产品名称"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="productCode" label="产品编号">
            <template scope="scope">
              <el-input size="small" v-model="scope.row.productCode" style="width: 200px;"
                        placeholder="请输入产品编号"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="productCode" label="产品规格">
            <template scope="scope">
              <el-input size="small" v-model="scope.row.specification" style="width: 200px;"
                        placeholder="请输入产品规格"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="195px" align="center">
            <template slot-scope="scope">
              <el-button type="danger" @click=" handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>

        <template>
          <el-button v-if="show2" style="margin-top:20px;margin-left: 48%" type="primary" @click=" handleAdd()">增加产品</el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
    import {requestPost, urls} from '@/api/system/getpost'

    export default {
        name: 'ProductAdd',
        dicts: ['project_platform'],
        data() {
            return {

                data: [],
                projectList:[],
                show: false,
                platformName: '',
                projectName: '',
                params: this.$route.query.param,
                show2:true,
                rules: {
                    name: [
                        {required: true, validator: this.checkName, trigger: 'blur'}
                    ],
                },
            }
        },

        methods: {
            rowStyle({row, rowIndex}) {
                if (row) {
                    if (rowIndex % 2 == 1) {
                        return {
                            backgroundColor: "rgba(235,251,255,1)"
                        }
                    } else {
                        return {
                            backgroundColor: "rgba(250,235,215,1)"
                        }
                    }
                }
            },
            //验证供应商名字
            checkName(rule, value, callback) {


                if (!value) {
                    return callback(new Error('名字不能为空'))
                } else {


                    if (this.data != null) {
                        for (let i = 0; i < this.data.length - 1; i++) {
                            for (let j = i + 1; j < this.data.length; j++) {
                                if (this.data[i].name == this.data[j].name) {
                                    return callback(new Error('该项目下产品不能重复'))
                                }
                            }
                        }

                    }
                    const formData = new FormData()
                    formData.append('projectName', this.projectName)
                    formData.append('productName', value)
                    // formData.append('platformName', this.platformName)
                    formData.append('type', localStorage.getItem("productType"))
                    requestPost(urls + 'product/selectProduct', formData).then(result => {

                        if (result.success != "error") {
                            return callback(new Error('该项目下该产品已存在'))

                        } else {
                            callback()
                        }
                    }).catch(() => {

                    })
                }

            },
            GoProduct() {
                this.$router.push({name: 'Product'})
            },
            GoProduct2() {
                if (this.data.length == 0) {
                    this.$router.push({name: 'Product'})
                } else {
                    if (this.params != null) {
                        if (this.params.id != null) {
                            const resListData = []
                            if (this.projectName == "") {
                                this.$message.error("请输入项目名称")
                            } else {
                                JSON.parse(JSON.stringify(this.data)).forEach(item => {
                                    var source = {
                                        'type': localStorage.getItem('productType'),
                                        'platformName': this.platformName,
                                        'projectName': this.projectName,
                                        'updateTime': new Date(),
                                        'updateBy': localStorage.getItem("username")
                                    }
                                    item = Object.assign(item, source)
                                    resListData.push(item)
                                })
                                requestPost(urls + 'product/update', JSON.parse(JSON.stringify(resListData))).then(result => {
                                    if (result.data != 0) {
                                        this.$router.push({name: 'Product'})
                                    } else {
                                        this.$message.error("添加失败")
                                    }

                                }).catch(() => {

                                })
                            }
                        }
                    } else {
                        const resListData = []
                        if (this.projectName == "") {
                            this.$message.error("请输入项目名称")
                        } else {
                            JSON.parse(JSON.stringify(this.data)).forEach(item => {
                                var source = {
                                    'type': localStorage.getItem('productType'),
                                    'platformName': this.platformName,
                                    'projectName': this.projectName,
                                    'createTime': new Date(),
                                    'createBy': localStorage.getItem("username")
                                }
                                item = Object.assign(item, source)
                                resListData.push(item)
                            })
                            requestPost(urls + 'product/insert', JSON.parse(JSON.stringify(resListData))).then(result => {
                                if (result.data != 0) {
                                    this.$router.push({name: 'Product'})
                                } else {
                                    this.$message.error("添加失败")
                                }

                            }).catch(() => {

                            })
                        }

                    }
                }
            },
            // 添加行
            handleAdd() {
                let row = {
                    name: '',
                    productCode: '',
                    factoryCode: '',
                    specification: '',
                }
                this.data.push(row)

            },
            // 删除行
            handleDelete(index, row) {
                this.data.splice(index, 1)


            },
            //页面加载
            LoadPage() {

                if (this.params != null) {
                    this.platformName = this.params.platformName
                    this.projectName = this.params.projectName
                    let row = {
                        id: this.params.id,
                        name: this.params.name,
                        productCode: this.params.productCode,
                        factoryCode: this.params.factoryCode,
                        specification: this.params.specification,
                    }
                    this.data.push(row)

                    if (this.params.id != null) {
                        this.show2 = false
                    }
                }
            },
            //查询已有的项目
            seleAllproject() {

                const formData = new FormData()
                formData.append('type', localStorage.getItem('productType'))
                //查询项目
                requestPost(urls + 'product/selectAllProject', formData
                ).then(result => {
                    this.projectList = result
                }).catch(() => {

                })
            }
        },

        mounted() {
            this.seleAllproject()
            this.LoadPage()
        }
    }
</script>

<style>

</style>
