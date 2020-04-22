<template>
    <div class="mobileContentBox">
        <!--标题-->
        <div class="mobileHeadLine">
            <div class="mobileTitleText">{{$t('vipActivities.title')}}</div>
            <div class="mobileHeadLine_right">
                <img class="cursorPointer" @click="handlePrev" src="../../../../assets/img/common/data_02.png" alt="">
                <span class="number">{{formItem.year}}</span>
                <img class="cursorPointer" @click="handleNext" src="../../../../assets/img/common/data_01.png" alt="">
            </div>
        </div>
        <!--列表-->
        <div class="vip_activity_List">
            <div v-if="listData.length === 0" class="tableNotHasData flex_1">
                <img class="notData" src="../../../../assets/img/common/notData.png" alt="notData">
                <div class="notDataText">{{$t('public.notData')}}</div>
            </div>
            <el-row v-else :gutter="20" class="vip_activity_Item">
                <el-col :xs="24" :sm="12" :md="12" v-for="(item,index) in listData"
                        :key="index">
                    <div class="vip_activity_Content">
                        <div class="mask">
                            <div class="message_img positionRelative"
                                 :style="{backgroundImage:'url('+item.thumbnailStr+')'}">
                                <img class="widthAll visibilityHidden"
                                     src="../../../../assets/img/thumbnail_bg/vip_activity.png" alt="">
                                <div v-show="item.countdownFlag === true" class="vip_time">
                                    <span>抢票倒计时:</span>
                                    <span>{{item.countdown}}</span>
                                </div>
                            </div>
                            <div class="vip_activity_text">
                                <div class="text">{{item.activityTitle}}</div>
                                <div class="vipActivityDsc">
                                    <div class="time">{{item.activityTimeCN}}</div>
                                    <el-button class="btn" size="small" type="default"
                                               @click="vipDetails(item)">{{$t('vipActivities.rushToBuy')}}
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!--分页-->
        <div class="pageBox">
            <pages
                :total='options.total'
                :currentPage='options.currentPage'
                :page-size="options.pageSize"
                @handleSizeChangeSub="handleSizeChangeSub"
                @handleCurrentChangeSub="handleCurrentChange"/>
        </div>
    </div>
</template>

<script>
    import {dateFilterDayCN} from "../../../../assets/js/filters";

    export default {
        name: "VIP",
        data() {
            return {
                // 查询表单
                formItem: {
                    year: new Date().getFullYear(), //  年
                    isVip: false, // 是否vip
                },
                // 列表集合
                listData: [],
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
            }
        },
        methods: {
            // 下一年
            handleNext() {
                let _t = this;
                _t.formItem.year += 1;
                _t.options.currentPage = 1;
                _t.getData();
            },
            // 上一年
            handlePrev() {
                let _t = this;
                _t.formItem.year -= 1;
                _t.options.currentPage = 1;
                _t.getData();
            },
            // 改变当前页码
            handleCurrentChange(val) {
                let _t = this;
                _t.options.currentPage = val;
                _t.getData();
            },
            // 改变每页显示条数
            handleSizeChangeSub(val) {
                let _t = this;
                _t.options.pageSize = val;
                _t.getData();
            },
            // 跳转详情
            vipDetails(item) {
                let _t = this;
                // 路由跳转
                _t.$jump.toJumpPage('VIP_DETAILS', 'M_VIP_DETAILS', {
                    WJE_ACTIVITY_ID: item.id
                });
                localStorage.setItem('WJE_ACTIVITY_ID', item.id);
            },
            // 获取用户信息
            getUserInfo() {
                let _t = this;
                let userId = _t.getCookie('WJE_USER_ID');
                if (userId !== undefined && userId !== null && userId !== 'null') {
                    _t.$api.post('user/getById', {
                        id: userId
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 查询成功
                                if (res.data !== undefined && res.data !== null) {
                                    let resData = res.data;
                                    // 判断是否是vip
                                    if (resData.role !== undefined && resData.role !== null && (resData.role === 1 || resData.role === 2)) {
                                        _t.formItem.isVip = true;
                                        _t.getData();
                                    }
                                }
                                break;
                            default: // 查询失败
                                break;
                        }
                    });
                }
            },
            // 获取数据
            getData() {
                let _t = this;
                _t.$api.post('activity/activityList', {
                    limit: _t.options.pageSize,  // 每页显示条数
                    page: _t.options.currentPage, // 当前页码
                    isVipActivity: 1, // vip
                    year: _t.formItem.year, // 年
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'),
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            if (res.data !== undefined && res.data !== null) {
                                let resData = res.data.content !== undefined && res.data.content !== null ? res.data.content : [];
                                resData.forEach((item) => {
                                    // 初始化倒计时
                                    item.countdown = '';
                                    item.countdownFlag = false; // 是否显示倒计时
                                    // 处理时间
                                    if (item.activityTime !== undefined && item.activityTime !== null) {
                                        item.activityTimeCN = dateFilterDayCN(item.activityTime);
                                    } else {
                                        item.activityTimeCN = '';
                                    }
                                    // 处理缩略图
                                    if (item.thumbnail !== undefined && item.thumbnail !== null) {
                                        let thumbnail = item.thumbnail.split(',');
                                        // 显示横板缩略图 逗号后边
                                        if (thumbnail.length === 1) {
                                            // 没有横板 显示竖版
                                            item.thumbnailStr = _t.$api.imgUrl() + thumbnail[0];
                                        } else if (thumbnail.length === 2) {
                                            // 有横板显示横板
                                            item.thumbnailStr = _t.$api.imgUrl() + thumbnail[1];
                                        }
                                    }
                                    // 处理描述
                                    if (item.activityTitle === undefined || item.activityTitle === null) {
                                        item.activityTitle = '';
                                    }
                                    // 处理倒计时
                                    if (item.activitySession !== undefined && item.activitySession !== null) {
                                        // 当前时间
                                        let nowTime = new Date().getTime();
                                        // 判断当前时间是否超出活动时间
                                        if (nowTime <= item.activitySession * 1) {
                                            // 未超出显示倒计时
                                            // item.countdownFlag = true;
                                            // item.countdown = _t.TimeDown(nowTime, item.activitySession);
                                        }
                                    }
                                });
                                // 启动定时器
                                if (resData.length !== 0) {
                                    // _t.refreshPage();
                                }
                                _t.listData = resData;
                                _t.options.total = res.data.total !== undefined ? res.data.total : 0;
                            }
                            break;
                        default: // 查询失败
                            _t.listData = [];
                            _t.options.total = 0;
                            break;
                    }
                })
            },
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'VIP_VIP', 'M_VIP_VIP');
            if (jump === false) {
                _t.getUserInfo();
                // 调用父级的用户信息判断是否vip到期
                _t.$parent.getUserInfo();
            }
        }
    }
</script>

<style scoped>
    .vip_activity_Content {
        padding: 10px;
        margin-bottom: 20px;
        background: url("../../../../assets/img/common/mask_bg.png") repeat;
    }

    .vip_activity_Content .mask {
        padding: 10px;
        background-color: rgba(0, 0, 0, 0.3);
    }

    .vip_activity_text .text {
        font-size: 14px;
        margin: 10px 0 0;
        color: #9a9798;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .vipActivityDsc {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .vipActivityDsc .time {
        color: #9a9798;
        font-size: 12px;
    }
</style>
<style>
    .vipActivityDsc .el-button--small {
        border-radius: 0;
    }
</style>
