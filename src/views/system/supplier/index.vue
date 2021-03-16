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
        <label class="el-form-item-label">供应商名称</label>
        <el-input v-model="query.name" clearable placeholder="供应商名称" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
          </el-col>
          <el-col :span="6">
        <label class="el-form-item-label">提供产品名称/范围</label>
        <el-input v-model="query.productScope" clearable placeholder="提供产品名称/范围" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
<!--        <label class="el-form-item-label">供应商联系人</label>-->
<!--        <el-input v-model="query.supplierBy" clearable placeholder="供应商联系人" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />-->
          </el-col>
          <el-col :span="6" >
        <rrOperation :crud="crud" />
          </el-col>
        </el-row>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->

      <crudOperation :permission="permission" />

      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="1000px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
          <el-form-item label="供应商类型" prop="type" v-if="show">
            <el-input v-model="form.type" style="width: 366px;" />
          </el-form-item>
          <el-row>
            <el-col :span="12">
          <el-form-item label="供应商名称" prop="name">
            <el-input v-model="form.name" style="width: 366px;" />
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <el-form-item label="提供产品名称">
            <el-input v-model="form.productScope" style="width: 366px;" />
          </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
          <el-form-item label="供应商联系人">
            <el-input v-model="form.supplierBy" style="width: 366px;" />
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <el-form-item label="供应商电话" prop="phone">
            <el-input v-model="form.supplierPhone"   style="width: 366px;"  maxlength="11"  />
          </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
          <el-form-item label="供应商地址">
            <div id="app">
              <el-cascader
                style="width: 366px;"
                size="large"
                v-model="address"
                :options="options"
                @change="handleChange">
              </el-cascader>
            </div>
          </el-form-item>
            </el-col>
            <el-col :span="12">
          <el-form-item label="详细地址">
            <el-input v-model="form.supplierAddres" style="width: 366px;" />
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
      <el-table ref="table" v-loading="crud.loading" :data="crud.data"  size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler"  :span-method="objectSpanMethod" >
        <el-table-column type="selection" width="55" />
        <el-table-column type="type" v-if="show" />
        <el-table-column prop="id" label="自增id" v-if="show"/>
        <el-table-column prop="name" label="供应商名称" />
        <el-table-column prop="productScope" label="提供产品名称/范围" />
        <el-table-column prop="typeName" label="证书类别名称" />
        <el-table-column prop="zhengshuname" label="证书名称" />
        <el-table-column prop="startTime" label="生效时间" />
        <el-table-column prop="endTime" label="到期时间" />
        <el-table-column  prop="证书详情" label="证书详情" >
          <template slot-scope="scope">
          <el-button  @click="checkzhengshu(scope.row.id)">查看详情</el-button>
          </template>>
        </el-table-column>

        <el-table-column v-if="checkPer(['admin','supplier:edit','supplier:del'])" label="操作" width="150px" align="center">
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
    import crudSupplier from '@/api/system/supplier'
    import CRUD, {presenter, header, form, crud} from '../../../components/SupplierCrud/crud'
    import rrOperation from '../../../components/SupplierCrud/RR.operation'
    import crudOperation from '../../../components/SupplierCrud/CRUD.operation'
    import udOperation from '../../../components/SupplierCrud/UD.operation'
    import pagination from '../../../components/SupplierCrud/Pagination'
    import {requestGet, urls} from '@/api/system/getpost'
    import {formatDate} from "../../../utils/date";
    import {requestPost} from "../../../api/system/getpost";
