import Vue from 'vue'
import Router from 'vue-router';

// 控制点击跳转路由 重复
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

// 全局模板Index
import Index from '../page/pages/index';
// 首页
import HOME from '../page/pages/HOME/index';
// 补充用户信息
import USER_INFO from '../page/pages/userInfo';
// WHAT'S NEXT
import NEXT from '../page/pages/NEXT/index';
// WHAT'S NEXT -> 新闻
import NEWS from '../page/pages/NEXT/DETAIL/NEWS';
// WHAT'S NEXT -> 新闻 -> 新闻详情
import NEWS_DETAILS from '../page/pages/NEXT/DETAIL/NEWSDETAILS';
// WHAT'S NEXT -> 行程
import TRAVEL from '../page/pages/NEXT/DETAIL/TRAVEL';
// WHAT'S NEXT -> 活动公告
import ACTIVITIES from '../page/pages/NEXT/DETAIL/ACTIVITIES';
// WHAT'S NEXT -> 活动公告 ->活动公告详情
import ACTIVITIES_DETAILS from '../page/pages/NEXT/DETAIL/ACTIVITIESDETAILS';
// WHAT'S NEXT  -> 综艺
import VARIETY from '../page/pages/NEXT/DETAIL/VARIETY';
// MUSIC
import MUSIC from '../page/pages/MUSIC/index';
// VIP
import VIP from '../page/pages/VIP/index';
// LIFESTYLE
import LIFESTYLE from '../page/pages/LIFESTYLE/LIFESTYLE';
// VIP -> 独家动态
import VIP_PRIVATE from "../page/pages/VIP/DETAIL/PRIVATE";
// VIP -> MESSAGE
import MESSAGE from '../page/pages/VIP/DETAIL/MESSAGE';
// VIP -> VIP
import VIP_VIP from '../page/pages/VIP/DETAIL/VIP';
// VIP -> VIP -> VIP详情
import VIP_DETAILS from '../page/pages/VIP/DETAIL/VIPDETAILS';
// VIP -> VIP -> VIP详情>确认订单
import VIP_ORDER from '../page/pages/VIP/DETAIL/CONFIRMORDER';
// VIP -> VIP详情 > 支付状态
import VIP_STATUS from "../page/pages/VIP/DETAIL/ACTIVITY_STATUS";
// VIP -> VIP详情 > 支付成功
import VIP_SUCCESS from '../page/pages/VIP/DETAIL/SUCCESS';
// VIP -> VIP详情 > 支付失败
import VIP_FAIL from '../page/pages/VIP/DETAIL/FAIL';
// VIP ->加入vip
import VIP_JOIN from '../page/pages/VIP/DETAIL/JOIN_VIP';
// 加入VIP 状态
import JOIN_VIP_STATUS from "../page/pages/VIP/DETAIL/JOIN_VIP_STATUS";
// 加入VIP 成功
import JOIN_VIP_SUCCESS from "../page/pages/VIP/DETAIL/JOIN_VIP_SUCCESS";
// 加入VIP失败
import JOIN_VIP_FAIL from "../page/pages/VIP/DETAIL/JOIN_VIP_FAIL";
//vip 加入vip 修改地址
import VIP_ADDRESS from '../page/pages/VIP/DETAIL/ADDRESS';
// VIP -> PHOTOS
import VIP_PHOTOS from '../page/pages/VIP/DETAIL/PHOTOS';
// VIP -> VIDEOS
import VIP_VIDEOS from '../page/pages/VIP/DETAIL/VIDEOS';
// VIP -> CONFIDENTIAL
import CONFIDENTIAL from '../page/pages/VIP/DETAIL/CONFIDENTIAL';
// COOKIES
import COOKIES from '../page/pages/COOKIES/index';
// PROFILE
import PROFILE from '../page/pages/PROFILE/index';
// PROFILE -> 个人资料
import PERSONAL from "../page/pages/PROFILE/DETAIL/PERSONAL";
// PROFILE  -> 代言及合作
import ENDORSEMENT from '../page/pages/PROFILE/DETAIL/ENDORSEMENT';
//PROFILE  代言详情
import END_DETAILS from '../page/pages/PROFILE/DETAIL/ENDDETAILS';
// ABOUT
import ABOUT from '../page/pages/ABOUT/index';
// PERSONAGE
import PERSONAGE from '../page/pages/PERSONAGE/index';
// PERSONAGE --> MEMBER
import MEMBER from '../page/pages/PERSONAGE/DETALL/MEMBER';
// PERSONAGE --> PERSONAGE_DATA
import PERSONAGE_DATA from '../page/pages/PERSONAGE/DETALL/PERSONAGE_DATA';
// PERSONAGE --> MY_ORDER
import MY_ORDER from '../page/pages/PERSONAGE/DETALL/MY_ORDER';
// PERSONAGE --> SUBSCRIPTION
import SUBSCRIPTION from '../page/pages/PERSONAGE/DETALL/SUBSCRIPTION';
// PERSONAGE --> FEEDBACK
import FEEDBACK from '../page/pages/PERSONAGE/DETALL/FEEDBACK';
// 我的活动
import MY_ACTIVITY from "../page/pages/PERSONAGE/DETALL/MY_ACTIVITY";
// vip活动详情
import VIP_ACTIVITY_DETAIL from "../page/pages/VIP/DETAIL/ACTIVITY_DETAIL";

