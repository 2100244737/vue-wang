// 引入vue
import Vue from 'vue';
// 引入 i18n
import VueI18n from 'vue-i18n';
// 引入英文语言包
import elementEnLocale from 'element-ui/lib/locale/lang/en';
// 引入中文语言包
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN';
// 引入本地英文
import enLocale from './en';
// 引入本地中文
import zhLocale from './zh-cn';

// 使用i18n
Vue.use(VueI18n);

//
const messages = {
    en: {
        ...enLocale,
        ...elementEnLocale
    },
    zh_CN: {
        ...zhLocale,
        ...elementZhLocale
    }
};

const i18n = new VueI18n({
    locale: localStorage.getItem('WJE_LANGUAGE') || (navigator.language === 'zh-CN' ? 'zh_CN' : 'en'), // 语言标识
    messages,
    silentTranslationWarn: true, // 没有key值时发出警告
});

export default i18n;

