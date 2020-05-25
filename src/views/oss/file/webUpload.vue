<template>
    <div class="wu-example" id="uploader">
        <!--用来存放文件信息-->
        <div class="uploader-list" id="thelist"></div>
        <div class="btns">
            <div id="picker">选择文件</div>
            <button class="btn btn-default" id="ctlBtn">开始上传</button>
        </div>
    </div>
</template>

<script>
    export default JBoot({

        name: "webUpload",

        data() {
            return {}
        },
        methods:{
            initWebUpload() {
                var uploader = WebUploader.create({
                    auto: true,// 选完文件后，是否自动上传。
                    swf: './js/webuploader-0.1.5/Uploader.swf',// swf文件路径
                    server: 'http://receive.com/v1/book/upload',// 文件接收服务端。
                    dnd: '.upload-container',
                    pick: '#picker',// 内部根据当前运行是创建，可能是input元素，也可能是flash. 这里是div的id
                    multiple: true, // 选择多个
                    chunked: true,// 开起分片上传。
                    threads: 5, // 上传并发数。允许同时最大上传进程数。
                    method: 'POST', // 文件上传方式，POST或者GET。
                    fileSizeLimit: 1024*1024*100*10, //验证文件总大小是否超出限制, 超出则不允许加入队列。
                    fileSingleSizeLimit: 1024*1024*100, //验证单个文件大小是否超出限制, 超出则不允许加入队列。
                    fileVal:'epub', // [默认值：'file'] 设置文件上传域的name。
                });
            },
            uploadAddFile(file) {
                uploader.on( 'fileQueued', function( file ) {
                    // 选中文件时要做的事情，比如在页面中显示选中的文件并添加到文件列表，获取文件的大小，文件类型等
                    console.log(file.ext) // 获取文件的后缀
                    console.log(file.size) // 获取文件的大小
                    console.log(file);
                });
            },
            uploadProgress() {
                uploader.on( 'uploadProgress', function( file, percentage ) {
                    console.log(percentage * 100 + '%');
                });
            },

        }
    })
        .build();
</script>

<style scoped>

</style>
