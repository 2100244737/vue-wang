<template>
    <!--保密公告-->
    <div class="confidentiality">
        <el-tabs class="userTitle" v-model="formItem.activeName">
            <!--vip活动公告-->
            <el-tab-pane :label="$t('vipLimit.activity')" name="first">
                <!--标题-->
                <div class="newsTitle">
                    <img class="cursorPointer" @click="handlePrev" src="../../../../assets/img/common/data_02.png"
                         alt="">
                    <span class="number">{{formItem.year}}</span>
                    <img class="cursorPointer" @click="handleNext" src="../../../../assets/img/common/data_01.png"
                         alt="">
                </div>
                <!--内容-->
                <div class="newsTheme">
                    <div v-if="activeData.length === 0" class="tableNotHasData flex_1">
                        <img class="notData" src="../../../../assets/img/common/notData.png" alt="notData">
                        <div class="notDataText">{{$t('public.notData')}}</div>
                    </div>
                    <div class="ActivityList" v-for="(item,index) in activeData" :key="index">
                        <div class="message_img cursorPointer" :style="{backgroundImage:'url('+item.thumbnail+')'}"
                             @click="imgShow(item)">
                            <!--撑起图片背景-->
                            <img class="visibilityHidden"
                                 src="../../../../assets/img/thumbnail_bg/activityThumbnail.png"
                                 alt="bg">
                        </div>
                        <div @click="details(item)" class="activityContents">
                            <p class="title">{{item.activityTitle}}</p>
                            <p>{{item.activityTime}}</p>
                            <div class="Collapse">
                                {{item.activityPurpose}}
                            </div>
                        </div>
                    </div>
                </div>
                <!--分页-->
                <div class="page">
                    <pages
                        :total='options.total'
                        :currentPage='options.currentPage'
                        :page-size="options.pageSize"
                        @handleSizeChangeSub="handleSizeChangeSub"
                        @handleCurrentChangeSub="handleCurrentChange"/>
                </div>
            </el-tab-pane>
            <!--用户公告-->
            <el-tab-pane :label="$t('vipLimit.title')" name="second">
                <div v-show="contentText === '' || contentText === null" class="tableNotHasData flex_1">
                    <img class="notData" src="../../../../assets/img/common/notData.png" alt="notData">
                    <div class="notDataText">{{$t('public.notData')}}</div>
                </div>
                <div v-show="contentText !== '' && contentText !== null" class="notice">
                    <div id="contentBox" class="content"></div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!--图片详情-->
        <el-dialog
            class="imgDialog"
            :show-close="false"
            :visible.sync="dialogVisible"
            append-to-body
            :before-close="resetImg">
            <img class="widthAll" :src="formItem.imgUrl">
        </el-dialog>
    </div>
</template>

