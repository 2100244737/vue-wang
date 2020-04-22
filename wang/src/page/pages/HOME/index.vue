<template>
    <div class="homeBox">
        <!--闪频动画-->
        <div v-show="isPlayVideo" class="loading_animationBox">
            <div id="logoGif"></div>
        </div>
        <!--首页内容-->
        <div class="home_box">
            <!--首页轮播图-->
            <div class="home-bottom">
                <img id="bgBtn" class="bg widthAll"
                     :src="formItem.picture_img === '' ? require('../../../assets/img/swiper/home.jpg') : formItem.picture_img"
                     alt=""
                     @click="imgClick(formItem.picture_img)">
                <div class="bottom-text">
                    <div class="bottom-left">
                        <div class="left-data">
                            <div>
                                <span class="lg">0{{number}}</span>
                                <span
                                    class="lt">/{{formItem.picture_img === '' ? ' 01' : ' 0' + formItem.totalNum}}</span>
                            </div>
                            <div>
                                <img @click="lastBtn" class="marginRight10 pointer"
                                     src="../../../assets/img/common/data_02.png" alt="">
                                <img @click="nextBtn" class="pointer" src="../../../assets/img/common/data_01.png"
                                     alt="">
                            </div>
                        </div>
                        <!--
                        <div class="thank">THANK YOU</div>
                        -->
                    </div>
                    <div class="bottom-right">
                        <div class="des">TEAM WANG</div>
                        <span class="bottom_line">___</span>
                    </div>
                </div>
            </div>
            <!--中间模块MUSIC-->
            <div class="content">
                <div class="play-top">
                    <div class="top-left">
                        <p class="big">{{$t('home.title')}}</p>
                    </div>
                    <div @click="clickMore" class="top-right">
                        <span>{{$t('home.more')}}</span>
                        <img src="../../../assets/img/common/data_01.png" alt="">
                    </div>
                </div>
                <div class="play-middle">
                    <div class='middle-left' @click="activeHandler('left')" :class=" type === 'left' ? 'active' : ''">
                        {{$t('home.mv')}}
                    </div>
                    <div class="line">|</div>
                    <div class='middle-right' @click="activeHandler('right')" :class=" type === 'right'? 'active' : ''">
                        {{$t('home.music')}}
                    </div>
                </div>
                <!--轮播图-->
                <div class="Carouse" v-show="isShow">
                    <div class="mvBox_box clearFix">
                        <div class="mvBox_left">
                            <img @click="setActiveItem('left')" src="../../../assets/img/home/left_icon.png" alt="">
                        </div>
                        <el-carousel
                            class="mvBox flex_1"
                            :autoplay="false"
                            trigger="click"
                            type="card"
                            :initial-index="indexBox"
                            :height="mvImgHeight"
                            ref="carousel"
                            arrow="always"
                            indicator-position="none">
                            <el-carousel-item :name="index.toString()" v-for="(item,index) in mvList" :key="index">
                                <div class="whiteColor mvItem">
                                    <span class="title">{{item.title}}</span>
                                    <!--                                    <span>{{$t('videoModule.releaseDate')}}：{{item.releaseTime}}</span>-->
                                    <span>{{$t('videoModule.singer')}}：{{item.user}}</span>
                                </div>
                                <div class="banner_img_box positionRelative">
                                    <div class="maskBg"></div>
                                    <!--绑定id不可取消 需要监听图片的高度改变swiper的高度-->
                                    <div class="message_img"
                                         :style="{backgroundImage:'url('+rootUrl + item.imgUrl+')'}">
                                        <img :id="'mv_img_' + index" class="visibilityHidden"
                                             src="../../../assets/img/thumbnail_bg/mvThumbnail.png" alt="mv">
                                    </div>
                                    <img class="playIcon"
                                         @click="clickVideo(item)"
                                         src="../../../assets/img/common/play-icon.png"
                                         alt="play">
                                </div>
                            </el-carousel-item>
                        </el-carousel>
                        <div class="mvBox_right">
                            <img @click="setActiveItem('right')" src="../../../assets/img/home/right_icon.png" alt="">
                        </div>
                    </div>
                </div>
                <!--音乐列表-->
                <div class="Music" v-show="!isShow">
                    <div class="polish">
                        <!--左侧-->
                        <div class="polish-box">
                            <table class="box">
                                <tr>
                                    <th></th>
                                    <th>{{$t('home.musicTitle')}}</th>
                                    <th>{{$t('home.musicSinger')}}</th>
                                    <th>{{$t('home.musicTime')}}</th>
                                </tr>
                                <tr v-for="(item,index) in musicList"
                                    :key="index"
                                    @dblclick="musicTr(item,true,index + 1)">
                                    <td><img :src="rootUrl + item.thumbnail" alt=""></td>
                                    <td class="musicTitle">
                                        <div class="iconSpan">
                                            <el-tooltip effect="dark" placement="top-start"
                                                        :content="item.musicName">
                                                <span>{{item.musicName}}</span>
                                            </el-tooltip>
                                        </div>
                                        <template v-for="(val,index) in item.musicLikeStr">
                                            <a v-if="val.icon !== ''"
                                               class="iconsB"
                                               target="_blank"
                                               onclick="_czc.push(['_trackEvent', '音乐', '点击', '首页音乐']);"
                                               :href='val.v'>
                                                <img :src="val.icon" alt="">
                                            </a>
                                        </template>
                                    </td>
                                    <td>
                                        <el-tooltip effect="dark" placement="top-start" :content="item.singer">
                                            <span>{{item.singer}}</span>
                                        </el-tooltip>
                                    </td>
                                    <td>{{item.publishTime}}</td>
                                </tr>
                            </table>
                            <div class="box-bottom">
                                <span @click="getMusicPrev"
                                      class="bottom-previous pointer">{{$t('public.prevText')}}</span>
                                <span @click="getMusicNext" class="pointer">{{$t('public.nextText')}}</span>
                            </div>
                        </div>
                        <!--中间图片-->
                        <div class="polish-middle message_img" :style="{backgroundImage:'url('+musicObj.imgUrl+')'}">
                            <img class="visibilityHidden" src="../../../assets/img/thumbnail_bg/musicThumbnail.png"
                                 alt="">
                        </div>
                        <!--右侧-->
                        <div class="music-right" v-if="false">
                            <div class="copyBox" v-if="isOutLink">
                                <img class="widthAll" :src="musicObj.imgUrl">
                                <p>{{$t('public.explain')}}</p>
                            </div>
                            <div v-if="!isOutLink">
                                <!--头部-->
                                <div class="right-top">
                                    <span class="title">{{musicObj.musicName}}</span>
                                    <p>
                                        <span>{{$t('musicModule.sendTime')}}：</span>
                                        <span>{{musicObj.publishTime}}</span>
                                        <span class="name">{{$t('musicModule.singerName')}}：</span>
                                        <span>{{musicObj.singer}}</span>
                                    </p>
                                </div>
                                <!--歌词-->
                                <lyric :lyric="lyric" :lyric-index="lyricIndex"/>
                                <!--播放条-->
                                <div class="progress">
                                    <progressBar
                                        class="progressBar"
                                        :percent="percentMusic"
                                        :percent-progress="currentProgress"
                                        @percentChange="progressMusic"/>
                                    <span v-if="songTime">{{songTime}}</span>
                                    <span v-else>00:00</span>
                                </div>
                                <!--底部按钮-->
                                <div class="right-btn">
                                    <span class="btn">
                                        <i @click="prevMusic" class="first-btn pointer">
                                            <img src="../../../assets/img/music/privies.png" alt=""></i>
                                        <i class="content-btn pointer" @click="plays">
                                            <img v-if="isPlay" src="../../../assets/img/music/play.png" alt="">
                                            <img v-else src="../../../assets/img/home/play_icon.png" alt="">
                                        </i>
                                        <i @click="nextMusic" class="pointer">
                                            <img src="../../../assets/img/music/next.png" alt=""></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--详情-->
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
                <source :src="rootUrl + detailForm.url" :type="detailForm.type">
            </video>
        </el-dialog>
        <!--vip活动弹框-->
        <el-dialog
            class="activityDialog"
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
    // 音乐进度条
    import progressBar from "../../../components/progressBar";
    // 歌词模块
    import lyric from "../../../components/lyric";
    // 歌词解析方法
    import lyrics from "../../../assets/js/method";
    // 转时间戳
    import {dateFilterDayCN} from "../../../assets/js/filters";

    export default {
        name: "HOME",
        components: {progressBar, lyric, lyrics},
        data() {
            return {
                isOutLink: false, // 是否是外链
                isOutLinkType: '', // 外链平台类型
                isPlayVideo: true,
                rootUrl: this.$api.imgUrl(),
                type: "left", //
                isShow: true,
                lyric: [], //  歌词数组
                lyricIndex: 0, //  当前播放歌词下标
                currentTime: 0, //  当前播放时间
                audio: null, // audio 元素
                currentProgress: 0, //  当前缓冲进度
                isPlay: false, // 是否播放
                duration: 0, //  音乐时间长
                songTime: 0, //  歌曲总时长
                // 当前轮播图
                formItem: {
                    picture_img: '', // 轮播图图片
                    inWeb: null, // 站内外标识
                    linkAddress: '', // 地址
                    totalNum: 1, // 首页轮播总数显示
                },
                number: 1, //  个人专辑图片当前第几个
                //  背景图数据
                backgroundData: [],
                //  轮播图数据
                mvList: [],
                // mv 轮播高度
                mvImgHeight: "0px",
                // 详情
                dialogVisible: false, // 是否显示蒙版
                // 视频详情表单
                detailForm: {
                    img: "",
                    url: ""
                },
                // 音乐列表
                musicList: [],
                // 音乐对象
                musicObj: {
                    index: 0, // 当前播放的第几首音乐
                    imgUrl: "", // 中间区域封面路径
                    musicPath: "", // 音乐存放路径
                    musicName: "", // 音乐名称
                    publishTime: "", // 发行时间
                    hourLong: "", // 音乐时长
                    lyrics: "", // 歌词
                    singer: "" // 歌手
                },
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 6 // 显示条数
                },
                // mv轮播初始化显示下标
                indexBox: 0,
                // 活动表单
                activityItem: {
                    id: '', // vip活动id
                    thumbnail: '', // 缩略图
                    title: '', // 活动标题
                },
                dialogActivity: false, // 是否显示蒙版
                animationCountNum: 0, // 统计触发bus的次数
            };
        },
        methods: {
            // 点击上一首音乐
            prevMusic() {
                var _t = this;
                if (_t.musicObj.index <= 1) {
                    _t.$message.warning(_t.$t("musicModule.changePrevPage"));
                } else {
                    _t.musicObj.index -= 1;
                    _t.musicTr(
                        _t.musicList[_t.musicObj.index - 1],
                        false,
                        _t.musicObj.index
                    );
                }
            },
            // 点击下一首音乐
            nextMusic() {
                var _t = this;
                if (_t.musicObj.index >= _t.musicList.length) {
                    _t.$message.warning(_t.$t("musicModule.changeNextPage"));
                } else {
                    _t.musicTr(_t.musicList[_t.musicObj.index], false, _t.musicObj.index);
                    _t.musicObj.index += 1;
                }
            },
            // 点击左右切换按钮
            setActiveItem(flag) {
                var _t = this;
                if (flag === "left") {
                    // 向左
                    _t.indexBox -= 1;
                    _t.indexBox = _t.indexBox < 0 ? _t.mvList.length - 1 : _t.indexBox;
                } else {
                    // 向右
                    _t.indexBox += 1;
                    _t.indexBox = _t.indexBox >= _t.mvList.length ? 0 : _t.indexBox;
                }
                _t.$refs.carousel.setActiveItem(_t.indexBox);
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
                    // 取消画中画
                    _t.$refs.videoDialog['disablePictureInPicture'] = true;
                });
            },
            // 点击关闭蒙版
            resetVideo() {
                var _t = this;
                _t.dialogVisible = false;
                _t.detailForm.url = "";
                _t.detailForm.img = "";
                _t.$refs.videoDialog.pause();
            },
            // last 点击切换上一张背景图
            lastBtn() {
                var _t = this;
                if (_t.number === 0 || _t.number === 1) {
                    _t.number = _t.formItem.totalNum;
                } else {
                    _t.number--;
                }
            },
            // next 点击切换下一张背景图
            nextBtn() {
                var _t = this;
                if (_t.number === _t.formItem.totalNum) {
                    _t.number = 1;
                } else {
                    _t.number++;
                }
            },
            // 切换mv / music
            activeHandler(type) {
                var _t = this;
                _t.type = type;
                _t.isShow = type === "left" ? true : false;
            },
            // 获取歌词
            _getLyric() {
                var _t = this;
                _t.lyric = lyrics.parse(_t.musicObj.lyrics); // 解析歌词  music.lyric 代表歌词数据
            },
            // 获取滚动条进度
            schedule() {
                var _t = this;
                //  获取当前滚动条时间
                if (_t.audio !== null) {
                    if (_t.audio.duration) {
                        _t.songTime = lyrics.format(_t.audio.duration);
                    }
                    var cx = _t.audio.currentTime !== undefined ? _t.audio.currentTime : 0;
                    // 百分比
                    _t.currentProgress = cx;
                    // duration总时长
                    _t.duration = _t.audio.duration;
                    // 当前位置 控制高亮
                    _t.currentTime = cx;
                    // 控制如果播放结束显示播放按钮
                    if (_t.duration === cx && _t.isPlay === true) {
                        _t.isPlay = false;
                    }
                    let lyricIndex = 0;
                    for (let i = 0; i < _t.lyric.length; i++) {
                        if (cx >= _t.lyric[i].offset) {
                            lyricIndex = i;
                        }
                    }
                    _t.lyricIndex = lyricIndex;
                }
            },
            // 暂停/播放
            plays() {
                var _t = this;
                if (_t.audio !== null) {
                    _t.songTime = lyrics.format(_t.audio.duration);
                    if (_t.audio.paused) {
                        _t.audio.play();
                        _t.isPlay = true;
                    } else {
                        _t.audio.pause();
                        _t.isPlay = false;
                    }
                }
            },
            // 修改音乐进度
            progressMusic(percent) {
                var _t = this;
                _t.audio.currentTime = _t.audio.duration * percent;
            },
            // 监听img高度 动态改变banner轮播图高度
            onResize(flag) {
                var _t = this;
                // banner 轮播图
                var height = document.getElementById("banner_one");
                // 图片第一次加载完成
                if (flag && height !== null) {
                    height.onload = function () {
                        _t.swiperHeight = height.clientHeight + "px";
                    };
                } else if (height !== null) {
                    _t.swiperHeight = height.clientHeight + "px";
                }
                //
                var mv_img = document.getElementById("mv_img_0");
                // 图片第一次加载完成
                if (flag && mv_img !== null) {
                    mv_img.onload = function () {
                        _t.mvImgHeight = mv_img.clientHeight + 95 + "px";
                    };
                } else if (mv_img !== null) {
                    _t.mvImgHeight = mv_img.clientHeight + 95 + "px";
                }
            },
            // 查询轮播图接口
            getHomeAll() {
                var _t = this;
                _t.$api.get("home/all", {}, function (res) {
                    switch (res.status) {
                        case 200:
                            var resData = res.data !== null ? res.data : [];
                            var backgroundData = new Array(); // 渲染数组
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
                                for (var i = 0; i < 4; i++) {
                                    resData[i].value = i;
                                    resData[i].carouselMapStr = _t.$api.imgUrl() + resData[i].carouselMapStr;
                                    // 处理站内外表示
                                    if (resData[i].site !== undefined && resData[i].site !== null) {
                                        resData[i].inWeb = resData[i].site === 0 ? true : false;
                                    }
                                    backgroundData.push(resData[i]);
                                }
                            }
                            if (backgroundData.length !== 0) {
                                _t.backgroundData = backgroundData;
                                _t.formItem.totalNum = _t.backgroundData.length;
                                _t.$nextTick(function () {
                                    _t.formItem.picture_img = backgroundData[0].carouselMapStr;
                                    _t.formItem.inWeb = backgroundData[0].inWeb;
                                    _t.formItem.linkAddress = backgroundData[0].linkAddress;
                                });
                            } else {
                                _t.formItem.picture_img = '';
                                _t.formItem.totalNum = 1;
                            }
                            break;
                        default:
                            break;
                    }
                });
            },
            // 点击轮播图
            imgClick(img) {
                var _t = this;
                // 站内外标识不为 null
                if (_t.formItem.inWeb !== null && _t.formItem.inWeb === true) {
                    // 站内
                    _t.backgroundData.forEach((item) => {
                        if (item.carouselMapStr === img) {
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
                } else if (_t.formItem.inWeb !== null && _t.formItem.inWeb === false) {
                    // 站外
                    window.open(_t.formItem.linkAddress);
                }
            },
            // mv轮播
            getMv() {
                let _t = this;
                _t.$api.post("video/movieVideo", {
                    showHome: 1, // 首页music 1:首页 0:模块
                    page: 1, // 当前页
                    limit: 10, // 限制死,首页mv最多显示10条
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
                                        var minutes = parseInt(item.videoTime / 60);
                                        var seconds = parseInt(item.videoTime % 60);
                                        item.time = (minutes >= 10 ? minutes : "0" + minutes) + ":" + (seconds >= 10 ? seconds : "0" + seconds);
                                    }
                                    // 歌手
                                    item.user = item.singer !== undefined ? item.singer : "";
                                    // 图片
                                    item.imgUrl = item.thumbnail !== undefined ? item.thumbnail : "";
                                    // 资源路径
                                    item.url = item.videoPath !== undefined ? item.videoPath : "";
                                });
                                _t.mvList = resData;
                                //
                                _t.$nextTick(function () {
                                    _t.onResize(true);
                                });
                            }
                            break;
                        default:
                            break;
                    }
                });
            },
            // 获取首页music
            getMusic(val) {
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
                            _t.musicList = resData;
                            _t.options.total = res.data.total !== null ? res.data.total : 0;
                            // 首次加载
                            if (val === true && _t.musicList.length !== 0) {
                                _t.musicTr(_t.musicList[0], false, 1);
                            }
                            break;
                        default:
                            _t.musicList = [];
                            _t.options.total = 0;
                            break;
                    }
                });
            },
            // 获取music下一页数据
            getMusicNext() {
                var _t = this;
                if (_t.options.currentPage * _t.options.pageSize < _t.options.total) {
                    _t.options.currentPage += 1;
                    _t.getMusic();
                } else {
                    _t.$message.warning(_t.$t("public.noMoreData"));
                }
            },
            // 获取music上一页的数据
            getMusicPrev() {
                var _t = this;
                if (_t.options.currentPage !== 1) {
                    _t.options.currentPage -= 1;
                    _t.getMusic();
                } else {
                    _t.$message.warning(_t.$t("public.noMoreData"));
                }
            },
            // 点击表格行加载音乐
            musicTr(item, flag, index) {
                let _t = this;
                if (_t.audio !== null) {
                    _t.audio.pause();
                    _t.isPlay = false;
                }
                _t.musicObj.index = index; // 当前播放下标
                if (item.thumbnail !== null && item.thumbnail !== "") {
                    _t.musicObj.imgUrl = _t.$api.imgUrl() + item.thumbnail;
                }
                if (item.musicPath !== null && item.musicPath !== "") {
                    _t.musicObj.musicPath = _t.$api.imgUrl() + item.musicPath;
                }
                _t.$nextTick(function () {
                    _t.audio = document.createElement("audio");
                    _t.audio.src = _t.musicObj.musicPath;
                    _t.audio.addEventListener("timeupdate", _t.schedule);
                    if (item.copyrightProtection !== undefined && item.copyrightProtection === 1 && flag === true) {
                        _t.audio.play();
                        _t.isPlay = true;
                    }
                    if (item.copyrightProtection !== undefined && item.copyrightProtection === 0) {
                        // 外链
                        _t.isOutLinkType = item.outerChainIcon;
                        _t.isOutLink = true;
                        _t.audio.src = null;
                        _t.isPlay = false;
                    } else if (item.copyrightProtection !== undefined && item.copyrightProtection === 1) {
                        // 内链
                        _t.isOutLinkType = '';
                        _t.isOutLink = false;
                    }
                });
                _t.musicObj.musicName = item.musicName;
                _t.musicObj.publishTime = item.publishTime;
                _t.musicObj.hourLong = item.hourLong;
                _t.musicObj.lyrics = item.lyrics;
                _t.musicObj.singer = item.singer;
                _t._getLyric();
            },
            // 跳转至MUSIC
            clickMore() {
                let _t = this;
                _t.$jump.toJumpPage('MUSIC', 'M_MUSIC', {
                    WJE_HOME_INFO: _t.type === 'left' ? false : true
                });
            },
            // 查询动画数据
            getData() {
                var _t = this;
                _t.$api.get('vip/indexDrawing/11001100', {}, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null) {
                                // 动画
                                var imgUrl = res.data.ConfidentialNoticeContextStr !== undefined && res.data.ConfidentialNoticeContextStr !== null ? res.data.ConfidentialNoticeContextStr : ''; // 图片文件
                                // 音频
                                var songUrl = res.data.vipId !== undefined && res.data.vipId !== null ? res.data.vipId : ''; // 图片文件
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
                // 获取Music接口
                _t.getMusic(true);
                // 获取mv接口
                _t.getMv();
                // 查询动画数据
                _t.getData();
                let activity_show_home = document.body.getAttribute('activity_show_home');
                if (activity_show_home === 'true' || activity_show_home === null) {
                    // 获取vip活动信息
                    // _t.getActivity();
                }
            }
            _t.$bus.on('getAnimation_pc', (val) => {
                if (val) {
                    _t.animationCountNum++;
                    if (_t.animationCountNum === 1) {
                        _t.animationCountNum = 0;
                        // 查询动画数据
                        _t.getData();
                    }
                }
            });
        },
        mounted() {
            //  生成音乐标签
            let _t = this;
            // 第一次加载
            window.addEventListener("resize", function () {
                _t.onResize(false);
            }, false);

        },
        computed: {
            //  播放条时间
            percentMusic() {
                var _t = this;
                var cx = _t.currentTime;
                return cx && _t.duration ? cx / _t.duration : 0;
            }
        },
        watch: {
            //  监听背景图索引切换背景图
            number(val) {
                var _t = this;
                for (var i = 0; i < _t.backgroundData.length; i++) {
                    if (_t.backgroundData[i].value + 1 === val) {
                        _t.formItem.picture_img = _t.backgroundData[i].carouselMapStr !== undefined ? _t.backgroundData[i].carouselMapStr : '';
                        _t.formItem.inWeb = _t.backgroundData[i].inWeb !== undefined ? _t.backgroundData[i].inWeb : null;
                        _t.formItem.linkAddress = _t.backgroundData[i].linkAddress !== undefined ? _t.backgroundData[i].linkAddress : '';
                    }
                }
            }
        },
        destroyed() {
            let _t = this;
            if (_t.audio !== null) {
                _t.audio.pause();
                _t.audio = null;
            }
            _t.$bus.off('getAnimation_pc');
        }
    };
