<template>
    <div class="blackBg mobileHeader">
        <!--头部logo-->
        <div class="tc positionRelative">
            <img @click="clickLogo" class="mobile_logo" src="../assets/img/header/logo.png" alt="">
            <img @click="isShowMenu = true" class="mobile_menu" src="../assets/img/header/menu.png" alt="">
        </div>
        <!--导航及登录-->
        <div v-if="isShowMenu === true" class="mobileMenuBox">
            <!--切换语言及登录注册-->
            <div class="mobileMenu_titleBox">
                <i @click="isShowMenu = false" class="el-icon-close"></i>
                <div class="mobileMenu_title">
                    <!--已登录-->
                    <div v-if="registerState" class="already">
                        <el-dropdown @command="handleCommand" trigger="click">
                            <img class="img"
                                 :src="formItem.headImg === '' ? require('../assets/img/common/head.png') : formItem.headImg"
                                 alt="">
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="pwd">{{$t('header.changePassword')}}</el-dropdown-item>
                                <el-dropdown-item command="personal">{{$t('header.personalData')}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <span @click="outSystem" class="quit pointer">{{$t('public.quit')}}</span>
                    </div>
                    <div v-else class="future">
                        <el-button size="small" @click="loginBtn" class="whiteColor font16 loginBtn" type="text">
                            {{$t('header.login')}}
                        </el-button>
                        <el-button size="small" @click="joinNowBtn" type="default" class=" joinNow font16">
                            {{$t('header.join')}}
                        </el-button>
                    </div>
                    <div class="future">
                        <img class="iconBtn" src="../assets/img/header/earch.png" alt="">
                        <el-select
                            @change="changeLanguage"
                            class="languageSelect"
                            v-model="formItem.language">
                            <el-option
                                v-for="(item,index) in languageList"
                                :key="index"
                                :label="item.name"
                                :value="item.value"/>
                        </el-select>
                    </div>
                </div>
            </div>
            <!--菜单-->
            <el-menu
                class="mobileMenu"
                mode="vertical"
                background-color="#000"
                text-color="#fff"
                :default-active="current"
                :router="true">
                <el-menu-item v-for="(item, index) in navBarArr" :key="index.id" :index="item.url">
                    <span>{{item.menuName}}</span>
                </el-menu-item>
            </el-menu>
        </div>
        <!--弹框- 登录-->
        <el-dialog
            class="mobile_Login"
            append-to-body
            width="95%"
            :before-close="beforeLogin"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="dialogVisible">
            <div class="background">
                <span class="loginText">{{$t('loginRes.loginTitle')}}</span>
                <el-form :model="loginForm" auto-complete="off">
                    <el-form-item>
                        <div class="userName">
                            <img src="../assets/img/login/user.png" alt="">
                            <el-input
                                class="formInput"
                                @blur="blurInput(loginForm,'userNameFlag',loginForm.username,'userNameTip')"
                                v-model="loginForm.username"
                                :placeholder="$t('loginRes.loginUser')"/>
                            <span
                                class="isNotNull marginLeft40"
                                v-if="loginForm.userNameFlag">{{loginForm.userNameTip}}</span>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <div class="userName">
                            <img src=".././assets/img/login/password.png" alt="">
                            <el-input
                                class="formInput"
                                @keyup.enter.native="handelLogin"
                                @blur="blurInput(loginForm,'passwordFlag',loginForm.password,'passwordTip')"
                                v-model="loginForm.password"
                                show-password
                                name="password"
                                auto-complete="new-password"
                                :placeholder="$t('loginRes.loginPwd')"/>
                            <span
                                class="isNotNull marginLeft40"
                                v-if="loginForm.passwordFlag">{{loginForm.passwordTip}}</span>
                        </div>
                    </el-form-item>
                    <el-form-item class="marginTop50 marginBottom0">
                        <el-button class="widthAll" @click="handelLogin">{{$t('loginRes.loginBtn')}}</el-button>
                    </el-form-item>
                    <el-form-item class="marginBottom0 tr">
                        <el-button @click="forgotBtn" class="grayColor" type="text">{{$t('loginRes.forgetPwd')}}
                        </el-button>
                    </el-form-item>
                </el-form>
                <div class="brandIcon">
                    <img v-for="(item,index) in imgList"
                         :key="index"
                         :src="item.img"
                         @click="imgClick(item)">
                </div>
                <div class="tc">
                    <el-button @click="register" class="registerBtn" type="text">{{$t('loginRes.loginResText')}}
                    </el-button>
                </div>
            </div>
        </el-dialog>
        <!--修改密码弹出层-->
        <el-dialog
            :title="$t('header.changePassword')"
            append-to-body
            width="95%"
            :visible.sync="dialogPassword"
            class="mobile_Login mobile_password"
            :before-close="resetPwdBox"
            :close-on-press-escape="false"
            :close-on-click-modal="false">
            <div class="background">
                <el-form :model="passwordForm" label-width="100px" autocomplete="off">
                    <el-form-item class="marginBottom0" :label="$t('loginRes.oldPassword') + '：'">
                        <el-input
                            type="password"
                            name="password"
                            auto-complete="new-password"
                            @blur="blurInputOldPassword(passwordForm,'oldPasswordFlag',passwordForm.oldPassword,'oldPasswordTip')"
                            v-model="passwordForm.oldPassword"/>
                        <div class="passwordForm">
                            <span v-if="passwordForm.oldPasswordFlag"
                                  class="isNotNullText">{{passwordForm.oldPasswordTip}}</span>
                        </div>
                    </el-form-item>
                    <el-form-item class="marginBottom0" :label="$t('loginRes.password') + '：'">
                        <el-input
                            type="password"
                            name="password"
                            auto-complete="new-password"
                            @blur="blurInputPassword(passwordForm,'passwordFlag',passwordForm.password,passwordForm.confirmPassword)"
                            v-model="passwordForm.password"/>
                        <div class="passwordForm">
                             <span v-if="passwordForm.passwordFlag"
                                   class="isNotNullText">{{passwordForm.passwordTip}}</span>
                        </div>
                    </el-form-item>
                    <el-form-item class="marginBottom0" :label="$t('loginRes.confirmPassword') + '：'">
                        <el-input
                            type="password"
                            name="password"
                            auto-complete="new-password"
                            @blur="blurInputPassword(passwordForm,'confirmPasswordFlag',passwordForm.password,passwordForm.confirmPassword)"
                            v-model="passwordForm.confirmPassword"/>
                        <div class="passwordForm">
                            <span v-if="passwordForm.confirmPasswordFlag"
                                  class="isNotNullText">{{passwordForm.confirmPasswordTip}}</span>
                        </div>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="tr">
                    <el-button size="small" type="default" @click="resetPwdBox">{{$t('public.cancel')}}</el-button>
                    <el-button size="small" type="default" @click="addPassword">{{$t('public.confirm')}}</el-button>
                </div>
            </div>
        </el-dialog>
        <!--手机号注册-->
        <el-dialog
            :visible.sync="dialogPhoto"
            class="mobile_Login mobile_phoneBox"
            append-to-body
            width="95%"
            :before-close="resetPhoto"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <div class="background">
                <div class="loginText">{{$t('phoneRes.registerTitle')}}</div>
                <el-form :model="photoForm">
                    <el-form-item class="marginBottom0">
                        <!--<p class="email">{{$t('phoneRes.phoneTitle')}}</p>-->
                        <div class="userNamePhone">
                            <img src="../assets/img/picture/phone.png" alt="">
                            <el-input
                                maxlength="11"
                                oninput="value=value.replace(/[^\d]/g,'')"
                                @blur="blurInputPhone(photoForm, 'photoNumFlag', photoForm.photoNum)"
                                :placeholder="$t('phoneRes.inputPhone')"
                                v-model="photoForm.photoNum"/>
                        </div>
                        <div>
                            <span>{{$t('public.or')}}</span>
                            <el-button type="text" @click="resBtn('phone')">{{$t('loginRes.registerEmail')}}</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item class="marginBottom15">
                        <!--<p class="email">{{$t('loginRes.codeNum')}}</p>-->
                        <div class="userNamePhone">
                            <img src="../assets/img/picture/email.png" alt=""/>
                            <el-input
                                @blur="blurIsNotNull(photoForm, 'photoCodeFlag', photoForm.photoCode,'photoCodeTip')"
                                :placeholder="$t('loginRes.codeNumPlaceholder')"
                                v-model="photoForm.photoCode"/>
                            <el-button
                                class="codeBtn"
                                :disabled="photoForm.ifCode"
                                @click="getPhoneCode"
                                size="small">{{codeText}}
                            </el-button>
                        </div>
                        <div class="passwordForm">
                            <span class="isNotNullText" v-if="photoForm.photoCodeFlag">{{photoForm.photoCodeTip}}</span>
                        </div>
                    </el-form-item>
                    <el-form-item class="marginBottom15">
                        <!--<p class="email">{{$t('loginRes.password')}}</p>-->
                        <div class="userNamePhone">
                            <img src="../assets/img/login/password.png" alt=""/>
                            <el-input
                                :placeholder="$t('loginRes.passwordText')"
                                type="password"
                                name="password"
                                @blur="blurInputPwd(photoForm, 'photoPwdFlag', photoForm.photoPwd, photoForm.photoConfirmPwd)"
                                auto-complete="new-password"
                                v-model="photoForm.photoPwd"/>
                        </div>
                        <div class="passwordForm">
                            <span class="isNotNullText" v-if="photoForm.photoPwdFlag">{{photoForm.photoPwdTip}}</span>
                        </div>
                    </el-form-item>
                    <el-form-item class="marginBottom0">
                        <!--<p class="email">{{$t('loginRes.confirmPassword')}}</p>-->
                        <div class="userNamePhone">
                            <img src="../assets/img/login/password.png" alt=""/>
                            <el-input
                                :placeholder="$t('loginRes.confirmPassword')"
                                type="password"
                                name="password"
                                @blur="blurInputPwd(photoForm, 'photoConfirmPwdFlag', photoForm.photoPwd, photoForm.photoConfirmPwd)"
                                auto-complete="new-password"
                                v-model="photoForm.photoConfirmPwd"/>
                        </div>
                        <div class="passwordForm">
                            <span class="isNotNullText" v-if="photoForm.photoConfirmPwdFlag">{{photoForm.photoConfirmPwdTip}}</span>
                        </div>
                    </el-form-item>
                    <el-form-item class="marginBottom0">
                        <div class="clearFix">
                            <el-checkbox v-model="photoForm.isChecked" class="fl marginRight10"></el-checkbox>
                            <!--                            <div class="fl">{{$t('header.agree')}}</div>-->
                            <div @click="userAgreement" class="user">{{$t('header.userXieyi')}}</div>
                        </div>
                    </el-form-item>
                    <el-form-item class="marginBottom0">
                        <el-button class="widthAll" @click="phoneNumRes">{{$t('loginRes.registerBtn')}}</el-button>
                    </el-form-item>
                    <el-form-item class="marginBottom0 tc">
                        <el-button @click="toLogin('phone')" type="text" class="registerBtn">
                            {{$t('loginRes.hasUserName')}}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        <!--邮箱注册-->
        <el-dialog
            :visible.sync="dialogEmail"
            class="mobile_Login mobile_phoneBox"
            append-to-body
            width="95%"
            :before-close="resetEmail"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <div class="background">
                <div class="loginText">{{$t('emailRes.registerTitle')}}</div>
                <el-form :model="emailForm">
                    <el-form-item class="marginBottom0">
                        <!--<p class="email">{{$t('emailRes.emailTitle')}}</p>-->
                        <div class="userNamePhone">
                            <img src="../assets/img/picture/email.png" alt=""/>
                            <el-input
                                maxlength="30"
                                @blur="blurInputEmail(emailForm,'emailNumFlag',emailForm.emailNum)"
                                :placeholder="$t('emailRes.inputEmail')"
                                v-model="emailForm.emailNum"/>
                        </div>
                        <div>
                            <span>{{$t('public.or')}}</span>
                            <el-button type="text" @click="resBtn('email')">{{$t('loginRes.registerMobileText')}}
                            </el-button>
                        </div>
                    </el-form-item>
                    <el-form-item class="marginBottom15">
                        <!--<p class="email">{{$t('loginRes.codeNum')}}</p>-->
                        <div class="userNamePhone">
                            <img src="../assets/img/picture/email.png" alt=""/>
                            <el-input
                                @blur="blurIsNotNull(emailForm, 'emailCodeFlag', emailForm.emailCode,'emailCodeTip')"
                                :placeholder="$t('loginRes.codeNumPlaceholder')"
                                v-model="emailForm.emailCode"/>
                            <el-button
                                class="codeBtn"
                                :disabled="emailForm.ifCode"
                                @click="getEmailCode"
                                size="small">{{emailText}}
                            </el-button>
                        </div>
                        <div class="passwordForm">
                            <span class="isNotNullText" v-if="emailForm.emailCodeFlag">{{emailForm.emailCodeTip}}</span>
                        </div>
                    </el-form-item>
                    <el-form-item class="marginBottom15">
                        <!--<p class="email">{{$t('loginRes.password')}}</p>-->
                        <div class="userNamePhone">
                            <img src="../assets/img/login/password.png" alt=""/>
                            <el-input
                                :placeholder="$t('loginRes.passwordText')"
                                type="password"
                                name="password"
                                @blur="blurInputEmailPwd(emailForm, 'emailPwdFlag', emailForm.emailPwd, emailForm.emailConfirmPwd)"
                                auto-complete="new-password"
                                v-model="emailForm.emailPwd"/>
                        </div>
                        <div class="passwordForm">
                            <span class="isNotNullText" v-if="emailForm.emailPwdFlag">{{emailForm.emailPwdTip}}</span>
                        </div>
                    </el-form-item>
                    <el-form-item class="marginBottom0">
                        <!--<p class="email">{{$t('loginRes.confirmPassword')}}</p>-->
                        <div class="userNamePhone">
                            <img src="../assets/img/login/password.png" alt=""/>
                            <el-input
                                :placeholder="$t('loginRes.confirmPassword')"
                                type="password"
                                name="password"
                                @blur="blurInputEmailPwd(emailForm, 'emailConfirmPwdFlag', emailForm.emailPwd, emailForm.emailConfirmPwd)"
                                auto-complete="new-password"
                                v-model="emailForm.emailConfirmPwd"/>
                        </div>
                        <div class="passwordForm">
                            <span class="isNotNullText" v-if="emailForm.emailConfirmPwdFlag">{{emailForm.emailConfirmPwdTip}}</span>
                        </div>
                    </el-form-item>
                    <el-form-item class="marginBottom0">
                        <div class="clearFix">
                            <el-checkbox v-model="emailForm.isChecked" class="fl marginRight10"></el-checkbox>
                            <!--                            <div class="fl">{{$t('header.agree')}}</div>-->
                            <div @click="userAgreement" class="user">{{$t('header.userXieyi')}}</div>
                        </div>
                    </el-form-item>
                    <el-form-item class="marginBottom0">
                        <el-button class="widthAll" @click="emailNumRes">{{$t('loginRes.registerBtn')}}</el-button>
                    </el-form-item>
                    <el-form-item class="marginBottom0 tc register">
                        <el-button @click="toLogin('email')" type="text" class="registerBtn">
                            {{$t('loginRes.hasUserName')}}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        <!--找回密码-->
        <el-dialog
            :visible.sync="dialogVisiblePassword"
            class="mobile_Login mobile_phoneBox"
            append-to-body
            width="95%"
            :before-close="resetForgot"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <div class="background">
                <div class="loginText">{{$t('forgotPwd.dialogTitle')}}</div>
                <el-form :model="forgotItem">
                    <!--邮箱方式-->
                    <div v-if="forgotItem.emailOrPhone">
                        <!--邮箱地址-->
                        <el-form-item class="marginBottom0">
                            <div class="userNamePhone">
                                <img src="../assets/img/picture/email.png" alt="">
                                <el-input
                                    maxlength="30"
                                    @blur="blurInputEmail(forgotItem,'emailNumFlag',forgotItem.emailNum)"
                                    :placeholder="$t('emailRes.inputEmail')"
                                    v-model="forgotItem.emailNum"/>
                            </div>
                            <el-button
                                type="text"
                                @click="forgotItem.emailOrPhone = false">
                                {{$t('forgotPwd.findByMobile')}}
                            </el-button>
                        </el-form-item>
                        <!--邮箱验证码-->
                        <el-form-item>
                            <div class="userNamePhone">
                                <img src="../assets/img/picture/email.png" alt=""/>
                                <el-input
                                    maxlength="6"
                                    @blur="blurIsNotNull(forgotItem, 'emailCodeFlag', forgotItem.emailCode,'emailCodeTip')"
                                    :placeholder="$t('loginRes.codeNumPlaceholder')"
                                    v-model="forgotItem.emailCode"/>
                                <el-button
                                    class="codeBtn"
                                    :disabled="forgotItem.ifCodeEmail"
                                    @click="getForgotCodeByEmail"
                                    size="small">{{forgotTextByEmail}}
                                </el-button>
                            </div>
                            <div class="isNotNull marginLeft40" v-if="forgotItem.emailCodeFlag">
                                {{forgotItem.emailCodeTip}}
                            </div>
                        </el-form-item>
                    </div>
                    <!--手机号方式-->
                    <div v-else>
                        <!--手机号-->
                        <el-form-item class="marginBottom0">
                            <div class="userNamePhone">
                                <img src="../assets/img/picture/phone.png" alt="">
                                <el-input
                                    maxlength="11"
                                    oninput="value=value.replace(/[^\d]/g,'')"
                                    @blur="blurInputPhone(forgotItem, 'photoNumFlag', forgotItem.photoNum)"
                                    :placeholder="$t('phoneRes.inputPhone')"
                                    v-model="forgotItem.photoNum"/>
                            </div>
                            <el-button
                                type="text"
                                @click="forgotItem.emailOrPhone = true">
                                {{$t('forgotPwd.findByEmail')}}
                            </el-button>
                        </el-form-item>
                        <!--手机验证码-->
                        <el-form-item>
                            <div class="userNamePhone">
                                <img src="../assets/img/picture/email.png" alt=""/>
                                <el-input
                                    maxlength="6"
                                    @blur="blurIsNotNull(forgotItem, 'photoCodeFlag', forgotItem.photoCode,'photoCodeTip')"
                                    :placeholder="$t('loginRes.codeNumPlaceholder')"
                                    v-model="forgotItem.photoCode"/>
                                <el-button
                                    class="codeBtn"
                                    :disabled="forgotItem.ifCode"
                                    @click="getForgotCode"
                                    size="small">{{forgotText}}
                                </el-button>
                            </div>
                            <div class="isNotNull marginLeft40" v-if="forgotItem.photoCodeFlag">
                                {{forgotItem.photoCodeTip}}
                            </div>
                        </el-form-item>
                    </div>
                    <!--新密码-->
                    <el-form-item>
                        <div class="userNamePhone">
                            <img src="../assets/img/login/password.png" alt=""/>
                            <el-input
                                :placeholder="$t('loginRes.passwordText')"
                                type="password"
                                name="password"
                                @blur="blurInputPwd(forgotItem, 'photoPwdFlag', forgotItem.photoPwd, forgotItem.photoConfirmPwd)"
                                auto-complete="new-password"
                                v-model="forgotItem.photoPwd"/>
                        </div>
                        <div class="isNotNull marginLeft40" v-if="forgotItem.photoPwdFlag">
                            {{forgotItem.photoPwdTip}}
                        </div>
                    </el-form-item>
                    <!--确认新密码-->
                    <el-form-item>
                        <div class="userNamePhone">
                            <img src="../assets/img/login/password.png" alt=""/>
                            <el-input
                                :placeholder="$t('loginRes.confirmPassword')"
                                type="password"
                                name="password"
                                @blur="blurInputPwd(forgotItem, 'photoConfirmPwdFlag', forgotItem.photoPwd, forgotItem.photoConfirmPwd)"
                                auto-complete="new-password"
                                v-model="forgotItem.photoConfirmPwd"/>
                        </div>
                        <div class="isNotNull marginLeft40" v-if="forgotItem.photoConfirmPwdFlag">
                            {{forgotItem.photoConfirmPwdTip}}
                        </div>
                    </el-form-item>
                    <el-form-item class="tc">
                        <!--邮箱方式-->
                        <el-button v-if="forgotItem.emailOrPhone" @click="saveForgotPwdByEmail" class="widthAll"
                                   type="default">
                            {{$t('public.comment')}}
                        </el-button>
                        <!--手机号方式-->
                        <el-button v-else @click="saveForgotPwdByPhone" class="widthAll" type="default">
                            {{$t('public.comment')}}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        <!-- 协议弹出框 -->
        <el-dialog
            class="agreementDialog"
            append-to-body
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :title="$t('header.userXieyi')"
            :visible.sync="dialogUser"
            width="90%"
            :before-close="resetUser">
            <div class="userStyle mobileWeb">
                <!--协议-->
                <div v-html="formItem.content" class="content"></div>
            </div>
        </el-dialog>
        <!--注册成功提示-->
        <el-dialog
            class="activityDialog activityDialogBg"
            :visible.sync="dialogActivity"
            append-to-body
            :before-close="resetRegTip"
            width="80%">
            <div class="regTipMobileBox ">
                <div class="regTip_left">
                    <img src="../assets/img/vipPhoto/success.png" alt="">
                </div>
                <div class="regTip_right">
                    <div>{{$t('loginRes.registerSuccess')}}</div>
                    <div>
                        <span>{{regTipText}}</span>
                        <span>{{$t('loginRes.regTip')}}</span>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "mobileHeader",
        // 默认的倒计时时间
        props: {
            allTime: {
                type: Number,
                default: 60
            },
            countTime: {
                type: Number,
                default: 5
            }
        },
        data() {
            return {
                checked: false, // 点击同意协议
                navBarArr: [], // 导航
                registerState: false, // 登录状态 true 已登录 false 未登录;
                dialogVisible: false, // 登录弹出层蒙版
                dialogRegister: false, // 注册弹出层蒙版
                dialogPassword: false, // 修改密码弹出层
                dialogUser: false, //协议弹出蒙版
                isShowMenu: false, // 是否显示 menu
                // 语言表单
                formItem: {
                    language: localStorage.getItem("WJE_LANGUAGE") || (navigator.language === "zh-CN" ? "zh_CN" : "en"),
                    headImg: '', // 用户头像
                    content: '', // 用户注册协议
                },
                // 语言列表
                languageList: [
                    {name: "中文", value: "zh_CN"},
                    {name: "ENG", value: "en"}
                ],
                // 登录表单
                loginForm: {
                    username: '', // 账户名
                    password: '', // 密码
                    radio: false, // 记住密码
                    userNameFlag: false, // 账户名标识
                    userNameTip: '', // 账户名提示
                    passwordFlag: false, // 密码标识
                    passwordTip: '' // 密码提示
                },
                // 第三方登录图标
                imgList: [
                    {img: require(".././assets/img/login/third/wechat.png"), type: "wechat"},
                    {img: require(".././assets/img/login/third/qq.png"), type: "qq"},
                    {img: require(".././assets/img/login/third/weibo.png"), type: "weibo"},
                    {img: require(".././assets/img/login/third/facebook.png"), type: "facebook"},
                    {img: require(".././assets/img/login/third/twiiter.png"), type: "twitter"},
                    {img: require(".././assets/img/login/third/ins.png"), type: "ins"}
                ],
                dialogPhoto: false, // 手机号注册蒙版
                dialogEmail: false, // 邮箱注册蒙版
                // 修改密码表单
                passwordForm: {
                    password: '', // 密码
                    confirmPassword: '', // 确认密码
                    passwordFlag: false, // 密码标识
                    oldPassword: '', //原始密码
                    passwordTip: '', // 密码提示
                    confirmPasswordFlag: false, // 确认密码标识
                    confirmPasswordTip: '', // 确认密码提示
                    oldPasswordFlag: false, // 原始密码标识
                    oldPasswordTip: '', // 原始密码提示
                },
                // 手机号注册 表单
                photoForm: {
                    photoNum: '', // 手机号
                    photoCode: '', // 手机验证码
                    photoPwd: '', // 密码
                    photoConfirmPwd: '', // 确认密码
                    photoNumFlag: false, // 手机号标识
                    photoNumTip: '', // 手机号提示
                    photoCodeFlag: false, // 验证码标识
                    photoCodeTip: '', // 验证码提示
                    photoPwdFlag: false, // 密码标识
                    photoPwdTip: '', // 密码提示
                    photoConfirmPwdFlag: false, // 确认密码标识
                    photoConfirmPwdTip: '', // 确认密码提示
                    ifCode: false, // 是否获取验证码
                    isChecked: false, // 是否同意协议
                },
                // 邮箱注册表单
                emailForm: {
                    emailNum: '', // 邮箱
                    emailCode: '', // 邮箱验证码
                    emailPwd: '', // 密码
                    emailConfirmPwd: '', // 确认密码
                    emailNumFlag: false, // 邮箱标识
                    emailNumTip: '', // 邮箱提示
                    emailCodeFlag: false, // 邮箱验证码标识
                    emailCodeTip: '', // 邮箱验证码提示
                    emailPwdFlag: false, // 密码标识
                    emailPwdTip: '', // 密码提示
                    emailConfirmPwdFlag: false, // 确认密码标识
                    emailConfirmPwdTip: '', // 确认密码提示
                    ifCode: false, // 是否获取验证码
                    isChecked: false, // 是否同意协议
                },
                // 手机号倒计时
                codeNum: this.allTime, // 验证码值
                phoneTimer: null, // 验证码定时器
                // 邮箱倒计时
                emailNum: this.allTime, // 验证码初始化值
                emailTimer: null, // 验证码定时器
                dialogVisiblePassword: false, // 找回密码弹出层
                // 找回密码表单
                forgotItem: {
                    userName: '', // 账户名
                    photoNum: '', // 手机号
                    photoCode: '', // 手机验证码
                    photoPwd: '', // 密码
                    photoConfirmPwd: '', // 确认密码
                    userNameFlag: false, // 账户名标识
                    userNameTip: '', // 账户名提示
                    photoNumFlag: false, // 手机号标识
                    photoNumTip: '', // 手机号提示
                    photoCodeFlag: false, // 验证码标识
                    photoCodeTip: '', // 验证码提示
                    photoPwdFlag: false, // 密码标识
                    photoPwdTip: '', // 密码提示
                    photoConfirmPwdFlag: false, // 确认密码标识
                    photoConfirmPwdTip: '', // 确认密码提示
                    ifCode: false, // 是否获取验证码
                    emailOrPhone: false, // 手机号模板还是邮箱模板
                    emailNum: '', // 邮箱地址
                    emailCode: '', // 邮箱验证码
                    emailNumFlag: false, // 邮箱标识
                    emailNumTip: '', // 邮箱提示
                    emailCodeFlag: false, // 邮箱验证码标识
                    emailCodeTip: '', // 邮箱验证码提示
                    ifCodeEmail: false, // 是否获取邮箱验证码
                },
                forgotNum: this.allTime, // 忘记密码手机倒计时验证码初始化值
                forgotTimer: null, // 验证码定时器
                dialogActivity: false, // 注册成功弹出层
                regTipTimeNum: this.countTime, // 注册成功提示秒数
                regTipTimer: null, // 注册成功提示定时器
                forgotNumByEmail: this.allTime, // 忘记密码邮箱倒计时验证码初始化值
                forgotTimerByEmail: null, // 验证码定时器
            }
        },
        methods: {
            // 重置注册成功提示框
            resetRegTip() {
                let _t = this;
                _t.dialogActivity = false;
                clearInterval(_t.regTipTimer);
                _t.regTipTimeNum = _t.countTime;
                // 没有登录成功
                if (_t.$route.name === "M_USER_INFO") {
                    _t.$bus.emit("getUserInfo", true);
                } else {
                    _t.$router.push({name: "M_USER_INFO"});
                }
            },
            // 忘记密码按钮
            forgotBtn() {
                let _t = this;
                _t.dialogVisible = false; // 隐藏登录蒙版
                _t.dialogVisiblePassword = true; // 显示忘记密码蒙版
            },
            // 忘记密码获取 --- 通过手机号
            getForgotCode() {
                let _t = this;
                // 校验手机号
                _t.blurInputPhone(_t.forgotItem, 'photoNumFlag', _t.forgotItem.photoNum);
                if (_t.forgotItem.photoNumFlag === true) {
                    return;
                }
                _t.forgotItem.ifCode = true; // 禁用获取验证码按钮
                _t.$api.post('user/getSecurityCode', {
                    userPhoneNumber: _t.forgotItem.photoNum.trim(), // 手机号
                    templateCodeType: 1, // 类型 0：注册  1：修改
                    language: _t.formItem.language, // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200: // 获取成功
                            // 获取成功开启倒计时
                            _t.forgotTimer = setInterval(function () {
                                _t.forgotNum--;
                            }, 1000);
                            break;
                        case 204: // 发送失败
                            _t.$message.error(_t.$t('public.changeError'));
                            _t.resetForgetNum();
                            break;
                        default: // 获取失败
                            _t.resetForgetNum();
                            _t.$message.error(res.message);
                            break;
                    }
                });
            },
            // 忘记密码获取验证码 --- 通过邮箱地址
            getForgotCodeByEmail() {
                let _t = this;
                // 校验邮箱地址
                _t.blurInputEmail(_t.forgotItem, 'emailNumFlag', _t.forgotItem.emailNum);
                if (_t.forgotItem.emailNumFlag === true) {
                    return;
                }
                _t.forgotItem.ifCodeEmail = true; // 禁用获取验证码按钮
                _t.$api.post('user/sender', {
                    userEmail: _t.forgotItem.emailNum.trim(), // 邮箱地址
                    type: 1, // 类型 0：注册  1：修改
                    language: _t.formItem.language, // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200: // 获取成功
                            // 获取成功开启倒计时
                            _t.forgotTimerByEmail = setInterval(function () {
                                _t.forgotNumByEmail--;
                            }, 1000);
                            break;
                        case 204: // 发送失败
                            _t.$message.error(_t.$t('public.changeError'));
                            _t.resetForgetNumByEmail();
                            break;
                        default: // 获取失败
                            _t.resetForgetNumByEmail();
                            _t.$message.error(res.message);
                            break;
                    }
                });
            },
            // 发送忘记密码手机验证码 -- 通过手机号
            resetForgetNum() {
                let _t = this;
                clearInterval(_t.forgotTimer);
                _t.forgotItem.ifCode = false;
                _t.forgotNum = _t.allTime;
            },
            // 发送忘记密码邮箱验证码 -- 通过邮箱地址
            resetForgetNumByEmail() {
                let _t = this;
                clearInterval(_t.forgotTimerByEmail);
                _t.forgotItem.ifCodeEmail = false;
                _t.forgotNumByEmail = _t.allTime;
            },
            // 保存忘记密码接口 -- 通过手机号
            saveForgotPwdByPhone() {
                let _t = this;
                // 校验账户名
                // _t.blurInput(_t.forgotItem, 'userNameFlag', _t.forgotItem.userName, 'userNameTip');
                // 校验手机号
                _t.blurInputPhone(_t.forgotItem, 'photoNumFlag', _t.forgotItem.photoNum);
                // 校验手机验证码
                _t.blurIsNotNull(_t.forgotItem, 'photoCodeFlag', _t.forgotItem.photoCode, 'photoCodeTip');
                // 校验未通过 拦截
                if (_t.forgotItem.photoNumFlag === true || _t.forgotItem.photoCodeFlag === true) {
                    return;
                }
                // 校验新密码
                _t.blurInputPwd(_t.forgotItem, 'photoPwdFlag', _t.forgotItem.photoPwd, _t.forgotItem.photoConfirmPwd);
                // 校验确认密码
                _t.blurInputPwd(_t.forgotItem, 'photoConfirmPwdFlag', _t.forgotItem.photoPwd, _t.forgotItem.photoConfirmPwd);
                // 可以提交
                if (_t.forgotItem.userNameFlag === false
                    && _t.forgotItem.photoNumFlag === false
                    && _t.forgotItem.photoCodeFlag === false
                    && _t.forgotItem.photoPwdFlag === false
                    && _t.forgotItem.photoConfirmPwdFlag === false) {
                    _t.$api.post('user/updatePwdByPhone', {
                        userName: _t.forgotItem.userName.trim(), // 账户名
                        userPhoneNumber: _t.forgotItem.photoNum.trim(), // 手机号
                        securityCode: _t.forgotItem.photoCode.trim(), // 验证码
                        userPwd: _t.$md5('#$%TEAMWANG%$#' + _t.forgotItem.photoPwd.trim() + '#$%JACKSONWANG%$#'), // 新密码
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 修改成功
                                _t.$message.success(_t.$t('public.changeSuccess'));
                                _t.resetForgot();
                                break;
                            case 2006: // 账户名或手机号出错
                                _t.$message.error(_t.$t('forgotPwd.userNameError'));
                                break;
                            case 2019: // 无效验证码
                                _t.$message.error(_t.$t('forgotPwd.codeInvalid'));
                                break;
                            case 2020: // 验证码错误
                                _t.$message.error(_t.$t('forgotPwd.codeError'));
                                break;
                            default: // 修改失败
                                _t.$message.error(_t.$t('public.changeError'));
                                break;
                        }
                    });
                }
            },
            // 保存忘记密码接口 -- 通过邮箱
            saveForgotPwdByEmail() {
                let _t = this;
                // 校验邮箱地址
                _t.blurInputEmail(_t.forgotItem, 'emailNumFlag', _t.forgotItem.emailNum);
                // 校验邮箱验证码
                _t.blurIsNotNull(_t.forgotItem, 'emailCodeFlag', _t.forgotItem.emailCode, 'emailCodeTip');
                // 校验未通过 拦截
                if (_t.forgotItem.emailNumFlag === true || _t.forgotItem.emailCodeFlag === true) {
                    return;
                }
                // 校验新密码
                _t.blurInputPwd(_t.forgotItem, 'photoPwdFlag', _t.forgotItem.photoPwd, _t.forgotItem.photoConfirmPwd);
                // 校验确认密码
                _t.blurInputPwd(_t.forgotItem, 'photoConfirmPwdFlag', _t.forgotItem.photoPwd, _t.forgotItem.photoConfirmPwd);
                // 可以提交
                if (_t.forgotItem.emailNumFlag === false
                    && _t.forgotItem.emailCodeFlag === false
                    && _t.forgotItem.photoPwdFlag === false
                    && _t.forgotItem.photoConfirmPwdFlag === false) {
                    _t.$api.post('user/emailUpdataPassword', {
                        userEmail: _t.forgotItem.emailNum.trim(), // 邮箱地址
                        security: _t.forgotItem.emailCode.trim(), // 验证码
                        userNewPwd: _t.$md5('#$%TEAMWANG%$#' + _t.forgotItem.photoPwd.trim() + '#$%JACKSONWANG%$#'), // 新密码
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 修改成功
                                _t.$message.success(_t.$t('public.changeSuccess'));
                                _t.resetForgot();
                                break;
                            case 1003: // 无效验证码
                                _t.$message.error(_t.$t('forgotPwd.codeInvalid'));
                                break;
                            case 2004: // 验证码错误
                                _t.$message.error(_t.$t('forgotPwd.codeError'));
                                break;
                            case 2006: // 账户名或邮箱出错
                                _t.$message.error(_t.$t('forgotPwd.userNameError'));
                                break;
                            default: // 修改失败
                                _t.$message.error(_t.$t('public.changeError'));
                                break;
                        }
                    });
                }
            },
            // 重置忘记密码表单
            resetForgot() {
                let _t = this;
                _t.dialogVisiblePassword = false;
                _t.forgotItem.userName = ''; // 账户名
                _t.forgotItem.photoNum = ''; // 手机号
                _t.forgotItem.photoCode = ''; // 手机验证码
                _t.forgotItem.photoPwd = ''; // 密码
                _t.forgotItem.photoConfirmPwd = ''; // 确认密码
                _t.forgotItem.userNameFlag = false; // 账户名标识
                _t.forgotItem.userNameTip = ''; // 账户名提示
                _t.forgotItem.photoNumFlag = false; // 手机号标识
                _t.forgotItem.photoNumTip = ''; // 手机号提示
                _t.forgotItem.photoCodeFlag = false; // 验证码标识
                _t.forgotItem.photoCodeTip = ''; // 验证码提示
                _t.forgotItem.photoPwdFlag = false; // 密码标识
                _t.forgotItem.photoPwdTip = ''; // 密码提示
                _t.forgotItem.photoConfirmPwdFlag = false; // 确认密码标识
                _t.forgotItem.photoConfirmPwdTip = ''; // 确认密码提示
                _t.forgotItem.emailOrPhone = false; // 手机号模板还是邮箱模板
                _t.forgotItem.emailNum = ''; // 邮箱地址
                _t.forgotItem.emailCode = ''; // 邮箱验证码
                _t.forgotItem.emailNumFlag = false; // 邮箱标识
                _t.forgotItem.emailNumTip = ''; // 邮箱提示
                _t.forgotItem.emailCodeFlag = false; // 邮箱验证码标识
                _t.forgotItem.emailCodeTip = ''; // 邮箱验证码提示
                _t.forgotItem.ifCodeEmail = false; // 是否获取邮箱验证码
            },
            // 点击logo
            clickLogo() {
                let _t = this;
                let routerName = _t.$route.name;
                // 新闻详情页面不跳转首页
                if (routerName !== 'M_HOME' && routerName !== 'NEWS_DETAILS' && routerName !== 'M_NEWS_DETAILS') {
                    _t.$jump.toJumpPage('HOME', 'M_HOME');
                } else if (routerName === 'M_HOME') {
                    _t.$bus.emit('getAnimation_mobile', true);
                }
            },
            // 获取用户信息 --- 头像
            getUserInfo() {
                let _t = this;
                let userId = _t.getCookie("WJE_USER_ID");
                if (userId !== undefined && userId !== null && userId !== "null") {
                    _t.$api.post("user/getById", {
                        id: userId
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 查询成功
                                if (res.data !== undefined && res.data !== null) {
                                    let resData = res.data;
                                    // 判断只有未锁定的账户才获取头像
                                    if (resData.status !== undefined && resData.status !== null && resData.status === 1) {
                                        if (resData.headImg !== undefined && resData.headImg !== null) {
                                            _t.formItem.headImg = res.data.headImg.indexOf('http') !== -1 ? res.data.headImg : _t.$api.imgUrl() + res.data.headImg;
                                        } else {
                                            _t.formItem.headImg = '';
                                        }
                                    } else {
                                        // 清除用户登录信息
                                        _t.outSystem();
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    });
                }
            },
            // 获取菜单
            getData() {
                let _t = this;
                _t.$api.post('menu/listMenuInfoByMenuLevel', {
                    parentid: '0',
                    menuType: 0, // 0: 官网菜单 1:后台管理系统菜单
                    language: _t.formItem.language, // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null) {
                                let menuList = res.data;
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
            },
            // 点击头部头像
            handleCommand(item) {
                let _t = this;
                if (item === "pwd") {
                    // 修改密码
                    _t.dialogPassword = true;
                    _t.isShowMenu = false; // 不显示菜单
                } else if (item === "personal") {
                    // 个人资料
                    _t.$router.push({name: "PERSONAGE_DATA"});
                }
            },
            // 切换语言
            changeLanguage() {
                var _t = this;
                if (_t.$route.name === "NEWS_DETAILS") {
                    _t.$router.push({name: "NEWS"});
                } else if (_t.$route.name === "END_DETAILS") {
                    _t.$router.push({name: "ENDORSEMENT"});
                }
                localStorage.setItem("WJE_LANGUAGE", _t.formItem.language);
                window.location.reload();
            },
            // 点击LOGIN按钮显示弹出层
            loginBtn() {
                let _t = this;
                _t.beforeLogin();
                _t.isShowMenu = false;
                _t.dialogVisible = true;
            },
            // 重置登录
            beforeLogin() {
                let _t = this;
                _t.dialogVisible = false; // 登录弹出层
                _t.loginForm.username = ''; // 账户名
                _t.loginForm.password = ''; // 密码
                _t.loginForm.radio = false; // 记住密码
                _t.loginForm.userNameFlag = false; // 账户名标识
                _t.loginForm.userNameTip = ''; // 账户名提示
                _t.loginForm.passwordFlag = false; // 密码标识
                _t.loginForm.passwordTip = ''; // 密码提示
            },
            // 点击join Now按钮显示弹出层
            joinNowBtn() {
                let _t = this;
                _t.dialogPhoto = true; // 显示手机号注册
                _t.isShowMenu = false; // 不显示菜单
            },
            // 点击退出按钮清除前端缓存
            outSystem() {
                let _t = this;
                // 显示LOGIN按钮
                _t.registerState = false;
                // 强制回首页
                _t.$jump.toJumpPage('HOME', 'M_HOME');
                // 修改密码蒙版关闭
                _t.dialogPassword = false;
                // 菜单蒙版关闭
                _t.isShowMenu = false;
                // 清除缓存用户id
                _t.delCookie("WJE_USER_ID");
                // 清除缓存密码
                _t.delCookie("WJE_PWD");
                // 清除登录缓存
                _t.delCookie("WJE_IS_LOGIN");
                // 清除用户昵称
                _t.delCookie("WJE_NICK_NAME");
                // 清除用户头像
                _t.delCookie("WJE_HEAD_IMG");
                // 清除用户状态
                _t.delCookie("WJE_USER_STATUS");
                // 清除用户token
                _t.delCookie('WJE_USER_TOKEN');
                // 是否播放闪频动画
                document.body.setAttribute('video_play', false);
                // 首页是否显示vip活动
                document.body.setAttribute('activity_show_home', true);
                // vip是否显示vip活动
                document.body.setAttribute('activity_show_vip', true);
            },
            // 失去焦点校验
            blurInput(item, flag, val, tip) {
                let _t = this;
                if (val.trim() === '') {
                    item[flag] = true;
                    item[tip] = flag === "userNameFlag" ? _t.$t("loginRes.loginUser") : _t.$t("loginRes.loginPwd");
                } else {
                    item[flag] = false;
                    item[tip] = '';
                }
            },
            // 点击登录按钮
            handelLogin(event) {
                var _t = this;
                event.preventDefault();
                // 校验账户名
                _t.blurInput(_t.loginForm, "userNameFlag", _t.loginForm.username, "userNameTip");
                // 校验密码
                _t.blurInput(_t.loginForm, "passwordFlag", _t.loginForm.password, "passwordTip");
                if (_t.loginForm.userNameFlag === false && _t.loginForm.passwordFlag === false) {
                    _t.$api.post("user/login", {
                        username: _t.loginForm.username.trim(), // 账户名
                        userpwd: _t.$md5('#$%TEAMWANG%$#' + _t.loginForm.password.trim() + '#$%JACKSONWANG%$#'), // 密码
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 成功
                                // 清空账户名和密码
                                _t.beforeLogin();
                                // 登录页获取到未填写信息
                                if (res.data.status === 2) {
                                    _t.setCookie("WJE_USER_ID", res.data.id);
                                    // 状态未登录
                                    _t.registerState = false;
                                    // 没有登录成功
                                    if (_t.$route.name === "M_USER_INFO") {
                                        _t.$bus.emit("getUserInfo", true);
                                    } else {
                                        _t.$router.push({name: "M_USER_INFO"});
                                    }
                                } else {
                                    // 登录成功 状态已登录
                                    _t.registerState = true;
                                    // 接入友盟统计
                                    _czc.push(['_trackEvent', '登录', '点击','登录按钮']);
                                    // 判断当前路由是否用户信息页
                                    if (_t.$route.name === "M_USER_INFO") {
                                        _t.$router.push({name: "M_HOME"});
                                    }
                                    // 设置用户登录头像
                                    if (res.data.headImg !== undefined && res.data.headImg !== null) {
                                        _t.formItem.headImg = _t.$api.imgUrl() + res.data.headImg;
                                    } else {
                                        _t.formItem.headImg = '';
                                    }
                                    // 缓存用户信息
                                    _t.setCookie("WJE_USER_ID", res.data.id);
                                    _t.setCookie("WJE_USER_STATUS", res.data.status);
                                    _t.setCookie("WJE_IS_LOGIN", true);
                                    _t.setCookie("WJE_NICK_NAME", res.data.userNickName);
                                    _t.setCookie("WJE_HEAD_IMG", _t.formItem.headImg);
                                    if (_t.$route.name === "M_VIP_PRIVATE") {
                                        _t.$bus.emit("loginVip", true);
                                    }
                                    // 登录之后判断 是否 lifeStyle 登录
                                    if (_t.$route.name === 'M_LIFESTYLE') {
                                        _t.$bus.emit('getDynamicUser_mobile', true);
                                    }
                                }
                                break;
                            case 1000: // 账户锁定
                                _t.loginForm.userNameFlag = true;
                                _t.loginForm.userNameTip = _t.$t('loginRes.userNameLock');
                                break;
                            case 1002: // 用户不存在
                                _t.loginForm.userNameFlag = true;
                                _t.loginForm.userNameTip = _t.$t('loginRes.userNameNotExist');
                                break;
                            case 1008: // 密码错误
                                _t.loginForm.passwordFlag = true;
                                _t.loginForm.passwordTip = _t.$t('loginRes.passwordError');
                                break;
                            default: // 异常
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }
            },
            // 点击图标跳转第三方链接
            imgClick(item) {
                let _t = this;
                // 部分三方登录注释
                if (item.type === 'wechat' || item.type === 'facebook' || item.type === 'twitter' || item.type === 'ins') {
                    _t.$message.warning(_t.$t('public.ing'));
                    return;
                }
                _t.$api.get("user/thirdPartyLogin/" + item.type, {}, function (res) {
                    switch (res.status) {
                        case 200: // 回调成功
                            if (res.url !== undefined && res.url !== null) {
                                window.location.href = res.url;
                            }
                            break;
                        default: // 回调失败
                            break;
                    }
                });
            },
            // 登录页面注册按钮方法
            register() {
                var _t = this;
                _t.dialogPhoto = true; // 手机号注册显示
                _t.dialogVisible = false; // 登录
            },
            // 校验原始密码
            blurInputOldPassword(item, flag, val, tip) {
                let _t = this;
                if (val.trim() === '') {
                    item[flag] = true;
                    item[tip] = _t.$t("public.required");
                } else {
                    item[flag] = false;
                    item[tip] = '';
                }
            },
            // 失去焦点校验密码
            blurInputPassword(item, flag, pwd, conPwd) {
                var _t = this;
                if (flag === "passwordFlag") {
                    // 密码输入框
                    if (pwd.trim() === '') {
                        item[flag] = true;
                        item["passwordTip"] = _t.$t("public.required");
                    } else {
                        item[flag] = false;
                        item["passwordTip"] = '';
                    }
                } else {
                    // 确认密码输入框
                    if (conPwd.trim() === '') {
                        item[flag] = true;
                        item["confirmPasswordTip"] = _t.$t("public.required");
                    } else {
                        // 校验是否一致
                        if (conPwd.trim() !== pwd.trim()) {
                            item[flag] = true;
                            item["confirmPasswordTip"] = _t.$t("public.password");
                        } else {
                            item[flag] = false;
                            item["confirmPasswordTip"] = '';
                        }
                    }
                }
            },
            // 重置密码弹出层
            resetPwdBox() {
                let _t = this;
                _t.dialogPassword = false;
                _t.passwordForm.password = ''; // 密码
                _t.passwordForm.passwordFlag = false; // 密码标识
                _t.passwordForm.passwordTip = ''; // 密码提示
                _t.passwordForm.oldPassword = ''; // 旧密码
                _t.passwordForm.oldPasswordFlag = false; // 旧密码标识
                _t.passwordForm.oldPasswordTip = ''; // 旧密码提示
                _t.passwordForm.confirmPassword = ''; // 确认密码
                _t.passwordForm.confirmPasswordFlag = false; // 确认密码标识
                _t.passwordForm.confirmPasswordTip = ''; // 确认密码提示
            },
            // 点击提交修改密码
            addPassword() {
                let _t = this;
                // 校验原始密码
                _t.blurInputOldPassword(_t.passwordForm, 'oldPasswordFlag', _t.passwordForm.oldPassword, 'oldPasswordTip');
                // 校验密码
                _t.blurInputPassword(_t.passwordForm, "passwordFlag", _t.passwordForm.password, _t.passwordForm.confirmPassword);
                // 校验确认密码
                _t.blurInputPassword(_t.passwordForm, "confirmPasswordFlag", _t.passwordForm.password, _t.passwordForm.confirmPassword);
                // 用户id
                let userId = _t.getCookie("WJE_USER_ID");
                if (userId !== null && userId !== "null") {
                    // 可以提交
                    if (_t.passwordForm.passwordFlag === false
                        && _t.passwordForm.oldPasswordFlag === false
                        && _t.passwordForm.confirmPasswordFlag === false) {
                        _t.$api.post("user/updateUserPwd", {
                            id: userId, // 用户id
                            userPwd: _t.$md5('#$%TEAMWANG%$#' + _t.passwordForm.oldPassword.trim() + '#$%JACKSONWANG%$#'), //原始密码
                            newPwd: _t.$md5('#$%TEAMWANG%$#' + _t.passwordForm.password.trim() + '#$%JACKSONWANG%$#') // 密码
                        }, function (res) {
                            switch (res.status) {
                                case 200:
                                    _t.resetPwdBox();
                                    _t.$message({
                                        type: 'warning',
                                        message: _t.$t("public.changeSuccess"),
                                        onClose: function () {
                                            _t.outSystem();
                                        }
                                    });
                                    break;
                                default:
                                    _t.$message.error(res.message);
                                    break;
                            }
                        });
                    }
                } else {
                    _t.$message.error(_t.$t("public.userIdNull"));
                }
            },
            // 第三方登录初始化判断
            initThird() {
                let _t = this;
                let code = _t.$recursive.getUrlKey("code");
                if (!code) {
                    return;
                }
                let state = _t.$recursive.getUrlKey("state");
                if (!state) {
                    return;
                }
                // 第一层判断 是否登录
                let isLogin = _t.getCookie("WJE_IS_LOGIN");
                if (isLogin !== null
                    && isLogin !== "null"
                    && (isLogin === true || isLogin === "true")) {
                    // 已登录
                } else {
                    // 未登录 拦截然后去登录
                    if (window.location.pathname.indexOf("qq") !== -1 && _t.$route.name !== "M_USER_INFO") {
                        // 拦截qq
                        _t.loginThird("qq", code, state);
                    } else if (window.location.pathname.indexOf("wechat") !== -1 && _t.$route.name !== "M_USER_INFO") {
                        // 拦截微信
                        _t.loginThird("wechat", code, state);
                    } else if (window.location.pathname.indexOf("weibo") !== -1 && _t.$route.name !== "M_USER_INFO") {
                        // 拦截微博
                        _t.loginThird("weibo", code, state);
                    } else if (window.location.pathname.indexOf("facebook") !== -1 && _t.$route.name !== "M_USER_INFO") {
                        // 拦截facebook
                        _t.loginThird("facebook", code, state);
                    } else if (window.location.pathname.indexOf("twitter") !== -1 && _t.$route.name !== "M_USER_INFO") {
                        // 拦截 twitter
                        _t.loginThird("twitter", code, state);
                    } else if (window.location.pathname.indexOf("insgram") !== -1 && _t.$route.name !== "M_USER_INFO") {
                        // 拦截 insgram
                        _t.loginThird("insgram", code, state);
                    }
                }
            },
            // 第三方获取用户信息的接口
            loginThird(third, code, state) {
                let _t = this;
                _t.$api.get("user/callback/" + third + "/" + code + "/" + state, {}, function (res) {
                    switch (res.status) {
                        case 200: // 成功
                            if (res.data !== undefined && res.data !== null) {
                                if (res.data.status === 2) {
                                    _t.setCookie("WJE_USER_ID", res.data.id);
                                    // 状态未登录
                                    _t.registerState = false;
                                    // 没有登录成功
                                    if (_t.$route.name === "M_USER_INFO") {
                                        _t.$bus.emit("getUserInfo", true);
                                    } else {
                                        _t.$router.push({name: "M_USER_INFO"});
                                    }
                                    _t.$router.push({name: "M_USER_INFO"});
                                } else if (res.data.status === 1) {
                                    // 登录成功 状态已登录
                                    _t.registerState = true;
                                    // 接入友盟统计
                                    _czc.push(['_trackEvent', '登录', '点击','第三方登录']);
                                    // 判断当前路由是否用户信息页
                                    if (_t.$route.name === "M_USER_INFO") {
                                        _t.$router.push({name: "M_HOME"});
                                    }
                                    // 设置用户登录头像
                                    if (res.data.headImg !== undefined && res.data.headImg !== null) {
                                        _t.formItem.headImg = res.data.headImg;
                                    } else {
                                        _t.formItem.headImg = '';
                                    }
                                    // 缓存token
                                    _t.setCookie('WJE_USER_TOKEN', res.token);
                                    // 缓存用户信息
                                    _t.setCookie("WJE_USER_ID", res.data.id);
                                    _t.setCookie("WJE_USER_STATUS", res.data.status);
                                    _t.setCookie("WJE_IS_LOGIN", true);
                                    _t.setCookie("WJE_NICK_NAME", res.data.userName);
                                    _t.setCookie("WJE_HEAD_IMG", res.data.headImg);
                                    // 登录之后判断 是否 lifeStyle 登录
                                    if (_t.$route.name === 'M_LIFESTYLE') {
                                        _t.$bus.emit('getDynamicUser_mobile', true);
                                    }
                                } else if (res.data.status === 0) {
                                    _t.$message.error(_t.$t('loginRes.lockAccount'));
                                }
                            }
                            break;
                        default:
                            // 登录失败
                            let isLogin = _t.getCookie('WJE_IS_LOGIN');
                            if (isLogin === true || isLogin === 'true') {
                            } else {
                                _t.$message.error(res.message);
                            }
                            break;
                    }
                });
            },
            // 重置手机号注册
            resetPhoto() {
                let _t = this;
                _t.dialogPhoto = false; // 弹出层
                _t.photoForm.photoNum = ''; // 手机号
                _t.photoForm.photoNumFlag = false; // 手机号标识
                _t.photoForm.photoNumTip = ''; // 手机号提示
                _t.photoForm.photoCode = ''; // 验证码
                _t.photoForm.photoCodeFlag = false; // 验证码标识
                _t.photoForm.photoCodeTip = ''; // 验证码提示
                _t.photoForm.photoPwd = ''; // 密码
                _t.photoForm.photoPwdFlag = false; // 密码标识
                _t.photoForm.photoPwdTip = ''; // 密码提示
                _t.photoForm.photoConfirmPwd = ''; // 确认密码
                _t.photoForm.photoConfirmPwdFlag = false; // 确认密码标识
                _t.photoForm.photoConfirmPwdTip = ''; // 确认密码提示
            },
            // 获取手机短信验证码
            getPhoneCode() {
                let _t = this;
                // 校验手机号
                _t.blurInputPhone(_t.photoForm, 'photoNumFlag', _t.photoForm.photoNum);
                if (_t.photoForm.photoNumFlag === true) {
                    return;
                }
                _t.photoForm.ifCode = true; // 禁用获取验证码按钮
                _t.$api.post('user/getSecurityCode', {
                    userPhoneNumber: _t.photoForm.photoNum.trim(), // 手机号
                    templateCodeType: 0, // 类型 0：注册  1：修改
                    language: _t.formItem.language, // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200: // 获取成功
                            // 获取成功开启倒计时
                            _t.phoneTimer = setInterval(function () {
                                _t.codeNum--;
                            }, 1000);
                            break;
                        case 204: // 发送失败
                            _t.$message.error(_t.$t('public.changeError'));
                            _t.resetCodeNum();
                            break;
                        default: // 获取失败
                            _t.resetCodeNum();
                            _t.$message.error(res.message);
                            break;
                    }
                });
            },
            // 重置发送手机验证码
            resetCodeNum() {
                let _t = this;
                clearInterval(_t.phoneTimer);
                _t.photoForm.ifCode = false;
                _t.codeNum = _t.allTime;
            },
            // 校验手机号
            blurInputPhone(item, flag, val) {
                let _t = this;
                if (val.trim() === '') {
                    item[flag] = true;
                    _t.$message.warning(_t.$t("phoneRes.isNotNull"));
                } else {
                    item[flag] = false;
                }
            },
            // 校验验证码是否为空
            blurIsNotNull(item, flag, val, tip) {
                let _t = this;
                if (val.trim() === '') {
                    item[flag] = true;
                    item[tip] = _t.$t("public.required");
                    return false;
                } else {
                    item[flag] = false;
                    item[tip] = '';
                }
            },
            // 手机号校验密码
            blurInputPwd(item, flag, pwd, conPwd) {
                let _t = this;
                if (flag === "photoPwdFlag") {
                    // 密码输入框
                    if (pwd.trim() === '') {
                        item[flag] = true;
                        item["photoPwdTip"] = _t.$t("public.required");
                    } else {
                        item[flag] = false;
                        item["photoPwdTip"] = '';
                    }
                } else {
                    // 确认密码输入框
                    if (conPwd.trim() === '') {
                        item[flag] = true;
                        item["photoConfirmPwdTip"] = _t.$t("public.required");
                    } else {
                        // 校验是否一致
                        if (conPwd.trim() !== pwd.trim()) {
                            item[flag] = true;
                            item["photoConfirmPwdTip"] = _t.$t("public.password");
                        } else {
                            item[flag] = false;
                            item["photoConfirmPwdTip"] = '';
                        }
                    }
                }
            },
            // 弹出蒙版
            userAgreement() {
                let _t = this;
                _t.dialogUser = true;
                _t.$api.post('vip/getConfidentiality', {
                    vipId: '0', // 0: 注册 1: 支付 2: 保密公告
                    language: _t.formItem.language, // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200: // 查询成功
                            if (res.data !== undefined && res.data !== null && res.data.length !== 0) {
                                // 注册协议
                                if (res.data[0].ConfidentialNoticeContextStr !== undefined && res.data[0].ConfidentialNoticeContextStr !== null) {
                                    let content = res.data[0].ConfidentialNoticeContextStr;
                                    content = content.replace(/\r\n|\n/gi, '<br/>');
                                    _t.formItem.content = content;
                                }
                            } else {
                                _t.formItem.content = '';
                            }
                            break;
                        case 204: // 未查询到结果
                            _t.formItem.content = '';
                            break;
                        default:
                            _t.formItem.content = '';
                            _t.$message.error(_t.$t('public.queryError'));
                            break;
                    }
                });
            },
            // 切换注册方式
            resBtn(flag) {
                let _t = this;
                _t.isShowMenu = false; // 不显示菜单
                if (flag === 'phone') {
                    // 去邮箱注册
                    _t.resetPhoto();
                    _t.dialogEmail = true;
                } else {
                    // 去手机注册
                    _t.resetEmail();
                    _t.dialogPhoto = true;
                }
            },
            // 手机号注册
            phoneNumRes() {
                let _t = this;
                // 校验手机号
                _t.blurInputPhone(_t.photoForm, 'photoNumFlag', _t.photoForm.photoNum);
                // 校验验证码
                _t.blurIsNotNull(_t.photoForm, 'photoCodeFlag', _t.photoForm.photoCode, 'photoCodeTip');
                // 校验未通过 拦截
                if (_t.photoForm.photoNumFlag === true || _t.photoForm.photoCodeFlag === true) {
                    return;
                }
                // 校验密码和确认密码
                _t.blurInputPwd(_t.photoForm, 'photoPwdFlag', _t.photoForm.photoPwd, _t.photoForm.photoConfirmPwd);
                _t.blurInputPwd(_t.photoForm, 'photoConfirmPwdFlag', _t.photoForm.photoPwd, _t.photoForm.photoConfirmPwd);
                // 校验协议
                if (_t.photoForm.isChecked === false) {
                    _t.$message.error(_t.$t('loginRes.selectAgreement'));
                    return;
                }
                // 可以提交
                if (_t.photoForm.photoNumFlag === false
                    && _t.photoForm.photoCodeFlag === false
                    && _t.photoForm.photoPwdFlag === false
                    && _t.photoForm.isChecked === true
                    && _t.photoForm.photoConfirmPwdFlag === false) {
                    _t.$api.post('user/phoneRegister', {
                        userPhoneNumber: _t.photoForm.photoNum.trim(), // 手机号
                        security: _t.photoForm.photoCode.trim(), // 验证码
                        userPwd: _t.$md5('#$%TEAMWANG%$#' + _t.photoForm.photoPwd.trim() + '#$%JACKSONWANG%$#'), // 密码
                        newPwd: _t.$md5('#$%TEAMWANG%$#' + _t.photoForm.photoConfirmPwd.trim() + '#$%JACKSONWANG%$#'), // 确认密码
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 注册成功
                                // _t.$message.success(_t.$t('loginRes.registerSuccess'));
                                if (res.data.status === 2) {
                                    // 接入友盟统计
                                    _czc.push(['_trackEvent', '注册', '点击','手机号注册']);
                                    _t.setCookie("WJE_USER_ID", res.data.id);
                                    // 重置注册框
                                    _t.resetPhoto();
                                    // 显示注册成功提示
                                    _t.dialogActivity = true;
                                    // 启动倒计时定时器
                                    _t.regTipTimer = setInterval((function () {
                                        _t.regTipTimeNum--;
                                    }), 1000);
                                }
                                break;
                            case 1003: // 无效验证码
                                _t.photoForm.photoCodeFlag = true;
                                _t.photoForm.photoCodeTip = _t.$t('phoneRes.codeInvalid');
                                break;
                            case 2003: // 手机号已存在
                                _t.photoForm.photoNumFlag = true;
                                _t.$message.error(_t.$t('phoneRes.phoneExists'));
                                break;
                            case 2004: // 验证码错误
                                _t.photoForm.photoCodeFlag = true;
                                _t.photoForm.photoCodeTip = _t.$t('phoneRes.codeError');
                                break;
                            default: // 注册失败
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }
            },
            // 已有账号,去登陆
            toLogin(flag) {
                let _t = this;
                _t.dialogVisible = true;
                if (flag === 'account') {
                    _t.dialogRegister = false;
                } else if (flag === 'phone') {
                    _t.dialogPhoto = false;
                } else if (flag === 'email') {
                    _t.dialogEmail = false;
                }
            },
            // 校验邮箱格式
            blurInputEmail(item, flag, val) {
                let _t = this;
                if (val.trim() === '') {
                    item[flag] = true;
                    _t.$message.warning(_t.$t("emailRes.isNotNull"));
                } else {
                    // 校验邮箱格式
                    let reg = _t.$api.ruleEmail();
                    if (reg.test(val.trim()) === false) {
                        item[flag] = true;
                        _t.$message.warning(_t.$t("emailRes.isError"));
                    } else {
                        item[flag] = false;
                    }
                }
            },
            // 邮箱校验密码
            blurInputEmailPwd(item, flag, pwd, conPwd) {
                let _t = this;
                if (flag === "emailPwdFlag") {
                    // 密码输入框
                    if (pwd.trim() === '') {
                        item[flag] = true;
                        item["emailPwdTip"] = _t.$t("public.required");
                    } else {
                        item[flag] = false;
                        item["emailPwdTip"] = '';
                    }
                } else {
                    // 确认密码输入框
                    if (conPwd.trim() === '') {
                        item[flag] = true;
                        item["emailConfirmPwdTip"] = _t.$t("public.required");
                    } else {
                        // 校验是否一致
                        if (conPwd.trim() !== pwd.trim()) {
                            item[flag] = true;
                            item["emailConfirmPwdTip"] = _t.$t("public.password");
                        } else {
                            item[flag] = false;
                            item["emailConfirmPwdTip"] = '';
                        }
                    }
                }
            },
            // 重置邮箱注册
            resetEmail() {
                let _t = this;
                _t.dialogEmail = false; // 弹出层
                _t.emailForm.emailNum = ''; // 邮箱号
                _t.emailForm.emailNumFlag = false; // 邮箱号标识
                _t.emailForm.emailNumTip = ''; // 邮箱提示
                _t.emailForm.emailCode = ''; // 邮箱验证码
                _t.emailForm.emailCodeFlag = false; // 邮箱验证码标识
                _t.emailForm.emailCodeTip = ''; // 邮箱验证码提示
                _t.emailForm.emailPwd = ''; // 密码
                _t.emailForm.emailPwdFlag = false; // 密码标识
                _t.emailForm.emailPwdTip = ''; // 密码提示
                _t.emailForm.emailConfirmPwd = ''; // 确认密码
                _t.emailForm.emailConfirmPwdFlag = false; // 确认密码标识
                _t.emailForm.emailConfirmPwdTip = ''; // 确认密码提示
            },
            // 获取邮箱验证码
            getEmailCode() {
                let _t = this;
                // 校验邮箱
                _t.blurInputEmail(_t.emailForm, 'emailNumFlag', _t.emailForm.emailNum);
                if (_t.emailForm.emailNumFlag === true) {
                    return;
                }
                _t.emailForm.ifCode = true; // 禁用获取验证码按钮
                _t.$api.post('user/sender', {
                    userEmail: _t.emailForm.emailNum.trim(), // 邮件地址
                    type: 0, // 邮件类型 0：注册  1：修改
                    language: _t.formItem.language, // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200: // 获取成功
                            // 获取成功开启倒计时
                            _t.emailTimer = setInterval(function () {
                                _t.emailNum--;
                            }, 1000);
                            break;
                        case 204: // 发送失败
                            _t.$message.error(_t.$t('public.changeError'));
                            _t.resetEmailNum();
                            break;
                        default: // 获取失败
                            _t.resetEmailNum();
                            _t.$message.error(res.message);
                            break;
                    }
                });
            },
            // 邮箱验证码发送失败重置
            resetEmailNum() {
                let _t = this;
                clearInterval(_t.emailTimer);
                _t.emailForm.ifCode = false;
                _t.emailNum = _t.allTime;
            },
            // 邮箱注册
            emailNumRes() {
                let _t = this;
                // 校验邮箱
                _t.blurInputEmail(_t.emailForm, 'emailNumFlag', _t.emailForm.emailNum);
                // 校验验证码
                _t.blurIsNotNull(_t.emailForm, 'emailCodeFlag', _t.emailForm.emailCode, 'emailCodeTip');
                // 校验未通过 拦截
                if (_t.emailForm.emailNumFlag === true || _t.emailForm.emailCodeFlag === true) {
                    return;
                }
                // 校验密码和确认密码
                _t.blurInputEmailPwd(_t.emailForm, 'emailPwdFlag', _t.emailForm.emailPwd, _t.emailForm.emailConfirmPwd);
                _t.blurInputEmailPwd(_t.emailForm, 'emailConfirmPwdFlag', _t.emailForm.emailPwd, _t.emailForm.emailConfirmPwd);
                // 校验协议
                if (_t.emailForm.isChecked === false) {
                    _t.$message.error(_t.$t('loginRes.selectAgreement'));
                    return;
                }
                // 可以提交
                if (_t.emailForm.emailNumFlag === false
                    && _t.emailForm.emailCodeFlag === false
                    && _t.emailForm.emailPwdFlag === false
                    && _t.emailForm.isChecked === true
                    && _t.emailForm.emailConfirmPwdFlag === false) {
                    _t.$api.post('user/emailRegister', {
                        userEmail: _t.emailForm.emailNum.trim(), // 邮箱
                        security: _t.emailForm.emailCode.trim(), // 验证码
                        userPwd: _t.$md5('#$%TEAMWANG%$#' + _t.emailForm.emailPwd.trim() + '#$%JACKSONWANG%$#'), // 密码
                        newPwd: _t.$md5('#$%TEAMWANG%$#' + _t.emailForm.emailConfirmPwd.trim() + '#$%JACKSONWANG%$#'), // 确认密码
                    }, function (res) {
                        switch (res.status) {
                            case 200: // 注册成功
                                // _t.$message.success(_t.$t('loginRes.registerSuccess'));
                                if (res.data.status === 2) {
                                    // 接入友盟统计
                                    _czc.push(['_trackEvent', '注册', '点击','邮箱注册']);
                                    _t.setCookie("WJE_USER_ID", res.data.id);
                                    // 重置注册框
                                    _t.resetEmail();
                                    // 显示注册成功提示
                                    _t.dialogActivity = true;
                                    // 启动倒计时定时器
                                    _t.regTipTimer = setInterval((function () {
                                        _t.regTipTimeNum--;
                                    }), 1000);
                                }
                                break;
                            case 1003: // 无效验证码
                                _t.emailForm.emailCodeFlag = true;
                                _t.emailForm.emailCodeTip = _t.$t('phoneRes.codeInvalid');
                                break;
                            case 2002: // 邮箱已存在
                                _t.emailForm.emailNumFlag = true;
                                _t.$message.error(_t.$t('emailRes.emailExists'));
                                break;
                            case 2004: // 验证码错误
                                _t.emailForm.emailCodeFlag = true;
                                _t.emailForm.emailCodeTip = _t.$t('phoneRes.codeError');
                                break;
                            default: // 注册失败
                                _t.$message.error(res.message);
                                break;
                        }
                    });
                }
            },
            // 关闭弹出框
            resetUser() {
                let _t = this;
                _t.dialogUser = false;
            },
        },
        created() {
            let _t = this;
            // 初始化判断 是否已登录
            let user_id = _t.getCookie("WJE_USER_ID");
            let user_status = _t.getCookie("WJE_USER_STATUS");
            if (user_id !== null && user_status !== null && user_status.toString() === "1") {
                // 判断登录了 显示头像
                _t.registerState = true;
                _t.getUserInfo();
            } else {
                // 未登录
                _t.initThird();
            }
            // 判断语言标识
            let language = localStorage.getItem("WJE_LANGUAGE");
            if (language !== undefined && language !== null && language !== "null") {
                // 从缓存读
                _t.formItem.language = language;
            } else {
                // 缓存没有根据浏览器默认语言
                localStorage.setItem("WJE_LANGUAGE", navigator.language === "zh-CN" ? "zh_CN" : "en");
            }
            // 获取菜单
            _t.getData();
            // 总线传值
            _t.$bus.on("getPersonUserInfo", val => {
                if (val) {
                    _t.getUserInfo();
                }
            });
            _t.$bus.on("getHeadImg", val => {
                if (val) {
                    if (val !== null && val !== 'null') {
                        _t.formItem.headImg = val;
                    }
                }
            });
        },
        computed: {
            // 监听 url 详情页面的导航
            current() {
                let arr = this.$route.path.split("/");
                if (arr.length > 4) {
                    arr.pop();
                    return arr.join("/");
                } else {
                    return this.$route.path;
                }
            },
            // 计算手机的获取验证码的文本值
            codeText() {
                let _t = this;
                if (!_t.photoForm.ifCode) {
                    return _t.$t('loginRes.getCode');
                }
                return _t.codeNum + 's';
            },
            // 计算邮箱的获取验证码的文本值
            emailText() {
                let _t = this;
                if (!_t.emailForm.ifCode) {
                    return _t.$t('loginRes.getCode');
                }
                return _t.emailNum + 's';
            },
            // 计算忘记密码中获取验证码的文本值
            forgotText() {
                let _t = this;
                if (!_t.forgotItem.ifCode) {
                    return _t.$t('loginRes.getCode');
                }
                return _t.forgotNum + 's';
            },
            // 计算忘记密码中获取验证码的文本值
            forgotTextByEmail() {
                let _t = this;
                if (!_t.forgotItem.ifCodeEmail) {
                    return _t.$t('loginRes.getCode');
                }
                return _t.forgotNumByEmail + 's';
            },
            // 计算注册成功提示倒计时的文本值
            regTipText() {
                let _t = this;
                return _t.regTipTimeNum + 's';
            }
        },
        // 监听
        watch: {
            // 短信验证码
            codeNum(val) {
                let _t = this;
                if (val === 0) {
                    // 监听短信验证码的值 为0时清除定时器
                    _t.resetCodeNum();
                }
            },
            // 邮箱验证码
            emailNum(val) {
                let _t = this;
                if (val === 0) {
                    // 监听邮箱验证码的值 为0时清除定时器
                    _t.resetEmailNum();
                }
            },
            // 忘记密码 --- 手机号
            forgotNum(val) {
                var _t = this;
                if (val === 0) {
                    // 监听邮箱验证码的值 为0时清除定时器
                    _t.resetForgetNum();
                }
            },
            // 忘记密码 --- 邮箱地址
            forgotNumByEmail(val) {
                let _t = this;
                if (val === 0) {
                    // 监听邮箱验证码的值 为0时清除定时器
                    _t.resetForgetNumByEmail();
                }
            },
            // 注册成功提示
            regTipTimeNum(val) {
                let _t = this;
                if (val === -1) {
                    // 重置提示
                    _t.resetRegTip();
                }
            }
        }
    }
</script>

<style scoped>
    .mobileHeader {
        height: 60px;
        line-height: 60px;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        border-bottom: 1px solid #2c2c2c;
    }

    .mobile_logo {
        height: 30px;
    }

    .mobile_menu {
        height: 20px;
        position: absolute;
        left: 10px;
        top: 20px;
        cursor: pointer;
    }

    .mobileMenuBox {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1000;
        background-color: #000;
    }

    .mobileMenu {
        border-right: none;
    }

    .mobileMenu span {
        font-family: 'compacta';
        font-size: 16px;
        letter-spacing: 2px;
        font-weight: bold;
    }

    .mobileMenu_titleBox {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        height: 60px;
        font-size: 0;
    }

    .mobileMenu_titleBox > i {
        flex: 1;
        font-size: 25px;
        font-weight: bold;
    }

    .mobileMenu_title {
        height: 60px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }

    .mobileMenu_title .quit {
        font-size: 16px;
        height: 25px;
        vertical-align: middle;
    }

    .iconBtn {
        width: 25px;
        height: 25px;
        color: #fff;
        margin-left: 10px;
        vertical-align: middle;
    }

    .loginText {
        display: inline-block;
        font-size: 20px;
        margin-bottom: 50px;
    }

    .mobile_phoneBox .loginText {
        margin-bottom: 20px;
    }

    .mobile_Login .userNamePhone,
    .mobile_Login .userName {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #57564c;
    }

    .mobile_Login .userNamePhone > img {
        margin-right: 10px;
    }

    .mobile_Login .brandIcon {
        padding: 0 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .mobile_Login .brandIcon > img {
        margin: 0 10px;
    }

    .mobile_Login .registerBtn {
        color: #888986;
        margin-top: 20px;
    }

    .mobileMenu_title .already .img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
        border-radius: 50%;
        overflow: hidden;
        outline: none;
        vertical-align: middle;
    }

    .mobileMenu_title .future {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        vertical-align: middle;
    }

    .mobileMenu_title .languageSelect {
        width: 80px;
        display: inline-block;
    }

    .mobile_Login .background {
        padding: 20px;
        color: #fff;
    }

    .passwordForm {
        height: 20px;
        line-height: 20px;
    }

    .mobile_Login .user {
        cursor: pointer;
        color: #409EFF;
    }
</style>
<style>
    .mobileMenu .el-menu-item {
        border-bottom: 1px solid #212121;
    }

    .mobileMenu_title .already .el-dropdown-selfdefine {
        vertical-align: middle !important;
    }

    .mobile_Login .el-input__inner,
    .mobileMenu_title .languageSelect .el-input__inner {
        background-color: transparent;
        color: #fff;
    }

    .mobileMenu_title .languageSelect .el-input__inner {
        border: none !important;
        vertical-align: middle;
        padding-left: 10px !important;
        font-size: 16px;
    }

    .mobileMenu_title .languageSelect .el-input__suffix-inner {
        display: inline-block;
        vertical-align: middle;
    }

    .mobileMenu_title .already .el-dropdown,
    .mobileMenu_title .already .el-button {
        vertical-align: middle;
    }

    .mobile_Login .el-input__inner,
    .mobileMenu_title .languageSelect.el-select .el-input__inner:focus,
    .mobileMenu_title .languageSelect.el-select .el-input.is-focus .el-input__inner {
        border-color: #fff !important;
    }

    .mobile_Login .el-dialog {
        max-width: 500px;
        background: rgba(0, 0, 0, 0.3) url("../assets/img/common/mask_bg.png") repeat;
    }

    .mobile_Login .el-dialog__header,
    .mobile_Login .el-dialog__body {
        padding: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .mobile_password .el-dialog__header {
        padding: 5px 0 0 10px;
    }

    .mobile_password .el-dialog__header .el-dialog__headerbtn {
        top: 10px;
    }

    .mobile_password .el-input__inner {
        border: 1px solid #474747 !important;
    }

    .mobile_Login .el-form-item__label,
    .mobile_Login .el-dialog__title {
        color: #fff !important;
    }

    .mobile_Login .userNamePhone .el-input__inner {
        border: none;
        padding: 0;
    }

    .mobile_Login .el-checkbox {
        user-select: inherit !important;
    }
</style>
