<template>
    <div class="mobile_aboutBox">
        <!--banner-->
        <div class="navBar_bg">
            <div v-if="carouselMapImg !== ''" class="message_img bannerBox" :style="{backgroundImage:'url('+ carouselMapImg +')'}">
                <img class="widthAll visibilityHidden" src="../../../assets/img/thumbnail_bg/bannerThumbnail.png"
                     alt="banner">
            </div>
            <div v-else class="message_img bannerBox defaultBannerBox">
                <img class="widthAll visibilityHidden" src="../../../assets/img/thumbnail_bg/bannerThumbnail.png"
                     alt="banner">
            </div>
        </div>
        <div class="contentMessage">
            <!--logo-->
            <div class="aboutName tc">
                <img src="../../../assets/img/header/logo.png" alt="">
            </div>
            <!--内容区域-->
            <div class="marginLR15">
                <p class="aboutTitle">{{$t('aboutTeamWang.navBar')}}</p>
                <div id="contentText" class="aboutContent"></div>
                <img @click="showContent" class="pointer" src="../../../assets/img/about/more.png" alt/>
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
    </div>
</template>

<script>
    export default {
        name: "ABOUT",
        data() {
            return {
                carouselMapImg: '', // banner 图
                isShowAll: false, // 是否展开收起，默认收起
                contentData: '', // 显示的描述
                linkArr: [], // 社交网站集合
            }
        },
        methods: {
            // 查询banner图
            getBanner() {
                let _t = this;
                _t.$api.post("home/getBanner", {
                    site: 7, // 7:关于我们 (后台管理系统可查具体值得含义)
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
                });
            },
            // 是否展开收起
            showContent() {
                let _t = this;
                _t.isShowAll = !_t.isShowAll;
                document.getElementById("contentText").innerHTML = _t.returnContent(_t.contentData, _t.isShowAll);
            },
            // 查询接口信息
            getData() {
                let _t = this;
                _t.$api.post("artist/getArtist", {
                    language: localStorage.getItem("WJE_LANGUAGE") || (navigator.language === "zh-CN" ? "zh_CN" : "en") // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            let bioArr = res.data !== undefined && res.data !== null ? res.data : [];
                            if (bioArr.length !== 0) {
                                let autobioGraphy = bioArr[0].autobioGraphyStr !== undefined ? bioArr[0].autobioGraphyStr : '';
                                _t.contentData = autobioGraphy;
                                document.getElementById("contentText").innerHTML = _t.returnContent(autobioGraphy, _t.isShowAll);
                            }
                            break;
                        default:
                            _t.$message.error(_t.$t("public.queryError"));
                            break;
                    }
                });
            },
            // 获取社交网站集合数据
            getSocialData() {
                let _t = this;
                _t.$api.post('artistSocial/getArtistSocial', {
                    judgeMark: '2', // 0: 头像 1: 个人社交  2: 团队社交
                }, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
                            // 处理团队社交网站
                            if (res.type2 !== undefined && res.type2 !== null && res.type2.length !== 0) {
                                // 为 2 代表工作室社交网站
                                let resType = res.type2;
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
            // 判断当前路由是否需要跳转
            let jump = _t.$jump.isToJump(_t.$route.name, 'ABOUT', 'M_ABOUT');
            if (jump === false) {
                _t.getBanner();
                _t.getData();
                _t.getSocialData();
            }
        }
    }
</script>

<style scoped>
    .contentMessage {
        margin-top: 20px;
        color: #ddd;
    }

    .aboutName > img {
        margin-bottom: 30px;
        height: 20px;
    }

    .aboutTitle {
        font-size: 14px;
        margin-bottom: 10px;
    }

    .aboutContent {
        font-size: 12px;
        margin-bottom: 10px;
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
