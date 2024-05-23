<template>
    <el-card>
        <div class="box">
            <img :src="userStore.avatar" class="avatar">
            <div class="info">
                <h3>{{ getTime() }}好！{{ userStore.username }}</h3>
                <p>椰果甄选运营平台</p>
            </div>
        </div>
    </el-card>
    <div class="bottom">
        <svg-icon name="welcome" width="600px" height="300px"></svg-icon>
    </div>
</template>
 
<script setup lang="ts">
import { getTime } from '@/utils/time'
// 引入用户相关的仓库，获取当前用户的头像、昵称
import useUserStore from '@/store/modules/user'
// 获取存储用户信息的仓库对象
let userStore = useUserStore()
</script>
 
<style scoped lang="scss">
.box {
    display: flex;
    align-items: center;

    .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
    }

    .info {
        margin-left: 20px;

        h3 {
            font-size: 28px;
            font-weight: 500;
        }

        p {
            margin-top: 20px;
            color: #a49a9a;
        }
    }
}

.bottom {
    display: flex;
    justify-content: center;
    margin-top: 100px;
}
</style>