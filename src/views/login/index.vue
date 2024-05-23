<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <!-- 第一步：给el-form添加 :model="loginFrom"和:rules="rules" -->
                <el-form class="login_from" :model="loginForm" :rules="rules" ref="loginForms">
                    <h1>Hello</h1>
                    <h2>欢迎来到椰果甄选</h2>
                    <!--  第二步：给需要验证的每个el-form-item添加prop属性，如 prop="username"、prop="password -->
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" class="login_btn" type="primary" size="default"
                            @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>
 
<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue';
// 引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router';
import { ElNotification } from 'element-plus'
// 引入当前时间的函数
import { getTime } from '@/utils/time'

let useStore = useUserStore()
let $router = useRouter()
let loading = ref(false)
// 获取路由对象
let $route = useRoute()
// 通过ref属性获取el-form组件
let loginForms = ref()
// 收集账号与密码的数据
let loginForm = reactive({
    username: 'admin',
    password: '111111'
})
// 登录按钮回调
const login = async () => {
    // 第四步：请求前使用 loginFroms.value.validate()触发表单中所有表单项的校验，保证全部的表单项校验通过再发请求
    // 保证全部的表单项校验通过再发请求
    await loginForms.value.validate()
    // 加载效果：开始加载
    loading.value = true
    // 成功的话到首页，失败的话弹出失败信息
    try {
        await useStore.userLogin(loginForm);
        // 判断登录的时候，路由的路径当中是否有query参数，如果有就往query参数跳转，没有就跳转到首页
        let redirect: any = $route.query.redirect
        $router.push({ path: redirect || '/' })
        // 登陆成功提示
        ElNotification({
            type: 'success',
            message: '登陆成功',
            title: `HI,${getTime()}好`
        })
        // 登录成功加载效果消失
        loading.value = false
    } catch (error) {
        // 登录失败加载效果消失
        loading.value = false
        // 登录失败的提示信息
        ElNotification({
            type: 'error',
            message: (error as Error).message
        })
    }
}
// 自定义校验规则函数
const validateUsername = (_rule: any, value: any, callback: any) => {
    //rule:即为校验规则对象
    //value:即为表单元素文本内容
    //函数:如果符合条件callback放行通过即为
    //如果不符合条件callback方法,注入错误提示信息
    if(value.length >= 5){
        callback()
    }
    else{
        callback(new Error('用户名不少于5位'))
    }
}
const validatePassword = (_rule: any, value: any, callback: any) => {
    if(value.length >= 6){
        callback()
    }
    else{
        callback(new Error('密码不少于6位'))
    }
}
// 第三步：定义表单校验需要配置对象rules
// 规则对象属性：
// required：代表这个字段必须校验
// min：文本长度至少多少位
// max：文本长度最多多少位
// message：错误的提示信息
// trigger：触发校验表单的时机，change：文本发生变化时触发校验，blur：失去焦点时触发校验
const rules = {
    // username: [{ require: true, min: 5, max: 6, message: '用户名长度为10位', trigger: 'change' }],
    // 自定义校验
    username:[{ validator: validateUsername, trigger: 'change' }],
    password:[{ validator: validatePassword, trigger: 'change' }]
    // password: [{ required: true, min: 6, max: 10, message: '密码长度应为6-10位', trigger: 'change' }]
}
</script>
 
<style scoped lang="scss">
.login_container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/background.jpg') no-repeat;
    background-size: cover;

    .login_from {
        width: 80%;
        position: relative;
        top: 30vh;
        background: url('@/assets/images/login_form.png') no-repeat;
        background-size: cover;
        padding: 40px;

        h1 {
            color: white;
            font-size: 40px;
        }

        h2 {
            color: white;
            font-size: 20px;
            margin: 20px 0;
        }

        .login_btn {
            width: 100%;
        }
    }
}
</style>