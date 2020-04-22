<template>
    <div class="vipStatus_Box">
        <el-steps :active="4" align-center class="stepsZz">
            <el-step :title="$t('order.chooseCommodity')"/>
            <el-step :title="$t('order.confirmOrder')"/>
            <el-step :title="$t('order.pay')"/>
            <el-step :title="$t('order.success')"/>
        </el-steps>
        <div class="vipStatusBox vipStatus_BoxPc">
            <img src="../../../../assets/img/vipPhoto/success.png"/>
            <p class="mainP1">{{$t('order.success')}}</p>
            <p class="mainP2">888.00</p>
            <div class="mainBtn">
                <el-button type="default" class="homeBtn" @click="backHome">{{$t('order.backHome')}}</el-button>
                <el-button type="default" class="homeBtn" @click="record">{{$t('order.see')}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SUCCESS",
        data() {
            return {}
        },
        methods: {
            // 返回首页
            backHome() {
                let _t = this;
                _t.$jump.toJumpPage('VIP_VIP', 'M_VIP_VIP');
            },
            // 查看记录
            record() {
                let _t = this;
                _t.$jump.toJumpPage('MY_ORDER', 'M_MY_ORDER', {
                    WJE_PAY_WAY_INFO: 'second', // first: 会员订单 second: 活动订单
                });
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'VIP_SUCCESS', 'M_VIP_SUCCESS');
            if (jump === false) {
            }
        }
    };
</script>

<style scoped>

</style>