<script>
    import {dateFilterDayCN} from "../../../../assets/js/filters";

    export default {
        name: 'CONFIDENTIAL',
        data() {
            return {
                // 查询表单
                formItem: {
                    activeName: 'first', // 标签页
                    year: new Date().getFullYear(), // 活动公告年份
                    userId: this.getCookie('WJE_USER_ID'), // 用户id
                    imgUrl: '', // 图片详情
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'),
                },
                dialogVisible: false, // 图片蒙版
                // 列表数据
                activeData: [],
                contentText: '', // 保密公告内容
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
            }
        },
        methods: {
            // 点击图片放大
            imgShow(item) {
                let _t = this;
                _t.dialogVisible = true;
                _t.formItem.imgUrl = item.thumbnail
            },
            // 点击关闭图片蒙版
            resetImg() {
                let _t = this;
                _t.dialogVisible = false;
                _t.formItem.imgUrl = '';
            },
            // 获取保密协议内容
            getKeep() {
                let _t = this;
                _t.$api.post('vip/getConfidentiality', {
                    vipId: '2', // 0: 注册 1: 支付 2: 保密公告
                    language: _t.formItem.language
                }, (res) => {
                    switch (res.status) {
                        case 200:
                            if (res.data !== null && res.data.length !== 0) {
                                let contentText = res.data[0].ConfidentialNoticeContextStr !== undefined ? res.data[0].ConfidentialNoticeContextStr : '';
                                contentText = contentText.replace(/\r\n|\n/gi, '<br/>');
                                _t.contentText = contentText;
                                _t.$nextTick(function () {
                                    if (document.getElementById('contentBox')) {
                                        document.getElementById('contentBox').innerHTML = contentText;
                                    }
                                });
                            }
                            break;
                        case 204:
                            break;
                        default:
                            _t.$message.error(_t.$t('public.queryError'));
                            break;
                    }
                })
            },
            // 获取用户信息
            getUserInfo() {
                let _t = this;
                if (_t.formItem.userId !== undefined && _t.formItem.userId !== null && _t.formItem.userId !== 'null') {
                    _t.$api.post('user/getById', {
                        id: _t.formItem.userId, // 用户id
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 查询成功
                                if (res.data !== undefined && res.data !== null) {
                                    let resData = res.data;
                                    // 判断是否是vip
                                    if (resData.role !== undefined && resData.role !== null && (resData.role === 1 || resData.role === 2)) {
                                        _t.getKeep();
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
            //  新闻年月++
            handleNext() {
                let _t = this;
                _t.formItem.year += 1;
                _t.options.currentPage = 1;
                _t.getData();
            },
            //  新闻年月--
            handlePrev() {
                let _t = this;
                _t.formItem.year -= 1;
                _t.options.currentPage = 1;
                _t.getData();
            },
            // 活动查询接口
            getData() {
                let _t = this;
                _t.$api.post('activity/activityList', {
                    page: _t.options.currentPage, // 当前页
                    limit: _t.options.pageSize, // 每页显示条数
                    year: _t.formItem.year, // 年份
                    isVipActivity: 0, // 是否vip
                    defaultVisible: 1, // 0: 普通用户 1: vip
                    language: _t.formItem.language, // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            let activeData = res.data.content !== null ? res.data.content : [];
                            activeData.forEach((item) => {
                                // 转换日期
                                if (item.activityTime !== undefined && item.activityTime !== '') {
                                    item.activityTime = dateFilterDayCN(item.activityTime);
                                }
                                // 处理缩略图
                                if (item.thumbnail !== undefined && item.thumbnail !== null) {
                                    item.thumbnail = _t.$api.imgUrl() + item.thumbnail;
                                }
                            });
                            _t.activeData = activeData;
                            _t.options.total = res.data.total !== undefined ? res.data.total : 0;
                            break;
                        default:
                            _t.activeData = [];
                            _t.options.total = 0;
                            break;
                    }
                });
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
            // 跳转活动详情页
            details(item) {
                let _t = this;
                _t.$jump.toJumpPage('VIP_ACTIVITY_DETAIL', 'M_VIP_ACTIVITY_DETAIL', {
                    WJE_VIP_ACTIVITIES_ID: item.id
                });
                localStorage.setItem('WJE_VIP_ACTIVITIES_ID', item.id);
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'CONFIDENTIAL', 'M_CONFIDENTIAL');
            if (jump === false) {
                _t.getUserInfo();
                // 调用父级加载二级菜单选中项
                _t.$parent.dealWith();
                // 调用父级的用户信息判断是否vip到期
                _t.$parent.getUserInfo();
            }
        }
    }
</script>

<style scoped>
    .confidentiality {
        padding: 50px 130px;
        color: #afafaf;
        background: #0b0b0b;
    }

    .notice {
        margin: 30px auto 0;
        padding: 16px;
        background: url("../../../../assets/img/common/mask_bg.png") repeat;
    }

    .content {
        background-color: rgba(0, 0, 0, .3);
        padding: 20px;
        font-size: 14px;
        line-height: 24px;
    }

    .newsTitle {
        text-align: right;
        font-size: 0;
    }

    .newsTitle .number {
        font-size: 16px;
        padding: 0 15px;
        vertical-align: middle;
    }

    .ActivityList {
        display: flex;
        align-items: flex-start;
        border-bottom: 1px solid #2f2f2f;
        padding-bottom: 40px;
        margin-top: 37px;
        color: #fff;
    }

    .activityContents {
        flex: 1;
        margin-left: 30px;
        cursor: pointer;
    }

    .activityContents .title {
        font-size: 18px;
        margin-bottom: 15px;
    }

    .Collapse {
        margin-top: 15px;
        font-size: 14px;
        color: #a2a2a2;
        line-height: 20px;
        cursor: pointer;
    }
</style>
<style>
    .userTitle .el-tabs__nav-wrap::after {
        height: 0;
    }

    .userTitle .el-tabs__item {
        font-size: 18px !important;
        height: 40px;
        color: #fff !important;
        padding: 0 10px !important;
    }

    .userTitle .el-tabs__item.is-active {
        color: #fff !important;
    }

    .userTitle .el-tabs__active-bar {
        background-color: #fff !important;
        height: 3px;
    }
</style>
