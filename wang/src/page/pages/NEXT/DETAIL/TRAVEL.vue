<template>
    <div class="scheduling">
        <!--行程-->
        <div class="schedulingListBox">
            <div class="choice">
                <div class="year">
                    <img class="img cursorPointer" @click="handlePrev" src="../../../../assets/img/common/data_02.png"
                         alt="">
                    <span class="number">{{formItem.year}}</span>
                    <img class="img cursorPointer" @click="handleNext" src="../../../../assets/img/common/data_01.png"
                         alt="">
                </div>
                <ul class="month">
                    <li v-for="(item, index) in 12"
                        :class="item === formItem.month ? 'is-active' : ''"
                        @click="handleMonth(item)"
                        :key="index">{{item}}
                    </li>
                </ul>
            </div>
            <!--分页-->
            <pages
                :total="options.total"
                :currentPage="options.currentPage"
                :page-size="options.pageSize"
                @handleSizeChangeSub="handleSizeChangeSub"
                @handleCurrentChangeSub="handleCurrentChange"/>
            <div class="message">
                <div v-if="travelData.length === 0" class="tableNotHasData">
                    <img class="notData" src="../../../../assets/img/common/notData.png" alt="notData">
                    <div class="notDataText">{{$t('public.notData')}}</div>
                </div>
                <div class="messageItem" v-for="(item,index) in travelData" :key="index">
                    <div class="imgLeft">
                        <div class="message_img" :style="{backgroundImage:'url('+item.thumbnail+')'}">
                            <!--撑起图片背景-->
                            <img class="visibilityHidden" src="../../../../assets/img/thumbnail_bg/travelThumbnail.png"
                                 alt="bg">
                        </div>
                    </div>
                    <div class="messageContent">
                        <p class="incident" :title="item.travelTitle">{{item.travelTitle}}</p>
                        <p class="time">
                            <span>{{$t('whatNextTravel.time')}}：</span>
                            <span>{{item.travelTime}}</span>
                        </p>
                        <p class="site">
                            <span>{{$t('whatNextTravel.address')}}：</span>
                            <span :title="item.travelAddress">{{item.travelAddress}}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {dateFilterDayCN} from "../../../../assets/js/filters";

    export default {
        name: 'TRAVEL',
        data() {
            return {
                // 查询表单
                formItem: {
                    year: new Date().getFullYear(),
                    month: new Date().getMonth() + 1,
                },
                // 列表分页数据
                travelData: [],
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 5, // 显示条数
                },
            }
        },
        methods: {
            //  年++
            handleNext() {
                let _t = this;
                _t.formItem.year += 1;
                _t.options.currentPage = 1;
                _t.getData();
            },
            //  年--
            handlePrev() {
                let _t = this;
                _t.formItem.year -= 1;
                _t.options.currentPage = 1;
                _t.getData();
            },
            // 点击月份
            handleMonth(val) {
                let _t = this;
                // 得到具体点击的月份
                _t.options.currentPage = 1;
                _t.formItem.month = val;
                _t.getData();
            },
            // 改变当前页码
            handleCurrentChange(val) {
                let _t = this;
                _t.options.currentPage = val;
                _t.getData();
            },
            handleSizeChangeSub(val) {
                let _t = this;
                _t.options.pageSize = val;
                _t.getData();
            },
            // 行程查询
            getData() {
                let _t = this;
                _t.$api.post('travelInfo/travelList', {
                    page: _t.options.currentPage, // 当前页
                    limit: _t.options.pageSize, // 每页显示条数
                    year: _t.formItem.year, // 年份
                    month: _t.formItem.month, // 月份
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'), // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            let travelData = res.data.content !== null ? res.data.content : [];
                            travelData.forEach((item) => {
                                // 处理缩略图
                                if (item.thumbnail !== null && item.thumbnail !== '') {
                                    item.thumbnail = _t.$api.imgUrl() + item.thumbnail;
                                }
                                // 处理时间戳
                                if (item.travelTime !== undefined && item.travelTime !== null && item.travelTime !== '0') {
                                    item.travelTime = dateFilterDayCN(item.travelTime);
                                } else {
                                    item.travelTime = _t.$t('public.deter');
                                }
                            });
                            _t.travelData = travelData;
                            _t.options.total = res.data.total !== undefined ? res.data.total : 0;
                            break;
                        default:
                            _t.travelData = [];
                            _t.options.total = 0;
                            break;
                    }
                })
            },
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'TRAVEL', 'M_TRAVEL');
            if (jump === false) {
                _t.getData();
                // 调用父级函数
                _t.$parent.dealWith();
            }
        }
    }
</script>

<style scoped>
    .scheduling {
        background: #0b0b0b;
        color: #fff;
        padding: 50px 130px;
        position: relative;
    }

    .scheduling .schedulingListBox {
        margin: 0 auto;
    }

    .message {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .messageItem {
        width: 928px;
        margin-top: 34px;
        display: flex;
        align-items: center;
    }

    .imgLeft {
        margin-right: 50px;
    }

    .imgLeft img {
        width: 100%;
    }

    .messageContent {
        flex: 1;
        font-size: 22px;
        color: #e4e4e4;
    }

    .messageContent p {
        line-height: 40px;
    }

    /*地址与标题折行不对齐*/
    .messageContent p.site {
        display: flex;
        flex-direction: row;
        justify-content: start;
    }

    .messageContent p.site span:nth-child(2) {
        flex: 1;
    }

    .choice {
        height: 144px;
        margin-bottom: 46px;
    }

    .choice .year {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        cursor: default;
    }

    .choice .year img {
        width: 16px;
        height: 19px;
    }

    .choice .year .number {
        margin: 0 40px;
    }

    .choice .month {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: #959595;
        cursor: default;
    }

    .choice .month li {
        margin-right: 32px;
        margin-top: 28px;
        cursor: pointer;
    }

    .choice .month li.is-active {
        color: #fff;
    }

    .choice .month li:last-child {
        margin-right: 0;
    }
</style>
