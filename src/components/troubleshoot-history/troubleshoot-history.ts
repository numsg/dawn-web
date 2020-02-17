import { Vue, Component } from 'vue-property-decorator';
import html from './troubleshoot-history.html';
import styles from './troubleshoot-history.module.scss';
import TroubleshootHistoryRecord from '@/models/daily-troubleshooting/trouble-shoot-history';
import { Getter, State } from 'vuex-class';
import eventNames from '@/common/events/store-events';
import TroubleshootRecord from '@/models/daily-troubleshooting/trouble-shoot-record';
import moment from 'moment';
import { debounce } from 'lodash';
import i18n from '@/i18n';
import notifyUtil from '@/common/utils/notifyUtil';
import { TroubleshootingInfoForm } from '../daily-troubleshooting/troubleshooting-info-form/troubleshooting-info-form';
import { SideFrameComponent } from '../share/side-frame/side-frame';
import * as XLSX from 'xlsx';
import { RecordModel } from '@/models/daily-troubleshooting/trouble-shoot-record-model';
import DailyTroubleshootingService from '@/api/daily-troubleshooting/daily-troubleshooting';
import HistoryQueryConditions from './../../models/daily-troubleshooting/history-query-conditions';
import SessionStorage from '@/utils/session-storage';
import { Temperature } from '@/models/daily-troubleshooting/temperature';
import RecordExpend from '@/models/daily-troubleshooting/record-expend';

const DATE_PICKER_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss[Z]';
@Component({
  template: html,
  style: styles,
  components: {
    'side-frame': SideFrameComponent,
    TroubleshootingInfoForm
  }
})
export class TroubleshootHistoryComponent extends Vue {
  @Getter('troubleshootingHistory_historyRecords')
  historyRecords!: TroubleshootHistoryRecord[];

  @Getter('troubleshootingHistory_totalCount')
  totalCount!: number;

  // 本社区小区
  @Getter('baseData_communities')
  communities!: any[];
  // 其他症状
  @Getter('baseData_otherSymptoms')
  otherSymptoms!: any[];
  // 医疗意见
  @Getter('baseData_medicalOpinions')
  medicalOpinions!: any[];

  // 性别
  @Getter('baseData_genderClassification')
  genderClassification!: any[];

  pageSizes = [10, 20, 30];

  @State((state: any) => state.troubleshootingHistory.conditions.pageSize)
  pageSize!: number;

  @State((state: any) => state.troubleshootingHistory.conditions)
  conditions!: HistoryQueryConditions;

  // feverOptions = [
  //   {
  //     label: '是',
  //     value: true
  //   },
  //   {
  //     label: '否',
  //     value: false
  //   }
  // ];

  feverOptions = [
    {
      label: '小于36℃',
      value: Temperature.A
    },
    {
      label: '36-36.5℃',
      value: Temperature.B
    },
    {
      label: '36.5-37℃',
      value: Temperature.C
    },
    {
      label: '37-37.3℃',
      value: Temperature.D
    },
    {
      label: '大于37.3℃',
      value: Temperature.E
    }
  ];

  get plots() {
    return this.$store.state.troubleshootingHistory.conditions.plots;
  }

  set plots(val: any) {
    this.$store.dispatch(eventNames.TroubleshootingHistory.SetHistoryRecords, {
      plots: val,
      page: 0
    });
  }

  get medicalOpinionIds() {
    return this.$store.state.troubleshootingHistory.conditions.medicalOpinion;
  }

  set medicalOpinionIds(val: any) {
    this.$store.dispatch(eventNames.TroubleshootingHistory.SetHistoryRecords, {
      medicalOpinion: val,
      page: 0
    });
  }

  get favers() {
    return this.$store.state.troubleshootingHistory.conditions.favers;
  }

  set favers(val: any) {
    this.$store.dispatch(eventNames.TroubleshootingHistory.SetHistoryRecords, {
      favers: val,
      page: 0
    });
  }

  get currentPage() {
    return this.$store.state.troubleshootingHistory.conditions.page + 1;
  }

  set currentPage(val: number) {
    this.$store.dispatch(eventNames.TroubleshootingHistory.SetHistoryRecords, {
      page: val - 1
    });
  }

  keyWords = '';
  pickerOptions: any;

  dateRange: string[] = [];
  private currentRecord = new TroubleshootHistoryRecord();

  debounceSearch = debounce(this.handleSearch, 500);

  handleSearch() {
    this.$store.dispatch(eventNames.TroubleshootingHistory.SetHistoryRecords, {
      keyWord: this.keyWords,
      page: 0
    });
  }

