import TroubleshootRecord from '@/models/daily-troubleshooting/trouble-shoot-record';
import { DailyQueryConditions } from '@/models/common/daily-query-conditions';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from './person-card.html';
import Style from './person-card.module.scss';

import { Getter, Mutation, State } from 'vuex-class';

import eventNames from '@/common/events/store-events';

import { PersonInfo } from '@/models/daily-troubleshooting/person-info';

import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
import { TroubleshootingInfoForm } from '@/components/daily-troubleshooting/troubleshooting-info-form/troubleshooting-info-form';
import moment from 'moment';
import * as format from 'dateformat';
import dataFormat from '@/utils/data-format';

@Component({
  template: Html,
  style: Style,
  components: {
    'side-frame': SideFrameComponent,
    TroubleshootingInfoForm
  }
})
export class PersonCard extends Vue {

  pageSizes = [10, 20, 30];
  pageSize = 10;
  // 本社区小区
  @Getter('baseData_communities')
  communities!: any[];
  // 其他症状
  @Getter('baseData_otherSymptoms')
  otherSymptoms!: any[];
  // 医疗意见
  @Getter('baseData_medicalOpinions')
  medicalOpinions!: any[];

  @Getter('dailyTroubleshooting_personData')
  personData!: TroubleshootRecord[];
  // personData!: PersonInfo[];

  @Getter('dailyTroubleshooting_totalCount')
  totalCount!: number;

  @Prop({ default: false })
  reset!: boolean;

  @Getter('dailyTroubleshooting_isShowgGroup')
  isShowgGroup!: boolean;

  @Mutation('SET_CHECK_GROUP_INFO')
  setCheckGroupInfo!: ( arg: any ) => void;

  @Getter('dailyTroubleshooting_groupPersonTotalCount')
  groupPersonTotalCount!: number;

  @State((state: any) => state.dailyTroubleshooting.groupTotalCount)
  groupTotalCount!: number;

  @State((state: any) => state.dailyTroubleshooting.groupPageSize)
  groupPageSize!: number;

  private currentPerson = new TroubleshootRecord();

  get activeName() {
    return this.$store.state.dailyTroubleshooting.activeName;
  }

  set activeName(value: string) {
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetActiveName, value);
  }

  get currentPage() {
    return this.$store.state.dailyTroubleshooting.conditions.page + 1;
  }

  set currentPage(val: number) {

  }

  get currentGroupPage() {
    return this.$store.state.dailyTroubleshooting.conditions.groupPage + 1;
  }

  set currentGroupPage(val: number) {

  }

  @Getter('dailyTroubleshooting_groupsData')
  groupsData!: any[];

  @Getter('dailyTroubleshooting_groupPersonData')
  groupPersonData!: any[];

  @Getter('dailyTroubleshooting_conditions')
  conditions!: DailyQueryConditions;

  // 性别
  @Getter('baseData_genderClassification')
  genderClassification!: any[];

  thermometer = require('@/assets/img/thermometer.png');

  get currentRowKey() {
    return this.$store.state.dailyTroubleshooting.activeName;
  }

  // set currentRowKey(val: string) {
  //   this.$store.dispatch(eventNames.DailyTroubleshooting.SetActiveName, val);
  // }

  @Watch('reset')
  handleResetPersonData(val: boolean) {
    if (val) {
      // this.currentPage = 1;
    }
  }

  @Watch('activeName')
  watchActiveName(value: any) {
    if ( typeof value === 'number' ) {
      const group = this.groupsData[value];
      console.log(group, '-----group---');
      this.setCheckGroupInfo({checkedPlot: group.plotId, checkedBuilding: group.building, checkedUnitNumber: group.unitNumber});
    } else {
      this.setCheckGroupInfo({checkedPlot: '', checkedBuilding: '', checkedUnitNumber: ''});
    }
  }

  created() {
    // this.$store.dispatch(eventNames.DailyTroubleshooting.SetGroupsData);
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetConditions);
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetAllGroupData);
  }

  mounted() {

  }

  colorBodyTemperature(temperature: string) {
    const tem = parseFloat(temperature);
    if (tem > 37) {
      return '#ee8240';
    } else if (tem > 38) {
      return '#ce3636';
    } else {
      return '#9ab2e9';
    }
  }

  showDetail() {}

  handleCardClick() {}

  editSuccess() {
    if (this.isShowgGroup) {
      this.$store.dispatch(eventNames.DailyTroubleshooting.SetGroupPersonData);
    } else {
      this.$store.dispatch(eventNames.DailyTroubleshooting.SetConditions, this.conditions);
    }
    this.colse();
  }

  // 编辑
  edit(troubleshootRecord: TroubleshootRecord) {
    this.open();
    this.currentPerson = JSON.parse(JSON.stringify(troubleshootRecord));
  }
  // 页数码改变
  handleSizeChange(value: any) {
    this.pageSize = value;
  }
  // 当前页改变
  handleCurrentChange(value: any) {
    if (this.isShowgGroup) {
      this.$store.dispatch(eventNames.DailyTroubleshooting.SetGroupPersonData, {
        page: value - 1
      });
    } else {
      this.$store.dispatch(eventNames.DailyTroubleshooting.SetConditions, {
        page: value - 1
      });
    }
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
      return dataFormat.formatTime(time);
    }
    return '';
  }

  replaceSex(sex: any) {
    const sexItem = this.genderClassification.find((item: any) => item.id === sex);
    return sexItem ? sexItem.name : '';
  }


  rowKeyFunc(row: any) {
    return row.plotId + '-' + row.building + '-' + row.unitNumber;
  }

  rowClick(row: any) {
    const currentRowKey = row.plotId + '-' + row.building + '-' + row.unitNumber;
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetActiveName, currentRowKey);
  }

  groupCurrentChange(value: any) {
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetGroupsData, {
      page: value
    });
  }

  activeChange() {

  }

}