// 移动端路由配置
import M_Index from '../page/mobiles/index';
// 首页
import M_HOME from '../page/mobiles/HOME/HOME';
// 关于TEAM WANG
import M_ABOUT from '../page/mobiles/ABOUT/ABOUT';
// 关于王嘉尔
import M_PROFILE from '../page/mobiles/PROFILE/index';
// 关于王嘉尔 个人资料
import M_PERSONAL from '../page/mobiles/PROFILE/DETAIL/PERSONAL';
// 关于王嘉尔 代言及合作
import M_ENDORSEMENT from '../page/mobiles/PROFILE/DETAIL/ENDORSEMENT';
// 关于王嘉尔 代言详情
import M_END_DETAILS from "../page/mobiles/PROFILE/DETAIL/ENDDETAILS";
// 商城
import M_COOKIES from "../page/mobiles/COOKIES/index";
// 最新消息
import M_NEXT from "../page/mobiles/NEXT/index";
// 新闻
import M_NEWS from "../page/mobiles/NEXT/DETAIL/NEWS";
// 新闻详情
import M_NEWS_DETAILS from "../page/mobiles/NEXT/DETAIL/NEWSDETAILS";
// 行程
import M_TRAVEL from "../page/mobiles/NEXT/DETAIL/TRAVEL";
// 活动公告
import M_ACTIVITIES from "../page/mobiles/NEXT/DETAIL/ACTIVITIES";
// 活动公告详情
import M_ACTIVITIES_DETAILS from "../page/mobiles/NEXT/DETAIL/ACTIVITIES_DETAILS";
// 综艺
import M_VARIETY from "../page/mobiles/NEXT/DETAIL/VARIETY";
// MUSIC模块
import M_MUSIC from "../page/mobiles/MUSIC/index";
// 个人中心模块
import M_PERSONAGE from "../page/mobiles/PERSONAGE/index";
// 个人中心 => 会员状态
import M_MEMBER from "../page/mobiles/PERSONAGE/DETAIL/MEMBER";
// 个人中心 => 个人资料
import M_PERSONAGE_DATA from "../page/mobiles/PERSONAGE/DETAIL/PERSONAGE_DATA";
// 个人中心 => 我的订单
import M_MY_ORDER from "../page/mobiles/PERSONAGE/DETAIL/MY_ORDER";
// 个人中心 => 我的活动
import M_MY_ACTIVITY from "../page/mobiles/PERSONAGE/DETAIL/MY_ACTIVITY";
// 个人中心 => 订阅
import M_SUBSCRIPTION from "../page/mobiles/PERSONAGE/DETAIL/SUBSCRIPTION";
// 个人中心 => 意见反馈
import M_FEEDBACK from "../page/mobiles/PERSONAGE/DETAIL/FEEDBACK";
// LIFESTYLE
import M_LIFESTYLE from "../page/mobiles/LIFESTYLE/LIFESTYLE";
// 强制补充用户信息
import M_USER_INFO from "../page/mobiles/userInfo";
// VIP
import M_VIP from "../page/mobiles/VIP/index";
// VIP -> PRIVATE
import M_VIP_PRIVATE from "../page/mobiles/VIP/DETAIL/PRIVATE";
// VIP => VIP活动
import M_VIP_VIP from "../page/mobiles/VIP/DETAIL/VIP";
// VIP => VIP活动下单页
import M_VIP_DETAILS from "../page/mobiles/VIP/DETAIL/VIPDETAILS";
// VIP => VIP照片
import M_VIP_PHOTOS from "../page/mobiles/VIP/DETAIL/PHOTOS";
// VIP => VIP视频
import M_VIP_VIDEOS from "../page/mobiles/VIP/DETAIL/VIDEOS";
// VIP => 留言板
import M_VIP_MESSAGE from "../page/mobiles/VIP/DETAIL/MESSAGE";
// VIP => 保密公告
import M_CONFIDENTIAL from "../page/mobiles/VIP/DETAIL/CONFIDENTIAL";
// VIP -> VIP详情 > 支付状态
import M_VIP_STATUS from "../page/mobiles/VIP/DETAIL/ACTIVITY_STATUS";
// 支付成功
import M_VIP_SUCCESS from "../page/mobiles/VIP/DETAIL/SUCCESS";
// 支付失败
import M_VIP_FAIL from "../page/mobiles/VIP/DETAIL/FAIL";
// 地址管理
import M_VIP_ADDRESS from "../page/mobiles/VIP/DETAIL/ADDRESS";
// 加入VIP
import M_VIP_JOIN from "../page/mobiles/VIP/DETAIL/JOIN_VIP";
// 加入VIP状态
import M_JOIN_VIP_STATUS from "../page/mobiles/VIP/DETAIL/JOIN_VIP_STATUS";
// 加入VIP 成功
import M_JOIN_VIP_SUCCESS from "../page/mobiles/VIP/DETAIL/JOIN_VIP_SUCCESS";
// 加入VIP失败
import M_JOIN_VIP_FAIL from "../page/mobiles/VIP/DETAIL/JOIN_VIP_FAIL";
// 确认订单信息
import M_VIP_ORDER from "../page/mobiles/VIP/DETAIL/CONFIRM_ORDER";
// vip公告 活动详情
import M_VIP_ACTIVITY_DETAIL from "../page/mobiles/VIP/DETAIL/ACTIVITY_DETAIL";

