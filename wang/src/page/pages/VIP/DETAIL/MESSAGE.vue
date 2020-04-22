<template>
    <div class="container">
        <!--标题-->
        <div class="title">
            <span class="mess">{{$t('message.title')}}</span>
        </div>
        <!--内容-->
        <div class="leaveWord">
            <!--列表-->
            <div class="leaveList">
                <ul class="reply" v-for="(item, index) in replyData" :key="index">
                    <li class="photo">
                        <div class="imgBorder">
                            <img :src="item.imgUrl" alt="">
                        </div>
                    </li>
                    <li class="reply-text">
                        <div class="reply-textBox">
                            <p class="reply-name">{{item.fromReplyUserName}}</p>
                            <p class="reply-time">{{item.replyTime}}</p>
                        </div>
                        <p class="reply-content">{{item.replyMessage}}</p>
                        <div v-if="item.sonList.length !== 0 && item.sonList !== null" class="reply-text">
                            <div class="reply_contentBox" v-for="(val,i) in item.sonList" :key="i">
                                <div class="replyImg_box">
                                    <img class="widthAll" :src="val.headImg" alt="">
                                </div>
                                <div class="flex_1 marginTop10 marginLeft10">
                                    <span>{{val.fromReplyUserName}}:</span>
                                    <span class="blueColor">@{{item.fromReplyUserName}}</span>
                                    <span>{{val.replyMessage}}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <p class="tr moreBtn cursorPointer" @click="clickMore">{{$t('public.more')}}</p>
            </div>
            <!--文本域-->
            <div class="sendMessage">
                <p class="titles">{{$t('message.label')}}</p>
                <el-input
                    class="textareaBox_message input"
                    type="textarea"
                    :autosize="{minRows: 7}"
                    maxlength="1500"
                    show-word-limit
                    v-model="formItem.textarea">
                </el-input>
                <el-button class="btn" @click="send_msg">{{$t('message.btnText')}}</el-button>
                <!--
                    :placeholder="$t('message.placeholder')"
                -->
            </div>
        </div>
    </div>
</template>

