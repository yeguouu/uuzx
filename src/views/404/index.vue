<template>
    <div class="box">
        <img src="../../assets/images/error_images/404.png">
        <button @click="goHome">首页</button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
let $router = useRouter();
const goHome = () => {
    $router.push('/home')
}
</script>

<style scoped lang="scss">
.box{
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    display: flex;
    justify-content: center;
    img{
        width: 400px;
        height: 600px;
    }
    button{
        width: 100px;
        height: 100px;
    }
}
</style>