  created() {
    const self = this;
    this.pickerOptions = {
      shortcuts: [
        {
          text: '过去一周',
          onClick(picker: any) {
            self.datePickerClick(picker, 1);
          }
        },
        {
          text: '过去二周',
          onClick(picker: any) {
            self.datePickerClick(picker, 2);
          }
        }
      ],
      onPick: (zone: any) => {
        if (zone.maxDate && zone.minDate) {
          const startTime = moment(zone.minDate).format(DATE_PICKER_FORMAT);
          const endTime = moment(zone.maxDate)
            .add(1, 'day')
            .format(DATE_PICKER_FORMAT);
          self.dateRange = [startTime, endTime];
          console.log(self.dateRange);
        }
      },
      disabledDate: (date: Date) => {
        return (
          date >
          moment()
            .endOf('day')
            // .subtract(1, 'day')
            .toDate()
        );
      }
    };
  }

  mounted() {
    this.$store.dispatch(eventNames.TroubleshootingHistory.SetHistoryRecords, new HistoryQueryConditions());
  }

  // 页数码改变
  handleSizeChange(value: any) {
    this.pageSize = value;
  }
  // 当前页改变
  handleCurrentChange(value: any) {
    this.currentPage = value;
  }

  replacePlot(plot: any) {
    const plotItem = this.communities.find((item: any) => item.id === plot);
    return plotItem ? plotItem.name : '';
  }

  replaceOtherSymptoms(others: string) {
    if (!others) {
      return '';
    }
    const otherSymptoms = others.split(',');
    const otherSymptomsItemList = this.otherSymptoms.filter((item: any) => otherSymptoms.includes(item.id));
    return otherSymptomsItemList && otherSymptomsItemList.length > 0 ? otherSymptomsItemList.map((item: any) => item.name).join('、') : '';
  }

  replaceMedicalOpinion(medicalOpinion: any) {
    const otherSymptomsItem = this.medicalOpinions.find((item: any) => item.id === medicalOpinion);
    return otherSymptomsItem ? otherSymptomsItem.name : '';
  }

  replaceTime(time: string) {
    if (time) {
      // return format.default(time, 'yyyy-mm-dd HH:mm:ss');
      return moment(time).format('YYYY-MM-DD HH:mm:ss');
    }
    return '';
  }

  replaceSex(sex: any) {
    const sexItem = this.genderClassification.find((item: any) => item.id === sex);
    return sexItem ? sexItem.name : '';
  }

  /**
   * 清楚时间时
   * @param timeZone
   */
  onTimeZoneChange(timeZone: any) {
    this.$store.dispatch(eventNames.TroubleshootingHistory.SetHistoryRecords, {
      dateRange: this.dateRange
    });
    if (timeZone.length > 0) {
    }
  }

  datePickerClick(picker: any, subtract: any) {
    const startTime = moment()
      .startOf('day')
      .subtract(subtract, 'week');
    const endTime = moment().endOf('day');
    picker.$emit('pick', [startTime.toDate(), endTime.toDate()]);
    this.dateRange = [startTime.format(DATE_PICKER_FORMAT), endTime.format(DATE_PICKER_FORMAT)];
  }

  // 编辑
  edit(troubleshootRecord: TroubleshootHistoryRecord) {
    this.open();
    this.currentRecord = troubleshootRecord;
  }
  // 打开编辑
  open() {
    const sideFrame: any = this.$refs['sideFrameCard'];
    sideFrame.open();
  }
  // 关闭编辑
  colse() {
    const sideFrame: any = this.$refs['sideFrameCard'];
    sideFrame.close();
  }

  reset() {
    this.dateRange = [];
    this.$store.dispatch(eventNames.TroubleshootingHistory.SetHistoryRecords, new HistoryQueryConditions());
  }

