<template>
    <!--代言-->
    <div class="contentBrand">
        <div class="brandList">
            <div class="title">{{$t('profile.onGoing')}}</div>
            <el-row :gutter="20" class="marginTop30 brandIconBox">
                <el-col
                    :xl="3" :lg="4" :md="6" :sm="8" :xs="12"
                    class="brandIconItem"
                    v-for="(item,index) in proceedIcon" :key="index">
                    <div class="brand"
                         @click="clickBrand(item)">
                        <div class="brandBox">
                            <img :src="item.brandLogo" alt="logo">
                        </div>
                        <div class="tc">{{item.brandName}}</div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="brandList">
            <div class="title">{{$t('profile.finished')}}</div>
            <el-row :gutter="20" class="marginTop30 brandIconBox">
                <el-col
                    :xl="3" :lg="4" :md="6" :sm="8" :xs="12"
                    class="brandIconItem"
                    v-for="(item,index) in finishIcon" :key="index">
                    <div class="brand" @click="clickBrand(item)">
                        <div class="brandBox">
                            <img :src="item.brandLogo" alt="logo">
                        </div>
                        <div class="tc">{{item.brandName}}</div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'ENDORSEMENT',
        data() {
            return {
                // 进行中集合
                proceedIcon: [],
                // 已结束集合
                finishIcon: [],
            }
        },
        methods: {
            // 代言列表查询
            getData() {
                var _t = this;
                _t.$api.post('represent/representList', {
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'), // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            // 获取进行中的数据
                            var proceedIcon = res.data !== undefined && res.data !== null ? res.data : [];
                            proceedIcon.forEach((item) => {
                                if (item.brandLogo !== null && item.brandLogo !== '') {
                                    item.brandLogo = _t.$api.imgUrl() + item.brandLogo;
                                }
                            });
                            _t.proceedIcon = proceedIcon;
                            // 获取已结束的数据
                            var finishIcon = res.data2 !== undefined && res.data2 !== null ? res.data2 : [];
                            finishIcon.forEach((item) => {
                                if (item.brandLogo !== null && item.brandLogo !== '') {
                                    item.brandLogo = _t.$api.imgUrl() + item.brandLogo;
                                }
                            });
                            _t.finishIcon = finishIcon;
                            break;
                        default:
                            _t.$message.error(_t.$t('public.queryError'));
                            break;
                    }
                })
            },
            // 点击查看详情
            clickBrand(item) {
                var _t = this;
                _t.$router.push({
                    name: 'END_DETAILS',
                    params: {
                        WJE_END_DETAILS_ID: item.id
                    }
                });
                localStorage.setItem('WJE_END_DETAILS_ID', item.id);
            }
        },
        created() {
            let _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'ENDORSEMENT', 'M_ENDORSEMENT');
            if (jump === false) {
                _t.getData();
            }
        }
    }
</script>

<style scoped>
    .contentBrand {
        background: #0b0b0b;
        padding: 50px 130px;
        color: #ffffff;
    }

    .brandList .title {
        display: inline-block;
        font-size: 24px;
        height: 50px;
        line-height: 50px;
        padding-bottom: 10px;
        border-bottom: 5px solid #fff;
    }

    .brandIconBox {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        flex-flow: row wrap;
    }

    .brandIconItem {
        margin-bottom: 30px;
    }

    .brandIconItem .brand {
        width: 186px;
        padding: 0 20px;
        font-size: 16px;
    }

    .brandBox {
        padding: 10px;
        margin-bottom: 15px;
        background: url("../../../../assets/img/common/dauYang_bg.png") no-repeat center/100% 100%;
    }

    .brandBox img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
    }
</style>