<script>
    import {dateFilterDayCN} from "../../../../assets/js/filters";

    export default {
        name: 'MESSAGE',
        data() {
            return {
                // 回复表单
                formItem: {
                    textarea: '',  //  留言板输入文本
                },
                // 留言板列表数据
                replyData: [],
                // 留言的分页使用
                options: {
                    currentPage: 1, // 当前页
                    pageSize: 5, // 每页显示条数
                    total: 0, // 总条数
                },
                // 限制点击more每次自增5
                limitMore: 5
            }
        },
        methods: {
            // 发送留言
            send_msg() {
                let _t = this;
                // 获取用户id及是否登录
                let isLogin = _t.getCookie('WJE_IS_LOGIN');
                let user_id = _t.getCookie('WJE_USER_ID');
                let user_name = _t.getCookie('WJE_NICK_NAME');
                // 用户登录之后才可发送留言
                if (isLogin !== null && user_id !== null) {
                    if (_t.formItem.textarea.trim() === '') {
                        _t.$message.error(_t.$t('lifestyle.emptyMessage'));
                    } else {
                        _t.sendMessage(user_id, user_name);
                    }
                } else {
                    _t.$message.error(_t.$t('lifestyle.isNotLogin'));
                }
            },
            // 发送留言接口
            sendMessage(user_id, user_name) {
                let _t = this;
                _t.$api.post('leavemessage/push', {
                    fromReplyUserId: user_id, // 留言人id
                    fromReplyUserName: user_name, // 留言人姓名
                    replyMessage: _t.formItem.textarea.trim(), // 留言内容
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            // 清空发布内容
                            _t.formItem.textarea = '';
                            // 查询留言列表数据
                            _t.getLeaveMessage();
                            break;
                        default:
                            break;
                    }
                });
            },
            // 点击查看更多
            clickMore() {
                let _t = this;
                if (_t.replyData.length < _t.options.total) {
                    _t.options.pageSize += _t.limitMore;
                    _t.getLeaveMessage();
                } else {
                    _t.$message.warning(_t.$t('public.noMoreData'));
                }
            },
            // 查询留言
            getLeaveMessage() {
                let _t = this;
                _t.$api.get('leavemessage/get/leavemessage/' + _t.options.currentPage + '/' + _t.options.pageSize, {}, function (res) {
                    switch (res.status) {
                        case 200:
                            let replyData = res.data.content === null ? [] : res.data.content;
                            let parentIdArr = new Array();
                            replyData.forEach((item) => {
                                // 处理时间戳
                                item.replyTime = dateFilterDayCN(item.replyTime);
                                // 处理图片
                                if (item.headImg !== null && item.headImg !== '') {
                                    item.imgUrl = _t.$api.imgUrl() + item.headImg;
                                }
                                parentIdArr.push(item.id);
                            });
                            _t.getDynamicData(parentIdArr, replyData);
                            _t.options.total = res.data.total !== undefined ? res.data.total : 0;
                            break;
                        default:
                            break;
                    }
                });
            },
            // 查询动态留言列表
            getDynamicData(parentIdArr, replyData) {
                let _t = this;
                _t.$api.post('dynamic/getleavemessageReply', {
                    privateInfoIds: parentIdArr.join(','),
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            let resData = res.data !== null ? res.data : [];
                            replyData.forEach((item) => {
                                item.sonList = new Array();
                                resData.forEach((val) => {
                                    // 目前只取第一条回复
                                    if (val !== null && val.length !== 0) {
                                        if (item.id === val[0].privateInfoId) {
                                            val.forEach((data) => {
                                                if (data.headImg !== null && data.headImg !== '') {
                                                    data.headImg = _t.$api.imgUrl() + data.headImg;
                                                }
                                            });
                                            item.sonList = val;
                                        }
                                    }
                                });
                            });
                            _t.replyData = replyData;
                            break;
                        default:
                            break;
                    }
                });
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
                                        // 获取所有用户的留言列表
                                        _t.getLeaveMessage();
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
            let jump = _t.$jump.isToJump(_t.$route.name, 'VIP_MESSAGE', 'M_VIP_MESSAGE');
            if (jump === false) {
                _t.getUserInfo();
                // 调用父级加载二级菜单选中项
                _t.$parent.dealWith();
                // 调用父级的用户信息判断是否vip到期
                _t.$parent.getUserInfo();
            }
        },
    }
</script>
<style scoped>
    .container {
        background: #0b0b0b;
        color: #c5c5c5;
        padding: 50px 130px;
    }

    .container > .title {
        color: #fff;
        height: 50px;
        font-size: 30px;
        line-height: 50px;
        margin-bottom: 30px;
    }

    .container > .title .mess {
        padding-bottom: 10px;
        border-bottom: 5px solid #fff;
    }

    .leaveWord {
        padding: 20px 22px 99px;
        background: url("../../../../assets/img/common/mask_bg.png") repeat;
    }

    .leaveWord .reply {
        padding: 30px 20px 30px 40px;
        display: flex;
        align-items: start;
        justify-content: space-between;
        font-size: 14px;
        margin-bottom: 12px;
        background: rgba(0, 0, 0, .3);
    }

    .imgBorder {
        width: 50px;
        height: 50px;
        display: inline-block;
        border: 3px solid #B9BBBA;
        border-radius: 50%;
    }

    .imgBorder img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    .reply-content,
    .reply_contentBox span {
        vertical-align: middle;
        word-break: break-all;
    }

    .replyImg_box {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 0;
        display: inline-block;
        overflow: hidden;
    }

    .leaveWord .photo {
        padding: 10px;
        margin-right: 10px;
    }

    .leaveWord .reply-name {
        font-size: 20px;
    }

    .leaveWord .reply-time {
        color: #888;
    }

    .leaveWord .reply-text {
        flex: 1;
        padding-top: 15px;
    }

    .reply_contentBox {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .leaveWord .reply-textBox {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        line-height: 30px;
    }

    .sendMessage .titles {
        color: #c5c5c5;
        font-size: 24px;
        margin-top: 25px;
    }

    .sendMessage .input {
        margin-top: 19px;
        margin-bottom: 40px;
    }

    .sendMessage .btn {
        color: #c5c5c5;
        font-size: 18px;
        background: none;
        border: 1px solid #7d7d7d;
    }

</style>
