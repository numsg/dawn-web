export class DailyQueryConditions {
    // sort: any = { type: 'updateTime', flag: 'desc' };
    page: number = 0;
    pageSize: number = 10;
    keyWord: string = '';
    // dateRange: string[] = [];
    isFaver = [];
    medicalOpinion: string[] = [];
    plots: string[] = [];
    dailyStatisticModel: any;
  }
  export default DailyQueryConditions;
