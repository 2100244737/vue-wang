<template>
    <div>
        <div class="navBar_bg">
            <div class="message_img bannerBox">
                <img v-if="carouselMapImg === ''" class="widthAll" src="../../../assets/img/header/defaultBanner.png"
                     alt="banner">
                <img v-else class="widthAll" :src="carouselMapImg" alt="banner">
            </div>
            <ul id="PERSONAL_ITEM" class="detailsItem">
                <!--
                <li id="PERSONAL" @click="handleJump('PERSONAL')">{{$t('profile.navBar')}}</li>
                <li id="ENDORSEMENT" @click="handleJump('ENDORSEMENT')">{{$t('whatNextAdvocacy.navBar')}}</li>
                -->
                <li id="PERSONAL" @click="handleJump('PERSONAL')">{{formItem.personal}}</li>
                <li id="ENDORSEMENT" @click="handleJump('ENDORSEMENT')">{{formItem.advocaty}}</li>
            </ul>
        </div>
        <router-view/>
    </div>
</template>

<script>

    export default {
        name: 'PROFILE',
        data() {
            return {
                // banner图
                carouselMapImg: '',
                // 菜单集合
                formItem: {
                    personal: '', // 个人资料
                    advocaty: '', // 代言及合作
                },
                language: localStorage.getItem("WJE_LANGUAGE") || (navigator.language === "zh-CN" ? "zh_CN" : "en"),
            }
        },
        methods: {
            // 获取二级导航菜单
            getMenu() {
                var _t = this;
                _t.$api.post('menu/listMenuInfoByParentId', {
                    parentid: '11', // 11: 关于王嘉尔 id
                    language: _t.language
                }, function (res) {
                    switch (res.status) {
                        case 200: // 获取详情
                            if (res.data !== undefined && res.data !== null) {
                                var menuList = res.data;
                                menuList.forEach((item) => {
                                    if (item.description !== undefined && item.description === 'personal') {
                                        // personal
                                        _t.formItem.personal = item.menuName;
                                    } else if (item.description !== undefined && item.description === 'advocaty') {
                                        // advocaty
                                        _t.formItem.advocaty = item.menuName;
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
            handleJump(val) {
                var _t = this;
                //  判断是否是当前路由
                if (_t.$route.name !== val) {
                    //  删除之前的下划线
                    var liList = document.querySelectorAll('#PERSONAL_ITEM li');
                    if (liList !== null) {
                        for (var i = 0; i < liList.length; i++) {
                            liList[i].className = '';
                        }
                        document.getElementById(val).className = 'is-active';
                    }
                    // 路由跳转
                    _t.$router.push({name: val});
                }
            },
            // 处理加载导航
            dealWith() {
                let _t = this;
                // 处理二级菜单选中状态
                let liList = document.querySelectorAll('#PERSONAL_ITEM li');
                let name = _t.$route.name;
                let nameStr = '';
                if (name === 'END_DETAILS') {
                    nameStr = 'ENDORSEMENT';
                } else {
                    nameStr = name;
                }
                let thisDom = document.getElementById(nameStr);
                if (liList !== null && thisDom !== null) {
                    for (var i = 0; i < liList.length; i++) {
                        liList[i].className = '';
                    }
                    thisDom.className = 'is-active';
                }
            }
        },
        created() {
            let _t = this;
            // 获取二级导航菜单
            _t.getMenu();
            _t.getBanner();
            _t.$nextTick(function () {
                _t.dealWith();
            });
        },
    }
</script>

<style scoped>

</style>
