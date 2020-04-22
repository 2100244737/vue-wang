<template>
    <div class="mobile_personalBox">
        <!--头像及信息-->
        <div class="mobile_personalTitle">
            <img class="personal_Head" :src="formItem.imgUrl" alt="">
            <div class="personal_dsc">
                <p class="userName">{{$t('profile.teamWang')}}</p>
                <span class="marginRight20">{{$t('profile.birthday')}}: {{$t('profile.birthdayData')}}</span>
                <span class="marginRight20">{{$t('profile.aries')}}</span>
            </div>
        </div>
        <!--经历-->
        <div class="mobile_flow_box">
            <div class="mobile_flow">
                <div class="useIcon">
                    <div class="entertainment">
                        <p class="title">{{$t('profile.early')}}</p>
                        <div id="earlyYearText" class="description marginTop15"></div>
                        <el-button size="small" class="marginTop15" @click="handleShowEarly" type="default"
                                   v-if="isShowEarly">
                            {{isShowAllEarly === false ? $t('profile.open') :$t('profile.close')}}
                        </el-button>
                    </div>
                    <div class="entertainment">
                        <p class="title">{{$t('profile.deduce')}}</p>
                        <div id="deductText" class="description marginTop15"></div>
                        <el-button size="small" class="marginTop15" @click="handleShowDeduct" type="default"
                                   v-if="isShowDeduct">
                            {{isShowAllDeduct === false ? $t('profile.open') :$t('profile.close')}}
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
        <!--社交网站-->
        <div class="tc socialBox">
            <template v-for="(item,index) in linkArr">
                <a class="displayInlineBlock" target="_blank" :href="item.sociallatform">
                    <img :src="item.headPortrait" alt=""/>
                </a>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PERSONAL",
        data() {
            return {
                // 早年经历描述
                earlyYearText: '',
                // 演绎经历描述
                deductText: '',
                isShowAllEarly: false, // 是否展开收起，默认收起 早年经历
                isShowAllDeduct: false, // 是否展开收起，默认收起 演绎经历
                isShowEarly: true, // 早年经历显示隐藏
                isShowDeduct: true, // 演绎经历显示隐藏
                linkArr: [], // 社交网站集合
                formItem: {
                    imgUrl: '', // 艺人头像
                }
            }
        },
        methods: {
            // 点击早年经历按钮
            handleShowEarly() {
                var _t = this;
                _t.isShowAllEarly = !_t.isShowAllEarly;
                document.getElementById('earlyYearText').innerHTML = _t.returnContent(_t.earlyYearText, _t.isShowAllEarly);
            },
            // 点击演绎经历按钮
            handleShowDeduct() {
                var _t = this;
                _t.isShowAllDeduct = !_t.isShowAllDeduct;
                document.getElementById('deductText').innerHTML = _t.returnContent(_t.deductText, _t.isShowAllDeduct);
            },
            // 查询艺人信息-接口
            getData() {
                let _t = this;
                _t.$api.post('artist/getArtist', {
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'), // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            let bioArr = res.data !== null ? res.data : [];
                            if (bioArr.length !== 0) {
                                let earlyYearText = bioArr[0].earlyExperienceStr;
                                let deductText = bioArr[0].performingExperienceStr;
                                if (earlyYearText.length < 260) {
                                    _t.isShowEarly = false;
                                } else if (deductText < 260) {
                                    _t.isShowDeduct = false;
                                }
                                _t.earlyYearText = earlyYearText;
                                _t.deductText = deductText;
                                document.getElementById('earlyYearText').innerHTML = _t.returnContent(earlyYearText, _t.isShowAllEarly);
                                document.getElementById('deductText').innerHTML = _t.returnContent(deductText, _t.isShowAllDeduct);
                            }
                            break;
                        default:
                            _t.$message.error(_t.$t('public.queryError'));
                            break;
                    }
                })
            },
            // 获取社交网站集合数据
            getSocialData() {
                let _t = this;
                _t.$api.post('artistSocial/getArtistSocial', {
                    judgeMark: '0,1', // 0: 头像 1: 个人社交  2: 团队社交
                }, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
                            // 处理艺人头像
                            if (res.type0 !== undefined && res.type0 !== null && res.type0.length !== 0) {
                                // 为 0 代表头像
                                _t.formItem.imgUrl = res.type0[0].headPortrait !== undefined ? _t.$api.imgUrl() + res.type0[0].headPortrait : '';
                            }

                            // 处理个人社交网站
                            if (res.type1 !== undefined && res.type1 !== null && res.type1.length !== 0) {
                                // 为 1 代表个人社交网站
                                let resType = res.type1;
                                resType.forEach((item) => {
                                    if (item.headPortrait !== undefined && item.headPortrait !== null) {
                                        item.headPortrait = _t.$api.imgUrl() + item.headPortrait;
                                    } else {
                                        item.headPortrait = '';
                                    }
                                });
                                _t.linkArr = resType;
                            }
                            break;
                        default: // 查询失败
                            _t.$message.error('查询详情失败!');
                            break;
                    }
                });
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'PERSONAL', 'M_PERSONAL');
            if (jump === false) {
                _t.getData();
                _t.getSocialData();
            }
        }
    }
</script>

<style scoped>
    .mobile_personalTitle {
        margin: 10% 5% 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-end;
    }

    .personal_Head {
        width: 100px;
    }

    .personal_dsc {
        margin-left: 5%;
        color: #b9b9b9;
    }

    .userName {
        font-size: 24px;
        color: #fff;
    }

    .mobile_flow_box {
        margin: 0 5%;
        padding-left: 45px;
    }

    .mobile_flow {
        border-left: 4px solid #252525;
        padding-left: 30px;
    }

    .useIcon {
        padding: 30px 0 0;
    }

    .useIcon .entertainment {
        margin-bottom: 30px;
    }

    .useIcon .entertainment:last-child {
        margin-bottom: 0;
    }

    .useIcon .entertainment .title {
        font-size: 18px;
        position: relative;
    }

    .useIcon .entertainment .title:before {
        content: '';
        background: url("../../../../assets/img/picture/dian.png") no-repeat;
        background-size: 100%;
        width: 16px;
        height: 17px;
        position: absolute;
        left: -40px;
        top: 4px;
    }

    .useIcon .entertainment .title:after {
        content: '';
        width: 18px;
        height: 4px;
        background: #252525;
        position: absolute;
        left: -28px;
        top: 10px;
    }

    .description {
        color: #b9b9b9;
    }

    .socialBox {
        margin: 30px 0 20px;
    }

    .socialBox > a {
        margin: 0 20px;
    }

    .socialBox img {
        width: 20px;
        height: 20px;
    }
</style>
