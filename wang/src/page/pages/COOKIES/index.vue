<template>
    <div class="cookieBox">
        <div class="ing">
            <img src="../../../assets/img/common/2020.png" alt/>
        </div>
        <div v-if="false" class="navBar_bg">
            <div class="message_img bannerBox">
                <img v-if="carouselMapImg === ''" class="widthAll" src="../../../assets/img/header/defaultBanner.png"
                     alt="banner">
                <img v-else class="widthAll" :src="carouselMapImg" alt="banner">
            </div>
        </div>
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: "COOKIES",
        data() {
            return {
                carouselMapImg: '', // banner图
            }
        },
        methods: {
            // 查询banner图
            getBanner() {
                let _t = this;
                _t.$api.post('home/getBanner', {
                    site: 5, // 5:商城 (后台管理系统可查具体值得含义)
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
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'COOKIES', 'M_COOKIES');
            if (jump === false) {
                _t.getBanner();
            }
        }
    };
</script>

<style scoped>
    .ing {
        height: 600px;
        text-align: center;
        line-height: 600px;
        color: #fff;
        font-size: 40px;
    }
</style>
