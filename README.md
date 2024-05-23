页面包括首页、数据大屏、权限管理、商品管理、登录注册以及多个子页面。实现了不同角色的访问权限，商品和品牌管理的多个功能。
技术栈：Vue3+TypeScript+Vite+Vue-Router+Pinia+Axios+Element Plus+ECharts
项目成果
权限控制：使用路由守卫控制路由跳转，实现页面访问控制，菜单权限配置，采用自定义指令实现按钮权限控制
数据处理：后端返回数据量大，将数据分页处理，使用懒加载技术监听页面滚动，减少首屏页面渲染时间
封装全局组件：axios二次封装，对API接口实现统一管理，封装svg图标、表格、分页器等组件，提高组件复用率
动态主题切换：通过Scss+Element Plus实现暗黑模式和主题颜色切换，使用JavaScript的全屏API实现全屏模式切换
语法规范：使用ESlint+Prettier语法检查进行写作，规范代码编写
ECharts使用：解决数据大屏适配问题，使用ECharts绘制图表，如饼图、散点图、雷达图等
登录页：
![image](https://github.com/yeguouu/uuzx/assets/169153721/0f750975-2bc4-42e9-9418-8c6f13be8131)
首页：
![image](https://github.com/yeguouu/uuzx/assets/169153721/da2699cd-e3a6-48d2-bb56-a603f501ddce)
数据大屏：
![image](https://github.com/yeguouu/uuzx/assets/169153721/afe93d43-1e37-429e-8e55-17cb7c54865a)
权限管理：
![image](https://github.com/yeguouu/uuzx/assets/169153721/af225712-34a0-468b-a10a-ace02bb98276)
分配角色：
![image](https://github.com/yeguouu/uuzx/assets/169153721/e6c9fdab-f5bd-4e28-ab8a-d8667cce1f1f)
分配权限：
![image](https://github.com/yeguouu/uuzx/assets/169153721/d7c1a56e-e17c-46cd-823f-9149b2a50016)
商品管理：
![image](https://github.com/yeguouu/uuzx/assets/169153721/fe9582cf-5f84-4e62-a8ce-f48c3e9213f5)
sku商品管理：
![image](https://github.com/yeguouu/uuzx/assets/169153721/2a7487e5-26b9-488f-977d-32f90b2fa356)
全屏模式：
![image](https://github.com/yeguouu/uuzx/assets/169153721/4131c3ee-f77f-4b95-9dfc-7d7256bf8cb3)
暗黑模式：
![image](https://github.com/yeguouu/uuzx/assets/169153721/b09e869c-62e4-4e75-878d-edf1b3533db4)
主题颜色设置：
![image](https://github.com/yeguouu/uuzx/assets/169153721/1b69d6d9-9a95-4b43-940a-3c207d9a5465)
