<template>
    <!--会员状态-->
    <div class="memberBox">
        <div v-if="listData.length === 0" class="tableNotHasData flex_1">
            <img class="notData" src="../../../../assets/img/common/notData.png" alt="notData">
            <div class="notDataText">{{$t('public.notData')}}</div>
        </div>
        <div v-else class="memberListBox" v-for="(item,index) in listData" :key="index">
            <div class="memberItem" v-for="(val,i) in item" :key="i">
                <div class="iconImg">
                    <img :src="val.iconPath" alt="">
                </div>
                <div class="title">{{val.title}}</div>
                <div class="message">{{val.description}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'MEMBER',
        data() {
            return {
                // 查询表单
                formItem: {
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en')
                },
                // 列表数据
                listData: []
            }
        },
        methods: {
            // 获取数据
            getData() {
                let _t = this;
                _t.$api.post('vipRights/getVipRightsByLevel', {
                    vipLevel: null, // vip 等级
                    language: _t.formItem.language, // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200: // 成功
                            let resData = res.data !== undefined && res.data !== null ? res.data : [];
                            let newArr = new Array(); // 新数组
                            if (resData.length !== 0) {
                                resData.forEach((item, index) => {
                                    // 处理图标
                                    if (item.iconPath !== undefined && item.iconPath !== null) {
                                        item.iconPath = _t.$api.imgUrl() + item.iconPath;
                                    }
                                    if (index % 4 === 0) {
                                        newArr.push(new Array());
                                    }
                                    newArr[newArr.length - 1].push(item);
                                });
                            }
                            _t.listData = newArr;
                            break;
                        default: // 失败
                            _t.listData = [];
                            break;
                    }
                });
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'MEMBER', 'M_MEMBER');
            if (jump === false) {
                _t.getData();
                if (_t.$route.name === 'MEMBER' || _t.$route.name === 'M_MEMBER') {
                    // 调用父级二级导航选中态
                    _t.$parent.dealWith();
                }
            }
        }
    }
</script>

<style scoped>
    .memberBox {
        padding: 130px;
    }

    .memberListBox {
        display: flex;
        flex-direction: row;
    }

    .memberItem {
        width: 25%;
        padding: 20px;
        text-align: center;
        box-sizing: border-box;
        margin-bottom: 50px;
        display: flex;
        flex-direction: column;
    }

    .title {
        font-size: 18px;
        margin-bottom: 10px;
    }

    .message {
        font-size: 14px;
        line-height: 20px;
    }

    .iconImg {
        margin-bottom: 30px;
    }

    .iconImg > img {
        max-width: 50px;
    }
</style>
