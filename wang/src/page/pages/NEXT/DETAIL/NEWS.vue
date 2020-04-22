<template>
    <!--新闻列表-->
    <div class="contentNews">
        <div class="newsTheme">
            <div class="newsTitle">
                <span class="newsText">{{$t('whatNextNews.title')}}</span>
                <div class="headline-right">
                    <img class="img cursorPointer" @click="handlePrev"
                         src="../../../../assets/img/common/data_02.png" alt="">
                    <span class="marginLR15">{{formItem.year}}</span>
                    <img class="img cursorPointer" @click="handleNext"
                         src="../../../../assets/img/common/data_01.png" alt="">
                </div>
            </div>
            <div class="newsList" :class="newsList.length === 0 ? '' : 'newsListTop'">
                <div v-if="newsList.length === 0" class="tableNotHasData flex_1">
                    <img class="notData" src="../../../../assets/img/common/notData.png" alt="notData">
                    <div class="notDataText">{{$t('public.notData')}}</div>
                </div>
                <div class="newsItem"
                     v-for="(item,index) in newsList"
                     :key="index"
                     @click="clickDetail(item)">
                    <div class="message_img" :style="{backgroundImage:'url('+item.thumbnail+')'}">
                        <!--撑起图片背景-->
                        <img class="widthAll visibilityHidden" src="../../../../assets/img/thumbnail_bg/newsThumbnail.png"
                             alt="bg">
                    </div>
                    <div class="article">
                        <p class="tagLines textNoWarp">{{item.newsTitle}}</p>
                        <div class="content textNoWarp">{{item.newsDescribed}}</div>
                        <p class="time">{{item.newsTime }}</p>
                    </div>
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
    </div>
</template>

<script>
    import {dateFilterDayCN} from "../../../../assets/js/filters";

    export default {
        name: 'NEWS',
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
                // 调用父级函数
                _t.$parent.dealWith();
            }
        }
    }
</script>

<style scoped>
    .contentNews {
        padding: 50px 130px;
        background: #0b0b0b;
        color: #fff;
    }

    .newsTitle {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .newsText {
        font-size: 30px;
        height: 50px;
        line-height: 50px;
        padding-bottom: 10px;
        border-bottom: 5px solid #fff;
    }

    .headline-right {
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .newsList {
        display: flex;
        flex-wrap: wrap;
    }

    .newsListTop {
        margin-top: 37px;
    }

    .newsItem {
        width: 50%;
        box-sizing: border-box;
        cursor: pointer;
        padding: 0 20px;
        margin-bottom: 20px;
    }

    .newsItem:nth-child(2n) {
        padding-right: 0;
    }

    .newsItem:nth-child(2n+1) {
        padding-left: 0;
    }

    .tagLines {
        color: #fff;
        font-size: 18px;
        margin: 10px 0 5px;
    }

    .content {
        font-size: 14px;
        color: #a2a2a2;
    }

    .time {
        font-size: 14px;
        color: #a2a2a2;
        height: 20px;
    }

    .newsItem:nth-child(2n) {
        margin-right: 0;
    }
</style>

