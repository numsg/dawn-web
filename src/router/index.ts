import Vue from 'vue';
import Router from 'vue-router';

import { LoginComponent } from '@/components/login';
import { ErrorComponent } from '@/components/error';

import RouterElement from '@/models/router-element/router-element';
import Component from 'vue-class-component';
Component.registerHooks(['beforeRouteEnter', 'beforeRouteUpdate', 'beforeRouteLeave']);


const routerMap: any = [];
const routerLogin = new RouterElement();
const routerError = new RouterElement();
const routerAnyError = new RouterElement();
// const routerComponentMgr = new RouterElement();
/**
 * login
 */
routerLogin.path = '/login';
routerLogin.name = 'login';
routerLogin.component = LoginComponent;
routerLogin.hidden = true;
routerMap.push(routerLogin);

/**
 * error
 */
routerError.path = '/404';
routerError.name = '';
routerError.component = ErrorComponent;
routerError.hidden = true;
routerMap.push(routerError);

/**
 *  *
 */
routerAnyError.path = '/error';
routerAnyError.name = 'error';
routerAnyError.component = ErrorComponent;
routerAnyError.hidden = true;
routerMap.push(routerAnyError);

// routerComponentMgr.path = '/component-manager';
// routerComponentMgr.name = 'component-manager';
// routerComponentMgr.component = PmsComponentManager;
// routerComponentMgr.hidden = true;
// routerMap.push(routerComponentMgr);

export let constRouterMap = routerMap;

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location: any) {
  return Promise.resolve(originalPush.call(this, location)).catch((err: any) => err);
};

Vue.use(Router);

// 根据运行环境设置路由mode的值，防止刷新页面出现404
// let modeValue: any;
// if (process.env.NODE_ENV === 'production') {
//   // 为生产环境修改配置...
//   modeValue = 'hash';
// } else {
//   // 为开发环境修改配置...
//   modeValue = 'hash';
// }

const modeValue = 'hash';

export default new Router({
  mode: modeValue,
  base: process.env.BASE_URL,
  routes: routerMap
  // routes: constantRouterMap,
});
