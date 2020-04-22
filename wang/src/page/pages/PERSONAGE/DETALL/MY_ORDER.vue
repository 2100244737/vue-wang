<template>
    <div class="myOrder">
        <el-tabs class="myOrder_box" v-model="activeName">
            <el-tab-pane :label="$t('myorder.member')" name="first">
                <el-table :empty-text="$t('public.notData')" class="tableBox" :data="MemberData">
                    <el-table-column :label="$t('myorder.memberValidity')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <div :title="scope.row.openTime + '-' + scope.row.stopTime">
                                <span>{{scope.row.openTime}}</span>
                                <span>-</span>
                                <span>{{scope.row.stopTime}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('myorder.state')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :title="scope.row.isTrue">{{scope.row.isTrue}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('myorder.isHasGift')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :title="scope.row.isHasGift">{{scope.row.isHasGift}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('myorder.operationTime')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :title="scope.row.operationTime">{{scope.row.operationTime}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pages
                    :total='memberOptions.total'
                    :currentPage='memberOptions.currentPage'
                    :page-size="memberOptions.pageSize"
                    @handleSizeChangeSub="handleSizeChangeMemberSub"
                    @handleCurrentChangeSub="handleCurrentMemberChange"/>
            </el-tab-pane>
            <el-tab-pane :label="$t('myorder.order')" name="second">
                <el-table :empty-text="$t('public.notData')" class="tableBox" :data="tableData">
                    <el-table-column :label="$t('myorder.orderNumber')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :title="scope.row.orderId">{{scope.row.orderId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('myorder.orderName')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :title="scope.row.activityTitle">{{scope.row.activityTitle}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('myorder.orderTime')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :title="scope.row.orderTime">{{scope.row.orderTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" :label="$t('myorder.orderPrice')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :title="scope.row.orderPrice">{{scope.row.orderPrice}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="100" :label="$t('myorder.orderQuantity')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :title="scope.row.ticketCount">{{scope.row.ticketCount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('myorder.orderIdcard')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :title="scope.row.userCarId">{{scope.row.userCarId}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <pages
                    :total='options.total'
                    :currentPage='options.currentPage'
                    :page-size="options.pageSize"
                    @handleSizeChangeSub="handleSizeChangeSub"
                    @handleCurrentChangeSub="handleCurrentChange"/>
            </el-tab-pane>
            <el-tab-pane :label="$t('myorder.isNot')" name="third">
                <el-table :empty-text="$t('public.notData')" class="tableBox" :data="isNotTableData">
                    <el-table-column :label="$t('myorder.orderNumber')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :title="scope.row.orderId">{{scope.row.orderId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('myorder.orderName')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :title="scope.row.activityTitle">{{scope.row.activityTitle}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('myorder.orderTime')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :title="scope.row.orderTime">{{scope.row.orderTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" :label="$t('myorder.orderPrice')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :title="scope.row.orderPrice">{{scope.row.orderPrice}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="100" :label="$t('myorder.orderQuantity')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :title="scope.row.ticketCount">{{scope.row.ticketCount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('myorder.orderIdcard')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <span :title="scope.row.userCarId">{{scope.row.userCarId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="150" :label="$t('myorder.status')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <!--待支付-->
                            <span v-if="scope.row.orderStatus !== undefined && scope.row.orderStatus === 0" :title="$t('myorder.unpaid')">{{$t('myorder.unpaid')}}</span>
                            <!--超时取消支付-->
                            <span v-if="scope.row.orderStatus !== undefined && scope.row.orderStatus === 2" :title="$t('myorder.timeout')">{{$t('myorder.timeout')}}</span>
                            <!--支付失败-->
                            <span v-if="scope.row.orderStatus !== undefined && scope.row.orderStatus === 3" :title="$t('myorder.fail')">{{$t('myorder.fail')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('myorder.operation')" header-align="center" align="center">
                        <template slot-scope="scope">
                            <!--继续支付-->
                            <el-button
                                v-if="scope.row.orderStatus !== undefined && (scope.row.orderStatus === 0 || scope.row.orderStatus === 3)"
                                @click="continueBtn(scope.row)"
                                size="small"
                                type="default">
                                {{$t('myorder.continue')}}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pages
                    :total='isNotOptions.total'
                    :currentPage='isNotOptions.currentPage'
                    :page-size="isNotOptions.pageSize"
                    @handleSizeChangeSub="handleSizeChangeSubIsNot"
                    @handleCurrentChangeSub="handleCurrentChangeIsNot"/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {dateFilter, dateFilterDayCN} from "../../../../assets/js/filters";
    import AESUtil from "../../../../config/crypto";

    export default {
        name: 'MY_ORDER',
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
                                _t.memberOptions.total = res.data.total !== undefined && res.data.total !== null ? res.data.total : 0;
                                break;
                            case 204: // 记录为空
                                _t.MemberData = [];
                                _t.memberOptions.total = 0;
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
                            default: // 查询出错
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
                // 调用父级二级导航选中态
                _t.$parent.dealWith();
            }
        }
    }
</script>

<style scoped>
    .myOrder {
        padding: 50px 130px;
    }
</style>
<style>
    .myOrder .el-tabs__item {
        font-size: 22px;
        color: #fff !important;
        height: 46px;
    }

    .myOrder .el-tabs__active-bar {
        background-color: #fff;
        height: 5px;
    }

    .myOrder .el-tabs__nav-wrap::after {
        width: 0;
        height: 0;
    }

    .myOrder .el-tabs__header {
        margin-bottom: 20px;
    }

    .myOrder .el-table--border::after,
    .myOrder .el-table--group::after {
        background-color: #333;
    }

    .myOrder .el-table::before {
        height: 0 !important;
    }

    .myOrder .el-table td,
    .myOrder .el-table th.is-leaf {
        border-bottom: 1px solid #333 !important;
        height: 50px;
        padding: 0;
        line-height: 50px;
    }
</style>
