// 引入加密文件
let CryptJS = require("crypto-js");
// _key aesKey
let _key = 'krstuvwsyz01sodm';
// _iv 初始化向量
let _iv = '0000000000000000';

let AESUtil = {
    /**
     * AES 加密
     * @param _content 待加密内容
     * @param _key aesKey,
     * @param _iv 初始化向量
     * @return 返回经 BASE64 处理之后的密文
     */
    encrypt: function (_content) {
        // 先以 UTF-8 编码解码参数 返回 any 类型
        let content = CryptJS.enc.Utf8.parse(_content);
        let aesKey = CryptJS.enc.Utf8.parse(_key);
        let iv = CryptJS.enc.Utf8.parse(_iv);

        // 加密
        let encrypted = CryptJS.AES.encrypt(content, aesKey, {
            iv: iv,
            mode: CryptJS.mode.CBC,
            padding: CryptJS.pad.Pkcs7
        });
        return CryptJS.enc.Base64.stringify(encrypted.ciphertext);
    },

    /**
     * AES 解密
     * @param：_content 待解密的内容[Base64处理过的]
     * @param：解密用的 AES key
     * @param: 初始化向量
     * @return 返回以 UTF-8 处理之后的明文
     */
    decrypt: function (_content) {
        let aesKey = CryptJS.enc.Utf8.parse(_key);
        let iv = CryptJS.enc.Utf8.parse(_iv);

        // 解密
        let decrypted = CryptJS.AES.decrypt(_content, aesKey, {
            iv: iv,
            mode: CryptJS.mode.CBC,
            padding: CryptJS.pad.Pkcs7
        });
        return decrypted.toString(CryptJS.enc.Utf8);
    }
};

export default AESUtil;
