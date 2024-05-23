<template>
    <el-card style="height: 80px">
        <el-form :inline="true" class="form">
            <el-form-item label="角色名称">
                <el-input placeholder="角色名称" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
                <el-button type="primary" plain="primary" @click="reset">
                    重置
                </el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0">
        <el-button type="primary" size="default" icon="Plus" @click="addRole">
            添加角色
        </el-button>
        <el-table border style="margin: 10px 0" :data="roleArr">
            <el-table-column type="index" label="#" align="center"></el-table-column>
            <el-table-column label="id" align="center" prop="id"></el-table-column>
            <el-table-column label="角色名称" align="center" show-overflow-tooltip prop="roleName"></el-table-column>
            <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
            <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{ row, $index }">
                    <el-button type="primary" size="small" icon="User" @click="setPermission(row)">
                        分配权限
                    </el-button>
                    <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">
                        编辑
                    </el-button>
                    <el-popconfirm :title="`你确定要删除${row.roleName}?`" width="260px" @confirm="removeRole(row.id)">
                        <template #reference>
                            <el-button type="primary" size="small" icon="Delete">
                                删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
            :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasRole"
            @size-change="sizeChange" />
    </el-card>
    <!-- 添加角色与更新已有角色的结构:对话框 -->
    <el-dialog :title="roleParams.id ? '更新' : '添加'" v-model="dialogVisible">
        <el-form :model="roleParams" :rules="rules" ref="form">
            <el-form-item label="角色名称" prop="roleName">
                <el-input placeholder="请填写角色名称" v-model="roleParams.roleName"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button size="default" @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" size="default" @click="save">确认</el-button>
        </template>
    </el-dialog>
    <!-- 抽屉组件：分配角色的菜单权限与按钮权限 -->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>分配菜单与按钮的权限</h4>
        </template>
        <template #default>
            <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="selectArr" :props="defaultProps" />
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer = false">取消</el-button>
                <el-button type="primary" @click="handler">确认</el-button>
            </div>
        </template>
    </el-drawer>
</template>
 
<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import {
    reqAddOrUpdateRole,
    reqAllMenuList,
    reqRemoveRole,
    reqRoleInfo,
    reqSetPermission,
} from '@/api/acl/role'
import type {
    RoleResponseData,
    Records,
    RoleData,
    MenuResponseData,
    MenuList,
} from '@/api/acl/role/type'
import { nextTick, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
// 当前页码
let pageNo = ref<number>(1)
// 一夜展示几条数据
let pageSize = ref<number>(10)
// 角色总个数
let total = ref<number>(0)
// 存储全部角色的数组
let roleArr = ref<Records>([])
// 搜索角色关键字
let keyword = ref<string>('')
// 控制对话框显示与隐藏
let dialogVisible = ref<boolean>(false)
// 收集新增岗位数据
let roleParams = reactive<RoleData>({
    roleName: '',
})
// 控制抽屉显示与隐藏
let drawer = ref<boolean>(false)
// 获取form组件实例
let form = ref<any>()
//定义数组存储用户权限的数据
let menuArr = ref<MenuList>([])
//准备一个数组:数组用于存储勾选的节点的ID(四级的)
let selectArr = ref<number[]>([])
//获取tree组件实例
let tree = ref<any>()
// 组件挂载完毕
onMounted(() => {
    // 获取角色请求
    getHasRole()
})
// 获取全部已有的角色信息的方法|分页器当前页码发生变化的回调
const getHasRole = async (pager = 1) => {
    // 修改当前页码
    pageNo.value = pager
    let result: RoleResponseData = await reqRoleInfo(
        pageNo.value,
        pageSize.value,
        keyword.value,
    )
    if (result.code === 200) {
        total.value = result.data.total
        roleArr.value = result.data.records
    }
}
// 分页器下拉菜单的自定义事件的回调
const sizeChange = () => {
    getHasRole()
}
// 搜索按钮的回调
const search = () => {
    //根据关键字获取相应的角色数据
    getHasRole()
    //清空关键字
    keyword.value = ''
}

//获取模板setting仓库
let settingStore = useLayOutSettingStore()
// 重置按钮的回调
const reset = () => {
    settingStore.refresh = !settingStore.refresh
}
// 添加角色按钮的回调
const addRole = () => {
    // 对话框显示出来
    dialogVisible.value = true
    // 清空数据
    Object.assign(roleParams, {
        roleName: '',
        id: 0,
    })
    // 清空上一次表单校验错误提示
    nextTick(() => {
        form.value.clearValidate('roleName')
    })
}
// 更新角色按钮的回调
const updateRole = (row: RoleData) => {
    // 对话框显示出来
    dialogVisible.value = true
    // 存储已有角色---带有id的
    Object.assign(roleParams, row)
    // 清空上一次表单校验错误提示
    nextTick(() => {
        form.value.clearValidate('roleName')
    })
}

// 自定义校验规则的回调
const validatorRoleName = (rule: any, value: any, callBack: any) => {
    // 角色名称，长度至少五位
    if (value.trim().length >= 2) {
        callBack()
    } else {
        callBack(new Error('角色名称至少两位'))
    }
}
// 角色校验规则
const rules = {
    roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
}

// 确定按钮的回调
const save = async () => {
    // 表单校验结果，结果通过再发请求，结果没通过不应该发请求
    await form.value.validate()
    // 添加职位|更新角色的请求
    let result: any = await reqAddOrUpdateRole(roleParams)
    if (result.code === 200) {
        // 提示信息
        ElMessage({
            type: 'success',
            message: roleParams.id ? '添加成功' : '更新成功',
        })
        // 再次获取全部已有角色
        getHasRole(roleArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    } else {
        // 提示信息
        ElMessage({
            type: 'error',
            message: roleParams.id ? '添加失败' : '更新失败',
        })
    }
    // 对话框隐藏
    dialogVisible.value = false
}

//分配权限按钮的回调
//已有的职位的数据
const setPermission = async (row: RoleData) => {
    //抽屉显示出来
    drawer.value = true
    //收集当前要分类权限的职位的数据
    Object.assign(roleParams, row)
    //根据职位获取权限的数据
    let result: MenuResponseData = await reqAllMenuList(roleParams.id as number)
    if (result.code === 200) {
        menuArr.value = result.data
        selectArr.value = filterSelectArr(menuArr.value, [])
    }
}

const defaultProps = {
    children: 'children',
    label: 'name',
}

const filterSelectArr = (allData: any, initArr: any) => {
    allData.forEach((item: any) => {
        if (item.select && item.level === 4) {
            initArr.push(item.id)
        }
        if (item.children && item.children.length > 0) {
            filterSelectArr(item.children, initArr)
        }
    })
    return initArr
}

//抽屉确定按钮的回调
const handler = async () => {
    //职位的ID
    const roleId = roleParams.id as number
    //选中节点的ID
    let arr = tree.value.getCheckedKeys()
    //半选的ID
    let arr1 = tree.value.getHalfCheckedKeys()
    let permissionId = arr.concat(arr1)
    //下发权限
    let result: any = await reqSetPermission(roleId, permissionId)
    if (result.code === 200) {
        //抽屉关闭
        drawer.value = false
        //提示信息
        ElMessage({
            type: 'success',
            message: '分配权限成功',
        })
        //页面刷新
        window.location.reload()
    }
}
//删除已有的职位
const removeRole = async (id: number) => {
    let result: any = await reqRemoveRole(id)
    if (result.code === 200) {
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        getHasRole(roleArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}
</script>
 
<style scoped>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>