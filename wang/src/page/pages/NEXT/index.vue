<template>
    <div class="nextBox">
        <div class="navBar_bg">
            <div class="message_img bannerBox">
                <img v-if="carouselMapImg === ''" class="widthAll" src="../../../assets/img/header/defaultBanner.png"
                     alt="banner">
                <img v-else class="widthAll" :src="carouselMapImg" alt="banner">
            </div>
            <ul id="NEWS_LIST" class="detailsItem">
                <!-- 固定菜单
                <li id="NEWS" @click="handleJump('NEWS')">{{$t('whatNextNews.navBar')}}</li>
                <li id="TRAVEL" @click="handleJump('TRAVEL')">{{$t('whatNextTravel.navBar')}}</li>
                <li id="ACTIVITIES" @click="handleJump('ACTIVITIES')">{{$t('whatNextActivity.navBar')}}</li>
                <li id="VARIETY" @click="handleJump('VARIETY')">{{$t('whatNextVariety.navBar')}}</li>
                -->
                <!--接口菜单-->
                <li id="NEWS" @click="handleJump('NEWS')">{{formItem.news}}</li>
                <li id="TRAVEL" @click="handleJump('TRAVEL')">{{formItem.travel}}</li>
                <li id="ACTIVITIES" @click="handleJump('ACTIVITIES')">{{formItem.activity}}</li>
                <li id="VARIETY" @click="handleJump('VARIETY')">{{formItem.variety}}</li>
            </ul>
        </div>
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'NEXT',
        data() {
            return {
                // banner图
                carouselMapImg: '',
                // 菜单集合
                formItem: {
                    news: '', // 新闻
                    travel: '', // 行程
                    activity: '', // 活动
                    variety: '', // 综艺
                },
                language: localStorage.getItem("WJE_LANGUAGE") || (navigator.language === "zh-CN" ? "zh_CN" : "en"),
            }
        },
        methods: {
            // 查询banner图
            getBanner() {
                let _t = this;
                _t.$api.post('home/getBanner', {
                    site: 1, // 1:最新消息 (后台管理系统可查具体值得含义)
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
            // 二级导航路由跳转加入样式
            handleJump(val) {
                var _t = this;
                //  判断是否是当前路由
                if (_t.$route.name !== val) {
                    //  删除之前的下划线
                    let liList = document.querySelectorAll('#NEWS_LIST li');
                    if (liList !== null) {
                        for (let i = 0; i < liList.length; i++) {
                            liList[i].className = '';
                        }
                        document.getElementById(val).className = 'is-active';
                    }
                    // 路由跳转
                    _t.$router.push({name: val});
                }
            },
            // 获取二级导航菜单
            getMenu() {
                var _t = this;
                _t.$api.post('menu/listMenuInfoByParentId', {
                    parentid: '1', // 1: 最新消息 id
                    language: _t.language
                }, function (res) {
                    switch (res.status) {
                        case 200: // 获取详情
                            if (res.data !== undefined && res.data !== null) {
                                var menuList = res.data;
                                menuList.forEach((item) => {
                                    if (item.description !== undefined && item.description === 'news') {
                                        // 新闻
                                        _t.formItem.news = item.menuName;
                                    } else if (item.description !== undefined && item.description === 'travel') {
                                        // 行程
                                        _t.formItem.travel = item.menuName;
                                    } else if (item.description !== undefined && item.description === 'activity') {
                                        // 活动公告
                                        _t.formItem.activity = item.menuName;
                                    } else if (item.description !== undefined && item.description === 'variety') {
                                        // 综艺
                                        _t.formItem.variety = item.menuName;
                                    }
                                });
                            }
                            break;
                        default:
                            break;
                    }
                });
            },
            // 处理菜单
            dealWith() {
                let _t = this;
                let liList = document.querySelectorAll('#NEWS_LIST li');
                let name = _t.$route.name;
                let nameStr = '';
                if (name === 'NEWS_DETAILS') {
                    nameStr = 'NEWS';
                } else if (name === 'ACTIVITIES_DETAILS') {
                    nameStr = 'ACTIVITIES';
                } else {
                    nameStr = name;
                }
                let thisDom = document.getElementById(nameStr);
                if (liList !== null && thisDom !== null) {
                    for (let i = 0; i < liList.length; i++) {
                        liList[i].className = '';
                    }
                    thisDom.className = 'is-active';
                }
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'NEXT', 'M_NEXT');
            if (jump === false) {
                _t.getBanner();
                _t.getMenu();
                _t.$nextTick(function () {
                    // 处理二级菜单选中状态
                    _t.dealWith();
                });
            }
        }
    }
</script>
<style scoped>

</style>
