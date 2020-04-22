<template>
    <div class="mobileContainerActivity">
        <!--活动详情页-->
        <div class="next">
            <!--element 面包屑导航-->
            <el-breadcrumb class="breadCrumb_text" separator="|">
                <el-breadcrumb-item :to="{ name: 'CONFIDENTIAL' }">{{$t('vipLimit.navBar')}}
                </el-breadcrumb-item>
                <el-breadcrumb-item :to="{ name: 'CONFIDENTIAL' }">{{$t('vipLimit.activity')}}
                </el-breadcrumb-item>
                <el-breadcrumb-item>{{$t('vipLimit.location')}}</el-breadcrumb-item>
            </el-breadcrumb>
            <!--活动-->
            <div class="nextContent">
                <p class="title">{{formItem.title}}</p>
                <div class="time">{{formItem.date}}</div>
                <div id="vipMobileContent" class="content"></div>
            </div>
        </div>
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
        name: "ACTIVITY_DETAIL",
        data() {
            return {
                // 查询表单
                formItem: {
                    id: '', // 查询详情的id
                    title: '', // 详情的标题
                    description: '', // 详情的描述
                    date: '', // 活动的日期
                    imgUrl: '', // 图片详情
                },
                dialogVisible: false, // 图片蒙版
            }
        },
        methods: {
            // 点击关闭图片蒙版
            resetImg() {
                let _t = this;
                _t.dialogVisible = false;
                _t.formItem.imgUrl = '';
            },
            // 查询详情接口
            getData() {
                let _t = this;
                if (_t.formItem.id !== null && _t.formItem.id !== '') {
                    _t.$api.get('activity/getActiviById/' + _t.formItem.id, {}, function (res) {
                        switch (res.status) {
                            case 200:
                                if (res.data !== undefined && res.data !== null && res.data.length !== 0) {
                                    _t.formItem.title = res.data[0].activityTitle ? res.data[0].activityTitle : ''; // 活动标题
                                    _t.formItem.description = res.data[0].activityPurpose ? res.data[0].activityPurpose : ''; // 活动描述
                                    _t.formItem.date = res.data[0].releaseTime ? dateFilterDayCN(res.data[0].releaseTime) : ''; // 活动时间
                                    let content = res.data[0].activityContentStr !== undefined ? res.data[0].activityContentStr : ''; // 获取正文内容
                                    document.getElementById('vipMobileContent').innerHTML = content;
                                    // 页面加载完毕图片点击支持放大
                                    _t.$nextTick(function () {
                                        let imgNode = document.querySelectorAll('#vipMobileContent img');
                                        if (imgNode.length !== 0) {
                                            imgNode.forEach((item) => {
                                                item.onclick = function () {
                                                    if (item.src !== undefined && item.src !== null && item.src !== '') {
                                                        _t.dialogVisible = true;
                                                        _t.formItem.imgUrl = item.src;
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                                break;
                            default:
                                _t.$message.error(_t.$t('public.queryError'));
                                break;
                        }
                    });
                }
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'VIP_ACTIVITY_DETAIL', 'M_VIP_ACTIVITY_DETAIL');
            if (jump === false) {
                _t.formItem.id = _t.$route.params.WJE_VIP_ACTIVITIES_ID ? _t.$route.params.WJE_VIP_ACTIVITIES_ID : localStorage.getItem('WJE_VIP_ACTIVITIES_ID');
                _t.getData();
            }
        },
        destroyed() {
            localStorage.removeItem('WJE_VIP_ACTIVITIES_ID');
        }
    }
</script>

<style scoped>
    .mobileContainerActivity {
        background: #0b0b0b;
    }

    .mobileContainerActivity .next {
        margin: 0 auto;
        width: 90%;
        max-width: 900px;
        padding: 30px 0;
    }

    .mobileContainerActivity .nextContent {
        margin-top: 20px;
        color: #fff;
    }

    .mobileContainerActivity .title {
        font-size: 16px;
        margin-bottom: 5px;
        font-weight: 600;
    }

    .mobileContainerActivity .time {
        color: #C0C4CC;
    }

    .mobileContainerActivity .contentDes,
    .mobileContainerActivity .content {
        font-size: 13px;
        margin-top: 10px;
        line-height: 25px;
    }
</style>
<style>
    .mobileContainerActivity .breadCrumb_text .el-breadcrumb__separator,
    .mobileContainerActivity .breadCrumb_text .el-breadcrumb__inner.is-link,
    .mobileContainerActivity .breadCrumb_text .el-breadcrumb__inner {
        font-size: 14px !important;
    }

    #vipMobileContent img {
        max-width: 100%;
        font-size: 0;
        cursor: pointer;
    }

    #vipMobileContent,
    #vipMobileContent div,
    #vipMobileContent p {
        color: #fff;
        line-height: 24px !important;
    }
</style>
