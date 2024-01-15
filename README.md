<!--
 * @Author: wj
 * @Date: 2024-01-02 14:23:52
 * @LastEditors: wj_advance
 * @LastEditTime: 2024-01-09 11:15:20
 * @FilePath: /tm-vue3-vite-ts/README.md
 * @Description:
-->
<div align="center">
 <p align="center">
     <a href="https://v3.vuejs.org/" target="_blank">
         <img src="https://img.shields.io/badge/vue.js-vue3.x-green" alt="vue">
     </a>
     <a href="https://element-plus.gitee.io/#/zh-CN/component/changelog" target="_blank">
         <img src="https://img.shields.io/badge/element--plus-%3E2.0.0-blue" alt="element plus">
     </a>
  <a href="https://www.tslang.cn/" target="_blank">
         <img src="https://img.shields.io/badge/typescript-%3E4.0.0-blue" alt="typescript">
     </a>
  <a href="https://vitejs.dev/" target="_blank">
      <img src="https://img.shields.io/badge/vite-%3E2.0.0-yellow" alt="vite">
  </a>
 </p>
 <p>&nbsp;</p>
</div>

#### 🌈 介绍

基于 vue3.x + CompositionAPI setup 语法糖 + typescript + vite + element plus + vue-router-next + pinia 技术，适配手机、平板、pc 的后台开源免费模板，希望减少工作量，帮助大家实现快速开发。

#### 🏭 环境支持

| Edge      | Firefox      | Chrome      | Safari      |
| --------- | ------------ | ----------- | ----------- |
| Edge ≥ 79 | Firefox ≥ 78 | Chrome ≥ 76 | Safari ≥ 12 |

> 由于 Vue3 不再支持 IE11，故而 ElementPlus 也不支持 IE11 及之前版本。

#### ⚡ 使用说明

建议使用 yarn. <a href="http://nodejs.cn/" target="_blank">node 版本 > 18.12.1+</a>

```bash
# 克隆项目
git clone https://github.com/wangjian199294/tm-vue3-vite-ts.git

# 进入项目
cd tm-vue3-vite-ts

# 安装依赖
yarn

# 运行项目
yarn dev

# 打包发布
yarn build
```

#### 📚 自动生成功能模块

```bash
npx plop setModule

输入要创建的文件路径,支持多级目录
```
