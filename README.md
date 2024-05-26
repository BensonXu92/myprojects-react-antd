#  myprojects-react-antd  项目

## 项目： 
    我的项目集（react + Ant Design）
## 项目描述：
    个人项目集合，前端框架  react + Ant Design
    31岁，自学转前端开发，做项目学习、复习、展示。
## 项目 展示网址
    http://43.138.234.27/

##### 不足之处，敬请谅解
持续完善中~~~    



# 一 创建项目
使用 vscode，基于 react框架
## 1 创建项目 并启动
vscode打开桌面目录，在终端执行命令：（默认前置条件满足）

npx create-react-app  myprojects-react-antd  -y     

vscode打开hotel-manager-react目录

npm start

### 删除public/和src/文件夹内多余的文件。保留如下
    public/
        favicon.ico
        index.html
    src/
        App.js
        index.css
        index.js

## 2 安装依赖包

npm i react-router-dom axios  antd sass 
安装字体图标包
npm install @ant-design/icons --save

## 3  配置  src目录结构
    [文件夹]
        api     接口js
        assets  图片等媒体文件
        config  配置信息
        components  工具复用类组件
        utils   工具js
        views   页面组件
    [文件]
        app     根组件
        index     入口js

## 4 配置index  app   
app中导入Home组件，
Home 为主页。

# 二 组件开发
主要基于 Ant-Design组件

## 1 Home组件 主页

### 设置布局  
    上中下   footer组件信息直接保留。
####    背景满屏高度    
    高度不够，在Layout内用div 高度为100vh支撑。
    内容以 卡片 形式展示。使用flex布局。限制最小宽度。

## 2 配置 路由
    主页 
        酒店管理系统
        同步带周长计算
        ……
        项目卡

    配置路由导入项目卡的项目

## 3 项目卡项目 开发
    项目卡 位于主页的内容框

######   先完成一个简单的项目
### 3.1 同步带周长计算  小工具
    Tbd组件
    源于 朋友的一个小诉求。
    用Ant Design中的flex布局，完成组件。

### 3.2 酒店后台管理 项目


# 三 项目开发

# 酒店后台管理 项目
    HAdmin 组件
    主体在  HAdmin 组件
## 1 配置 管理系统 

##### api 接口
    （后端需配置跨域，axios不要header参数。）
    adminApi.js     导出 $login 用于发起登录axios

##### config  配置信息
    index.js     导出 baseUrl 等配置信息

##### views 组件
    页面级别组件

##### utils   工具
    request.js     导出axios实例 instance 提供给 api js使用

## 2  HLogin 登录组件
    HAdmin 组件  主页中，先判断登录状态，
        未登录 进入HLogin 登录组件。
    
    import { Button, Form, Input,notification } from 'antd';

### 2.1 登录样式
Button, Form, Input

### 2.2 登录接口
    api/adminApi.js
    config/
    utils/request.js

### 2.3 登录样式
    notification

### 2.4 登录跳转
    api提供 token
    数据持久化      (localStorage.setItem)
    跳转 HAdmin 主页   (useNavigate  setTimeout)

## 3 HAdmin 组件  布局

### 3.1 布局  sider
    Layout组件 选择侧栏 调整样式
    vh/vw布局，不能写宽100%
    调整 header颜色
    发现一个问题，组件化开发，用style绑定，完全可以脱离外联的css
### 3.2 header

#### 导航    按钮  
    使用主题色
    调整menu的item 注意避免冲突
    绑定点击事件切换选择项
    字体图标
#### 退出登录  功能
######   token存在，页跳转系统页
    点击退出后清除token
    使用modal加强退出确认。

######   token不存在，跳转登录页
    点击退出后清除token

### 3.3 content组件 
    设置路由 
#### 3.3.1 role 角色组件
    roleApi  get 角色数据
        角色编号    角色名称
        获取数据，布局
##### 添加 角色
    添加 按钮
    Drawer 抽屉  只需要一个信息 

###### 抽离提示框
    MyNotification
    重构 login 提示，配置 role 添加角色提示

######   后端建立角色表 
    roles		(id	roleId	roleName	submit_date )
    重置api 获取 roles

######   调整
    关闭抽屉后应该重置 输入框   form.setFieldsValue({roleName:''})   
    提示添加成功 MyNotification

######   后端 调整
    后端创建 自增id 默认设置  返回值不是数字，调整一下
    /addrole  api  执行成功，可以给roles表，添加角色。

###### 编辑 和 删除 
    编辑 删除  按钮，每列
    表格 render: (ret) 中，ret指代渲染组件当前行数据，指向 这条数据
        {id: 1, roleId: 1, roleName: '系统管理员', submit_date: '2024-05-09', key: 1}
        ret 可以换其他变量，统一用法就可以了。
        
    后端增加删除api   

######    删除 promise后，再更新。
    
        const onDel= async (e)=>{
            await $delrole(e)
            refreshData()
        }

######   优化后端api  
    数据库操作： sql  执行
##### 保护1号管理员
    1号角色不能删，其他都能删除。
    ID 1 的删除按钮 不可用。
    1号角色 禁用 编辑 和 删除 按钮

##### 限制 角色 数量
    限制成10个角色。




# 后续开发思路

    编辑修改，角色名称。
    
## 3 HAdmin 组件  布局
### 3.1 布局  sider
######