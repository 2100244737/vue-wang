<template>
    <div class="vipActivities">
        <!--标题-->
        <div class="headline">
            <div class="titleText">
                <span class="word">{{$t('vipActivities.title')}}</span>
            </div>
            <div class="headline-right">
                <img class="img pointer" @click="handlePrev" src="../../../../assets/img/common/data_02.png" alt="">
                <span class="number">{{formItem.year}}</span>
                <img class="img pointer" @click="handleNext" src="../../../../assets/img/common/data_01.png" alt="">
            </div>
        </div>
        <!--列表-->
        <div class="vip_activity_List">
            <div v-if="listData.length === 0" class="tableNotHasData">
                <img class="notData" src="../../../../assets/img/common/notData.png" alt="notData">
                <div class="notDataText">{{$t('public.notData')}}</div>
            </div>
            <div class="vip_activity_Item" v-for="(item,index) in listData" :key="index">
                <div class="vip_activity_Details">
                    <div class="vip_activity_Content">
                        <div class="message_img positionRelative"
                             :style="{backgroundImage:'url('+item.thumbnailStr+')'}">
                            <img class="widthAll visibilityHidden"
                                 src="../../../../assets/img/thumbnail_bg/vip_activity.png" alt="">
                        </div>
                        <div class="vip_activity_text">
                            <div class="text">{{item.activityTitle}}</div>
                            <div class="dsc clearFix">
                                <span class="time fl">{{item.activityTimeCN}}</span>
                                <span class="btn fr" @click="vipDetails(item)">{{$t('vipActivities.rushToBuy')}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--分页-->
        <pages
            :total='options.total'
            :currentPage='options.currentPage'
            :page-size="options.pageSize"
            @handleSizeChangeSub="handleSizeChangeSub"
            @handleCurrentChangeSub="handleCurrentChange"/>
    </div>
</template>

<script>
    import {dateFilterDayCN} from "../../../../assets/js/filters";

    export default {
        name: 'VIP',
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
                                    // 处理时间
                                    if (item.activityTime !== undefined && item.activityTime !== null) {
                                        item.activityTimeCN = dateFilterDayCN(item.activityTime);
                                    } else {
                                        item.activityTimeCN = '';
                                    }
                                    // 处理图片
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
                                });
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
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'VIP_VIP', 'M_VIP_VIP');
            if (jump === false) {
                _t.getUserInfo();
                // 调用父级加载二级菜单选中项
                _t.$parent.dealWith();
                // 调用父级的用户信息判断是否vip到期
                _t.$parent.getUserInfo();
            }
        },
    }
</script>

<style scoped>
    .vipActivities {
        background: #0b0b0b;
        padding: 50px 130px;
    }

    .headline {
        position: relative;
        margin: 0 auto;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        line-height: 50px;
    }

    .headline-right {
        display: inline-block;
        font-size: 0;
    }

    .number {
        font-size: 16px;
        vertical-align: middle;
        padding: 0 15px;
    }

    .titleText {
        font-size: 30px;
    }

    .word {
        border-bottom: 5px solid #e4e4e4;
        padding-bottom: 5px;
    }

    .vip_activity_List {
        margin: 50px auto 0;
    }

    .vip_activity_Item {
        width: 50%;
        box-sizing: border-box;
        padding: 0 15px;
        display: inline-block;
    }

    .vip_activity_Item:nth-child(2n) {
        padding-right: 0;
    }

    .vip_activity_Item:nth-child(2n + 1) {
        padding-left: 0;
    }

    .vip_activity_Details {
        background: url('../../../../assets/img/common/mask_bg.png') repeat;
        padding: 20px;
        margin-bottom: 30px;
    }

    .vip_activity_Content {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .3);
    }

    .text {
        color: #9a9798;
        font-size: 14px;
        margin: 20px 20px 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .dsc {
        margin-left: 20px;
    }

    .time {
        color: #9a9798;
        height: 40px;
        line-height: 40px;
        display: inline-block;
    }

    .btn {
        cursor: pointer;
        color: #6d757b;
        border: 1px solid #7e7e7e;
        margin-right: 20px;
        padding: 10px 15px;
        margin-bottom: 15px;
    }

    .vip_time {
        position: absolute;
        bottom: 10px;
        right: 20px;
    }
</style>
