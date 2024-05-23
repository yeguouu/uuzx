// 通过vue-router插件实现路由配置
import { createRouter, createWebHashHistory } from 'vue-router';
// 引入routes配置项
import { constantRoute } from './routes';
// 创建路由
let router = createRouter({
    // 路由模式hash
    history: createWebHashHistory(),
    routes: constantRoute,
    // 滚动行为
    scrollBehavior() {
        return {
            left: 0,
            top: 0
        }
    }
})
 
export default router;