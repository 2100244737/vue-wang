<template>
    <div class="mobileMusic_Box">
        <!--banner图 及导航-->
        <div class="tc positionRelative">
            <div v-if="carouselMapImg !== ''" class="message_img bannerBox" :style="{backgroundImage:'url('+ carouselMapImg +')'}">
                <img class="widthAll visibilityHidden" src="../../../assets/img/thumbnail_bg/bannerThumbnail.png"
                     alt="banner">
            </div>
            <div v-else class="message_img bannerBox defaultBannerBox">
                <img class="widthAll visibilityHidden" src="../../../assets/img/thumbnail_bg/bannerThumbnail.png"
                     alt="banner">
            </div>
            <ul class="musicOrVideos">
                <!--调用接口-->
                <li :class="{active:styleActive}" @click="handleMusic">{{formItem.music}}</li>
                <li :class="{active:!styleActive}" @click="handleVideos">{{formItem.mv}}</li>
            </ul>
        </div>
        <!--内容区域-->
        <div class="musicContent">
            <!--音乐模块-->
            <div v-show="styleActive">
                <!--个人音乐-->
                <div class="personal">
                    <div class="musicTitle">
                        <div class="title">{{$t('musicModule.personal')}}</div>
                        <div class="pageBtn">
                            <span @click="getPersonalMusicPrev">{{$t('public.prevText')}}</span>
                            <span @click="getPersonalMusicNext">{{$t('public.nextText')}}</span>
                        </div>
                    </div>
                    <div v-if="PersonalMusic.length === 0" class="tableNotHasData flex_1">
                        <img class="notData" src="../../../assets/img/common/notData.png" alt="notData">
                        <div class="notDataText">{{$t('public.notData')}}</div>
                    </div>
                    <div v-else v-for="(item,index) in PersonalMusic" :key="index"
                         class="mobile_maskBox musicBox marginBottom15">
                        <div class="mobile_mask displayFlexRow">
                            <div class="mobile_img" :style="{backgroundImage:'url('+ item.thumbnail +')'}">
                                <img class="widthAll visibilityHidden" :src="item.thumbnail" alt="">
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
                                    <template v-for="(val,i) in item.musicLikeStr">
                                        <a v-if="val.icon !== ''"
                                           class="iconsB"
                                           target="_blank"
                                           onclick="_czc.push(['_trackEvent', '音乐', '点击', '个人音乐']);"
                                           :href='val.v'>
                                            <img :src="val.icon" alt="">
                                        </a>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--合作音乐-->
                <div class="cooperative">
                    <div class="musicTitle">
                        <div class="title">{{$t('musicModule.cooperative')}}</div>
                        <div class="pageBtn">
                            <span @click="getCooperativeMusicPrev">{{$t('public.prevText')}}</span>
                            <span @click="getCooperativeMusicNext">{{$t('public.nextText')}}</span>
                        </div>
                    </div>
                    <div v-if="CooperativeMusic.length === 0" class="tableNotHasData flex_1">
                        <img class="notData" src="../../../assets/img/common/notData.png" alt="notData">
                        <div class="notDataText">{{$t('public.notData')}}</div>
                    </div>
                    <div v-else v-for="(data,j) in CooperativeMusic" :key="j"
                         class="mobile_maskBox musicBox marginBottom15">
                        <div class="mobile_mask displayFlexRow">
                            <div class="mobile_img" :style="{backgroundImage:'url('+ data.thumbnail +')'}">
                                <img class="widthAll visibilityHidden" :src="data.thumbnail" alt="">
                            </div>
                            <div class="mobileMusic_content">
                                <div class="title">{{data.musicName}}</div>
                                <div class="mobileMusic">
                                    <div class="singer">
                                        <span>{{$t('musicModule.singerName')}}:</span>
                                        <span>{{data.singer}}</span>
                                    </div>
                                </div>
                                <div class="mobileMusic mobileTime">{{data.publishTime}}</div>
                                <div class="mobileMusicLink">
                                    <template v-for="(val,i) in data.musicLikeStr">
                                        <a v-if="val.icon !== ''"
                                           class="iconsB"
                                           target="_blank"
                                           onclick="_czc.push(['_trackEvent', '音乐', '点击', '合作音乐']);"
                                           :href='val.v'>
                                            <img :src="val.icon" alt="">
                                        </a>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--MV模块-->
            <div v-show="!styleActive">
                <!--个人MV-->
                <div class="personal">
                    <!--标题-->
                    <div class="musicTitle">
                        <div class="title">{{$t('videoModule.personal')}}</div>
                        <div class="pageBtn">
                            <span @click="getPersonalMvPrev">{{$t('public.prevText')}}</span>
                            <span @click="getPersonalMvNext">{{$t('public.nextText')}}</span>
                        </div>
                    </div>
                    <!--内容-->
                    <div v-if="videoListTop.length === 0" class="tableNotHasData flex_1">
                        <img class="notData" src="../../../assets/img/common/notData.png" alt="notData">
                        <div class="notDataText">{{$t('public.notData')}}</div>
                    </div>
                    <div v-else v-for="(item,index) in videoListTop" :key="index" class="mobile_maskBox marginBottom15">
                        <div class="mobile_mask">
                            <div class="mobileHome_title">
                                <span class="title">{{item.videoName}}</span>
                                <span>{{$t('videoModule.singer')}}：{{item.singer}}</span>
                            </div>
                            <div @click="clickVideo(item)" class="mobileHome_content positionRelative">
                                <div class="message_img"
                                     :style="{backgroundImage:'url('+ item.thumbnail+')'}">
                                    <img :id="'mv_img_' + index" class="widthAll visibilityHidden"
                                         src="../../../assets/img/thumbnail_bg/mvThumbnail.png" alt="mv">
                                </div>
                                <img class="playIcon"
                                     src="../../../assets/img/common/play-icon.png"
                                     alt="play">
                            </div>
                        </div>
                    </div>
                </div>
                <!--合作MV-->
                <div class="cooperative">
                    <!--标题-->
                    <div class="musicTitle">
                        <div class="title">{{$t('videoModule.cooperative')}}</div>
                        <div class="pageBtn">
                            <span @click="getCooperativeMvPrev">{{$t('public.prevText')}}</span>
                            <span @click="getCooperativeMvNext">{{$t('public.nextText')}}</span>
                        </div>
                    </div>
                    <!--内容-->
                    <div v-if="videoListBottom.length === 0" class="tableNotHasData flex_1">
                        <img class="notData" src="../../../assets/img/common/notData.png" alt="notData">
                        <div class="notDataText">{{$t('public.notData')}}</div>
                    </div>
                    <div v-else v-for="(item,index) in videoListBottom" :key="index" class="mobile_maskBox marginBottom15">
                        <div class="mobile_mask">
                            <div class="mobileHome_title">
                                <span class="title">{{item.videoName}}</span>
                                <span>{{$t('videoModule.singer')}}：{{item.singer}}</span>
                            </div>
                            <div @click="clickVideo(item)" class="mobileHome_content positionRelative">
                                <div class="message_img"
                                     :style="{backgroundImage:'url('+ item.thumbnail+')'}">
                                    <img :id="'mv_img_' + index" class="widthAll visibilityHidden"
                                         src="../../../assets/img/thumbnail_bg/mvThumbnail.png" alt="mv">
                                </div>
                                <img class="playIcon"
                                     src="../../../assets/img/common/play-icon.png"
                                     alt="play">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
            <video ref="videoDialog"
                   width="100%"
                   height="100%"
                   controls="controls"
                   :poster="detailForm.img" class="video">
                <source :src="detailForm.url" :type="detailForm.type">
            </video>
        </el-dialog>
    </div>
