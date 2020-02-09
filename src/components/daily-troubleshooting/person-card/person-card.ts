import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from './person-card.html';
import Style from './person-card.module.scss';

import { Getter } from 'vuex-class';

import eventNames from '@/common/events/store-events';

import { PersonInfo } from '@/models/daily-troubleshooting/person-info';

import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
import { TroubleshootingInfoForm } from '@/components/daily-troubleshooting/troubleshooting-info-form/troubleshooting-info-form';

@Component({
  template: Html,
  style: Style,
  components: {
    'side-frame': SideFrameComponent,
    TroubleshootingInfoForm
  }
})
export class PersonCard extends Vue {

  currentPage = 1;
  pageSizes = [10, 20, 30];
  pageSize = 10;

  // 本社区小区
  @Getter('baseData_communities')
  communities!: any[];

  // @Prop({ default: [] })
  // private personData!: PersonInfo[];
  @Getter('dailyTroubleshooting_personData')
  personData!: PersonInfo[];

  // @Prop({ default: 0 })
  // private totalCount!: number;
  @Getter('dailyTroubleshooting_totalCount')
  totalCount!: number;

  @Prop({ default: false })
  reset!: boolean;

  // @Prop({default: true})
  // isShowgGroup!: boolean;

  @Getter('dailyTroubleshooting_isShowgGroup')
  isShowgGroup!: boolean;

  private currentPerson = new PersonInfo();

  // activeName = '';

  get activeName() {
    return this.$store.state.dailyTroubleshooting.activeName;
  }

  set activeName(value: string) {
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetActiveName, value);
  }

  @Getter('dailyTroubleshooting_groupsData')
  groupsData!: any[];

  @Getter('dailyTroubleshooting_groupPersonData')
  groupPersonData!: any[];

  @Watch('reset')
  handleResetPersonData(val: boolean) {
    if (val) {
      this.currentPage = 1;
    }
  }

  created() {
    this.pageSize = this.pageSizes[0];
    if (this.isShowgGroup) {
      this.$store.dispatch(eventNames.DailyTroubleshooting.SetGroupsData);
    } else {
      this.$store.dispatch(eventNames.DailyTroubleshooting.LoadPersonData);
    }
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

  success() {
    this.$emit('refesh');
    this.colse();
  }

  // 编辑
  edit(person: PersonInfo) {
    this.open();
    this.currentPerson = person;
  }
  // 页数码改变
  handleSizeChange(value: any) {
    this.pageSize = value;
    // this.$store.dispatch(eventNames.DailyTroubleshooting.SetConditions, {
    //   page: value
    // });
  }
  // 当前页改变
  handleCurrentChange(value: any) {
    this.currentPage = value;
    // this.$emit('paginationChange', { pageSize: this.pageSize, currentPage: this.currentPage });
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetConditions, {
      page: value - 1
    });
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

  replaceTime(time: string) {
    if (time) {
      return time.replace('Z', ' ').replace('T', ' ');
    }
    return '';
  }

  activeChange() {

  }
}
