<template>
    <div class="layout_container">
        <!-- 左侧菜单 -->
        <div class="layout_slider" :class="{ fold: layoutSettingStore.fold ? true : false }">
            <Logo></Logo>
            <!-- 展示菜单 -->
            <!-- 滚动组件 -->
            <el-scrollbar class="scrollbar">
                <!-- 菜单组件 -->
                <el-menu background-color="#001529" text-color="white" :default-active="$route.path"
                    :collapse="layoutSettingStore.fold">
                    <!-- 根据路由动态生成菜单 -->
                    <Menu :menuList="userStore.menuRoutes"></Menu>
                </el-menu>
            </el-scrollbar>
        </div>
        <!-- 顶部导航 -->
        <div class="layout_tabbar" :class="{ fold: layoutSettingStore.fold ? true : false }">
            <Tabber></Tabber>
        </div>
        <!-- 内容展示区域 -->
        <div class="layout_main" :class="{ fold: layoutSettingStore.fold ? true : false }">
            <Main></Main>
        </div>
    </div>
</template>

<script setup lang ="ts">
// 获取路由对象
import { useRoute } from 'vue-router'
// 引入左侧菜单logo子组件
import Logo from './logo/index.vue'
// 引入菜单组件
import Menu from './menu/index.vue'
// 右侧内容展示区
import Main from './main/index.vue'
// 顶部导航
import Tabber from './tabber/index.vue'
// 获取用户相关的小仓库
import useUserStore from '@/store/modules/user'
import useLayoutSettingStore from "@/store/modules/setting";
let layoutSettingStore = useLayoutSettingStore()
let userStore = useUserStore()
let $route = useRoute()
</script>
<script lang="ts">
    export default {
        name: "Layout"
        }
</script>
<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;

    .layout_slider {
        width: $base-menu-width;
        height: 100vh;
        background: $base-menu-background;
        color: white;
        // transition: all .3s;
        .scrollbar {
            width: 100%;
            height: calc(100vh - $base-menu-logo-height - 20px);
            .el-menu {
                border-right: none;
            }
        }
        // &.fold{
        //     width: $base-menu-min-width;
        // }
    }

    .layout_tabbar {
        position: fixed;
        width: calc(100% - $base-menu-width);
        height: $base-tabbar-height;
        // background: $base-tabbar-background;
        top: 0px;
        left: $base-menu-width;
        &.fold {
            width: calc(100vw - $base-menu-min-width);
            left: $base-menu-min-width;
        }
    }

    .layout_main {
        position: absolute;
        width: calc(100% - $base-menu-width);
        height: calc(100vh - $base-tabbar-height);
        top: $base-tabbar-height;
        left: $base-menu-width;
        overflow: auto;
        padding: 20px;
        &.fold {
            width: calc(100vw - $base-menu-min-width);
            left: $base-menu-min-width;
        }
    }
}
</style>
