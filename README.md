| 更新时间 | 更新人 | 更新内容 |
| -------- | ------ | -------- |
|2020-01-13|李涛|新增组件【tree-select】|
|2020-02-06|李涛|新增module 【pager】|
|2020-02-06|李涛|新增组件 【DrawerFormLayout】|
|2020-02-11|李涛|新增组件 【SearchMore】|
|2020-03-09|李涛|新增组件 【preview-pdf】|

## 组件【preview-pdf】的使用方式
描述：该组件主要用于pdf的预览

实例：
```vue
    <preview-pdf ref="previewPdfRef" @load="handleLoadPdfFinished"></preview-pdf>
```

使用方式：

```javascript
    this.$getRef('previewPdfRef').open('pdf的网络地址');
```

参数说明：

|参数名|描述|
|:---|:---|
|@load|pdf文档彻底加载完毕后触发的事件|
|title|预览框的标题 默认值为 PDF预览|
|width|预览框的宽度 默认值为 850px|

## 组件【SearchMore】的使用方式
描述：该组件用于在组件【ListLayout】下使用，主要用于查询条件过多时的展示。

使用前的准备：

    1.将本项目中的package.json文件中的jboot-env依赖版本，copy到自己项目中，删除掉node_modules并重新install。
    2.将src/components/layout目录下的ListLayout.vue、SearchMore.vue文件copy到自己的项目对应目录下。
    
示例:
```vue
    <ListLayout title="村民信息" :topRightWidth="635">
        <el-form slot="top-right" slot-scope="props" :ref="queryFormRef" inline class="search-form" :model="queryFormData" label-width="70px" @submit.native.prevent size="mini">
            <el-form-item prop="name" label-width="0">
                <el-input type="text" v-model="queryFormData.name" clearable style="width: 140px;" placeholder="人员姓名"></el-input>
            </el-form-item>
            <el-form-item prop="idCard" label-width="0">
                <el-input type="text" v-model="queryFormData.idCard" clearable style="width: 140px;" placeholder="身份证号"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" plain @click="queryHandler">查询</el-button>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" plain @click="props.toggleSearchMoreVisible()" icon="el-icon-sort">更多查询</el-button>
            </el-form-item>
        </el-form>

        <SearchMore slot="search-more" :model="queryFormData" :ref="queryFormRef">
            <el-form-item prop="name1" label="姓名">
                <el-input type="text" v-model="queryFormData.name1" clearable style="width: 140px;" placeholder="人员姓名"></el-input>
            </el-form-item>
            <el-form-item prop="idCard1" label="身份证">
                <el-input type="text" v-model="queryFormData.idCard1" clearable style="width: 140px;" placeholder="身份证号"></el-input>
            </el-form-item>
        </SearchMore>
    </ListLayout>
```

    1.添加【更多查询】按钮，按钮的click事件使用top-right插槽传入的【toggleSearchMoreVisible】函数，来切换更多查询条件的展示与隐藏。
    2.添加【SearchMore】组件，slot为固定的[search-more] 其中 [model]、[ref]属性，与上方的【el-form】组件一致。同时【SearchMore】组件由【el-form】扩展，支持该组件所有事件以及属性。

## module【pager】的使用方式

描述：主要用于兼容目前后台返回的分页形式。

示例：

```javascript
    export default JBoot({
        ...
    }).module('pager').list().build();
```

使用以上形式以后，就可以直接page.list拿到后台返回的数据。

## 【DrawerFormLayout】使用

描述：该组件主要用于form表单右侧弹出形式的封装。属性、事件与elementUI官方的【el-drawer】一致。

示例：

```vue
    <DrawerFormLayout
        :visible.sync="visible"
        size="800px"
        :title="title"
        @closed="dialogCloseHandler"
        class="personal-poor-info-wrap"
    ></DrawerFormLayout>
```

解释：

|参数名|描述|
|:---|:---|
|visible|使用.form()以后，自动拥有该属性，可直接使用。用来控制是否弹出。|
|title|使用.form()以后，自动拥有该属性，可直接使用。用来控制弹出框展示的标题|
|dialogCloseHandler|使用.form()以后，自动拥有该属性，可直接使用。用来处理弹出关闭吼得逻辑|

## 【tree-select】使用
示例：

```vue
<tree-select v-model="queryFormData.categoryId" :clearable="false" :options="categoryList" placeholder="请选择"></tree-select>
```

参数：

|参数名|描述|
|:---|:---|
|v-mode|@input与:value的语法糖|
|clearable|[Boolean default: true] 是否展示清空按钮|
|options|[Array default: []] select的数据源，数据源必须包含id(唯一主键，用作选中触发时绑定的值)、label(select显示的值)、children(子节点)|
|placeholder|[String default: undefined] 内容为空时，显示的提示语|
|searchable|[Boolean default: true] 是否允许输入内容过滤|
|valueFormat|[String default: 'id']触发选中操作时，传给@input事件的值，默认为id|
