<template>
    <div class="mobileHome">
        <!--移动端动画注释-->
<!--        <div v-show="isPlayVideo" class="loading_animationBox">-->
<!--            <div id="logoGif"></div>-->
<!--        </div>-->
        <!--首页轮播-->
        <div class="mobileHome_Box">
            <img v-if="backgroundData.length === 0" class="widthAll"
                 src="../../../assets/img/swiper/home.jpg" alt="">
            <el-carousel v-else class="mobileHome_swiper" :autoplay="false" arrow="always" :height="ImgHeight">
                <el-carousel-item v-for="(item,index) in backgroundData" :key="index">
                    <img @click="clickDetail(item)" class="widthAll" :src="item.carouselMapStr" alt="">
                    <!--内容-->
                    <img class="widthAll visibilityHidden swiperHeight"
                         src="../../../assets/img/swiper/home.jpg" alt="">
                </el-carousel-item>
            </el-carousel>
        </div>
        <!--首页music模块-->
        <div class="mobileHome_MUSIC">
            <el-tabs class="mobileHome_tabs marginTop20" v-model="activeName">
                <!--mv模块-->
                <el-tab-pane :label="$t('home.mv')" name="mv">
                    <div v-if="mvList.length === 0" class="tableNotHasData flex_1">
                        <img class="notData" src="../../../assets/img/common/notData.png" alt="notData">
                        <div class="notDataText">{{$t('public.notData')}}</div>
                    </div>
                    <div v-else v-for="(item,index) in mvList" :key="index" class="mobile_maskBox marginBottom15">
                        <div class="mobile_mask">
                            <div class="mobileHome_title">
                                <span class="title">{{item.title}}</span>
                                <span>{{$t('videoModule.singer')}}：{{item.user}}</span>
                            </div>
                            <div class="mobileHome_content positionRelative">
                                <div class="message_img"
                                     :style="{backgroundImage:'url('+ rootUrl + item.imgUrl+')'}">
                                    <img :id="'mv_img_' + index" class="widthAll visibilityHidden"
                                         src="../../../assets/img/thumbnail_bg/mvThumbnail.png" alt="mv">
                                </div>
                                <img class="playIcon"
                                     @click="clickVideo(item)"
                                     src="../../../assets/img/common/play-icon.png"
                                     alt="play">
                            </div>
                        </div>
                    </div>
                    <div class="tc">
                        <el-button @click="clickMoreMv" size="small" round type="default">{{$t('public.more')}}
                        </el-button>
                    </div>
                </el-tab-pane>
                <!--music-->
                <el-tab-pane :label="$t('home.music')" name="music">
                    <div v-if="musicList.length === 0" class="tableNotHasData flex_1">
                        <img class="notData" src="../../../assets/img/common/notData.png" alt="notData">
                        <div class="notDataText">{{$t('public.notData')}}</div>
                    </div>
                    <div v-else v-for="(item,index) in musicList" :key="index"
                         class="mobile_maskBox musicBox marginBottom15">
                        <div class="mobile_mask displayFlexRow">
                            <div class="mobile_img">
                                <img :src="rootUrl + item.thumbnail" alt="">
                            </div>
                            <div class="mobileMusic_content">
                                <div class="title">{{item.musicName}}</div>
                                <div class="mobileMusic">
                                    <div class="singer">
                                        <span>{{$t('musicModule.singerName')}}:</span>
                                        <span>{{item.singer}}</span>
                                    </div>
                                </div>
                                <div class="mobileMusic mobileTime">{{item.publishTime}}</div>
                                <div class="mobileMusicLink">
                                    <template v-for="(val,index) in item.musicLikeStr">
                                        <a v-if="val.icon !== ''"
                                           class="iconsB"
                                           target="_blank"
                                           onclick="_czc.push(['_trackEvent', '音乐', '点击', '首页音乐']);"
                                           :href='val.v'>
                                            <img :src="val.icon" alt="">
                                        </a>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tc">
                        <el-button @click="clickMoreMusic" size="small" round type="default">{{$t('public.more')}}
                        </el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!--详情-->
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
                <source :src="rootUrl + detailForm.url" :type="detailForm.type">
            </video>
        </el-dialog>
        <!--vip活动弹框-->
        <el-dialog
            class="activityDialog activityMobileDialog"
            append-to-body
            :before-close="resetActivity"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="dialogActivity">
            <div @click="addActivity" class="activityBox cursorPointer">
                <img class="widthAll" :src="activityItem.thumbnail" alt="img">
                <p class="title">{{activityItem.title}}</p>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {dateFilterDayCN} from "../../../assets/js/filters";

    export default {
        name: "HOME",
        data() {
            return {
                // 当前轮播图
                formItem: {
                    inWeb: null, // 站内外标识
                    linkAddress: '', // 地址
                },
                isPlayVideo: true, // 是否播放video
                ImgHeight: "0px",
                backgroundData: [], // 轮播图
                activeName: 'mv', // 标签页默认选中
                mvList: [], // mv列表
                rootUrl: this.$api.imgUrl(),
                // 详情
                dialogVisible: false, // 是否显示蒙版
                // 视频详情表单
                detailForm: {
                    img: "",
                    url: "",
                    type: ""
                },
                // 音乐列表
                musicList: [],
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 6 // 显示条数
                },
                // mv更多
                mvOptions: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 6 // 显示条数
                },
                // 活动表单
                activityItem: {
                    id: '', // vip活动id
                    thumbnail: '', // 缩略图
                    title: '', // 活动标题
                },
                dialogActivity: false, // 是否显示蒙版
                animationCountNum: 0, // 统计触发bus的次数
            }
        },
        methods: {
            // 查询动画数据
            getData() {
                var _t = this;
                _t.$api.get('vip/indexDrawing/11001100', {}, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null) {
                                // 动画
                                let imgUrl = res.data.ConfidentialNoticeContextStr !== undefined && res.data.ConfidentialNoticeContextStr !== null ? res.data.ConfidentialNoticeContextStr : ''; // 图片文件
                                // 音频
                                let songUrl = res.data.vipId !== undefined && res.data.vipId !== null ? res.data.vipId : ''; // 图片文件
                                _t.$nextTick(function () {
                                    if (imgUrl !== '' && songUrl !== '') {
                                        _t.getAnimation(imgUrl, songUrl);
                                    } else {
                                        _t.isPlayVideo = false;
                                    }
                                });
                            }
                            break;
                        default: // 查询失败
                            _t.isPlayVideo = false;
                            _t.$message.error(res.message);
                            break;
                    }
                });
            },
            // 加载动画
            getAnimation(gif, song) {
                var _t = this;
                // 刷新首次加载 document.body.getAttribute("video_play") === "false"
                // if (document.body.getAttribute("video_play") === "false") {
                _t.isPlayVideo = true; // 播放
                var divBox = document.getElementById('logoGif');
                var imgGif = document.createElement('img');
                imgGif.src = _t.$api.imgUrl() + gif;
                imgGif.className = 'loading_animation';
                var audio = document.createElement('audio');
                audio.src = _t.$api.imgUrl() + song;
                audio.autoplay = true; // 设置自动播放
                if (audio !== undefined && audio !== null) {
                    audio.addEventListener('timeupdate', function () {
                        if (audio !== null && audio.currentTime >= 3.8) {
                            _t.isPlayVideo = false;
                            audio = null;
                            document.body.setAttribute("video_play", true);
                        }
                    });
                }
                imgGif.onload = function () {
                    if (divBox) {
                        if (divBox.hasChildNodes()) {
                            divBox.removeChild(divBox.lastChild)
                        }
                        divBox.append(imgGif);
                        var index = 0;
                        var timer = setInterval(function () {
                            if (index >= 3) {
                                _t.isPlayVideo = false;
                                clearInterval(timer);
                            }
                            index++;
                        }, 1000);
                    }
                };
                // } else {
                //     _t.isPlayVideo = false;
                // }
            },
            // 查询轮播图接口
            getHomeAll() {
                var _t = this;
                _t.$api.get("home/all", {}, function (res) {
                    switch (res.status) {
                        case 200:
                            let resData = res.data !== null ? res.data : [];
                            let backgroundData = new Array(); // 渲染数组
                            if (resData.length <= 4) {
                                resData.forEach((item, index) => {
                                    item.value = index;
                                    if (item.carouselMapStr !== null && item.carouselMapStr !== "") {
                                        item.carouselMapStr = _t.$api.imgUrl() + item.carouselMapStr;
                                    }
                                    // 处理站内外表示
                                    if (item.site !== undefined && item.site !== null) {
                                        item.inWeb = item.site === 0 ? true : false;
                                    }
                                });
                                backgroundData = resData;
                            } else {
                                for (let i = 0; i < 4; i++) {
                                    resData[i].value = i;
                                    resData[i].carouselMapStr = _t.$api.imgUrl() + resData[i].carouselMapStr;
                                    // 处理站内外表示
                                    if (resData[i].site !== undefined && resData[i].site !== null) {
                                        resData[i].inWeb = resData[i].site === 0 ? true : false;
                                    }
                                    backgroundData.push(resData[i]);
                                }
                            }
                            _t.backgroundData = backgroundData;
                            _t.$nextTick(function () {
                                let dom = document.getElementsByClassName('swiperHeight');
                                if (dom !== null && dom.length !== 0) {
                                    _t.ImgHeight = dom[0].clientHeight + 'px';
                                }
                            });
                            break;
                        default:
                            break;
                    }
                });
            },
            // mv轮播
            getMv(flag) {
                let _t = this;
                _t.$api.post("video/movieVideo", {
                    showHome: 1, // 首页music 1:首页 0:模块
                    page: _t.mvOptions.currentPage, // 当前页
                    limit: _t.mvOptions.pageSize, // 限制死,首页mv最多显示10条
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'), // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            if (res.data) {
                                let resData = res.data.content === null ? [] : res.data.content;
                                resData.forEach(item => {
                                    // 发行日期
                                    item.releaseTime = dateFilterDayCN(item.releaseTime !== undefined ? item.releaseTime : "");
                                    // 标题
                                    item.title = item.videoName !== undefined ? item.videoName : "";
                                    // 处理时长
                                    if (item.videoTime !== undefined && item.videoTime !== null) {
                                        let minutes = parseInt(item.videoTime / 60);
                                        let seconds = parseInt(item.videoTime % 60);
                                        item.time = (minutes >= 10 ? minutes : "0" + minutes) + ":" + (seconds >= 10 ? seconds : "0" + seconds);
                                    }
                                    // 歌手
                                    item.user = item.singer !== undefined ? item.singer : "";
                                    // 图片
                                    item.imgUrl = item.thumbnail !== undefined ? item.thumbnail : "";
                                    // 资源路径
                                    item.url = item.videoPath !== undefined ? item.videoPath : "";
                                });
                                _t.mvOptions.total = res.data.total !== undefined && res.data.total !== null ? res.data.total : 0;
                                if (resData.length === _t.mvOptions.total && flag === true) {
                                    _t.$message.warning(_t.$t('public.noMoreData'));
                                }
                                _t.mvList = resData;
                            }
                            break;
                        default:
                            break;
                    }
                });
            },
            // 点击关闭蒙版
            resetVideo() {
                let _t = this;
                _t.dialogVisible = false;
                _t.detailForm.url = "";
                _t.detailForm.img = "";
                _t.$refs.videoDialog.pause();
            },
            // 点击播放
            clickVideo(item) {
                let _t = this;
                // 接入友盟统计
                _czc.push(['_trackEvent', '首页', '播放','MV']);
                _t.detailForm.url = item.url;
                _t.detailForm.img = item.img;
                _t.dialogVisible = true;
                _t.$nextTick(function () {
                    // 重新加载src指定的资源
                    _t.$refs.videoDialog.load();
                    // 自动播放
                    _t.$refs.videoDialog.play();
                });
            },
            // 获取首页music
            getMusic(flag) {
                let _t = this;
                _t.$api.post("music/musicList", {
                    showHome: 1, // 首页music 1:首页 0:模块
                    page: _t.options.currentPage, // 当前页
                    limit: _t.options.pageSize, // 每页显示的条数
                    grouping: null,
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'), // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            var resData = res.data.content === null ? [] : res.data.content;
                            resData.forEach(item => {
                                item.publishTime = dateFilterDayCN(item.publishTime);
                                if (item.musicLikeStr !== undefined && item.musicLikeStr !== '') {
                                    item.musicLikeStr = JSON.parse(item.musicLikeStr);
                                    if (item.musicLikeStr.length !== 0) {
                                        item.musicLikeStr.forEach((val) => {
                                            val.icon = ''; // 图标地址
                                            if (val.k !== undefined && val.k !== null) {
                                                val.icon = _t.$api.imgUrl() + val.k;
                                            }
                                        });
                                    }
                                }
                            });
                            _t.options.total = res.data.total !== null ? res.data.total : 0;
                            if (resData.length === _t.options.total && flag === true) {
                                _t.$message.warning(_t.$t('public.noMoreData'));
                            }
                            _t.musicList = resData;
                            break;
                        default:
                            _t.musicList = [];
                            _t.options.total = 0;
                            break;
                    }
                });
            },
            // 点击查看更多mv
            clickMoreMv() {
                let _t = this;
                _t.mvOptions.pageSize += 10;
                _t.getMv(true);
            },
            // 点击查看更多 music
            clickMoreMusic() {
                let _t = this;
                _t.options.pageSize += 10;
                _t.getMusic(true);
            },
            // 点击查看详情
            clickDetail(img) {
                var _t = this;
                // 站内外标识不为 null
                if (img.inWeb !== null && img.inWeb === true) {
                    // 站内
                    _t.backgroundData.forEach((item) => {
                        if (item.carouselMapStr === img.carouselMapStr) {
                            let linkAddress = item.linkAddress !== undefined && item.linkAddress !== null ? item.linkAddress : '';
                            let linkAddressArr = linkAddress.split(',');
                            let module = ''; // 模块
                            let contentId = ''; // 内容id
                            if (linkAddressArr.length === 2) {
                                module = linkAddressArr[0];
                                contentId = linkAddressArr[1];
                            } else if (linkAddressArr.length === 1) {
                                module = linkAddressArr[0];
                            }
                            switch (module) {
                                case '1': // 新闻
                                    _t.$jump.toJumpPage('NEWS_DETAILS', 'M_NEWS_DETAILS', {
                                        params: {
                                            WJE_NEWS_ID: contentId
                                        }
                                    });
                                    localStorage.setItem('WJE_NEWS_ID', contentId);
                                    break;
                                // case '2': // 行程
                                //     _t.$router.push({name: 'TRAVEL'});
                                //     break;
                                case '3': // 活动公告
                                    _t.$jump.toJumpPage('ACTIVITIES_DETAILS', 'M_ACTIVITIES_DETAILS', {
                                        params: {
                                            WJE_ACTIVITIES_ID: contentId
                                        }
                                    });
                                    localStorage.setItem('WJE_ACTIVITIES_ID', contentId);
                                    break;
                                // case '4': // 综艺
                                //     _t.$router.push({name: 'VARIETY'});
                                //     break;
                                // case '5': // 音乐
                                //     _t.$router.push({
                                //         name: 'MUSIC', params: {
                                //             WJE_HOME_INFO: true, // true 代表 music false 代表 视频
                                //         }
                                //     });
                                //     break;
                                case '6': // 视频 当前页显示
                                    // 请求获取mv详情的接口
                                    _t.getMvDetail(contentId);
                                    break;
                                case '7': // 代言详情
                                    _t.$jump.toJumpPage('END_DETAILS', 'M_END_DETAILS', {
                                        params: {
                                            WJE_END_DETAILS_ID: contentId
                                        }
                                    });
                                    localStorage.setItem('WJE_END_DETAILS_ID', contentId);
                                    break;
                                default:
                                    break;
                            }
                        }
                    });
                } else if (img.inWeb !== null && img.inWeb === false) {
                    // 站外
                    window.open(img.linkAddress);
                }
            },
            // 根据内容id获取 mv详情数据
            getMvDetail(id) {
                let _t = this;
                if (id !== '') {
                    _t.$api.get('contentManage/listAllById/3/' + id, {}, function (res) {
                        switch (res.status) {
                            case 200: // 查询成功
                                let resData = res.data !== null ? res.data : [];
                                if (resData.length !== 0) {
                                    let ObjItem = new Object();
                                    ObjItem.url = resData[0].videoPath !== undefined && resData[0].videoPath !== null ? resData[0].videoPath : '';
                                    ObjItem.img = resData[0].thumbnail !== undefined && resData[0].thumbnail !== null ? _t.$api.imgUrl() + resData[0].thumbnail : '';
                                    _t.clickVideo(ObjItem);
                                }
                                break;
                            default: // 查询失败
                                break;
                        }
                    });
                } else {
                    _t.$message.warning(_t.$t('home.hasNotData'));
                }
            },
            // 获取vip活动内容
            getActivity() {
                let _t = this;
                _t.$api.get('activity/getActivityByNewTime', {}, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null) {
                                let resData = res.data;
                                // 处理活动id
                                _t.activityItem.id = resData.id !== undefined && resData.id !== null ? resData.id : '';
                                // 处理标题
                                _t.activityItem.title = resData.activityTitle !== undefined && resData.activityTitle !== null ? resData.activityTitle : ''; // 活动标题
                                // 处理缩略图
                                if (resData.thumbnail !== undefined && resData.thumbnail !== null) {
                                    let thumbnail = resData.thumbnail.split(',');
                                    if (thumbnail.length !== 0) {
                                        _t.dialogActivity = true;
                                        _t.activityItem.thumbnail = _t.$api.imgUrl() + thumbnail[0];
                                    }
                                }
                            }
                            break;
                        default:
                            break;
                    }
                });
            },
            // 重置vip活动弹窗
            resetActivity() {
                let _t = this;
                _t.dialogActivity = false;
                document.body.setAttribute('activity_show_home', false)
            },
            // 点击判断是否跳转vip活动页面
            addActivity() {
                let _t = this;
                // 判断是否登录记忆是否加入vip
                let userId = _t.getCookie('WJE_USER_ID');
                let isLogin = _t.getCookie('WJE_IS_LOGIN');
                if (userId !== null && userId !== 'null' && isLogin !== null && isLogin !== 'null' && isLogin === 'true') {
                    _t.$api.post('user/getById', {
                        id: userId,
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 查询成功
                                if (res.data !== undefined && res.data !== null) {
                                    let resData = res.data;
                                    if (resData.role !== undefined && resData.role !== null && (resData.role === 1 || resData.role === 2)) {
                                        _t.resetActivity();
                                        _t.$jump.toJumpPage('VIP_DETAILS', 'M_VIP_DETAILS', {
                                            WJE_ACTIVITY_ID: _t.activityItem.id
                                        });
                                        localStorage.setItem('WJE_ACTIVITY_ID', _t.activityItem.id);
                                    }
                                }
                                break;
                            default: // 异常
                                break;
                        }
                    });
                } else {
                    _t.$message.warning(_t.$t('vipActivities.isNotLogin'));
                }
            }
        },
        created() {
            let _t = this;
            // 判断当前路由是否需要跳转
            let jump = _t.$jump.isToJump(_t.$route.name, 'HOME', 'M_HOME');
            if (jump === false) {
                // 获取轮播图接口
                _t.getHomeAll();
                // 查询动画数据 ---- 注释
                // _t.getData();
                // 获取mv接口
                _t.getMv();
                // 获取Music接口
                _t.getMusic();
                let activity_show_home = document.body.getAttribute('activity_show_home');
                if (activity_show_home === 'true' || activity_show_home === null) {
                    // 获取vip活动信息
                    // _t.getActivity();
                }
            }


            // 动画---注释
            // _t.$bus.on('getAnimation_mobile', (val) => {
            //     _t.animationCountNum++;
            //     if (_t.animationCountNum === 1) {
            //         _t.animationCountNum = 0;
            //         // 查询动画数据
            //         _t.getData();
            //     }
            // });
        },
        destroyed() {
            let _t = this;
            _t.$bus.off('getAnimation_mobile');
        }
    }
