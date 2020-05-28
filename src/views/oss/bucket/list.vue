<template>
    <ListLayout class="bucket-warp" title="字典管理">
        <el-button @click="createHandler(`新增字典项`)" plain slot="top-right" type="primary">新增</el-button>

        <el-table :data="page.list" :ref="tableRef" height="100%" slot="table">

            <el-table-column label="序号" type="index"></el-table-column>

            <el-table-column label="空间名称" prop="name" show-overflow-tooltip align="center"></el-table-column>

            <el-table-column label="创建时间" align="center">
                <template slot-scope="props">
                    {{props.row.createDatetime | dateFormat('yyyy-MM-dd hh:mm:ss')}}

                </template>
            </el-table-column>
            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="props">
                    <el-button @click="editHandler(props.row.id, `编辑【${props.row.name}】字典项`)"
                               plain type="primary">编辑

                    </el-button>
                    <el-button @click="deleteHandler({ id: props.row.id })"
                               plain type="danger">删除

                    </el-button>

                </template>
            </el-table-column>
        </el-table>

        <edit :ref="dialogRef"></edit>
    </ListLayout>
</template>

<script>
    export default JBoot({
        components: {
            'edit': require('./edit.vue').default
        },

        data() {
            return {
                moduleName: 'bucket',
            }
        },

        methods: {
            //初始化page数据
            // initPageInfo (response){

            // }
        }
    }).module("pager")
        .list()
        .build();
</script>
<style lang="scss">
    .bucket-warp {

    }
</style>
