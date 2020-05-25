<template>
    <ListLayout title="文件管理">
        <el-select v-model="queryFormData.bucketName" @change="checkBucket" filterable slot="top-right">
            <el-option v-for="item of buckets"
                :key="item.id"
                :label="item.name"
               :value="item.name"
            >
            </el-option>
        </el-select>
        <el-button @click="uploadHandler(`上传文件`)" plain slot="top-right" type="primary">上传</el-button>
        <el-button @click="createHandler(`新建目录`,{bucketName:queryFormData.bucketName})" plain slot="top-right" type="primary">新建目录</el-button>

        <tree-table :data="page.list" :load="handleLoad" :ref="tableRef" @selection-change="selectionHandler" height="100%" lazy
                    slot="table">


            <el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="名称" prop="type" show-overflow-tooltip></el-table-column>
            <el-table-column label="大小" prop="size" show-overflow-tooltip></el-table-column>

            <el-table-column label="创建时间" width="142px">
                <template slot-scope="props">
                    {{props.row.createTime | dateFormat('yyyy-MM-dd hh:mm:ss')}}


                </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="props">
<!--                    <el-button @click="editHandler(props.row.id, `编辑【${props.row.name}】字典项`)"-->
<!--                               class="in-table-button">编辑</el-button>-->


                    <el-button @click="deleteHandler({ id: props.row.id })"
                               class="in-table-button">删除

                    </el-button>


                </template>
            </el-table-column>
        </tree-table>

        <create-dir :ref="dialogRef"></create-dir>
        <upload-file ref="uploadFileRef"></upload-file>

    </ListLayout>
</template>

<script>
    export default JBoot({
        components: {
            'create-dir': require('./createDir.vue').default,
            'upload-file': require('./upload.vue').default
        },

        data() {
            return {
                moduleName: 'file',
                bucketName: "",
                buckets: []
            }
        },

        methods: {
            // 初始化page数据
            // initPageInfo (response){
            //     let list = [];
            //
            //     if(response && this.$getObjectType(response) !== '[object object]'){
            //         list = response;
            //     }
            //
            //     this.$set(this, 'page', { list });
            // },

            handleLoad(row, treeNode, resolve) {
                this.$api('dict', 'queryChildren', {parentId: row.id}).then(response => {
                    resolve(response.data || []);
                });
            },
            afterInit() {

            },

            //获取查询条件
            getQueryParam (){
                if (!this.queryFormData.bucketName) {
                    return this.queryBuckets();

                }

                return this.queryFormData;
            },


            queryBuckets() {
                return new Promise(resolve => {
                    this.$api("bucket", "list")
                        .then(resp =>{
                            let buckets = resp.datalist;
                            this.buckets= buckets;

                            let name = buckets[0].name;
                            this.queryFormData.bucketName=name;

                            resolve({bucketName:name})
                        });
                });

            },

            checkBucket(item) {
                // this.queryFormData.bucketName = item.name;

                this.$set(this.queryFormData, "bucketName", item);

                this.queryHandler();
            },

            uploadHandler(title) {
                let bucket = this.queryFormData.bucketName;

                this.$getRef("uploadFileRef").show(title,bucket);
            }

        }
    }).module('pager')
        .list()
        .build();
</script>
