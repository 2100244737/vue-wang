<template>
    <div class="activityBox">
        <div style="height: 300px;line-height: 300px;" class="tc">
            <img src="../../../../assets/img/common/2020.png" alt="">
        </div>
        <div v-if="false">
            <el-table class="tableBox" :data="tableData">
                <el-table-column>
                    <template slot-scope="scope">
                        <img :src="scope.row.headImg" alt="head">
                    </template>
                </el-table-column>
                <el-table-column prop="title" :label="$t('myActivity.name')" header-align="center" align="center"/>
                <el-table-column prop="address" :label="$t('myActivity.address')" header-align="center" align="center"/>
                <el-table-column prop="time" :label="$t('myActivity.time')" header-align="center" align="center"/>
                <el-table-column prop="price" :label="$t('myActivity.price')" header-align="center" align="center"/>
                <el-table-column prop="status" :label="$t('myActivity.isTrue')" header-align="center" align="center"/>
                <el-table-column prop="dateTime" :label="$t('myActivity.date')" header-align="center" align="center"/>
            </el-table>
            <!--分页-->
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
    export default {
        name: "MY_ACTIVITY",
        data() {
            return {
                // 列表数据
                tableData: [],
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
                // 调用父级二级导航选中态
                _t.$parent.dealWith();
            }
        }
    }
</script>

<style scoped>
    .activityBox {
        padding: 130px;
    }
</style>
