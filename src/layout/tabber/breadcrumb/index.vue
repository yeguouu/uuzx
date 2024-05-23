<template>
    <!-- 顶部左侧静态 -->
    <el-icon style="margin-right: 10px;" @click="changeIcon">
        <component :is="layoutSettingStore.fold ? 'Expand' : 'Fold'"></component>
    </el-icon>
    <!-- 左侧面包屑 -->
        <el-breadcrumb separator-icon="ArrowRight">
            <!-- 面包屑动态展示路由图标与标题 -->
          <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
             <!-- 图标 -->
             <el-icon>
                 <component :is="item.meta.icon"></component>
             </el-icon>
             <!-- 标题 -->
             <span>{{ item.meta.title }}</span>
         </el-breadcrumb-item>
        </el-breadcrumb>
</template>
 
<script setup lang="ts">
// 获取路由对象
import { useRoute } from 'vue-router'
import useLayoutSettingStore from "@/store/modules/setting";
// 获取layout配置相关的仓库
let layoutSettingStore = useLayoutSettingStore()
let $route = useRoute()
// 点击图标的方法
const changeIcon = () => {
    // 图标进行切换
    layoutSettingStore.fold = !layoutSettingStore.fold
}
</script>
<script lang="ts">
export default {
    name:'Breadcrumb'
}
</script>