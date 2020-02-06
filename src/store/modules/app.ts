import systemConfigService from '@/api/system-config/system-config.service';

const app = {
  state: {
    sidebar: {
      opened: !Number(sessionStorage.getItem('sidebarStatus'))
    },
    language: sessionStorage.getItem('language') || 'en',
    configs: {}
  },
  mutations: {
    TOGGLE_SIDEBAR: (state: any) => {
      if (state.sidebar.opened) {
        sessionStorage.setItem('sidebarStatus', String(1));
      } else {
        sessionStorage.setItem('sidebarStatus', String(0));
      }
      state.sidebar.opened = !state.sidebar.opened;
    },
    SET_LANGUAGE: (state: any, language: any) => {
      state.language = language;
      sessionStorage.setItem('language', language);
    },
    SET_CONFIGS: (state: any, configs: any) => {
      state.configs = configs;
    },

    // 将从数据库中读取的配置添加到config中。
    ADD_CONFIGS: (state: any, configs: any) => {
      state.configs = Object.assign(state.configs, configs);
    }
  },
  actions: {
    ToggleSideBar: ({ commit }: any) => {
      commit('TOGGLE_SIDEBAR');
    },
    setLanguage: ({ commit }: any, language: any) => {
      commit('SET_LANGUAGE', language);
    },
    setConfigs: async ({ commit }: any, configs: any) => {
      // let sysConfogs = await systemConfigService.LoadSystemConfigs(configs.baseSupportOdataUrl);
      // sysConfogs = systemConfigService.toConvertJsonStr(sysConfogs);
      // configs = Object.assign(configs, sysConfogs);
      commit('SET_CONFIGS', configs);
    },
    addConfigs({ commit }: any, configs: any) {
      commit('ADD_CONFIGS', configs);
    }
  },
  getters: {
    configs: (state: any) => state.configs
  }
};

export default app;
