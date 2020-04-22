<template>
    <div class="lifeStyle-centre">
        <!--banner图-->
        <div class="navBar_bg">
            <div class="message_img bannerBox">
                <img v-if="carouselMapImg === ''" class="widthAll" src="../../../assets/img/header/defaultBanner.png"
                     alt="banner">
                <img v-else class="widthAll" :src="carouselMapImg" alt="banner">
            </div>
        </div>
        <div class="lifeStyle_Box">
            <div class="centre-head">
                <div class="centre-head-left">
                    <span class="Jack">{{$t('lifestyle.title')}}</span>
                </div>
                <div class="centre-head-right">
                    <img class="turn-left pointer" @click="handlePrev" src="../../../assets/img/common/data_02.png"
                         alt="">
                    <span class="marginLR15 font16">{{formItem.year}}</span>
                    <img class="turn-right pointer" @click="handleNext" src="../../../assets/img/common/data_01.png"
                         alt="">
                </div>
            </div>
            <div class="centre-microBlog">
                <div class="microBlog-style" v-for="(review,index) in reviews" :key="index">
                    <!--头部-->
                    <div class="style1-right">
                        <div class="style1-right-top">
                            <!--头像-->
                            <div class="top-left">
                                <img :src="review.headImagePath">
                            </div>
                            <!--文字区域-->
                            <div class="flex_1">
                                <!--昵称和时间-->
                                <div class="top_left_head">
                                    <div class="name">
                                        <span>{{review.releaseName}}</span>
                                        <img class="vipIcon_pc" src="../../../assets/img/common/vip.png" alt="">
                                    </div>
                                    <div class="top-right">{{review.releaseTime}}</div>
                                </div>
                                <!--动态文字-->
                                <div v-html="review.dynamicContentStrShow" class="style1-right-subhead wordBreak"></div>
                                <div v-if="review.flag !== 0">
                                    <el-button type="text" @click="showOrNot(review)">
                                        {{review.flag === 1 ? $t('public.open') : (review.flag === 2 ? $t('public.close') : '')}}
                                    </el-button>
                                </div>
                                <div class="marginBottom20" v-else></div>
                            </div>
                        </div>
                    </div>
                    <!--图片和视频-->
                    <div v-if="review.dynamicType !== undefined
                            && review.dynamicType !== null
                            && (review.dynamicType === 0
                            || review.dynamicType === 1)"
                         class="style1-left">
                        <!--图片-->
                        <ul class="imgBox_ul" v-if="review.dynamicType === 0">
                            <li class="imgBox_li" v-for="(list,ind) in review.dynamicFilePathCache" :key="ind">
                                <div class="message_img mask_lifestyleBox positionRelative"
                                     :style="{backgroundImage:'url('+list+')'}">
                                    <div class="mask_lifestyle pointer" @click="imgShow(list)"></div>
                                    <img class="visibilityHidden widthAll"
                                         src="../../../assets/img/thumbnail_bg/lifestyle.png" alt="">
                                </div>
                            </li>
                        </ul>
                        <!--视频-->
                        <div class="videoBox" v-else-if="review.dynamicType === 1">
                            <div class="widthAll displayInlineBlock positionRelative cursorPointer"
                                 @click="clickVideo(review)">
                                <div class="message_img mask_lifestyleBox positionRelative fixedMvBg ">
                                    <img class="visibilityHidden widthAll"
                                         src="../../../assets/img/thumbnail_bg/lifestyle_mv.png"
                                         alt="">
                                </div>
                                <div class="play_imgBox">
                                    <img class="icon" src="../../../assets/img/common/play-icon.png" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--评论-->
                    <ul class="style1_discuss flex_1">
                        <li class="discuss " v-for="(item,index) in review.discuss" :key="index">
                            <div class="disContent">
                                <div class="discuss-top">
                                    <div class="top-img marginRight10"><img :src="item.headImg" alt=""></div>
                                    <div class="marginTop10">
                                        <div>
                                            <span>{{item.fromReplyUserName}}：</span>
                                            <span class="wordBreak">{{item.replyMessage}}</span>
                                        </div>
                                        <div class="font13 marginTop5 grayColor">
                                            {{item.replyTime}}
                                        </div>
                                    </div>
                                </div>
                                <div class="discuss-base marginLeft40" v-for="(list,i) in item.sonList" :key="i">
                                    <div class="base-img marginRight10 paddingTop10"><img :src="list.headImg" alt="">
                                    </div>
                                    <div class="marginTop5">
                                        <div>
                                            <span>{{list.fromReplyUserName}}：</span>
                                            <span class="discuss-blue marginRight10">@{{item.fromReplyUserName}}</span>
                                            <span class="wordBreak">{{list.replyMessage}}</span>
                                        </div>
                                        <div class="font13 marginTop5 grayColor">
                                            {{list.replyTime}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li class="pointer more" @click="getMoreData(review,true)"
                            v-if="review.discuss !== undefined && review.discuss !== null">{{$t('public.more')}}
                        </li>
                        <li class="inputGroup marginBottom0">
                            <el-input class="inputBox" maxlength="300" show-word-limit v-model="review.text"/>
                            <el-button class="inputBtn" type="text" @click="add_msg(review)">
                                {{$t('public.comment')}}
                            </el-button>
                        </li>
                    </ul>
                </div>
                <!--分页-->
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
            class="videoDialog"
            :visible.sync="dialogVisible"
            append-to-body
            :before-close="resetVideo"
            :close-on-press-escape="false"
            :close-on-click-modal="false">
            <video
                ref="videoDialog"
                width="100%"
                height="100%"
                controls="controls"
                controlsList="nodownload"
                :poster="detailForm.img" class="video">
                <source :src="detailForm.url">
            </video>
        </el-dialog>
        <!--图片详情-->
        <el-dialog
            class="imgDialog"
            :show-close="false"
            :visible.sync="dialogVisibles"
            append-to-body
            :before-close="resetImg">
            <img class="widthAll" :src="imgs">
        </el-dialog>
    </div>
</template>

<script>
    import {dateFilter} from "../../../assets/js/filters";

    export default {
        name: 'LIFESTYLE',
        data() {
            return {
                carouselMapImg: '', // banner图
                // 图片列表查询表单
                formItem: {
                    year: new Date().getFullYear(),
                    vipLifestyle: '1', // 0:vip 1:普通
                },
                // 回复评论集合
                reviews: [],
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 5, // 显示条数
                },
                // 初始化more分页
                moreOptions: {
                    pageSize: 5, // 每页显示条数
                    total: 0, // 初始化总条数
                },
                // 蒙版
                dialogVisible: false,
                // 照片蒙版
                dialogVisibles: false,
                // 视频蒙版
                detailForm: {
                    img: '', // 蒙版图片
                    url: '', // 视频文件
                },
                imgs: '', // 图片详情
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
            // 点击图片放大
            imgShow(item) {
                let _t = this;
                _t.dialogVisibles = true;
                _t.imgs = item;
            },
            // 点击关闭图片蒙版
            resetImg() {
                let _t = this;
                _t.dialogVisibles = false;
                _t.imgs = '';
            },
            // 发送回复
            add_msg(item) {
                let _t = this;
                // 获取用户id及是否登录
                let isLogin = _t.getCookie('WJE_IS_LOGIN');
                let user_id = _t.getCookie('WJE_USER_ID');
                let user_name = _t.getCookie('WJE_NICK_NAME');
                let headImg = _t.getCookie('WJE_HEAD_IMG');
                // 用户登录之后才可发送留言
                if (isLogin !== null && user_id !== null) {
                    if (item.text.trim() === '') {
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
                    replyMessage: item.text.trim(), // 评论内容
                    fromReplyUserId: user_id, // 评论人ID
                    fromReplyUserName: user_name, // 评论人姓名
                }, function (res) {
                    switch (res.status) {
                        case 200: // 发表成功
                            item.discuss = (item.discuss === null || item.discuss === undefined) ? [] : item.discuss;
                            let obj = new Object();
                            obj.headImg = headImg;
                            obj.fromReplyUserName = user_name;
                            obj.replyMessage = item.text.trim();
                            obj.replyTime = dateFilter(new Date().getTime());
                            item.discuss.unshift(obj);
                            // 小于10条数据 不截取
                            if (item.discuss.length <= _t.moreOptions.pageSize) {
                                item.text = '';
                            } else {
                                // 大于10条截取前10条
                                item.discuss = item.discuss.splice(0, _t.moreOptions.pageSize);
                                item.text = '';
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
            // 改变当前页码
            handleCurrentChange(val) {
                let _t = this;
                _t.options.currentPage = val;
                _t.getDynamic();
            },
            // 改变每页显示条数
            handleSizeChangeSub(val) {
                let _t = this;
                _t.options.pageSize = val;
                _t.getDynamic();
            },
            // 更换年份 上一年
            handlePrev() {
                let _t = this;
                _t.formItem.year -= 1;
                _t.options.currentPage = 1;
                _t.getDynamic();
            },
            // 更换年份 下一年
            handleNext() {
                let _t = this;
                _t.formItem.year += 1;
                _t.options.currentPage = 1;
                _t.getDynamic();
            },
            // 获取more 的数据
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
                                if (res.data[0].length === item.discuss.length && flag === true) {
                                    _t.$message.warning(_t.$t('public.noMoreData'));
                                } else {
                                    let discuss = res.data[0] === undefined || res.data[0] === null ? [] : res.data[0];
                                    discuss.forEach((val) => {
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
                                    item.discuss = discuss;
                                }
                            }
                            break;
                        default:
                            _t.$message.error(_t.$t('public.queryError'));
                            break;
                    }
                });
            },
            // 查询动态
            getDynamic() {
                let _t = this;
                _t.$api.post('dynamic/all', {
                    page: _t.options.currentPage,
                    limit: _t.options.pageSize,
                    vipLifestyle: _t.formItem.vipLifestyle, // 0:vip 1:普通
                    year: _t.formItem.year
                }, (res) => {
                    switch (res.status) {
                        case 200:
                            if (res.data !== undefined && res.data !== null) {
                                let total = res.data.total !== undefined ? res.data.total : 0;
                                _t.options.total = total;
                                let reviews = res.data.content === null ? [] : res.data.content;
                                /*开始*/
                                // 需要拼接数据的数组
                                let revIds = new Array();
                                reviews.forEach((item) => {
                                    item.text = ''; // 输入框变量初始化
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
                                        revIds.push(item.id);
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
                                if (revIds.length !== 0) {
                                    _t.getRecovery(reviews, revIds, total);
                                } else {
                                    _t.reviews = [];
                                    _t.options.total = 0;
                                    _t.options.currentPage = 1;
                                }
                            }
                            break;
                        default:
                            break;
                    }
                })
            },
            // 查询动态下的留言
            getRecovery(reviews, ids, total) {
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
                    switch (res.status) {
                        case 200:
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
                            reviews.forEach((key) => {
                                resData.forEach((val) => {
                                    // 目前只有一条评论
                                    if (val.length !== 0 && key.id === val[0].privateInfoId) {
                                        // 赋值
                                        key.discuss = val;
                                        key.moreTotal = key.discuss.length; // 总条数
                                    }
                                });
                            });
                            _t.reviews = reviews;
                            _t.options.total = total;
                            break;
                        default:
                            break;
                    }

                });
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
                    _t.$refs.videoDialog.play();
                    // 取消画中画
                    _t.$refs.videoDialog['disablePictureInPicture'] = true;
                })
            },
            // 点击关闭蒙版
            resetVideo() {
                let _t = this;
                _t.dialogVisible = false;
                _t.detailForm.url = '';
                _t.detailForm.img = '';
                _t.$refs.videoDialog.pause()
            },
            // 查询banner图
            getBanner() {
                let _t = this;
                _t.$api.post('home/getBanner', {
                    site: 3, // 3:独家动态 (后台管理系统可查具体值得含义)
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            let resData = res.data === null ? [] : res.data;
                            if (resData.length !== 0 && resData[0].carouselMapStr !== undefined) {
                                _t.carouselMapImg = _t.$api.imgUrl() + resData[0].carouselMapStr;
                            }
                            break;
                        default:
                            break;
                    }
                })
            },
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'LIFESTYLE', 'M_LIFESTYLE');
            if (jump === false) {
                _t.getDynamic();
                _t.getBanner();
            }
            // 判断是否需要登录获取动态
            _t.$bus.on("getDynamicUser_pc", (val) => {
                if (val) {
                    _t.getDynamic();
                }
            });
        },
    }
