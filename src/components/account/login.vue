<template>
  <div class="tmpl">
    <el-row>
      <el-col :span='5' :offset='9'>

        <span>账号</span>
        <el-input class="uname" v-model="user.uname" placeholder="请输入内容"></el-input>
        <span>密码</span>
        <el-input class="upwd" v-model="user.upwd" placeholder="请输入内容"></el-input>
        <el-button type="primary" @click='loginBtn'>登录</el-button>


      </el-col>

    </el-row>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        user: {
          uname: 'admin',
          upwd: '123456'
        }
      }
    },
    methods: {
      loginBtn() {
        var url = '/admin/account/login';
        this.$ajax.post(url, this.user)
          .then(res => {
            console.log(res.data.message);
            if(res.data.status == 1){
              // 这里是element-ui自带的  success  warning  error 消息提示的样式
              this.$message.error(res.data.message);
              return;
            } 
            this.$router.push({name:'default'})
          })
      }
    }
  }
</script>

<style scoped>
  .tmpl {
    background-color: #267cb7;
    width: 100%;
    height: 2000px;
  }

  .uname,
  .upwd {
    padding: 10px;
  }
</style>