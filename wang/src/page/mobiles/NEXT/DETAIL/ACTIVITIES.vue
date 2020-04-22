<template>
    <!--内容区域-->
    <div class="mobileContentBox">
        <div class="mobileHeadLine">
            <div class="mobileTitleText">{{$t('whatNextActivity.title')}}</div>
            <div class="mobileHeadLine_right">
                <img class="cursorPointer" @click="handlePrev" src="../../../../assets/img/common/data_02.png"
                     alt="">
                <span class="number">{{formItem.year}}</span>
                <img class="cursorPointer" @click="handleNext" src="../../../../assets/img/common/data_01.png"
                     alt="">
            </div>
        </div>
        <div class="newsTheme">
            <div v-if="activeData.length === 0" class="tableNotHasData flex_1">
                <img class="notData" src="../../../../assets/img/common/notData.png" alt="notData">
                <div class="notDataText">{{$t('public.notData')}}</div>
            </div>
            <div v-else class="ActivityList" v-for="(item,index) in activeData" :key="index">
                <div class="imgLeft message_img cursorPointer" :style="{backgroundImage:'url('+ item.thumbnail +')'}"
                     @click="imgShow(item)">
                    <!--撑起图片背景-->
                    <img class="widthAll visibilityHidden" src="../../../../assets/img/thumbnail_bg/activityThumbnail.png"
                         alt="bg">
                </div>
                <div @click="details(item)" class="activityContents">
                    <p class="title">{{item.activityTitle}}</p>
                    <p class="time">{{item.activityTime}}</p>
                    <p>{{item.activityPurpose}}</p>
                </div>
            </div>
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
        <!--图片详情-->
        <el-dialog
            class="imgDialog"
            :show-close="true"
            width="95%"
            :visible.sync="dialogVisibles"
            append-to-body
            :before-close="resetImg">
            <img class="widthAll" :src="imgs">
        </el-dialog>
    </div>
</template>

<script>
    import {dateFilterDayCN} from "../../../../assets/js/filters";

    export default {
        name: "ACTIVITIES",
        data() {
            return {
                // 查询表单
                formItem: {
                    year: new Date().getFullYear()
                },
                //图片详情
                imgs: '',
                dialogVisibles: false,//图片蒙版
                // 列表数据
                activeData: [],
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 10, // 显示条数
                },
            }
        },
        methods: {
            //点击图片放大
            imgShow(item) {
                let _t = this;
                _t.dialogVisibles = true;
                _t.imgs = item.thumbnail
            },
            // 点击关闭图片蒙版
            resetImg() {
                let _t = this;
                _t.dialogVisibles = false;
                _t.imgs = '';
            },
            // 点击展开收起
            clickBtn(item, flag) {
                let _t = this;
                if (flag === 'open') {
                    item.isAll = true;
                    item.activityContentCache = item.activityContent;
                } else {
                    item.isAll = false;
                    item.activityContentCache = item.activityContent.substr(0, item.codeLength) + '...';
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
                    defaultVisible: 0, // 0: 普通用户 1: vip
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'), // 语言
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
                _t.$jump.toJumpPage('ACTIVITIES_DETAILS', 'M_ACTIVITIES_DETAILS', {
                    WJE_ACTIVITIES_ID: item.id
                });
                localStorage.setItem('WJE_ACTIVITIES_ID', item.id);
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'ACTIVITIES', 'M_ACTIVITIES');
            if (jump === false) {
                _t.getData();
            }
        }
    }
</script>

<style scoped>
    .ActivityList {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: start;
        border-bottom: 1px solid #2c2c2c;
        padding: 5% 0;
    }

    .ActivityList:first-child {
        padding-top: 0;
    }

    .imgLeft {
        flex: 1;
        margin-right: 10px;
    }

    .activityContents {
        flex: 2;
    }

    .activityContents p {
        font-size: 12px;
        line-height: 20px;
        color: #a2a2a2;
    }

    .activityContents p.title {
        font-size: 14px;
        color: #fff;
    }

    .activityContents p.time {
        color: #a2a2a2;
        font-size: 12px;
    }
</style>
