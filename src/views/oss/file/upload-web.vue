<template>
    <div class="upload-window-index-wrap">
        <el-dialog :visible.sync="visible" append-to-body custom-class="upload-window-dialog" :close-on-click-modal="false" @closed="dialogCloseHandler">
            <template slot="title"><span style="color:#fff">上传文件</span></template>
            <div class="select-button-wrap">
                <el-button id="uploadButton" class="list-button" :class="{ 'list-button-orange': !isMaxFile }" style="background-color:#FF4E00;border-color:#FF4E00" disabled="disabled">选择文件</el-button>
                <span>（{{ fileList.length }}/{{ maxFile }}）</span>
                <!--<span>{{catalogue.substr(1)}}</span>-->
            </div>

            <div class="file-list-wrap">
                <!--				<p class="title">文件列表</p>-->
                <ul class="title">
                    <li class="clearFloat">
                        <div class="name">文件名称</div>
                        <div class="size">文件大小</div>
                        <div class="process">上传进度</div>
                        <div class="speed">上传速度</div>
                        <div class="type">文件类型</div>
                        <div class="delete">操作</div>
                    </li>
                </ul>
                <ul class="file-list">
                    <template v-if="fileList.length > 0">
                        <li v-for="(item, index) in fileList" :key="index" class="clearFloat">
                            <el-tooltip effect="dark" :content="item.name" placement="top-end">
                                <div class="name">{{ item.name }}</div>
                            </el-tooltip>
                            <el-tooltip effect="dark" :content="fileSize(item.size)" placement="top-end">
                                <div class="size">{{ fileSize(item.size) }}</div>
                            </el-tooltip>
                            <el-tooltip effect="dark" :content="(item.percentage === 1 ? 100 : item.process) + '%'" placement="top-end">
                                <div class="process">{{ item.percentage === 1?100:item.process }}%</div>
                            </el-tooltip>
                            <el-tooltip effect="dark" :content="item.percentage === 1 ? 0 : item.speed+''" placement="top-end">
                                <div class="speed">{{ item.percentage === 1 ? 0 : item.speed }}</div>
                            </el-tooltip>
                            <el-tooltip effect="dark" :content="item.ext" placement="top-end">
                                <div class="type">{{ item.ext }}</div>
                            </el-tooltip>

                            <div class="delete"><i v-if=" item.process !== 100  " class="el-icon-close" @click="confirmRemove(item)" /></div>
                        </li>
                    </template>
                    <li v-else="" class="empty-wrap">
                        <img src="~@/assets/layout/empty.png" alt="暂未选择文件" />
                        <p>暂未选择文件</p>
                    </li>
                </ul>
            </div>

            <template slot="footer">
                <el-button @click="dialogCloseHandler">关闭</el-button>
                <el-button v-if="fileList.length > 0" class="list-button list-button-orange" @click="handleStartUpload">开始上传</el-button>
            </template>
        </el-dialog>

        <transition name="el-fade-in">
            <div class="fixed-upload-wrap" v-if="isStartUpload && !this.visible && fileList.length > 0" @click="handleShowWindow">
                <i class="el-icon-upload"></i>
                <p>{{ uploadProcess== 100.00?100:uploadProcess }}%</p>
            </div>
        </transition>
    </div>
</template>

