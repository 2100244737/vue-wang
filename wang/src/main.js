// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
// 引入 ElementUI
import ElementUI from 'element-ui';
// 引入api 接口
import api from './config/api';
// 引入国际化语言
import i18n from './page/lang/index';
// 引入分页
import pages from './components/pages';
// 引入总线
import vueBus from 'vue-bus';
// 引入md5
import md5 from 'js-md5';
// 引入路由跳转方法
import jump from "./config/jump";
// 引入全局方法
import recursive from "./config/recursive";
// ie兼容
import 'babel-polyfill';

Vue.config.productionTip = false;
// element-ui的默认主题
import 'element-ui/lib/theme-chalk/index.css';
// 引入格式化css
import './assets/css/base.css';
// 引入全局css
import './assets/css/common.css';
// 引入思源黑体
import './font/font.css';

// 获取cookie
Vue.prototype.getCookie = getCookie;
// 设置cookie
Vue.prototype.setCookie = setCookie;
// 删除cookie
Vue.prototype.delCookie = delCookie;
// 调用api接口
Vue.prototype.$api = api;
// 调用md5
Vue.prototype.$md5 = md5;
// 调用路由跳转
Vue.prototype.$jump = jump;
// 调用全局方法
Vue.prototype.$recursive = recursive;
// 使用分页
Vue.component('pages', pages);

// 调用elementUI
Vue.use(ElementUI, {
    i18n: (key, value) => i18n.t(key, value)
});
Vue.use(vueBus);


// 字符长度截取
Vue.prototype.returnContent = (allContent, flag) => {
    let length = 500;
    if (flag) {
        // 展开
        allContent = allContent.replace(/\n/g, '<br>');
        return allContent;
    } else {
        // 收起
        if (allContent.length < length) {
            return allContent.replace(/\n/g, '<br>');
        } else {
            return (allContent.substring(0, length) + '...').replace(/\n/g, '<br>');
        }
    }
};

// 处理返回的动态内容换行
Vue.prototype.returnHtmlContent = (content, flag) => {
    let lineNum = 10; // 默认显示行数
    let obj = new Object();
    content = content.replace(/\n/g, '<br>');
    if (flag) {
        // 展开操作
        obj.flag = 0; // 0:判断是否需要按钮  1为截取  2为不截取
        obj.data = content;
        return obj;
    } else {
        // 默认收起，判断是否进行截取
        let count = 0;
        for (let index = 0; index < content.length; index++) {
            let a = content.indexOf("<br>", index);
            if (a !== -1 && content.indexOf("<br>", index) !== content.indexOf("<br>", index - 1)) {
                count++;
            }
            if (count >= lineNum) {
                obj.flag = 1; // 0:判断是否需要按钮  1为截取  2为不截取
                obj.data = content.substring(0, index - 1);
                break ;
            }
        }
        if (count === 0) {
            obj.flag = 0; // 0:判断是否需要按钮  1为截取  2为不截取
            obj.data = content;
        }
        if (count < lineNum && count !== 0) {
            obj.flag = 2; // 0:判断是否需要按钮  1为截取  2为不截取
            obj.data = content;
        }
        return obj;
    }
};


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    components: {App},
    template: '<App/>',
    watch: {
        "$route": 'checkLogin'
    },
    methods: {
        // 检查是否登录
        checkLogin() {
            var _t = this;
            // 前端的token过期 跳转至登录页
            // if (!_t.getCookie('WJE_USER_ID')) {
            //   _t.$router.push({name: 'HOME'});
            //   window.location.reload();
            // }
        }
    }
});

// 获取cookie
function getCookie(name) {
    var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}

export {getCookie};

// 设置cookie 有效期为30天
function setCookie(name, value, days) {
    var exp = new Date();
    exp.setDate(exp.getDate() + days);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

// 删除 cookie
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

