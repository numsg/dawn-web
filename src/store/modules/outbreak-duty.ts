import { QueryCondition } from './../../models/common/query-condition';
import epidemicDynamicService from '@/api/epidemic-dynamic/epidemic-dynamic.service';
import transformToColor from '@/common/filters/colorformat';

const outbreakDuty = {
  state: {
    epidemicStaticalData: [],
    totalCount: 0,
    epidemicPersonList: [],
    queryCondition: new QueryCondition()
  },
  mutations: {
    SET_PIDEMIC_STATICAL_DATA: (state: any, result: any) => {
        if (result && Array.isArray(result)) {
            result.forEach(e => {
                e.name = e.dSourceDataModel.name;
                e.id = e.dSourceDataModel.id;
                e.selected = false;
                // e.strokeStyle = e.dSourceDataModel.imgColor;
                e.strokeStyle = e.dSourceDataModel.imgColor ? e.dSourceDataModel.imgColor : transformToColor(e.dSourceDataModel.name);
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
    SET_QUERY_CONDITION: (state: any, result: any) => {
       Object.assign(state.queryCondition, result);
    },
    RESET_QUERY_CONDITION: (state: any, result: any) => {
        state.queryCondition = new QueryCondition();
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
    async SetCondition({ dispatch, commit, state }: any, payloads: any) {
        commit('SET_QUERY_CONDITION', payloads);
        dispatch('SetEpidemicPersons');
    },
    ResetCondition({ dispatch, commit, state }: any, payloads: any) {
        commit('RESET_QUERY_CONDITION');
    },
  },
  getters: {
    outbreakDuty_epidemicStaticalData: (state: any) => state.epidemicStaticalData,
    outbreakDuty_totalCount: (state: any) => state.totalCount,
    outbreakDuty_epidemicPersonList: (state: any) => state.epidemicPersonList,

  }
};

export default outbreakDuty;
