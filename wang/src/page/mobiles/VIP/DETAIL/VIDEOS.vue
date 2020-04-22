<template>
    <!--vip videos-->
    <div class="mobileContentBox">
        <!--内容区域-->
        <div class="mobileHeadLine">
            <div class="mobileTitleText">{{$t('vipVideos.title')}}</div>
            <div class="mobileHeadLine_right">
                <img class="cursorPointer" @click="handlePrev" src="../../../../assets/img/common/data_02.png"
                     alt="prev">
                <span class="number">{{formItem.year}}</span>
                <img class="cursorPointer" @click="handleNext" src="../../../../assets/img/common/data_01.png"
                     alt="next">
            </div>
        </div>
        <div v-if="videoList.length === 0" class="tableNotHasData">
            <img class="notData" src="../../../../assets/img/common/notData.png" alt="notData">
            <div class="notDataText">{{$t('public.notData')}}</div>
        </div>
        <div v-else class="videosList">
            <div class="mask">
                <el-row :gutter="20">
                    <el-col :xs="24" :sm="12" :md="8" v-for="(item,index) in videoList" :key="index">
                        <div class="videosItem_img positionRelative" @click="clickVideo(item)">
                            <div class="message_img" :style="{backgroundImage:'url('+item.thumbnail+')'}">
                                <img class="widthAll visibilityHidden"
                                     src="../../../../assets/img/thumbnail_bg/mvThumbnail.png" alt="">
                            </div>
                            <div class="maskBg"></div>
                            <img class="imgPlay" src="../../../../assets/img/common/play-icon.png" alt="">
                        </div>
                        <div class="theme">
                            <span class="title">{{item.videoName}}</span>
                            <span class="time">{{item.releaseTime}}</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="pageBox">
            <pages
                :total='options.total'
                :currentPage='options.currentPage'
                :page-size="options.pageSize"
                @handleSizeChangeSub="handleSizeChangeSub"
                @handleCurrentChangeSub="handleCurrentChange"/>
        </div>
        <!--播放视频-->
        <el-dialog
            class="videoDialog_mobile"
            :visible.sync="dialogVisible"
            append-to-body
            width="95%"
            :before-close="resetVideo"
            :close-on-press-escape="false"
            :close-on-click-modal="false">
            <video id="videoDialog"
                   ref="videoDialog"
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
    import {dateFilterDayCN} from "../../../../assets/js/filters";

    export default {
        name: "VIDEOS",
        data() {
            return {
                // 查询表单
                formItem: {
                    year: new Date().getFullYear(), // 年
                },
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 6, // 显示条数
                },
                // 视频资源列表
                videoList: [],
                dialogVisible: false, // 是否显示蒙版
                // 详情表单
                detailForm: {
                    img: '',
                    url: '',
                    type: ''
                }
            }
        },
        methods: {
            //  年月++
            handleNext() {
                let _t = this;
                _t.formItem.year += 1;
                _t.getVipVideos()
            },
            //  年月--
            handlePrev() {
                let _t = this;
                _t.formItem.year -= 1;
                _t.getVipVideos()
            },
            // 改变当前页码
            handleCurrentChange(val) {
                let _t = this;
                _t.options.currentPage = val;
                _t.getVipVideos();
            },
            // 改变每页显示条数
            handleSizeChangeSub(val) {
                let _t = this;
                _t.options.pageSize = val;
                _t.getVipVideos();
            },
            // 点击播放
            clickVideo(item) {
                let _t = this;
                _t.detailForm.url = item.videoPath;
                _t.detailForm.type = item.type;
                _t.detailForm.img = item.thumbnail;
                _t.dialogVisible = true;
                _t.$nextTick(function () {
                    // 重新加载src指定的资源
                    _t.$refs.videoDialog.load();
                    // 自动播放
                    _t.$refs.videoDialog.play();
                });
            },
            // 点击关闭蒙版
            resetVideo() {
                let _t = this;
                _t.dialogVisible = false;
                _t.detailForm.url = '';
                _t.detailForm.type = '';
                _t.detailForm.img = '';
                _t.$refs.videoDialog.pause();
            },
            //查询Vip的video
            getVipVideos() {
                let _t = this;
                _t.$api.post('video/movieVideo', {
                    page: _t.options.currentPage,
                    limit: _t.options.pageSize,
                    year: _t.formItem.year,
                    showHome: 2,
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'), // 语言
                }, (res) => {
                    switch (res.status) {
                        case 200:
                            if (res.data) {
                                let videoArr = res.data;
                                _t.options.total = videoArr.total;
                                _t.photoDetail = videoArr.content === null ? [] : videoArr.content;
                                _t.videoList = videoArr.content;
                                _t.videoList.forEach(item => {
                                    item.releaseTime = dateFilterDayCN(item.releaseTime);
                                    item.thumbnail = _t.$api.imgUrl() + item.thumbnail;
                                    item.videoPath = _t.$api.imgUrl() + item.videoPath;
                                });
                            }
                            break;
                        default:
                            break;
                    }
                })
            },
            // 获取用户信息
            getUserInfo() {
                let _t = this;
                let userId = _t.getCookie('WJE_USER_ID');
                if (userId !== undefined && userId !== null && userId !== 'null') {
                    _t.$api.post('user/getById', {
                        id: userId
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 查询成功
                                if (res.data !== undefined && res.data !== null) {
                                    let resData = res.data;
                                    // 判断是否是vip
                                    if (resData.role !== undefined && resData.role !== null && (resData.role === 1 || resData.role === 2)) {
                                        _t.getVipVideos();
                                    }
                                }
                                break;
                            default: // 查询失败
                                break;
                        }
                    });
                }
            },
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'VIP_VIDEOS', 'M_VIP_VIDEOS');
            if (jump === false) {
                _t.getUserInfo();
                // 调用父级的用户信息判断是否vip到期
                _t.$parent.getUserInfo();
            }
        }
    }
</script>

<style scoped>
    .videosList {
        padding: 10px;
        margin-bottom: 5%;
        background: url('../../../../assets/img/common/mask_bg.png') repeat;
    }

    .mask {
        padding: 10px 10px 0 10px;
        background: rgba(0, 0, 0, 0.3);
    }

    .maskBg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .imgPlay {
        width: 40px;
        height: 40px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
    }

    .theme {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        line-height: 30px;
        font-size: 12px;
    }
</style>