Vue.use(Router);

const router = new Router({
    // mode: 'history',
    routes: [
        // 路由重定向
        {path: "/", redirect: "/WJE/index"},
        // 路由重定向
        {path: "/WJE", redirect: "/WJE/index"},
        {
            path: "/WJE", name: "Index", component: Index, children: [
                // 首页的页面内容
                {path: "/WJE/index", name: "HOME", component: HOME},
                // 强制用户补充用户信息
                {path: "/WJE/userInfo", name: "USER_INFO", component: USER_INFO},
                // NEXT页的页面内容
                {
                    path: "/WJE/next", name: "NEXT", component: NEXT, redirect: '/WJE/next/news', children: [
                        // WHAT'S NEXT -> 新闻
                        {path: "/WJE/next/news", name: "NEWS", component: NEWS},
                        // WHAT'S NEXT -> 新闻 -> 新闻详情
                        {path: "/WJE/next/newsDetails", name: "NEWS_DETAILS", component: NEWS_DETAILS},
                        // WHAT'S NEXT -> 行程
                        {path: "/WJE/next/travel", name: "TRAVEL", component: TRAVEL},
                        // WHAT'S NEXT -> 活动公告
                        {path: "/WJE/next/activities", name: "ACTIVITIES", component: ACTIVITIES},
                        // WHAT'S NEXT -> 活动公告->活动公告详情
                        {
                            path: "/WJE/next/activitiesDetails",
                            name: "ACTIVITIES_DETAILS",
                            component: ACTIVITIES_DETAILS
                        },
                        // WHAT'S NEXT -> 综艺
                        {path: "/WJE/next/variety", name: "VARIETY", component: VARIETY},
                    ]
                },
                // MUSIC
                {path: "/WJE/music", name: "MUSIC", component: MUSIC},
                // VIP
                {
                    path: "/WJE/vip", name: "VIP_INDEX", component: VIP, redirect: '/WJE/vip/private', children: [
                        // VIP -> lifestyle
                        {path: "/WJE/vip/private", name: "VIP_PRIVATE", component: VIP_PRIVATE},
                        // VIP -> VIP
                        {path: "/WJE/vip/vip", name: "VIP_VIP", component: VIP_VIP},
                        // VIP -> PHOTOS
                        {path: "/WJE/vip/photos", name: "VIP_PHOTOS", component: VIP_PHOTOS},
                        // VIP -> VIDEOS
                        {path: "/WJE/vip/videos", name: "VIP_VIDEOS", component: VIP_VIDEOS},
                        // VIP -> MESSAGE
                        {path: "/WJE/vip/message", name: "VIP_MESSAGE", component: MESSAGE},
                        // VIP -> CONFIDENTIAL
                        {path: "/WJE/vip/confidential", name: "CONFIDENTIAL", component: CONFIDENTIAL},
                        // VIP -> CONFIDENTIAL -> 活动公告
                        {
                            path: "/WJE/vip/confidential/activityDetail",
                            name: "VIP_ACTIVITY_DETAIL",
                            component: VIP_ACTIVITY_DETAIL
                        },
                    ]
                },
                // VIP -> VIP -> DETAIL
                {path: "/WJE/vip/vipDetail", name: "VIP_DETAILS", component: VIP_DETAILS},
                // vip确认订单
                {path: "/WJE/order", name: "VIP_ORDER", component: VIP_ORDER},
                // vip支付状态
                {path: "/WJE/order/status", name: "VIP_STATUS", component: VIP_STATUS},
                // vip支付成功
                {path: "/WJE/order/success", name: "VIP_SUCCESS", component: VIP_SUCCESS},
                // vip支付失败
                {path: "/WJE/order/fail", name: "VIP_FAIL", component: VIP_FAIL},
                // 加入vip
                {path: "/WJE/joinVip", name: "VIP_JOIN", component: VIP_JOIN},
                // 加入 vip 状态
                {path: "/WJE/joinVip/status", name: "JOIN_VIP_STATUS", component: JOIN_VIP_STATUS},
                // 加入vip成功
                {path: "/WJE/joinVip/success", name: "JOIN_VIP_SUCCESS", component: JOIN_VIP_SUCCESS},
                // 加入vip失败
                {path: "/WJE/joinVip/fail", name: "JOIN_VIP_FAIL", component: JOIN_VIP_FAIL},
                // 加入vip 修改地址
                {path: "/WJE/address", name: "VIP_ADDRESS", component: VIP_ADDRESS},
                // COOKIES
                {path: "/WJE/cookies", name: "COOKIES", component: COOKIES},
                // LIFESTYLE
                {path: "/WJE/lifestyle", name: "LIFESTYLE", component: LIFESTYLE},
                // PROFILE
                {
                    path: "/WJE/profile",
                    name: "PROFILE",
                    component: PROFILE,
                    redirect: '/WJE/profile/personal', children: [
                        {path: "/WJE/profile/personal", name: "PERSONAL", component: PERSONAL},
                        {path: "/WJE/profile/endorsement", name: "ENDORSEMENT", component: ENDORSEMENT},
                        {path: "/WJE/profile/endDetails", name: "END_DETAILS", component: END_DETAILS},
                    ]
                },
                // ABOUT
                {path: "/WJE/about", name: "ABOUT", component: ABOUT},
                // PERSONAGE -> 个人中心
                {
                    path: "/WJE/personage",
                    name: "PERSONAGE",
                    component: PERSONAGE,
                    redirect: '/WJE/personage/member',
                    children: [
                        // MEMBER  会员状态
                        {path: '/WJE/personage/member', name: 'MEMBER', component: MEMBER},
                        // PERSONAGE_DATA --> 个人资料
                        {path: '/WJE/personage/personalData', name: 'PERSONAGE_DATA', component: PERSONAGE_DATA},
                        // MY_ORDER --> 我的订单
                        {path: '/WJE/personage/my_order', name: 'MY_ORDER', component: MY_ORDER},
                        // SUBSCRIPTION --> 订阅
                        {path: '/WJE/personage/subscription', name: 'SUBSCRIPTION', component: SUBSCRIPTION},
                        // FEEDBACK --> 意见反馈
                        {path: '/WJE/personage/feedback', name: 'FEEDBACK', component: FEEDBACK},
                        // 我的活动
                        {path: '/WJE/personage/activity', name: 'MY_ACTIVITY', component: MY_ACTIVITY}
                    ]
                },
            ]
        },
        // 移动端路由配置
        {
            path: "/WJE/mobile", name: "M_Index", component: M_Index, children: [
                // 首页
                {path: "/WJE/mobile/index", name: "M_HOME", component: M_HOME},
                // 强制用户补充用户信息
                {path: "/WJE/mobile/userInfo", name: "M_USER_INFO", component: M_USER_INFO},
                // NEXT页的页面内容
                {
                    path: "/WJE/mobile/next",
                    name: "M_NEXT",
                    component: M_NEXT,
                    redirect: '/WJE/mobile/next/news',
                    children: [
                        // WHAT'S NEXT -> 新闻
                        {path: "/WJE/mobile/next/news", name: "M_NEWS", component: M_NEWS},
                        // WHAT'S NEXT -> 新闻 -> 新闻详情
                        {path: "/WJE/mobile/next/newsDetails", name: "M_NEWS_DETAILS", component: M_NEWS_DETAILS},
                        // WHAT'S NEXT -> 行程
                        {path: "/WJE/mobile/next/travel", name: "M_TRAVEL", component: M_TRAVEL},
                        // WHAT'S NEXT -> 活动公告
                        {path: "/WJE/mobile/next/activities", name: "M_ACTIVITIES", component: M_ACTIVITIES},
                        // WHAT'S NEXT -> 活动公告->活动公告详情
                        {
                            path: "/WJE/mobile/next/activitiesDetails",
                            name: "M_ACTIVITIES_DETAILS",
                            component: M_ACTIVITIES_DETAILS
                        },
                        // WHAT'S NEXT -> 综艺
                        {path: "/WJE/mobile/next/variety", name: "M_VARIETY", component: M_VARIETY},
                    ]
                },
                // MUSIC
                {path: "/WJE/mobile/music", name: "M_MUSIC", component: M_MUSIC},
                // LIFESTYLE
                {path: "/WJE/mobile/lifestyle", name: "M_LIFESTYLE", component: M_LIFESTYLE},
                // VIP
                {
                    path: "/WJE/mobile/vip",
                    name: "M_VIP_INDEX",
                    component: M_VIP,
                    redirect: '/WJE/mobile/vip/lifestyle',
                    children: [
                        // VIP -> PRIVATE
                        {path: "/WJE/mobile/vip/private", name: "M_VIP_PRIVATE", component: M_VIP_PRIVATE},
                        // VIP -> VIP
                        {path: "/WJE/mobile/vip/vip", name: "M_VIP_VIP", component: M_VIP_VIP},
                        // VIP -> PHOTOS
                        {path: "/WJE/mobile/vip/photos", name: "M_VIP_PHOTOS", component: M_VIP_PHOTOS},
                        // VIP -> VIDEOS
                        {path: "/WJE/mobile/vip/videos", name: "M_VIP_VIDEOS", component: M_VIP_VIDEOS},
                        // VIP -> MESSAGE
                        {path: "/WJE/mobile/vip/message", name: "M_VIP_MESSAGE", component: M_VIP_MESSAGE},
                        // VIP -> CONFIDENTIAL
                        {path: "/WJE/mobile/vip/confidential", name: "M_CONFIDENTIAL", component: M_CONFIDENTIAL},
                        // VIP -> CONFIDENTIAL -> 活动公告
                        {
                            path: "/WJE/mobile/vip/confidential/activityDetail",
                            name: "M_VIP_ACTIVITY_DETAIL",
                            component: M_VIP_ACTIVITY_DETAIL
                        },
                    ]
                },
                // VIP -> VIP -> DETAIL
                {path: "/WJE/mobile/vip/vipDetail", name: "M_VIP_DETAILS", component: M_VIP_DETAILS},
                // vip支付状态
                {path: "/WJE/mobile/order/status", name: "M_VIP_STATUS", component: M_VIP_STATUS},
                // vip支付成功
                {path: "/WJE/mobile/order/success", name: "M_VIP_SUCCESS", component: M_VIP_SUCCESS},
                // vip支付失败
                {path: "/WJE/mobile/order/fail", name: "M_VIP_FAIL", component: M_VIP_FAIL},
                // vip确认订单
                {path: "/WJE/mobile/order", name: "M_VIP_ORDER", component: M_VIP_ORDER},
                // 加入vip
                {path: "/WJE/mobile/joinVip", name: "M_VIP_JOIN", component: M_VIP_JOIN},
                // 加入 vip 状态
                {path: "/WJE/mobile/joinVip/status", name: "M_JOIN_VIP_STATUS", component: M_JOIN_VIP_STATUS},
                // 加入vip成功
                {path: "/WJE/mobile/joinVip/success", name: "M_JOIN_VIP_SUCCESS", component: M_JOIN_VIP_SUCCESS},
                // 加入vip失败
                {path: "/WJE/mobile/joinVip/fail", name: "M_JOIN_VIP_FAIL", component: M_JOIN_VIP_FAIL},
                // 加入vip 修改地址
                {path: "/WJE/mobile/address", name: "M_VIP_ADDRESS", component: M_VIP_ADDRESS},
                // COOKIES
                {path: "/WJE/mobile/cookies", name: "M_COOKIES", component: M_COOKIES},
                // 关于王嘉尔
                {
                    path: "/WJE/mobile/profile",
                    name: "M_PROFILE",
                    component: M_PROFILE,
                    redirect: '/WJE/mobile/profile/personal', children: [
                        {path: "/WJE/mobile/profile/personal", name: "M_PERSONAL", component: M_PERSONAL},
                        {path: "/WJE/mobile/profile/endorsement", name: "M_ENDORSEMENT", component: M_ENDORSEMENT},
                        {path: "/WJE/mobile/profile/endDetails", name: "M_END_DETAILS", component: M_END_DETAILS},
                    ]
                },
                // 关于TEAM WANG
                {path: "/WJE/mobile/about", name: "M_ABOUT", component: M_ABOUT},
                // PERSONAGE -> 个人中心
                {
                    path: "/WJE/mobile/personage",
                    name: "M_PERSONAGE",
                    component: M_PERSONAGE,
                    redirect: '/WJE/mobile/personage/member',
                    children: [
                        // MEMBER  会员状态
                        {path: '/WJE/mobile/personage/member', name: 'M_MEMBER', component: M_MEMBER},
                        // PERSONAGE_DATA --> 个人资料
                        {
                            path: '/WJE/mobile/personage/personalData',
                            name: 'M_PERSONAGE_DATA',
                            component: M_PERSONAGE_DATA
                        },
                        // MY_ORDER --> 我的订单
                        {path: '/WJE/mobile/personage/my_order', name: 'M_MY_ORDER', component: M_MY_ORDER},
                        // SUBSCRIPTION --> 订阅
                        {path: '/WJE/mobile/personage/subscription', name: 'M_SUBSCRIPTION', component: M_SUBSCRIPTION},
                        // FEEDBACK --> 意见反馈
                        {path: '/WJE/mobile/personage/feedback', name: 'M_FEEDBACK', component: M_FEEDBACK},
                        // 我的活动
                        {path: '/WJE/mobile/personage/activity', name: 'M_MY_ACTIVITY', component: M_MY_ACTIVITY}
                    ]
                },
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    // 包含商城的连接 跳转外链
    if (to.name.indexOf('COOKIES') !== -1) {
        window.open('https://www.teamwangdesign.com','_self');
    } else {
        next();
    }
});

export default router;
