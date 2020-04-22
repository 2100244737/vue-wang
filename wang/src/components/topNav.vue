<template>
    <div id="topBar_box" class="topBar_box">
        <el-menu mode="horizontal" :default-active="current" :router="true">
            <el-menu-item v-for="(item, index) in navBarArr" :key="index.id" :index="item.url">
                <span>{{item.menuName}}</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: "topNav",
        data() {
            return {
                language: localStorage.getItem("WJE_LANGUAGE") || (navigator.language === "zh-CN" ? "zh_CN" : "en"),
                // 导航栏数据
                navBarArr: []
            };
        },
        methods: {
            // 获取导航数据
            getData() {
                let _t = this;
                _t.$api.post('menu/listMenuInfoByMenuLevel', {
                    parentid: '0',
                    menuType: 0, // 0: 官网菜单 1:后台管理系统菜单
                    language: _t.language
                }, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null) {
                                var menuList = res.data;
                                menuList.forEach((item, index) => {
                                    item.url = item.menuHref;
                                });
                                _t.navBarArr = menuList;
                            }
                            break;
                        default:
                            break;
                    }
                });
            }
        },
        created() {
            let _t = this;
            _t.getData();
        },
        computed: {
            // 监听 url 详情页面的导航
            current() {
                var arr = this.$route.path.split("/");
                if (arr.length > 3) {
                    arr.pop();
                    return arr.join("/");
                } else {
                    return this.$route.path;
                }
            }
        }
    };
</script>

<style>
    .topBar_box {
        border-bottom: 1px solid #4d4d4d;
        text-align: center;
        padding: 15px 0;
    }

    .topBar_box .el-menu {
        display: inline-block !important;
        background: transparent !important;
        border-bottom: none !important;
    }

    .topBar_box .el-menu .el-menu-item {
        margin: 0 30px;
        height: 50px;
        float: inherit;
        display: inline-block;
        line-height: 50px;
    }

    .topBar_box .el-menu .el-menu-item,
    .topBar_box .el-menu .el-menu-item:hover,
    .topBar_box .el-menu .el-menu-item.is-active {
        background-color: transparent !important;
        color: #fff !important;
        font-size: 20px !important;
        padding: 0 !important;
    }

    .topBar_box .el-menu .el-menu-item.is-active {
        border-bottom: 2px solid #fff !important;
    }

    .topBar_box span {
        font-family: 'compacta';
        font-size: 20px;
        letter-spacing: 2px;
        font-weight: bold;
    }
</style>
