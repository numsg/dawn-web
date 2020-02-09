export class QueryCondition {
  sort: any = { type: 'updateTime', flag: 'desc' };
  page: number = 1;
  pageSize: number = 10;
  keyWords: string = '';
  dateRange: string[] = [];
  ids: string[] = [];
}
export default QueryCondition;

