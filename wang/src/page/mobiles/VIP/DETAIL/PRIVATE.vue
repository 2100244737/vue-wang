<template>
    <div class="mobileLifeStyle">
        <!--内容区域-->
        <div class="mobileContentBox">
            <!--头部标题-->
            <div class="mobileHeadLine">
                <div class="mobileTitleText">{{$t('vipPrivate.title')}}</div>
                <div class="mobileHeadLine_right">
                    <span class="cursorPointer">
                        <img @click="prevBtn" src="../../../../assets/img/common/data_02.png" alt="">
                    </span>
                    <span class="number">{{addEdit.year}}</span>
                    <span class="cursorPointer">
                        <img @click="nextBtn" src="../../../../assets/img/common/data_01.png" alt="">
                    </span>
                </div>
            </div>
            <!--固定账号输入-->
            <div v-if="fixedUserArr.indexOf(userId) !== -1" class="lifeStyle_InputBox">
                <!--                <div id="editor" class="wangEditor"></div>-->
                <el-input
                    type="textarea"
                    :rows="15"
                    resize="none"
                    v-model="formItem.textarea"/>
                <ul class="optionsBox clearFix">
                    <li id="optionsPhoto"
                        :class="isActive === 'photo' ? 'is-active': ''"
                        @click="clickUpload('photo')">
                        <i class="el-icon-picture fontSize14"></i>
                        <span class="rightSpan">照片</span>
                    </li>
                    <li id="optionsVideo"
                        :class="isActive === 'video' ? 'is-active': ''"
                        @click="clickUpload('video')">
                        <i class="el-icon-video-camera fontSize14"></i>
                        <span class="rightSpan">视频</span>
                    </li>
                    <li class="fr">
                        <el-button size="small" @click="addData" type="primary">发布</el-button>
                    </li>
                </ul>
                <!--显示-->
                <div v-if="isActive === 'photo'">
                    <el-upload
                        class="marginBottom20"
                        ref="imgFile"
                        :action="this.$api.root() + 'upload/upload'"
                        list-type="picture-card"
                        name="file"
                        :limit="9"
                        :accept="formItem.accept"
                        :before-upload="beforeUploadImg"
                        :on-success="handleSuccessImg"
                        :on-error="handleErrorImg"
                        :on-remove="handleRemoveImg">
                        <i class="el-icon-plus"></i>
                        <div slot="tip" class="inputText el-upload__tip">最多上传9张,只能上传jpeg、png、jpg格式的文件,且图片大小不能大于20M</div>
                    </el-upload>
                </div>
                <div v-else-if="isActive === 'video'">
                    <p class="formTitle_mv">上传视频</p>
                    <el-upload
                        ref="mvFile"
                        class="uploadWeb marginBottom20"
                        :action="this.$api.root() + 'upload/upload'"
                        name="file"
                        :show-file-list="false"
                        :accept="formItem.acceptVideo"
                        :on-progress="uploadProcessMV"
                        :before-upload="beforeUploadMV"
                        :on-success="mvUploadSuccess"
                        :on-error="mvUploadError">
                        <video v-if="formItem.mvPathUrl !=='' && formItem.mvUrlStatus === false"
                               :src="this.$api.imgUrl() + formItem.mvPathUrl"
                               class="mv_avatar"
                               controls="controls">您的浏览器不支持视频播放
                        </video>
                        <i v-else-if="formItem.mvPathUrl ==='' && formItem.mvUrlStatus === false"
                           class="el-icon-plus"></i>
                        <el-progress
                            v-if="formItem.mvUrlStatus === true" type="circle"
                            class="marginTop10"
                            :percentage="formItem.progressNum"/>
                        <div slot="tip" class="inputText el-upload__tip">
                            只能上传mp4、ogg、flv、avi、wmv、rmvb、mov格式,且文件大小不能大于500M
                        </div>
                    </el-upload>
                </div>
            </div>
            <!--内容区域-->
            <ul class="lifeStyle_Box">
                <li class="lifeStyle marginBottom15" v-for="(item,index) in listData" :key="index">
                    <!--标题区域-->
                    <div class="lifeStyle_title">
                        <div class="above-img">
                            <!--标题头像-->
                            <img :src="item.headImagePath" alt="">
                        </div>
                        <div class="title-left">
                            <div class="name">
                                <div>
                                    <span>{{item.releaseName}}</span>
                                    <img class="vipIcon_mobile" src="../../../../assets/img/common/vip.png" alt="">
                                </div>
                                <div class="font14">{{item.releaseTime}}</div>
                            </div>
                            <!--动态文字-->
                            <div v-html="item.dynamicContentStrShow" class="show wordBreak"></div>
                            <div v-if="item.flag !== 0">
                                <el-button type="text" class="font12 marginTop5" style="padding: 0;"
                                           @click="showOrNot(item)">
                                    {{item.flag === 1 ? $t('public.open') : (item.flag === 2 ? $t('public.close') :
                                    '')}}
                                </el-button>
                            </div>
                        </div>
                    </div>
                    <!--图片区域-->
                    <div v-if="item.dynamicType !== undefined
                            && item.dynamicType !== null
                            && (item.dynamicType === 0 || item.dynamicType === 1)"
                         class="lifeStyle_photos">
                        <!--0:图片-->
                        <ul class="imgBox_ul" v-if="item.dynamicType === 0">
                            <li class="imgBox_li pointer"
                                v-for="(val,p) in item.dynamicFilePathCache" :key="p"
                                @click="clickImg(val)">
                                <div :style="{backgroundImage:'url('+val+')'}" class="message_img">
                                    <img class="widthAll visibilityHidden"
                                         src="../../../../assets/img/thumbnail_bg/lifestyle.png"
                                         alt="">
                                </div>
                            </li>
                        </ul>
                        <!--1:视频-->
                        <div class="widthAll" v-if="item.dynamicType === 1">
                            <div class="play_printMv" @click="clickVideo(item)">
                                <div class="message_img fixedMvBg">
                                    <img class="widthAll visibilityHidden"
                                         src="../../../../assets/img/thumbnail_bg/lifestyle_mv.png"
                                         alt="">
                                </div>
                                <div class="play">
                                    <img class="widthAll" src="../../../../assets/img/common/play-icon.png" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--评论区域-->
                    <div class="lifeStyle_review">
                        <ul class="comment" v-for="(review,i) in item.discussArr" :key="i">
                            <li class="discuss">
                                <div class="discuss-top">
                                    <div class="top-img marginRight10">
                                        <img class="widthAll" :src="review.headImg" alt="">
                                    </div>
                                    <div class="flex_1">
                                        <div class="top_text">
                                            <span class="discuss-blue">{{review.fromReplyUserName}}：</span>
                                            <span class="discuss_text wordBreak">{{review.replyMessage}}</span>
                                        </div>
                                        <div class="font12 grayColor">{{review.replyTime}}</div>
                                    </div>
                                </div>
                                <div class="discuss-base" v-for="(val,j) in review.sonList" :key="j">
                                    <div class="base-img"><img :src="val.headImg" alt=""></div>
                                    <div class="flex_1">
                                        <div>
                                            <span class="discuss-blue">{{val.fromReplyUserName}}：</span>
                                            <span class="blueColor marginRight10">@{{review.fromReplyUserName}}</span>
                                            <span class="wordBreak">{{val.replyMessage}}</span>
                                        </div>
                                        <div class="font12 grayColor">{{val.replyTime}}</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div @click="getMoreData(item,true)" v-if="item.discussArr !== null"
                             class="more font12 cursorPointer">
                            {{$t('public.more')}}
                        </div>
                        <div class="inputGroup mobileGroup">
                            <el-input size="small" class="inputBox" maxlength="300" show-word-limit
                                      v-model="item.discussText"/>
                            <el-button size="small" class="inputBtn" type="text" @click="send_msg(item)">
                                {{$t('public.comment')}}
                            </el-button>
                        </div>
                    </div>
                </li>
            </ul>
            <!--分页-->
            <div class="page">
                <pages
                    :total='options.total'
                    :currentPage='options.currentPage'
                    :page-size="options.pageSize"
                    @handleSizeChangeSub="handleSizeChangeSub"
                    @handleCurrentChangeSub="handleCurrentChange"/>
            </div>
        </div>
        <!--视频详情-->
        <el-dialog
            class="videoDialog_mobile"
            :visible.sync="dialogVisible"
            append-to-body
            width="95%"
            :before-close="resetVideo"
            :close-on-press-escape="false"
            :close-on-click-modal="false">
            <video
                ref="videoDialog"
                width="100%"
                height="100%"
                controls="controls"
                :poster="detailForm.img" class="video">
                <source :src="detailForm.url">
            </video>
        </el-dialog>
        <!--图片详情-->
        <el-dialog
            class="imgDialog"
            :show-close="true"
            width="95%"
            :visible.sync="dialogVisibles"
            append-to-body
            :before-close="resetImg">
            <img class="widthAll" :src="imgs">
        </el-dialog>
    </div>
