<template>
    <div class="tradeBox">
        <div class="tradeMobile">
            <div class="tradeSpan">{{$t('copyright.title')}}</div>
<!--            <div class="tradeSpans">{{$t('copyright.des')}}</div>-->
        </div>
    </div>
</template>

<script>
    export default {
        name: "mobile_copyRight"
    }
</script>

<style scoped>
    .tradeBox {
        border-top: 1px solid #2c2c2c;
    }

    .tradeMobile {
        padding: 10px 0;
        text-align: center;
        color: #414141;
        font-size: 14px;
    }
</style>
