# 电商平台数据可视化实时监控系统

线上预览地址：http://8.133.167.153/e-shop

一个简单的电商数据可视化展板，主要用来练习echart的使用和websocket的学习。

![image-20211112100632203](http://img.mogy.top/image-20211112100632203.png)

## 🍕 特性

- ✨ 使用了Websocket，保证数据的实时性
- 🎉 动画效果动态切换
- 🖥 动态更换主题(联动)
- 🎄  全屏切换(联动)
- 🎈  可以多页面之间进行联动(Websocket实现)

## 🔧 技术栈

#### 前端

- 框架：Vue 2
- 组件库：echart
- 请求：WebSocket
- 路由：Vue Router
- 状态管理：Vuex

#### 后端

- 开发框架：koa 2
- 数据推送：WebSocket
- 数据存储：js文件(暂时写死后期整合后台管理项目再接上数据库)

#### 部署

- 前端：Apache + Linux Server
- 后端：koa2 + forever + Linux Server



## 🔗 项目运行

#### 克隆代码

```js
git clone https://github.com/mgy1021/e-shopChart.git
```

#### 安装依赖

```
yarn install
```

#### 运行项目
```
yarn serve
```

#### 项目打包
```
yarn build
```
