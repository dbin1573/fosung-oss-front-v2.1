<template>
    <ListLayout class="layout-window-warp" title="文件管理">

        <div slot="top-right">
            <el-select @change="checkBucket" filterable v-model="queryFormData.bucketName">
                <el-option :key="index"
                           :label="item.name"
                           :value="item.name"
                           v-for="(item,index) of buckets"
                >
                </el-option>
            </el-select>
            <el-button @click="uploadHandler(`上传文件`)" plain type="danger">上传</el-button>

            <el-button
                    @click="createHandler(`新建目录`,{bucketName:queryFormData.bucketName })"
                    plain type="primary">新建目录
            </el-button>
        </div>
        <div slot="table" style="height: calc(100% - 40px)">
            <div class="block-box-shadow">
                <div class="dbin-top-red-line"></div>
                <span style="float:left">当前位置:</span>
                <el-breadcrumb class="dbin-center" separator="/">
                    <el-breadcrumb-item :key="index" v-for="(item,index) of directory">
                        <span @click="jumpDirPath(item,index)" class="box-hand box-padding">{{item}}</span>
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>


            <el-table :data="page.list" :ref="tableRef" height="100%">


                <el-table-column align="center" label="名称" prop="name" show-overflow-tooltip>
                    <template slot-scope="props">
                    <span @click="openFolderHandler(props.row)" class="box-hand">
<!--                            <ev-iconFont icon="icon-folde" v-if="props.row.type==='dir'"></ev-iconFont>-->
                        <!--                            <ev-iconFont icon="icon-file" v-else></ev-iconFont>-->
                            <i class="el-icon-folder-checked" v-if="props.row.type==='dir'"></i>
                            <i class="el-icon-document-copy" v-else></i>

                        {{props.row.name}}&nbsp;&nbsp;

                    </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="类型/大小" show-overflow-tooltip>
                    <template slot-scope="props">

                        <span v-if="props.row.type==='dir'">
                            目录
                        </span>
                        <span v-else>
                            {{props.row.size}} KB
                        </span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="创建时间">
                    <template slot-scope="props">
                        {{props.row.createDatetime | dateFormat('yyyy-MM-dd hh:mm:ss')}}


                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="300">
                    <template slot-scope="props">

                        <el-button @click="detailHandler(props.row.id,'获取链接')" plain type="primary"
                                   v-if="props.row.type!=='dir'">获取链接
                        </el-button>

                        <el-button @click="openFolderHandler(props.row)" plain type="primary"
                                   v-else>打开
                        </el-button>

                        <el-button @click="deleteHandler({ id: props.row.id })"
                                   plain type="danger">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>


        <el-pagination :page-size="page.pageSize" :total="page.total" @current-change="pageNoToggleHandler"
                       @size-change="pageSizeToggleHandler"
                       background
                       layout="total, prev, pager, next"
                       slot="page"></el-pagination>

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
                directory: ["/"],
            }
        },

        methods: {

            jumpDirPath(item, index) {
                let directory = this.directory;
                this.directory = directory.splice(0, index + 1) || [];
                this.queryHandler();

            },

            //获取查询条件
            getQueryParam() {
                if (!this.queryFormData.bucketName) {
                    return this.queryBuckets();
                }
                this.$set(this.queryFormData, "directory", this.getDirectory());

                return this.queryFormData;
            },

            openFolderHandler(data) {
                if (data.type !== "dir") {
                    this.detailHandler(data.id, '获取链接');
                    return;
                }
                this.directory.push(data.name);

                this.refreshQuery();
            },
            getDirectory() {

                let path = "";
                let directory = this.directory || [];
                for (let dir of directory) {
                    if (!dir || dir === "/") {
                        continue;
                    }

                    dir = this.getSlash(dir || "");

                    path += dir;
                }
                return path;
            },
            getSlash(addr) {
                if (addr.startsWith("/")) {
                    return addr;
                }
                return "/" + addr;
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

                            // todo 列表集合为空处理
                            let name = buckets[0].name || "";
                            this.queryFormData.bucketName = name;

                            resolve({bucketName: name})
                        });
                });

            },

            checkBucket(item) {
                this.directory.splice(1);

                this.$set(this.queryFormData, "bucketName", item);


                this.queryHandler();
            },

            uploadHandler(title) {
                let bucket = this.queryFormData.bucketName;
                let directory = this.getDirectory();

                this.$getRef("uploadFileRef").show(title, bucket, directory);
            }

        }
    }).module('pager')
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
