// tslint:disable
import Vue from 'vue';
import VueI18n from 'vue-i18n';

const zh = require('./zh-CN.json');
const en = require('./en-US.json');
const es = require('./es-EC.json');

import elementEnLocale from 'element-ui/lib/locale/lang/en'; // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'; // element-ui lang
import elementEsLocale from 'element-ui/lib/locale/lang/es';
import ElementLocale from 'element-ui/lib/locale';

Vue.use(VueI18n);

const messages = {
  en: {
    ...en,
    ...elementEnLocale
  },
  zh: {
    ...zh,
    ...elementZhLocale
  },
  es: {
    ...es,
    ...elementEsLocale
  }
};

const i18n = new VueI18n({
  locale: sessionStorage.getItem('language') || navigator.language.substr(0, 2) || 'zh',
  messages
});
// 解决Element-ui组件内的词条
// ElementLocale.use('zh-CN');
ElementLocale.i18n((key: string, value: any) => i18n.t(key, value));
export default i18n;
