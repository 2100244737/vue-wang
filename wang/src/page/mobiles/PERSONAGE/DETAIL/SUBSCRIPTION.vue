<template>
    <div style="line-height: 300px; max-width: 500px; margin: 0 auto;" class="tc">
        <img class="width_80" src="../../../../assets/img/common/2020.png" alt="">
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

            }
        }
    }
</script>

<style scoped>

</style>
