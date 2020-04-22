<template>
    <!--综艺列表-->
    <div class="mobileContentBox">
        <div class="mobileHeadLine">
            <div class="mobileTitleText">{{$t('whatNextVariety.title')}}</div>
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
        <el-row v-else :gutter="15" class="newsList">
            <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="12"
                    class="marginBottom15" v-for="(item,index) in newsList" :key="index">
                <div class="message_img" :style="{backgroundImage:'url('+item.varietyPhotoPath+')'}"
                     @click="imgShow(item)">
                    <!--撑起图片背景-->
                    <img class="widthAll visibilityHidden"
                         src="../../../../assets/img/thumbnail_bg/varietyThumbnail.png"
                         alt="bg">
                </div>
                <div class="article">
                    <p class="textNoWarp tagLines" :title="item.varietyName">{{item.varietyName}} </p>
                    <p class="time">{{item.varietyTime }}</p>
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
        name: "VARIETY",
        data() {
            return {
                // 图片详情
                imgs: '',
                dialogVisibles: false,//图片蒙版
                // 查询表单
                formItem: {
                    year: new Date().getFullYear(),
                },
                dialogVisible: false, // 是否显示蒙版
                // 综艺列表
                newsList: [],
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 8, // 显示条数
                },
            }
        },
        methods: {
            // 点击图片放大
            imgShow(item) {
                let _t = this;
                _t.dialogVisibles = true;
                _t.imgs = item.varietyPhotoPath;
            },
            // 点击关闭图片蒙版
            resetImg() {
                let _t = this;
                _t.dialogVisibles = false;
                _t.imgs = '';
            },
            //  综艺年月++
            handleNext() {
                let _t = this;
                _t.formItem.year += 1;
                _t.options.currentPage = 1;
                _t.getData();
            },
            //  综艺年月--
            handlePrev() {
                let _t = this;
                _t.formItem.year -= 1;
                _t.options.currentPage = 1;
                _t.getData();
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
            // 获取数据
            getData() {
                let _t = this;
                _t.$api.post('varietyInfo/pagelist', {
                    year: _t.formItem.year, // 选中的年
                    page: _t.options.currentPage, // 当前页
                    limit: _t.options.pageSize, // 每页显示的条数
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'), // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            let newsList = res.data.content !== null ? res.data.content : [];
                            newsList.forEach((item) => {
                                // 处理缩略图
                                if (item.varietyPhotoPath !== null && item.varietyPhotoPath !== '' && item.varietyPhotoPath !== undefined) {
                                    item.varietyPhotoPath = _t.$api.imgUrl() + item.varietyPhotoPath;
                                }
                                // 处理时间戳
                                if (item.varietyTime !== undefined && item.varietyTime !== null) {
                                    item.varietyTime = dateFilterDayCN(item.varietyTime);
                                }
                            });
                            _t.options.total = res.data.total !== undefined ? res.data.total : 0;
                            _t.newsList = newsList;
                            break;
                        default:
                            _t.newsList = [];
                            _t.options.total = 0;
                            break;
                    }
                });
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'VARIETY', 'M_VARIETY');
            if (jump === false) {
                _t.getData();
            }
        }
    }
</script>

<style scoped>
    .article {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 5px;
    }

    .article .tagLines {
        color: #fff;
        font-size: 14px;
        flex: 1;
    }

    .article .time {
        font-size: 12px;
        color: #a2a2a2;
        flex-wrap: nowrap;
    }
</style>
