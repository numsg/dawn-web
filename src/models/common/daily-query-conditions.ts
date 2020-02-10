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

    // 是否为排查
    isChecked = true;
    // 是否分组
    isGroup = true;
    // 小区,楼栋,单元号
    checkedPlot = '';
    checkedBuilding = '';
    checkedUnitNumber = '';
  }
  export default DailyQueryConditions;
