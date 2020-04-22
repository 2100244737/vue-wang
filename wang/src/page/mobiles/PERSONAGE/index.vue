<template>
    <div class="personalBox">
        <div class="personContainer positionRelative">
            <!--背景图-->
            <div class="navBar_bg">
                <div v-if="carouselMapImg !== ''" class="message_img bannerBox"
                     :style="{backgroundImage:'url('+ carouselMapImg +')'}">
                    <img class="widthAll visibilityHidden" src="../../../assets/img/thumbnail_bg/bannerThumbnail.png"
                         alt="banner">
                </div>
                <div v-else class="message_img bannerBox defaultBannerBox">
                    <img class="widthAll visibilityHidden" src="../../../assets/img/thumbnail_bg/bannerThumbnail.png"
                         alt="banner">
                </div>
            </div>
            <div class="tc bgContent_center">
                <div class="imgBox positionRelative">
                    <img class="img widthAll"
                         :src="formItem.headImg !== '' ? formItem.headImg : require('../../../assets/img/common/head.png')"
                         alt="head">
                    <div class="photoBox">
                        <el-upload
                            class="photo_box"
                            :show-file-list="false"
                            name="file"
                            :data="userData"
                            :before-upload="beforeUpload"
                            :on-progress="uploadProcessImg"
                            :on-success="imgUploadSuccess"
                            :on-error="imgUploadError"
                            :accept="formItem.accept"
                            :action="this.$api.root() + 'user/updateImg'">
                            <img v-if="formItem.imgStatus === false" class="photo"
                                 src="../../../assets/img/picture/photo.png" alt="">
                            <el-progress
                                class="activity_progress"
                                v-if="formItem.imgStatus === true" type="circle"
                                :percentage="formItem.progressNum"/>
                        </el-upload>
                    </div>
                </div>
                <div class="userName">
                    <!--用户名-->
                    <span>{{formItem.userName}}</span>
                    <!--是否会员-->
                    <img v-if="formItem.isVip" class="isVip" src="../../../assets/img/common/vip.png" alt="">
                </div>
                <div class="vipBox">
                    <div class="vipText" v-if="formItem.isVip">
                        <span>ID：</span>
                        <span>{{formItem.vipId}}</span>
                        <span class="marginLR10">|</span>
                        <span>{{formItem.startTime}}</span>
                        <span>-</span>
                        <span>{{formItem.endTime}}</span>
                    </div>
                    <el-button v-else class="vipBtn" type="default" size="small" @click="joinVip">
                        {{$t('aboutSettings.joinVip')}}
                    </el-button>
                </div>
            </div>
        </div>
        <div class="bgContent">
            <el-tabs class="menuBarTabsBox isCenter" v-model="activeName" @tab-click="handleJump">
                <el-tab-pane :label="formMenu.status" name="M_MEMBER"/>
                <el-tab-pane :label="formMenu.personal" name="M_PERSONAGE_DATA"/>
                <el-tab-pane :label="formMenu.myOrder" name="M_MY_ORDER"/>
                <el-tab-pane :label="formMenu.feedback" name="M_FEEDBACK"/>
            </el-tabs>
            <!--            <ul id="PERSONAGE" class="secondaryNavigation">-->
            <!--                <li id="M_MEMBER" @click="handleJump('M_MEMBER')">{{formMenu.status}}</li>-->
            <!--                <li id="M_PERSONAGE_DATA" @click="handleJump('M_PERSONAGE_DATA')">{{formMenu.personal}}</li>-->
            <!--                &lt;!&ndash;-->
            <!--                    <li id="M_MY_ACTIVITY" @click="handleJump('M_MY_ACTIVITY')">{{formMenu.myActivity}}</li>-->
            <!--                &ndash;&gt;-->
            <!--                <li id="M_MY_ORDER" @click="handleJump('M_MY_ORDER')">{{formMenu.myOrder}}</li>-->
            <!--                &lt;!&ndash;<li id="M_SUBSCRIPTION" @click="handleJump('M_SUBSCRIPTION')">{{formMenu.reserve}}</li>&ndash;&gt;-->
            <!--                <li id="M_FEEDBACK" @click="handleJump('M_FEEDBACK')">{{formMenu.feedback}}</li>-->
            <!--            </ul>-->
            <router-view/>
        </div>
    </div>
