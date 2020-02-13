import { DailyQueryConditions } from '@/models/common/daily-query-conditions';
import { Vue, Component } from 'vue-property-decorator';
import dailyTroubleshootingHtml from './daily-troubleshooting.html';
import dailyTroubleshootingStyle from './daily-troubleshooting.scss';
import {RecordModel} from '@/models/daily-troubleshooting/trouble-shoot-record-model';
import { OperationZone } from './operation-zone/operation-zone';
import { PersonCard } from './person-card/person-card';
import { PersonStatistical } from './person-statistical/person-statistical';
import FilterPanelComponent from './filter-panel/filter-panel';
import dDataSourceService from '@/api/data-source/d-data-source.service';
import DailyTroubleshootingService from '@/api/daily-troubleshooting/daily-troubleshooting';
import * as format from 'dateformat';
import { ModelType } from '@/models/daily-troubleshooting/model-type';
import { PersonInfo } from '@/models/daily-troubleshooting/person-info';
import { Getter } from 'vuex-class';
import eventNames from '@/common/events/store-events';
import TroubleshootRecord from '@/models/daily-troubleshooting/trouble-shoot-record';
import sessionStorage from '@/utils/session-storage';
import notifyUtil from '@/common/utils/notifyUtil';

import * as XLSX from 'xlsx';

@Component({
  template: dailyTroubleshootingHtml,
  style: dailyTroubleshootingStyle,
  components: {
    OperationZone,
    PersonCard,
    PersonStatistical,
    FilterPanelComponent
  }
})
export class DailyTroubleshootingComponent extends Vue {
  private leftActive = 'statistic';
  currentType = ModelType.ALL;
  personData: any = [];
  totalCount = 0;
  currentPage = 1;
  pageSize = 20;
  keyWord = '';
  hasReset = false;
  @Getter('configs')
  configs!: any;
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

  @Getter('dailyTroubleshooting_isShowgGroup')
  isShowgGroup!: boolean;

  @Getter('dailyTroubleshooting_conditions')
  conditions!: DailyQueryConditions;

  async created() {
    const result = await DailyTroubleshootingService.queryAllDailyRecord(this.currentPage, this.pageSize);
    this.personData = result.value;
    this.totalCount = result.count;
  }

  modelTypeChange(type: ModelType) {
    this.currentType = type;
  }

  showTypeChange(bool: any) {
    this.isShowgGroup = bool;
  }

  async reset() {
    this.hasReset = false;
    this.currentPage = 1;
    const result = await DailyTroubleshootingService.queryAllDailyRecord(this.currentPage, this.pageSize);
    this.personData = result.value;
    this.totalCount = result.count;
    this.hasReset = true;
  }

  // 刷新
  async refesh() {

  }

