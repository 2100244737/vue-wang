<template>
    <!--代言详情-->
    <div class="endDetails">
        <div class="brandList">
            <div class="title">{{formItem.title}}</div>
            <div v-for="(item,index) in listData" :key="index">
                <ul v-if="item.photoList!== undefined && item.photoList.length !== 0"
                    class="content-middle clearFix">
                    <li class="fl" v-for="(val,i) in item.photoList" :key="i">
                        <div @click="showDialog(val)" class="message_img" :style="{backgroundImage:'url('+val+')'}">
                            <img class="visibilityHidden"
                                 src="../../../../assets/img/thumbnail_bg/daiYangDetail.png"
                                 alt="">
                        </div>
                    </li>
                </ul>
                <div v-if="item.content !== undefined" class="endText">
                    <p>{{item.content}}</p>
                </div>
                <div v-if="item.link !== undefined" class="weiBo">
                    <a target="_blank" :href="item.link">{{item.link}}</a>
                </div>
            </div>
        </div>
        <!--图片详情-->
        <el-dialog
            class="imgDialog"
            :show-close="false"
            :visible.sync="dialogVisibles"
            append-to-body
            :before-close="resetImg">
            <img class="widthAll" :src="imgs">
        </el-dialog>
    </div>
</template>

<script>

    export default {
        name: 'ENDDETAILS',
        data() {
            return {
                // 查询表单
                formItem: {
                    id: '', // 代言id
                    title: '' // 标题
                },
                // 数据列表
                listData: [],
                //图片详情
                imgs: '',
                dialogVisibles: false,//图片蒙版
            }
        },
        methods: {
            showDialog(item) {
                var _t = this;
                _t.imgs = item;
                _t.dialogVisibles = true;
            },
            // 点击关闭图片蒙版
            resetImg() {
                var _t = this;
                _t.dialogVisibles = false;
                _t.imgs = '';
            },
            // 代言列表查询
            getData() {
                let _t = this;
                _t.$api.post('represent/getRepresentInfoById', {
                    id: _t.formItem.id,
                }, function (res) {
                    switch (res.status) {
                        case 200:
                            if (res.data !== undefined && res.data !== null && res.data.length !== 0) {
                                let resData = res.data;
                                _t.formItem.title = resData[0].brandName;
                                let str = resData[0].representContentStr !== undefined ? resData[0].representContentStr : '';
                                if (str !== '' && str !== null) {
                                    let listData = JSON.parse(str);
                                    listData.forEach((item) => {
                                        item.content = item.content !== undefined && item.content !== null ? item.content : '';
                                        item.link = item.link !== undefined && item.link !== null ? item.link : '';
                                        item.photoList = new Array();
                                        if (item.photos.length !== 0) {
                                            item.photos.forEach((val) => {
                                                item.photoList.push(_t.$api.imgUrl() + val);
                                            });
                                        }
                                    });
                                    _t.listData = listData;
                                }
                            }
                            break;
                        default:
                            break;
                    }
                });
            },
        },
        created() {
            var _t = this;
            let jump = _t.$jump.isToJump(_t.$route.name, 'END_DETAILS', 'M_END_DETAILS');
            if (jump === false) {
                _t.formItem.id = _t.$route.params.WJE_END_DETAILS_ID ? _t.$route.params.WJE_END_DETAILS_ID : localStorage.getItem('WJE_END_DETAILS_ID');
                _t.getData();
                _t.$parent.dealWith();
            }
        },
        destroyed() {
            localStorage.removeItem('WJE_END_DETAILS_ID');
        }
    }
</script>

<style scoped>
    .endDetails {
        background: #0b0b0b;
        padding: 50px 130px;
        color: #fff;
    }

    .brandList .title {
        display: inline-block;
        font-size: 24px;
        height: 50px;
        line-height: 50px;
        padding-bottom: 10px;
        border-bottom: 5px solid #fff;
        margin-bottom: 30px;
    }

    .content-middle {
        width: 100%;
    }

    .content-middle li {
        width: 33.33%;
        display: inline-block;
        box-sizing: border-box;
        padding: 0 10px;
        margin-bottom: 20px;
    }

    .content-middle li img {
        width: 100%;
        height: 100%;
    }

    .endText {
        font-size: 14px;
        line-height: 30px;
        padding: 0 10px;
    }

    .weiBo {
        margin-bottom: 20px;
    }

    .weiBo a {
        color: #6275c5;
    }
</style>
