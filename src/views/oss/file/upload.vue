<template>
    <el-dialog :before-close="closeHandler" :title="title" :visible.sync="visible" append-to-body
               class="upload-dialog-warp"
               width="430px">

        <div style="padding: 10px">
            <el-upload
                    :action="ossPath"
                    :on-success="refreshHandler"
                    class="upload-demo"
                    drag
                    multiple
                    ref="ossUpload">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>

        </div>


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
            show(title = "Dialog", bucket, directory) {
                this.visible = true;
                this.title = title;

                this.buildPath(bucket, directory);
            },

            buildPath(bucket, directory) {
                let path = "/api/oss/single/" + bucket + "/upload";
                path += "?directory=" + directory || "/";
                this.$set(this, "ossPath", path);
            },

            refreshHandler() {

                this.$emit("refreshList");
            },
            closeHandler() {
                this.visible = false;
                this.$getRef("ossUpload").clearFiles();

                this.refreshHandler();
            }
        },

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
