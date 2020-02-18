import { Vue, Component } from 'vue-property-decorator';
import html from './troubleshoot-history.html';
import styles from './troubleshoot-history.module.scss';
import TroubleshootHistoryRecord from '@/models/daily-troubleshooting/trouble-shoot-history';
import { Getter, State } from 'vuex-class';
import eventNames from '@/common/events/store-events';
import TroubleshootRecord from '@/models/daily-troubleshooting/trouble-shoot-record';
import moment from 'moment';
import { debounce } from 'lodash';
import { HistoryQueryConditions } from '@/models/daily-troubleshooting/history-query-conditions';
import i18n from '@/i18n';
import notifyUtil from '@/common/utils/notifyUtil';
import { TroubleshootingInfoForm } from '../daily-troubleshooting/troubleshooting-info-form/troubleshooting-info-form';
import { SideFrameComponent } from '../share/side-frame/side-frame';
import { DATE_PICKER_FORMAT } from '@/common/filters/dateformat';
// const DATE_PICKER_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss[Z]';

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

  feverOptions = [
    {
      label: '是',
      value: true
    },
    {
      label: '否',
      value: false
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

  replaceOtherSymptoms(otherSymptoms: string[]) {
    if (!otherSymptoms) {
      return '';
    }
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
    this.$store.dispatch(eventNames.TroubleshootingHistory.SetHistoryRecords, new HistoryQueryConditions);
  }

  beforeDestroy() {
    this.$store.dispatch(eventNames.TroubleshootingHistory.ResetHistoryRecordData);
  }
}
