<template>
  <el-card style="height: 80px;">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名：">
        <el-input placeholder="请输入用户名称" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" plain @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
    <el-button type="danger" size="default" @click="deleteSelectUser">批量删除</el-button>
    <!-- table展示用户信息 -->
    <el-table @selection-change="selectChange" style="margin: 10px 0;" border :data="userArr">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="id" prop="id"></el-table-column>
      <el-table-column label="用户名字" prop="username" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户名称" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户角色" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row,  }">
          <el-button type="primary" size="small" icon="User" @click="setRole(row)">分配角色</el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
          <el-popconfirm :title="`你确定要删除${row.username}?`" width="260px" @confirm="deleteUser(row.id)">
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
      :background="true" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasUser"
      @size-change="handler" />
  </el-card>
  <!-- 抽屉结构：完成添加新的用户账号更新已有的账号信息 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input placeholder="请您输入用户姓名" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input placeholder="请您输入用户昵称" v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 抽屉结构：用于某个已有账号进行职位分配 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色用户</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <!-- 显示职位的复选框 -->
          <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
 
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>
 
<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { reqAddOrUpdateUser, reqAllRole, reqRemoveUser, reqSelectUser, reqSetUserRole, reqUserInfo } from '@/api/acl/user/index';
import type { AllRole, AllRoleResponseData, Records, SetRoleData, User, UserResponseData } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus';
import { nextTick, onMounted, reactive, ref } from 'vue';
// 默认页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(10)
// 用户总个数
let total = ref<number>(0)
// 存储全部用户的数组
let userArr = ref<Records>([])
// 定义响应式数据控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
// 控制分配角色抽屉显示与隐藏
let drawer1 = ref<boolean>(false)
// 收集用户信息的响应式数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: ''
})
// 获取dorm组件实例
let formRef = ref()
//定义响应式数据:收集用户输入进来的关键字
let keyword = ref<string>('')
//获取模板setting仓库
let settingStore = useLayOutSettingStore()
// 组件挂载完毕
onMounted(() => {
  getHasUser()
})
// 获取全部已有用户信息
const getHasUser = async (pager = 1) => {
  // 收集当前页码
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
  if (result.code === 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}
// 分页器下拉菜单的自定义事件的回调
const handler = () => {
  getHasUser()
}
// 添加用户按钮的回调
const addUser = () => {
  // 抽屉显示出来
  drawer.value = true
  // 清空数据
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: ''
  })
  // 清除上一次的错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
// 更新已有的用户按钮的回调
// row：即为已有用户的账号信息
const updateUser = (row: User) => {
  // 抽屉显示出来
  drawer.value = true
  // 存储收集已有的账号xinx
  Object.assign(userParams, row)
  // 清除上一次的错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}
 
// 保存按钮的回调
const save = async () => {
  // 点击保存按钮的时候，务必需要保证表单全部符合条件再去发请求
  await formRef.value.validate()
  // 保存按钮：添加新的用户|更新已有的用户账号信息
  let result: any = await reqAddOrUpdateUser(userParams)
  if (result.code === 200) {
    // 关闭抽屉
    drawer.value = false
    // 提示信息
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功'
    })
    // 获取最新的全部账号信息
    // getHasUser(userParams.id ? pageNo.value : 1)
    // 浏览器自动刷新一次（为了解决修改到当前登录用户信息需要重新登录的问题）
    window.location.reload()
  } else {
    // 关闭抽屉
    drawer.value = false
    // 提示信息
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败'
    })
  }
}
// 取消按钮的回调
const cancel = () => {
  // 关闭抽屉
  drawer.value = false
}
// 校验用户名字回调函数
const validatorUsername = (rule: any, value: any, callBack: any) => {
  // 用户名字|昵称，长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}
// 校验用户昵称回调函数
const validatorName = (rule: any, value: any, callBack: any) => {
  // 用户名字|昵称，长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}
// 校验用户名字回调函数
const validatorPassword = (rule: any, value: any, callBack: any) => {
  // 用户名字|昵称，长度至少六位
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}
// 表单校验的规则对象
const rules = {
  // 用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  // 用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  // 用户密码
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }]
}
 
// 分配角色按钮的回调
const setRole = async (row: User) => {
  // 存储已有的用户信息
  Object.assign(userParams, row)
  //获取全部的职位的数据与当前用户已有的职位的数据
  let result: AllRoleResponseData = await reqAllRole((userParams.id as number))
  if (result.code === 200) {
    //存储全部的职位
    allRole.value = result.data.allRolesList
    //存储当前用户已有的职位  
    userRole.value = result.data.assignRoles
    // 抽屉显示出来
    drawer1.value = true
  }
}
 
//收集顶部复选框全选数据
const checkAll = ref<boolean>(false)
//控制顶部全选复选框不确定的样式
const isIndeterminate = ref<boolean>(true)
//存储全部职位的数据
let allRole = ref<AllRole>([])
//当前用户已有的职位
let userRole = ref<AllRole>([])
//顶部的全部复选框的change事件
const handleCheckAllChange = (val: boolean) => {
  //val:true(全选)|false(没有全选)
  userRole.value = val ? allRole.value : []
  //不确定的样式(确定样式)
  isIndeterminate.value = false
}
//顶部全部的复选框的change事件
const handleCheckedCitiesChange = (value: string[]) => {
  //顶部复选框的勾选数据
  //代表:勾选上的项目个数与全部的职位个数相等，顶部的复选框勾选上
  checkAll.value = value.length === allRole.value.length
  //不确定的样式
  isIndeterminate.value = value.length !== allRole.value.length
}
// 确定按钮的回调（分配职位）
const confirmClick = async () => {
  // 收集参数
  let data: SetRoleData = {
    userId: (userParams.id as number),
    roleIdList: userRole.value.map(item => {
      return (item.id as number)
    })
  }
  // 分配用户的职位
  let result: any = await reqSetUserRole(data)
  if (result.code === 200) {
    // 提示信息
    ElMessage({
      type: 'success',
      message: '分配职务成功'
    })
    // 关闭抽屉
    drawer1.value = false
    // 获取更新完毕用户的信息，更新完毕留在当前页
    getHasUser(pageNo.value)
  }
}
 
// 删除某一个用户
const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
 
//准备一个数组存储批量删除的用户的ID
let selectIdArr = ref<User[]>([])
//table复选框勾选的时候会触发的事件
const selectChange = (value: any) => {
  selectIdArr.value = value
}
 
// 批量删除按钮的回调
const deleteSelectUser = async () => {
  //整理批量删除的参数
  let idsList: any = selectIdArr.value.map(item => {
    return item.id
  })
  //批量删除的请求
  let result: any = await reqSelectUser(idsList)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
 
// 搜索按钮的回调
const search = () => {
  //根据关键字获取相应的用户数据
  getHasUser()
  //清空关键字
  keyword.value = ''
}
//重置按钮
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}
</script>
 
<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>