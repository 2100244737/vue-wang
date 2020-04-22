<template>
    <div class="mobileContentBox">
        <!--标题-->
        <div class="mobileHeadLine">
            <div class="mobileTitleText">{{$t('message.title')}}</div>
        </div>
        <!--内容-->
        <div class="leaveWord">
            <div class="leaveList">
                <ul class="reply" v-for="(item, index) in replyData" :key="index">
                    <li class="marginRight10">
                        <span class="imgBorder">
                            <img class="widthAll" :src="item.imgUrl" alt="">
                        </span>
                    </li>
                    <li class="flex_1">
                        <div class="reply-textBox">
                            <p class="reply-name">{{item.fromReplyUserName}}</p>
                            <p class="reply-time">{{item.replyTime}}</p>
                        </div>
                        <p class="reply-content">{{item.replyMessage}}</p>
                        <div v-if="item.sonList.length !== 0 && item.sonList !== null" class="flex_1">
                            <div class="reply_contentBox" v-for="(val,i) in item.sonList" :key="i">
                                <div class="replyImg_box">
                                    <img class="widthAll" :src="val.headImg" alt="">
                                </div>
                                <div class="flex_1 messageContent">
                                    <span>{{val.fromReplyUserName}}：</span>
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
                    class="inputText"
                    type="textarea"
                    :autosize="{minRows: 7}"
                    maxlength="1500"
                    show-word-limit
                    v-model="formItem.textarea">
                </el-input>
                <el-button size="small" class="marginTop10" @click="send_msg">{{$t('message.btnText')}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {dateFilterDayCN} from "../../../../assets/js/filters";

    export default {
        name: "MESSAGE",
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
                    pageSize: 10, // 每页显示条数
                    total: 0, // 总条数
                },
                // 限制点击more每次自增10
                limitMore: 10
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
                // 调用父级的用户信息判断是否vip到期
                _t.$parent.getUserInfo();
            }
        }
    }
</script>

<style scoped>
    .leaveWord {
        padding: 10px;
        background: url("../../../../assets/img/common/mask_bg.png") repeat;
    }

    .leaveWord .reply {
        margin-bottom: 12px;
        padding: 10px;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .imgBorder {
        width: 40px;
        height: 40px;
        display: inline-block;
        border: 1px solid #B9BBBA;
        border-radius: 50%;
        overflow: hidden;
    }

    .reply-textBox {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        line-height: 20px;
        margin-top: 10px;
    }

    .moreBtn,
    .reply_contentBox > span,
    .reply-content {
        font-size: 12px;
        word-break: break-all;
    }

    .replyImg_box {
        width: 30px;
        height: 30px;
        display: inline-block;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 5px;
    }

    .reply_contentBox {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: start;
        margin-top: 5px;
        font-size: 12px;
    }

    .reply_contentBox .blueColor {
        margin-right: 5px;
    }

    .messageContent {
        padding-top: 7px;
    }

    .messageContent > span {
        word-break: break-all;
        line-height: 20px;
    }

    .sendMessage .titles {
        margin: 5px 0;
    }

    .replyImg_box > img,
    .imgBorder > img {
        width: 100%;
        height: 100%;
    }
</style>
<style>
    .sendMessage .inputText .el-textarea__inner {
        background: rgba(0, 0, 0, 0.3);
        border: none;
        color: #fff;
    }

    .sendMessage .inputText .el-input__count {
        background: rgba(0, 0, 0, 0.3);
    }
</style>
