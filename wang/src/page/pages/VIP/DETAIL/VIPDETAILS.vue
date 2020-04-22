<template>
    <div class="vipDetails">
        <div class="vipShop">
            <!-- 头部左侧海报 -->
            <div class="message_img" :style="{backgroundImage:'url('+showDetails.imgUrl+')'}">
                <img class="visibilityHidden widthAll"
                     src="../../../../assets/img/thumbnail_bg/vip_activity_detail.png"
                     alt/>
            </div>
            <!-- 头部右侧时间地点票价 -->
            <div class="showDetail">
                <!--活动标题-->
                <h1>{{showDetails.showName}}</h1>
                <!--活动时间-->
                <div class="showDate">
                    <span>{{$t('ticketGrabbing.times')}}：</span>
                    <span class="showDoc">{{showDetails.showDate}}</span>
                </div>
                <!--活动地点-->
                <div class="showAddress">
                    <span>{{$t('ticketGrabbing.place')}}：</span>
                    <span class="showDoc">{{showDetails.showAddress}}</span>
                </div>
                <!--抢票说明-->
                <div class="showTips">
                    <span>{{$t('ticketGrabbing.advanceSaleTitle')}}：</span>
                    <span class="showDoc">{{$t('ticketGrabbing.advanceSale')}}</span>
                </div>
                <!--价位-->
                <div class="showPrice marginTop15">
                    <div>{{$t('ticketGrabbing.parValue')}}：</div>
                    <el-radio-group v-model="formItem.checkId" @change="selectPrice">
                        <el-radio-button v-for="(item,index) in showPrice"
                                         :key="index"
                                         class="ticketNum"
                                         :label="item.id">
                            {{$t('ticketGrabbing.stand')}} {{item.ticketPrice}}
                        </el-radio-button>
                    </el-radio-group>
                </div>
                <div class="showNum marginTop15">
                    <div>{{$t('ticketGrabbing.num')}}：</div>
                    <el-input-number
                        class="showNum_num"
                        v-model="formItem.number"
                        :min="1"
                        @change="changeNumber"
                        :max="formItem.limit"/>
                    <div class="numTips marginLeft20">
                        <span>{{$t('ticketGrabbing.tips')}}</span>
                        <strong>{{formItem.limit}}</strong>
                        <span>{{$t('ticketGrabbing.tips_end')}}</span>
                    </div>
                </div>
                <div class="showTotal marginTop15">
                    <div>{{$t('ticketGrabbing.total')}}</div>
                    <div class="total marginLeft20">
                        <b>{{formItem.total}}</b>
                        <span>HKD</span>
                    </div>
                </div>
                <div class="goBuyBtn marginTop15">
                    <el-button
                        type="default"
                        class="buy"
                        :disabled="formItem.isEnabled"
                        @click="goBuy">{{$t('ticketGrabbing.buy')}}
                    </el-button>
                    <div class="flex_1 tr goBuyBox">
                        <el-button v-if="formItem.isPaid" @click="goPayOrder" type="text" class="whiteColor">
                            {{$t('ticketGrabbing.payment')}}
                        </el-button>
                        <div class="flex_1">
                            <span>{{formItem.countTip}}</span>
                            <span class="timeOver">{{formItem.countdown}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 底部介绍 -->
        <div class="showIntroduce">
            <el-tabs v-model="activeName">
                <el-tab-pane :label="$t('ticketGrabbing.show')" name="first">
                    <div class="performanceIntroduction">
                        <div class="performanceTitle">
                            <!--                            <i class="icon"></i>-->
                            <span>{{$t('ticketGrabbing.show')}}</span>
                        </div>
                        <div id="performanceName" class="performanceName"></div>
                    </div>
                </el-tab-pane>
                <!--先注释演出须知和购买须知-->
                <!--
                <el-tab-pane :label="$t('ticketGrabbing.buyNote')" name="second">
                    <div class="purchaseInstructions">
                        <div class="purchaseTitle">
                            <i class="icon"></i>
                            <span>{{$t('ticketGrabbing.buyNote')}}</span>
                        </div>
                        <ul class="purchaseMain">
                            <li>
                                <div class="title">{{$t('ticketGrabbing.limitBuy')}}</div>
                                <div class="des">{{purchaseMap.a}}</div>
                            </li>
                            <li>
                                <div class="title">{{$t('ticketGrabbing.realName')}}</div>
                                <div class="des">{{purchaseMap.b}}</div>
                            </li>
                            <li>
                                <div class="title">{{$t('ticketGrabbing.children')}}</div>
                                <div class="des">{{purchaseMap.c}}</div>
                            </li>
                            <li>
                                <div class="title">{{$t('ticketGrabbing.seatType')}}</div>
                                <div class="des">{{purchaseMap.d}}</div>
                            </li>
                            <li>
                                <div class="title">{{$t('ticketGrabbing.invoice')}}</div>
                                <div class="des">{{purchaseMap.e}}</div>
                            </li>
                            <li>
                                <div class="title">{{$t('ticketGrabbing.return')}}</div>
                                <div class="des">{{purchaseMap.f}}</div>
                            </li>
                            <li>
                                <div class="title">{{$t('ticketGrabbing.timeLength')}}</div>
                                <div class="des">{{purchaseMap.g}}</div>
                            </li>
                        </ul>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="$t('ticketGrabbing.viewNote')" name="third">
                    <div class="observationInstruction">
                        <div class="observationTitle">
                            <i class="icon"></i>
                            <span>{{$t('ticketGrabbing.viewNote')}}</span>
                        </div>
                        <ul class="purchaseMain">
                            <li>
                                <div class="title">{{$t('ticketGrabbing.startTime')}}</div>
                                <div class="des">{{observationMap.a}}</div>
                            </li>
                            <li>
                                <div class="title">{{$t('ticketGrabbing.noCarrying')}}</div>
                                <div class="des">{{observationMap.b}}</div>
                            </li>
                            <li>
                                <div class="title">{{$t('ticketGrabbing.checkThat')}}</div>
                                <div class="des">{{observationMap.c}}</div>
                            </li>
                            <li>
                                <div class="title">{{$t('ticketGrabbing.minDuration')}}</div>
                                <div class="des">{{observationMap.d}}</div>
                            </li>
                            <li>
                                <div class="title">{{$t('ticketGrabbing.minNum')}}</div>
                                <div class="des">{{observationMap.e}}</div>
                            </li>
                            <li>
                                <div class="title">{{$t('ticketGrabbing.mainActor')}}</div>
                                <div class="des">{{observationMap.f}}</div>
                            </li>
                        </ul>
                    </div>
                </el-tab-pane>
                -->
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import {dateFilterDayPoint, dateFilterSession} from "../../../../assets/js/filters";
    import AESUtil from "../../../../config/crypto";

    export default {
        name: "VIPDETAILS",
        data() {
            return {
                // 表单
                formItem: {
                    vipId: "",
                    number: 0, // 购票数量
                    total: 0, // 购票总价
                    limit: 0, // 票数限制数量
                    isActive: -1, // 选中票价改变样式
                    checkId: "", // 选中票价的id
                    onPrice: 0, // 选中之后的票价
                    isEnabled: true, // 是否禁用按钮
                    startTime: '', // 倒计时开始时间
                    endTime: '', // 倒计时结束时间
                    countdown: '', // 倒计时显示时间
                    countTip: '', // 倒计时提示
                    isPaid: false, // 是否显示待支付
                },
                // 演唱会详情
                showDetails: {
                    showName: "",
                    showDate: "",
                    showAddress: "",
                    showScene: "",
                    imgUrl: ""
                },
                // 票价 集合
                showPrice: [],
                //介绍tab切换
                activeName: "first",
                // 购买须知数组
                purchaseMap: {
                    a: "",
                    b: "",
                    c: "",
                    d: "",
                    e: "",
                    f: "",
                    g: ""
                },
                // 观演须知
                observationMap: {
                    a: "",
                    b: "",
                    c: "",
                    d: "",
                    e: "",
                    f: ""
                },
                lastTime: new Date().getTime(), //记录上次定时器的执行时间
                timer: null, // 记录定时器
            };
        },
        methods: {
            // 票价选中事件
            selectPrice(val) {
                let _t = this;
                _t.showPrice.forEach((item) => {
                    if (item.id === val) {
                        _t.formItem.onPrice = item.ticketPrice;
                        _t.formItem.total = _t.formItem.onPrice * _t.formItem.number;
                    }
                });
            },
            // 改变数量
            changeNumber(current, oldValue) {
                let _t = this;
                // 加
                if (current > oldValue) {
                    _t.formItem.total = _t.formItem.onPrice * current;
                } else {
                    // 减
                    _t.formItem.total = _t.formItem.onPrice * current;
                }
            },
            // 跳转待支付订单
            goPayOrder() {
                let _t = this;
                _t.$jump.toJumpPage('MY_ORDER', 'M_MY_ORDER', {
                    WJE_PAY_WAY_INFO: 'third'
                });
            },
            // 立即购买
            goBuy() {
                let _t = this;
                if (_t.formItem.checkId === '') {
                    _t.$message.warning(_t.$t("ticketGrabbing.selectTicket"));
                    return;
                }
                if (_t.formItem.number === 0) {
                    _t.$message.warning(_t.$t("ticketGrabbing.selectQuantity"));
                    return;
                }
                if (_t.formItem.vipId !== "") {
                    _t.formItem.isEnabled = true;
                    _t.$api.post("order/saveOrder", {
                        activityId: _t.formItem.vipId, // 活动id
                        releaseId: _t.getCookie("WJE_USER_ID"), // 用户id
                        ticketCount: _t.formItem.number, // 数量
                        inventoryId: _t.formItem.checkId, // 选中票价的id
                    }, function (res) {
                        _t.formItem.isPaid = false;
                        switch (res.status) {
                            case 200: // 抢单成功
                                if (res.data !== undefined && res.data !== null) {
                                    let activityId = res.data.activityId !== undefined ? res.data.activityId : '';
                                    let orderId = res.data.orderId !== undefined ? res.data.orderId : '';
                                    _t.$jump.toJumpPage('VIP_ORDER', 'M_VIP_ORDER', {
                                        VIP_ACTIVITY_ORDER_ID: AESUtil.encrypt(activityId),
                                        VIP_ORDER_ID: AESUtil.encrypt(orderId)
                                    });
                                    localStorage.setItem("WJE_VIP_ACTIVITY_ORDER_ID", AESUtil.encrypt(activityId));
                                    localStorage.setItem("WJE_VIP_ORDER_ID", AESUtil.encrypt(orderId));
                                }
                                break;
                            case 2004: // 抢单失败
                                _t.formItem.isEnabled = false;
                                _t.$message.error(_t.$t("ticketGrabbing.errorTip"));
                                break;
                            case 2012: // 库存不足
                                _t.formItem.isEnabled = false;
                                _t.$message.warning(_t.$t('ticketGrabbing.insufficient'));
                                break;
                            case 2013: // 已经超出购票限制 或者 已经买过
                                _t.formItem.isEnabled = false;
                                if (res.noPay !== undefined && res.noPay !== null && res.noPay !== 0) {
                                    _t.$message.warning(_t.$t('ticketGrabbing.noPay'));
                                    _t.formItem.isPaid = true;
                                } else {
                                    _t.$message.warning(_t.$t('ticketGrabbing.againNum'));
                                }
                                break;
                            case 2022: // 用户信息不完整
                                _t.formItem.isEnabled = false;
                                _t.$message.warning(_t.$t('ticketGrabbing.userInfo'));
                                break;
                            default:
                                _t.formItem.isEnabled = false;
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }
            },
            // 查询活动详情
            getData() {
                let _t = this;
                _t.$api.get("activity/getActiviById/" + _t.formItem.vipId, {}, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null && res.data.length !== 0) {
                                let resData = res.data[0]; // 详情数据
                                // 处理图片
                                if (resData.thumbnail !== undefined && resData.thumbnail !== null) {
                                    let thumbnail = resData.thumbnail.split(',');
                                    // 获取竖版缩略图
                                    if (thumbnail.length !== 0) {
                                        _t.showDetails.imgUrl = _t.$api.imgUrl() + thumbnail[0];
                                    }
                                }
                                // 活动标题
                                _t.showDetails.showName = resData.activityTitle !== undefined ? resData.activityTitle : "";
                                // 处理活动时间
                                if (resData.activityTime !== undefined && resData.activityTime !== null) {
                                    _t.showDetails.showDate = dateFilterDayPoint(resData.activityTime);
                                }
                                // 活动地点
                                _t.showDetails.showAddress = resData.activityAddress !== undefined ? resData.activityAddress : "";
                                // 限购张数
                                _t.formItem.limit = resData.activityRestriction !== undefined ? resData.activityRestriction : 1;
                                // 处理场次
                                if (resData.activitySession !== undefined && resData.activitySession !== null) {
                                    _t.showDetails.showScene = dateFilterSession(resData.activitySession);
                                }
                                // 处理抢票倒计时
                                if (resData.startTime !== undefined && resData.startTime !== null) {
                                    _t.formItem.startTime = Number(resData.startTime);
                                }
                                if (resData.endTime !== undefined && resData.endTime !== null) {
                                    _t.formItem.endTime = Number(resData.endTime);
                                }
                                _t.dealWithCountDown();
                                // 处理演出介绍
                                if (resData.showIntroduce !== undefined && resData.showIntroduce !== null) {
                                    document.getElementById("performanceName").innerHTML = resData.showIntroduceStr;
                                }
                                // 处理购票须知
                                if (resData.buyerReading !== undefined && resData.buyerReading !== null) {
                                    let buyerReading = JSON.parse(resData.buyerReadingStr);
                                    _t.purchaseMap.a =
                                        buyerReading.a !== undefined ? buyerReading.a : "";
                                    _t.purchaseMap.b =
                                        buyerReading.b !== undefined ? buyerReading.b : "";
                                    _t.purchaseMap.c =
                                        buyerReading.c !== undefined ? buyerReading.c : "";
                                    _t.purchaseMap.d =
                                        buyerReading.d !== undefined ? buyerReading.d : "";
                                    _t.purchaseMap.e =
                                        buyerReading.e !== undefined ? buyerReading.e : "";
                                    _t.purchaseMap.f =
                                        buyerReading.f !== undefined ? buyerReading.f : "";
                                    _t.purchaseMap.g =
                                        buyerReading.g !== undefined ? buyerReading.g : "";
                                }
                                // 处理观影须知
                                if (resData.viewingReading !== undefined && resData.viewingReading !== null) {
                                    let viewingReading = JSON.parse(resData.viewingReadingStr);
                                    _t.observationMap.a =
                                        viewingReading.a !== undefined ? viewingReading.a : "";
                                    _t.observationMap.b =
                                        viewingReading.b !== undefined ? viewingReading.b : "";
                                    _t.observationMap.c =
                                        viewingReading.c !== undefined ? viewingReading.c : "";
                                    _t.observationMap.d =
                                        viewingReading.d !== undefined ? viewingReading.d : "";
                                    _t.observationMap.e =
                                        viewingReading.e !== undefined ? viewingReading.e : "";
                                    _t.observationMap.f =
                                        viewingReading.f !== undefined ? viewingReading.f : "";
                                }
                            }
                            break;
                        default:
                            // 查询失败
                            _t.$message.error(_t.$t("public.queryError"));
                            break;
                    }
                });
            },
            // 查询票面
            getPrice() {
                let _t = this;
                _t.$api.get("inventory/getInventory/" + _t.formItem.vipId, {}, function (res) {
                    switch (res.status) {
                        case 200:
                            if (res.data !== undefined && res.data !== null) {
                                let resData = res.data;
                                _t.showPrice = resData;
                                resData.forEach(item => {
                                    if (item.ticketPrice !== undefined && item.ticketPrice !== null) {
                                        item.ticketPrice = item.ticketPrice / 100;
                                    } else {
                                        item.ticketPrice = "";
                                    }
                                });
                            }
                            break;
                        default:
                            break;
                    }
                });
            },
            // 处理倒计时时间
            dealWithCountDown() {
                let _t = this;
                // 获取当前时间
                let nowDate = new Date().getTime();
                // 开抢前
                if (_t.formItem.startTime !== '' && _t.formItem.startTime > nowDate) {
                    // 未开抢
                    _t.formItem.countTip = _t.$t('ticketGrabbing.notCountDown');
                    _t.formItem.isEnabled = true; // 开启禁用
                    _t.formItem.countdown = _t.TimeDown(nowDate, _t.formItem.startTime);
                } else if (_t.formItem.startTime !== '' && _t.formItem.startTime <= nowDate && _t.formItem.endTime !== '' && _t.formItem.endTime > nowDate) {
                    // 开启开抢
                    _t.formItem.countTip = _t.$t('ticketGrabbing.inCountDown');
                    _t.formItem.isEnabled = false; // 取消禁用
                    _t.formItem.countdown = _t.TimeDown(nowDate, _t.formItem.endTime);
                } else if (_t.formItem.startTime !== '' && _t.formItem.startTime < nowDate && _t.formItem.endTime !== '' && _t.formItem.endTime <= nowDate) {
                    // 结束抢票
                    _t.formItem.countTip = _t.$t('ticketGrabbing.countdown');
                    _t.formItem.isEnabled = true; // 取消禁用
                    _t.formItem.countdown = _t.TimeDown(nowDate, _t.formItem.endTime);
                    // 销毁刷新定时器
                    clearInterval(_t.timer);
                    _t.timer = null;
                }
            },
            // 计算剩余时间
            TimeDown(nowDate, endDate) {
                let _t = this;
                let innerHtml = '';
                // 相差的总秒数
                let totalSeconds = parseInt((endDate - nowDate) / 1000);
                // 天数
                let days = Math.floor(totalSeconds / (60 * 60 * 24)) <= 0 ? 0 : Math.floor(totalSeconds / (60 * 60 * 24));
                // 取模（余数）
                let modulo = totalSeconds % (60 * 60 * 24);
                // 小时数
                let hours = Math.floor(modulo / (60 * 60)) <= 0 ? 0 : Math.floor(modulo / (60 * 60));
                hours = hours < 10 ? '0' + hours : hours;
                modulo = modulo % (60 * 60);
                // 分钟
                let minutes = Math.floor(modulo / 60) <= 0 ? 0 : Math.floor(modulo / 60);
                minutes = minutes < 10 ? '0' + minutes : minutes;
                // 秒
                let seconds = modulo % 60 <= 0 ? 0 : modulo % 60;
                seconds = seconds < 10 ? '0' + seconds : seconds;
                // 输出到页面
                innerHtml = days + " " + (days <= 1 ? _t.$t('public.day') : _t.$t('public.days')) + " " + hours + ":" + minutes + ":" + seconds;
                return innerHtml;
            },
            // 页面定时刷新
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
                        _t.dealWithCountDown();
                    }
                }, rate * 1000);
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'VIP_DETAILS', 'M_VIP_DETAILS');
            if (jump === false) {
                _t.formItem.vipId = _t.$route.params.WJE_ACTIVITY_ID ? _t.$route.params.WJE_ACTIVITY_ID : localStorage.getItem("WJE_ACTIVITY_ID");
                _t.getData();
                _t.getPrice();
                _t.refreshPage();
            }
        },
        // 清除定时器
        beforeDestroy() {
            let _t = this;
            //销毁刷新定时器
            clearInterval(_t.timer);
            _t.timer = null;
        }
    };
