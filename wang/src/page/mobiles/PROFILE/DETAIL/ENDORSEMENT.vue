<template>
    <!--代言-->
    <div class="mobile_contentBrand">
        <div class="brandList">
            <div class="title">{{$t('profile.onGoing')}}</div>
            <el-row :gutter="30">
                <el-col v-for="(item,index) in proceedIcon"
                        :key="index"
                        :xs="8" :sm="6" :md="4">
                    <div class="brand marginBottom20" @click="clickBrand(item)">
                        <div class="brandBox">
                            <img :src="item.brandLogo" alt="logo">
                        </div>
                        <div class="tc brandBox_name">{{item.brandName}}</div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="brandList">
            <div class="title">{{$t('profile.finished')}}</div>
            <el-row :gutter="30">
                <el-col v-for="(item,index) in finishIcon"
                        :key="index"
                        :xs="8" :sm="6" :md="4">
                    <div class="brand marginBottom20" @click="clickBrand(item)">
                        <div class="brandBox">
                            <img :src="item.brandLogo" alt="logo">
                        </div>
                        <div class="tc brandBox_name">{{item.brandName}}</div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ENDORSEMENT",
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
                let _t = this;
                _t.$api.post('represent/representList', {
                    language: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'), // 语言
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            // 获取进行中的数据
                            let proceedIcon = res.data !== undefined && res.data !== null ? res.data : [];
                            proceedIcon.forEach((item) => {
                                if (item.brandLogo !== null && item.brandLogo !== '') {
                                    item.brandLogo = _t.$api.imgUrl() + item.brandLogo;
                                }
                            });
                            _t.proceedIcon = proceedIcon;
                            // 获取已结束的数据
                            let finishIcon = res.data2 !== undefined && res.data2 !== null ? res.data2 : [];
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
                let _t = this;
                _t.$jump.toJumpPage('END_DETAILS', 'M_END_DETAILS', {
                    WJE_END_DETAILS_ID: item.id
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
    .mobile_contentBrand {
        margin: 30px 0;
    }

    .brandList {
        padding: 0 5%;
        margin-bottom: 30px;
        font-size: 16px;
    }

    .brandList .title {
        font-size: 20px;
        display: inline-block;
        border-bottom: 3px solid #fff;
        margin-bottom: 20px;
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

    .brandBox_name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
