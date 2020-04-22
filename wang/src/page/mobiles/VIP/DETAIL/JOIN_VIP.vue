<template>
    <div class="mobileJoinVipBox">
        <!--票价-->
        <div class="joinVipTips">
            <img class="vipIcon" src="../../../../assets/img/vipPhoto/VIP-icon.png"/>
            <p class="vipText">
                <span>{{formItem.priceNum}}</span>
            </p>
        </div>
        <!--会员状态-->
        <div class="joinVipBox_Status">
            <MEMBER/>
        </div>
        <!--收件地址-->
        <div class="vipGift marginTop50">
            <div class="title" @click="isShow">
                <img class="_checked"
                     src="../../../../assets/img/vipPhoto/checked.png"
                     v-show="formItem.downIcon"/>
                <img class="_checkbox"
                     src="../../../../assets/img/vipPhoto/checkbox.png"
                     v-show="!formItem.downIcon"/>
                <span>{{$t('joinVIP.isHasGift')}}</span>
            </div>
            <div class="main">
                <div class="receiving">
                    <span>{{$t('joinVIP.addressTitle')}}</span>
                </div>
                <div class="userInfo">
                    <span>{{$t('joinVIP.userName')}}：</span>
                    <span>{{formItem.userName}}</span>
                </div>
                <div class="userInfo">
                    <span>{{$t('joinVIP.mobile')}}：</span>
                    <span>{{formItem.mobilePhone}}</span>
                </div>
                <div class="userInfo">
                    <span>{{$t('joinVIP.address')}}：</span>
                    <span>{{formItem.address}}</span>
                </div>
                <div class="userInfo">
                    <span>{{$t('joinVIP.Postage')}}：</span>
                    <span>{{formItem.postage}}</span>
                </div>
            </div>
        </div>
        <!--支付方式-->
        <div class="VipPayment">
            <div class="title">
                <img class="titleIcon" src="../../../../assets/img/vipPhoto/title.png" alt="">
                <span>{{$t('joinVIP.Payment')}}</span>
            </div>
            <div class="main">
                <div class="payFay" :class="formItem.isActive === 0 ? 'is_active': ''">
                    <img @click="selectPayWay(0)" class="payIcon" src="../../../../assets/img/vipPhoto/Alipay.png"/>
                </div>
