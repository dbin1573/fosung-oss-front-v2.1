<template>
    <ListLayout title="字典管理">
        <el-button slot="top-right" type="primary" plain @click="createHandler(`新增字典项`)">新增</el-button>

        <el-table slot="table" :ref="tableRef" :data="page.list" height="100%" >

            <el-table-column show-overflow-tooltip label="空间名称" prop="name"></el-table-column>
            <el-table-column label="创建时间" width="142px">
                <template slot-scope="props">
                    {{props.row.createTime | dateFormat('yyyy-MM-dd hh:mm:ss')}}


                </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="props">
                    <el-button class="in-table-button"
                               @click="editHandler(props.row.id, `编辑【${props.row.name}】字典项`)">编辑

                    </el-button>
                    <el-button class="in-table-button"
                               @click="deleteHandler({ id: props.row.id })">删除

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

        data (){
            return {
                moduleName: 'bucket',
            }
        },

        methods: {
            //初始化page数据
            // initPageInfo (response){
                // let list = [];
                //
                // if(response && this.$getObjectType(response) !== '[object object]'){
                //     list = response;
                // }
                //
                // this.$set(this, 'page', { list });
            // },

            // handleLoad (row, treeNode, resolve){
            //     this.$api('dict', 'queryChildren', { parentId: row.id }).then(response => {
            //         resolve(response.data || []);
            //     });
            // }
        }
    }).module("pager")
        .list()
        .build();
</script>
