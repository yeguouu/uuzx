<template>
    <div class="tabbar">
        <div class="tabbar_left">
            <Breadcrumb />
        </div>
        <div class="tabbar_right">
            <Setting />
        </div>
    </div>
</template>
 
<script setup lang="ts" name="Tabber">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>
 <script lang="ts">
 export default {
     name: "Tabber"
 }
 </script>
<style scoped lang="scss">
.tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;

    .tabbar_left {
        display: flex;
        margin-left: 20px;
        align-items: center;
    }

    .tabbar_right {
        display: flex;
        align-items: center;
    }
}
</style>