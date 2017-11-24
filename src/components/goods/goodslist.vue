<template>
  <div class="tmpl">
    <el-row>
      <el-col :span='24'>
        <div class="abread bt-line">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/admin/goodslist' }">购物商城</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>

          </el-breadcrumb>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span='24'>
        <!-- 搜索区域 -->
        <div class="abread bt-line">
          <el-row>
            <el-col :span='6'>
              <el-button size='large' class="el-icon-check" @click='selectedAll(list)'>全选</el-button>
              <router-link to="/admin/addGoodSlist">
                <el-button size='large' class="el-icon-plus">新增</el-button>
              </router-link>
              <el-button size='small' class="el-icon-delete" @click='delEte'>删除</el-button>
            </el-col>
            <el-col :span='5' :offset='13'>
              <el-input placeholder="请输入搜索内容" icon="search" v-model="searchVL" :on-icon-click="getlist">
                <!-- :on-icon-click="handleIconClick" -->
              </el-input>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span='24'>
        <el-table ref="multipleTable" :data='list' @select='selected' @select-all='selectedAll' border tooltip-effect="dark" style="width: 100%">
          <!-- type="selection":这一列是一个checkbox勾选框 -->
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="title" label="标题">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" placement="right-start">
                <div slot="content">
                  <img width="200px" height="200px" :src="scope.row.imgurl" alt="">
                </div>
                <router-link v-bind='{to:"/admin/goodsEdit/"+scope.row.id}'>
                    {{scope.row.title}}
                </router-link>
                <a href="javascript:;"></a>
              </el-tooltip>
            </template>

          </el-table-column>
          <el-table-column prop="categoryname" label="所属类别" width="100">
          </el-table-column>
          <el-table-column prop="stock_quantity" label="库存" width="100">
          </el-table-column>
          <el-table-column prop="market_price" label="市场价" width="100">
          </el-table-column>
          <el-table-column prop="sell_price" label="销售价" width="100">
          </el-table-column>
          <el-table-column label="属性" width="120">
            <!-- scope:代表但是当前:data中的指向的某个对象，可以通过 scope -->
            <template scope="scope">

              <i v-bind="{class:'el-icon-picture ' + ( scope.row.is_slide == 1?'' : 'unlinght' ) }"></i>
              <!--类名这个地方 需要个空格'el-icon-picture ' 然后在加 + ( scope.row.is_slide == 1?'' : 'unlinght' ) -->
              <i v-bind="{class:'el-icon-upload ' + ( scope.row.is_top == 1?'' : 'unlinght' ) }"></i>
              <i v-bind="{class:'el-icon-star-on ' + ( scope.row.is_hot == 1?'' : 'unlinght' ) }"></i>

            </template>
          </el-table-column>

          <!-- template：是属于当前列的模板，可以有程序员自己编写这一列的样式 -->
          <el-table-column label="操作" width="120">
            <template scope='scope'>
                <router-link v-bind='{to:"/admin/goodsEdit/"+scope.row.id}'>
                    修改
                </router-link>
              
            </template>
          </el-table-column>

        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="block">
          <!-- size-change和current-change事件来处理页码大小和当前页变动时候触发的事 
            page-sizes接受一个整型数组，数组元素为展示的选择每页显示个数的选项
            :current-page用户输入的页码
            :page-size当前的页容量 
            -->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="amount">
          </el-pagination>
        </div>
      </el-col>

    </el-row>

  </div>
</template>

<script>
  // import axios from 'axios'
  export default {
    data() {
      return {
        pageSize: 10, //定义一个分页组件中页容量，默认是10条
        pageIndex: 1, //定义一个分页的索引 默认在第一页
        searchVL: '', //搜索的条件
        amount: 0,
        list: [], //存放数据来的商品数据
        delIds: [],
        deleltes: false
      }
    },
    methods: {

      handleSizeChange(size) { //当前的页容量

        console.log(size);
        this.pageSize = size; //当前的页容量

        this.getlist() //重新获取一次
      },
      handleCurrentChange(currentPage) { ////将当前页的索引给 当前的分页索引器
        console.log(currentPage)
        this.pageIndex = currentPage; //将用户选择的页面 的索引  给分页的索引

        this.getlist(); //重新获取一次
      },
      getlist() {
        console.log(this.searchVL);
        // 定义路径
        var url = '/admin/goods/getlist?pageIndex=' + this.pageIndex + '&pageSize=' + this.pageSize + '&searchvalue=' +
          this.searchVL;
        this.$ajax.get(url).then(res => { //将axios对象绑定到vue的原型上
          this.list = res.data.message;

          this.amount = res.data.totalcount;
        })
      },
      selected(selection, row) { //用户点击 表格行时候执行
        // 把每次点击的追加到 delIds数组里    

        if (selection.length == 0) {
          this.delIds = [];
          return;
        }
        var id = []
        for (let i = 0; i < selection.length; i++) { //每次遍历 点击到的按钮 追加到一个空的数组里
          id.push(selection[i].id);
        }
        this.delIds = id;
      },
      del(id) { //删除操作的封装
        this.$ajax.get('/admin/goods/del/' + id)
          .then(res => {
            if (res.data.status == 1) {
              this.$notify.error({
                title: '错误',
                message: res.data.message
              });
            } else {
              this.$notify.success({
                title: '成功',
                message: res.data.message
              });
              this.getlist();
            }
          })
      },
      delEte() { //删除操作
        if (this.delIds.length == 0) {
          return;
        }
        var id = this.delIds.join(',')
        this.del(id);
      },
      selectedAll(row) { //全选
        this.deleltes = !this.deleltes
        if (this.deleltes) {
          this.delIds.length = 0;
          row.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
            this.delIds.push(row.id);
          });
        } else {
          this.delIds.length = 0;
          console.log(this.delIds);
          this.$refs.multipleTable.clearSelection(); 
        }
      }
    },
    mounted() { //生命周期
      this.getlist();
    }
  }
</script>
<style scoped>
  .unlinght {
    color: rgba(0, 0, 0, 0.3);
  }
</style>