;
    import {regionData,CodeToText} from 'element-china-area-data'

    const defaultForm = {
        id: null,
        name: null,
        type:0,
        productScope: null,
        supplierBy: null,
        supplierPhone: null,
        supplierShengshiqu:null,
        supplierAddres: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        state: null,
    }


    export default {
        name: 'Supplier',
        components: {pagination, crudOperation, rrOperation, udOperation},
        mixins: [presenter(), header(), form(defaultForm), crud()],
        cruds() {
            return CRUD({
                title: '供应商',
                url: 'api/supplier',
                idField: 'id',
                sort: 'id,desc',
                crudMethod: {...crudSupplier}
            })
        },
        data() {
            return {
                show: false,
                classObject1:{
                    background:'#ffdd80'
                },
                classObject2:{
                    background:''
                },
                classObject3:{
                    background:''
                },
                address:[],
                options: regionData,
                selectedOptions: [],
                addtions:{},			//存储地址数据
                permission: {
                    add: ['admin', 'supplier:add'],
                    edit: ['admin', 'supplier:edit'],
                    del: ['admin', 'supplier:del']
                },
                rules: {
                    name: [
                        {required: true, validator: this.checkName, trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, validator: this.checkPhone, trigger: 'blur'}
                    ],

                },
                queryTypeOptions: [
                    {key: 'name', display_name: '供应商名称'},
                    {key: 'productScope', display_name: '提供产品名称/范围'},
                    {key: 'supplierBy', display_name: '供应商联系人'}
                ],
            }

        },
        methods: {
            selectproduct(param){
                if(param==0){
                    this.classObject1.background='#ffdd80';
                    this.classObject2.background='';
                    this.classObject3.background='';
                    this.query.type=0
                    localStorage.setItem('supplierType',  this.query.type)
                    this.crud.toQuery()


                }else if(param==1){
                    this.classObject1.background='';
                    this.classObject2.background='#ffdd80';
                    this.classObject3.background='';
                    this.query.type=1
                    localStorage.setItem('supplierType',  this.query.type)
                    this.crud.toQuery()
                }else {
                    this.classObject1.background='';
                    this.classObject2.background='';
                    this.classObject3.background='#ffdd80';
                    this.query.type=2
                    localStorage.setItem('supplierType',  this.query.type)
                    this.crud.toQuery()
                }

            },
            //选择地区
            handleChange (value) {
                //我们选择地址后，selectedOptions 会保存对应的区域码，例如北京的区域码为'110000'
                //我们要取出区域码对应的汉字，就需要用CodeToText(区域码)进行输出
                this.addtions.selectedOptions = value
                var name = ''
                this.address.map(item => name += CodeToText[item] + '/')
                this.addtions.names = name
                this.form.supplierShengshiqu=JSON.stringify(this.addtions.selectedOptions)
            },
            //时间转换 和合并单元格
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                this.address=JSON.parse(this.form.supplierShengshiqu)
                if( this.crud.data!=null){
                    this.crud.data.forEach(item=>{
                        if(item.startTime!=null){
                            item.startTime=formatDate(item.startTime,'yyyy-MM-dd hh:mm')
                        }
                        if(item.endTime!=null){
                            item.endTime=formatDate(item.endTime,'yyyy-MM-dd hh:mm')
                        }
                    })
                }
                if(columnIndex === 0 ) {
                    const _row = (this.flitterData(this.crud.data).one)[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    };
                }
                if(columnIndex === 2) {
                    const _row = (this.flitterData(this.crud.data).two)[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    };
                }
                if(columnIndex === 1) {
                    const _row = (this.flitterData(this.crud.data).three)[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    };
                }
                if(columnIndex === 8) {
                    const _row = (this.flitterData(this.crud.data).three)[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    };
                }
            },
            //验证供应商名字
           checkName(rule, value, callback) {
                value = this.form.name
                if (!value) {
                    return callback(new Error('名字不能为空'))
                } else {
                    const formData = new FormData()
                    formData.append( 'name',value)
                    formData.append('id',this.form.id)
                    requestPost(urls + 'supplier/findByName', formData).then(result => {
                        if (result != 0) {
                            return callback(new Error('该供应商已存在'))
                        } else {
                            callback()
                        }
                    }).catch(() => {

                    })
                }

            },
            //验证手机号
            checkPhone(rule, value, callback) {
                value = this.form.supplierPhone
                if (!value) {
                    return callback(new Error('手机号不能为空'))
                } else {
                    const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/

                    if (reg.test(value)) {
                        callback()
                    } else {
                        return callback(new Error('请输入正确的手机号'))
                    }
                }
            },


            //查看证书详情
            checkzhengshu(id){

              this.$router.push({ name:'Certificate', query: { id: id }})


            },

               loadPage(){
                   this.classObject1.background='#ffdd80';
                   this.classObject2.background='';
                   this.classObject3.background='';
                   this.query.type=0
                   localStorage.setItem('supplierType',  this.query.type)
                   this.crud.toQuery()

               },
            // 钩子：在获取表格数据之前执行，false 则代表不获取数据
            [CRUD.HOOK.beforeRefresh]() {
                return true
            },
            flitterData(arr){
                let spanOneArr = [],
                    spanTwoArr = [],
                    spanThreeArr = [],
                    spanEightArr = [],
                    concatOne = 0,
                    concatTwo = 0,
                    concatThree =0,
                    concatEight =0;
                arr.forEach((item,index)=>{
                    if(index === 0){
                        spanOneArr.push(1);
                        spanTwoArr.push(1);
                        spanThreeArr.push(1);
                        spanEightArr.push(1);
                    }else{
                        if(item.id === arr[index - 1].id){ //第一列需合并相同内容的判断条件
                            spanOneArr[concatOne] += 1;
                            spanOneArr.push(0);
                            spanEightArr[concatEight] += 1;
                            spanEightArr.push(0);
                        }else{
                            spanOneArr.push(1);
                            concatOne = index;
                            spanEightArr.push(1);
                            concatEight = index;
                        };
                        if(item.id === arr[index - 1].id&&item.name === arr[index - 1].name){//第二列需合并相同内容的判断条件
                            spanTwoArr[concatTwo] += 1;
                            spanTwoArr.push(0);
                        }else{
                            spanTwoArr.push(1);
                            concatTwo = index;
                        };
                        if(item.id === arr[index - 1].id&&item.productScope === arr[index - 1].productScope){ //第三列需合并相同内容的判断条件
                            spanThreeArr[concatThree] += 1;
                            spanThreeArr.push(0);
                        }else{
                            spanThreeArr.push(1);
                            concatThree = index;
                        };
                    }
                });
                return  {
                    one: spanOneArr,
                    two: spanTwoArr,
                    three: spanThreeArr
                }
            },


        },
        mounted() {
           this.loadPage()
        }

    }

</script>

<style scoped>

</style>
