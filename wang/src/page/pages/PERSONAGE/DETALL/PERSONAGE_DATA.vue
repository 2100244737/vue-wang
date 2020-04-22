<template>
    <div class="personBox">
        <div class="personContent">
            <el-form :model="formItem" class="personContent_form" label-width="100px">
                <el-form-item class="star" :label="$t('userInfo.account')">
                    <el-input disabled class="width200" v-model="formItem.account"/>
                    <div v-if="errorTip.accountFlag" class="isNotNullText inputText">{{errorTip.accountTip}}</div>
                </el-form-item>
                <el-form-item class="star" :label="$t('userInfo.nickName')">
                    <el-input
                        class="width200"
                        v-model="formItem.nickName"
                        @blur="blurInput(errorTip,'nickNameFlag',formItem.nickName,'nickNameTip')"
                        :placeholder="$t('userInfo.inputNickName')"/>
                    <div v-if="errorTip.nickNameFlag" class="isNotNullText inputText">{{errorTip.nickNameTip}}</div>
                </el-form-item>
                <el-form-item :label="$t('userInfo.sex')">
                    <el-select
                        class="width200"
                        v-model="formItem.sex">
                        <el-option
                            v-for="(item,index) in sexList"
                            :key="index"
                            :label="item.label"
                            :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="star" :label="$t('userInfo.realName')">
                    <el-input
                        class="width200"
                        @blur="blurInput(errorTip,'realNameFlag',formItem.realName,'realNameTip')"
                        v-model="formItem.realName"
                        :placeholder="$t('userInfo.inputRealName')"/>
                    <div v-if="errorTip.realNameFlag" class="isNotNullText inputText">{{errorTip.realNameTip}}</div>
                </el-form-item>
                <el-form-item class="star" :label="$t('userInfo.birthday')">
                    <el-date-picker
                        class="width200"
                        @change="blurInput(errorTip,'birthDayFlag',formItem.birthDay,'birthDayTip')"
                        v-model="formItem.birthDay"
                        type="date"
                        :placeholder="$t('userInfo.selectBirthDay')">
                    </el-date-picker>
                    <div v-if="errorTip.birthDayFlag" class="isNotNullText inputText">{{errorTip.birthDayTip}}</div>
                </el-form-item>
                <el-form-item class="star" :label="$t('userInfo.mobile')">
                    <el-input
                        class="width200"
                        oninput="value=value.replace(/[^\d]/g,'')"
                        maxlength="11"
                        @blur="blurInput(errorTip,'mobileFlag',formItem.mobile,'mobileTip')"
                        v-model="formItem.mobile"
                        :placeholder="$t('userInfo.inputMobile')"/>
                    <div v-if="errorTip.mobileFlag" class="isNotNullText inputText">{{errorTip.mobileTip}}</div>
                </el-form-item>
                <el-form-item class="star" :label="$t('userInfo.email')">
                    <el-input
                        class="width200"
                        maxlength="30"
                        v-model="formItem.email"
                        @blur="blurInputEmail(errorTip,'emailFlag',formItem.email)"
                        :placeholder="$t('userInfo.inputEmail')"/>
                    <div v-if="errorTip.emailFlag" class="isNotNullText inputText">{{errorTip.emailTip}}</div>
                </el-form-item>
                <el-form-item class="star" :label="$t('userInfo.address')">
                    <el-radio v-model="formItem.sync" :label="true">{{$t('userInfo.domestic')}}</el-radio>
                    <el-radio v-model="formItem.sync" :label="false">{{$t('userInfo.foreign')}}</el-radio>
                    <div v-if="formItem.sync">
                        <el-select
                            class="width200 marginBottom15"
                            v-model="formItem.province"
                            @change="changeProvince(formItem.province)"
                            :placeholder="$t('userInfo.selectProvince')">
                            <el-option
                                v-for="(item,index) in provinceList"
                                :key="index"
                                :label="item.name"
                                :value="item.name"/>
                        </el-select>
                        <el-select
                            class="width200 marginBottom15 marginLeft10"
                            v-model="formItem.city"
                            :placeholder="$t('userInfo.selectCity')">
                            <el-option
                                v-for="(item,index) in cityList"
                                :key="index"
                                :label="item.name"
                                :value="item.name"/>
                        </el-select>
                    </div>
                    <el-input
                        class="textareaBox"
                        type="textarea"
                        v-model="formItem.address"
                        :placeholder="$t('userInfo.inputAddress')"/>
                    <div v-if="errorTip.addressFlag" class="isNotNullText">{{$t('userInfo.isNotNull')}}</div>
                </el-form-item>
                <el-form-item class="star" :label="$t('userInfo.type')">
                    <el-select
                        class="width200"
                        @change="blurInput(errorTip,'typeFlag',formItem.type,'typeTip')"
                        v-model="formItem.type"
                        :placeholder="$t('userInfo.selectType')">
                        <el-option
                            v-for="(item,index) in typeList"
                            :key="index"
                            :label="item.label"
                            :value="item.value"/>
                    </el-select>
                    <div v-if="errorTip.typeFlag" class="isNotNullText inputText">{{errorTip.typeTip}}</div>
                </el-form-item>
                <el-form-item class="star" :label="$t('userInfo.typeNum')">
                    <el-input
                        class="width200"
                        maxlength="18"
                        @blur="blurInputCard(errorTip,'typeNumFlag',formItem.typeNum)"
                        v-model="formItem.typeNum"
                        :placeholder="$t('userInfo.inputTypeNum')"/>
                    <div v-if="errorTip.typeNumFlag" class="isNotNullText inputText">{{errorTip.typeNumTip}}</div>
                </el-form-item>
                <el-form-item :label="$t('userInfo.social')">
                    <el-input class="width300" v-model="formItem.socialUrl" :placeholder="$t('userInfo.inputSocial')"/>
                </el-form-item>
                <el-form-item>
                    <el-button @click="clickBtn" class="defaultBtn" type="default">{{$t('userInfo.saveBtn')}}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {areaJSON} from '../../../../assets/js/area';

    export default {
        name: 'PERSONAGE_DATA',
        data() {
            return {
                // 表单
                formItem: {
                    id: '', // 用户id
                    account: '', // 账号
                    nickName: '', // 昵称
                    sex: '', // 性别
                    realName: '', // 真实姓名
                    birthDay: '', // 生日
                    mobile: '', // 电话
                    email: '', // 邮箱
                    province: '', // 省
                    city: '', // 市
                    address: '', // 详细地址
                    type: '0', // 证件类型
                    typeNum: '', // 证件号码
                    socialUrl: '', // 社交网站
                    sync: true, // true:国内 false:国外
                    userId: this.getCookie('WJE_USER_ID'),
                },
                // 校验字段
                errorTip: {
                    accountFlag: false, // 账号
                    accountTip: '', // 账号提示
                    nickNameFlag: false, // 昵称
                    nickNameTip: '', // 昵称提示
                    realNameFlag: false, // 真实姓名
                    realNameTip: '', // 真实姓名提示
                    birthDayFlag: false, // 生日
                    birthDayTip: '', // 生日提示
                    typeFlag: false, // 证件类型
                    typeTip: '', // 类型提示
                    typeNumFlag: false, // 证件号码
                    typeNumTip: '', // 证件号码提示
                    emailFlag: false, // 邮箱
                    emailTip: '', // 邮箱提示
                    mobileFlag: false, // 手机号
                    mobileTip: '', // 手机号提示
                    addressFlag: false, // 地址校验
                    addressTip: '', // 地址提示
                },
                // 省份下拉框
                provinceList: areaJSON,
                // 地区下拉框
                cityList: [],
                // 性别
                sexList: [
                    {label: this.$t('userInfo.boys'), value: '1'},
                    {label: this.$t('userInfo.girls'), value: '0'}
                ],
                // 类型
                typeList: [
                    {label: this.$t('userInfo.idCard'), value: '0'}, // 中国大陆身份证
                    {label: this.$t('userInfo.idCard_HK'), value: '1'}, // 中国香港身份证
                    {label: this.$t('userInfo.idCard_TW'), value: '2'}, // 中国台湾身份证
                    {label: this.$t('userInfo.passport'), value: '3'}, // 护照
                    {label: this.$t('userInfo.otherCard'), value: '4'}, // 其他证件
                ]
            }
        },
        methods: {
            // 获取用户信息
            getUserInfo() {
                var _t = this;
                if (_t.formItem.userId !== null && _t.formItem.userId !== 'null') {
                    _t.$api.post('user/getById', {
                        id: _t.formItem.userId
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 查询成功
                                _t.formItem.id = res.data.id !== undefined ? res.data.id : ''; // id
                                _t.formItem.account = res.data.userName !== undefined ? res.data.userName : ''; // 账户名
                                _t.formItem.nickName = res.data.userNickName !== undefined ? res.data.userNickName : ''; // 昵称
                                _t.formItem.sex = res.data.userSex !== undefined ? res.data.userSex.toString() : ''; // 性别
                                _t.formItem.realName = res.data.realName !== undefined ? res.data.realName : ''; // 真实姓名
                                _t.formItem.birthDay = res.data.userBirthday !== undefined ? new Date(Number(res.data.userBirthday)) : null; // 生日
                                _t.formItem.mobile = res.data.userPhoneNumber !== undefined ? res.data.userPhoneNumber : ''; // 手机号码
                                _t.formItem.email = res.data.userEmail !== undefined ? res.data.userEmail : ''; // 邮箱
                                _t.formItem.sync = res.data.areaType !== undefined ? (res.data.areaType === 0 ? true : false) : true; // 地址标识
                                _t.formItem.province = res.data.province !== undefined ? res.data.province : ''; // 省
                                if (_t.formItem.province !== '' && _t.formItem.province !== null) {
                                    _t.changeProvince(_t.formItem.province);
                                    _t.formItem.city = res.data.city !== undefined ? res.data.city : ''; // 市
                                }
                                _t.formItem.address = res.data.detailAddress !== undefined ? res.data.detailAddress : ''; // 详细地址
                                // 证件号及类型
                                if (res.data.userCardId !== undefined) {
                                    var userCardId = res.data.userCardId.split(',');
                                    if (userCardId.length !== 0 && userCardId.length === 1) {
                                        _t.formItem.type = userCardId[0];
                                    } else if (userCardId.length !== 0 && userCardId.length === 2) {
                                        _t.formItem.type = userCardId[0];
                                        _t.formItem.typeNum = userCardId[1];
                                    }
                                }
                                // 社交网站
                                _t.formItem.socialUrl = res.data.socialWeb !== undefined ? res.data.socialWeb : '';
                                break;
                            default: // 查询失败
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                } else {
                    _t.$message.error(_t.$t('public.isNotExist'));
                }
            },
            // 校验函数
            blurInput(item, flag, val, tip) {
                let _t = this;
                // 三目判断 null 转空字符串 时间格式转时间戳字符串
                val = val === null ? '' : (flag === 'birthDayFlag' ? (val === '' ? val : new Date(val).getTime().toString()) : val);
                item[flag] = val.trim() === '' ? true : false;
                item[tip] = item[flag] ? _t.$t('userInfo.isNotNull') : '';
            },
            // 校验邮箱
            blurInputEmail(item, flag, val) {
                var _t = this;
                // 为空取消校验
                if (val.trim() === '') {
                    item[flag] = true;
                    _t.errorTip.emailTip = _t.$t('userInfo.isNotNull');
                } else {
                    // 校验格式
                    var reg = _t.$api.ruleEmail();
                    if (reg.test(val.trim()) === true) {
                        item[flag] = false;
                        _t.errorTip.emailTip = '';
                    } else {
                        item[flag] = true;
                        _t.errorTip.emailTip = _t.$t('userInfo.format');
                    }
                }
            },
            // 校验证件号
            blurInputCard(item, flag, val) {
                let _t = this;
                if (val.trim() === '') {
                    item[flag] = true;
                    _t.errorTip.typeNumTip = _t.$t('userInfo.isNotNull');
                } else {
                    // 校验是否大陆身份证
                    if (_t.formItem.type === '0') {
                        // 大陆身份证
                        let reg = _t.$api.ruleIDCard();
                        if (reg.test(val.trim()) === true) {
                            // 校验通过
                            item[flag] = false;
                            _t.errorTip.typeNumTip = '';
                        } else {
                            item[flag] = true;
                            _t.errorTip.typeNumTip = _t.$t('userInfo.format');
                        }
                    } else {
                        // 非大陆身份证 只校验是否为空
                        item[flag] = false;
                        _t.errorTip.typeNumTip = '';
                    }
                }
            },
            // 校验地址
            blurInputAddress(item, flag) {
                let _t = this;
                if (_t.formItem.sync === true) {
                    // 国内
                    if (_t.formItem.province.trim() === '' && _t.formItem.city.trim() === '' && _t.formItem.address.trim() === '') {
                        item[flag] = true;
                    } else {
                        item[flag] = false;
                    }
                } else if (_t.formItem.sync === false) {
                    // 国外
                    item[flag] = _t.formItem.address.trim() === '' ? true : false;
                }
            },
            // 点击保存按钮
            clickBtn() {
                var _t = this;
                // 校验账号
                _t.blurInput(_t.errorTip, 'accountFlag', _t.formItem.account, 'accountTip');
                // 校验昵称
                _t.blurInput(_t.errorTip, 'nickNameFlag', _t.formItem.nickName, 'nickNameTip');
                // 校验真实姓名
                _t.blurInput(_t.errorTip, 'realNameFlag', _t.formItem.realName, 'realNameTip');
                // 校验生日
                _t.blurInput(_t.errorTip, 'birthDayFlag', _t.formItem.birthDay, 'birthDayTip');
                // 校验手机号
                _t.blurInput(_t.errorTip, 'mobileFlag', _t.formItem.mobile, 'mobileTip');
                // 校验证件类型
                _t.blurInput(_t.errorTip, 'typeFlag', _t.formItem.type, 'typeTip');
                // 校验证件号
                _t.blurInputCard(_t.errorTip, 'typeNumFlag', _t.formItem.typeNum);
                // 校验邮箱
                _t.blurInputEmail(_t.errorTip, 'emailFlag', _t.formItem.email);
                // 校验地址
                _t.blurInputAddress(_t.errorTip, 'addressFlag');
                // 可以提交
                if (_t.errorTip.accountFlag === false
                    && _t.errorTip.mobileFlag === false
                    && _t.errorTip.nickNameFlag === false
                    && _t.errorTip.realNameFlag === false
                    && _t.errorTip.birthDayFlag === false
                    && _t.errorTip.typeFlag === false
                    && _t.errorTip.emailFlag === false
                    && _t.errorTip.addressFlag === false
                    && _t.errorTip.typeNumFlag === false) {
                    var userCardId = ''; // 证件号
                    userCardId = _t.formItem.type + ',' + _t.formItem.typeNum;
                    _t.$api.post('user/userUpdateUserInfo', {
                        id: _t.formItem.id, // 用户id
                        userNickName: _t.formItem.nickName.trim(), // 昵称
                        userSex: _t.formItem.sex === '' ? null : _t.formItem.sex, // 用户性别
                        realName: _t.formItem.realName.trim(), // 真实姓名
                        userBirthday: new Date(_t.formItem.birthDay).getTime(), // 生日
                        userPhoneNumber: _t.formItem.mobile.trim() === '' ? null : _t.formItem.mobile.trim(), // 手机号
                        userEmail: _t.formItem.email.trim() === '' ? null : _t.formItem.email.trim(), // 邮箱
                        areaType: _t.formItem.sync === true ? 0 : 1, // 0:国内 1:国外
                        province: _t.formItem.province === '' ? null : _t.formItem.province, // 省份
                        city: _t.formItem.city === '' ? null : _t.formItem.city, // 市
                        detailAddress: _t.formItem.address.trim() === '' ? null : _t.formItem.address.trim(), // 详细地址
                        socialWeb: _t.formItem.socialUrl.trim() === '' ? null : _t.formItem.socialUrl.trim(), // 社交网址
                        userCardId: userCardId, // 证件号, 类型及号码逗号分隔
                        status: 1, // 状态变正常
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 保存成功
                                _t.$message.success(res.message);
                                _t.getUserInfo();
                                // 组件传值修改用户昵称和头像
                                _t.$bus.emit('getPersonUserInfo', true);
                                // 修改cookie中的缓存昵称
                                _t.setCookie('WJE_NICK_NAME', _t.formItem.nickName.trim());
                                break;
                            case 2018: // 用户属性重复
                                if (res.data !== '' && typeof res.data === 'string') {
                                    let resData = res.data.split(',');
                                    resData.forEach((item) => {
                                        if (item === 'userName') {
                                            _t.errorTip.accountFlag = true;
                                            _t.errorTip.accountTip = _t.$t('userInfo.accountRepeat');
                                        } else if (item === 'userNickName') {
                                            _t.errorTip.nickNameFlag = true;
                                            _t.errorTip.nickNameTip = _t.$t('userInfo.nickNameRepeat');
                                        } else if (item === 'userEmail') {
                                            _t.errorTip.emailFlag = true;
                                            _t.errorTip.emailTip = _t.$t('userInfo.emailRepeat');
                                        } else if (item === 'userPhoneNumber') {
                                            _t.errorTip.mobileFlag = true;
                                            _t.errorTip.mobileTip = _t.$t('userInfo.mobileRepeat');
                                        } else if (item === 'userCardId') {
                                            _t.errorTip.typeNumFlag = true;
                                            _t.errorTip.typeNumTip = _t.$t('userInfo.typeNumRepeat');
                                        }
                                    });
                                }
                                break;
                            default:
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }
            },
            // 改变省
            changeProvince(val) {
                var _t = this;
                if (val === '') {
                    _t.formItem.city = '';
                    _t.cityList = [];
                } else {
                    _t.provinceList.forEach((item) => {
                        if (item.name === val) {
                            _t.formItem.city = '';
                            _t.cityList = item.children;
                        }
                    });
                }
            },
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'PERSONAGE_DATA', 'M_PERSONAGE_DATA');
            if (jump === false) {
                // 获取用户信息
                _t.getUserInfo();
                // 调用父级二级导航选中态
                _t.$parent.dealWith();
            }
        }
    }
</script>

<style scoped>
    .personBox {
        padding: 50px 130px 0;
    }

    .personContent {
        padding: 20px;
        background: url("../../../../assets/img/common/mask_bg.png") repeat;
    }

    .inputText {
        height: 30px;
        line-height: 30px;
    }
</style>
<style>
    /*输入框背景*/
    .personBox .personContent_form .el-form-item {
        padding: 15px 0;
        margin-bottom: 10px;
        background-color: rgba(0, 0, 0, 0.2);
    }

    .personBox .personContent_form .el-input .el-input__inner,
    .personBox .textareaBox .el-textarea__inner {
        background-color: transparent;
        background-image: url("../../../../assets/img/common/mask_bg.png");
        background-repeat: repeat;
        color: #fff;
        border-color: #6d757b;
    }

    .personBox .personContent_form .el-select .el-input.is-focus .el-input__inner {
        border-color: #6d757b;
    }

    .personBox .personContent_form .el-form-item__label,
    .personBox .personContent_form .el-radio__label {
        color: #fff;
    }

    .personBox .personContent_form .star .el-form-item__label::before {
        content: '*';
        margin-right: 5px;
        color: red;
    }

    .personBox .textareaBox .el-textarea__inner {
        width: 412px;
    }
</style>
