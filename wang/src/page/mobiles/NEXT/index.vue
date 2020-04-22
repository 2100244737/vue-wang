<template>
    <div class="mobile_nextBox">
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
            <el-tabs class="menuBarTabsBox isCenter isPosition" v-model="activeName" @tab-click="handleJump">
                <el-tab-pane :label="formItem.news" name="M_NEWS"/>
                <el-tab-pane :label="formItem.travel" name="M_TRAVEL"/>
                <el-tab-pane :label="formItem.activity" name="M_ACTIVITIES"/>
                <el-tab-pane :label="formItem.variety" name="M_VARIETY"/>
            </el-tabs>
            <!--            <ul id="NEWS_LIST" class="menuBar">-->
            <!--                <li id="M_NEWS" @click="handleJump('M_NEWS')">{{formItem.news}}</li>-->
            <!--                <li id="M_TRAVEL" @click="handleJump('M_TRAVEL')">{{formItem.travel}}</li>-->
            <!--                <li id="M_ACTIVITIES" @click="handleJump('M_ACTIVITIES')">{{formItem.activity}}</li>-->
            <!--                <li id="M_VARIETY" @click="handleJump('M_VARIETY')">{{formItem.variety}}</li>-->
            <!--            </ul>-->
        </div>
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: "NEXT",
        data() {
            return {
                activeName: '', //
                carouselMapImg: '', // banner图
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
                let _t = this;
                _t.activeName = val.name;
                //  判断是否是当前路由
                if (_t.$route.name !== val.name) {
                    //  删除之前的下划线
                    // let liList = document.querySelectorAll('#NEWS_LIST li');
                    // if (liList !== null) {
                    //     for (let i = 0; i < liList.length; i++) {
                    //         liList[i].className = '';
                    //     }
                    //     document.getElementById(val).className = 'is-active';
                    // }
                    // 路由跳转
                    _t.$router.push({name: val.name});
                }
            },
            // 获取二级导航菜单
            getMenu() {
                let _t = this;
                _t.$api.post('menu/listMenuInfoByParentId', {
                    parentid: '1', // 1: 最新消息 id
                    language: _t.language
                }, function (res) {
                    switch (res.status) {
                        case 200: // 获取详情
                            if (res.data !== undefined && res.data !== null) {
                                let menuList = res.data;
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
                    // let liList = document.querySelectorAll('#NEWS_LIST li');
                    let name = _t.$route.name;
                    let nameStr = '';
                    if (name === 'M_NEWS_DETAILS') {
                        nameStr = 'M_NEWS';
                    } else if (name === 'M_ACTIVITIES_DETAILS') {
                        nameStr = 'M_ACTIVITIES';
                    } else {
                        nameStr = name;
                    }
                    _t.handleJump({name: nameStr});
                    // _t.activeName = nameStr;
                    // let thisDom = document.getElementById(nameStr);
                    // if (liList !== null && thisDom !== null) {
                    //     for (let i = 0; i < liList.length; i++) {
                    //         liList[i].className = '';
                    //     }
                    //     thisDom.className = 'is-active';
                    // }
                });
            }
        }
    }
</script>

<style scoped>

</style>
