import { Vue, Component } from 'vue-property-decorator';
import dailyTroubleshootingHtml from './daily-troubleshooting.html';
import dailyTroubleshootingStyle from './daily-troubleshooting.scss';

import { OperationZone } from './operation-zone/operation-zone';
import { PersonCard } from './person-card/person-card';
import { PersonStatistical } from './person-statistical/person-statistical';
import FilterPanelComponent from './filter-panel/filter-panel';

import DailyTroubleshootingService from '@/api/daily-troubleshooting/daily-troubleshooting';
import * as format from 'dateformat';
import { ModelType } from '@/models/daily-troubleshooting/model-type';
import { PersonInfo } from '@/models/daily-troubleshooting/person-info';

import * as XLSX from 'xlsx';
@Component({
  template: dailyTroubleshootingHtml,
  style: dailyTroubleshootingStyle,
  components: {
    OperationZone,
    PersonCard,
    PersonStatistical,
    FilterPanelComponent,
  }
})
export class DailyTroubleshootingComponent extends Vue {
  private leftActive = 'statistic';
  currentType = ModelType.ALL;
  personData: any = [];
  totalCount = 0;
  currentPage = 1;
  pageSize = 10;
  keyWord = '';

  async created() {
    const result = await DailyTroubleshootingService.queryAllDailyRecord( this.currentPage, this.pageSize);
    this.personData = result.value;
    this.totalCount = result.count;
    console.log(this.personData, '----------------------------');
  }

  modelTypeChange(type: ModelType) {
    this.currentType = type;
  }

  async addSuccess() {
    const result = await DailyTroubleshootingService.queryAllDailyRecord(this.currentPage, this.pageSize);
    this.personData = result.value;
    this.totalCount = result.count;
  }

  async  searchQuery(keyWord: string) {
    this.keyWord = keyWord;
    const result = await DailyTroubleshootingService.queryAllDailyRecord(this.currentPage, this.pageSize, keyWord);
    this.personData = result.value;
    this.totalCount = result.count;
  }

  async uploadSuccess() {
    const result = await DailyTroubleshootingService.queryAllDailyRecord(this.currentPage, this.pageSize);
    this.personData = result.value;
    this.totalCount = result.count;
  }

  async paginationChange(pagination: {pageSize: number, currentPage: number}) {
    const result = await DailyTroubleshootingService.queryAllDailyRecord(pagination.currentPage, pagination.pageSize);
    this.personData = result.value;
    this.totalCount = result.count;
    this.currentPage = pagination.currentPage;
    this.pageSize = pagination.pageSize;
  }

  // 导出excel
  async exportExcel() {
    const taskListName = `日常排查数据${format.default(new Date(), 'yyyy-mm-dd HH:mm:ss')}`;
    const result = await DailyTroubleshootingService.queryExportExcel(this.keyWord);
    const data: any = [];
    const sheetTitle = [
      '姓名',
      '身份证号码',
      '性别',
      '联系电话',
      '现居地址',
      '小区',
      '楼栋',
      '单元',
      '房号',
      '体温',
    ];
    data.push(sheetTitle);
    result.value.forEach((person: PersonInfo) => {
      const tableTr = [
        person.name,
        person.identificationNumber,
        person.sex,
        person.phone,
        person.address,
        person.plot,
        person.building,
        person.unitNumber,
        person.roomNo,
        person.bodyTemperature,
      ];
      data.push(tableTr);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
    XLSX.writeFile(wb, taskListName + '.xlsx');
  }
}
