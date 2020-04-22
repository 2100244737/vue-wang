<template>
    <div class="activityBox">
        <div style="height: 300px;line-height: 300px;" class="tc">
            <img style="max-width: 500px;" class="width_80" src="../../../../assets/img/common/2020.png" alt="">
        </div>
        <div class="tableMobileBox" v-if="false">
            <ul class="orderList marginBottom20">
                <li v-if="tableData.length === 0" class="isNotData">{{$t('public.notData')}}</li>
                <li class="hasData" v-for="(item,index) in tableData" :key="index">
                    <div class="orderItem">
                        <div class="orderLeft"></div>
                        <div class="orderRight">{{item.headImg}}</div>
                    </div>
                    <div class="orderItem">
                        <div class="orderLeft">{{$t('myActivity.name')}}</div>
                        <div class="orderRight">{{item.title}}</div>
                    </div>
                    <div class="orderItem">
                        <div class="orderLeft">{{$t('myActivity.address')}}</div>
                        <div class="orderRight">{{item.address}}</div>
                    </div>
                    <div class="orderItem">
                        <div class="orderLeft">{{$t('myActivity.time')}}</div>
                        <div class="orderRight">{{item.time}}</div>
                    </div>
                    <div class="orderItem">
                        <div class="orderLeft">{{$t('myActivity.price')}}</div>
                        <div class="orderRight">{{item.price}}</div>
                    </div>
                    <div class="orderItem">
                        <div class="orderLeft">{{$t('myActivity.isTrue')}}</div>
                        <div class="orderRight">{{item.status}}</div>
                    </div>
                    <div class="orderItem">
                        <div class="orderLeft">{{$t('myActivity.date')}}</div>
                        <div class="orderRight">{{item.dateTime}}</div>
                    </div>
                </li>
            </ul>
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
    </div>
</template>

<script>
    export default {
        name: "MY_ACTIVITY",
        data() {
            return {
                // 列表数据
                tableData: [
                    {
                        headImg: '',
                        title: '王嘉尔北京见面会',
                        address: '国家体育场，体育中心',
                        time: '2019.06.23-2019.06.28',
                        price: '200',
                        status: '是',
                        dateTime: '2019.05.04'
                    },
                    {
                        headImg: '',
                        title: '王嘉尔北京见面会',
                        address: '国家体育场，体育中心',
                        time: '2019.06.23-2019.06.28',
                        price: '200',
                        status: '是',
                        dateTime: '2019.05.04'
                    },
                    {
                        headImg: '',
                        title: '王嘉尔北京见面会',
                        address: '国家体育场，体育中心',
                        time: '2019.06.23-2019.06.28',
                        price: '200',
                        status: '是',
                        dateTime: '2019.05.04'
                    }
                ],
                // 分页
                options: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10,
                }
            }
        },
        methods: {
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
            // 获取列表数据
            getData() {

            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'MY_ACTIVITY', 'M_MY_ACTIVITY');
            if (jump === false) {
                _t.getData();
            }
        }
    }
</script>

<style scoped>
    .activityBox {
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
