<template>
    <div style="line-height: 300px;line-height: 300px;padding:130px;" class="tc">
        <img src="../../../../assets/img/common/2020.png" alt="">
    </div>
</template>

<script>
    export default {
        name: "SUBSCRIPTION",
        data() {
            return {}
        },
        methods: {},
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'SUBSCRIPTION', 'M_SUBSCRIPTION');
            if (jump === false) {
                // 调用父级二级导航选中态
                _t.$parent.dealWith();
            }
        }
    }
</script>

<style scoped>

</style>
