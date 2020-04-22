<template>
    <div class="blackBg">
        <!--头部-->
        <headerBox/>
        <!--导航-->
        <topNav/>
        <!--内容区域-->
        <router-view/>
        <!--版权-->
        <copyright/>
    </div>
</template>

<script>
    import headerBox from '../../components/headerBox';
    import topNav from '../../components/topNav';
    import copyright from '../../components/copyright';
    import mobileHeader from "../../components/mobileHeader";

    export default {
        name: 'index',
        components: {headerBox, topNav, copyright},
    }
</script>
<style scoped>

</style>
