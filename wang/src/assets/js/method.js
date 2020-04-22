export default {
    // 解析歌词
    parse(str) {
        var lrcArray = new Array();
        if (str !== undefined) {
            var arr = str.split('\\n');
            var html = "";
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != '') {
                    var tempArray = arr[i].split("]");
                    if (tempArray.length > 1) {
                        var offset = tempArray[0].substring(1, tempArray[0].length - 1);
                        offset = this.parseTime(offset);
                        var text = tempArray[1];
                        lrcArray.push({"offset": offset, "text": text});
                    }
                }
            }
        }
        return lrcArray;
    },
    // 解析歌词 时间
    parseTime(time) {
        var tl = time.split(":");
        switch (tl.length) {
            case 1: {
                return parseFloat(tl[0]);
            }
            case 2 : {
                return parseFloat(tl[0]) * 60 + parseFloat(tl[1])
            }
            case 3 : {
                return parseFloat(tl[0]) * 3600 + parseFloat(tl[1]) * 60 + parseFloat(tl[2]);
            }
        }
    },
    // 补0函数
    addZero(s) {
        return s < 10 ? '0' + s : s
    },
    // 时间格式化
    format(value) {
        let minute = Math.floor(value / 60);
        let second = Math.floor(value % 60);
        return `${this.addZero(minute)}:${this.addZero(second)}`
    }
}
