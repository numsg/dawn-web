import systemConfigService from '@/api/system-config/system-config.service';
import SystemConfig from '@/models/common/system-config-model';

const PMSystemConfig = {
  state: {
    systemConfigs: []
  },
  mutations: {
    LOAD_SYSTEM_CONFIGS: (state: any, result: any) => {
     state.systemConfigs = result;
    }
  },
  actions: {
    async LoadSystemConfigs({ commit }: any) {
      const response = await systemConfigService.LoadSystemConfigs();
      if (response) {
        commit('LOAD_SYSTEM_CONFIGS', response);
      }
    },
  },
  getters: {
    systemConfigs: (state: any) => state.systemConfigs
  }
};

export default PMSystemConfig;
