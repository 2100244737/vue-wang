<template>
    <div class="vipStatus_Box">
        <el-steps :active="3" align-center class="stepsZz">
            <el-step :title="$t('order.confirmOrder')"/>
            <el-step :title="$t('order.pay')"/>
            <el-step :title="formItem.isSuccess === true ?
                $t('order.success') : (formItem.isSuccess === false ? $t('order.fail') : '')"/>
        </el-steps>
        <div class="vipStatusBox vipStatus_BoxPc">
            <div v-if="formItem.isSuccess === true">
                <img src="../../../../assets/img/vipPhoto/success.png"/>
                <p class="mainP1">{{$t('order.success')}}</p>
            </div>
            <div v-if="formItem.isSuccess === false">
                <img src="../../../../assets/img/vipPhoto/fail.png"/>
                <p class="mainP1">{{$t('order.fail')}}</p>
            </div>
            <p class="mainP2">
                <span v-if="formItem.currency === 'cny'">￥</span>
                <span v-if="formItem.currency === 'usd'">$</span>
                <span>{{formItem.amount}}</span>
                <span v-if="formItem.currency === 'hkd'">HKD</span>
            </p>
            <div class="mainBtn">
                <el-button type="default" class="homeBtn" @click="seeRecord">{{$t('order.see')}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import AESUtil from "../../../../config/crypto";

    export default {
        name: "JOIN_VIP_STATUS",
        data() {
            return {
                // 查询表单
                formItem: {
                    amount: '', // 金额
                    currency: '', // 货币符号
                    isSuccess: null, // 是否成功
                }
            }
        },
        methods: {
            // 查看记录
            seeRecord() {
                let _t = this;
                _t.$jump.toJumpPage('MY_ORDER', 'M_MY_ORDER', {
                    WJE_PAY_WAY_INFO: 'first', // first: 会员订单 second: 活动订单
                });
                // 删除 加入vip订单的id
                _t.delCookie('WJE_VIP_CHARGE_ID');
            },
            // 获取
            getPayData(id) {
                let _t = this;
                _t.$api.post('ping/select', {
                    pingId: id, // 获取
                }, function (res) {
                    switch (res.status) {
                        case 200: // 请求成功
                            if (res.data !== undefined && res.data !== null) {
                                // 解密JSON串
                                let resData = AESUtil.decrypt(res.data);
                                let resDataJSON = null;
                                // 判断是否属于json
                                if (_t.$recursive.isJSON(resData)) {
                                    resDataJSON = JSON.parse(resData);
                                } else {
                                    return false;
                                }
                                // 处理支付状态
                                if (resDataJSON.paid !== undefined && resDataJSON.paid !== null) {
                                    _t.formItem.isSuccess = resDataJSON.paid ? true : false;
                                } else {
                                    _t.formItem.isSuccess = null;
                                }
                                // 处理支付金额
                                if (resDataJSON.amount !== undefined && resDataJSON.amount !== null) {
                                    _t.formItem.amount = resDataJSON.amount / 100;
                                } else {
                                    _t.formItem.amount = '';
                                }
                                // 处理支付方式
                                _t.formItem.currency = resDataJSON.currency !== undefined && resDataJSON.currency !== null ? resDataJSON.currency : '';
                            }
                            break;
                        default: // 异常
                            _t.formItem.amount = ''; // 金额
                            _t.formItem.currency = ''; // 货币符号
                            _t.formItem.isSuccess = null; // 是否成功
                            break;
                    }
                });
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'JOIN_VIP_STATUS', 'M_JOIN_VIP_STATUS');
            if (jump === false) {
                // 获取 加入vip订单的id
                let amount = _t.getCookie('WJE_VIP_CHARGE_ID');
                if (amount !== null && amount !== 'null') {
                    _t.getPayData(amount);
                }
            }
        },
    }
</script>

<style scoped>

</style>
