// 引入路由方法
import Router from '../router/index';

// 封装页面跳转函数
const toJumpPage = (pcName, mobileName, params) => {
    // 获取标识判断 是移动端还是web端
    let isFlag = '';
    // 获取设备类型
    let sUserAgent = navigator.userAgent.toLowerCase();
    let bIsIPad = sUserAgent.match(/ipad/i) == "ipad";
    let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    let bIsMidP = sUserAgent.match(/midp/i) == "midp";
    let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    let bIsAndroid = sUserAgent.match(/android/i) == "android";
    let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    // 没有拿到设备标识
    if (!(bIsIPad || bIsIphoneOs || bIsMidP || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
        isFlag = 'web';
        document.body.setAttribute('data_equipment', 'web');
    } else {
        isFlag = 'mobile';
        document.body.setAttribute('data_equipment', 'mobile');
    }
    // 路由跳转
    Router.push({
        name: isFlag === 'mobile' ? mobileName : pcName,
        params: params !== undefined ? params : ''
    });
};

// 判断当前页面是否需要跳转
const isToJump = (thisRoute, pcName, mobileName, params) => {
    // 获取标识判断 是移动端还是web端
    let isFlag_mobile = '';
    // 获取设备类型
    let sUserAgent = navigator.userAgent.toLowerCase();
    let bIsIPad = sUserAgent.match(/ipad/i) == "ipad";
    let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    let bIsMidP = sUserAgent.match(/midp/i) == "midp";
    let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    let bIsAndroid = sUserAgent.match(/android/i) == "android";
    let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (!(bIsIPad || bIsIphoneOs || bIsMidP || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
        isFlag_mobile = 'web';
        document.body.setAttribute('data_equipment', 'web');
    } else {
        isFlag_mobile = 'mobile';
        document.body.setAttribute('data_equipment', 'mobile');
    }
    // 判断
    if (isFlag_mobile === 'web') {
        if (thisRoute === mobileName) {
            Router.push({
                name: pcName,
                params: params !== undefined ? params : ''
            });
            return true;
        } else {
            return false;
        }
    } else {
        if (thisRoute === pcName) {
            Router.push({
                name: mobileName,
                params: params !== undefined ? params : ''
            });
            return true;
        } else {
            return false;
        }
    }
};

export default {
    // 跳转路由
    toJumpPage: function (pcName, mobileName, params) {
        return toJumpPage(pcName, mobileName, params);
    },
    // 每个组件判断是否需要跳转
    isToJump: function (thisRoute, pcName, mobileName, params) {
        return isToJump(thisRoute, pcName, mobileName, params);
    }
}
