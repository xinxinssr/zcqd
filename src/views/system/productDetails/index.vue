<template>
  <div class="app-container">
    <div class="head-container">
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="text" style="margin-right: 40px" @click="GoProduct">取消</el-button>
        <el-button type="primary" style="margin-right: 100px" @click="GoProduct">确认</el-button>
      </div>
      <div style="margin-top: 20px">
        <el-row>
          <el-col :span="8">
            <label class="el-form-item-label" style="width: 100px">项目平台</label>
            <el-input v-model="platformName" disabled="disabled" placeholder="项目平台" style="width: 205px;"
                      class="filter-item"/>

          </el-col>
          <el-col :span="8">
            <label class="el-form-item-label" style="width: 100px">项目名称</label>
            <el-input v-model="projectName" disabled="disabled" placeholder="项目名称" style="width: 205px;"
                      class="filter-item"/>
          </el-col>
          <el-col :span="8">
            <label class="el-form-item-label" style="width: 100px">产品名称</label>
            <el-input v-model="productName" disabled="disabled" placeholder="产品名称" style="width: 205px;"
                      class="filter-item"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <label class="el-form-item-label" style="width: 100px">出厂编号</label>
            <el-input v-model="factoryCode" disabled="disabled" placeholder="出厂编号" style="width: 205px;"
                      class="filter-item"/>
          </el-col>
          <el-col :span="8">
            <label class="el-form-item-label" style="width: 100px">SRI列数</label>
            <el-input v-model="sri" disabled="disabled" placeholder="SRI列数" style="width: 205px;" class="filter-item"/>
          </el-col>
          <el-col :span="8">

          </el-col>
        </el-row>

        <el-form ref="form" size="small" label-width="100px" >
          <el-form-item label="涉及供应商" v-if="show3" >
            <el-table style="width: 75%;" size="small" :data="table3" border="true" :row-style="rowStyle">
              <el-table-column prop="id" label="自增id" v-if="show"/>
              <el-table-column prop="type" label="类别"/>
              <el-table-column prop="supplierName" label="供应商名称"/>
              <el-table-column prop="supplierPhone" label="供应商手机号"/>

            </el-table>
          </el-form-item>
          <el-form-item label="涉及产品" v-if="show1" >
            <el-table style="width: 75%;" size="small" :data="table1" border="true" :row-style="rowStyle">
              <el-table-column prop="id" label="自增id" v-if="show"/>
              <el-table-column prop="type" label="类别"/>
              <el-table-column prop="product2" label="产品名称"/>
              <el-table-column prop="sri" label="sri列数"/>
              <el-table-column prop="factoryCode" label="出厂编号"/>
            </el-table>
          </el-form-item>
          <el-form-item label="涉及原材料" v-if="show2">
            <el-table style="width: 75%;" size="small" :data="table2" border="true" :row-style="rowStyle">
              <el-table-column prop="id" label="自增id" v-if="show"/>
              <el-table-column prop="materiaName" label="原材料名称"/>
              <el-table-column prop="batchNumber" label="批次"/>
              <el-table-column prop="number" label="数量"/>
            </el-table>
          </el-form-item>

          <el-form-item label="检查项">
            <el-table ref="table" :data="table" size="small" style="width: 96%;" :row-style="rowStyle">
              <!--          <el-table-column type="selection" v-if="show" width="55" />-->
              <el-table-column prop="no" label="序号"/>
              <el-table-column prop="process" label="工序说明"/>
              <el-table-column prop="notice" label="注"/>
              <el-table-column prop="ask" label="质量要求"/>
              <el-table-column prop="check_by" label="检查人"/>
              <el-table-column prop="check_time" label="检查日期"/>
              <el-table-column prop="is_good" label="结果"/>
              <el-table-column prop="is_unqualified" label="不合格项"/>
              <el-table-column prop="remark" label="备注"/>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
    import {requestPost, urls} from '@/api/system/getpost'
    import {formatDate} from "../../../utils/date";

    export default {
        name: 'Details',

        data() {
            return {
                table: [],
                table1: [],
                table2: [],
                table3: [],
                params: this.$route.query.param,
                show: false,
                show1:false,
                show2:false,
                show3:false,
                platformName: '',
                productName: '',
                projectName: '',
                factoryCode: '',
                sri: '',
                pid: ''

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
            GoProduct() {
                this.$router.push({name: 'CheckCard'})
            },
            selectPage() {
                if (this.params != null) {
                    this.platformName = this.params.platformName
                    this.productName = this.params.productName
                    this.projectName = this.params.projectName
                    this.factoryCode = this.params.factory_code
                    this.sri = this.params.sri
                }
                this.pid = this.params.id
                const formData = new FormData()
                formData.append('pid', this.pid)
                //查询项目
                requestPost(urls + 'check/selectAll', formData).then(result => {
                    result.content.forEach(item => {
                        if (item.is_good == 0) {
                            item.is_good = '合格'
                        } else {
                            item.is_good = '不合格'
                        }
                        if (item.is_unqualified == 0) {
                            item.is_unqualified = '无'
                        } else {
                            item.is_unqualified = '有'
                        }
                        if (item.check_time != null) {
                            item.check_time = formatDate(item.check_time, 'yyyy-MM-dd hh:mm')
                        }
                        this.table.push(item)
                    })


                }).catch(() => {

                })
                if (this.pid != undefined) {
                    //查询涉及产品
                    requestPost(urls + 'check/selectProductP', formData).then(result => {
                        result.forEach(item => {
                            if (item.type == 0) {
                                item.type = '电气'
                            } else if (item.type == 1) {
                                item.type = '机械'
                            } else {
                                item.type = '焊接'
                            }
                        })
                        this.table1 = result
                        if (this.table1.length>0){
                            this.show1=true
                        }else {
                            this.show1=false
                        }
                    }).catch(() => {

                    })
                    //查询涉及原材料
                    requestPost(urls + 'check/selectProductBatch', formData).then(result => {
                        this.table2 = result
                        if (this.table2.length>0){
                            this.show2=true
                        }else {
                            this.show2=false
                        }
                    }).catch(() => {

                    })
                    //查询涉及供应商
                    requestPost(urls + 'check/selectProductSupplier', formData).then(result => {
                        result.forEach(item => {
                            if (item.type == 0) {
                                item.type = '电气'
                            } else if (item.type == 1) {
                                item.type = '机械'
                            } else {
                                item.type = '焊接'
                            }
                        })
                        this.table3 = result
                        if (this.table3.length>0){
                            this.show3=true
                        }else {
                            this.show3=false
                        }
                    }).catch(() => {

                    })
                }
            },
        },
        mounted() {
            this.selectPage()

        }

    }
</script>

<style>

</style>
