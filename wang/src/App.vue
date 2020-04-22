<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App',
        methods: {
            getData() {
                let sUserAgent = navigator.userAgent.toLowerCase();
                let bIsIPad = sUserAgent.match(/ipad/i) == "ipad";
                let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
                let bIsMidP = sUserAgent.match(/midp/i) == "midp";
                let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
                let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
                let bIsAndroid = sUserAgent.match(/android/i) == "android";
                let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
                let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
                if (!(bIsIPad || bIsIphoneOs || bIsMidP || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
                    document.body.setAttribute('data_equipment', 'web');
                } else {
                    document.body.setAttribute('data_equipment', 'mobile');
                }
            }
        },
        created() {
            let _t = this;
            _t.getData();
            // 是否播放闪频动画
            document.body.setAttribute('video_play', false);
            // 首页是否显示vip活动
            document.body.setAttribute('activity_show_home', true);
            // vip是否显示vip活动
            document.body.setAttribute('activity_show_vip', true);
            /*
            if (process.env.NODE_ENV === "production") {
                // 禁止右键
                document.oncontextmenu = function () {
                    return false;
                };
                // 禁止F12检查元素
                document.onkeydown = function () {
                    if (window.event.keyCode === 123) {
                        return false;
                    }
                };
            }
            */
        }
    }
</script>
<style scoped>
    #app {
        min-height: 100%;
    }
</style>
