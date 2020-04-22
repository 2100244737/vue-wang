<template>
    <div class="mobileAddressDetail">
        <!--banner-->
        <div class="navBar_bg">
            <div class="message_img bannerBox">
                <img v-if="carouselMapImg === ''" class="widthAll" src="../../../../assets/img/header/defaultBanner.png"
                     alt="banner">
                <img v-else class="widthAll" :src="carouselMapImg" alt="banner">
            </div>
        </div>
        <div class="addressTableBox">
            <div class="title">
                <div class="addressAdministration">{{$t('address.title')}}</div>
                <el-button size="small" class="addAddress" type="default" @click="dialogFormVisible = true">
                    {{$t('address.addAddress')}}
                </el-button>
            </div>
            <ul class="orderList marginBottom20">
                <li v-if="tableData.length === 0" class="isNotData">{{$t('public.notData')}}</li>
                <li class="hasData" v-for="(item,index) in tableData" :key="index">
                    <div class="orderItem">
                        <div class="orderLeft">{{$t('address.user')}}</div>
                        <div class="orderRight">{{item.name}}</div>
                    </div>
                    <div class="orderItem">
                        <div class="orderLeft">{{$t('address.phone')}}</div>
                        <div class="orderRight">{{item.phone}}</div>
                    </div>
                    <div class="orderItem">
                        <div class="orderLeft">{{$t('address.detailAddress')}}</div>
                        <div class="orderRight">{{item.seat}}</div>
                    </div>
                </li>
            </ul>
            <!--分页-->
            <pages
                :total='options.total'
                :currentPage='options.currentPage'
                :page-size="options.pageSize"
                @handleSizeChangeSub="handleSizeChangeSub"
                @handleCurrentChangeSub="handleCurrentChange"/>
        </div>
        <!--添加地址-->
        <el-dialog
            :title="$t('address.createAddress')"
            class="addressMobileDialog"
            width="95%"
            :before-close="resetData"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :visible.sync="dialogFormVisible">
            <el-form :model="formItem" label-width="80px">
                <el-form-item :label="$t('address.user')">
                    <el-input v-model="formItem.userName"/>
                </el-form-item>
                <el-form-item :label="$t('address.phone')">
                    <el-input v-model="formItem.mobile"/>
                </el-form-item>
                <el-form-item :label="$t('address.address')">
                    <el-select
                        class="width200"
                        v-model="formItem.province"
                        @change="changeProvince(formItem.province)"
                        :placeholder="$t('address.placeholderAddress')">
                        <el-option
                            v-for="(item,index) in provinceList"
                            :key="index"
                            :label="item.name"
                            :value="item.name"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select class="width200" v-model="formItem.city"
                               :placeholder="$t('address.placeholderAddress')">
                        <el-option
                            v-for="(item,index) in cityList"
                            :key="index"
                            :label="item.name"
                            :value="item.name"/>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input type="textarea" v-model="formItem.address" :placeholder="$t('userInfo.inputAddress')"/>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="default" @click="resetData">{{$t('public.cancel')}}</el-button>
                <el-button type="default" @click="addData">{{$t('public.confirm')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {areaJSON} from "../../../../assets/js/area";

    export default {
        name: "VIP_ADDRESS",
        data() {
            return {
                carouselMapImg: '', // banner 图
                // 列表数组
                tableData: [
                    {
                        name: '张三',
                        phone: '13333333333',
                        seat: '北京市昌平区回龙观创客广场',
                        tips: '设为默认地址'
                    },
                    {
                        name: '张三',
                        phone: '13333333333',
                        seat: '北京市昌平区回龙观创客广场',
                        tips: '设为默认地址'
                    },
                    {
                        name: '张三',
                        phone: '13333333333',
                        seat: '北京市昌平区回龙观创客广场',
                        tips: '设为默认地址'
                    },
                    {
                        name: '张三',
                        phone: '13333333333',
                        seat: '北京市昌平区回龙观创客广场北京市昌平区回龙观创客广场北京市昌平区回龙观创客广场',
                        tips: '设为默认地址'
                    },
                    {
                        name: '张三',
                        phone: '13333333333',
                        seat: '北京市昌平区回龙观创客广场',
                        tips: '设为默认地址'
                    },
                ],
                // 分页
                options: {
                    total: 0, // 总条数
                    currentPage: 1, // 当前页码
                    pageSize: 8, // 显示条数
                },
                // 省份下拉框
                provinceList: areaJSON,
                // 地区下拉框
                cityList: [],
                dialogFormVisible: false, // 添加地址弹出层
                // 表单
                formItem: {
                    userName: '', // 联系人
                    mobile: '', // 电话
                    province: '', // 省
                    city: '', // 市
                    address: '', // 详情地址
                    userNameFlag: false, // 联系人标识
                    mobileFlag: false, // 联系电话标识
                    addressFlag: false, // 联系地址标识
                },
            }
        },
        methods: {
            // 重置地址表单
            resetData() {
                let _t = this;
                _t.dialogFormVisible = false;
                _t.formItem.userName = ''; // 联系人
                _t.formItem.mobile = ''; // 电话
                _t.formItem.province = ''; // 省
                _t.formItem.city = ''; // 市
                _t.formItem.address = ''; // 详情地址
                _t.formItem.userNameFlag = false; // 联系人标识
                _t.formItem.mobileFlag = false; // 联系电话标识
                _t.formItem.addressFlag = false; // 联系地址标识
            },
            // 改变省
            changeProvince(val) {
                let _t = this;
                if (val === "") {
                    _t.formItem.city = "";
                    _t.cityList = [];
                } else {
                    _t.provinceList.forEach(item => {
                        if (item.name === val) {
                            _t.formItem.city = "";
                            _t.cityList = item.children;
                        }
                    });
                }
            },
            // 获取banner
            getBanner() {
                let _t = this;
                _t.$api.post('home/getBanner', {
                    site: 8, // 8:个人中心 (后台管理系统可查具体值得含义)
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            let resData = res.data === null ? [] : res.data;
                            if (resData.length !== 0 && resData[0].carouselMapStr !== undefined) {
                                _t.carouselMapImg = _t.$api.imgUrl() + resData[0].carouselMapStr;
                            }
                            break;
                        default:
                            break;
                    }
                })
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
            // 添加地址
            addData() {
                let _t = this;
                _t.resetData();
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'VIP_ADDRESS', 'M_VIP_ADDRESS');
            if (jump === false) {
                _t.getBanner();
            }
        }
    }
</script>

<style scoped>
    .mobileAddressDetail {
        padding: 5%;
        background: #0c0c0c;
    }

    .addressTableBox .title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #4d4d4d;
        line-height: 80px;
    }

    .addressAdministration {
        font-size: 18px;
    }

    .addAddress {
        border: 1px solid #4d4d4d;
        background-color: #2a282a;
    }

    .orderList li .orderItem {
        font-size: 14px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        color: #ddd;
    }

    .orderList li .orderItem > div {
        line-height: 30px;
    }

    .orderList li .orderItem .orderLeft {
        margin-right: 15px;
        white-space: nowrap;
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
<style>
    .addressMobileDialog .el-dialog {
        background-color: rgba(0, 0, 0, 0.3);
        background-image: url('../../../../assets/img/common/mask_bg.png');
        background-repeat: repeat;
    }

    .addressMobileDialog .el-dialog__header {
        color: #fff;
        padding: 36px 20px 10px 36px;
    }

    .addressMobileDialog .el-dialog__body {
        padding-bottom: 0;
    }

    .addressMobileDialog .el-dialog__body,
    .addressMobileDialog .el-dialog__footer {
        background-color: transparent;
    }

    .addressMobileDialog .el-dialog__title {
        color: #fff;
    }

    .addressMobileDialog .el-form-item__label {
        font-size: 15px;
        color: #fff;
    }

    .addressMobileDialog .el-select .el-input__inner:focus,
    .addressMobileDialog .el-input__inner,
    .addressMobileDialog .el-textarea__inner {
        color: #fff;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid #7d7d7d;
    }
</style>