</script>

<style scoped>
    .vipDetails {
        background: #0b0b0b;
        padding: 50px 130px;
    }

    .vipDetails .vipShop {
        padding: 30px;
        background: url("../../../../assets/img/common/mask_bg.png") repeat;
        position: relative;
        display: flex;
        flex-direction: row;
    }

    .showDetail {
        flex: 1;
        padding-left: 50px;
    }

    .showDetail h1 {
        font-weight: normal;
        font-stretch: normal;
        font-size: 24px;
        margin-bottom: 20px;
        letter-spacing: 2px;
    }

    .showDetail span {
        font-size: 14px;
        line-height: 32px;
    }

    .showDate,
    .showAddress,
    .showTips,
    .showPrice,
    .showNum {
        line-height: 40px;
    }

    .showDetail .showDoc {
        font-size: 14px;
        line-height: 34px;
    }

    .showNum {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
    }

    .numTips {
        display: inline-block;
        line-height: 24px;
        color: #ccc;
    }

    .showTotal {
        line-height: 36px;
        display: flex;
        flex-direction: row;
    }

    .total b {
        font-size: 28px;
    }

    .buy {
        margin-right: 10px;
        text-align: center;
        font-size: 14px;
        border: 1px solid #ccc !important;
        background-color: rgba(250, 250, 250, 0.2) !important;
        border-radius: 0;
    }

    .performanceTitle,
    .purchaseTitle,
    .observationTitle {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
    }

    .performanceTitle i.icon,
    .purchaseTitle i.icon,
    .observationTitle i.icon {
        display: inline-block;
        width: 34px;
        height: 34px;
        background: url("../../../../assets/img/vipDetails/title.png") no-repeat center;
    }

    .performanceTitle span,
    .purchaseTitle span,
    .observationTitle span {
        font-size: 30px;
        flex: 1;
        margin-top: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #333;
    }

    .performanceName {
        margin: 50px 0;
    }

    .purchaseMain {
        padding: 50px 0 20px 50px;
    }

    .purchaseMain li div.title {
        color: #888;
        font-size: 14px;
        line-height: 20px;
    }

    .purchaseMain li div.des {
        line-height: 30px;
        color: #fff;
        font-size: 16px;
        margin-bottom: 20px;
    }

    .purchaseMain li:last-child div.des {
        margin-bottom: 0;
    }

    .goBuyBtn {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    .goBuyBox {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .goBuyBox span {
        height: 40px;
        line-height: 40px !important;
        display: inline-block;
        color: #ccc;
        vertical-align: middle;
    }

    .timeOver {
        margin-left: 5px;
        padding: 0 10px;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .ticketNum {
        margin-right: 10px;
    }
</style>
<style>
    .performanceName div,
    .performanceName p {
        line-height: 30px;
    }

    .performanceName img {
        max-height: 500px;
        margin: 20px 0;
    }

    .goBuyBtn .buy.el-button.is-disabled {
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        background-color: rgba(250, 250, 250, 0.2) !important;
    }

    .showPrice {
        font-size: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .showPrice div {
        display: inline-block;
        font-size: 14px;
    }

    .showPrice .el-radio-group {
        flex: 1;
        line-height: 40px;
    }

    .showPrice .el-radio-button__inner {
        padding: 5px 10px;
        text-align: center;
        line-height: 20px;
        border-radius: 0 !important;
        border: 1px solid rgba(250, 250, 250, 0.2) !important;
        background-color: rgba(250, 250, 250, 0.2);
        color: #fff;
        cursor: pointer;
        outline: none;
    }

    .showPrice .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        outline: none;
        border: 1px solid #ccc !important;
        background-color: rgba(250, 250, 250, 0.2);
        box-shadow: none;
    }

    .showPrice .el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
        box-shadow: none;
    }

    .ticketNum .el-radio-button__inner:hover {
        color: #fff !important;
    }
</style>
