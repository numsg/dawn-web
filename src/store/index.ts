import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import getters from '@/store/getters';

import app from './modules/app';
import login from './modules/login';
import eventType from './modules/event-type';
import { whatever } from '@gsafety/whatever/dist/store/modules/whatever';
import { dependencyData } from '@gsafety/whatever/dist/store/modules/dependency-data';
import { templateStore } from '@gsafety/whatever/dist/store/modules/templates';
import { systemConfig } from '@gsafety/whatever/dist/store/modules/system-config';
import { PMSComponentManager } from './modules/component-manage';
import layout from './modules/layout';
import systemSet from './modules/system-set';
import PMSystemConfig from './modules/system-config';
import userManage from './modules/user-manage';
import baseData from './modules/base-data';
import outbreakDuty from './modules/outbreak-duty';
Vue.use(Vuex);

// const isDev = process.env.NODE_ENV === 'development';
const store = new Vuex.Store({
  modules: {
    whatever,
    systemConfig,
    templateStore,
    dependencyData,
    PMSComponentManager,
    eventType,
    app,
    login,
    layout,
    systemSet,
    PMSystemConfig,
    userManage,
    baseData,
    outbreakDuty
  },
  getters
  // plugins: isDev ? [createLogger({})] : []
});

export default store;