  // 导出excel
  async exportExcel() {
    const startDate = moment(this.conditions.dateRange[0])
      .utc(false)
      .format('YYYY-MM-DD HH:mm:ss');
    const endDate = moment(this.conditions.dateRange[1])
      .utc(false)
      .format('YYYY-MM-DD HH:mm:ss');
    const currentVillageId = SessionStorage.get('district') + '';
    // const result = await DailyTroubleshootingService.queryExportExcel(this.keyWord);
    // const result = await DailyTroubleshootingService.loadExportExcel(this.conditions);
    // const result: RecordModel[] = await DailyTroubleshootingService.loadExportByJXExcel({ startDate, endDate, currentVillageId });
    const result: TroubleshootHistoryRecord[] = await DailyTroubleshootingService.exportHistoryRecords(this.conditions);
    console.log('---RecordModel---');
    console.log(result);
    if (!result) {
      notifyUtil.warning('查找记录失败');
    }
    const res = await DailyTroubleshootingService.queryCommunity();
    if (!res) {
      notifyUtil.warning('查询社区失败');
    }
    let communityName = '';
    if (res && Array.isArray(res) && res.length > 0) {
      communityName = res[0].name;
    }
    const s = {
      alignment: {
        horizontal: 'center',
        vertical: 'center'
      }
    };
    const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    // 构造表头
    // 1.固定表头
    const unalteredHeaders = {
      A1: { v: '社区疫情排查情况登记表', s },
      A2: { v: '社区(村)', s },
      C2: { v: communityName, s },
      G2: { v: '制表日期', s },
      H2: { v: now, s }
    };
    // 2.构造数据相关联表头
    let alterableHeaders = {};
    const dataRowHight: any[] = [];
    const cols = [] as any[];
    const headerNames = this.getHeaderNames();
    const startRowNumber = 3;
    const rowHeight = 24;
    const startChat = 'A';
    headerNames.forEach((name: string, index: number) => {
      dataRowHight.push({ hpx: rowHeight }); // 单元格高度
      cols.push({ wch: name.length * 2 + 2 }); // 单元格宽度
      const number = startChat.charCodeAt(0);
      let colIndex = '';
      if (index < 26) {
        colIndex = String.fromCharCode(number + index);
      } else {
        colIndex = `${startChat}${String.fromCharCode(number + index - 26)}`;
      }
      const rowHeader = {
        [`${colIndex}${startRowNumber}`]: { v: name, s }
      };
      alterableHeaders = Object.assign({}, alterableHeaders, rowHeader);
    });
    const headers = Object.assign({}, unalteredHeaders, alterableHeaders);
    // 构造表格数据
    let data = {};
    const execlData = this.convretToExeclData(result);
    console.log('---execlData---');
    console.log(execlData);
    execlData.forEach((item, index) => {
      let rowData = {};
      const colProps = Object.keys(item);
      colProps.forEach((prop, i) => {
        const number = startChat.charCodeAt(0);
        let colIndex = '';
        if (i < 26) {
          colIndex = String.fromCharCode(number + i);
        } else {
          colIndex = `${startChat}${String.fromCharCode(number + i - 26)}`;
        }
        const row = { [`${colIndex}${startRowNumber + 1 + index}`]: { v: item[prop], s } };
        rowData = Object.assign({}, rowData, row);
      });
      data = Object.assign({}, data, rowData);
    });
    // 合并 headers 和 data
    const output = Object.assign({}, headers, data);
    // 表格范围，范围越大生成越慢
    const ref = 'A1:ZZ2000';
    // 合并单元格设置
    const merges = [
      { s: { c: 0, r: 0 }, e: { c: 33, r: 0 } }, // 社区疫情排查情况登记表
      { s: { c: 0, r: 1 }, e: { c: 1, r: 1 } }, // 社区(村)
      { s: { c: 2, r: 1 }, e: { c: 5, r: 1 } }, // 社区(村)
      { s: { c: 6, r: 1 }, e: { c: 6, r: 1 } }, // 填表日期
      { s: { c: 7, r: 1 }, e: { c: 8, r: 1 } } // 填表日期
    ];
    // 构建 workbook 对象
    const rows = [{ hpx: rowHeight }, { hpx: rowHeight }, ...dataRowHight];
    const wb = {
      SheetNames: ['日常排查记录表'],
      Sheets: {
        日常排查记录表: Object.assign({}, output, { '!ref': ref, '!merges': merges, '!cols': cols, '!rows': rows })
      }
    };
    // 导出 Excel
    // bookType: 'xlsx', // 要生成的文件类型
    // bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    // type: 'binary'
    const execlName = `日常排查数据${now}.xlsx`;
    XLSX.writeFile(wb, execlName, { bookType: 'xlsx', bookSST: false, type: 'binary' });
  }

  getHeaderNames() {
    const names = [
      '序号',
      '姓名',
      '性别',
      '身份证号',
      '电话',
      '体温',
      '其他症状',
      '是否有湖北旅居史或接触史',
      '接触人员类型',
      '是否与确诊病例或者疑似病例密切接触',
      '是否与湖北暴露史人员接触',
      '有无咳嗽、胸闷等不适症状',
      '常德人入武汉后居住地',
      '离开湖北日期',
      '交通工具',
      '班次/车次',
      '沿途停留地点',
      '返回常德日期',
      '是否满14天日期',
      '是否外地来武陵区人员',
      '原居地址(从何处来)',
      '来武陵区方式',
      '来武陵区班次/车次',
      '同程人员',
      '工作单位',
      '是否本街道常驻人口',
      '是否有相关证明',
      '小区',
      '楼号',
      '单元',
      '房间号',
      '采集时间',
      '包保人',
      '包保人电话'
    ];
    return names;
  }

