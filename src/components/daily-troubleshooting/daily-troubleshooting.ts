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
import { Getter } from 'vuex-class';
import eventNames from '@/common/events/store-events';

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

  // 本社区小区
  @Getter('baseData_communities')
  communities!: any[];
  // 确诊情况
  @Getter('baseData_diagnosisSituations')
  diagnosisSituations!: any[];
  // 医疗情况
  @Getter('baseData_medicalSituations')
  medicalSituations!: any[];
  // 特殊情况
  @Getter('baseData_specialSituations')
  specialSituations!: any[];
  // 性别
  @Getter('baseData_genderClassification')
  genderClassification!: any[];
  // 其他症状
  @Getter('baseData_otherSymptoms')
  otherSymptoms!: any[];
  // 医疗意见
  @Getter('baseData_medicalOpinions')
  medicalOpinions!: any[];

  selectedIds: string[] = [];
  async created() {
    const result = await DailyTroubleshootingService.queryAllDailyRecord( this.currentPage, this.pageSize);
    this.personData = result.value;
    this.totalCount = result.count;
  }

  modelTypeChange(type: ModelType) {
    this.currentType = type;
  }

  async reset() {
    this.currentPage = 1;
    const result = await DailyTroubleshootingService.queryAllDailyRecord(this.currentPage, this.pageSize);
    this.personData = result.value;
    this.totalCount = result.count;
  }

  // 刷新
  async refesh() {
    const result = await DailyTroubleshootingService.queryAllDailyRecord(this.currentPage, this.pageSize);
    this.personData = result.value;
    this.totalCount = result.count;
  }

  async addSuccess() {
    const result = await DailyTroubleshootingService.queryAllDailyRecord(this.currentPage, this.pageSize);
    this.personData = result.value;
    this.totalCount = result.count;
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetStatisticsData);
  }

  async  searchQuery(keyWord: string) {
    this.keyWord = keyWord;
    const result = await DailyTroubleshootingService.queryAllDailyRecord(this.currentPage, this.pageSize, keyWord, this.selectedIds);
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

  async handleStatisticsClick(ids: string[]) {
    this.selectedIds = ids;
    this.currentPage = 1;
    const result = await DailyTroubleshootingService.queryAllDailyRecord(this.currentPage, this.pageSize, this.keyWord, ids);
    this.personData = result.value;
    this.totalCount = result.count;
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
      '年龄',
      '联系电话',
      '现居地址',
      '小区',
      '楼栋',
      '单元',
      '房号',
      '体温是否大于37.3',
      '是否有新型肺炎接触史',
      '其他症状',
      '分类诊疗医疗意见',
      '备注'
    ];
    data.push(sheetTitle);
    result.value.forEach((person: PersonInfo) => {
      const tableTr = [
        person.name,
        person.identificationNumber,
        this.replaceSex(person.sex), // ?
        person.age,
        person.phone,
        person.address,
        this.replacePlot(person.plot), // ?
        person.building,
        person.unitNumber,
        person.roomNo,
        person.isExceedTemp ? 't' : 'f',
        person.isContact ? 't' : 'f',
        this.replaceOtherSymptoms(person.otherSymptoms), // ?
        this.replaceMedicalOpinion(person.medicalOpinion), // ?
        person.note,
      ];
      data.push(tableTr);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
    XLSX.writeFile(wb, taskListName + '.xlsx');
  }

  replaceSex(sex: any) {
    const sexItem = this.genderClassification.find( (item: any) => item.id ===  sex );
    return sexItem ? sexItem.name : '';
  }

  replacePlot(plot: any) {
    const plotItem = this.communities.find( (item: any) => item.id ===  plot );
    return plotItem ? plotItem.name : '';
  }

  replaceOtherSymptoms(OtherSymptoms: string) {
    if (!OtherSymptoms) {
      return '';
    }
    const otherSymptomsItemList = this.otherSymptoms.filter( (item: any) => OtherSymptoms.includes(item.id));
    console.log(otherSymptomsItemList);
    return otherSymptomsItemList && otherSymptomsItemList.length > 0 ? otherSymptomsItemList.map((item: any) => item.name) : '';
  }

  replaceMedicalOpinion(medicalOpinion: any) {
    const otherSymptomsItem = this.medicalOpinions.find( (item: any) => item.id ===  medicalOpinion );
    return otherSymptomsItem ? otherSymptomsItem.name : '';
  }
}
