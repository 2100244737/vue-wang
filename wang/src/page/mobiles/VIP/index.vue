<template>
    <div class="mobileVipBox positionRelative">
        <div class="navBar_bg positionRelative">
            <div v-if="carouselMapImg !== ''" class="message_img bannerBox"
                 :style="{backgroundImage:'url('+ carouselMapImg +')'}">
                <img class="widthAll visibilityHidden" src="../../../assets/img/thumbnail_bg/bannerThumbnail.png"
                     alt="banner">
            </div>
            <div v-else class="message_img bannerBox defaultBannerBox">
                <img class="widthAll visibilityHidden" src="../../../assets/img/thumbnail_bg/bannerThumbnail.png"
                     alt="banner">
            </div>
            <el-tabs class="menuBarTabsBox isPosition" v-model="activeName" @tab-click="clickNav">
                <el-tab-pane :label="formItem.activity" name="M_VIP_PRIVATE"/>
                <el-tab-pane :label="formItem.vip" name="M_VIP_VIP"/>
                <el-tab-pane :label="formItem.photo" name="M_VIP_PHOTOS"/>
                <el-tab-pane :label="formItem.video" name="M_VIP_VIDEOS"/>
                <el-tab-pane :label="formItem.message" name="M_VIP_MESSAGE"/>
                <el-tab-pane :label="formItem.notice" name="M_CONFIDENTIAL"/>
            </el-tabs>
            <!--            <ul id="vip_banner" class="menuBar">-->
            <!--                &lt;!&ndash;接口读取&ndash;&gt;-->
            <!--                <li id="M_VIP_PRIVATE" @click="clickNav('M_VIP_PRIVATE')">{{formItem.activity}}</li>-->
            <!--                <li id="M_VIP_VIP" @click="clickNav('M_VIP_VIP')">{{formItem.vip}}</li>-->
            <!--                <li id="M_VIP_PHOTOS" @click="clickNav('M_VIP_PHOTOS')">{{formItem.photo}}</li>-->
            <!--                <li id="M_VIP_VIDEOS" @click="clickNav('M_VIP_VIDEOS')">{{formItem.video}}</li>-->
            <!--                <li id="M_VIP_MESSAGE" @click="clickNav('M_VIP_MESSAGE')">{{formItem.message}}</li>-->
            <!--                <li id="M_CONFIDENTIAL" @click="clickNav('M_CONFIDENTIAL')"> {{formItem.notice}}</li>-->
            <!--            </ul>-->
        </div>
        <div v-if="isVip === false" class="vip_detail_mask">
            <div class="tc vip_detail">
                <img class="vip_lock" src="../../../assets/img/vipPhoto/vip_lock.png" alt="">
                <div class="vip_detail_text">{{$t('vipLimitBox.showMore')}}</div>
                <div class="vip_detail_text">
                    <span class="vip_common">{{$t('vipLimitBox.announcement')}}</span>
                    <span>{{$t('vipLimitBox.showPhoto')}}</span>
                </div>
                <div class="vip_detail_btn">
                    <el-button @click="joinVip" size="small" type="default">{{$t('vipLimitBox.joinVip')}}</el-button>
                </div>
            </div>
        </div>
        <div v-if="isVip === true">
            <router-view/>
        </div>
        <!--vip活动弹框-->
        <el-dialog
            class="activityDialog activityMobileDialog"
            append-to-body
            :before-close="resetActivity"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="dialogActivity">
            <div class="activityBox cursorPointer">
                <div class="positionRelative">
                    <img @click="clickMV" v-if="activityItem.showImg" src="../../../assets/img/common/play-icon.png"
                         alt="">
                    <video
                        ref="videoDialog"
                        width="100%"
                        height="100%"
                        controlsList="nodownload"
                        :poster="activityItem.thumbnail" class="video">
                        <source :src="activityItem.mvPath">
                    </video>
                </div>
                <p class="title">{{activityItem.title}}</p>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "VIP",
        data() {
            return {
                activeName: '', //
                carouselMapImg: '', // banner图
                isVip: true, // 是否vip 默认否
                // 菜单集合
                formItem: {
                    activity: '', // 私密活动
                    vip: '', // vip活动
                    photo: '', // photo
                    video: '', // video
                    message: '', // 留言板
                    notice: '', // 保密公告
                },
                // 活动表单
                activityItem: {
                    id: '', // vip活动id
                    thumbnail: '', // 缩略图
                    title: '', // 活动标题
                    mvPath: '', // 视频
                    showImg: true, // 是否显示播放按钮
                },
                dialogActivity: false, // 是否显示蒙版
                language: localStorage.getItem("WJE_LANGUAGE") || (navigator.language === "zh-CN" ? "zh_CN" : "en"),
            }
        },
        methods: {
            // 点击加入VIP按钮
            joinVip() {
                let _t = this;
                let userId = _t.getCookie('WJE_USER_ID');
                let isLogin = _t.getCookie('WJE_IS_LOGIN');
                if (userId !== null && userId !== 'null' && isLogin !== null && isLogin !== 'null') {
                    _t.$jump.toJumpPage('VIP_JOIN', 'M_VIP_JOIN');
                } else {
                    _t.$message.warning(_t.$t('vipActivities.isNotLogin'));
                }
            },
            // 获取二级导航菜单
            getMenu() {
                let _t = this;
                _t.$api.post('menu/listMenuInfoByParentId', {
                    parentid: '7', // 7: VIP id
                    language: _t.language
                }, function (res) {
                    switch (res.status) {
                        case 200: // 获取详情
                            if (res.data !== undefined && res.data !== null) {
                                let menuList = res.data;
                                menuList.forEach((item) => {
                                    if (item.description !== undefined && item.description === 'person_activity') {
                                        // 私密活动
                                        _t.formItem.activity = item.menuName;
                                    } else if (item.description !== undefined && item.description === 'vip_activity') {
                                        // vip活动
                                        _t.formItem.vip = item.menuName;
                                    } else if (item.description !== undefined && item.description === 'photo') {
                                        // photo
                                        _t.formItem.photo = item.menuName;
                                    } else if (item.description !== undefined && item.description === 'video') {
                                        // video
                                        _t.formItem.video = item.menuName;
                                    } else if (item.description !== undefined && item.description === 'message') {
                                        // message
                                        _t.formItem.message = item.menuName;
                                    } else if (item.description !== undefined && item.description === 'notice') {
                                        // notice
                                        _t.formItem.notice = item.menuName;
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
                    site: 4, // 4:VIP (后台管理系统可查具体值得含义)
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
            // 点击二级导航
            clickNav(item) {
                let _t = this;
                // 判断点击路由是否当前路由
                _t.activeName = item.name;
                if (_t.$route.name !== item.name) {
                    // 删除之前的选中下划线
                    // let liList = document.querySelectorAll('#vip_banner li');
                    // if (liList !== null) {
                    //     for (let i = 0; i < liList.length; i++) {
                    //         // 置空class
                    //         liList[i].className = '';
                    //     }
                    //     document.getElementById(item.name).className = 'is-active';
                    // }
                    // 路由跳转
                    _t.$router.push({name: item.name});
                }
            },
            // 获取用户信息
            getUserInfo() {
                let _t = this;
                let userId = _t.getCookie('WJE_USER_ID');
                if (userId !== null && userId !== 'null') {
                    _t.$api.post('user/getById', {
                        id: userId
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 查询成功
                                if (res.data !== undefined && res.data !== null) {
                                    let resData = res.data;
                                    // 判断是否是vip
                                    if (resData.role !== undefined && resData.role !== null) {
                                        if ((resData.role === 1 || resData.role === 2) && resData.status !== undefined && resData.status !== null && resData.status === 1) {
                                            _t.isVip = true;
                                            let activity_show_vip = document.body.getAttribute('activity_show_vip');
                                            if (activity_show_vip === 'true' || activity_show_vip === null) {
                                                // 获取vip活动信息
                                                _t.getActivity();
                                            }
                                        } else {
                                            _t.isVip = false;
                                        }
                                    } else {
                                        _t.isVip = false;
                                    }
                                } else {
                                    _t.isVip = false;
                                }
                                break;
                            default: // 查询失败
                                _t.isVip = false;
                                break;
                        }
                    });
                } else {
                    _t.isVip = false;
                }
            },
            // 获取vip活动内容
            getActivity() {
                let _t = this;
                _t.$api.get('popup/getPopupMv', {}, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null && res.data.length !== 0) {
                                let resData = res.data[0];
                                _t.dialogActivity = true;
                                // 处理活动id
                                _t.activityItem.id = resData.id !== undefined && resData.id !== null ? resData.id : '';
                                // 处理标题
                                _t.activityItem.title = resData.albumName !== undefined && resData.albumName !== null ? resData.albumName : ''; // 活动标题
                                // 处理缩略图
                                if (resData.thumbnail !== undefined && resData.thumbnail !== null) {
                                    _t.activityItem.thumbnail = _t.$api.imgUrl() + resData.thumbnail;
                                }
                                // 处理视频
                                if (resData.mvPath !== undefined && resData.mvPath !== null) {
                                    _t.activityItem.mvPath = _t.$api.imgUrl() + resData.mvPath;
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
                _t.activityItem.id = '';
                _t.activityItem.mvPath = '';
                _t.activityItem.title = '';
                _t.activityItem.thumbnail = '';
                _t.activityItem.showImg = true;
                _t.$refs.videoDialog.pause();
                document.body.setAttribute('activity_show_vip', false)
            },
            // 播放视频
            clickMV() {
                let _t = this;
                if (_t.$refs.videoDialog.paused) {
                    _t.activityItem.showImg = false;
                    // 播放视频
                    _t.$refs.videoDialog.play();
                    // 取消画中画
                    _t.$refs.videoDialog['disablePictureInPicture'] = true;
                    // 设置播放之后显示控制面板
                    _t.$refs.videoDialog.controls = true;
                }
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'VIP_PRIVATE', 'M_VIP_PRIVATE');
            if (jump === false) {
                // 获取二级菜单
                _t.getMenu();
                // 获取banner
                _t.getBanner();
                // 获取用户信息
                _t.getUserInfo();
                _t.$nextTick(function () {
                    _t.activeName = _t.$route.name;
                    // let liList = document.querySelectorAll('#vip_banner li');
                    // let thisDom = document.getElementById(_t.$route.name);
                    // if (liList !== null && thisDom !== null) {
                    //     for (let i = 0; i < liList.length; i++) {
                    //         liList[i].className = '';
                    //     }
                    //     thisDom.className = 'is-active';
                    // }
                });
            }
            _t.$bus.on('loginVip', (val) => {
                if (val === true) {
                    _t.getUserInfo();
                }
            });
        }
    }
</script>

<style scoped>
    .vip_detail_mask {
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        background-color: rgba(0, 0, 0, 0.92);
    }

    .vip_detail {
        width: 90%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 101;
    }

    .vip_lock {
        width: 50px;
    }

    .vip_detail_text,
    .vip_detail_btn {
        margin-top: 10px;
    }
</style>
