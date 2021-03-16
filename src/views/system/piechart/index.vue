<template>
  <div>
    <div style="margin-left: 20px;margin-top: 40px">
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
    </div>
    <div style="margin-left:40px;margin-top: 20px">
      <el-row>
        <el-col :span="8">
          <label class="el-form-item-label" style="font-family: AppleGothic;font-size: 16px">项目名称</label>
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
            />
          </el-select>
        </el-col>
        <el-col :span="8">
          <label class="el-form-item-label" style="font-family: AppleGothic;font-size: 16px">产品名称</label>
          <el-select
            v-model="productId"
            @change="selectExitSelectConfig"
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
        <el-col :span="6">
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"  @click="toQuery">搜索</el-button>
        </el-col>
      </el-row>
    </div>
  <div class="pieId1" style="margin-left: 40px">
    <pie :opinion="opinion" :opinionData="opinionData" ></pie>
    <pie  :opinion="opinion1" :opinionData="opinionData1"  style="margin-left:500px;margin-top: -345px"></pie>
  </div>
  </div>

</template>
<script>
import Pie from "@/components/Echarts/pie";
import {requestPost,urls} from '@/api/system/getpost'
export default {
  name: 'Piechart',
  components: { Pie },
  data() {
      return {
          pieId1:"0",
          pieId2:"1",
          charts: "",
          productList:[],
          projectList:[],
          productId:'',
          projectId:'',
          classObject1:{
              background:''
          },
          classObject2:{
              background:'#ffdd80'
          },

          opinion: ["合格", "不合格"],
          opinionData: [

          ],

          opinion1: [],
          opinionData1: [

          ]
      };
  },
    methods:{
        selectExitSelectConfig(){

            //查询项目
            requestPost(urls + 'product/selectAllProject2').then(result => {
                this.projectList=result
            }).catch(() => {

            })
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
        toQuery(){
          if(this.projectId==''){
              this.$message.error("请先选择项目")
              return;
          }
          if(this.productId==''){
              this.$message.error("请先选择产品")
              return;
          }
            const formData = new FormData()
            formData.append('projectId', this.projectId)
            formData.append('productId', this.productId)
            requestPost(urls + 'check/selectIsGood',formData).then(result => {
                this.opinion= ["合格", "不合格"],
                this.opinionData=result
                this.opinionData.forEach(item=>{
                    if(item.name==0){
                        item.name='合格'
                    }else {
                        item.name='不合格'
                    }
                })

            }).catch(() => {
            })
            requestPost(urls + 'check/selectUnqualified',formData).then(result => {

                 this.opinionData1=result
                this.opinionData1.forEach(item=>{

                  item.name='故障类别'+item.name
                    this.opinion1.push(item.name)
                })
            }).catch(() => {
            })
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
   },

mounted() {
      this.selectExitSelectConfig()
}
}

</script>
