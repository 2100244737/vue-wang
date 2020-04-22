<template>
    <div class="aboutBox">
        <!--banner-->
        <div class="navBar_bg">
            <div class="message_img bannerBox">
                <img v-if="carouselMapImg === ''" class="widthAll" src="../../../assets/img/header/defaultBanner.png"
                     alt="banner">
                <img v-else class="widthAll" :src="carouselMapImg" alt="banner">
            </div>
        </div>
        <!--关于-->
        <div class="contentMessage">
            <div class="iconLeft">
                <template v-for="(item,index) in linkArr">
                    <a class="displayInlineBlock" target="_blank" :href="item.sociallatform">
                        <img :src="item.headPortrait" alt=""/>
                    </a>
                </template>
            </div>
            <div class="aboutName">
                <span class="title"></span>
                <div class="titleBox">
                    <div class="name">
                        <img src="../../../assets/img/header/logo.png" alt="">
                    </div>
                </div>
            </div>
            <div class="flex_1 whiteColor">
                <p class="font20 marginBottom20">{{$t('aboutTeamWang.navBar')}}</p>
                <div id="contentText" class="marginBottom20 aboutContent"></div>
                <img @click="showContent" class="pointer" src="../../../assets/img/about/more.png" alt/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ABOUT",
        data() {
            return {
                contentData: '', // 显示的描述
                isShowAll: false, // 是否展开收起，默认收起
                carouselMapImg: '', // banner 图
                linkArr: [], // 社交网站集合
            };
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
                var _t = this;
                _t.isShowAll = !_t.isShowAll;
                document.getElementById("contentText").innerHTML = _t.returnContent(_t.contentData, _t.isShowAll);
            },
            // 查询接口信息
            getData() {
                var _t = this;
                _t.$api.post("artist/getArtist", {
                    language: localStorage.getItem("WJE_LANGUAGE") || (navigator.language === "zh-CN" ? "zh_CN" : "en") // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            var bioArr = res.data !== undefined && res.data !== null ? res.data : [];
                            if (bioArr.length !== 0) {
                                var autobioGraphy = bioArr[0].autobioGraphyStr !== undefined ? bioArr[0].autobioGraphyStr : '';
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
                                var resType = res.type2;
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
    };
</script>

<style scoped>
    .contentMessage {
        padding: 100px 145px 70px;
        background: #0c0c0c;
        display: flex;
    }

    .aboutName {
        height: 300px;
        color: #fff;
        padding: 100px 100px 0 120px;
        display: flex;
    }

    .aboutName .title {
        margin-top: 20px;
        display: inline-block;
        width: 60px;
        height: 4px;
        background-color: #929192;
    }

    .aboutName .titleBox {
        flex: 1;
        margin-left: 20px;
    }

    .aboutName .titleBox .name > img {
        height: 40px;
    }

    .aboutName .titleBox .des {
        font-size: 18px;
        height: 20px;
        line-height: 20px;
        letter-spacing: 1.5px;
    }

    .iconLeft {
        width: 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .iconLeft > a {
        margin-bottom: 70px;
    }

    .iconLeft > a:last-child {
        margin-bottom: 0;
    }

    .iconLeft img {
        width: 20px;
        height: 20px;
    }

    .aboutContent {
        line-height: 24px;
    }
</style>
