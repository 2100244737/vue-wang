<template>
    <div>
        <!--音乐-->
        <div class="background">
            <div class="message_img bannerBox">
                <img v-if="carouselMapImg === ''" class="widthAll" src="../../../assets/img/header/defaultBanner.png"
                     alt="banner">
                <img v-else class="widthAll" :src="carouselMapImg" alt="banner">
            </div>
            <div class="musicOrVideos">
                <!-- 不走接口
                <span :class="{active:styleActive}" @click="handleMusic">{{$t('musicModule.navBar')}}</span>
                <span :class="{active:!styleActive}" @click="handleVideos">{{$t('videoModule.navBar')}}</span>
                -->
                <!--调用接口-->
                <span :class="{active:styleActive}" @click="handleMusic">{{formItem.music}}</span>
                <span :class="{active:!styleActive}" @click="handleVideos">{{formItem.mv}}</span>
            </div>
        </div>
        <div class="content">
            <p class="title">
                <span v-if="styleActive">{{$t('musicModule.title')}}</span>
                <span v-else>{{$t('videoModule.title')}}</span>
            </p>
            <!--music音乐-->
            <div v-show="styleActive" class="musicDetails">
                <div class="musicBox">
                    <div class="musicTable flex_1">
                        <div class="topBox widthAll">
                            <div class="titleList clearFix">
                                <p class="title fl" style="font-size:20px">{{$t('musicModule.personal')}}</p>
                                <div class="nextOrPrev fr">
                                    <span @click="getPersonalMusicPrev">{{$t('public.prevText')}}</span>
                                    <span @click="getPersonalMusicNext">{{$t('public.nextText')}}</span>
                                </div>
                            </div>
                            <div class="tableMusicTop">
                                <table class="tableMusic widthAll">
                                    <thead>
                                    <tr class="tableTitle">
                                        <th></th>
                                        <th>{{$t('musicModule.musicName')}}</th>
                                        <th>{{$t('musicModule.singer')}}</th>
                                        <th>{{$t('musicModule.time')}}</th>
                                    </tr>
                                    </thead>
                                    <tbody class="musicList">
                                    <tr v-for="(item,index) in PersonalMusic" :key="index"
                                        @dblclick="musicTr(item,true,index + 1,'personal')">
                                        <td class="musicDsc"><img class="img" :src="item.thumbnail" alt=""/></td>
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
                                                   onclick="_czc.push(['_trackEvent', '音乐', '点击', '个人音乐']);"
                                                   :href='val.v'>
                                                    <img :src="val.icon" alt="">
                                                </a>
                                            </template>
                                        </td>
                                        <td class="text">
                                            <el-tooltip effect="dark" placement="top-start" :content="item.singer">
                                                <span>{{item.singer}}</span>
                                            </el-tooltip>
                                        </td>
                                        <td class="time">{{item.publishTime}}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="bottomBox widthAll">
                            <div class="titleList clearFix" style="margin-top:20px">
                                <p class="title fl" style="font-size:20px">{{$t('musicModule.cooperative')}}</p>
                                <div class="nextOrPrev tr fr">
                                    <span @click="getCooperativeMusicPrev">{{$t('public.prevText')}}</span>
                                    <span @click="getCooperativeMusicNext">{{$t('public.nextText')}}</span>
                                </div>
                            </div>
                            <div class="tableMusicBottom">
                                <table class="tableMusic widthAll">
                                    <tbody>
                                    <tr class="musicItem" v-for="(item,index) in CooperativeMusic" :key="index"
                                        @dblclick="musicTr(item,true,index + 1,'cooperate')">
                                        <td class="musicDsc"><img class="img" :src="item.thumbnail" alt=""/></td>
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
                                                   onclick="_czc.push(['_trackEvent', '音乐', '点击', '合作音乐']);"
                                                   :href='val.v'>
                                                    <img :src="val.icon" alt="">
                                                </a>
                                            </template>
                                        </td>
                                        <td class="text">
                                            <el-tooltip effect="dark" placement="top-start" :content="item.singer">
                                                <span>{{item.singer}}</span>
                                            </el-tooltip>
                                        </td>
                                        <td class="time">{{item.publishTime}}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="musicLyric" v-if="false">
                        <div class="copyBox" v-if="isOutLink">
                            <img :src="musicObj.imgUrl">
                            <p>{{$t('public.explain')}}</p>
                        </div>
                        <div v-if="!isOutLink">
                            <div class="title">
                                <p class="titleName">{{musicObj.musicName}}</p>
                                <p class="titleTime">{{$t('musicModule.sendTime')}}：{{musicObj.publishTime}}
                                    {{$t('musicModule.singerName')}}：{{musicObj.singer}}</p>
                            </div>
                            <!--歌词-->
                            <lyric class="lyric" :lyric="lyric" :lyric-index="lyricIndex"/>
                            <!--进度条-->
                            <div class="progress">
                                <progressBar
                                    class="progressBar"
                                    :percent="percentMusic"
                                    :percent-progress="currentProgress"
                                    @percentChange="progressMusic"/>
                                <span v-if="songTime">{{songTime}}</span>
                                <span v-else>00:00</span>
                            </div>
                            <div class="btnBox">
                                <img @click="prevMusic"
                                     class="first-btn cursorPointer"
                                     :title="$t('public.prevMusic')"
                                     src="../../../assets/img/music/privies.png"
                                     alt="">
                                <span class="content-btn cursorPointer" @click="plays">
                                <img v-if="isPlay" :title="$t('public.pause')"
                                     src="../../../assets/img/music/play.png" alt="">
                                <img v-else :title="$t('public.play')" src="../../../assets/img/home/play_icon.png"
                                     alt="">
                            </span>
                                <img @click="nextMusic"
                                     class="next_btn cursorPointer"
                                     :title="$t('public.nextMusic')"
                                     src="../../../assets/img/music/next.png"
                                     alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--videos视频-->
            <div v-show="!styleActive">
                <div class="videosDetails">
                    <!--蒙版-->
                    <div class="maskBg">
                        <div class="PersonalVideos">
                            <div class="PersonaTitle clearFix">
                                <div class="fl titleLeft">
                                    <span>{{$t('videoModule.personal')}}</span>
                                </div>
                                <div class="fr nextOrPerv">
                                    <span @click="getPersonalMvPrev">{{$t('public.prevText')}}</span>
                                    <span @click="getPersonalMvNext">{{$t('public.nextText')}}</span>
                                </div>
                            </div>
                            <div class="videosList">
                                <div class="mask">
                                    <div class="videosItems" v-for="(item,index) in videoListTop"
                                         :key="index"
                                         @click="clickVideo(item)">
                                        <!--撑起图片背景-->
                                        <div class="videoImg positionRelative message_img"
                                             :style="{backgroundImage:'url('+item.thumbnail+')'}">
                                            <img class="widthAll visibilityHidden"
                                                 src="../../../assets/img/thumbnail_bg/mvThumbnail.png" alt="bg">
                                            <div class="maskInBg"></div>
                                            <img class="playIcon" src="../../../assets/img/common/play-icon.png" alt="">
                                        </div>
                                        <div class="videosMessage">
                                            <p class="videoTitle">
                                                <span>{{item.videoName}}</span>
                                                <span>{{item.releaseTime}}</span>
                                            </p>
                                            <p>{{item.singer}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="maskBg marginTop20">
                        <div class="PersonalVideos">
                            <div class="PersonaTitle clearFix">
                                <div class="fl titleLeft">
                                    <span>{{$t('videoModule.cooperative')}}</span>
                                </div>
                                <div class="fr nextOrPerv">
                                    <span @click="getCooperativeMvPrev">{{$t('public.prevText')}}</span>
                                    <span @click="getCooperativeMvNext">{{$t('public.nextText')}}</span>
                                </div>
                            </div>
                            <div class="videosList">
                                <div class="mask">
                                    <div class="videosItems" v-for="(item,index) in videoListBottom" :key="index"
                                         @click="clickVideo(item)">
                                        <div class="videoImg positionRelative message_img"
                                             :style="{backgroundImage:'url('+item.thumbnail+')'}">
                                            <img class="widthAll visibilityHidden"
                                                 src="../../../assets/img/thumbnail_bg/mvThumbnail.png" alt="bg">
                                            <div class="maskInBg"></div>
                                            <img class="playIcon" src="../../../assets/img/common/play-icon.png" alt="">
                                        </div>
                                        <div class="videosMessage">
                                            <p class="videoTitle">
                                                <span>{{item.videoName}}</span>
                                                <span>{{item.releaseTime}}</span>
                                            </p>
                                            <p>{{item.singer}}</p>
                                        </div>
                                    </div>
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
                <source :src="detailForm.url" :type="detailForm.type">
            </video>
        </el-dialog>
    </div>
</template>

<script>
    // 音乐进度条
    import progressBar from '../../../components/progressBar';
    // 歌词模块
    import lyric from './lyric';
    // 歌词解析方法
    import lyrics from '../../../assets/js/method';
    import {dateFilterDayCN} from "../../../assets/js/filters";

    export default {
        name: 'MUSIC',
        components: {lyric, progressBar},
        data() {
            return {
                likImg: false,//鼠标滑过外链
                isOutLink: false, // 是否是外链
                isOutLinkType: '', // 外链平台类型
                // 显示music还是mv
                styleActive: true,
                lyric: [], // 歌词
                lyricIndex: 0, // 当前播放歌词下标
                currentTime: 0, // 当前播放时间
                audio: null, // audio 元素
                isPlay: false, // 是否播放
                currentProgress: 0, // 当前缓冲进度
                duration: 0, // 音乐时间长
                songTime: 0, // music总时长
                // 个人视频
                videoListTop: [],
                // 合作视频
                videoListBottom: [],
                // 个人音乐
                PersonalMusic: [],
                // 合作音乐
                CooperativeMusic: [],
                // 详情
                dialogVisible: false, // 是否显示蒙版
                // 视频详情表单
                detailForm: {
                    img: '',
                    url: '',
                    type: ''
                },
                // 音乐对象
                musicObj: {
                    flag: '', // 音乐播放对象判断标识, 是个人还是合作
                    index: 0, // 当前播放音乐下标
                    imgUrl: '', // 中间区域封面路径
                    musicPath: '', // 音乐存放路径
                    musicName: '', // 音乐名称
                    publishTime: '', // 发行时间
                    hourLong: '', // 音乐时长
                    lyrics: '', // 歌词
                    singer: '', // 歌手
                },
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
                carouselMapImg: '', // banner图
                // 菜单集合
                formItem: {
                    music: '', // 音乐
                    mv: '', // MV
                },
                language: localStorage.getItem("WJE_LANGUAGE") || (navigator.language === "zh-CN" ? "zh_CN" : "en"),
            }
        },
        methods: {
            // 获取二级导航菜单
            getMenu() {
                var _t = this;
                _t.$api.post('menu/listMenuInfoByParentId', {
                    parentid: '3', // 1: 音乐 id
                    language: _t.language
                }, function (res) {
                    switch (res.status) {
                        case 200: // 获取详情
                            if (res.data !== undefined && res.data !== null) {
                                var menuList = res.data;
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
            // 点击上一首音乐
            prevMusic() {
                var _t = this;
                if (_t.musicObj.flag === 'personal') {
                    if (_t.musicObj.index <= 1) {
                        _t.$message.warning(_t.$t('musicModule.changePrevPage'));
                    } else {
                        _t.musicObj.index -= 1;
                        _t.musicTr(_t.PersonalMusic[_t.musicObj.index - 1], false, _t.musicObj.index, 'personal');
                    }
                } else if (_t.musicObj.flag === 'cooperate') {
                    if (_t.musicObj.index <= 1) {
                        _t.$message.warning(_t.$t('musicModule.changePrevPage'));
                    } else {
                        _t.musicObj.index -= 1;
                        _t.musicTr(_t.CooperativeMusic[_t.musicObj.index - 1], false, _t.musicObj.index, 'cooperate');
                    }
                }
            },
            // 点击下一首音乐
            nextMusic() {
                var _t = this;
                if (_t.musicObj.flag === 'personal') {
                    if (_t.musicObj.index >= _t.PersonalMusic.length) {
                        _t.$message.warning(_t.$t('musicModule.changeNextPage'));
                    } else {
                        _t.musicTr(_t.PersonalMusic[_t.musicObj.index], false, _t.musicObj.index, 'personal');
                        _t.musicObj.index += 1;
                    }
                } else if (_t.musicObj.flag === 'cooperate') {
                    if (_t.musicObj.index >= _t.CooperativeMusic.length) {
                        _t.$message.warning(_t.$t('musicModule.changeNextPage'));
                    } else {
                        _t.musicTr(_t.CooperativeMusic[_t.musicObj.index], false, _t.musicObj.index, 'cooperate');
                        _t.musicObj.index += 1;
                    }
                }
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
            // Music
            handleMusic() {
                var _t = this;
                _t.styleActive = true;
            },
            // Videos
            handleVideos() {
                var _t = this;
                _t.styleActive = false;
            },
            // 获取歌词
            _getLyric() {
                var _t = this;
                _t.lyric = lyrics.parse(_t.musicObj.lyrics) // 解析歌词  music.lyric 代表歌词数据
            },
            //获取 滚动条进度
            schedule() {
                var _t = this;
                //  获取当前滚动条时间
                if (_t.audio !== null) {
                    _t.songTime = lyrics.format(_t.audio.duration);
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
                            lyricIndex = i
                        }
                    }
                    _t.lyricIndex = lyricIndex;
                }
            },
            // 播放
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
                    _t.$refs.videoDialog.play();
                    // 取消画中画
                    _t.$refs.videoDialog['disablePictureInPicture'] = true;
                })
            },
            //点击关闭蒙版
            resetVideo() {
                var _t = this;
                _t.dialogVisible = false;
                _t.detailForm.url = '';
                _t.detailForm.img = '';
                _t.$refs.videoDialog.pause()
            },
            // 获取music数据 个人数据
            getDataPersonal(flag) {
                let _t = this;
                _t.$api.post('music/musicList', {
                    showHome: 0, // 首页music 1:首页 0:模块
                    page: _t.personalMusicOptions.currentPage, // 当前页
                    limit: _t.personalMusicOptions.pageSize, // 每页显示条数
                    grouping: 0, // 0: 自己的音乐 1: 和别人合作的音乐
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'), // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            var resData = res.data.content === null ? [] : res.data.content;
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
                            // 首次加载
                            // if (flag === true) {
                            //     // 判断默认加载的音乐 先取个人音乐,若没有取合作音乐,还没有再为空
                            //     if (_t.PersonalMusic.length !== 0) {
                            //         _t.musicTr(_t.PersonalMusic[0], false, 1, 'personal');
                            //     } else {
                            //         if (_t.CooperativeMusic.length !== 0) {
                            //             _t.musicTr(_t.CooperativeMusic[0], false, 1, 'cooperate');
                            //         }
                            //     }
                            // }
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
                var _t = this;
                if (_t.personalMusicOptions.currentPage * _t.personalMusicOptions.pageSize < _t.personalMusicOptions.total) {
                    _t.personalMusicOptions.currentPage += 1;
                    _t.getDataPersonal();
                } else {
                    _t.$message.warning(_t.$t('public.noMoreData'));
                }
            },
            // 获取music个人数据上一页
            getPersonalMusicPrev() {
                var _t = this;
                if (_t.personalMusicOptions.currentPage !== 1) {
                    _t.personalMusicOptions.currentPage -= 1;
                    _t.getDataPersonal();
                } else {
                    _t.$message.warning(_t.$t('public.noMoreData'));
                }
            },
            // 获取music数据 合作数据
            getMusicCooperative(flag) {
                let _t = this;
                _t.$api.post('music/musicList', {
                    showHome: 0, // 首页music 1:首页 0:模块
                    page: _t.cooperateMusicOptions.currentPage, // 当前页
                    limit: _t.cooperateMusicOptions.pageSize, // 每页显示条数
                    grouping: 1, // 0: 自己的音乐 1: 和别人合作的音乐
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'), // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            var resData = res.data.content === null ? [] : res.data.content;
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
                            // 首次加载
                            // if (flag === true) {
                            //     // 判断默认加载的音乐 先取个人音乐,若没有取合作音乐,还没有再为空
                            //     if (_t.PersonalMusic.length !== 0) {
                            //         _t.musicTr(_t.PersonalMusic[0], false, 1, 'personal');
                            //     } else {
                            //         if (_t.CooperativeMusic.length !== 0) {
                            //             _t.musicTr(_t.CooperativeMusic[0], false, 1, 'cooperate');
                            //         }
                            //     }
                            // }
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
                var _t = this;
                if (_t.cooperateMusicOptions.currentPage * _t.cooperateMusicOptions.pageSize < _t.cooperateMusicOptions.total) {
                    _t.cooperateMusicOptions.currentPage += 1;
                    _t.getMusicCooperative();
                } else {
                    _t.$message.warning(_t.$t('public.noMoreData'));
                }
            },
            // 获取music个人数据上一页
            getCooperativeMusicPrev() {
                var _t = this;
                if (_t.cooperateMusicOptions.currentPage !== 1) {
                    _t.cooperateMusicOptions.currentPage -= 1;
                    _t.getMusicCooperative();
                } else {
                    _t.$message.warning(_t.$t('public.noMoreData'));
                }
            },
            // 点击表格行加载音乐
            musicTr(item, flag, index, tip) {
                let _t = this;
                if (_t.audio !== null) {
                    _t.audio.pause();
                    _t.isPlay = false;
                }
                _t.musicObj.flag = tip; // 判断标识赋值
                _t.musicObj.index = index; // 当前播放下标
                if (item.thumbnail !== null && item.thumbnail !== '') {
                    _t.musicObj.imgUrl = item.thumbnail;
                }
                if (item.musicPath !== null && item.musicPath !== '') {
                    _t.musicObj.musicPath = _t.$api.imgUrl() + item.musicPath;
                }
                _t.$nextTick(function () {
                    _t.audio = document.createElement("audio");
                    _t.audio.src = _t.musicObj.musicPath;
                    _t.audio.addEventListener('timeupdate', _t.schedule);
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
                            var resData = res.data.content === null ? [] : res.data.content;
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
            // 获取自己发布视频的下一页
            getPersonalMvNext() {
                var _t = this;
                if (_t.mvPersonalOptions.currentPage * _t.mvPersonalOptions.pageSize < _t.mvPersonalOptions.total) {
                    _t.mvPersonalOptions.currentPage += 1;
                    _t.getMvPersonal();
                } else {
                    _t.$message.warning(_t.$t('public.noMoreData'));
                }
            },
            // 获取自己发布视频的上一页
            getPersonalMvPrev() {
                var _t = this;
                if (_t.mvPersonalOptions.currentPage !== 1) {
                    _t.mvPersonalOptions.currentPage -= 1;
                    _t.getMvPersonal();
                } else {
                    _t.$message.warning(_t.$t('public.noMoreData'));
                }
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
                            var resData = res.data.content === null ? [] : res.data.content;
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
                var _t = this;
                if (_t.mvCooperativeOptions.currentPage * _t.mvCooperativeOptions.pageSize < _t.mvCooperativeOptions.total) {
                    _t.mvCooperativeOptions.currentPage += 1;
                    _t.getMvCooperative();
                } else {
                    _t.$message.warning(_t.$t('public.noMoreData'));
                }
            },
            // 获取合作发布视频的上一页
            getCooperativeMvPrev() {
                var _t = this;
                if (_t.mvCooperativeOptions.currentPage !== 1) {
                    _t.mvCooperativeOptions.currentPage -= 1;
                    _t.getMvCooperative();
                } else {
                    _t.$message.warning(_t.$t('public.noMoreData'));
                }
            },
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'MUSIC', 'M_MUSIC');
            if (jump === false) {
                // 判断从首页进来的是标识
                let styleActive = _t.$route.params.WJE_HOME_INFO !== undefined ? _t.$route.params.WJE_HOME_INFO : null;
                if (styleActive !== undefined && styleActive !== null) {
                    if (styleActive === true || styleActive === false) {
                        _t.styleActive = styleActive;
                    }
                }
                // 获取二级菜单
                _t.getMenu();
                // 获取banner
                _t.getBanner();
                // 个人音乐
                _t.getDataPersonal(true);
                // 合作音乐
                _t.getMusicCooperative(true);
                // 个人mv
                _t.getMvPersonal();
                // 合作mv
                _t.getMvCooperative();
            }
        },
        computed: {
            // 播放条时间
            percentMusic() {
                var _t = this;
                var cx = _t.currentTime;
                return cx && _t.duration ? cx / _t.duration : 0
            }
        },
        destroyed() {
            var _t = this;
            if (_t.audio !== null) {
                _t.audio.pause();
                _t.audio = null;
            }
        }
    }
</script>

<style scoped>
    .iconsB {
        display: inline-block;
        cursor: pointer;
        margin-left: 5px;
    }

    .active {
        border-bottom: 3px solid #c8c8c8;
        padding-bottom: 5px
    }

    .background {
        position: relative;
        font-size: 20px;
        overflow: hidden;
        text-align: center;
    }

    .musicOrVideos {
        display: inline-block;
        position: absolute;
        bottom: 30px;
        left: 0;
        right: 0;
        font-size: 18px;
        color: #b6b6b6;
        height: 50px;
        line-height: 30px;
    }

    .musicOrVideos span {
        cursor: pointer;
    }

    .musicOrVideos span:first-child {
        margin-right: 30px;
    }

    .content {
        background: #0b0b0b;
        padding: 50px 130px;
    }

    .content p.title {
        height: 40px;
        line-height: 40px;
        font-size: 30px;
        color: #fff;
    }

    .content p.title span {
        height: 50px;
        line-height: 50px;
        display: inline-block;
        border-bottom: 5px solid #fff;
        padding-bottom: 10px;
    }

    .musicDetails {
        margin-top: 40px;
        box-sizing: border-box;
        background: url("../../../assets/img/common/mask_bg.png") repeat;
        padding: 20px;
        margin-bottom: 45px;
    }

    .musicBox {
        background-color: rgba(0, 0, 0, .3);
        box-sizing: border-box;
        padding: 40px 30px;
        color: #fff;
        display: flex;
        justify-content: space-between;
    }

    .titleList {
        height: 60px;
        line-height: 40px;
    }

    .nextOrPrev span {
        cursor: pointer;
        margin-left: 20px;
        font-size: 14px;
    }

    .tableMusic tr {
        height: 58px;
        line-height: 58px;
        border-bottom: 1px solid #373c38;
        box-sizing: border-box;
        display: flex;
    }

    .tableMusic tr th,
    .tableMusic tr td {
        text-align: left;
    }

    .tableMusic th:nth-child(1),
    .tableMusic td:nth-child(1) {
        width: 70px;
    }

    .tableMusic th:nth-child(2),
    .tableMusic td:nth-child(2) {
        flex: 2;
        width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .tableMusic th:nth-child(3),
    .tableMusic td:nth-child(3) {
        padding-right: 10px;
    }

    .tableMusic th:nth-child(3),
    .tableMusic td:nth-child(3),
    .tableMusic th:nth-child(4),
    .tableMusic td:nth-child(4) {
        flex: 1;
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .musicLyric {
        width: 500px;
        margin: 0 30px;
        background-position: left;
        background-size: cover;
        background-repeat: no-repeat;
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

    .musicLyric div.title {
        width: 100%;
        text-align: center;
        margin-bottom: 40px;
    }

    .musicLyric div.title .titleName {
        font-size: 20px;
        height: 20px;
        line-height: 20px;
        margin-bottom: 12px;
    }

    .musicLyric div.title .titleTime {
        font-size: 14px;
    }

    .musicLyric .progress {
        margin-top: 50px;
        padding-left: 5px;
        display: flex;
    }

    .musicLyric .progressBar {
        flex: 1;
        display: inline-block;
    }

    .musicLyric .progress span {
        width: 50px;
        text-align: center;
    }

    .btnBox {
        margin-top: 10px;
        text-align: center;
    }

    .content-btn {
        margin: 0 50px;
    }

    .videosDetails {
        margin-top: 40px;
        box-sizing: border-box;
        background: url("../../../assets/img/common/mask_bg.png") repeat;
        padding: 20px;
        margin-bottom: -20px;
    }

    .videosDetails .maskBg {
        background-color: rgba(0, 0, 0, 0.3);
    }

    .videosDetails .PersonalVideos {
        padding: 0 10px;
    }

    .PersonaTitle {
        line-height: 50px;
        font-size: 20px;
        margin-bottom: 10px;
        padding: 20px 10px 0;
        color: #fff;
    }

    .nextOrPerv span {
        font-size: 14px;
        margin-left: 10px;
        cursor: pointer;
    }

    .videosItems {
        width: 33.33%;
        display: inline-block;
        padding: 0 10px;
        box-sizing: border-box;
        cursor: pointer;
    }

    .videosItems img.playIcon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
    }

    .videosItems div.maskInBg {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 1;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .videosMessage {
        color: #fff;
        margin: 15px 0;
    }

    .videoTitle {
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        line-height: 20px;
    }

    .tableMusicTop {
        height: 290px;
    }

    .tableMusicBottom {
        height: 232px;
    }

    .musicDsc img {
        width: 44px;
        height: 44px;
    }

    .titleLeft img {
        width: 20px;
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
</style>
