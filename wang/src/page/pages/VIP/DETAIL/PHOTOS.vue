<template>
    <div class="vip_photos_box">
        <!--详情展示-->
        <div v-if="showDetail">
            <!--标题-->
            <div class="vip_photo_title clearFix">
                <div class="fl vip_photo pointer" @click="showDetail = !showDetail">{{DetailDataFrom.title}}</div>
                <div class="fr vip_photo_date">
                    <span class="date">{{DetailDataFrom.publishTime}}</span>
                </div>
            </div>
            <!--内容区域-->
            <div v-if="photoDetail.length === 0" class="tableNotHasData flex_1">
                <img class="notData" src="../../../../assets/img/common/notData.png" alt="notData">
                <div class="notDataText">{{$t('public.notData')}}</div>
            </div>
            <ul v-else class="vip_photoImg_list clearFix">
                <li @click="imgShow(item)" v-for="(item,index) in photoDetail" :key="index">
                    <div class="message_img" :style="{backgroundImage:'url('+item+')'}">
                        <img class="widthAll visibilityHidden"
                             src="../../../../assets/img/thumbnail_bg/vip_photoDetail.png" alt="">
                    </div>
                </li>
            </ul>
            <!--分页-->
            <div class="vip_photo_page">
                <pages
                    :total='optionsDetail.total'
                    :currentPage='optionsDetail.currentPage'
                    :page-size="optionsDetail.pageSize"
                    @handleSizeChangeSub="handleSizeChangeSubDetail"
                    @handleCurrentChangeSub="handleCurrentChangeDetail"/>
            </div>
        </div>
        <!--列表-->
        <div v-else>
            <!--标题-->
            <div class="vip_photo_title clearFix">
                <span class="vip_photo">{{$t('vipPhotos.title')}}</span>
                <div class="fr vip_photo_date">
                    <img class="img" @click="handlePrev" src="../../../../assets/img/common/data_02.png" alt="">
                    <span class="date">{{formItem.year}}</span>
                    <img class="img" @click="handleNext" src="../../../../assets/img/common/data_01.png" alt="">
                </div>
            </div>
            <div v-if="photoList.length === 0" class="tableNotHasData">
                <img class="notData" src="../../../../assets/img/common/notData.png" alt="notData">
                <div class="notDataText">{{$t('public.notData')}}</div>
            </div>
            <div v-else class="vip_photo_list">
                <ul class="vip_photo_list_operator clearFix">
                    <!--注意换成接口时吧 photo转为对应的数组类型-->
                    <li @click="showDetailBox(item)" v-for="(item,index) in photoList"
                        :key="index">
                        <!--背景-->
                        <div class="message_img vip_photo_item"
                             :style="{backgroundImage:'url('+item.carouselMapStr+')'}">
                            <img class="widthAll visibilityHidden"
                                 src="../../../../assets/img/thumbnail_bg/vip_photoList.png" alt="">
                            <!--蒙版及查看详情-->
                            <div class="vip_photo_dialog">
                                <!--放大按钮-->
                                <img class="vip_more"
                                     src="../../../../assets/img/vipPhoto/more.png"
                                     alt="">
                                <div class="vip_description">
                                    <p class="title">{{item.title}}</p>
                                    <p class="date">{{item.publishTime}}</p>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <!--分页-->
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
            :show-close="false"
            :visible.sync="dialogVisibles"
            append-to-body
            :before-close="resetImg">
            <img class="widthAll" :src="imgs">
        </el-dialog>
    </div>
</template>

