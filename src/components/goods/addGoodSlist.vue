<template>
  <div id="tmpl">
    <el-row>
      <!-- 类似bootstrap栅格系统的一个东西 -->
      <el-col :span='24'>
        <div class="abread bt-line">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">购物商城</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-col>

      <el-row>
        <el-col :span='20'>
          <div class="abread bt-line">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="内容标题" prop="title">
                <el-input v-model="ruleForm.title"></el-input>
              </el-form-item>
              <el-form-item label="副标题" prop="sub_title">
                <el-input v-model="ruleForm.sub_title"></el-input>
              </el-form-item>
              <el-row>
                <!-- 所属类别 -->
                <el-col :span='8'>
                  <el-form-item label="所属类别">
                    <el-select v-model="ruleForm.category_id" placeholder="所属类别">
                      <el-option v-for='item in catelist' :value='item.category_id' :label='item.title'>
                        <span v-for='sub in (item.class_layer-1)'>&nbsp;</span>
                        <!-- vue里的循环 也能循环数字的 -->
                        <span v-if='item.class_layer>1'>|-</span>{{item.title}}
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <!-- 开关模块 -->
                <el-col :span='6'>
                  <el-form-item label="是否发布">
                    <el-switch v-model="ruleForm.status" on-text="是" off-text="否" on-color="#13ce66" off-color="#ff4949">
                    </el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span='7'>
                  <el-form-item label="推荐类型">
                    <el-switch v-model="ruleForm.is_slide" on-text="轮播图" off-text="轮播图" on-color="#13ce66" off-color="#ff4949">
                    </el-switch>
                    <el-switch v-model="ruleForm.is_top" on-text="置顶" off-text="置顶" on-color="#13ce66" off-color="#ff4949">
                    </el-switch>
                    <el-switch v-model="ruleForm.is_hot" on-text="推荐" off-text="推荐" on-color="#13ce66" off-color="#ff4949">
                    </el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 上传模块 -->
              <el-row>

                <el-col :span='12'>

                  <div class="abread bt-line">
                    <el-form-item label='上传封面'>
                      <el-upload class="upload-demo" action="http://127.0.0.1:8899/admin/article/uploadimg" :on-success='imgUploaded' :file-list="ruleForm.imgList"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                      </el-upload>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span='9' :offset='1'>
                  <div class="abread bt-line">
                    <el-form-item label='上传附件'>
                      <el-upload class="upload-demo" action="http://127.0.0.1:8899/admin/article/uploadfile" :on-success='fileUplaoded' :file-list="ruleForm.fileList"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                      </el-upload>
                    </el-form-item>
                  </div>
                </el-col>

              </el-row>
              <el-row>
                <el-col :span='10'>
                  <el-form-item label="商品货号" prop="sub_title">
                    <el-input v-model="ruleForm.goods_no"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span='10'>
                  <el-form-item label="库存数量" prop="stock_quantity">
                    <el-input v-model="ruleForm.stock_quantity"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span='10'>
                  <el-form-item label="市场价格" prop="market_price">
                    <el-input v-model="ruleForm.market_price"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span='10'>
                  <el-form-item label="销售价格" prop="sell_price">
                    <el-input v-model="ruleForm.sell_price"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span='16' :offset='2'>
                  <el-form-item label='内容摘要' prop='zhaiYao'>
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="ruleForm.zhaiYao">
                    </el-input>
                  </el-form-item>

                </el-col>
              </el-row>

              <el-form-item labael='商品详情' prop='content'>
                <quill-editor ref="myTextEditor" :content="ruleForm.content" @change="onEditorChange($event)">
                  <!-- 内容改变事件  -->
                </quill-editor>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">立即添加</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </el-row>


  </div>
</template>


<script>
  //  引入富文本编辑器
  import {
    quillEditor
  } from 'vue-quill-editor'

  export default {
    components: {
      quillEditor
    },
    data() {
      return {
        catelist: [], //存储分类下拉框中的数据 
        ruleForm: {
          title: '1',
          sub_title: '3',
          category_id: 43, // 小问题：category_id要是一个数值类型，如果变成字符串类型的话，则页面显示不正常
          status: true,
          is_slide: false,
          is_top: false,
          is_hot: false,
          goods_no: 'NZ0000000002',
          stock_quantity: '200',
          market_price: '200',
          sell_price: '200',
          zhaiYao: '200',
          content: '<p><strong>产品参数:</strong></p>',
          imgList: [],
          fileList: []
        },
        rules: {
          title: [{
            required: true,
            message: '请输入商品标题',
            trigger: 'blur'
          }],
          sub_title: [{
            required: true,
            message: '请输入活动名称',
            trigger: 'blur'
          }]

        },
      }
    },
    mounted() { //声明周期
      this.getcastlist();
    },
    methods: {
      fileUplaoded(res, file, filelist) { //上传附件
        this.ruleForm.fileList.push(res);
      },


      imgUploaded(res, file, filelist) { //上传封面

        this.ruleForm.imglist = [res];
      },

      getcastlist() { //用于请求到用于渲染分类 的数据
        var url = '/admin/category/getlist/goods';
        this.$ajax.get(url).then(res => {
          // console.log(res.data.message);

          this.catelist = res.data.message;
        })
      },
      //点击富文本编辑器的事件
      onEditorChange(ev) {
        this.ruleForm.content = ev.html;
      },


      // 立即添加 

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$ajax.post('/admin/goods/add/goods', this.ruleForm).then(res => {
              console.log(res.data)
              
              if (res.data.status == 1) {
                this.$notify.error({
                  title: '错误',
                  message: res.data.message,
                })
              } else {
                this.$notify({
                  title: '成功',
                  message:res.data.message,
                  type: 'success'
                });
                this.$router.push({name:'goodslist'})
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

    }
  }
</script>

<style>

</style>