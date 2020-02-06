import Vue from 'vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import config from './utils/app-config';
import { errorHandler, onError } from './utils/error-handler';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 解决页面刷新滚动条样式问题
import '@/assets/styles/reset.scss';
import RouterBefore from '@/router/router-before';

import VueTsCss from 'vue-css-ts';
import { translate } from './common/filters/translate';
import infiniteScroll from 'vue-infinite-scroll';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
import PortalVue from 'portal-vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import 'vue-orgchart/dist/style.min.css';
import { ConfigHelper } from '@gsafety/whatever/dist/util/config-helper';

import magicAnnotationDirective from '@gsafety/whatever/dist/directives/magic-annotation.directive';

NProgress.configure({ ease: 'ease', speed: 1000 });

Vue.use(infiniteScroll);
Vue.directive('magic-annotation', magicAnnotationDirective);

config(store).then(() => {
  Vue.config.productionTip = false;
  Vue.config.errorHandler = errorHandler;
  if (window) {
    window.onerror = onError;
  }
  ConfigHelper.use(store.getters.configs);
  Vue.use(PortalVue);
  Vue.use(ElementUI, { size: 'small' });
  Vue.use(VueTsCss);
  Vue.use(Viewer, {
    defaultOptions: {
      title: false
    }
  });
  const routerElementArr: any = [];

  router.beforeEach((to, from, next) => {
    NProgress.start();
    RouterBefore.routerBefore(to, from, next, routerElementArr);
  });
  router.afterEach(() => {
    NProgress.done();
  });

  Vue.filter('translate', translate);

  new Vue({
    router,
    store,
    i18n
  }).$mount('#app-main');
});
