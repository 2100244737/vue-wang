<template>
    <div class="mobileMyOrder">
        <el-tabs class="myOrder_box" v-model="activeName">
            <el-tab-pane :label="$t('myorder.member')" name="first">
                <ul class="orderList marginBottom20">
                    <li v-if="MemberData.length === 0" class="tableNotHasData flex_1">
                        <img class="notData" src="../../../../assets/img/common/notData.png" alt="notData">
                        <div class="notDataText">{{$t('public.notData')}}</div>
                    </li>
                    <li class="hasData" v-for="(item,index) in MemberData" :key="index">
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.memberValidity')}}</div>
                            <div class="orderRight">
                                <span>{{item.openTime}}</span>
                                <span>-</span>
                                <span>{{item.stopTime}}</span>
                            </div>
                        </div>
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.state')}}</div>
                            <div class="orderRight">{{item.isTrue}}</div>
                        </div>
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.isHasGift')}}</div>
                            <div class="orderRight">{{item.isHasGift}}</div>
                        </div>
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.operationTime')}}</div>
                            <div class="orderRight">{{item.operationTime}}</div>
                        </div>
                    </li>
                </ul>
                <div class="pageBox">
                    <pages
                        :total='memberOptions.total'
                        :currentPage='memberOptions.currentPage'
                        :page-size="memberOptions.pageSize"
                        @handleSizeChangeSub="handleSizeChangeMemberSub"
                        @handleCurrentChangeSub="handleCurrentMemberChange"/>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('myorder.order')" name="second">
                <ul class="orderList marginBottom20">
                    <li v-if="tableData.length === 0" class="tableNotHasData flex_1">
                        <img class="notData" src="../../../../assets/img/common/notData.png" alt="notData">
                        <div class="notDataText">{{$t('public.notData')}}</div>
                    </li>
                    <li class="hasData" v-for="(item,index) in tableData" :key="index">
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.orderNumber')}}</div>
                            <div class="orderRight">{{item.orderId}}</div>
                        </div>
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.orderName')}}</div>
                            <div class="orderRight">{{item.activityTitle}}</div>
                        </div>
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.orderTime')}}</div>
                            <div class="orderRight">{{item.orderTime}}</div>
                        </div>
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.orderPrice')}}</div>
                            <div class="orderRight">{{item.orderPrice}}</div>
                        </div>
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.orderQuantity')}}</div>
                            <div class="orderRight">{{item.ticketCount}}</div>
                        </div>
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.orderIdcard')}}</div>
                            <div class="orderRight">{{item.userCarId}}</div>
                        </div>
                    </li>
                </ul>
                <div class="pageBox">
                    <pages
                        :total='options.total'
                        :currentPage='options.currentPage'
                        :page-size="options.pageSize"
                        @handleSizeChangeSub="handleSizeChangeSub"
                        @handleCurrentChangeSub="handleCurrentChange"/>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="$t('myorder.isNot')" name="third">
                <ul class="orderList marginBottom20">
                    <li v-if="isNotTableData.length === 0" class="tableNotHasData flex_1">
                        <img class="notData" src="../../../../assets/img/common/notData.png" alt="notData">
                        <div class="notDataText">{{$t('public.notData')}}</div>
                    </li>
                    <li class="hasData" v-for="(item,index) in isNotTableData" :key="index">
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.orderNumber')}}</div>
                            <div class="orderRight">{{item.orderId}}</div>
                        </div>
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.orderName')}}</div>
                            <div class="orderRight">{{item.activityTitle}}</div>
                        </div>
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.orderTime')}}</div>
                            <div class="orderRight">{{item.orderTime}}</div>
                        </div>
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.orderPrice')}}</div>
                            <div class="orderRight">{{item.orderPrice}}</div>
                        </div>
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.orderQuantity')}}</div>
                            <div class="orderRight">{{item.ticketCount}}</div>
                        </div>
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.orderIdcard')}}</div>
                            <div class="orderRight">{{item.userCarId}}</div>
                        </div>
                        <!--状态-->
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.status')}}</div>
                            <div class="orderRight">
                                <!--待支付-->
                                <span v-if="item.orderStatus !== undefined && item.orderStatus === 0">{{$t('myorder.unpaid')}}</span>
                                <!--超时取消支付-->
                                <span v-if="item.orderStatus !== undefined && item.orderStatus === 2">{{$t('myorder.timeout')}}</span>
                                <!--支付失败-->
                                <span v-if="item.orderStatus !== undefined && item.orderStatus === 3">{{$t('myorder.fail')}}</span>
                            </div>
                        </div>
                        <!--操作-->
                        <div class="orderItem">
                            <div class="orderLeft">{{$t('myorder.operation')}}</div>
                            <div class="orderRight">
                                <!--继续支付-->
                                <el-button
                                    v-if="item.orderStatus !== undefined && (item.orderStatus === 0 || item.orderStatus === 3)"
                                    @click="continueBtn(item)"
                                    size="small"
                                    type="default">{{$t('myorder.continue')}}
                                </el-button>
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="pageBox">
                    <pages
                        :total='isNotOptions.total'
                        :currentPage='isNotOptions.currentPage'
                        :page-size="isNotOptions.pageSize"
                        @handleSizeChangeSub="handleSizeChangeSubIsNot"
                        @handleCurrentChangeSub="handleCurrentChangeIsNot"/>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {dateFilter, dateFilterDayCN} from "../../../../assets/js/filters";
    import AESUtil from "../../../../config/crypto";

    export default {
        name: "MY_ORDER",
        data() {
            return {
                activeName: 'first',
                // 会员记录列表
                MemberData: [],
                // 会员记录分页
                memberOptions: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
                // 订单记录列表
                tableData: [],
                // 订单记录分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
                // 查询表单
                formItem: {
                    userId: this.getCookie('WJE_USER_ID'), // 用户Id
                },
                // 未完成订单记录
                isNotTableData: [],
                // 未完成订单记录分页
                isNotOptions: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                }
            }
        },
        methods: {
            // 改变当前页码
            handleCurrentMemberChange(val) {
                let _t = this;
                _t.memberOptions.currentPage = val;
                _t.getData();
            },
            // 改变每页显示条数
            handleSizeChangeMemberSub(val) {
                let _t = this;
                _t.memberOptions.pageSize = val;
                _t.getData();
            },
            // 获取会员记录列表
            getData() {
                let _t = this;
                if (_t.formItem.userId !== null && _t.formItem.userId !== 'null') {
                    _t.$api.post('viporders/getVipOrdersByUserId', {
                        releaseId: _t.formItem.userId, // 用户id
                        page: _t.memberOptions.currentPage, // 当前页
                        limit: _t.memberOptions.pageSize, // 每页显示条数
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 查询成功
                                let resData = res.data.content !== undefined && res.data.content !== null ? res.data.content : [];
                                resData.forEach((item) => {
                                    // 是否需要入会礼
                                    if (item.giftOrNot !== undefined && item.giftOrNot !== null) {
                                        item.isHasGift = item.giftOrNot === 1 ? _t.$t('public.yes') : _t.$t('public.no');
                                    } else {
                                        item.isHasGift = _t.$t('public.no');
                                    }
                                    // 会员有效期
                                    if (item.openTime !== undefined && item.openTime !== null) {
                                        item.openTime = dateFilterDayCN(item.openTime);
                                    }
                                    // 处理结束时间
                                    if (item.stopTime !== undefined && item.stopTime !== null) {
                                        item.stopTime = dateFilterDayCN(item.stopTime);
                                    }
                                    // 处理操作时间
                                    if (item.operationTime !== undefined && item.operationTime !== null) {
                                        item.operationTime = dateFilter(item.operationTime);
                                    }
                                    // 是否充值成功
                                    item.isTrue = _t.$t('public.yes'); // 默认全部充值成功
                                });
                                _t.MemberData = resData;
                                _t.memberOptions.options = res.data.total !== undefined && res.data.total !== null ? res.data.total : 0;
                                break;
                            case 204: // 记录为空
                                _t.MemberData = [];
                                _t.memberOptions.options = 0;
                                break;
                            default: // 查询失败
                                _t.$message.error(_t.$t('public.queryError'));
                                break;
                        }
                    });
                } else {
                    _t.$message.error(_t.$t('public.isNotExist'));
                }
            },
            // 改变当前页码
            handleCurrentChange(val) {
                let _t = this;
                _t.options.currentPage = val;
                _t.getUserOrder();
            },
            // 改变每页显示条数
            handleSizeChangeSub(val) {
                let _t = this;
                _t.options.pageSize = val;
                _t.getUserOrder();
            },
            // 查询个人订单信息
            getUserOrder() {
                let _t = this;
                if (_t.formItem.userId !== null && _t.formItem.userId !== 'null') {
                    _t.$api.post('order/getOrders', {
                        releaseId: _t.formItem.userId, // 用户id
                        orderType: 1, // 1:完成 2:未完成
                        page: _t.options.currentPage, // 当前页
                        limit: _t.options.pageSize, // 每页显示条数
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 查询成功
                                // 获取用户订单
                                let resData = res.data.content !== undefined && res.data.content !== null ? res.data.content : [];
                                resData.forEach((item) => {
                                    // 处理下单时间
                                    if (item.orderTime !== undefined && item.orderTime !== null) {
                                        item.orderTime = dateFilter(item.orderTime);
                                    }
                                    // 处订单总金额
                                    if (item.orderPrice !== undefined && item.orderPrice !== null) {
                                        if (item.orderPrice.toString() !== '0') {
                                            item.orderPrice = item.orderPrice / 100;
                                        }
                                    }
                                });
                                _t.tableData = resData;
                                _t.options.total = res.data.total !== undefined && res.data.total !== null ? res.data.total : 0;
                                break;
                            case 204: // 暂无记录
                                _t.tableData = [];
                                _t.options.total = 0;
                                break;
                            default: // 查询失败
                                _t.$message.error(_t.$t('public.queryError'));
                                break;
                        }
                    });
                } else {
                    _t.$message.error(_t.$t('public.isNotExist'));
                }
            },
            // 改变当前页码
            handleCurrentChangeIsNot(val) {
                let _t = this;
                _t.options.currentPage = val;
                _t.getUserOrder();
            },
            // 改变每页显示条数
            handleSizeChangeSubIsNot(val) {
                let _t = this;
                _t.options.pageSize = val;
                _t.getUserOrder();
            },
            // 查询未完成订单列表
            getIsNotData() {
                let _t = this;
                if (_t.formItem.userId !== null && _t.formItem.userId !== 'null') {
                    _t.$api.post('order/getOrders', {
                        releaseId: _t.formItem.userId, // 用户id
                        orderType: 2, // 1:完成 2:未完成
                        page: _t.isNotOptions.currentPage, // 当前页
                        limit: _t.isNotOptions.pageSize, // 每页显示条数
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 查询成功
                                let resData = res.data.content !== undefined && res.data.content !== null ? res.data.content : [];
                                resData.forEach((item) => {
                                    // 处理下单时间
                                    if (item.orderTime !== undefined && item.orderTime !== null) {
                                        item.orderTime = dateFilter(item.orderTime);
                                    }
                                    // 处订单总金额
                                    if (item.orderPrice !== undefined && item.orderPrice !== null) {
                                        if (item.orderPrice.toString() !== '0') {
                                            item.orderPrice = item.orderPrice / 100;
                                        }
                                    }
                                });
                                _t.isNotTableData = resData;
                                _t.isNotOptions.total = res.data.total !== undefined && res.data.total !== null ? res.data.total : 0;
                                break;
                            case 204: // 暂无记录
                                _t.isNotTableData = [];
                                _t.isNotOptions.total = 0;
                                break;
                            default: // 查询出错
                                _t.$message.error(_t.$t('public.queryError'));
                                break;
                        }
                    });
                } else {
                    _t.$message.error(_t.$t('public.isNotExist'));
                }
            },
            // 继续支付
            continueBtn(item) {
                let _t = this;
                _t.$jump.toJumpPage('VIP_ORDER', 'M_VIP_ORDER', {
                    VIP_ACTIVITY_ORDER_ID: AESUtil.encrypt(item.activityId),
                    VIP_ORDER_ID: AESUtil.encrypt(item.orderId)
                });
                localStorage.setItem("WJE_VIP_ACTIVITY_ORDER_ID", AESUtil.encrypt(item.activityId));
                localStorage.setItem("WJE_VIP_ORDER_ID", AESUtil.encrypt(item.orderId));
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'MY_ORDER', 'M_MY_ORDER');
            if (jump === false) {
                // 判断从支付状态进来的是标识
                let statusActive = _t.$route.params.WJE_PAY_WAY_INFO !== undefined ? _t.$route.params.WJE_PAY_WAY_INFO : null;
                if (statusActive !== undefined && statusActive !== null) {
                    _t.activeName = statusActive;
                }
                // 获取会员记录列表数据
                _t.getData();
                // 获取订单记录
                _t.getUserOrder();
                // 查询未完成订单记录
                _t.getIsNotData();
            }
        }
    }
</script>

<style scoped>
    .mobileMyOrder {
        width: 95%;
        margin: 0 auto;
        padding-bottom: 5%;
    }

    .orderList li .orderItem {
        font-size: 14px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        color: #ddd;
    }

    .orderList li .orderItem > div {
        line-height: 30px;
    }

    .orderList li {
        padding: 10px 0;
        border-bottom: 1px solid #4d4d4d;
    }

    .orderList li.isNotData {
        padding: 10px 0 35px;
        text-align: center;
        font-size: 12px;
        color: #4d4d4d;
    }

    .orderList li.hasData:first-child {
        padding-top: 0;
    }
</style>
<style>
    .mobileMyOrder .el-tabs__item {
        font-size: 18px;
        padding: 0 10px;
        height: 30px !important;
        line-height: 30px !important;
        color: #fff !important;
    }

    .mobileMyOrder .el-tabs__active-bar {
        background-color: #fff;
        height: 2px;
    }

    .mobileMyOrder .el-tabs__nav-wrap::after {
        width: 100%;
        height: 1px;
        background-color: #4d4d4d;
    }

    .mobileMyOrder .el-tabs__header {
        margin-bottom: 20px;
    }

    .myOrder_box {

    }
</style>
