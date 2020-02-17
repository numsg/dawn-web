import { QueryCondition } from './../../models/common/query-condition';
import epidemicDynamicService from '@/api/epidemic-dynamic/epidemic-dynamic.service';
import transformToColor from '@/common/filters/colorformat';
import communityStatisticsService from '@/api/community-statistics/community-statistics.service';

const outbreakDuty = {
  state: {
    epidemicStaticalData: [],
    totalCount: 0,
    medicalConditionStatisticTotal: 0,
    epidemicPersonList: [],
    communityFocusOnData: [],
    queryCondition: new QueryCondition(),
    updateMedicalFlag: false
  },
  mutations: {
    SET_PIDEMIC_STATICAL_DATA: (state: any, result: any) => {
      // if (result && Array.isArray(result)) {
      //     result.forEach(e => {
      //         e.name = e.dSourceDataModel.name;
      //         e.id = e.dSourceDataModel.id;
      //         e.selected = false;
      //         // e.strokeStyle = e.dSourceDataModel.imgColor;
      //         e.strokeStyle = e.dSourceDataModel.imgColor ? e.dSourceDataModel.imgColor : transformToColor(e.dSourceDataModel.name);
      //         e.value = e.count;
      //     });
      //     state.epidemicStaticalData = result;
      // }
      if (result && Array.isArray(result.nodeModels)) {
        state.medicalConditionStatisticTotal = result.count;
        result.nodeModels.forEach((e: any) => {
          e.name = e.typeName;
          e.selected = false;
          // e.strokeStyle = e.dSourceDataModel.imgColor;
          e.strokeStyle = e.color && e.color !== '' ? e.color : transformToColor(e.name);
          e.value = e.count;
        });
        state.epidemicStaticalData = result.nodeModels;
      }
    },
    SET_FOCUSON_PERSON_DATA: (state: any, result: any) => {
      state.communityFocusOnData = result;
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
    SET_UPDATE_MEDICAL_FLAG: (state: any, result: boolean) => {
      state.updateMedicalFlag = result;
    }
  },
  actions: {
    async SetEpidemicStaticalData({ commit }: any, payloads: any) {
      const result = await epidemicDynamicService.getEpidemicStaticalData(payloads ? payloads.dimension : '1');
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
    async SetCommunityFocusOnPersonData({ commit }: any, payloads: any) {
      const result = await communityStatisticsService.queryFocusOnPersonData(payloads.dimension);
      commit('SET_FOCUSON_PERSON_DATA', result);
    },
    async UpdatePersonMedicalSituation({ commit }: any, payloads: any) {
      const result = await epidemicDynamicService.updatePersonMedicalSituation(payloads.person, payloads.newSituation);
      commit('SET_UPDATE_MEDICAL_FLAG', result);
    }
  },
  getters: {
    outbreakDuty_epidemicStaticalData: (state: any) => state.epidemicStaticalData,
    outbreakDuty_totalCount: (state: any) => state.totalCount,
    outbreakDuty_medicalConditionTotalCount: (state: any) => state.medicalConditionStatisticTotal,
    outbreakDuty_epidemicPersonList: (state: any) => state.epidemicPersonList,
    outbreakDuty_communityFocusOnData: (state: any) => state.communityFocusOnData
  }
};

export default outbreakDuty;
