<template>
    <el-dialog :title="title" :visible.sync="visible" @closed="dialogCloseHandler" append-to-body close-on-click-modal
               width="520px">
        <el-form :model="formData" :ref="editFormRef" :rules="rules" @submit.native.prevent label-width="70px">


            <el-form-item label="文件地址" prop="directory" v-if="parentParam.id">
                <el-input id="fileUrl" placeholder="文件地址" readonly type="text" v-model="formData.url"></el-input>
            </el-form-item>

            <el-form-item label="名称" prop="directory" v-else>
                <el-input :disabled="readonly" placeholder="请输入目录名称" type="text" v-model="formData.name"></el-input>
            </el-form-item>


        </el-form>

        <template slot="footer">
            <el-button @click="copeHandler" class="button-wide" type="primary" v-if="parentParam.id">复制</el-button>
            <el-button @click="submitHandler" class="button-wide" type="primary" v-else>提交</el-button>
            <el-button @click="dialogCloseHandler" class="button-wide">关闭</el-button>
        </template>
    </el-dialog>
</template>

<script>
    export default JBoot({
        data() {
            return {
                moduleName: 'file',
                editFormRef: 'dictEditFormRef',
                rules: {
                    name: [
                        {required: true, message: '请输入目录名称'},
                        {min: 1, max: 225, message: '目录名称为1~225个字符'},
                    ]
                }
            }
        },

        methods: {
            /**
             * 没法初始化formData
             */
            afterInit() {

            },
            /**
             * 可以初始化 formData
             * @param response
             */
            afterInitFormData(response = {}) {

                this.formData.bucketName = this.parentParam.bucketName;
                this.formData.type = "dir";
                this.formData.directory = this.parentParam.directory;

            },

            copeHandler() {
                this.docCopy("fileUrl");

                this.$notify({
                    type: 'success',
                    title: "内容复制成功，去粘贴看看！",message:"OSS"});
            },

            docCopy(id) {
                let obj = document.getElementById(id);
                obj.select();
                document.execCommand("Copy");

            }

        }
    }).form().build();
</script>