</script>
<style scoped>
    .lifeStyle_Box {
        padding: 50px 130px;
        background: #0b0b0b;
    }

    .play_imgBox {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .centre-head {
        width: 100%;
        height: 50px;
        line-height: 50px;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
    }

    .centre-head-left {
        font-size: 30px;
        color: #fff;
        font-weight: 500;
    }

    .centre-head-left .Jack {
        border-bottom: 5px #ccc solid;
        padding-bottom: 5px;
        margin-right: 7px;
    }

    .centre-head-right {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fdfdfd;
    }

    .microBlog-style {
        color: #ccc;
        border-bottom: 1px solid #333;
        padding: 35px 0 0;
    }

    .top-left {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .top-left img {
        width: 50px;
        height: 52px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 15px;
    }

    .style1-right-top {
        display: flex;
        justify-content: space-between;
        align-items: self-start;
        border-bottom: 1px #333 solid;
    }

    .top_left_head {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-top: 15px;
    }

    .top_left_head .name {
        font-size: 18px;
        font-weight: 600;
    }

    .style1-right-subhead {
        line-height: 27px;
        font-size: 16px;
        color: #fff;
        font-weight: 600;
        padding: 10px 0 0;
    }

    .discuss-top {
        display: flex;
    }

    .discuss-top .top-img img {
        width: 40px;
        height: 40px;
        overflow: hidden;
        border-radius: 50%;
    }

    .discuss-base {
        display: flex;
        margin-top: 10px;
    }

    .discuss-blue {
        color: #6075c4;
    }

    .base-img img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
    }

    .mask_lifestyle {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .style1-left {
        border-bottom: 1px #333 solid;
        padding-left: 50px;
    }

    .style1_discuss .discuss {
        margin: 20px 0;
        padding-left: 50px;
    }

    .style1_discuss .more {
        padding-left: 50px;
    }

    .imgBox_ul {
        padding: 10px 0;
    }

    .imgBox_ul > .imgBox_li {
        position: relative;
        width: 33.33%;
        display: inline-block;
        box-sizing: border-box;
        padding: 10px;
    }

    .videoBox {
        position: relative;
        width: 33.33%;
        display: inline-block;
        padding: 20px 10px;
    }
</style>