</template>

<script>
    import E from "wangeditor";
    import {dateFilter} from "../../../../assets/js/filters";

    export default {
        name: "LIFESTYLE",
        data() {
            return {
                userId: this.getCookie('WJE_USER_ID'),
                fixedUserArr: this.$api.teamWangID(), // 固定账号
                // 动态查询表单
                formItem: {
                    accept: 'image/*',
                    acceptVideo: 'video/*',
                    textarea: '', // 发布内容
                    vipLifestyle: '0', // 0:vip 1:普通
                    imgUrl: [], // 图片集合
                    mvPathUrl: '', // 视频路径地址
                    progressNum: 0, // 视频上传进度
                    mvUrlStatus: false, // 视频上传状态
                    editor: null, // 富文本
                },
                // 查询表单
                addEdit: {
                    year: new Date().getFullYear(), // 当前年
                },
                isActive: 'photo', // 选中
                // 动态数据集合
                listData: [],
                // 动态分页集合
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 5, // 显示条数
                },
                // 详情
                dialogVisible: false, // 是否显示蒙版
                dialogVisibles: false, // 是否显示蒙版
                // 视频详情表单
                detailForm: {
                    img: '',
                    url: '',
                    type: ''
                },
                // 图片详情
                imgs: '',
                // 初始化more分页
                moreOptions: {
                    pageSize: 5, // 每页显示条数
                    total: 0, // 初始化总条数
                },
            }
        },
        methods: {
            // 动态展开还是收缩
            showOrNot(item) {
                let _t = this;
                if (item.flag === 1) {
                    // 展开操作
                    let str = _t.returnHtmlContent(item.dynamicContentStr, true);
                    item.dynamicContentStrShow = str.data;
                    item.flag = 2;
                } else {
                    // 收起操作
                    let obj = _t.returnHtmlContent(item.dynamicContentStr, false);
                    item.dynamicContentStrShow = obj.data;
                    item.flag = 1;
                }
            },
            // 点击获取more
            getMoreData(item, flag) {
                let _t = this;
                if (flag === true) {
                    item.moreLimit += _t.moreOptions.pageSize;
                }
                // 判断是否登录
                let releasd = null;
                let isLogin = _t.getCookie('WJE_IS_LOGIN');
                let userId = _t.getCookie('WJE_USER_ID');
                if (isLogin !== null
                    && isLogin !== 'null'
                    && (isLogin === true || isLogin === 'true')
                    && userId !== undefined
                    && userId !== null) {
                    releasd = userId;
                }
                _t.$api.post('dynamic/get/message', {
                    privateInfoIds: item.id, // 动态表id
                    limit: item.moreLimit, // 每页显示条数
                    releasd: releasd, // 是否按照登录的用户进行筛选
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            if (res.data !== null && res.data.length !== 0) {
                                // 数据条数相同 且点击more
                                if (res.data[0].length === item.discussArr.length && flag === true) {
                                    _t.$message.warning(_t.$t('public.noMoreData'));
                                } else {
                                    let discussArr = res.data[0] === undefined || res.data[0] === null ? [] : res.data[0];
                                    discussArr.forEach((val) => {
                                        val.status = false; // 是否回复
                                        val.contentText = ''; // 回复输入框的值
                                        // 处理一级头像
                                        if (val.headImg !== undefined && val.headImg !== null) {
                                            val.headImg = _t.$api.imgUrl() + val.headImg;
                                        } else {
                                            val.headImg = '';
                                        }
                                        // 处理评论的时间
                                        if (val.replyTime !== undefined && val.replyTime !== null) {
                                            val.replyTime = dateFilter(val.replyTime);
                                        }
                                        // 判断是否有二级
                                        if (val.sonList !== undefined && val.sonList !== null && val.sonList.length !== 0) {
                                            val.sonList.forEach((data) => {
                                                // 处理二级头像
                                                if (data.headImg !== undefined && data.headImg !== null) {
                                                    data.headImg = _t.$api.imgUrl() + data.headImg;
                                                } else {
                                                    data.headImg = '';
                                                }
                                                // 处理评论的时间
                                                if (data.replyTime !== undefined && data.replyTime !== null) {
                                                    data.replyTime = dateFilter(data.replyTime);
                                                }
                                            });
                                        }
                                    });
                                    item.discussArr = discussArr;
                                }
                            }
                            break;
                        default:
                            break;
                    }
                });
            },
            // 点击上一年
            prevBtn() {
                let _t = this;
                _t.addEdit.year -= 1;
                _t.options.currentPage = 1;
                _t.getData();
            },
            // 点击下一年
            nextBtn() {
                let _t = this;
                _t.addEdit.year += 1;
                _t.options.currentPage = 1;
                _t.getData();
            },
            //点击放大图片
            clickImg(item) {
                let _t = this;
                _t.imgs = item;
                _t.dialogVisibles = true;
            },
            // 点击播放
            clickVideo(item) {
                let _t = this;
                _t.detailForm.url = item.dynamicFilePathMvCache;
                _t.detailForm.img = item.dynamicFilePathMvThumbnail;
                _t.dialogVisible = true;
                _t.$nextTick(function () {
                    // 重新加载src指定的资源
                    _t.$refs.videoDialog.load();
                    // 自动播放
                    _t.$refs.videoDialog.play()
                })
            },
            // 点击关闭视频蒙版
            resetVideo() {
                let _t = this;
                _t.dialogVisible = false;
                _t.imgs = '';
                _t.detailForm.url = '';
                _t.detailForm.type = '';
                _t.detailForm.img = '';
                _t.$refs.videoDialog.pause()
            },
            // 点击关闭图片蒙版
            resetImg() {
                let _t = this;
                _t.dialogVisibles = false;
                _t.imgs = '';
            },
            // 获取动态数据
            getData(flag) {
                let _t = this;
                _t.$api.post('dynamic/all', {
                    page: _t.options.currentPage, // 当前页
                    limit: _t.options.pageSize, // 每页显示条数
                    vipLifestyle: _t.formItem.vipLifestyle, // 0: 普通  1: VIP
                    year: _t.addEdit.year, // 年份
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            let listData = res.data.content !== null ? res.data.content : [];
                            let total = res.data.total !== undefined ? res.data.total : 0;
                            // 需要拼接数据的数组
                            let askArrIds = new Array();
                            listData.forEach((item) => {
                                item.discussArr = null; // 评论集合初始化
                                item.discussArrCache = null; // 评论集合初始化
                                item.discussText = ''; // 评论输入框的值
                                item.moreLimit = _t.moreOptions.pageSize; // 初始化评论显示条数
                                item.moreTotal = _t.moreOptions.total; // 初始化评论总条数
                                item.dynamicContentStrShow = ''; // 展示的动态内容
                                item.flag = 0; // 未截取
                                // 处理内容 flase 代表默认收起操作 true：代表展开操作
                                let obj = _t.returnHtmlContent(item.dynamicContentStr, false);
                                item.dynamicContentStrShow = obj.data;
                                item.flag = obj.flag;
                                if (item.flag === 2) {
                                    item.flag = 0;
                                }
                                // 处理时间戳
                                if (item.releaseTime !== null) {
                                    item.releaseTime = dateFilter(item.releaseTime);
                                }
                                if (item.id !== undefined) {
                                    askArrIds.push(item.id);
                                }
                                // 处理一级数据 头像
                                item.headImagePath = _t.$api.imgUrl() + item.headImagePath;
                                // 处理图片和视频 0:图片 1:视频
                                if (item.dynamicType === 0) {
                                    // 图片 逗号分隔解析
                                    let dynamicFilePathCache = item.dynamicFilePath !== undefined ? item.dynamicFilePath.split(',') : [];
                                    for (let i = 0; i < dynamicFilePathCache.length; i++) {
                                        dynamicFilePathCache[i] = _t.$api.imgUrl() + dynamicFilePathCache[i]
                                    }
                                    item.dynamicFilePathCache = dynamicFilePathCache;
                                    item.dynamicFilePathMvCache = null;
                                    item.dynamicFilePathMvThumbnail = null;
                                } else if (item.dynamicType === 1) {
                                    item.dynamicFilePathCache = null;
                                    // 视频 文件
                                    item.dynamicFilePathMvCache = item.dynamicFilePath !== undefined ? _t.$api.imgUrl() + item.dynamicFilePath : null;
                                    // 视频缩略图
                                    item.dynamicFilePathMvThumbnail = item.thumbnail !== undefined ? _t.$api.imgUrl() + item.thumbnail : null;
                                }
                            });
                            // 有id集合数据才发送请求评论的接口
                            if (askArrIds.length !== 0) {
                                _t.getRecovery(listData, askArrIds, total);
                            } else {
                                _t.listData = [];
                                _t.options.total = 0;
                                _t.options.currentPage = 1;
                            }
                            break;
                        default:
                            break;
                    }
                });
            },
            // 查询动态下的留言
            getRecovery(listData, ids, total) {
                let _t = this;
                // 判断是否登录
                let releasd = null;
                let isLogin = _t.getCookie('WJE_IS_LOGIN');
                let userId = _t.getCookie('WJE_USER_ID');
                if (isLogin !== null
                    && isLogin !== 'null'
                    && (isLogin === true || isLogin === 'true')
                    && userId !== undefined
                    && userId !== null) {
                    releasd = userId;
                }
                _t.$api.post('dynamic/get/message', {
                    privateInfoIds: ids.join(','),
                    limit: _t.moreOptions.pageSize, // 初始每页显示的条数
                    releasd: releasd, // 是否按照登录的用户进行筛选
                }, function (res) {
                    let resData = res.data === null ? [] : res.data;
                    resData.forEach((item) => {
                        if (item.length !== 0) {
                            item.forEach((val) => {
                                // 判断1级头像
                                if (val.headImg !== undefined && val.headImg !== null) {
                                    val.headImg = _t.$api.imgUrl() + val.headImg;
                                } else {
                                    val.headImg = '';
                                }
                                // 处理评论的时间
                                if (val.replyTime !== undefined && val.replyTime !== null) {
                                    val.replyTime = dateFilter(val.replyTime);
                                }
                                // 判断2级头像
                                if (val.sonList !== null && val.sonList.length !== 0) {
                                    val.sonList.forEach((data) => {
                                        if (data.headImg !== undefined && data.headImg !== null) {
                                            data.headImg = _t.$api.imgUrl() + data.headImg;
                                        } else {
                                            data.headImg = '';
                                        }
                                        // 处理评论的时间
                                        if (data.replyTime !== undefined && data.replyTime !== null) {
                                            data.replyTime = dateFilter(data.replyTime);
                                        }
                                    });
                                }
                            });
                        }
                    });
                    listData.forEach((key) => {
                        resData.forEach((val) => {
                            // 目前只有一条评论
                            if (val.length !== 0 && key.id === val[0].privateInfoId) {
                                // 赋值
                                key.discussArr = val;
                            }
                        });
                    });
                    _t.listData = listData;
                    _t.options.total = total;
                });
            },
            // 改变当前页码
            handleCurrentChange(val) {
                let _t = this;
                _t.options.currentPage = val;
                _t.getData();
            },
            // 改变每页显示条数
            handleSizeChangeSub(val) {
                let _t = this;
                _t.options.pageSize = val;
                _t.getData();
            },
            // 发送回复
            send_msg(item) {
                let _t = this;
                // 获取用户id及是否登录
                let isLogin = _t.getCookie('WJE_IS_LOGIN');
                let user_id = _t.getCookie('WJE_USER_ID');
                let user_name = _t.getCookie('WJE_NICK_NAME');
                let headImg = _t.getCookie('WJE_HEAD_IMG');
                // 用户登录之后才可发送留言
                if (isLogin !== null && user_id !== null) {
                    if (item.discussText.trim() === '') {
                        _t.$message.error(_t.$t('lifestyle.emptyMessage'));
                    } else {
                        // 发送请求
                        _t.sendMessage(item, user_id, user_name, headImg);
                    }
                } else {
                    _t.$message.error(_t.$t('lifestyle.isNotLogin'));
                }
            },
            // 发送评论
            sendMessage(item, user_id, user_name, headImg) {
                let _t = this;
                _t.$api.post('dynamic/reply', {
                    privateInfoId: item.id, // 动态id
                    replyMessage: item.discussText.trim(), // 评论内容
                    fromReplyUserId: user_id, // 评论人ID
                    fromReplyUserName: user_name, // 评论人姓名
                }, function (res) {
                    switch (res.status) {
                        case 200: // 发表成功
                            item.discussArr = item.discussArr === null ? [] : item.discussArr;
                            let obj = new Object();
                            obj.headImg = headImg;
                            obj.fromReplyUserName = user_name;
                            obj.replyMessage = item.discussText.trim();
                            obj.replyTime = dateFilter(new Date().getTime());
                            item.discussArr.unshift(obj);
                            // 小于10条数据 不截取
                            if (item.discussArr.length <= _t.moreOptions.pageSize) {
                                item.discussText = '';
                            } else {
                                // 大于10条截取前10条
                                item.discussArr = item.discussArr.splice(0, _t.moreOptions.pageSize);
                                item.discussText = '';
                            }
                            break;
                        case 2004: // 添加错误
                            _t.$message.error(res.message);
                            break;
                        default:
                            break;
                    }
                });
            },
            // 发布按钮
            addData() {
                let _t = this;
                let formatText = _t.formItem.textarea.trim();
                // 判断发布内容是否为空
                if (formatText === ''
                    && _t.formItem.imgUrl.length === 0
                    && _t.formItem.mvPathUrl === '') {
                    _t.$message.warning('不能发布为空的数据');
                } else {
                    _t.addPost(formatText);
                }
            },
            // 发送请求
            addPost(formatText) {
                let _t = this;
                let dynamicType = null; // 上传标识
                let dynamicFilePath = null; // 资源路径
                let thumbnail = null; // 缩略图
                if (_t.isActive === 'photo' && _t.formItem.imgUrl.length !== 0) {
                    dynamicType = 0;
                    dynamicFilePath = _t.formItem.imgUrl.join(',');
                    thumbnail = null;
                } else if (_t.isActive === 'video' && _t.formItem.mvPathUrl !== '') {
                    dynamicType = 1;
                    dynamicFilePath = _t.formItem.mvPathUrl;
                    thumbnail = null;
                } else {
                    dynamicType = null;
                    dynamicFilePath = null;
                    thumbnail = null
                }
                _t.$api.post('dynamic/push', {
                    dynamicContent: formatText, // 发布内容
                    vipLifestyle: _t.formItem.vipLifestyle, // 是否vip模块
                    releaseId: _t.getCookie('WJE_USER_ID'), // 发布人id
                    dynamicType: dynamicType, // 数据类别
                    dynamicFilePath: dynamicFilePath, // 资源路径
                    thumbnail: thumbnail, // 视频缩略图
                }, function (res) {
                    switch (res.status) {
                        case 200: // 操作成功
                            _t.getData();
                            // _t.formItem.editor.txt.clear(); // 清空富文本
                            _t.formItem.imgUrl = []; // 图片数组置为空
                            _t.formItem.mvPathUrl = ''; // 视频存为空
                            _t.formItem.textarea = ''; // 发布内容置为空
                            _t.$refs.imgFile.clearFiles(); // 清空照片墙
                            _t.$refs.mvFile.clearFiles(); // 清空视频
                            break;
                        default:
                            break;
                    }
                });
            },
            clickUpload(item) {
                let _t = this;
                _t.isActive = _t.isActive === item ? '' : item;
            },
            // 上传mv前
            beforeUploadMV(file) {
                let _t = this;
                let mvType = _t.$api.mvType();
                let isMv = mvType.indexOf(file.type) !== -1;
                if (!isMv) {
                    _t.$message.error('请上传正确的视频格式');
                }
                // 校验视频大小
                let isLt100M = file.size / 1024 / 1024 < 500;
                if (!isLt100M) {
                    _t.$message.error('视频大小不能大于500M');
                }
                return isMv && isLt100M;
            },
            // 上传过程中
            uploadProcessMV(event, file, fileList) {
                let _t = this;
                _t.formItem.mvUrlStatus = true;
                _t.formItem.progressNum = parseInt(file.percentage);
            },
            // 上传mv成功后
            mvUploadSuccess(val, file, fileList) {
                let _t = this;
                if (val.status === 200) {
                    _t.formItem.mvPathUrl = val.url[0].filePath;
                } else {
                    _t.$message.error('视频上传失败,请重新上传!');
                }
                _t.formItem.mvUrlStatus = false;
            },
            // 上传mv失败后
            mvUploadError(err, file, fileList) {
                let _t = this;
                _t.formItem.mvUrlStatus = false;
                _t.$message.error('视频上传失败,请重新上传!');
            },
            // 图片上传前
            beforeUploadImg(file) {
                let _t = this;
                // 校验是否是jpg jpeg png图片
                let isImg = /^image\/(jpeg|png|jpg)$/.test(file.type);
                if (!isImg) {
                    _t.$message.error('只能上传jpeg、png、jpg格式的文件');
                }
                // 校验图片大小
                let isLt20M = file.size / 1024 / 1024 < 20;
                if (!isLt20M) {
                    _t.$message.error('图片大小不能大于20M');
                }
                return isImg && isLt20M;
            },
            // 图片上传失败
            handleErrorImg(err, file, fileList) {
                let _t = this;
                _t.$message.error('图片上传失败!');
            },
            // 上传时
            handleSuccessImg(file) {
                let _t = this;
                if (file.status === 200) {
                    if (file.url.length !== 0 && file.url[0].filePath !== undefined && file.url[0].filePath !== null) {
                        _t.formItem.imgUrl.push(file.url[0].filePath);
                    }
                }
            },
            // 点击删除
            handleRemoveImg(file) {
                let _t = this;
                _t.formItem.imgUrl.forEach((item, index) => {
                    if (item === file.response.url[0].filePath) {
                        _t.formItem.imgUrl.splice(index, 1);
                    }
                });
            },
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'VIP_PRIVATE', 'M_VIP_PRIVATE');
            if (jump === false) {
                _t.getData();
                // 调用父级的用户信息判断是否vip到期
                _t.$parent.getUserInfo();
            }
        },
        mounted() {
            let _t = this;
            // 初始化编辑器
            // _t.formItem.editor = new E('#editor');
            // 自定义菜单配置
            // _t.formItem.editor.customConfig.menus = [
            //     'bold',
            //     'italic',
            //     'underline',
            //     'list',  // 列表
            //     'justify',  // 对齐方式
            //     'emoticon', // 自定义表情
            // ];
            // 样式过滤
            // _t.formItem.editor.customConfig.pasteFilterStyle = true;
            // _t.formItem.editor.customConfig.showLinkImg = false;

            // 开启wangEditor的错误提示
            // _t.formItem.editor.customConfig.debug = true;
            // _t.formItem.editor.create();
        }
    }