</template>

<script>
    import {dateFilterDayCN} from "../../../assets/js/filters";

    export default {
        name: "index",
        data() {
            return {
                styleActive: true, // 显示music还是mv
                carouselMapImg: '', // banner图
                // 菜单集合
                formItem: {
                    music: '', // 音乐
                    mv: '', // MV
                },
                rootUrl: this.$api.imgUrl(),
                language: localStorage.getItem("WJE_LANGUAGE") || (navigator.language === "zh-CN" ? "zh_CN" : "en"),
                // 个人视频
                videoListTop: [],
                // 合作视频
                videoListBottom: [],
                // 个人音乐
                PersonalMusic: [],
                // 合作音乐
                CooperativeMusic: [],
                // 个人音乐分页
                personalMusicOptions: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 4, // 显示条数
                },
                // 合作音乐分页
                cooperateMusicOptions: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 4, // 显示条数
                },
                // 个人MV分页
                mvPersonalOptions: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 3, // 显示条数
                },
                // 合作mv分页
                mvCooperativeOptions: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 3, // 显示条数
                },
                // 详情
                dialogVisible: false, // 是否显示蒙版
                // 视频详情表单
                detailForm: {
                    img: '',
                    url: '',
                    type: ''
                },
            }
        },
        methods: {
            // Music
            handleMusic() {
                let _t = this;
                _t.styleActive = true;
            },
            // Videos
            handleVideos() {
                let _t = this;
                _t.styleActive = false;
            },
            // 获取二级导航菜单
            getMenu() {
                let _t = this;
                _t.$api.post('menu/listMenuInfoByParentId', {
                    parentid: '3', // 1: 音乐 id
                    language: _t.language
                }, function (res) {
                    switch (res.status) {
                        case 200: // 获取详情
                            if (res.data !== undefined && res.data !== null) {
                                let menuList = res.data;
                                menuList.forEach((item) => {
                                    if (item.description !== undefined && item.description === 'music') {
                                        // 音乐
                                        _t.formItem.music = item.menuName;
                                    } else if (item.description !== undefined && item.description === 'mv') {
                                        // MV
                                        _t.formItem.mv = item.menuName;
                                    }
                                });
                            }
                            break;
                        default:
                            break;
                    }
                });
            },
            // 查询banner图
            getBanner() {
                let _t = this;
                _t.$api.post('home/getBanner', {
                    site: 2, // 2:MUSIC (后台管理系统可查具体值得含义)
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
            // 获取music数据 个人数据
            getDataPersonal() {
                let _t = this;
                _t.$api.post('music/musicList', {
                    showHome: 0, // 首页music 1:首页 0:模块
                    page: _t.personalMusicOptions.currentPage, // 当前页
                    limit: _t.personalMusicOptions.pageSize, // 每页显示条数
                    grouping: 0, // 0: 自己的音乐 1: 和别人合作的音乐
                    language: _t.language, // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            let resData = res.data.content === null ? [] : res.data.content;
                            resData.forEach((item) => {
                                // 缩略图
                                if (item.thumbnail !== null && item.thumbnail !== '') {
                                    item.thumbnail = _t.$api.imgUrl() + item.thumbnail;
                                }
                                // 处理时间戳
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
                            _t.PersonalMusic = resData;
                            _t.personalMusicOptions.total = res.data.total !== null ? res.data.total : 0;
                            break;
                        default:
                            _t.PersonalMusic = [];
                            _t.personalMusicOptions.total = 0;
                            break;
                    }
                });
            },
            // 获取music个人数据下一页
            getPersonalMusicNext() {
                let _t = this;
                if (_t.personalMusicOptions.currentPage * _t.personalMusicOptions.pageSize < _t.personalMusicOptions.total) {
                    _t.personalMusicOptions.currentPage += 1;
                    _t.getDataPersonal();
                } else {
                    _t.$message.warning(_t.$t('public.noMoreData'));
                }
            },
            // 获取music个人数据上一页
            getPersonalMusicPrev() {
                let _t = this;
                if (_t.personalMusicOptions.currentPage !== 1) {
                    _t.personalMusicOptions.currentPage -= 1;
                    _t.getDataPersonal();
                } else {
                    _t.$message.warning(_t.$t('public.noMoreData'));
                }
            },
            // 获取music数据 合作数据
            getMusicCooperative() {
                let _t = this;
                _t.$api.post('music/musicList', {
                    showHome: 0, // 首页music 1:首页 0:模块
                    page: _t.cooperateMusicOptions.currentPage, // 当前页
                    limit: _t.cooperateMusicOptions.pageSize, // 每页显示条数
                    grouping: 1, // 0: 自己的音乐 1: 和别人合作的音乐
                    language: _t.language, // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            let resData = res.data.content === null ? [] : res.data.content;
                            resData.forEach((item) => {
                                // 缩略图
                                if (item.thumbnail !== null && item.thumbnail !== '') {
                                    item.thumbnail = _t.$api.imgUrl() + item.thumbnail;
                                }
                                // 处理时间戳
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
                            _t.CooperativeMusic = resData;
                            _t.cooperateMusicOptions.total = res.data.total !== null ? res.data.total : 0;
                            break;
                        default:
                            _t.CooperativeMusic = [];
                            _t.cooperateMusicOptions.total = 0;
                            break;
                    }
                });
            },
            // 获取music个人数据下一页
            getCooperativeMusicNext() {
                let _t = this;
                if (_t.cooperateMusicOptions.currentPage * _t.cooperateMusicOptions.pageSize < _t.cooperateMusicOptions.total) {
                    _t.cooperateMusicOptions.currentPage += 1;
                    _t.getMusicCooperative();
                } else {
                    _t.$message.warning(_t.$t('public.noMoreData'));
                }
            },
            // 获取music个人数据上一页
            getCooperativeMusicPrev() {
                let _t = this;
                if (_t.cooperateMusicOptions.currentPage !== 1) {
                    _t.cooperateMusicOptions.currentPage -= 1;
                    _t.getMusicCooperative();
                } else {
                    _t.$message.warning(_t.$t('public.noMoreData'));
                }
            },
            // 获取自己发布视频的下一页
            getPersonalMvNext() {
                let _t = this;
                if (_t.mvPersonalOptions.currentPage * _t.mvPersonalOptions.pageSize < _t.mvPersonalOptions.total) {
                    _t.mvPersonalOptions.currentPage += 1;
                    _t.getMvPersonal();
                } else {
                    _t.$message.warning(_t.$t('public.noMoreData'));
                }
            },
            // 获取自己发布视频的上一页
            getPersonalMvPrev() {
                let _t = this;
                if (_t.mvPersonalOptions.currentPage !== 1) {
                    _t.mvPersonalOptions.currentPage -= 1;
                    _t.getMvPersonal();
                } else {
                    _t.$message.warning(_t.$t('public.noMoreData'));
                }
            },
            // 获取自己发布的mv视频
            getMvPersonal() {
                let _t = this;
                _t.$api.post('video/movieVideo', {
                    showHome: 0, // 首页music 1:首页 0:模块
                    page: _t.mvPersonalOptions.currentPage, // 当前页
                    limit: _t.mvPersonalOptions.pageSize, // 每页显示条数
                    grouping: 0, // 0: 自己的音乐 1: 和别人合作的音乐
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'), // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            let resData = res.data.content === null ? [] : res.data.content;
                            resData.forEach(item => {
                                // 缩略图
                                if (item.thumbnail !== null && item.thumbnail !== '') {
                                    item.thumbnail = _t.$api.imgUrl() + item.thumbnail;
                                }
                                // 视频文件
                                if (item.videoPath !== null && item.videoPath !== '') {
                                    item.videoPath = _t.$api.imgUrl() + item.videoPath;
                                }
                                // 处理时间戳
                                item.releaseTime = dateFilterDayCN(item.releaseTime);
                            });
                            _t.videoListTop = resData;
                            _t.mvPersonalOptions.total = res.data.total !== null ? res.data.total : 0;
                            break;
                        default:
                            _t.videoListTop = [];
                            _t.mvPersonalOptions.total = 0;
                            break;
                    }
                });
            },
            // 获取和别人合作的视频
            getMvCooperative() {
                let _t = this;
                _t.$api.post('video/movieVideo', {
                    showHome: 0, // 首页music 1:首页 0:模块
                    page: _t.mvCooperativeOptions.currentPage, // 当前页
                    limit: _t.mvCooperativeOptions.pageSize, // 每页显示条数
                    grouping: 1, // 0: 自己的音乐 1: 和别人合作的音乐
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'), // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            let resData = res.data.content === null ? [] : res.data.content;
                            resData.forEach(item => {
                                // 缩略图
                                if (item.thumbnail !== null && item.thumbnail !== '') {
                                    item.thumbnail = _t.$api.imgUrl() + item.thumbnail;
                                }
                                // 视频文件
                                if (item.videoPath !== null && item.videoPath !== '') {
                                    item.videoPath = _t.$api.imgUrl() + item.videoPath;
                                }
                                // 处理时间戳
                                item.releaseTime = dateFilterDayCN(item.releaseTime);
                            });
                            _t.videoListBottom = resData;
                            _t.mvCooperativeOptions.total = res.data.total !== null ? res.data.total : 0;
                            break;
                        default:
                            _t.videoListBottom = [];
                            _t.mvCooperativeOptions.total = 0;
                            break;
                    }
                });
            },
            // 获取合作发布视频的下一页
            getCooperativeMvNext() {
                let _t = this;
                if (_t.mvCooperativeOptions.currentPage * _t.mvCooperativeOptions.pageSize < _t.mvCooperativeOptions.total) {
                    _t.mvCooperativeOptions.currentPage += 1;
                    _t.getMvCooperative();
                } else {
                    _t.$message.warning(_t.$t('public.noMoreData'));
                }
            },
            // 获取合作发布视频的上一页
            getCooperativeMvPrev() {
                let _t = this;
                if (_t.mvCooperativeOptions.currentPage !== 1) {
                    _t.mvCooperativeOptions.currentPage -= 1;
                    _t.getMvCooperative();
                } else {
                    _t.$message.warning(_t.$t('public.noMoreData'));
                }
            },
            //点击播放
            clickVideo(item) {
                let _t = this;
                // 接入友盟统计
                _czc.push(['_trackEvent', '音乐', '播放','MV']);
                _t.detailForm.url = item.videoPath;
                _t.detailForm.img = item.thumbnail;
                _t.dialogVisible = true;
                _t.$nextTick(function () {
                    // 重新加载src指定的资源
                    _t.$refs.videoDialog.load();
                    // 自动播放
                    _t.$refs.videoDialog.play()
                })
            },
            //点击关闭蒙版
            resetVideo() {
                let _t = this;
                _t.dialogVisible = false;
                _t.detailForm.url = '';
                _t.detailForm.img = '';
                _t.$refs.videoDialog.pause()
            },
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'MUSIC', 'M_MUSIC');
            if (jump === false) {
                // 获取二级菜单
                _t.getMenu();
                // 获取banner
                _t.getBanner();
                // 个人音乐
                _t.getDataPersonal();
                // 合作音乐
                _t.getMusicCooperative();
                // 个人mv
                _t.getMvPersonal();
                // 合作mv
                _t.getMvCooperative();
            }
        }
    }
</script>

<style scoped>
    .musicOrVideos {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 20px;
        text-align: center;
    }

    .musicOrVideos li.active {
        border-bottom: 2px solid #fff;
    }

    .musicOrVideos li {
        display: inline-block;
        font-size: 16px;
        margin: 0 10px;
        color: #ccc;
    }

    .musicContent {
        width: 90%;
        margin: 0 auto;
    }

    .musicBox {
        height: 20%;
    }

    .musicBox > div {
        height: 100%;
    }

    .mobile_img {
        width: 30%;
        background-size: cover;
    }

    .mobileMusic_content {
        padding: 2% 3%;
        flex: 1;
    }

    .mobileMusic_content .title {
        font-size: 16px;
    }

    .mobileMusic_content .singer,
    .mobileMusic_content .mobileTime {
        font-size: 14px;
    }

    .mobileMusicLink a.iconsB {
        margin-right: 10px;
    }

    .musicTitle {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        line-height: 50px;
    }

    .musicTitle .title {
        font-size: 18px;
    }

    .musicTitle .pageBtn > span {
        margin-left: 10px;
        font-size: 13px;
    }

    .playIcon {
        width: 40px;
        height: 40px;
        cursor: pointer;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .mobileHome_title {
        line-height: 30px;
        padding: 1% 0 1% 10px;
    }

    .mobileHome_title .title {
        margin-right: 10px;
    }
</style>