</script>


<style scoped>
    #logoGif {
        width: 100%;
        height: 100%;
    }

    .iconsB img {
        width: 18px !important;
        height: 18px !important;
        margin-left: 10px;
    }

    .mvBox_box {
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
    }

    .mvBox_left,
    .mvBox_right {
        width: 80px;
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .mvBox_left img,
    .mvBox_right img {
        width: 30px;
        position: absolute;
        top: 50%;
        left: 50%;
        cursor: pointer;
        transform: translate(-50%, -50%);
        z-index: 1000;
    }

    .banner_img_box .playIcon {
        position: absolute;
        width: 50px;
        height: 50px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: none;
        z-index: 10;
    }

    .banner_img_box .maskBg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 5;
        background-color: rgba(0, 0, 0, 0.2);
    }

    .mvBox .el-carousel__item.is-active .playIcon {
        display: inline-block;
    }

    .banner_img_box img {
        width: 100%;
        height: 100%;
    }

    .mvBox .mvItem {
        font-size: 16px;
        padding: 15px 0 15px 15px;
        background-color: rgba(0, 0, 0, 0.3);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .mvBox .mvItem .title {
        font-size: 20px;
        margin-right: 20px;
    }

    .mvBox .mvItem span {
        margin-right: 15px;
    }

    .mvBox .el-carousel__item {
        padding: 20px;
        background: url("../../../assets/img/common/mask_bg.png") repeat;
    }

    .home-bottom {
        position: relative;
        color: #fff;
        cursor: pointer;
    }

    .home-bottom .bottom-text {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        position: absolute;
        bottom: 50px;
        margin: 0 auto;
        left: 0;
        right: 0;
        width: 85%;
    }

    .bottom-left {
        width: 229px;
    }

    .left-data {
        border-bottom: 2px solid #b4b4b4;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }

    .bottom-left .thank {
        color: #b4b4b4;
        font-size: 20px;
    }

    .bottom-left .lt {
        font-size: 20px;
        font-weight: 500;
    }

    .bottom-left .lg {
        font-size: 45px;
        font-weight: 700;
    }

    .bottom-right {
        position: relative;
        font-size: 18px;
        height: 40px;
        line-height: 40px;
    }

    .bottom-right .des {
        height: 30px;
        line-height: 30px;
    }

    .bottom-right span.bottom_line {
        height: 5px;
        line-height: 5px;
        position: absolute;
        right: 0;
        bottom: 10px;
    }

    .content {
        background: #0b0b0b;
        padding: 110px 80px;
        overflow: hidden;
    }

    .play-top {
        color: #e4e4e4;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .top-left .big {
        font-size: 40px;
        height: 52px;
        line-height: 40px;
        display: block;
        margin-bottom: 5px;
        border-bottom: 4px solid #e4e4e4;
    }

    .top-left .small {
        font-size: 16px;
    }

    .top-right {
        cursor: pointer;
        font-size: 16px;
    }

    .play-middle {
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 175px;
    }

    .play-middle div.line {
        font-size: 24px;
        margin: 0 40px;
    }

    .play-middle .middle-left,
    .play-middle .middle-right {
        cursor: pointer;
        font-size: 24px;
        height: 40px;
        color: #fff;
        line-height: 40px;
        padding-bottom: 5px;
        box-sizing: border-box;
    }

    .play-middle .middle-left.active,
    .play-middle .middle-right.active {
        border-bottom: 3px #ccc solid;
    }

    .Carouse {
        margin-bottom: 100px;
    }

    .Music {
        background: url("../../../assets/img/common/mask_bg.png") repeat;
        color: #fff;
        padding: 20px;
        margin-bottom: 100px;
    }

    .polish {
        width: 100%;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
    }

    .polish-box {
        height: 480px;
        flex: 1;
        margin: 0 28px;
    }

    .polish-box .box {
        height: 428px;
        padding: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .polish-box .box .box-header {
        height: 38px;
        line-height: 38px;
        text-align: left;
    }

    .polish-box .box .center-header {
        height: 28px;
        line-height: 28px;
    }

    .polish-box .box tr {
        flex: 1;
        line-height: 60px;
        max-height: 60px;
        display: flex;
        flex-direction: row;
        text-align: left;
        border-bottom: 1px solid #393939;
    }

    .polish-box .box tr td {
        cursor: pointer;
    }

    .polish-box .box tr td img {
        width: 44px;
        height: 44px;
    }

    .polish-box .box th:nth-child(1),
    .polish-box .box td:nth-child(1) {
        width: 80px;
    }

    .polish-box .box th:nth-child(2),
    .polish-box .box td:nth-child(2) {
        flex: 1;
        width: 0;
        overflow: hidden !important;
    }

    .polish-box .box th:nth-child(4),
    .polish-box .box td:nth-child(4),
    .polish-box .box th:nth-child(3),
    .polish-box .box td:nth-child(3),
    .polish-box .box td:nth-child(2) div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .polish-box .box th:nth-child(3),
    .polish-box .box td:nth-child(3) {
        width: 25%;
    }

    .polish-box .box th:nth-child(4),
    .polish-box .box td:nth-child(4) {
        width: 20%;
    }

    .box-bottom {
        height: 52px;
        line-height: 52px;
        text-align: right;
    }

    .bottom-previous {
        margin-right: 16px;
    }

    .polish-middle {
        margin: 0 22px 0 0;
        box-sizing: border-box;
    }

    .music-right {
        width: 398px;
        height: 480px;
        margin-right: 22px;
        box-sizing: border-box;
        position: relative;
    }

    .copyBox {
        position: absolute;
        top: 50%;
        left: 50%;
        padding-left: 30px;
        transform: translate(-50%, -50%);
    }

    .copyBox p {
        margin-top: 20px;
        text-align: center;
        line-height: 25px;
    }

    .right-top {
        width: 100%;
        height: 80px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .right-top .title {
        font-size: 25px;
        font-weight: 700;
        color: #fff;
        margin-bottom: 10px;
    }

    .right-top .name {
        margin-left: 20px;
    }

    /*播放条*/
    .progress {
        margin-top: 10px;
    }

    .progressBar {
        display: inline-block;
        width: 340px;
    }

    .right-btn {
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }

    .right-btn .btn {
        width: 230px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .musicTitle {
        display: flex;
        flex-direction: row;
        padding-right: 10px;
    }

    .musicTitle .iconSpan {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    @media screen and (max-width: 1500px) {
        .polish-middle {
            display: none;
        }
    }
</style>
<style>
    .mvBox .el-carousel__mask {
        opacity: 0.1;
        background-color: initial !important;
    }

    .mvBox .el-carousel__arrow--left,
    .mvBox .el-carousel__arrow--right {
        display: none;
    }
</style>