<!--                <div class="payFay" :class="formItem.isActive === 1 ? 'is_active': ''">-->
<!--                    <img @click="selectPayWay(1)" class="payIcon" src="../../../../assets/img/vipPhoto/WeChat.png"/>-->
<!--                </div>-->
                <div class="payFay" :class="formItem.isActive === 2 ? 'is_active': ''">
                    <img @click="selectPayWay(2)" class="payIcon" src="../../../../assets/img/vipPhoto/paypal.png"/>
                </div>
            </div>
        </div>
        <!--底部付款-->
        <div class="VipFooter tr">
            <!--协议-->
            <div class="checked">
                <div @click="checkedBox">
                    <img class="_checked"
                         src="../../../../assets/img/vipPhoto/checked.png"
                         v-if="formItem.payIcons"/>
                    <img class="_checkbox"
                         src="../../../../assets/img/vipPhoto/checkbox.png"
                         v-else/>
                </div>
                <div @click="userAgreement" class="joinVipColor cursorPointer">{{$t('joinVIP.hasRead')}}</div>
            </div>
            <!--付款-->
            <div class="buyBtn">
                <p>
                    <span>{{$t('joinVIP.final')}}：</span>
                    <span>{{formItem.allTotal}}</span>
                    <span>HKD</span>
                </p>
                <el-button class="orderBtn" size="small" type="default" @click="buyBtn">{{$t('joinVIP.submit')}}
                </el-button>
            </div>
        </div>
        <!--协议-->
        <el-dialog
            class="agreementDialog"
            :title="$t('order.title')"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="90%"
            :visible.sync="dialogUser"
            :before-close="resetUser">
            <div class="userStyle mobileWeb">
                <div v-html="formItem.content" class="content"></div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import MEMBER from "../../PERSONAGE/DETAIL/MEMBER";
    import AESUtil from "../../../../config/crypto";

    export default {
        name: "JOIN_VIP",
        components: {MEMBER},
        data() {
            return {
                // 表单
                formItem: {
                    priceNum: this.$t('joinVIP.annualFee'), // 会员价
                    downIcon: false, // 是否需要入会礼
                    payIcons: false, // 是否同意支付协议
                    userName: '', // 联系人
                    mobilePhone: '', // 联系方式
                    address: '', // 地址
                    postage: '', // 邮费
                    total: '370', // 会费
                    allTotal: '', // 实付款
                    isActive: -1, // 支付方式
                    content: '', // 支付协议
                    userId: this.getCookie('WJE_USER_ID'), // 用户ID
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'),
                },
                // 支付协议弹出层
                dialogUser: false,
            }
        },
        methods: {
            // 勾选是否需要入会礼
            isShow() {
                let _t = this;
                _t.formItem.downIcon = !_t.formItem.downIcon;
            },
            // 选择支付方式
            selectPayWay(item) {
                let _t = this;
                _t.formItem.isActive = item;
            },
            // 弹出蒙版
            userAgreement() {
                var _t = this;
                _t.dialogUser = true;
                _t.$api.post('vip/getConfidentiality', {
                    vipId: '1', // 0: 注册 1: 支付 2: 保密公告
                    language: _t.formItem.language, // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null && res.data.length !== 0) {
                                // 注册协议
                                if (res.data[0].ConfidentialNoticeContextStr !== undefined && res.data[0].ConfidentialNoticeContextStr !== null) {
                                    let content = res.data[0].ConfidentialNoticeContextStr;
                                    content = content.replace(/\r\n|\n/gi, '<br/>');
                                    _t.formItem.content = content;
                                }
                            } else {
                                _t.formItem.content = '';
                            }
                            break;
                        case 204: // 未查询到结果
                            _t.formItem.content = '';
                            break;
                        default:
                            _t.formItem.content = '';
                            _t.$message.error(_t.$t('public.queryError'));
                            break;
                    }
                });
            },
            // 关闭协议弹出框
            resetUser() {
                var _t = this;
                _t.formItem.content = '';
                _t.dialogUser = false;
            },
            // 勾选支付协议
            checkedBox() {
                let _t = this;
                _t.formItem.payIcons = !_t.formItem.payIcons;
            },
            // 跳转地址管理页面
            editAddress() {
                let _t = this;
                _t.$jump.toJumpPage('VIP_ADDRESS', 'M_VIP_ADDRESS');
            },
            // 获取用户信息
            getUserInfo() {
                let _t = this;
                if (_t.formItem.userId !== null && _t.formItem.userId !== 'null') {
                    _t.$api.post('user/getById', {
                        id: _t.formItem.userId
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 获取成功
                                if (res.data !== undefined && res.data !== null) {
                                    let resData = res.data;
                                    // 联系人
                                    _t.formItem.userName = resData.realName !== undefined && resData.realName !== null ? resData.realName : '';
                                    // 电话
                                    _t.formItem.mobilePhone = resData.userPhoneNumber !== undefined && resData.userPhoneNumber !== null ? resData.userPhoneNumber : '';
                                    // 判断国内还是国外
                                    if (resData.areaType !== undefined && resData.areaType !== null) {
                                        // 0:国内 1:国外
                                        if (resData.areaType === 0) {
                                            // 国内
                                            let address = '';
                                            address += resData.province !== undefined && resData.province !== null ? resData.province : '';
                                            address += resData.city !== undefined && resData.city !== null ? resData.city : '';
                                            address += resData.detailAddress !== undefined && resData.detailAddress !== null ? resData.detailAddress : '';
                                            _t.formItem.address = address;
                                            // 国内邮费
                                            _t.formItem.postage = '0';
                                        } else if (resData.areaType === 1) {
                                            // 国外
                                            _t.formItem.address = resData.detailAddress !== undefined && resData.detailAddress !== null ? resData.detailAddress : '';
                                            _t.formItem.postage = '100';
                                        }
                                    }
                                    // 计算实付款
                                    _t.formItem.allTotal = _t.formItem.postage * 1 + _t.formItem.total * 1;
                                }
                                break;
                            default: // 查询失败
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                } else {
                    _t.$message.error(_t.$t('public.isNotExist'));
                }
            },
            // 提交订单
            buyBtn() {
                let _t = this;
                // 校验收件人信息是否完整
                let isTrue = false; // 默认不添加
                if (_t.formItem.userName.trim() === ''
                    || _t.formItem.mobilePhone.trim() === ''
                    || _t.formItem.address.trim() === '') {
                    isTrue = true;
                    _t.$message.warning(_t.$t('joinVIP.userInfo'));
                    return;
                }
                // 校验付款方式
                if (_t.formItem.isActive === -1) {
                    _t.$message.warning(_t.$t('joinVIP.pleasePayment'));
                    return;
                }
                // 校验是否同意协议
                if (_t.formItem.payIcons === false) {
                    _t.$message.warning(_t.$t('joinVIP.pleaseAgreement'));
                    return;
                }
                // 可提交
                if (_t.formItem.isActive !== -1
                    && isTrue === false
                    && _t.formItem.payIcons === true) {
                    if (_t.formItem.userId !== null && _t.formItem.userId !== 'null') {
                        // 不走支付
                        // _t.getOrderNoPay();
                        // 调用支付接口
                        _t.getOrderPay();
                    } else {
                        _t.$message.error(_t.$t('public.isNotExist'));
                    }
                }
            },
            // 不走支付下单
            getOrderNoPay() {
                let _t = this;
                _t.$api.post('viporders/saveVipOrderNotPay', {
                    releaseId: _t.formItem.userId, // 用户id
                    payWay: _t.formItem.isActive.toString(), // 支付方式
                    payPrice: _t.formItem.allTotal * 100, // 实付款 * 100是按照分存储
                    giftOrNot: _t.formItem.downIcon === true ? 1 : 0, // 是否需要入会礼 1:需要 0:不需要
                }, function (res) {
                    switch (res.status) {
                        case 200: // 下单成功
                            _t.$router.push({name: 'M_JOIN_VIP_SUCCESS'});
                            break;
                        default: // 失败
                            _t.$message.error(res.message);
                            break;
                    }
                });
            },
            // 调用支付下单
            getOrderPay() {
                let _t = this;
                _t.$api.post('viporders/saveVipOrder', {
                    releaseId: AESUtil.encrypt(_t.formItem.userId), // 用户id
                    payPrice: AESUtil.encrypt(_t.formItem.allTotal * 100), // 实付款 * 100是按照分存储
                    giftOrNot: AESUtil.encrypt(_t.formItem.downIcon === true ? 1 : 0), // 是否需要入会礼 1:需要 0:不需要
                }, function (res) {
                    switch (res.status) {
                        case 200: // 下单成功
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
                                // 订单id
                                let vipOrderId = resDataJSON.vipOrderId !== undefined && resDataJSON.vipOrderId !== null ? resDataJSON.vipOrderId : '';
                                _t.getPayApi(vipOrderId);
                            }
                            break;
                        default: // 失败
                            _t.$message.error(res.message);
                            break;
                    }
                });
            },
            // 调用支付
            getPayApi(vipOrderId) {
                let _t = this;
                let ping = require("pingpp-js");
                let channel = ''; // 支付渠道
                switch (_t.formItem.isActive) {
                    case 0: // 支付宝
                        channel = 'cb_alipay_wap'; // 支付宝手机端
                        break;
                    case 1: // 微信
                        channel = 'wx_wap'; // 微信 H5 支付
                        break;
                    case 2: // PayPal
                        channel = 'paypal1'; // PayPal
                        break;
                    default: // 其他
                        channel = '';
                        break;
                }
                _t.$api.post('ping/payment', {
                    vipOrderId: AESUtil.encrypt(vipOrderId),
                    channel: AESUtil.encrypt(channel), // 渠道
                    body: AESUtil.encrypt('充值 VIP 会员'), // 商品描述
                    callback_success: AESUtil.encrypt(_t.$api.callBack() + 'mobile/joinVip/status'), // 成功的回调
                    callback_cancel: AESUtil.encrypt(_t.$api.callBack() + 'mobile/joinVip'), // 取消支付
                }, function (res) {
                    // 判断res.status 是否有返回
                    if (res.status === undefined) {
                        _t.$message.warning(_t.$t('public.changeError'));
                        return;
                    }
                    switch (res.status) {
                        case 200: // 成功
                            // 缓存调取的id
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
                                // 缓存 CHARGE_ID
                                if (resDataJSON.id !== undefined && resDataJSON.id !== null) {
                                    _t.setCookie('WJE_VIP_CHARGE_ID', AESUtil.encrypt(resDataJSON.id));
                                }
                                ping.createPayment(resDataJSON, function (result, err) {
                                    if (result === 'success') {
                                        // 只有微信JS API (wx_pub)、微信小程序（wx_lite）、QQ 公众号 (qpay_pub)、支付宝小程序（alipay_lite）支付成功的结果会在这里返回
                                        // 其他的支付结果都会跳转到 extra 中对应的 URL
                                    } else if (result === 'fail') {
                                        // Ping++ 对象 object 不正确或者微信JS API/微信小程序/QQ公众号支付失败时会在此处返回
                                    } else if (result === 'cancel') {
                                        // 微信JS API、微信小程序、QQ 公众号、支付宝小程序支付取消支付
                                    }
                                });
                            }
                            break;
                        default: // 异常
                            break;
                    }
                });
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'VIP_JOIN', 'M_VIP_JOIN');
            if (jump === false) {
                _t.getUserInfo();
            }
        }
    }