  /**
   * 转换成要导出的数据
   */
  convretToExeclData(result: TroubleshootHistoryRecord[]) {
    const rows = [] as any[];
    result.forEach((record, index) => {
      record.expendModel = record.expendProperty ? JSON.parse(record.expendProperty) : new RecordExpend;
      const rowData = {} as any;
      rowData.index = index + 1; // 序号
      rowData.name = record.personBase.name; // 姓名
      rowData.sex = record.personBase.sex === '0' ? '男' : '女'; // 替换 性别
      rowData.idNumber = record.personBase.identificationNumber; // 身份证号
      rowData.phone = record.personBase.phone; // 联系方式
      rowData.fever = record.isExceedTemp.split(':')[1]; // 是否发热（体温大于37.3度）
      rowData.symptom = this.replaceOtherSymptoms(record.otherSymptoms); // 替换 其他症状
      rowData.travelLivingHubei = record.expendModel.travelLivingHubei === 1 ? '是' : '否';
      rowData.trip = this.replacetrip(record.expendModel.trip); // 替换 疑似患者
      rowData.touchPersonIsolation = record.isContact ? '是' : '否'; // 替换 疑似患者
      rowData.touchHubei = record.expendModel.touchHubei === 1 ? '是' : '否'; // 替换 一般发热患者
      rowData.discomfort = record.expendModel.discomfort === 1 ? '是' : '否'; // 替换 密切接触者
      rowData.wuhanAddress = record.personBase.address; // 常德人入武汉后居住地
      rowData.leaveHubeiDate = record.expendModel.leaveHubeiDate; // 离开湖北日期
      rowData.vehicle = record.expendModel.vehicle; // 交通工具
      rowData.vehicleNo = record.expendModel.vehicleNo; // 班次/车次
      rowData.stayPlace = record.expendModel.stayPlace; // 沿途停留地点
      rowData.backDate = record.expendModel.backDate; // 返回常德日期
      rowData.isFullTwoWeek = this.checkTime(record.expendModel.backDate); // 是否满2周
      rowData.otherToWuling = record.expendModel.otherToWuling === 1 ? '是' : '否'; // 是否外地来武陵区人员
      rowData.whereToWuling = record.expendModel.whereToWuling; // 原居地址(从何处来)
      rowData.howToWuling = record.expendModel.howToWuling; // 来武陵区方式
      rowData.vehicleNoWuling = record.expendModel.vehicleNoWuling; // 来武陵区班次/车次
      rowData.togetherPersonWuling = record.expendModel.togetherPersonWuling; // 同程人员
      rowData.workUnitWuling = record.expendModel.workUnitWuling; // 工作单位
      rowData.permanentWuling = record.expendModel.permanentWuling
        ? record.expendModel.permanentWuling.toString() === '1'
          ? '是'
          : '否'
        : '否'; // 是否本街道常驻人口
      rowData.proveWuling = record.expendModel.proveWuling === 1 ? '是' : '否'; // 是否有相关证明
      rowData.community = record.expendModel.community; // 小区
      rowData.building = record.building; // 楼号
      rowData.unit = record.unitNumber; // 单元
      rowData.roomNumber = record.roomNo; // 房间号
      rowData.createTime = record.createTime; // 采集时间
      rowData.reporterName = this.replaceUndefined(record.expendModel.reporterName); // 包保人
      rowData.reporterPhone = this.replaceUndefined(record.expendModel.reporterPhone); // 包保人电话
      rows.push(rowData);
    });
    return rows;
  }

  replacetrip(trip: number) {
    if (trip === 1) {
      return '武汉以外的湖北人入常德人员';
    }
    if (trip === 2) {
      return '武汉入常德';
    }
    if (trip === 3) {
      return '常德入武汉以外的湖北辖区后返回常德';
    }
    if (trip === 4) {
      return '常德入武汉后返回常德';
    }
    if (trip === 5) {
      return '既非常德人又非湖北人，途径湖北进入常德';
    }
    if (trip === 6) {
      return '既非常德人又非武汉人，途径武汉进入常德';
    }
    return '';
  }

  checkTime(time: string) {
    if (!time) {
      return '';
    }
    const twoWeekAgo = moment(
      moment(new Date())
        .subtract(2, 'week')
        .format('YYYY-MM-DD')
    );
    return twoWeekAgo > moment(time) ? '是' : '否';
  }

  replaceUndefined(str: any) {
    if (str === 'undefined' || str === undefined) {
      return '';
    }
    return str;
  }

  beforeDestroy() {
    this.$store.dispatch(eventNames.TroubleshootingHistory.ResetHistoryRecordData);
  }
}