</template>

<script>
    import {dateFilterDayCN} from "../../../assets/js/filters";

    export default {
        name: "PERSONAGE",
        data() {
            return {
                activeName: '', //
                // 查询表单
                formItem: {
                    userName: '', // 用户信息
                    headImg: '', // 头像
                    isVip: false, // 是否vip
                    vipId: '', // vipID
                    startTime: '',// 开始期限
                    endTime: '', // 结束期限
                    accept: 'image/*',
                    imgStatus: false, // 头像上传进度标识
                    progressNum: 0, // 头像上传进度
                },
                // banner图
                carouselMapImg: '',
                // 用户头像额外字段
                userData: {
                    id: this.getCookie('WJE_USER_ID')
                },
                // 菜单集合
                formMenu: {
                    status: '', // 会员状态
                    personal: '', // 个人资料
                    myActivity: '', // 我的活动
                    myOrder: '', // 我的交易
                    reserve: '', // 订阅
                    feedback: '', // 意见反馈
                },
                language: localStorage.getItem("WJE_LANGUAGE") || (navigator.language === "zh-CN" ? "zh_CN" : "en"),
            }
        },
        methods: {
            // 获取二级导航菜单
            getMenu() {
                let _t = this;
                _t.$api.post('menu/listMenuInfoByParentId', {
                    parentid: '13', // 13: 个人中心 id
                    language: _t.language
                }, function (res) {
                    switch (res.status) {
                        case 200: // 获取详情
                            if (res.data !== undefined && res.data !== null) {
                                let menuList = res.data;
                                menuList.forEach((item) => {
                                    if (item.description !== undefined && item.description === 'vip_status') {
                                        // status
                                        _t.formMenu.status = item.menuName;
                                    } else if (item.description !== undefined && item.description === 'vip_person') {
                                        // personal
                                        _t.formMenu.personal = item.menuName;
                                    } else if (item.description !== undefined && item.description === 'my_activity') {
                                        // my_activity
                                        _t.formMenu.myActivity = item.menuName;
                                    } else if (item.description !== undefined && item.description === 'my_order') {
                                        // myOrder
                                        _t.formMenu.myOrder = item.menuName;
                                    } else if (item.description !== undefined && item.description === 'reserve') {
                                        // reserve
                                        _t.formMenu.reserve = item.menuName;
                                    } else if (item.description !== undefined && item.description === 'feedback') {
                                        // feedback
                                        _t.formMenu.feedback = item.menuName;
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
                    site: 8, // 8:个人中心 (后台管理系统可查具体值得含义)
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
            // 加入vip
            joinVip() {
                let _t = this;
                _t.$jump.toJumpPage('VIP_JOIN', 'M_VIP_JOIN');
            },
            //  二级导航路由跳转加入样式
            handleJump(item) {
                let _t = this;
                //  判断是否是当前路由
                _t.activeName = item.name;
                if (_t.$route.name !== item.name) {
                    // let liList = document.querySelectorAll('#PERSONAGE li');
                    // if (liList !== null) {
                    //     liList.forEach(item => {
                    //         item.className = ''
                    //     });
                    //     document.getElementById(val).className = 'is-active';
                    // }
                    // 路由跳转
                    _t.$router.push({name: item.name});
                }
            },
            // 查询用户信息
            getUserInfo() {
                let _t = this;
                let userId = _t.getCookie('WJE_USER_ID');
                if (userId !== undefined && userId !== null && userId !== 'null') {
                    _t.$api.post('user/getById', {
                        id: userId
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 查询成功
                                // 获取用户信息 头像
                                if (res.data.headImg !== undefined && res.data.headImg !== null) {
                                    _t.formItem.headImg = res.data.headImg.indexOf('http') !== -1 ? res.data.headImg :_t.$api.imgUrl() + res.data.headImg;
                                } else {
                                    _t.formItem.headImg = '';
                                }
                                // 获取用户信息 用户昵称
                                if (res.data.userNickName !== undefined && res.data.userNickName !== null) {
                                    _t.formItem.userName = res.data.userNickName;
                                } else {
                                    _t.formItem.userName = '';
                                }
                                // 判断是否为vip
                                if (res.data.role !== undefined && res.data.role !== null) {
                                    _t.formItem.isVip = (res.data.role === 1 || res.data.role === 2) ? true : false;
                                }
                                if (_t.formItem.isVip) {
                                    _t.formItem.vipId = res.data.id !== undefined && res.data.id !== null ? res.data.id : '';
                                }
                                // 处理开始时间和结束时间
                                if (res.data.startTime !== undefined && res.data.startTime !== null) {
                                    _t.formItem.startTime = dateFilterDayCN(res.data.startTime);
                                }
                                if (res.data.endTime !== undefined && res.data.endTime !== null) {
                                    _t.formItem.endTime = dateFilterDayCN(res.data.endTime);
                                }
                                break;
                            default:
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }
            },
            // 头像上传前
            beforeUpload(file) {
                var _t = this;
                // 校验是否是jpg jpeg png图片
                var isImg = /^image\/(jpeg|png|jpg)$/.test(file.type);
                if (!isImg) {
                    _t.$message.error('只能上传jpeg、png、jpg格式的文件');
                }
                // 校验图片大小
                var isLt20M = file.size / 1024 / 1024 < 20;
                if (!isLt20M) {
                    _t.$message.error('图片大小不能大于20M');
                }
                return isImg && isLt20M;
            },
            // 头像上传时
            uploadProcessImg(event, file, fileList) {
                let _t = this;
                _t.formItem.imgStatus = true;
                _t.formItem.progressNum = parseInt(file.percentage);
            },
            // 图片上传成功
            imgUploadSuccess(val, file, fileList) {
                var _t = this;
                if (val.status === 200) {
                    _t.formItem.headImg = _t.$api.imgUrl() + val.url[0].filePath;
                    _t.setCookie('WJE_HEAD_IMG', _t.formItem.headImg);
                    _t.$bus.emit('getHeadImg', _t.formItem.headImg);
                    _t.formItem.imgUrlFlag = false;
                    _t.formItem.imgStatus = false;
                }
            },
            // 图片上传失败
            imgUploadError(err, file, fileList) {
                var _t = this;
                _t.formItem.imgUrlFlag = false;
                _t.formItem.imgStatus = false;
            },
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'PERSONAGE', 'M_PERSONAGE');
            if (jump === false) {
                _t.getMenu();
                _t.getUserInfo();
                _t.getBanner();
                // 处理选中导航
                _t.$nextTick(function () {
                    _t.handleJump({name: _t.$route.name});
                    // let liList = document.querySelectorAll('#PERSONAGE li');
                    // let thisDom = document.getElementById(_t.$route.name);
                    // if (liList !== null && thisDom !== null) {
                    //     liList.forEach((val) => {
                    //         // 置空class
                    //         val.className = '';
                    //     });
                    //     thisDom.className = 'is-active';
                    // }
                });
                // 总线传值
                _t.$bus.on('getPersonUserInfo', (val) => {
                    if (val) {
                        _t.getUserInfo();
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .bgContent_center {
        position: absolute;
        left: 0;
        right: 0;
        z-index: 10;
        bottom: -110px;
    }

    .imgBox {
        display: inline-block;
        border-radius: 50%;
        overflow: hidden;
        width: 130px;
        height: 130px;
        padding: 7px;
        background: url("../../../assets/img/common/mask_bg.png") repeat;
    }

    .imgBox img.img {
        width: 116px;
        height: 116px;
        border-radius: 50%;
        overflow: hidden;
        display: inline-block;
    }

    .imgBox .photoBox {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.2);
        z-index: 100;
    }

    .photo_box {
        width: 100%;
        height: 100%;
    }

    .imgBox .photo {
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 101;
        cursor: pointer;
    }

    .bgContent {
        position: relative;
        background: #0b0b0b;
        padding-top: 130px;
    }

    .secondaryNavigation {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .secondaryNavigation li {
        margin: 0 10px 10px;
    }

    .secondaryNavigation li.is-active {
        border-bottom: 2px solid #fff;
    }

    .userName {
        font-size: 20px;
        margin-bottom: 10px;
        text-align: center;
    }

    .isVip {
        width: 18px;
    }
</style>
<style>
    .imgBox .photoBox .el-progress__text {
        color: #fff;
        font-weight: bolder;
    }
</style>