</script>

<style scoped>
    .lifeStyle_title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-bottom: 10px;
        border-bottom: 1px solid #2c2c2c;
    }

    .centerRight span {
        vertical-align: middle;
    }

    .above-img {
        width: 40px;
        font-size: 0;
        margin-right: 10px;
    }

    .above-img > img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        vertical-align: top;
    }

    .title-left {
        flex: 1;
    }

    .title-left > .name {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        line-height: 30px;
    }

    .title-left > .name > span:nth-child(1) {
        font-size: 14px;
    }

    .title-left > .name > span:nth-child(2) {
        color: #929192;
        font-size: 12px;
    }

    .title-left div.show {
        font-size: 12px
    }

    .imgBox_li {
        width: 33.33%;
        display: inline-block;
        box-sizing: border-box;
        padding: 10px 5px;
    }

    .play_printMv {
        width: 33.33%;
        box-sizing: border-box;
        position: relative;
        padding: 10px 5px;
    }

    .play_printMv .play {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .inputText {
        color: #ddd;
    }

    .lifeStyle_review .comment {
        color: #ccc;
        padding-left: 45px;
    }

    .discuss {
        margin: 10px 0;
    }

    .discuss-top {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .top-img,
    .top-img > img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        overflow: hidden;
    }

    .top_text {
        font-size: 0;
        margin-top: 5px;
    }

    .top_text > span {
        font-size: 12px;
        line-height: 20px;
    }

    .discuss-base {
        padding-left: 40px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .base-img {
        font-size: 0;
        width: 30px;
        margin-right: 5px;
    }

    .base-img + div {
        margin-top: 5px;
    }

    .base-img > img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
    }

    .mobileGroup .inputBtn {
        padding: 0 20px !important;
        width: auto !important;
    }

    .mobileGroup {
        padding: 15px 0 !important;
        border-bottom: 1px solid #2c2c2c;
    }

    .lifeStyle_InputBox li {
        float: left;
        cursor: pointer;
        margin-right: 15px;
    }

    .optionsBox {
        margin: 10px 0 0;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
    }

    .optionsBox li.is-active {
        color: #4D91FE;
    }

    .optionsBox li.fr {
        float: right !important;
        margin-right: 0 !important;
    }

    .formTitle_mv {
        margin-bottom: 5px;
    }

    .lifeStyle_photos {
        border-bottom: 1px solid #2c2c2c;
        padding-left: 45px;
    }

    .lifeStyle_review .more {
        padding-left: 45px;
    }
</style>
<style>
    .lifeStyle_InputBox .el-textarea__inner {
        background-color: #111;
        border: 1px solid #2c2c2c !important;
        color: #fff;
    }

    .lifeStyle_InputBox .el-textarea .el-input__count {
        background: none;
    }

    .lifeStyle_InputBox .el-button--primary {
        padding-left: 20px;
        padding-right: 20px;
        background-color: #222 !important;
        color: #fff;
    }

    .lifeStyle_InputBox .el-upload--picture-card {
        background-color: transparent;
        border: 1px dashed #2c2c2c !important;
    }

    .lifeStyle_InputBox .el-upload.el-upload--text {
        width: 252px !important;
        height: 152px !important;
        line-height: 150px !important;
        font-size: 0;
        border: 1px dashed #2c2c2c;
        border-radius: 2px;
        color: #3c8dbc;
        position: relative;
    }

    .lifeStyle_InputBox .swiper_avatar {
        width: 250px;
        height: 150px;
    }

    .lifeStyle_InputBox .uploadWeb .mv_avatar {
        width: 250px;
        height: 150px !important;
    }

    .lifeStyle_InputBox .star:before, .star > label.el-form-item__label:before {
        content: "*";
        margin-right: 4px;
        color: #fb6041;
    }

    .lifeStyle_InputBox .el-upload-list--picture-card .el-upload-list__item {
        border: none;
        background-color: #111;
    }

    .lifeStyle_InputBox .uploadWeb .el-upload.el-upload--text i {
        font-size: 30px;
        color: #8c939d
    }
</style>
