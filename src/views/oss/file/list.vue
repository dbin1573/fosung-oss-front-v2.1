<template>
    <ListLayout class="layout-window-warp" title="文件管理">

        <el-select @change="checkBucket" filterable slot="top-right" v-model="queryFormData.bucketName">
            <el-option :key="index"
                       :label="item.name"
                       :value="item.name"
                       v-for="(item,index) of buckets"
            >
            </el-option>
        </el-select>
        <el-button @click="uploadHandler(`上传文件`)" plain slot="top-right" type="primary">上传</el-button>
        <el-button
                @click="createHandler(`新建目录`,{bucketName:queryFormData.bucketName,directory: directory })"
                plain slot="top-right" type="primary">新建目录
        </el-button>

        <div class="block-box-shadow" slot="table">
            <div class="dbin-top-red-line"></div>
            <span style="float:left">当前位置:</span>
            <el-breadcrumb separator="/" class="dbin-center">
                <el-breadcrumb-item :key="index" v-for="(item,index) of directory">
                    <span class="box-hand box-padding">{{item}}</span>
                </el-breadcrumb-item>
            </el-breadcrumb>


        </div>
        <el-table :data="page.list" :ref="tableRef" height="100%" slot="table">


            <el-table-column label="名称" prop="name" show-overflow-tooltip>
                <template slot-scope="props">
                    <span @click="openFolderHandler(props.row)" class="box-hand">
                        {{props.row.name}}&nbsp;&nbsp;
                            <ev-iconFont icon="icon-folder" v-if="props.row.type==='dir'"></ev-iconFont>
                            <ev-iconFont icon="icon-wenjian" v-else></ev-iconFont>

                    </span>
                </template>
            </el-table-column>
            <el-table-column label="类型" prop="type" show-overflow-tooltip>
                <template slot-scope="props">
                    {{props.row.type==="dir"?"目录":"文件"}}

                </template>
            </el-table-column>
            <el-table-column label="大小" prop="size" show-overflow-tooltip>
                <template slot-scope="props">
                    {{props.row.size}} M
                </template>
            </el-table-column>

            <el-table-column label="创建时间" width="142px">
                <template slot-scope="props">
                    {{props.row.createDatetime | dateFormat('yyyy-MM-dd hh:mm:ss')}}


                </template>
            </el-table-column>
            <el-table-column label="操作" width="300">
                <template slot-scope="props">

                    <el-button @click="deleteHandler({ id: props.row.id })"
                               class="in-table-button">删除
                    </el-button>

                    <el-button @click="detailHandler(props.row.id,'获取链接')" class="in-table-button"
                               v-if="props.row.type!=='dir'">获取链接
                    </el-button>

                    <el-button @click="openFolderHandler(props.row)" class="in-table-button"
                               v-else>打开
                    </el-button>


                </template>
            </el-table-column>
        </el-table>
<div slot="page">
    hisdfpage
</div>
        <!--<el-pagination slot="page" background layout="total, prev, pager, next" :total="page.total"
                       :page-size="page.pageSize"
                       @current-change="pageNoToggleHandler"
                       @size-change="pageSizeToggleHandler"></el-pagination>
-->

        <edit :ref="dialogRef"></edit>
        <upload-file @refreshList="refreshQuery" ref="uploadFileRef"></upload-file>
    </ListLayout>
</template>

<script>
    export default JBoot({
        components: {
            'edit': require('./edit.vue').default,
            'upload-file': require('./upload.vue').default
        },

        data() {
            return {
                moduleName: 'file',
                bucketName: "",
                buckets: [],

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
                // this.$api('dict', 'queryChildren', {parentId: row.id}).then(response => {
                //     resolve(response.data || []);
                // });
            },

            afterInit() {
                this.$set(this,"directory",["/"])
            },

            //获取查询条件
            getQueryParam() {
                if (!this.queryFormData.bucketName) {
                    return this.queryBuckets();
                }

                let directory = this.directory;
                for (let directoryElement of directory) {
                    this.getQueryParam().directory += directoryElement + "/";
                }

                return this.queryFormData;
            },

            openFolderHandler(data) {
                if (data.type !== "dir") {
                    this.detailHandler(data.id,'获取链接');
                    return;
                }
                this.directory.push(data.name);
                // this.queryFormData.directory = data.directory + data.name;
                this.refreshQuery();
            },
            refreshQuery() {

                this.queryHandler();
            },

            queryBuckets() {
                return new Promise(resolve => {
                    this.$api("bucket", "list")
                        .then(resp => {
                            let buckets = resp.datalist;
                            this.buckets = buckets;

                            let name = buckets[0].name;
                            this.queryFormData.bucketName = name;

                            resolve({bucketName: name})
                        });
                });

            },

            checkBucket(item) {

                let directory = this.directory;
                this.directory =  directory[0]|| ["/"];

                    this.$set(this.queryFormData, "bucketName", item);

                this.queryHandler();
            },

            uploadHandler(title) {
                let bucket = this.queryFormData.bucketName;

                this.$getRef("uploadFileRef").show(title, bucket);
            }

        }
    })  .module('pager')
        .list()
        .build();
</script>
<style lang="scss">
    .layout-window-warp {
        & .box-hand {
            cursor: pointer;
        }

        & .box-padding {
            /*padding: 15px 15px 15px 25px;*/
            padding: 10px 0px 10px 5px;
        }

        & .block-box-shadow {
            height: 23px;
            margin-bottom: 15px;
            padding-bottom: 7px;

            & > .dbin-top-red-line {
                background: #CC0000;
                width: 2px;
                height: 13px;
                margin: 5px 5px 5px 10px;
                display: inline-block;
                float: left;



            }

            .el-breadcrumb__item {
                float: left;
                margin-top: 5px;
                margin-bottom: 5px;
            }
        }




    }
</style>