  async addSuccess() {
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetStatisticsData);
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetConditions, this.conditions);
  }

  pullData() {
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetStatisticsData);
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetConditions, this.conditions);
  }

  async searchQuery(keyWord: string) {
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

  async paginationChange(pagination: { pageSize: number; currentPage: number }) {
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
  async exportExcel( param:  {  startDate: string, endDate: string, currentVillageId:  string}) {
    const  {  startDate , endDate} = param;
    let { currentVillageId } = param;
    currentVillageId = sessionStorage.get('district') + '';
    const now = format.default(new Date(), 'yyyy-mm-dd HH:mm:ss');
    const taskListName = `日常排查数据${now}.xlsx`;
    // const result = await DailyTroubleshootingService.queryExportExcel(this.keyWord);
    // const result = await DailyTroubleshootingService.loadExportExcel(this.conditions);
    const result: RecordModel[] = await DailyTroubleshootingService.loadExportByJXExcel({  startDate , endDate, currentVillageId});
    if ( !result ) {
      notifyUtil.warning('查找记录失败');
    }
    const res = await DailyTroubleshootingService.queryCommunity();
    if ( !res ) {
      notifyUtil.warning('查询社区失败');
    }
    let communityName = '';
    if ( res && Array.isArray(res) && res.length > 0 ) {
      communityName = res[0].name;
    }
    let data = {};

    const s = {
      alignment: {
        horizontal: 'center',
        vertical: 'center'
      },
    };
    // 表头
    const headers = {
      A1: { v: '社区疫情排查情况登记表', s },
      A2: { v: '社区(村)', s },
      F2: { v: '填表日期' , s},
      A3: { v: '序号' , s},
      B2: { v:  communityName , s},
      B3: { v: '姓名' , s},
      C3: { v: '性别' , s},
      D3: { v: '身份证号' , s },
      E3: { v: '联系方式' , s},
      F3: { v: '家庭住址', s },
      G2: { v:  now, s },
      G3: { v: '发热(体温>37.3℃)', s },

      H3: { v: '其他症状' , s },
      // J3: { v: '分类诊疗医疗意见', s  },
      I3: { v: '是否有湖北旅居史', s },
        [`J3`] : { v: '行程', s }, // 替换 疑似患者
        [`K3`] : { v: '是否有新型肺炎接触史', s }, // 替换 疑似患者
        [`L3`] : { v: '是否与湖北暴露史人员接触', s }, // 替换 一般发热患者
        [`M3`] : { v: '体温', s }, // 替换 密切接触者
        [`N3`] : { v: '有无咳嗽、胸闷等不适症状', s }, // 替换 密切接触者
        [`O3`] : { v: '常德人入武汉后居住地' , s },
        [`P3`] : { v: '离开湖北日期' , s },
        [`Q3`] : { v: '交通工具飞机、火车、大巴、自驾车' , s },
        [`R3`] : { v: '车次/航班' , s },
        [`S3`] : { v: '沿途停留地点' , s },
        [`T3`] : { v: '返回常德日期' , s },
        [`U3`] : { v: '满14天日期' , s },
        [`V3`] : { v: '是否外地返武陵区人员' , s },
        [`W3`] : { v: '回程地点', s },
        [`X3`] : { v: '返回武汉方式', s },
        [`Y3`] : { v: '返回武汉航班车次', s },
        [`Z3`] : { v: '同程人员', s },
        [`AA3`] : { v: '工作单位', s },
        [`AB3`] : { v: '是否本街道常驻人口', s },
        [`AC3`] : { v: '是否有相关证明', s },
        [`AD3`] : { v: '社区', s },
        [`AE3`] : { v: '楼栋', s },
        [`AF3`] : { v: '单元', s },
        [`AG3`] : { v: '房间号', s },
        [`AH3`] : { v: '备注', s },
      // J4: { v: '确认患者' , s },
      // K4: { v: '疑似患者' , s },
      // L4: { v: 'CT诊断肺炎患者', s  },
      // M4: { v: '一般发热患者' , s },
      // N4: { v: '密切接触者' , s },
    };
    // 合并 headers 和 data
    const dataRowHight: any[] = [];
    const rowHeight = 24;
    result.forEach((person: RecordModel, index: number) => {
      dataRowHight.push({'hpx': rowHeight});
      const tableTr = {
        [`A${4 + index}`] : { v: index + 1 , s }, // 序号
        [`B${4 + index}`] : { v: person.name }, // 姓名
        [`C${4 + index}`] : { v:  person.sex === '0' ?  '男' : '女' , s }, // 替换 性别
        [`D${4 + index}`] : { v: person.idNumber, s  }, // 身份证号
        [`E${4 + index}`] : { v: person.phone , s }, // 联系方式
        [`F${4 + index}`] : { v: person.residence , s }, // 家庭住址
        [`G${4 + index}`] : { v: person.fever === '1' ? '是' : '否', s }, // 是否发热（体温大于37.3度）

        [`H${4 + index}`] : { v: person.symptom} , // 替换 其他症状
        // [`J${5 + index}`] : { v: this.replaceMedicalOpinion(person.medicalOpinion) === '确认患者' ? '是' : '' , s }, // 替换 确认患者
        [`I${4 + index}`] : { v: person.travelLivingHubei === '1' ? '是' : '否', s },
        [`J${4 + index}`] : { v: this.replacetrip(person.trip), s }, // 替换 疑似患者
        [`K${4 + index}`] : { v: person.touchPersonIsolation === '1' ? '是' : '否', s }, // 替换 疑似患者
        [`L${4 + index}`] : { v: person.touchHubei === '1' ? '是' : '否' , s }, // 替换 一般发热患者
        [`M${4 + index}`] : { v: person.temperature, s }, // 替换 密切接触者
        [`N${4 + index}`] : { v: person.discomfort === '1' ? '是' : '否' , s }, // 替换 密切接触者
        [`O${4 + index}`] : { v: person.wuhanAddress , s },
        [`P${4 + index}`] : { v: person.leaveHubeiDate , s },
        [`Q${4 + index}`] : { v: person.vehicle , s },
        [`R${4 + index}`] : { v: person.vehicleNo , s },
        [`S${4 + index}`] : { v: person.stayPlace , s },
        [`T${4 + index}`] : { v: person.backDate , s },
        [`U${4 + index}`] : { v: person.fourteenDays === '1' ? '是' : '否' , s },
        [`V${4 + index}`] : { v: person.otherToWuling === '1' ? '是' : '否' , s },
        [`W${4 + index}`] : { v: person.whereToWuling, s },
        [`X${4 + index}`] : { v: person.howToWuling, s },
        [`Y${4 + index}`] : { v: person.vehicleNoWuling, s },
        [`Z${4 + index}`] : { v: person.togetherPersonWuling, s },
        [`AA${4 + index}`] : { v: person.workUnitWuling, s },
        [`AB${4 + index}`] : { v: person.permanentWuling  === '1' ? '是' : '否', s },
        [`AC${4 + index}`] : { v: person.proveWuling === '1' ? '是' : '否', s },
        [`AD${4 + index}`] : { v: person.community, s },
        [`AE${4 + index}`] : { v: person.building, s },
        [`AF${4 + index}`] : { v: person.unit, s },
        [`AG${4 + index}`] : { v: person.roomNumber, s },
        [`AH${4 + index}`] : { v: person.remark, s },
      };
      data = Object.assign({}, data, tableTr);
    });
    console.log(data);
    const output = Object.assign({}, headers, data);
    // 表格范围，范围越大生成越慢
    const ref = 'A1:ZZ100';
    // 合并单元格设置
    const merges = [
      { s: { c: 0, r: 0 }, e: { c: 14, r: 0 } }, // 社区疫情排查情况登记表
      { s: { c: 0, r: 1 }, e: { c: 0, r: 1 } }, // 社区(村)
      { s: { c: 6, r: 1 }, e: { c: 6, r: 1 } }, // 填表日期
      // { s: { c: 0, r: 2 }, e: { c: 0, r: 3 } }, // 序号
      // { s: { c: 1, r: 1 }, e: { c: 1, r: 1 } }, // 社区名称
      // { s: { c: 1, r: 2 }, e: { c: 1, r: 3 } }, // 姓名
      // { s: { c: 2, r: 2 }, e: { c: 2, r: 3 } }, // 性别
      // { s: { c: 3, r: 2 }, e: { c: 3, r: 3 } }, // 身份证号
      // { s: { c: 4, r: 2 }, e: { c: 4, r: 3 } }, // 联系方式
      // { s: { c: 5, r: 2 }, e: { c: 5, r: 3 } }, // 家庭住址
      // { s: { c: 6, r: 1 }, e: { c: 6, r: 1 } }, // 当前时间
      // { s: { c: 6, r: 2 }, e: { c: 6, r: 3 } }, // 发热(体温>37.3℃)
      // { s: { c: 7, r: 2 }, e: { c: 7, r: 3 } }, // 新型肺炎
      // { s: { c: 8, r: 2 }, e: { c: 8, r: 3 } }, // 其他症状
      // { s: { c: 9, r: 2 }, e: { c: 13, r: 2 } }, // 分类诊疗医疗意见
      // { s: { c: 14, r: 2 }, e: { c: 14, r: 3 } }, // 备注
      // { s: { c: 9, r: 3 }, e: { c: 9, r: 3 } }, // 确认患者
      // { s: { c: 10, r: 3 }, e: { c: 10, r: 3 } }, // 疑似患者
      // { s: { c: 11, r: 3 }, e: { c: 11, r: 3 } }, // CT诊断肺炎患者
      // { s: { c: 12, r: 3 }, e: { c: 12, r: 3 } }, // 一般发热患者
      // { s: { c: 13, r: 3 }, e: { c: 16, r: 3 } }, // 密切接触者
    ];
    // 构建 workbook 对象
    const cols = [
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 22},
      {'wch': 12},
      {'wch': 12},
      {'wch': 22},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 22},
      {'wch': 12},
      {'wch': 12},
      {'wch': 22},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 22},
      {'wch': 12},
      {'wch': 12},
      {'wch': 22},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 12},
      {'wch': 22},
    ];
    const rows = [
      ...dataRowHight,
      {'hpx': rowHeight},
      {'hpx': rowHeight},
      {'hpx': rowHeight},
    ];
    const wb = {
      SheetNames: ['mySheet'],
      Sheets: {
        mySheet: Object.assign({}, output, { '!ref': ref, '!merges': merges, '!cols': cols, '!rows': rows })
      }
    };
    // 导出 Excel
    // bookType: 'xlsx', // 要生成的文件类型
    // bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    // type: 'binary'
    XLSX.writeFile(wb, taskListName, {bookType: 'xlsx',  bookSST: false, type: 'binary' });

    // const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
    // XLSX.writeFile(wb, taskListName + '.xlsx');
  }

  replaceSex(sex: any) {
    const sexItem = this.genderClassification.find((item: any) => item.id === sex);
    return sexItem ? sexItem.name : '';
  }

  replacePlot(plot: any) {
    const plotItem = this.communities.find((item: any) => item.id === plot);
    return plotItem ? plotItem.name : '';
  }

  replaceOtherSymptoms(OtherSymptoms: string) {
    if ( OtherSymptoms === '0' ) {
      return '无';
    }
    if ( OtherSymptoms === '1' ) {
      return '乏力';
    }
    if ( OtherSymptoms === '2' ) {
      return '干咳';
    }
    if ( OtherSymptoms === '3' ) {
      return '肌痛';
    }
    if ( OtherSymptoms === '4' ) {
      return '寒战';
    }
    if ( OtherSymptoms === '5' ) {
      return '呼吸困难';
    }
    if ( OtherSymptoms === '6' ) {
      return '咽痛';
    }
    if ( OtherSymptoms === '7' ) {
      return '头疼';
    }
    if ( OtherSymptoms === '8' ) {
      return '眩晕';
    }
    if ( OtherSymptoms === '9' ) {
      return '腹痛';
    }
    if ( OtherSymptoms === '10' ) {
      return '腹泻';
    }
    if ( OtherSymptoms === '11' ) {
      return '恶心';
    }
    if ( OtherSymptoms === '12' ) {
      return '呕吐';
    }
    if ( OtherSymptoms === '13' ) {
      return '鼻塞';
    }
    return '';
    // const otherSymptomsItemList = this.otherSymptoms.filter((item: any) => OtherSymptoms.includes(item.id));
    // return otherSymptomsItemList && otherSymptomsItemList.length > 0 ? otherSymptomsItemList.map((item: any) => item.name) : '';
  }


  replaceMedicalOpinion(medicalOpinion: any) {
    const otherSymptomsItem = this.medicalOpinions.find((item: any) => item.id === medicalOpinion);
    return otherSymptomsItem ? otherSymptomsItem.name : '';
  }
  replacetrip(trip: string) {
    if (trip === '1') {
      return '武汉以外的湖北人入常德人员';
    }
    if (trip === '2') {
      return '武汉入常德';
    }
    if (trip === '3') {
      return '常德入武汉以外的湖北辖区后返回常德';
    }
    if (trip === '4') {
      return '常德入武汉后返回常德';
    }
    if (trip === '5') {
      return '既非常德人又非湖北人，途径湖北进入常德';
    }
    if (trip === '6') {
      return '既非常德人又非武汉人，途径武汉进入常德';
    }
    return '';
  }

  beforeDestroy() {
    this.$store.dispatch(eventNames.DailyTroubleshooting.ResetData);
  }
}
