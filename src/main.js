// var vue  = require('vue');  //查找node_modules中的vue这个包
import Vue from 'vue';

// 导入app.vue组件对象
import App from './App.vue'; //当前目录下面查找app.vue这个组件


import VueRouter from 'vue-router';

// 将VueRouter对象通过Vue.use()使用一下
Vue.use(VueRouter);
// 路由规则

import login from './components/account/login.vue'

import layout from './components/layout.vue'  //公共部分页面
import goodslist from './components/goods/goodslist.vue'   // 数据展示页面
import addGoodSlist from './components/goods/addGoodSlist.vue' //新增页面
import goodsEdit from './components/goods/goodsEdit.vue' //修改页面


// 路由规则
var router = new VueRouter({
    routes: [
        // 登录 页面的路由
        {
            name: 'login',
            path: '/login',
            component: login,
            meta: {
                nologin: true
            } //这里登录的路由加入这个为了后面的判断    
        },
        //默认跳转规则
        {
            name: 'default',
            path: '/',
            redirect: '/admin'
        },
        //布局
        {
            name: 'layout',
            path: '/admin',
            component: layout,
            children: [{
                name: 'goodslist',
                path: 'goodslist',
                component: goodslist,
            }, {
                //新增页面   
                name: 'addGoodSlist',
                path: 'addGoodSlist',
                component: addGoodSlist
            }, {
                //修改页面
                name:'goodsEdit',
                path:'goodsEdit/:ediTid',
                component:goodsEdit
            }
            ]
        },


    ]
})









// 导入element-ui模块
import elementUI from 'element-ui'

import '../staits/theme_rms/index.css'

import '../staits/css/site.css'

import axios from 'axios'
// 设定axios的默认请求域名，将来在真正调用get,post方法的时候传入的url中就不需要带域名的
axios.defaults.baseURL = 'http://127.0.0.1:8899/'
// 配置axios在请求数据服务接口的时候，允许带cookie(凭证)
axios.defaults.withCredentials = true;

router.beforeEach((to, from, next) => {
    // name: 代表的是当前路由规则对象的名字

    // path: 代表的是当前路由规则对象的路径

    // meta: 代表程序员在定义路由规则对象的时候， 手动添加的 meta: {}
    // 对象


    if(to.meta.nologin){
        next();
        return;
    }

    axios.get('/admin/account/islogin').then(res=>{
        // 登录成功与否的判断
        if(res.data.code == 'nologin'){
            // 通过路由来跳转网页
            router.push({name:'login'})
        }else{
            // 登录 成功
            next();
        }
    })
})
// 将axios对象绑定到vue的原型上  后面的组件都能使用
Vue.prototype.$ajax = axios
Vue.use(elementUI)

//实例化vue对象
new Vue({
    el: '#app',
    router,
    // render:function(create){create(App)}
    render: create => create(App)
});