</script>

<style scoped>
    .mobileJoinVipBox {
        padding: 5%;
    }

    .joinVipBox_Status .mobile_memberBox {
        padding: 0;
    }

    .joinVipTips {
        padding: 20px 0 30px;
        text-align: center;
        vertical-align: middle;
    }

    .joinVipTips img.vipIcon {
        width: 80px;
        vertical-align: middle;
    }

    .joinVipTips p.vipText {
        line-height: 40px;
        font-size: 20px;
    }

    ._checkbox {
        margin-right: 5px;
        margin-top: 1px;
    }

    ._checked {
        margin-right: 1px;
    }

    .vipGift .main {
        padding: 20px 30px;
    }

    .vipGift .main .receiving {
        color: #fff;
        font-size: 16px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 10px;
    }

    .vipGift .main .receiving .editIcon {
        width: 16px;
        margin-left: 10px;
        margin-bottom: 5px;
        cursor: pointer;
    }

    .vipGift .main div.userInfo {
        line-height: 30px;
        color: #8b8b8b;
    }

    .VipPayment .title {
        font-size: 16px;
        padding-bottom: 5px;
        border-bottom: 1px solid #333;
    }

    .VipPayment .titleIcon {
        width: 16px;
        margin-right: 10px;
    }

    .VipPayment .title {
        font-size: 18px;
        padding-bottom: 10px;
        border-bottom: 1px solid #333;
    }

    .VipPayment .titleIcon {
        width: 20px;
        margin-right: 10px;
    }

    .VipPayment .main {
        padding: 30px 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .VipPayment .payFay {
        height: 40px;
        border: 1px solid transparent;
        margin-right: 10px;
    }

    .VipPayment .payFay.is_active {
        border: 1px solid #9a9798;
    }

    .VipPayment .payFay > img {
        height: 100%;
    }

    .VipFooter .checked {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        color: #8b8b8b;
        font-size: 14px;
        margin: 0 0 10px;
    }

    .buyBtn span {
        font-size: 16px;
    }

    .orderBtn {
        border: 1px solid #7d7d7d;
        color: #c5c5c5;
        background-color: #2a282a;
        margin-top: 20px;
        border-radius: 0;
    }
</style>
