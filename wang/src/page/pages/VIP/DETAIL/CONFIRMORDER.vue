<template>
    <div class="vipOrder">
        <el-steps :active="2" align-center class="stepsZz">
            <el-step :title="$t('order.chooseCommodity')"/>
            <el-step :title="$t('order.confirmOrder')"/>
            <el-step :title="$t('order.pay')"/>
            <el-step :title="$t('order.success')"/>
        </el-steps>
        <div class="personInfo">
            <div class="title">
                <i class="icon"/>
                <span>{{$t('order.personinfo')}}</span>
            </div>
            <div class="main">
                <p>{{$t('order.name')}}：<span>{{personData.name}}</span></p>
                <p>{{$t('order.phone')}}：<span>{{personData.phone}}</span></p>
                <p>{{$t('order.idcard')}}：<span>{{personData.idCard}}</span></p>
            </div>
        </div>
        <div class="payment">
            <div class="title">
                <i class="icon"/>
                <span>{{$t('order.paymentMethod')}}</span>
            </div>
            <div class="main payBox clearFix">
                <div v-for='(item,index) in payMethod'
                     :key="index"
                     class="payItem"
                     :class="isActive === index ? 'addClass' : ''"
                     @click="selectPrice(item,index)">
                    <img :src="item.img">
                </div>
            </div>
        </div>
        <div v-if="inputList.length !== 0" class="verification">
            <div class="title">
                <i class="icon"/>
                <span>{{$t('order.problem')}}</span>
            </div>
            <div class="main marginTop30">
                <div v-for="(item,index) in inputList" :key="index">
                    <p>{{item.question}}</p>
                    <el-input
                        class="width300"
                        v-model="item.input"
                        :placeholder="$t('order.inputAnswer')"
                        @blur="verification(item)"/>
                </div>
            </div>
        </div>
        <div class="confirm" :class="inputList.length === 0 ? '' : 'marginTop50'">
            <div class="title">
                <i class="icon"/>
                <span>{{$t('order.confirmOrder')}}</span>
            </div>
            <el-table show-summary :data="tableData" class="marginTop30">
                <el-table-column :label="$t('order.activity')" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.thumbnail"/>
                    </template>
                </el-table-column>
                <el-table-column align="center">
                    <template slot-scope="scope">
                        <p style="font-size: 16px;">{{scope.row.activityTitle}}</p>
                        <p>{{scope.row.activityAddress}}</p>
                        <p>{{scope.row.activityTime}}</p>
                        <p>{{$t('order.seatWith')}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="ticketPrice" :label="$t('order.price')" align="center"/>
                <el-table-column prop="ticketCount" :label="$t('order.num')" align="center"/>
                <el-table-column prop="orderPrice" :label="$t('order.total')" align="center"/>
            </el-table>
        </div>
        <div class="footer">
<!--            <div class="checked">-->
<!--                <div class="displayInlineBlock" @click="downIcon = !downIcon">-->
<!--                    <img class="_checkbox" src="../../../../assets/img/vipPhoto/checkbox.png" v-show="downIcon"/>-->
<!--                    <img src="../../../../assets/img/vipPhoto/checked.png" v-show="!downIcon"/>-->
<!--                </div>-->
<!--                <span class="icon joinVipColor" @click="userAgreement">《{{$t('order.payment')}}》</span>-->
<!--            </div>-->
            <div class="buyBtn">
                <p>
                    <span>{{$t('order.actual')}}:</span>
                    <span>{{ticketItem.total}}</span>
                    <span>HKD</span>
                </p>
                <el-button :disabled="tableData.length === 0" class="order" type="default" @click="buyBtn">
                    {{$t('order.placeorder')}}
                </el-button>
            </div>
        </div>
        <!--协议-->
        <el-dialog
            class="agreementDialog"
            :title="$t('order.title')"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="dialogUser"
            :before-close="resetUser">
            <div class="userStyle pcWeb">
                <div v-html="formItem.content" class="content"></div>
            </div>
        </el-dialog>
        <!--扫码支付-->
        <el-dialog
            class="paymentDialog"
            title="扫码支付"
            width="400px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :before-close="resetPayment"
            :visible.sync="dialogCode">
            <div class="codeTitle">
                <span>{{$t('joinVIP.final')}}：</span>
                <span>{{ticketItem.total}}</span>
                <span>HKD</span>
            </div>
            <div class="tc codeImg">
                <img :src="qrCodeItem.codeImg" alt="code">
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {dateFilterDayCN} from "../../../../assets/js/filters";
    import AESUtil from "../../../../config/crypto";

    export default {
        name: 'CONFIRM_ORDER',
        data() {
            return {
                // 票的信息
                ticketItem: {
                    total: 0, // 订单总价
                    totalCount: 0, // 订单总数
                    totalLimit: 0, // 限制的可购买的数量
                },
                // 活动表单
                formItem: {
                    activityId: '', // 活动id
                    orderId: '', // 订单id
                    payWay: '', // 支付方式
                    content: '', // 支付协议内容
                    userId: this.getCookie('WJE_USER_ID'), // 用户id
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en')
                },
                dialogUser: false, // 支付协议蒙版
                // 选支付方式变样式
                isActive: -1,
                // 选中支付方式标记
                checkedPrice: false,
                // 协议
                downIcon: true,
                // 验证问题列表
                inputList: [],
                // 验证问题结果
                result: false,
                // 观演人信息
                personData: {
                    name: '', // 姓名
                    phone: '', // 手机号
                    idCard: '', // 证件号
                },
                // 支付方式
                payMethod: [
                    {img: require('../../../../assets/img/vipPhoto/Alipay.png'), id: 'cb_alipay_pc_direct'},
                    {img: require('../../../../assets/img/vipPhoto/WeChat.png'), id: 'cb_wx_pub_qr'},
                    {img: require('../../../../assets/img/vipPhoto/paypal.png'), id: 'paypal1'}
                ],
                tableData: [], // 确认订单列表信息
                // 演出封面
                activityItem: {
                    thumbnail: '', // 封面图
                    activityTitle: '', // 演出名称
                    activityAddress: '', // 演出地点
                    activityTime: '', // 演出时间
                },
                // 扫码支付表单
                qrCodeItem: {
                    id: '', // 客户端轮询的id
                    codeImg: '', // 扫码的图片
                },
                dialogCode: false, // 扫码支付弹出层
                timer: null, // 扫码支付，客户端轮询定时器
                lastTime: new Date().getTime(), // 记录上次定时器的执行时间
            }
        },
        methods: {
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
            // 选中 支付的方式
            selectPrice(item, index) {
                let _t = this;
                _t.isActive = index; // 选中态
                _t.formItem.payWay = item.id; // 选中的支付方式
                _t.checkedPrice = true; // 支付方式选中标识
            },
            // 提交订单
            buyBtn() {
                let _t = this;
                // 校验观影人信息
                let isError = false;
                if (_t.personData.name.trim() === '' || _t.personData.phone.trim() === '' || _t.personData.idCard.trim() === '') {
                    isError = true;
                    _t.$message.warning(_t.$t('ticketGrabbing.userInfo'));
                    return;
                }
                // 校验是否选择支付方式
                if (!_t.checkedPrice) {
                    _t.$message.warning(_t.$t('order.payWay'));
                    return;
                }
                // 校验支付问题
                let isResult = true; // 默认true 需要校验
                if (_t.inputList.length !== 0) {
                    _t.inputList.forEach((item) => {
                        if (item.result === false) {
                            isResult = false;
                        }
                    });
                } else {
                    isResult = true; // 没有问题不去校验
                }
                // 确认需要校验
                if (isResult === false) {
                    _t.$message.warning(_t.$t('order.validationProblem'));
                    return;
                }
                // 提交的数量必须小于等于限制
                if (_t.ticketItem.totalCount > _t.ticketItem.totalLimit) {
                    _t.$message.warning(_t.$t('order.limit') + _t.ticketItem.totalLimit + _t.$t('order.tickets'));
                    return;
                }
                // 校验是否同意协议
                // if (_t.downIcon) {
                //     _t.$message.warning(_t.$t('order.agreement'));
                //     return;
                // }
                // 可以提交
                if (_t.checkedPrice === true
                    && isError === false
                    && isResult === true) {
                    // 不走支付
                    // _t.getNotPayWay();
                    // 走支付
                    _t.getPayWay();
                }
            },
            // 不走支付订单
            getNotPayWay() {
                let _t = this;
                if (_t.formItem.userId !== null && _t.formItem.userId !== 'null') {
                    _t.$api.post('orderIterm/saveOrderItermNoPay', {
                        orderId: _t.formItem.orderId, // 订单Id
                        payWay: _t.formItem.payWay, // 支付方式
                        releaseId: _t.formItem.userId, // 用户id
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 操作成功
                                _t.$router.push({name: 'VIP_SUCCESS'});
                                break;
                            case 2004: // 抢单失败
                            case 2006: // 更新订单状态失败
                                _t.$message.error(_t.$t("ticketGrabbing.errorTip"));
                                break;
                            case 2024: // 订单无效
                                _t.$message.error(_t.$t("order.invalid"));
                                break;
                            default:
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                } else {
                    _t.$message.error(_t.$t('order.isNotExist'));
                }
            },
            // 走支付订单接口
            getPayWay() {
                let _t = this;
                let activityTitle = '';
                if (_t.tableData.length !== 0) {
                    activityTitle = _t.tableData[0].activityTitle;
                } else {
                    activityTitle = 'VIP活动订单';
                }
                let ping = require("pingpp-js");
                _t.$api.post('ping/payment', {
                    orderId: AESUtil.encrypt(_t.formItem.orderId), // 订单编号
                    channel: AESUtil.encrypt(_t.formItem.payWay), // 支付渠道
                    body: AESUtil.encrypt(activityTitle), // 商品描述
                    callback_success: AESUtil.encrypt(_t.$api.callBack() + 'order/status'), // 成功的回调
                    callback_cancel: AESUtil.encrypt(_t.$api.callBack() + 'order'), // 取消支付
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
                                    _t.setCookie('WJE_ACTIVITY_CHARGE_ID', AESUtil.encrypt(resDataJSON.id));
                                }
                                // 微信扫码
                                if (_t.formItem.payWay === 'cb_wx_pub_qr') {
                                    if (resDataJSON.qrCord !== undefined && resDataJSON.qrCord !== null) {
                                        _t.qrCodeItem.id = resDataJSON.id;
                                        _t.qrCodeItem.codeImg = resDataJSON.qrCord;
                                        if (resDataJSON.id !== undefined && resDataJSON.id !== null) {
                                            _t.refreshPage();
                                        }
                                        _t.dialogCode = true; // 显示扫码支付
                                    }
                                    return;
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
                            _t.$message.error(res.message);
                            break;
                    }
                });
            },
            // 获取用户信息
            getUserInfo() {
                let _t = this;
                if (_t.formItem.userId !== null && _t.formItem.userId !== 'null') {
                    _t.$api.post('user/getById', {
                        id: _t.formItem.userId
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 查询成功
                                if (res.data !== undefined && res.data !== null) {
                                    // 真实姓名
                                    _t.personData.name = res.data.realName !== undefined ? res.data.realName : '';
                                    // 手机号码
                                    _t.personData.phone = res.data.userPhoneNumber !== undefined ? res.data.userPhoneNumber : '';
                                    // 证件号及类型
                                    if (res.data.userCardId !== undefined) {
                                        let userCardId = res.data.userCardId.split(',');
                                        if (userCardId.length !== 0 && userCardId.length === 2) {
                                            // 观影人身份证
                                            _t.personData.idCard = userCardId[1];
                                        }
                                    }
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
            // 验证问题
            getProblem() {
                let _t = this;
                if (_t.formItem.activityId !== null && _t.formItem.activityId !== 'null') {
                    _t.$api.post('question/listQuestion', {
                        activityId: _t.formItem.activityId, // 活动id
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 查询成功
                                let resData = res.data !== undefined && res.data !== null ? res.data : [];
                                resData.forEach((item) => {
                                    item.input = ''; // 初始化输入框的值
                                    item.result = false;  //定义 判断是否输入 正确
                                });
                                _t.inputList = resData;
                                break;
                            default: // 查询失败
                                _t.inputList = [];
                                break;
                        }
                    });
                }
            },
            // 失去焦点验证问题
            verification(item) {
                let _t = this;
                // 判断 输入是否为空
                if (item.input !== '') {
                    _t.$api.post('question/verifyQuestion', {
                        id: item.id,
                        answer: item.input
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 验证正确
                                item.result = true;
                                _t.$message.success(_t.$t('order.successTip'));
                                break;
                            case 2009: // 问题验证失败
                                item.result = false;
                                _t.$message.error(_t.$t('order.problemError'));
                                break;
                            default: // 验证失败
                                item.result = false;
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                } else {
                    item.result = false;
                }
            },
            // 表格数据
            getData() {
                let _t = this;
                if (_t.formItem.userId !== null && _t.formItem.userId !== 'null') {
                    _t.$api.post('order/getOrder', {
                        releaseId: _t.formItem.userId, // 用户id
                        activityId: _t.formItem.activityId, // 活动id
                        orderId: _t.formItem.orderId, // 订单Id
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 查询成功
                                let resData = res.data !== undefined && res.data !== null ? res.data : [];
                                // 处理确认订单信息
                                let total = 0; // 实付款
                                let totalCount = 0; // 订单总数
                                resData.forEach(item => {
                                    item.ticketCount = item.ticketCount !== undefined && item.ticketCount !== null ? item.ticketCount : 0; // 处理数量
                                    // 处理缩略图
                                    if (item.thumbnail !== undefined && item.thumbnail !== null) {
                                        let thumbnail = item.thumbnail.split(',');
                                        if (thumbnail.length !== 0) {
                                            item.thumbnail = _t.$api.imgUrl() + thumbnail[0];
                                        }
                                    }
                                    // 处理限制的条数
                                    if (item.activityRestriction !== undefined && item.activityRestriction !== null) {
                                        _t.ticketItem.totalLimit = item.activityRestriction;
                                    }
                                    item.activityTitle = item.activityTitle !== undefined && item.activityTitle !== null ? item.activityTitle : ''; // 活动标题
                                    item.activityAddress = item.activityAddress !== undefined && item.activityAddress !== null ? item.activityAddress : ''; // 活动地点
                                    item.activityTime = item.activityTime !== undefined && item.activityTime !== null ? dateFilterDayCN(item.activityTime) : ''; // 活动时间
                                    item.orderPrice = item.orderPrice !== undefined && item.orderPrice !== null ? item.orderPrice / 100 : 0; // 订单价格
                                    item.ticketPrice = item.ticketPrice !== undefined && item.ticketPrice !== null ? item.ticketPrice / 100 : 0; // 票的单价
                                    total += item.orderPrice * 1; // 计算总价
                                    totalCount += item.ticketCount * 1; // 计算总数
                                });
                                // 计算的总价
                                _t.ticketItem.total = total;
                                // 计算的总数
                                _t.ticketItem.totalCount = totalCount;
                                // 确认订单表格
                                _t.tableData = resData;
                                break;
                            default:
                                break;
                        }
                    });
                }
            },
            // 重置扫码支付
            resetPayment() {
                let _t = this;
                _t.dialogCode = false;
                _t.qrCodeItem.codeImg = ''; // 清空二维码
                _t.qrCodeItem.id = ''; // 清空id
                clearInterval(_t.timer);
            },
            // 启动定时器客户端轮询服务端结果
            refreshPage() {
                let _t = this;
                let rate = 1; // 默认1秒
                // 定时器防止密集访问
                _t.timer = setInterval(() => {
                    let nowTime = new Date().getTime();
                    // 允许 10 毫秒的误差
                    if ((nowTime - _t.lastTime) >= (rate * 1000 - 10)) {
                        // 记录当前执行的时间
                        _t.lastTime = nowTime;
                        _t.getPayResult();
                    }
                }, rate * 1000);
            },
            // 调用支付结果查询接口
            getPayResult() {
                let _t = this;
                _t.$api.post('ping/select', {
                    pingId: AESUtil.encrypt(_t.qrCodeItem.id)
                }, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
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
                                if (resDataJSON.paid !== undefined && resDataJSON.paid !== null && resDataJSON.paid === true) {
                                    // 执行重置函数
                                    _t.resetPayment();
                                    // 跳转
                                    _t.$jump.toJumpPage('VIP_STATUS', 'M_VIP_STATUS');
                                }
                            }
                            break;
                        default:
                            break;
                    }
                });
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'VIP_ORDER', 'M_VIP_ORDER');
            if (jump === false) {
                // 获取活动id
                let activityId = _t.$route.params.WJE_VIP_ACTIVITY_ORDER_ID ? _t.$route.params.WJE_VIP_ACTIVITY_ORDER_ID : localStorage.getItem('WJE_VIP_ACTIVITY_ORDER_ID');
                _t.formItem.activityId = AESUtil.decrypt(activityId);
                let orderId = _t.$route.params.WJE_VIP_ORDER_ID ? _t.$route.params.WJE_VIP_ORDER_ID : localStorage.getItem('WJE_VIP_ORDER_ID');
                _t.formItem.orderId = AESUtil.decrypt(orderId);
                // 获取观影人信息
                _t.getUserInfo();
                // 获取确认订单信息
                _t.getData();
                // 获取支付验证问题
                _t.getProblem();
            }
        }
    }
</script>
<style scoped>
    .addClass {
        border: 1px solid #ccc !important;
    }

    .contentBox {
        line-height: 30px;
        color: #fff;
    }

    .vipOrder {
        padding: 50px 130px;
        background-color: #0b0b0c;
    }

    .personInfo {
        width: 80%;
        margin: 50px auto 0;
    }

    .title {
        height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        font-size: 18px;
        border-bottom: 1px solid #333;
    }

    .title i.icon {
        display: inline-block;
        width: 34px;
        height: 34px;
        background: url("../../../../assets/img/vipPhoto/title.png") no-repeat center center;
        margin-right: 5px;
    }

    .personInfo .main {
        padding: 30px 60px;
    }

    .personInfo .main p {
        line-height: 30px;
        font-size: 14px;
    }

    .verification,
    .confirm,
    .payment {
        width: 80%;
        margin: 0 auto;
    }

    .payment .main {
        padding: 50px 0;
    }

    .payment .main div {
        display: inline-block;
        cursor: pointer;
        border: 1px transparent solid;
    }

    .verification .main p {
        line-height: 50px;
        font-size: 14px;
    }

    .checked {
        margin-top: 20px;
        font-size: 14px;
    }

    ._checkbox {
        margin-top: 1px;
        margin-right: 4px;
    }

    .buyBtn {
        padding: 30px 0 20px 60px;
    }

    .buyBtn span {
        font-size: 22px;
    }

    .order {
        margin-top: 15px;
        border: 1px solid #7d7d7d !important;
        color: #c5c5c5 !important;
        background-color: #2a282a !important;
        border-radius: 0 !important;
    }

    .footer {
        width: 80%;
        margin: 0 auto;
        text-align: right;
    }

    .payBox .payItem {
        box-sizing: border-box;
        margin: 0 20px;
        text-align: center;
    }

    .payBox .payItem:first-child {
        margin-left: 0;
    }

    .payBox .payItem:last-child {
        margin-right: 0;
    }

    .payBox .payItem img {
        height: 100%;
    }
</style>
<style>
    .vipOrder .el-table--border::after,
    .vipOrder .el-table--group::after,
    .vipOrder .el-table::before {
        background-color: #333;
    }

    .vipOrder .el-table td,
    .vipOrder .el-table th.is-leaf {
        border-bottom: 1px solid #333 !important;
    }

    .vipOrder .el-table__footer-wrapper td {
        border-top: 1px solid #333 !important;
    }

    .vipOrder .el-input__inner {
        color: #fff !important;
        background-color: #252326 !important;
        border-color: #474747 !important;
    }

    .vipOrder .el-table,
    .vipOrder .el-table__footer-wrapper tbody td,
    .vipOrder .el-table th,
    .vipOrder .el-table tr {
        background: transparent;
        color: #e4e4e4;
    }

    .vipOrder .el-table--enable-row-hover .el-table__body tr:hover > td {
        background: none;
    }
</style>
