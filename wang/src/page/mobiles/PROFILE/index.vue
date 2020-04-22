<template>
    <div class="mobile_profileBox">
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
            <el-tabs class="menuBarTabsBox isCenter isPosition" v-model="activeName" @tab-click="handleJump">
                <el-tab-pane :label="formItem.personal" name="M_PERSONAL"/>
                <el-tab-pane :label="formItem.advocacy" name="M_ENDORSEMENT"/>
            </el-tabs>
<!--            <ul id="PERSONAL_ITEM" class="detailsItemMenuBar">-->
            <!--                <li id="M_PERSONAL" @click="handleJump('M_PERSONAL')">{{formItem.personal}}</li>-->
            <!--                <li id="M_ENDORSEMENT" @click="handleJump('M_ENDORSEMENT')">{{formItem.advocaty}}</li>-->
            <!--            </ul>-->
        </div>
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: "PROFILE",
        data() {
            return {
                activeName: '', //
                carouselMapImg: '', // banner图
                // 菜单集合
                formItem: {
                    personal: '', // 个人资料
                    advocacy: '', // 代言及合作
                },
                language: localStorage.getItem("WJE_LANGUAGE") || (navigator.language === "zh-CN" ? "zh_CN" : "en"),
            }
        },
        methods: {
            // 获取二级导航菜单
            getMenu() {
                let _t = this;
                _t.$api.post('menu/listMenuInfoByParentId', {
                    parentid: '11', // 11: 关于王嘉尔 id
                    language: _t.language
                }, function (res) {
                    switch (res.status) {
                        case 200: // 获取详情
                            if (res.data !== undefined && res.data !== null) {
                                let menuList = res.data;
                                menuList.forEach((item) => {
                                    if (item.description !== undefined && item.description === 'personal') {
                                        // personal
                                        _t.formItem.personal = item.menuName;
                                    } else if (item.description !== undefined && item.description === 'advocaty') {
                                        // advocacy
                                        _t.formItem.advocacy = item.menuName;
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
                    site: 6, // 6:关于王嘉尔 (后台管理系统可查具体值得含义)
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
            handleJump(item) {
                let _t = this;
                //  判断是否是当前路由
                _t.activeName = item.name;
                if (_t.$route.name !== item.name) {
                    //  删除之前的下划线
                    // let liList = document.querySelectorAll('#PERSONAL_ITEM li');
                    // if (liList !== null) {
                    //     for (let i = 0; i < liList.length; i++) {
                    //         liList[i].className = '';
                    //     }
                    //     document.getElementById(val).className = 'is-active';
                    // }
                    // 路由跳转
                    _t.$router.push({name: item.name});
                }
            }
        },
        created() {
            let _t = this;
            // 获取二级导航菜单
            _t.getMenu();
            _t.getBanner();
            _t.$nextTick(function () {
                // 处理二级菜单选中状态
                // let liList = document.querySelectorAll('#PERSONAL_ITEM li');
                let name = _t.$route.name;
                let nameStr = '';
                if (name === 'M_END_DETAILS') {
                    nameStr = 'M_ENDORSEMENT';
                } else {
                    nameStr = name;
                }
                _t.handleJump({name: nameStr});
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
</script>

<style scoped>

</style>
