<template>
    <!--新闻列表-->
    <div class="mobileContentBox">
        <!--标题及年份-->
        <div class="mobileHeadLine">
            <div class="mobileTitleText">{{$t('whatNextNews.title')}}</div>
            <div class="mobileHeadLine_right">
                <img class="cursorPointer" @click="handlePrev"
                     src="../../../../assets/img/common/data_02.png" alt="">
                <span class="number">{{formItem.year}}</span>
                <img class="cursorPointer" @click="handleNext"
                     src="../../../../assets/img/common/data_01.png" alt="">
            </div>
        </div>
        <div v-if="newsList.length === 0" class="tableNotHasData flex_1">
            <img class="notData" src="../../../../assets/img/common/notData.png" alt="notData">
            <div class="notDataText">{{$t('public.notData')}}</div>
        </div>
        <el-row v-else class="newsList" :gutter="20">
            <el-col :xs="24 " :sm="12" :md="12"
                    v-for="(item,index) in newsList"
                    :key="index">
                <div @click="clickDetail(item)">
                    <div class="news-print message_img" :style="{backgroundImage:'url('+item.thumbnail+')'}">
                        <!--撑起图片背景-->
                        <img class="widthAll visibilityHidden" src="../../../../assets/img/thumbnail_bg/newsThumbnail.png"
                             alt="bg">
                    </div>
                    <div class="article">
                        <p class="taglines">{{item.newsTitle}}</p>
                        <div class="content">{{item.newsDescribed}}</div>
                        <p class="time">{{item.newsTime }}</p>
                    </div>
                </div>
            </el-col>
        </el-row>
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
        name: "NEWS",
        data() {
            return {
                // 查询表单
                formItem: {
                    year: new Date().getFullYear()
                },
                // 列表数据
                newsList: [],
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 4, // 显示条数
                },
            }
        },
        methods: {
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
            // 获取数据
            getData() {
                let _t = this;
                _t.$api.post('news/newsList', {
                    year: _t.formItem.year, // 选中的年
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'), // 语言
                    page: _t.options.currentPage, // 当前页
                    limit: _t.options.pageSize, // 每页显示的条数
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            let newsList = res.data.content !== null ? res.data.content : [];
                            newsList.forEach((item) => {
                                // 处理缩略图
                                if (item.thumbnail !== null && item.thumbnail !== '') {
                                    item.thumbnail = _t.$api.imgUrl() + item.thumbnail;
                                }
                                // 处理时间戳
                                if (item.newsTime !== undefined && item.newsTime !== null) {
                                    item.newsTime = dateFilterDayCN(item.newsTime);
                                }
                            });
                            _t.newsList = newsList;
                            _t.options.total = res.data.total !== undefined ? res.data.total : 0;
                            break;
                        default:
                            _t.newsList = [];
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
            // 查看详情
            clickDetail(item) {
                let _t = this;
                _t.$jump.toJumpPage('NEWS_DETAILS', 'M_NEWS_DETAILS', {
                    WJE_NEWS_ID: item.id
                });
                localStorage.setItem('WJE_NEWS_ID', item.id);
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'NEWS', 'M_NEWS');
            if (jump === false) {
                _t.getData();
            }
        }
    }
</script>

<style scoped>
    .article {
        padding: 15px 0;
    }

    .article .taglines {
        color: #fff;
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .article .content {
        color: #a2a2a2;
        font-size: 12px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .article .time {
        color: #a2a2a2;
        font-size: 14px;
        height: 20px;
    }
</style>
