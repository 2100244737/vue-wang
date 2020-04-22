<template>
    <div class="tradeBox">
        <div class="trade">
            <span class="tradeSpan">{{$t('copyright.title')}}</span>
<!--            <span class="tradeSpans">{{$t('copyright.des')}}</span>-->
        </div>
    </div>
</template>

<script>
    export default {
        name: "copyright"
    }
</script>

<style scoped>
    .trade {
        width: 100%;
        height: 159px;
        line-height: 159px;
        text-align: center;
        color: #414141;
        font-size: 14px;
    }

    .tradeSpan {
        margin-right: 30px;
    }
</style>
