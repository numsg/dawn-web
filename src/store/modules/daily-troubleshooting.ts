import DailyTroubleshootingService from '@/api/daily-troubleshooting/daily-troubleshooting';
import epidemicDynamicService from '@/api/epidemic-dynamic/epidemic-dynamic.service';
import systemConfigService from '@/api/system-config/system-config.service';
import transformToColor from '@/common/filters/colorformat';

const dailyTroubleshooting = {
  state: {
    statisticsData: [],
    totalCount: 0,
    personData: [],
  },
  mutations: {
    SET_STATISTICS_DATA: (state: any, result: any) => {
      console.log('---SET_STATISTICS_DATA---');
      console.log(result);
        if (result && Array.isArray(result)) {
            result.forEach(e => {
                e.name = e.dSourceDataModel.name;
                e.id = e.dSourceDataModel.id;
                e.selected = false;
                e.strokeStyle = e.dSourceDataModel.imgColor ? e.dSourceDataModel.imgColor : transformToColor(e.dSourceDataModel.name);
                e.value = e.count;
            });
            console.log(result);
            state.statisticsData = result;
        }
    },
    SET_PERSON_DATA: (state: any, result: any) => {
        if (result) {
            state.totalCount = result.count;
            state.epidemicPersonList = result.value;
        }
    },
  },
  actions: {
    async SetStatisticsData({ commit }: any) {
      const result = await DailyTroubleshootingService.getStatisticsData();
      commit('SET_STATISTICS_DATA', result);
    },
    async SetPersonData({ commit }: any, payloads: any) {
        const result = await DailyTroubleshootingService.queryAllDailyRecord(payloads.page, payloads.count);
        commit('SET_PERSON_DATA', result);
      },
  },
  getters: {
    dailyTroubleshooting_statisticsData: (state: any) => state.statisticsData,
    dailyTroubleshooting_totalCount: (state: any) => state.totalCount,
    dailyTroubleshooting_personData: (state: any) => state.personData,

  }
};

export default dailyTroubleshooting;
