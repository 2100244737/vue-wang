<template>
    <div class="mobileBox">
        <!--头部及导航-->
        <mobileHeader/>
        <!--内容-->
        <div class="mobileContent">
            <router-view/>
        </div>
        <!--版权-->
        <mobile_copyRight/>
    </div>
</template>

<script>
    import mobileHeader from "../../components/mobileHeader";
    import mobile_copyRight from "../../components/mobile_copyRight";

    export default {
        name: "index",
        components: {mobileHeader, mobile_copyRight}
    }
</script>

<style scoped>
    .mobileContent {
        margin-top: 60px;
        margin-bottom: 20px;
    }
</style>
