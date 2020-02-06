export class PlanQueryConditions {
  sort: any = { type: 'updateTime', flag: 'desc' };
  page: number = 0;
  pageSize: number = 10;

  /**
   * 单个关键字模糊查询<预案名称>
   *
   * @type {String}
   * @memberof PlanQueryConditions
   */
  keyWords: string = '';
  dateRange: string[] = [];
  eventTypeIds: string[] = [];
  districtLevelIds: string[] = [];
  responseSubIds: string[] = [];
  planUseIds: string[] = [];
  otherCons: string[] = [];
  districtIds: string[] = [];
  type: number = -1;
  isDefault: number = -1;

  /**
   * 多个关键字模糊查询<预案名称>
   *
   * @type {Array<String>}
   * @memberof PlanQueryConditions
   */
  keywords: Array<string> = [];

}

export default PlanQueryConditions;
