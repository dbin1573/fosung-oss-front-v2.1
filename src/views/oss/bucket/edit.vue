<template>
    <el-dialog append-to-body close-on-click-modal :title="title" :visible.sync="visible" width="420px" @closed="dialogCloseHandler">
        <el-form :ref="editFormRef" :model="formData" label-width="52px" :rules="rules" @submit.native.prevent>

            <el-form-item label="名称" prop="name">
                <el-input type="text" :disabled="readonly" v-model="formData.name" placeholder="请输入空间名称"></el-input>
            </el-form-item>

        </el-form>

        <template slot="footer">
            <el-button type="primary" class="button-wide" @click="submitHandler">提交</el-button>
            <el-button class="button-wide" @click="dialogCloseHandler">关闭</el-button>
        </template>
    </el-dialog>
</template>

<script>
    export default JBoot({
        data (){
            return {
                moduleName: 'bucket',
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
            afterInitFormData (response = {}){
                this.$set(this.formData, 'num', response.num || 999);

                if(this.parentParam.parentNode){
                    if(!this.parentParam.parentNode.id){
                        this.$error('未获取到父节点id标识');
                        this.visible = false;
                        this.parentParam = {};
                    }else{
                        this.$set(this.formData, 'parentId', this.parentParam.parentNode.id);
                    }
                }else if(!this.parentParam.id){
                    this.$set(this.formData, 'parentId', 0);
                }
            }
        }
    }).form().build();
</script>
