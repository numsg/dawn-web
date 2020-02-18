import DailyTroubleshootingService from '@/api/daily-troubleshooting/daily-troubleshooting';
import transformToColor from '@/common/filters/colorformat';
import DailyQueryConditions from '@/models/common/daily-query-conditions';
import { ModelType } from '@/models/daily-troubleshooting/model-type';
import store from '@/store';
import eventNames from '@/common/events/store-events';
import * as R from 'ramda';
import CommunityBrief from '@/models/daily-troubleshooting/community-brief';

const dailyTroubleshooting = {
  state: {
    statisticsData: [],
    totalCount: 0,
    personData: [],
    isShowgGroup: false,
    conditions: new DailyQueryConditions(),
    groupsOriginalData: [],
    groupsData: [],
    groupPersonData: [],
    activeName: '',
    groupPersonTotalCount: 0,
    checkedTotalCount: 0,
    unCheckedTotalCount: 0,
    modelType: ModelType.checked,
    formStatus: false,
    groupPage: 1,
    groupTotalCount: 0,
    communityBrief: new CommunityBrief,
  },
  mutations: {
    SET_STATISTICS_DATA: (state: any, result: any) => {
      const communities = store.getters.baseData_communities;
      const res = [] as any[];
      communities.forEach((com: any) => {
        const community = result.find((c: any) => c.plotId === com.id);
        const data = {
          name: com.name,
          id: com.id,
          selected: false,
          strokeStyle:  com.imgColor ? com.imgColor : transformToColor(com.name),
          count: community ? community.count : 0,
          value: community ? community.count : 0,
        };
        res.push(data);
      });
      state.statisticsData = res;
    },
    SET_PERSON_DATA: (state: any, result: any) => {
      if (result) {
        state.totalCount = result.count;
        state.personData = result.value;
      }
    },
    LOAD_PERSON_DATA: (state: any, result: any) => {
      if (result) {
        state.totalCount = result.count;
        state.personData = result.value;
      }
    },
    SET_IS_SHOW_GROUP: (state: any, result: any) => {
      state.isShowgGroup = result;
    },
    SET_CONDITIONS: (state: any, conditions: DailyQueryConditions) => {
      // state.conditions.page = 1;
      Object.assign(state.conditions, conditions);
    },
    SET_GROUPS_DATA: (state: any, result: any) => {
      state.groupsData = result;
    },
    SET_GROUP_PERSON_DATA: (state: any, result: any) => {
      state.groupPersonTotalCount = result.count;
      state.groupPersonData = result.value;
    },
    SET_ACTIVE_NAME: (state: any, result: any) => {
      state.activeName = result;
    },
    SET_MODEL_TYPE: (state: any, result: any) => {
      state.conditions.page = 0;
      state.conditions.isChecked = result === ModelType.checked;
      state.modelType = result;
    },
    RESET_DATA: (state: any) => {
      state.statisticsData = [];
      state.totalCount = 0;
      state.personData = [];
      state.isShowgGroup = false;
      state.conditions = new DailyQueryConditions();
      state.groupsOriginalData = [];
      state.groupsData = [];
      state.groupPersonData = [];
      state.activeName = '';
      state.groupPersonTotalCount = 0;
      state.checkedTotalCount = 0;
      state.unCheckedTotalCount = 0;
      state.modelType = ModelType.checked;
      state.communityBrief = new CommunityBrief();
    },
    SET_CHECK_GROUP_INFO: (state: any, result: any) => {
      state.conditions.checkedPlot = result.checkedPlot;
      state.conditions.checkedBuilding = result.checkedBuilding;
      state.conditions.checkedUnitNumber = result.checkedUnitNumber;
    },
    SET_CONDITIONS_IS_CHECKED: (state: any, result: any) => {
      state.conditions.isChecked = result;
    },
    SET_DAILY_TROUBLE_SHOOTING_FORM_STATUS: (state: any, result: any) => {
      state.formStatus = result;
    },
    SET_COMMUNITY_BRIEF: (state: any, result: any) => {
      console.log('---SET_COMMUNITY_BRIEF---');
      console.log(result);
      state.communityBrief = result;
    },
    SET_RECORD_COUNT: (state: any, result: any) => {
      state.checkedTotalCount = result.checkedCount;
      state.unCheckedTotalCount = result.unCheckedCount;
    }
  },
  actions: {
    async SetStatisticsData({ commit, dispatch, state }: any) {
      const communities = store.getters.baseData_communities;
      if (!communities || communities.length === 0) {
        await dispatch(eventNames.baseData.SetCommunities);
      }
      // const result = await DailyTroubleshootingService.getStatisticsData();
      const result = await DailyTroubleshootingService.getRecordStatistics();
      // const result = await DailyTroubleshootingService.getStatistics(state.conditions);
      commit('SET_STATISTICS_DATA', result);
    },
    async LoadPersonData({ commit, state }: any) {
      // const result = await DailyTroubleshootingService.loadAllDailyRecord(state.conditions);
      const result = await DailyTroubleshootingService.queryTroubleshootingRecords(state.conditions);
      commit('LOAD_PERSON_DATA', result);
    },
    SetIsShowGroup({ dispatch, commit, state }: any, payloads: any) {
      state.conditions.page = 0;
      // 设置是否为组查看
      state.conditions.isGroup = payloads;
      // 清楚关键字
      state.conditions.keyWord = '';
      if (payloads) {
        state.conditions.isFaver = [];
        state.conditions.medicalOpinion = [];
        state.conditions.plots = [];
        dispatch('ReloadGroupsData');
      } else {
        state.activeName = '';
        state.groupPersonData = [];
        dispatch('LoadPersonData');
      }
      // dispatch('SetStatisticsData');
      commit('SET_IS_SHOW_GROUP', payloads);
    },
    SetConditions: async ({ dispatch, commit, state }: any, conditions: DailyQueryConditions) => {
      commit('SET_CONDITIONS', conditions);
      if (state.isShowgGroup) {
        dispatch('SetGroupsData');
      } else {
        dispatch('LoadPersonData');
      }
      dispatch('SetCRecordCount');
    },
    SetGroupsData: async ({ dispatch, commit, state }: any) => {
      if (state.conditions && state.conditions.plots && state.conditions.plots.length > 0) {
        const result = state.groupsOriginalData.filter((e: any) => state.conditions.plots.includes(e.plotId));
        commit('SET_GROUPS_DATA', result);
      } else {
        const result = await DailyTroubleshootingService.queryGroupsData();
        state.groupsOriginalData = result;
        commit('SET_GROUPS_DATA', result);
      }
    },
    ReloadGroupsData: async ({ dispatch, commit, state }: any) => {
      const result = await DailyTroubleshootingService.queryGroupsData();
      state.groupsOriginalData = result;
      if (state.conditions && state.conditions.plots && state.conditions.plots.length > 0) {
        const result = state.groupsOriginalData.filter((e: any) => state.conditions.plots.includes(e.plotId));
        commit('SET_GROUPS_DATA', result);
      } else {
        commit('SET_GROUPS_DATA', result);
        if (result && Array.isArray(result) && result.length > 0) {
          const item = result[0];
          const activeName = item.plotId + '-' + item.building + '-' + item.unitNumber;
          dispatch('SetActiveName', activeName);
        }
      }
    },
    SetGroupPersonData: async ({ dispatch, commit, state }: any, conditions?: DailyQueryConditions) => {
      Object.assign(state.conditions, conditions);
      if (state.conditions.dailyStatisticModel) {
        const result = await DailyTroubleshootingService.getGroupPersonData(state.conditions);
        commit('SET_GROUP_PERSON_DATA', result);
      }
    },
    SetActiveName: async ({ dispatch, commit, state }: any, payloads: any) => {
      console.log('---SetActiveName---');
      commit('SET_ACTIVE_NAME', payloads);
      state.conditions.page = 0;
      // if (typeof payloads === 'number') {
      //   state.conditions.dailyStatisticModel = state.groupsData[payloads];
      //   dispatch('SetGroupPersonData');
      // } else {
      //   state.groupPersonData = [];
      //   state.groupPersonTotalCount = 0;
      // }
      state.conditions.dailyStatisticModel = state.groupsData.find((e: any) => {
        return  payloads === e.plotId + '-' + e.building + '-' + e.unitNumber;
      });
      dispatch('SetGroupPersonData');
    },
    SetModelType: async ({ dispatch, commit, state }: any, type: any) => {
      commit('SET_MODEL_TYPE', type);
      if (state.conditions.isGroup) {
        dispatch('SetGroupPersonData');
      } else {
        dispatch('LoadPersonData');
      }
    },
    SetCRecordCount: async ({ dispatch, commit, state }: any, type: any)  => {
      const checkedCount =  await DailyTroubleshootingService.getCheckedCount(state.conditions);
      const unCheckedCount =  await DailyTroubleshootingService.getUnCheckedCount(state.conditions);
      const result = {
        checkedCount,
        unCheckedCount
      };
      commit('SET_RECORD_COUNT', result);
    },
    SetCommunityBrief: async ({ dispatch, commit, state }: any)  => {
      const result =  await DailyTroubleshootingService.queryCommunityBrief();
      commit('SET_COMMUNITY_BRIEF', result);
    },
    ResetData: ({ commit }: any) => {
      commit('RESET_DATA');
    }
  },
  getters: {
    dailyTroubleshooting_statisticsData: (state: any) => state.statisticsData,
    dailyTroubleshooting_totalCount: (state: any) => state.totalCount,
    dailyTroubleshooting_personData: (state: any) => state.personData,
    dailyTroubleshooting_isShowgGroup: (state: any) => state.isShowgGroup,
    dailyTroubleshooting_groupsData: (state: any) => state.groupsData,
    dailyTroubleshooting_groupPersonData: (state: any) => state.groupPersonData,
    dailyTroubleshooting_conditions: (state: any) => state.conditions,
    dailyTroubleshooting_groupPersonTotalCount: (state: any) => state.groupPersonTotalCount,
    dailyTroubleshooting_checkedTotalCount: (state: any) => state.checkedTotalCount,
    dailyTroubleshooting_unCheckedTotalCount: (state: any) => state.unCheckedTotalCount,
    dailyTroubleshooting_formStatus: (state: any) => state.formStatus,
    dailyTroubleshooting_modelType: (state: any) => state.modelType
  }
};

export default dailyTroubleshooting;
