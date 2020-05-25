<template>
    <el-dialog append-to-body :title="title" :visible.sync="visible" class="upload-dialog-warp" center width="500px">

        <el-upload
                :action="ossPath"
                class="upload-demo"
                drag
                multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>


    </el-dialog>


</template>

<script>
    export default JBoot({
        data() {
            return {
                visible: false,
                ossPath: ""
            }
        },
        methods: {
            show(title = "Dialog", bucket) {
                this.visible = true;
                this.title = title + " " + bucket;
                let path = "/api/oss/single/" + bucket + "/upload";

                this.$set(this, "ossPath", path);
            }
        }
    })
        .store("otherInfo")
        .form()
        .build();
</script>

<style lang="scss">
    .upload-dialog-warp {
            padding-bottom: 20px;
        & > .upload-demo {
        }
    }

</style>