<script>
    export default JBoot({

        props: {
            // ['data'],
            catalogue:{
                type:String,
                required:true
            },
            bucketName:{
                type:String,
                required:true
            },
            accept: {
                type: String,
                default: 'VIDEO,text,image'
            },
            multiple: {
                type: Boolean,
                default: false
            },
            maxFile: {
                type: Number,
                default: 5
            },

        },

        data() {
            return {
                moduleName: 'file',
                fileList: [],
                num:1,
                uploadThreads: 2, // 执行上传的连接数量
                uploadProcess: 0,
                isStartUpload: false,
                uploader: null,
                percentages:{},  // 所有文件的进度信息，key为file id
                timer:{},
                //uploadMsg: catalogue
            };
        },

        computed: {
            isMaxFile() {
                return this.fileList.length >= this.maxFile;
            },
            chunkInitUrl(){
                return this.otherInfo.oss.url + '/api/oss/' + this.bucketName + '/chunk/init'
            },
            chunkCheckUrl(){
                return this.otherInfo.oss.url + '/api/oss/' +this.bucketName + '/chunk/check'
            },
            chunkUploadUrl(){
                return this.otherInfo.oss.url + '/api/oss/' + this.bucketName + '/chunk/upload'
            },
            chunkCompleteUrl(){
                return this.otherInfo.oss.url + '/api/oss/' + this.bucketName + '/chunk/complete'
            }
        },
        created(){
           // console.log('？？？？？？',this.catalogue)

            /*if (this.catalogue==''){
                this.catalogue =''
                //this.$set(this, 'catalogue',123);
            }*/
           // console.log(111111,this.catalogue)
        },
        methods: {
            //注册上传时间点触发函数
            initWebUploadregister(webuploader) {
               // console.log("初始化事件绑定")
                //console.log(this.catalogue+'/')
                let vm = this;
                webuploader.Uploader.register(
                    {
                        'before-send-file': 'beforeSendFile',
                        'before-send': 'beforeSend',
                        'after-send-file': 'afterSendFile'
                    },
                    {
                        beforeSendFile: function(file) {
                            let deferred = webuploader.Deferred();
                            if(!file.isInit){
                                file.isInit = true;

                               // console.log(111)
                                vm.uploader.md5File(file,0,5*1024*1024).then(function (val) {
                                   // console.log(222)

                                    //MD5格式：/resource/组织机构id/文件md5-文件长度.格式 $
                                    file.fileMd5 = vm.catalogue.substr(1);//"resource-oss"
                                   // console.log('**************',file.fileMd5 )
                                    let path = file.fileMd5
                                    if(path =='/'){
                                        path =''
                                    }else if(path ==''){
                                        path =''
                                    }else{
                                        path ='/'
                                    }
                                    /*let path = vm.catalogue
                                    if(path ==''){
                                        path =''
                                    }else if(path!==''){
                                        path ='/'
                                    }*/
                                    vm.$api(vm.moduleName, 'registerEvent', {
                                        url: vm.chunkInitUrl,
                                       // name: file.name,
                                        fileName:file.fileMd5 +path + file.name,
                                    }).then(response => {
                                       // console.log(333,response)
                                        if (response.data.exist) {
                                           // console.log('来了')
                                            //跳过上传
                                            file.process = 100;
                                            vm.percentages[ file.id ] = [file.size , 1];
                                            vm.num ++;
                                            vm.uploader.skipFile(file);
                                            vm.updateTotalProgress();
                                            //上传完成之后，去除该条数据
                                            file.isComplete = true;
                                            vm.removeFile(file);
                                            //保存文件信息
                                            //console.log('我要走保存接口了')
                                            if(response.data.storePath && response.data.storePath.length>0){
                                                vm.$emit("callFather")
                                                let path = vm.catalogue.substr(1)
                                                if(path =='/'){
                                                    path =''
                                                }else if(path ==''){
                                                    path =''
                                                }else{
                                                    path ='/'
                                                }
                                                //console.log('我要走保存接口了','')
                                                //vm.$emit("callFather")
                                              /*  vm.$api(vm.moduleName, 'saveMaterial', [
                                                    {
                                                        name: file.name,
                                                        file: file.fileMd5+path+file.name
                                                    }
                                                ]).then(response => {
                                                    vm.$message({
                                                        message: '上传成功',
                                                        type: 'success'
                                                    });
                                                    //console.log('我要走保存接口了')
                                                    vm.$emit("callFather")

                                                    vm.parentParam.success && vm.parentParam.success();
                                                });*/
                                            }
                                            //跳过上传
                                           /* vm.$message({
                                                message: '上传成功',
                                                type: 'success'
                                            });*/
                                            deferred.reject();
                                        } else {
                                            vm.percentages[ file.id ] = [0,0] ;
                                            //继续上传
                                           /* vm.$message({
                                                message: '上传成功2',
                                                type: 'success'
                                            });*/
                                         //   vm.$emit("callFather")
                                         //   console.log(1111111111111111111,response)
                                            file.uploadId = response.data.uploadId;
                                            deferred.resolve();
                                        }
                                    });
                                });
                            }else{
                                deferred.resolve();
                            }
                            return deferred.promise();
                        },
                        beforeSend: function(block) {
                            let deferred = webuploader.Deferred();
                          //  console.log(444)
                            let path = vm.catalogue.substr(1)
                            if(path =='/'){
                                path =''
                            }else if(path ==''){
                                path =''
                            }else{
                                path ='/'
                            }
                            vm.$api(vm.moduleName, 'registerEvent', {
                                url: vm.chunkCheckUrl,
                                uploadId: block.file.uploadId,
                                fileName: block.file.fileMd5+path +block.file.name,
                                partNumber: block.chunk,
                                partSize: block.end-block.start
                            }).then(response => {
                             //   console.log(555,response)
                              //  console.log(555)
                                if (response.data.exist) {
                                    /*vm.$message({
                                        message: '上传成功',
                                        type: 'success'
                                    });*/
                                    vm.$emit("callFather")
                                  //  console.log(666)
                                    //跳过上传
                                    deferred.reject();
                                } else {
                                    //继续上传
                                    /*vm.$message({
                                        message: '上传成功2',
                                        type: 'success'
                                    });*/
                                    deferred.resolve();
                                }
                            });
                            return deferred.promise();
                        },
                        afterSendFile: function(file) {
                            if( file.isComplete ){
                                return
                            }
                            file.isComplete = true;
                            let path = vm.catalogue.substr(1)
                            if(path =='/'){
                                path=''
                            }else if(path ==''){
                                path =''
                            }else{
                                path ='/'
                            }
                            vm.$api(vm.moduleName, 'registerEvent', {

                                url: vm.chunkCompleteUrl,
                                uploadId: file.uploadId,
                                fileName: file.fileMd5+path+file.name,
                            }).then(response => {
                               // vm.$emit("callFather")
                             //   console.log('<<<<<<<<<<<',response)
                             //   console.log(666)
                                if (response.success) {
                                    file.process = 100;
                                    vm.num ++;
                                    vm.updateTotalProgress();
                                    vm.percentages[ file.id ] = [ file.size, 1 ] ;
                                    //上传完成之后，去除该条数据
                                    vm.removeFile(file);
                                    //保存文件信息
                                    if(response.data.storePath && response.data.storePath.length>0){
                                        vm.$emit("callFather")
                                        let path = vm.catalogue.substr(1)
                                        if(path =='/'){
                                            path =''
                                        }else if(path ==''){
                                            path =''
                                        }else{
                                            path ='/'
                                        }
                                       /* vm.$api(vm.moduleName, 'saveMaterial', [
                                            {
                                                name: file.name,
                                                file: file.fileMd5 +path+file.name
                                                /!*  storePath: response.data.storePath,
                                                  materialType: vm.accept,
                                                  orgId: vm.otherInfo.manageOrgId*!/
                                            }
                                        ]).then(response => {
                                         //   console.log(777,response)
                                          //  console.log(777)
                                            vm.$message({
                                                message: '上传成功',
                                                type: 'success'
                                            });
                                            vm.$emit("callFather")
                                            vm.parentParam.success && vm.parentParam.success();
                                        });*/
                                    }

                                } else {
                                }
                            });
                        }
                    }
                );
            },
            //初始化上传
            initWebUpload(webuploader) {
                // uploader只初始化一次
                if( this.uploader ){
                    return
                }
                this.uploader = webuploader.create({
                    auto: false,
                    swf: '/static/webuploader/Uploader.swf', // swf文件路径
                    server: this.chunkUploadUrl , // 文件接收服务端
                    pick: {
                        id: '#uploadButton', // 选择文件的按钮
                        multiple: true, // 是否多文件上传 默认false
                        label: ''
                    },
                    accept: this.getAccept(this.accept), // 允许选择文件格式。
                    threads: this.uploadThreads ,
                    fileNumLimit: this.maxFile, // 限制上传个数
                    chunked: true, //分片上传
                    chunkSize: 10485760, //分片大小10M
                    duplicate: true, // 重复上传
                    chunkRetry: 5,
                    prepareNextFile: false //在上传当前文件时，准备好下一个文件,请设置成false，不然开启文件多选你浏览器会卡死
                });

                // 文件被加入队列之前触发	 ,相同文件名的不能重复添加
                this.uploader.on('beforeFileQueued', file => {
                    let exist = this.fileList.some((item, i) =>{
                        if(item.name == file.name){
                            return true;
                        }
                    })
                    if(exist){
                        this.$warn('文件已添加到上传列表');
                        return false;
                    }
                });

                // 文件被添加进队列时
                this.uploader.on('fileQueued', file => {
                    this.$set(file, 'process', 0);
                    this.$set(file, 'isInit', false);
                    this.$set(file, 'isComplete', false);

                    //上一秒的数据
                    this.$set(file, 'oldLoaded', 0);
                    this.$set(file, 'curLoaded', 0);
                    this.$set(file, 'speed', 0);

                    this.percentages[ file.id ] = [ file.size, 0 ];
                    this.fileList.push(file);
                    file.on('statuschange', function( cur, prev ) {
                        if ( cur === 'queued' ) {
                            //this.percentages[ file.id ][ 1 ] = 0;
                        }
                    })
                    //如果正在上传文件 再添加文件时，自动开始
                    if( this.isStartUpload){
                        this.uploader.upload(file);
                    }

                });

                // 文件移出队列时
                this.uploader.on('fileDequeued', file => {
                    if(!file.isComplete){//文件上传完成后，不删除总的上传进度信息，以免影响总进度
                        delete this.percentages[ file.id ];
                    }
                });

                //文件上传之前
                this.uploader.on('uploadBeforeSend', (block, data, headers) => {
                    let path = this.catalogue.substr(1)
                    if(path =='/'){
                        path =''
                    }else if(path ==''){
                        path =''
                    }else{
                        path ='/'
                    }
                   // console.log('uploadIduploadId',data)
                    data.uploadId = block.file.uploadId;
                    data.partNumber = block.chunk;
                    data.partSize = block.end-block.start;
                    data.fileName = block.file.fileMd5 +path +block.file.name;

                    // 设置文件开始上传的时间
                    block.file.startTime = new Date().getTime() ;
                    // 设置是否正在进行更新
                    block.file.updating = false
                });

                // 文件上传过程中创建进度条实时显示。
                this.uploader.on('uploadProgress', (file, percentage) => {
                    let currentTime = new Date().getTime() ;
                    // 计算时间间隔
                    let duration = currentTime - file.startTime ;
                    if( !duration || duration < 1000 || file.updating ){
                        return
                    }

                    // 上一次文件百分比
                    let lastPercentage = file.percentage || 0 ;
                    // 计算两次文件大小差值
                    let diffSize = ( percentage - lastPercentage ) * file.size ;
                    if(diffSize<0){
                        return
                    }

                    file.updating = true ;
                    // 查询速度，单位 B/s
                    let speed = ( diffSize * 1000 ) / duration ;
                    if( speed > ( this.uploadThreads * 1024 * 1024 ) ){
                        speed = ( Math.random() + this.uploadThreads -1 ) * 1024 * 1024 ;
                    }

                    // console.log(UtilDisplay.dateFormat('HH:MM:SS') +' , 计算百分比差值: ' + ( percentage - lastPercentage ) +" , 时间间隔: "+ duration + " : "+ speed )

                    file.speed = this.fileSize( speed ) + '/s';

                    // 更新文件的开始事件
                    file.startTime = currentTime ;

                    // 设置最新的百分比
                    file.percentage = percentage;

                    file.process = (percentage * 100).toFixed(2);

                    this.num ++;

                    if(JSON.stringify(this.percentages) != "{}"){
                        this.percentages[ file.id ] = [ file.size, percentage ] ;
                    }
                    if(percentage==1){
                        this.percentages[ file.id ] = [ file.size, 1 ] ;
                    }

                    this.updateTotalProgress();

                    file.updating = false
                });

                this.uploader.on("error", ( type ,file) =>{
                    let msg = '';
                    if (type=="Q_TYPE_DENIED"){
                        if(this.accept == 'text'){
                            msg = '只能上传文本格式文件';
                        }else if(this.accept == 'VIDEO'){
                            msg = '只能上传视频格式文件';
                        }else if(this.accept == 'image'){
                            msg = '只能上传图片格式文件';
                        }
                    }else if (type=='Q_EXCEED_NUM_LIMIT'){
                        msg = '最多只能上传'+this.maxFile+'个文件';
                    }
                    this.$warn(msg);
                });

                this.uploader.on( 'all', ( type ,file) =>  {
                    this.updateTotalProgress();
                });
            },
            //恢复初始化数据
            initData (){
                if(this.fileList.length === 0){
                    this.uploadProcess = 0;
                    this.isStartUpload = false;
                    this.percentages = {};
                    this.fileList = [];
                    this.visible = false;
                    clearInterval(this.timer);
                }
            },
            updateTotalProgress(){
                let loaded = 0;
                let total = 0;
                $.each( this.percentages, function( k, v ) {
                    total += v[ 0 ];
                    loaded += v[ 0 ] * v[ 1 ];
                } );
                this.uploadProcess =  ((total ? loaded / total : 0) * 100).toFixed(2);
            },
            fileSize(fileSize) {
                let arrUnit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
                    baseStep = 1024,
                    unitCount = arrUnit.length,
                    unitIndex = 0;
                while (fileSize >= baseStep && unitIndex < unitCount - 1) {
                    unitIndex++;
                    fileSize /= baseStep;
                }
                fileSize = fileSize.toFixed(2);
                return fileSize + ' ' + arrUnit[unitIndex];
            },

            // 开始上传
            handleStartUpload() {
                if (!this.uploader) {
                    return;
                }
                if (this.fileList.size < 1) {
                    return;
                }

                this.isStartUpload = true;
                this.visible = false;

                // 开始上传
                this.$nextTick(() => {
                    this.uploader.upload();

                    //定时调用后台方法，保持session
                    this.timer = setInterval(() => {
                        this.$api(this.moduleName, 'touch').then(response => {});
                    }, 1000*60*5)

                });
            },
            confirmRemove(file){
                this.$confirm('确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.removeFile(file);
                }).catch(() => {
                });
            },
            /**
             * 在队列中移除文件
             * @param file
             */
            removeFile(file) {
                this.uploader.removeFile(file);
                clearInterval(file.timer);
                this.fileList.splice(this.fileList.indexOf(file), 1);
                //恢复初始化数据
                this.initData();
            },

            getAccept(accept) {
                switch (accept) {
                    case 'text':
                        return {
                            title: 'Texts',
                            extensions: 'doc,docx,xls,xlsx,ppt,pptx,pdf,txt',
                            mimeTypes: '.doc,docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt'
                        };
                    case 'VIDEO':
                        return {
                            title: 'Videos',
                            extensions: 'mp4,MP4,avi,AVI,flv,FLV,rmvb,RMVB,mkv,MKV,rm,RM,3gp,3GP,wmv,WMV,mov,MOV,mpg,MPG,vob,VOB',
                            mimeTypes: '.mp4,.MP4,.avi,.AVI,.flv,.FLV,.rmvb,.RMVB,.mkv,.MKV,.rm,.RM,.3gp,.3GP,.wmv,.WMV,.mov,.MOV,.mpg,.MPG,.vob,.VOB'
                        };
                    case 'image':
                        return {
                            title: 'Images',
                            extensions: 'gif,jpg,jpeg,bmp,png',
                            mimeTypes: '.gif,.jpg,.jpeg,.bmp,.png'
                        };
                    default:
                        return accept;
                }
            },

            handleBeforeShow() {
                setTimeout(() => {
                    // webuploader全局事件是否初始化完成
                    if( !UtilDisplay.globalConfig.initWebUpload ){
                        this.initWebUploadregister(WebUploader)
                        UtilDisplay.globalConfig.initWebUpload = true
                    }
                    this.initWebUpload(WebUploader);
                }, 1);
            },

            handleAfterClose() {},

            handleShowWindow() {
                this.visible = true;
            }
        },

        watch: {
            visible(v) {
                v ? this.handleBeforeShow() : this.handleAfterClose();
            }
        }
    }).store('otherInfo').form().build();
