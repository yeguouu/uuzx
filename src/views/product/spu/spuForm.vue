<template>
    <el-form label-width="100px">
        <el-form-item label="SPU名称">
            <el-input placeholder="请你输入SPU名称" v-model="spuParams.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌">
            <el-select placeholder="请你选中品牌" v-model="spuParams.tmId">
                <el-option v-for="item in allTrademark" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" placeholder="请你输入描述" v-model="spuParams.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU照片">
            <!-- v-model:fileList->展示默认图片 
                 action:上传图片的接口地址
                 list-type:文件列表的类型
            -->
            <el-upload v-model:file-list="imgList" action="api/admin/product/fileUpload" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handlerUpload">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%;height: 100%;" />
            </el-dialog>
        </el-form-item>
        <el-form-item label="SPU销售属性">
            <!-- 展示销售属性的下拉菜单 -->
            <el-select v-model="saleAttrIdAndValueName"
                :placeholder="unSelectSaleAttr.length ? `还有未选择${unSelectSaleAttr.length}个` : '无'">
                <el-option :value="`${item.id}:${item.name}`" v-for="item in unSelectSaleAttr" :key="item.id"
                    :label="item.name"></el-option>
            </el-select>
            <el-button @click="addSaleAttr" :disabled="saleAttrIdAndValueName ? false : true" style="margin-left: 10px;"
                type="primary" size="default" icon="Plus">添加销售属性</el-button>
            <!-- table展示销售属性与属性值的地方 -->
            <el-table style="margin: 10px 0;" border :data="saleAttr">
                <el-table-column label="序号" type="index" align="center" width="80px" />
                <el-table-column label="属性名" width="100px" prop="saleAttrName"></el-table-column>
                <el-table-column label="属性值">
                    <template #="{ row }">
                        <el-tag @close="row.spuSaleAttrValueList.splice(index, 1)" style="margin:0px 5px"
                            v-for="(item, index) in row.spuSaleAttrValueList" :key="item.id" class="mx-1" closable>
                            {{ item.saleAttrValueName }}
                        </el-tag>
                        <el-input @blur="toLook(row)" v-model="row.saleAttrValue" v-if="row.flag === true"
                            placeholder="请你输入属性值" size="small" style="width: 100px;"></el-input>
                        <el-button v-else @click="toEdit(row)" type="success" size="small" icon="Plus"></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100px">
                    <template #="{ row, $index }">
                        <el-button type="danger" size="small" icon="Delete" @click="saleAttr.splice($index, 1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button :disabled="saleAttr.length > 0 ? false : true" type="primary" size="default"
                @click="save">保存</el-button>
            <el-button size="default" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>
 
<script setup lang="ts">
import { reqAddOrUpdateSpu, reqAllSaleAttr, reqAllTrademark, reqSpuHasSaleAttr, reqSpuImageList } from '@/api/product/spu';
import { AllTrademark, HasSaleAttr, HasSaleAttrResponseData, SaleAttr, SaleAttrResponseData, SaleAttrValue, SpuData, SpuHasImg, SpuImg, Trademark } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue';
let $emit = defineEmits(['changeScene'])
// 点击取消按钮：通知父组件切换场景为1，展示已有的SPU数据
const cancel = () => {
    $emit('changeScene', { flag: 0, params: 'update' })
}

// 存储已有的SPU这些数据
// 品牌
let allTrademark = ref<Trademark[]>([])
// 商品图片
let imgList = ref<SpuImg[]>([])
// 已有的SPU销售属性
let saleAttr = ref<SaleAttr[]>([])
// 全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])
//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
//存储预览图片地址
let dialogImageUrl = ref<string>('')
let spuParams = ref<SpuData>({
    category3Id: "",//收集三级分类的ID
    spuName: "",//SPU的名字
    description: "",//SPU的描述
    tmId: '',//品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
})
//将来收集还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref<string>('')
// 子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
    //存储已有的SPU对象,将来在模板中展示
    spuParams.value = spu
    // spu：即为父组件传递过来的已有的SPU对象【不完整】
    // 获取全部品牌的数据
    let result1: AllTrademark = await reqAllTrademark()
    // 获取某一个品牌旗下全部售卖商品的图片
    let result2: SpuHasImg = await reqSpuImageList((spu.id as number))
    // 获取已有的SPU销售属性的数据
    let result3: SaleAttrResponseData = await reqSpuHasSaleAttr((spu.id as number))
    // 获取整个项目全部SPU的销售属性
    let result4: HasSaleAttrResponseData = await reqAllSaleAttr()
    // 存储全部品牌的数据
    allTrademark.value = result1.data
    // SPU对应商品图片
    imgList.value = result2.data.map(item => {
        return {
            name: item.imgName,
            url: item.imgUrl
        }
    })
    // 存储已有的SPU的销售属性
    saleAttr.value = result3.data
    // 存储全部的销售属性
    allSaleAttr.value = result4.data
}
//照片墙点击预览按钮的时候触发的钩子
const handlePictureCardPreview = (file: any) => {
    dialogImageUrl.value = file.url
    //对话框弹出来
    dialogVisible.value = true
}
//照片墙删除文件钩子
const handleRemove = (file: any) => {
    console.log(file);
}
//照片墙上传成功之前的钩子约束文件的大小与类型
const handlerUpload = (file: any) => {
    if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif') {
        if (file.size / 1024 / 1024 < 3) {
            return true
        } else {
            ElMessage({
                type: 'error',
                message: '上传文件务必小于3M'
            })
            return false
        }
    } else {
        ElMessage({
            type: 'error',
            message: '上传文件务必PNG|JPG|GIF'
        })
        return false
    }
}

