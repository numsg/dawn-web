import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import getters from '@/store/getters';

import app from './modules/app';
import login from './modules/login';
import eventType from './modules/event-type';
import { PMSComponentManager } from './modules/component-manage';
import layout from './modules/layout';
import systemSet from './modules/system-set';
import PMSystemConfig from './modules/system-config';
import userManage from './modules/user-manage';
import baseData from './modules/base-data';
import outbreakDuty from './modules/outbreak-duty';
import dailyTroubleshooting from './modules/daily-troubleshooting';
import communityAssociation from './modules/community-association';
import troubleshootingHistory from './modules/troubleshooting-history';
Vue.use(Vuex);

// const isDev = process.env.NODE_ENV === 'development';
const store = new Vuex.Store({
  modules: {
    PMSComponentManager,
    eventType,
    app,
    login,
    layout,
    systemSet,
    PMSystemConfig,
    userManage,
    baseData,
    outbreakDuty,
    dailyTroubleshooting,
    communityAssociation,
    troubleshootingHistory
  },
  getters
  // plugins: isDev ? [createLogger({})] : []
});

export default store;