</script>

<style lang="scss">
    .upload-window-index-wrap {
        & > .fixed-upload-wrap {
            position: absolute;
            right: 35px;
            bottom: 55px;
            width: 78px;
            height: 78px;
            border-radius: 50%;
            border: 1px solid #ff4e00;
            background-color: #ffffff;
            color: #ff4e00;
            text-align: center;
            cursor: pointer;
            user-select: none;
            overflow: hidden;

            & > i {
                font-size: 48px;
                margin-top: 5px;
            }

            & > p {
                font-size: 14px;
                line-height: 16px;
                margin-top: -3px;
            }
        }
    }

    .upload-window-dialog {
        & > .el-dialog__body {
            padding-bottom: 15px !important;

            & > .file-list-wrap {
                margin-top: 10px;
                box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
                padding: 10px;

                /*& > .title {*/
                /*	font-weight: 500;*/
                /*	border-bottom: 1px solid #efefef;*/
                /*	margin-bottom: 10px;*/
                /*	color: #333333;*/
                /*}*/

                & > ul {
                    &.title{
                        border-bottom: 1px solid #efefef;
                        & > li{
                            margin-top: 0;
                            & > div{
                                &:not(:first-child) {
                                    border-left: 1px solid #f1f1f1;
                                }
                                &.name{
                                    font-weight: 300;
                                }
                            }
                        }
                    }
                    &.file-list{
                        height: 135px;
                    }
                    & > li {
                        line-height: 22px;
                        margin: 5px 0;

                        &.empty-wrap {
                            text-align: center;

                            & > img {
                                margin-top: 10px;
                                display: inline-block;
                                width: 100px;
                                height: 80px;
                            }

                            & > p {
                                font-size: 12px;
                                color: #e2e2e2;
                            }
                        }

                        & > div {
                            float: left;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            &:not(:first-child) {
                                margin-left: 10px;
                                text-align: center;
                                color: #6d6d6d;
                                font-weight: 300;
                            }
                        }

                        & > .name {
                            width: calc(100% - 81px * 4 - 51px - 10px * 5);
                        }

                        & > .size {
                            width: 80px;
                        }

                        & > .process {
                            width: 80px;
                        }

                        & > .speed {
                            width: 80px;
                        }

                        & > .type {
                            width: 80px;
                        }

                        & > .delete {
                            width: 50px;
                            & > i {
                                cursor: pointer;

                                &:hover {
                                    color: red;
                                }
                            }
                        }
                    }
                }
            }
            & > .select-button-wrap {
                & input[type='file'] {
                    display: none;
                }
                & > button{
                    padding: 0;
                    & .webuploader-pick {
                        width: 80px;
                        height: 28px;
                        line-height: 28px;
                        color: #ffffff;
                    }
                }
            }
        }
    }
</style>