<script>
    // 转时间戳
    import {dateFilterDayPoint} from "../../../../assets/js/filters";

    export default {
        name: 'PHOTOS',
        data() {
            return {
                showDetail: false, // 控制是否显示详情 false:缩略图 true:
                photoList: [], // 相册列表
                photoDetail: [], // 相册详情
                // 图片列表查询表单
                formItem: {
                    year: new Date().getFullYear()
                },
                DetailDataFrom: {
                    title: '',
                    publishTime: '',
                    id: ''
                },
                // 一层
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 6, // 显示条数
                },
                // 详情
                optionsDetail: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 6, // 显示条数
                },
                dialogVisibles: false, // 照片详情
                //图片详情
                imgs: '',
            }
        },
        methods: {
            //点击图片放大
            imgShow(item) {
                let _t = this;
                _t.dialogVisibles = true;
                _t.imgs = item;
            },
            // 点击关闭图片蒙版
            resetImg() {
                let _t = this;
                _t.dialogVisibles = false;
                _t.imgs = '';
            },
            // 改变当前页码
            handleCurrentChange(val) {
                let _t = this;
                _t.options.currentPage = val;
                _t.getVipPhoto();
            },
            // 改变每页显示条数
            handleSizeChangeSub(val) {
                let _t = this;
                _t.options.pageSize = val;
                _t.getVipPhoto();
            },
            // 更换年份 上一年
            handlePrev() {
                let _t = this;
                _t.formItem.year -= 1;
                _t.options.currentPage = 1;
                _t.getVipPhoto();
            },
            // 更换年份 下一年
            handleNext() {
                let _t = this;
                _t.formItem.year += 1;
                _t.options.currentPage = 1;
                _t.getVipPhoto();
            },
            // 显示详情
            showDetailBox(val) {
                let _t = this;
                _t.showDetail = true;
                _t.DetailDataFrom.id = val.id;
                _t.DetailDataFrom.title = val.title;
                _t.DetailDataFrom.publishTime = val.publishTime;
                _t.getDetailData();
            },
            // 改变当前页码
            handleCurrentChangeDetail(val) {
                let _t = this;
                _t.optionsDetail.currentPage = val;
                _t.getDetailData();
            },
            // 改变每页显示条数
            handleSizeChangeSubDetail(val) {
                let _t = this;
                _t.optionsDetail.pageSize = val;
                _t.getDetailData();
            },
            // 获取相册详情
            getDetailData() {
                let _t = this;
                _t.$api.post('home/getVipAlbum', {
                    page: _t.optionsDetail.currentPage,
                    limit: _t.optionsDetail.pageSize,
                    id: _t.DetailDataFrom.id
                }, function (res) {
                    switch (res.status) {
                        case 200: // 成功
                            if (res.data.content !== undefined && res.data.content !== null) {
                                let resData = res.data.content;
                                let photoDetail = new Array();
                                resData.forEach((item) => {
                                    photoDetail.push(_t.$api.imgUrl() + item);
                                });
                                _t.photoDetail = photoDetail;
                                _t.optionsDetail.total = res.data.total !== undefined ? res.data.total : 0;
                            }
                            break;
                        default:
                            break;
                    }
                })
            },
            //查询vipPhoto
            getVipPhoto() {
                let _t = this;
                let page = _t.options.currentPage;
                let limit = _t.options.pageSize;
                let year = _t.formItem.year;
                _t.$api.get('home/getVipPhoto/' + page + '/' + limit + '/' + year, {}, (res) => {
                    switch (res.status) {
                        case 200:
                            if (res.data !== undefined && res.data !== null) {
                                let photoList = res.data.content === null ? [] : res.data.content;
                                photoList.forEach(item => {
                                    if (item.carouselMapStr !== undefined && item.carouselMapStr !== null) {
                                        item.carouselMapStr = this.$api.imgUrl() + item.carouselMapStr;
                                    }
                                    if (item.publishTime !== undefined && item.publishTime !== null) {
                                        item.publishTime = dateFilterDayPoint(item.publishTime);
                                    }
                                });
                                _t.photoList = photoList;
                                _t.options.total = res.data.total
                            }
                            break;
                        default:
                            _t.photoList = [];
                            _t.options.total = 0;
                            break;
                    }
                })
            },
            // 获取用户信息
            getUserInfo() {
                let _t = this;
                let userId = _t.getCookie('WJE_USER_ID');
                if (userId !== undefined && userId !== null && userId !== 'null') {
                    _t.$api.post('user/getById', {
                        id: userId
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 查询成功
                                if (res.data !== undefined && res.data !== null) {
                                    let resData = res.data;
                                    // 判断是否是vip
                                    if (resData.role !== undefined && resData.role !== null && (resData.role === 1 || resData.role === 2)) {
                                        _t.getVipPhoto();
                                    }
                                }
                                break;
                            default: // 查询失败
                                break;
                        }
                    });
                }
            },
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'VIP_PHOTOS', 'M_VIP_PHOTOS');
            if (jump === false) {
                _t.getUserInfo();
                // 调用父级加载二级菜单选中项
                _t.$parent.dealWith();
                // 调用父级的用户信息判断是否vip到期
                _t.$parent.getUserInfo();
            }
        }
    }
</script>

<style scoped>
    .vip_photos_box {
        padding: 50px 130px;
        color: #fff;
        background-color: #0b0b0b;
    }

    .vip_photo_list {
        background: url("../../../../assets/img/common/mask_bg.png") repeat;
        padding: 20px;
    }

    .vip_photo_list_operator {
        background-color: rgba(0, 0, 0, 0.3);
        padding: 20px 10px 0;
    }

    .vip_photo_list_operator li {
        width: 33.3%;
        float: left;
        box-sizing: border-box;
        font-size: 0;
        padding: 0 10px;
        margin-bottom: 20px;
    }

    .vip_photo_list_operator li:nth-child(2) {
        margin-right: 0;
    }

    .vip_photo_list_operator li > img.bg {
        width: 100%;
        opacity: 0.6;
    }

    .vip_photo_item {
        position: relative;
    }

    .vip_photo_dialog {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.3);
        overflow: hidden;
    }

    .vip_more {
        position: absolute;
        top: 10px;
        right: 20px;
        width: 25px;
        cursor: pointer;
    }

    .vip_description {
        font-size: 20px;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        z-index: 12;
    }

    .vip_description p.title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 16px;
    }

    .vip_description p.date {
        font-size: 18px;
    }

    .vip_photo_page {
        margin-top: 30px;
        text-align: center;
    }

    .vip_photo_title {
        height: 50px;
        line-height: 50px;
        margin-bottom: 50px;
    }

    .vip_photo_title .vip_photo {
        font-size: 30px;
        color: #fff;
        box-sizing: border-box;
        padding-bottom: 5px;
        border-bottom: 5px solid #fff;
    }

    .vip_photo_title .vip_photo_date {
        font-size: 0;
    }

    .vip_photo_title .vip_photo_date span.date {
        padding: 0 15px;
        vertical-align: middle;
        font-size: 16px;
    }

    .vip_photoImg_list li {
        position: relative;
        width: 33.3%;
        float: left;
        box-sizing: border-box;
        padding: 0 10px;
        margin-bottom: 20px;
    }

    .vip_photoImg_list li img.bg {
        width: 100%;
        opacity: 0.6;
    }

    .vip_photoImg_list .iconfont {
        position: absolute;
        top: 15px;
        right: 20px;
    }

    .vip_photoImg_list .text {
        display: inline-block;
        position: absolute;
        top: 50%;
        left: 50%;
        text-align: center;
        color: #ffff;
        transform: translate(-50%, -50%);
    }

    .vip_photoImg_list .text .word {
        display: block;
        font-size: 20px;
        margin-bottom: 14px;
    }
</style>
