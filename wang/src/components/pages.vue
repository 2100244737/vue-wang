<template>
    <div class="paging">
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            :current-page="currentPageNum"
            layout="prev, pager, next"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: 'pages',
        data() {
            return {
                // 当前选中页码
                currentPageNum: this.currentPage,
            }
        },
        props: {
            // 当前页
            currentPage: {
                type: Number,
                default: 1
            },
            // 每页数据条数
            pageSize: {
                type: Number,
                default: 10
            },
            // 总数据条数
            total: {
                type: Number,
                default: 0
            },
        },
        methods: {
            // 改变当前页码
            handleCurrentChange(val) {
                this.currentPageNum = val;
                this.$emit("handleCurrentChangeSub", val);
            },
            // 改变条数
            handleSizeChange(val) {
                this.$emit("handleSizeChangeSub", val);
            }
        },
        watch: {
            currentPage: function (newData, oldData) {
                var _t = this;
                _t.currentPageNum = newData;
            }
        }
    }
</script>

<style>
    .paging {
        width: 100%;
        text-align: center;
        margin: 30px auto;
    }

    .paging .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #333;
    }

    .paging .el-pagination.is-background .btn-next,
    .paging .el-pagination.is-background .btn-prev,
    .paging .el-pagination.is-background .el-pager li {
        background-color: transparent;
        border: 1px solid #333;
        color: #fff;
    }

    .paging .el-pagination.is-background .el-pager li:not(.disabled):hover {
        color: #fff;
    }
</style>