</script>


<style scoped>
    .mobileHome_title {
        line-height: 30px;
        padding: 1% 0 1% 10px;
    }

    .mobileHome_title .title {
        margin-right: 10px;
    }

    .playIcon {
        cursor: pointer;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .musicBox {
        height: 20%;
    }

    .musicBox > div {
        height: 100%;
    }

    .mobile_img {
        max-width: 30%;
    }

    .mobile_img > img {
        width: 100%;
    }

    .mobileMusic_content {
        flex: 1;
        padding: 2%;
    }

    .mobileMusic_content .title {
        line-height: 20px;
        margin-bottom: 1%;
    }

    .mobileTime {
        color: #969696;
    }

    .mobileMusic {
        display: flex;
        height: 20px;
        line-height: 20px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1%;
    }

    .mobileMusicLink a.iconsB {
        margin-right: 10px;
    }
</style>
<style>
    #tab-mv {
        position: relative;
    }

    #tab-mv:after {
        content: "";
        position: absolute;
        width: 2px;
        height: 12px;
        background-color: #fff;
        right: 0;
        top: 5px;
        border-right: 2px solid #fff;
    }

    .mobileHome_swiper .el-carousel__button {
        width: 5px;
        height: 5px;
        border-radius: 50%;
    }

    .mobileHome_tabs .el-tabs__nav-wrap::after {
        height: 0;
    }

    .mobileHome_tabs .el-tabs__header.is-top {
        text-align: center;
    }

    .mobileHome_tabs .el-tabs__nav-scroll,
    .mobileHome_tabs .el-tabs__nav.is-top {
        text-align: center;
        margin: 0 auto;
    }

    .mobileHome_tabs .el-tabs__nav-scroll {
        display: inline-block;
    }

    .mobileHome_tabs .el-tabs__item {
        font-size: 14px;
        line-height: 25px;
        height: 25px;
        padding: 0 15px;
        color: #fff !important;
    }

    .mobileHome_tabs .el-tabs__item.is-active {
        color: #fff;
    }

    .mobileHome_tabs .el-tabs__active-bar {
        background-color: #fff;
    }

    .mobileHome_tabs .el-tab-pane {
        padding: 0 10px;
    }
</style>
