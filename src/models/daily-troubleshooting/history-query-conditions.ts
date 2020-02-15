export class HistoryQueryConditions {
  // sort: any = { type: 'updateTime', flag: 'desc' };
  page: number = 0;
  pageSize: number = 20;
  keyWord: string = '';
  dateRange: string[] = [];
  favers = [];
  medicalOpinion: string[] = [];
  plots: string[] = [];
  // dailyStatisticModel: any;
}
export default HistoryQueryConditions;
