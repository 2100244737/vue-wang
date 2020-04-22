<template>
    <div class="Lyric">
        <div ref="musicLyric" class="music-lyric">
            <div class="music-lyric-items" :style="lyricTop">
                <template ref="top">
                    <p @mousedown="down" v-for="(item, index) in lyric" :key="index" :class="{on:lyricIndex===index}">
                        {{item.text}}</p>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'index',
        props: {
            // 歌词数据
            lyric: {
                type: Array,
                default: () => []
            },
            // 当前歌词下标
            lyricIndex: {
                type: Number,
                default: 0
            },
            // 是否无歌词
            noLyric: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                top: '',// 歌词居中
                status: false, // 是否可拖动
                scroll: null, // 歌词滚动距离
                downClientY: 0, // 按下坐标
                barMoveClientY: 0,// 松开坐标
                startX: 0, // 记录最开始点击的X坐标
                scrollTop: 0 // 记录当前已经移动的距离
            }
        },
        computed: {
            // 计算 歌词滚动多少
            lyricTop() {
                this.scroll = `transform :translate3d(0, ${-34 * (this.lyricIndex - this.top) + this.scrollTop}px, 0)`;
                return this.scroll;
            }
        },
        mounted() {
            this.$refs.musicLyric.addEventListener('resize', () => {
                clearTimeout(this.resizeTimer);
                this.resizeTimer = setTimeout(() => this.clacTop(), 60)
            });
            this.$nextTick(() => {
                this.bindEvents();
            });
        },
        methods: {
            // 添加绑定事件
            bindEvents() {
                document.addEventListener('mousemove', this.barMove);
                document.addEventListener('mouseup', this.barUp);
            },
            // 计算歌词居中的 top值
            clacTop() {
                const dom = this.$refs.musicLyric;
                const {display = ''} = window.getComputedStyle(dom);
                if (display === 'none') {
                    return;
                }
                const height = dom.offsetHeight;
                this.top = Math.floor(height / 35 / 2);
            },
            // 鼠标 按下
            down(e) {
                this.status = true;
                this.downClientY = e.clientY;
            },
            // 鼠标抬起
            barUp(e) {
                e.stopPropagation();
                this.status = false;
                this.barMoveClientY = 0;
                this.downClientY = 0;
                this.scrollTop = 0;
            },
            // 鼠标移动
            barMove(e) {
                if (!this.status) {
                    return false;
                }
                this.barMoveClientY = e.clientY;
                this.scrollTop = this.barMoveClientY - this.downClientY;
            }
        }
    }
</script>


<style scoped>
    .Lyric {
        width: 400px;
        margin: 0 auto;
    }

    .music-lyric {
        user-select: none;
        cursor: pointer;
        width: 400px;
        height: 300px;
        overflow: hidden;
        text-align: center;
        -webkit-mask-image: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.6) 15%, rgba(255, 255, 255, 1) 25%, rgba(255, 255, 255, 1) 75%, rgba(255, 255, 255, 0.6) 85%, rgba(255, 255, 255, 0) 100%);
    }

    .music-lyric-items {
        margin-top: 200px;
        text-align: center;
        line-height: 34px;
        font-size: 16px;
        transform: translate3d(0, 0, 0);
        transition: transform 0.6s ease-out;
    }

    .music-lyric-items p {
        padding: 0 20px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
</style>
