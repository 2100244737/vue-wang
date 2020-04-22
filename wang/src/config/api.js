// 引入axios
import axios from 'axios';
import {getCookie} from '../main';
import ElementUI from 'element-ui';
import i18n from "../page/lang/index";
// 生产ip 39.105.121.157
// 测试ip 39.104.145.104
// 香港测试IP 39.105.204.196

/*
 * 正式IP  root：接口前缀  callBack：支付回调前缀
 */
var root = process.env.NODE_ENV === 'production' ? 'http://39.105.121.157:8001/' : 'http://39.104.145.104:8001/';
var callBack = process.env.NODE_ENV === 'production' ? 'http://39.105.121.157:80/#/WJE/' : '192.168.0.103:8080/#/WJE/';
/*
 * 测试IP root：接口前缀  callBack：支付回调前缀
 */
// var root = process.env.NODE_ENV === 'production' ? 'http://39.104.145.104:8001/' : 'http://39.104.145.104:8001/';
// var callBack = process.env.NODE_ENV === 'production' ? 'http://39.104.145.104:8002/#/WJE/' : '192.168.0.103:8080/#/WJE/';

/*
 * 香港IP root：接口前缀  callBack：支付回调前缀
 */
// var root = process.env.NODE_ENV === 'production' ? 'http://39.105.204.196:8001/' : 'http://39.104.145.104:8001/';
// var callBack = process.env.NODE_ENV === 'production' ? 'http://39.105.204.196:80/#/WJE/' : '192.168.0.103:8080/#/WJE/';

// 本地IP
// var root = 'http://192.168.31.19:8001/';

// 图片前缀
var imgUrl = 'https://jacksonwangossservice.oss-cn-beijing.aliyuncs.com/';

// 导出邮箱校验正则
var ruleEmail = /^\w+@[a-zA-Z0-9]{2,30}(?:\.[a-z]{2,4}){1,3}$/;

// 导出大陆身份证校验格式
var ruleIDCard = /^[1-9]\d{5}(18|19|2([0-9]))\d{2}(0[0-9]|10|11|12)([0-2][1-9]|30|31)\d{3}[0-9Xx]$/;

// teamWangID  1: admin  2: 王嘉尔本人 3: 开发测试专用
var teamWangID = ['1', '2', '3'];

// 视频上传格式限制
var mvType = ['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/quicktime'];

function apiAxios(method, url, params, success) {
    axios({
        method: method, // 请求方式 post get delete get等
        url: url, // 具体接口地址
        data: method === 'POST' || method === 'PUT' ? params : null,
        params: method === 'GET' || method === 'DELETE' ? params : null,
        baseURL: root, // base_url
        withCredentials: false,  // cookie
        headers: {
            'Content-Type': 'application/json;charset=utf-8', // 请求头
            'token': getCookie('WJE_USER_TOKEN') || ''
        }
    }).then(function (res) {
        // 成功时回调
        if (success) {
            // 全局提示敏感词汇
            if (res.data.status === 2023) {
                // 警告提示
                ElementUI.Message.warning(i18n.messages[i18n.locale].public.includeWords);
            } else if (res.data.status === 2011) {
                // 用户登录信息失效
                ElementUI.Message.warning(i18n.messages[i18n.locale].public.isInvalid);
            } else {
                // 成功
                success(res.data);
            }
        }
    }).catch(function (err) {
        // 异常时回调
        return false;
    });
}

// 返回在vue模板中的调用接口
export default {
    // 查询
    get: function (url, params, success) {
        return apiAxios('GET', url, params, success);
    },
    // 修改
    post: function (url, params, success) {
        return apiAxios('POST', url, params, success);
    },
    // 更新
    put: function (url, params, success) {
        return apiAxios('PUT', url, params, success);
    },
    // 删除
    delete: function (url, params, success) {
        return apiAxios('DELETE', url, params, success);
    },
    // 图片地址
    imgUrl: function () {
        return imgUrl;
    },
    // 邮箱正则
    ruleEmail: function () {
        return ruleEmail;
    },
    // 大陆身份证正则
    ruleIDCard: function () {
        return ruleIDCard;
    },
    // url前缀
    root: function () {
        return root;
    },
    // teamWangID
    teamWangID: function () {
        return teamWangID;
    },
    // mv上传格式限制
    mvType: function () {
        return mvType;
    },
    // 支付回调地址前缀
    callBack: function () {
        return callBack;
    }
}