//计算出当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
    //全部销售属性:颜色、版本、尺码
    //已有的销售属性:颜色、版本
    let unSelectArr = allSaleAttr.value.filter(item => {
        return saleAttr.value.every(item1 => {
            return item.name !== item1.saleAttrName
        })
    })
    return unSelectArr;
})

//添加销售属性的方法
const addSaleAttr = () => {
    /*
    "baseSaleAttrId": number,
    "saleAttrName": string,
    "spuSaleAttrValueList": SpuSaleAttrValueList
    */
    const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
    //准备一个新的销售属性对象:将来带给服务器即可
    let newSaleAttr: SaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
    }
    //追加到数组当中
    saleAttr.value.push(newSaleAttr)
    //清空收集的数据
    saleAttrIdAndValueName.value = ''
}

//属性值按钮的点击事件
const toEdit = (row: SaleAttr) => {
    //点击按钮的时候,input组件不就不出来->编辑模式
    row.flag = true
    row.saleAttrValue = ''
}
//表单元素失却焦点的事件回调
const toLook = (row: SaleAttr) => {
    //整理收集的属性的ID与属性值的名字
    const { baseSaleAttrId, saleAttrValue } = row
    //整理成服务器需要的属性值形式
    let newSaleAttrValue: SaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: (saleAttrValue as string)
    }
    //非法情况判断
    if ((saleAttrValue as string).trim() === '') {
        ElMessage({
            type: 'error',
            message: '属性值不能为空的'
        })
        return;
    }
    //判断属性值是否在数组当中存在
    let repeat = row.spuSaleAttrValueList.find(item => {
        return item.saleAttrValueName === saleAttrValue
    })
    if (repeat) {
        ElMessage({
            type: 'error',
            message: '属性值重复'
        })
        return;
    }
    //追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue)
    //切换为查看模式
    row.flag = false
}

// 保存按钮的回调
const save = async () => {
    //整理参数
    //发请求:添加SPU|更新已有的SPU
    //成功
    //失败
    //1:照片墙的数据
    spuParams.value.spuImageList = imgList.value.map((item: any) => {
        return {
            imgName: item.name,//图片的名字
            imaUrl: (item.response && item.response.data) || item.url
        }
    })
    //2:整理销售属性的数据
    spuParams.value.spuSaleAttrList = saleAttr.value
    let result = await reqAddOrUpdateSpu(spuParams.value)
    if (result.code === 200) {
        ElMessage({
            type: 'success',
            message: spuParams.value.id ? '更新成功' : '添加成功'
        })
        $emit('changeScene', { flag: 0, params: spuParams.value.id ? 'update' : 'add' })
    } else {
        ElMessage({
            type: 'success',
            message: spuParams.value.id ? '更新失败' : '添加失败'
        })
    }
}

//添加一个新的SPU初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
    // 清空数据
    Object.assign(spuParams.value, {
        category3Id: "",//收集三级分类的ID
        spuName: "",//SPU的名字
        description: "",//SPU的描述
        tmId: '',//品牌的ID
        spuImageList: [],
        spuSaleAttrList: [],
    })
    // 清空照片
    imgList.value = []
    // 清空销售属性
    saleAttr.value = []
    saleAttrIdAndValueName.value = ''
    spuParams.value.category3Id = c3Id
    //获取全部品牌的数据
    let result: AllTrademark = await reqAllTrademark()
    let result1: HasSaleAttrResponseData = await reqAllSaleAttr()
    // 存储数据
    allTrademark.value = result.data
    allSaleAttr.value = result1.data
}
// 对外暴露
defineExpose({ initHasSpuData, initAddSpu })

</script>
 
<style scoped></style>