import DailyTroubleshootingService from '@/api/daily-troubleshooting/daily-troubleshooting';
import transformToColor from '@/common/filters/colorformat';
import DailyQueryConditions from '@/models/common/daily-query-conditions';
import { ModelType } from '@/models/daily-troubleshooting/model-type';
import store from '@/store';
import eventNames from '@/common/events/store-events';
import * as R from 'ramda';
import HistoryQueryConditions from '@/models/daily-troubleshooting/history-query-conditions';

const troubleshootingHistory = {
  state: {
    conditions: new HistoryQueryConditions(),
    historyRecords: [],
    totalCount: 0
  },
  mutations: {
    RESET_HISTORY_RECORDS: (state: any, result: any) => {
      if (result) {
        state.totalCount = result.count;
        state.historyRecords = result.value;
      }
    },
    RESET_HISTORY_RECORD_DATA: (state: any) => {
        state.historyRecords = [];
        state.totalCount = 0;
        state.conditions = new HistoryQueryConditions();
      },
  },
  actions: {
    SetHistoryRecords: async ({ commit, state }: any, payloads: any) => {
      Object.assign(state.conditions, payloads);
      const result = await DailyTroubleshootingService.queryTroubleshootingHistoryRecords(state.conditions);
      commit('RESET_HISTORY_RECORDS', result);
    },
    ResetHistoryRecordData: ({ commit }: any) => {
      commit('RESET_HISTORY_RECORD_DATA');
    }
  },
  getters: {
    troubleshootingHistory_historyRecords: (state: any) => state.historyRecords,
    troubleshootingHistory_totalCount: (state: any) => state.totalCount
  }
};

export default troubleshootingHistory;
