<template>
    <!--会员状态-->
    <div class="mobile_memberBox">
        <div v-if="listData.length === 0" class="tableNotHasData flex_1">
            <img class="notData" src="../../../../assets/img/common/notData.png" alt="notData">
            <div class="notDataText">{{$t('public.notData')}}</div>
        </div>
        <table v-else class="mobileCenter">
            <tr class="memberListBox" v-for="(item,index) in listData" :key="index">
                <td v-for="(val,i) in item" :key="i" class="memberItem">
                    <div class="iconImg">
                        <img :src="val.iconPath" alt="">
                    </div>
                    <div class="title">{{val.title}}</div>
                    <div class="message">{{val.description}}</div>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: "MEMBER",
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
                                    if (index % 2 === 0) {
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
            }
        }
    }
</script>

<style scoped>
    .mobile_memberBox {
        padding: 5%;
    }

    .mobileCenter {
        margin: 0 auto;
    }

    .memberItem {
        text-align: center;
        border-top: 1px solid #2c2c2c;
    }

    .memberItem:nth-child(2n+1) {
        border-right: 1px solid #2c2c2c;
    }

    .iconImg > img {
        width: 50px;
        height: 50px;
        margin-bottom: 10px;
    }

    .memberItem .title {
        margin-bottom: 5px;
    }

    td.memberItem {
        vertical-align: top;
        padding: 10px;
    }

    .memberListBox:nth-child(1) td {
        border-top: none;
    }
</style>
