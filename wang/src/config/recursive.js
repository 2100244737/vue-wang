// 获取url的参数
const getUrlKey = (name) => {
    return (decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.href) || [, ""])[1].replace(/\+/g, "%20")) || null);
};

// 判断是否是json格式
const isJSON = (str) => {
    if (typeof str == 'string') {
        try {
            let obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
};

export default {
    // 获取url参数
    getUrlKey: function (name) {
        return getUrlKey(name);
    },
    // 判断是否是json
    isJSON: function (str) {
        return isJSON(str);
    }
}
