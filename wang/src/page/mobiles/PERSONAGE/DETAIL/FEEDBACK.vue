<template>
    <div class="feedback">
        <!--隐藏接口的意见反馈-->
        <div v-if="false" v-html="formItem.content"></div>
        <p>
            <span>{{$t('feedback.description')}}</span>
            <span>{{$t('feedback.email')}}</span>
        </p>
    </div>
</template>

<script>
    export default {
        name: "FEEDBACK",
        data() {
            return {
                // 查询表单
                formItem: {
                    content: '', // 内容
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en')
                }
            }
        },
        methods: {
            // 获取意见反馈的数据
            getData() {
                let _t = this;
                _t.$api.post('vip/getConfidentiality', {
                    vipId: '3', // 0: 注册 1: 支付 2: 保密公告 3: 意见反馈
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
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'FEEDBACK', 'M_FEEDBACK');
            if (jump === false) {
                // _t.getData();
            }
        }
    }
</script>

<style scoped>
    .feedback {
        padding: 10% 5%;
        margin-top: 20px;
        font-size: 14px;
        line-height: 30px;
        text-align: center;
        border-top: 1px solid #4d4d4d;
    }
</style>
