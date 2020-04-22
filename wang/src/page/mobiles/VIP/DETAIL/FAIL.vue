<template>
    <div class="vipStatusMobile_Box">
        <div class="vipStatusMobile tc">
            <img class="statusIcon" src="../../../../assets/img/vipPhoto/fail.png"/>
            <p class="mainP1">{{$t('order.fail')}}</p>
            <p class="mainP2">888.00</p>
            <div class="mainBtn">
                <el-button size="small" class="homeBtn" type="default" @click="backHome">{{$t('order.backHome')}}
                </el-button>
                <el-button size="small" class="homeBtn" type="default" @click="continueBtn">{{$t('order.continue')}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import AESUtil from "../../../../config/crypto";

    export default {
        name: "FAIL",
        data() {
            return {
                // 查询表单
                formItem: {
                    activityId: '', // 活动id
                }
            }
        },
        methods: {
            // 返回首页
            backHome() {
                let _t = this;
                _t.$jump.toJumpPage('VIP_VIP', 'M_VIP_VIP');
            },
            // 继续支付
            continueBtn() {
                let _t = this;
                // 路由跳转
                _t.$jump.toJumpPage('VIP_ORDER', 'M_VIP_ORDER', {
                    VIP_ACTIVITY_ORDER_ID: AESUtil.encrypt(_t.formItem.activityId)
                });
                localStorage.setItem('WJE_VIP_ACTIVITY_ORDER_ID', AESUtil.encrypt(_t.formItem.activityId));
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'VIP_FAIL', 'M_VIP_FAIL');
            if (jump === false) {
            }
        }
    }
</script>

<style scoped>

</style>
