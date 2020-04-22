<template>
    <div class="contentExperience">
        <div class="personageIcon">
            <img class="img head" :src="formItem.imgUrl" alt="">
            <div class="dsc">
                <p class="name">{{$t('profile.teamWang')}}</p>
                <span class="marginRight20">{{$t('profile.birthday')}}: {{$t('profile.birthdayData')}}</span>
                <span class="marginRight20">{{$t('profile.aries')}}</span>
            </div>
        </div>
        <div class="flow">
            <div class="useIcon">
                <template v-for="(item,index) in linkArr">
                    <a class="displayInlineBlock" target="_blank" :href="item.sociallatform">
                        <img :src="item.headPortrait" alt=""/>
                    </a>
                </template>
            </div>
            <div class="userRight">
                <div class="entertainment">
                    <p class="title">{{$t('profile.early')}}</p>
                    <div id="earlyYearText" class="description marginTop15"></div>
                    <el-button class="showBtn marginTop15" @click="handleShowEarly" type="default"
                               v-if="isShowEarly">
                        {{isShowAllEarly === false ? $t('profile.open') :$t('profile.close')}}
                    </el-button>
                </div>
                <div class="entertainment">
                    <p class="title">{{$t('profile.deduce')}}</p>
                    <div id="deductText" class="description marginTop15"></div>
                    <el-button class="showBtn marginTop15" @click="handleShowDeduct" type="default"
                               v-if="isShowDeduct">
                        {{isShowAllDeduct === false ? $t('profile.open') :$t('profile.close')}}
                    </el-button>
                </div>
            </div>
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
                var _t = this;
                _t.$api.post('artist/getArtist', {
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'), // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            var bioArr = res.data !== null ? res.data : [];
                            if (bioArr.length !== 0) {
                                var earlyYearText = bioArr[0].earlyExperienceStr;
                                var deductText = bioArr[0].performingExperienceStr;
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
                                var resType = res.type1;
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
                _t.$parent.dealWith();
            }
        }
    }
</script>

<style scoped>
    .contentExperience {
        padding: 70px 145px;
        background: #0c0c0c;
    }

    .personageIcon {
        color: #fff;
        display: flex;
        align-items: flex-end;
    }

    .personageIcon .img {
        display: inline-block;
        margin-right: 35px;
    }

    .personageIcon .head {
        width: 144px;
    }

    .personageIcon .dsc {
        color: #b9b9b9;
    }

    .personageIcon .dsc .name {
        color: #fff;
        font-size: 30px;
        margin-bottom: 10px;
        height: 30px;
        line-height: 30px;
    }

    .personageIcon .dsc .eng {
        margin-bottom: 10px;
    }

    .contentExperience .flow {
        display: flex;
        justify-content: start;
    }

    .flow .useIcon {
        width: 20px;
        margin-left: 20px;
        margin-top: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .flow .useIcon a {
        margin-bottom: 70px;
    }

    .flow .useIcon a:last-child {
        margin-bottom: 20px;
    }

    .useIcon img {
        width: 20px;
        height: 20px;
        display: inline-block;
        cursor: pointer;
    }

    .userRight {
        border-left: 4px solid #252525;
        margin-left: 25px;
        padding-left: 35px;
    }

    .entertainment {
        padding-top: 55px;
        color: #fff;
        position: relative;
    }

    .entertainment .title {
        font-size: 30px;
    }

    .entertainment .title:before {
        content: '';
        background: url("../../../../assets/img/picture/dian.png") no-repeat;
        background-size: 100%;
        width: 16px;
        height: 17px;
        position: absolute;
        left: -44px;
        top: 67px;
    }

    .entertainment .title:after {
        content: '';
        width: 18px;
        height: 4px;
        background: #252525;
        position: absolute;
        left: -28px;
        top: 74px;
    }

    .entertainment .describe {
        margin-top: 14px;
        box-sizing: border-box;
        color: #8e8e8e;
    }

    .description {
        line-height: 24px;
        color: #8e8e8e;
    }

    .showBtn {
        padding: 8px 24px;
    }
</style>
