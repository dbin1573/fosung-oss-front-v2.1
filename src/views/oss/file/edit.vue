<template>
    <el-dialog append-to-body close-on-click-modal :title="title" :visible.sync="visible" width="520px" @closed="dialogCloseHandler">
        <el-form :ref="editFormRef" :model="formData" label-width="70px" :rules="rules" @submit.native.prevent>


            <el-form-item v-if="parentParam.id" label="文件地址" prop="directory">
                <el-input type="text" :disabled="readonly" v-model="formData.url" placeholder="文件地址"></el-input>
            </el-form-item>

            <el-form-item v-else label="名称" prop="directory">
                <el-input type="text" :disabled="readonly" v-model="formData.name" placeholder="请输入目录名称"></el-input>
            </el-form-item>




        </el-form>

        <template slot="footer">
            <el-button v-if="parentParam.id" type="primary" class="button-wide" @click="copeHandler">复制</el-button>
            <el-button v-else type="primary" class="button-wide" @click="submitHandler">提交</el-button>
            <el-button class="button-wide" @click="dialogCloseHandler">关闭</el-button>
        </template>
    </el-dialog>
</template>

<script>
    export default JBoot({
        data (){
            return {
                moduleName: 'file',
                editFormRef: 'dictEditFormRef',
                rules: {
                    name: [
                        { required: true, message: '请输入字典名称' },
                        { min: 1, max: 225 , message: '字典名称为1~225个字符' },
                    ],
                    code: [
                        { required: true, message: '请输入字典编码' },
                        { min: 1, max: 225 , message: '字典编码为1~225个字符' },
                    ],
                    num: [
                        { required: true, message: '请输入字典排序' }
                    ],
                    remark: [
                        { min: 0, max: 225, message: '描述最多允许输入225个字符' }
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
            afterInitFormData (response = {}){

                this.formData.bucketName = this.parentParam.bucketName;
                this.formData.type = "dir";
                this.formData.directory = this.parentParam.directory;


            },

            copeHandler() {

                this.$notify({type:'success',
                        title: 'hi', message: 'DBin' });
            }

        }
    }).form().build();
</script>
