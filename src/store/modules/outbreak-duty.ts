import epidemicDynamicService from '@/api/epidemic-dynamic/epidemic-dynamic.service';
import systemConfigService from '@/api/system-config/system-config.service';

const outbreakDuty = {
  state: {
    epidemicStaticalData: [],
    totalCount: 0,
    epidemicPersonList: [],
  },
  mutations: {
    SET_PIDEMIC_STATICAL_DATA: (state: any, result: any) => {
        if (result && Array.isArray(result)) {
            result.forEach(e => {
                e.name = e.dSourceDataModel.name;
                e.id = e.dSourceDataModel.id;
                e.selected = false;
                e.strokeStyle = e.dSourceDataModel.imgColor;
                e.value = e.count;
            });
            state.epidemicStaticalData = result;
        }
    },
    SET_PIDEMIC_PERSONS: (state: any, result: any) => {
        if (result) {
            state.totalCount = result.count;
            state.epidemicPersonList = result.value;
        }
    },
  },
  actions: {
    async SetEpidemicStaticalData({ commit }: any) {
      const result = await epidemicDynamicService.getEpidemicStaticalData();
      commit('SET_PIDEMIC_STATICAL_DATA', result);
    },
    async SetEpidemicPersons({ commit }: any, payloads: any) {
        const result = await epidemicDynamicService.queryEpidemicPersons(payloads);
        commit('SET_PIDEMIC_PERSONS', result);
      },
  },
  getters: {
    outbreakDuty_epidemicStaticalData: (state: any) => state.epidemicStaticalData,
    outbreakDuty_totalCount: (state: any) => state.totalCount,
    outbreakDuty_epidemicPersonList: (state: any) => state.epidemicPersonList,

  }
};

export default outbreakDuty;
