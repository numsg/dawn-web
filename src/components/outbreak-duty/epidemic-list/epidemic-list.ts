import eventNames from '@/common/events/store-events';
import { getGuid32 } from '@gsafety/cad-gutil/dist/utilhelper';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import epidemicListStyle from './epidemic-list.module.scss';
import epidemicListHtml from './epidemic-list.html';
import { ECharts, EChartOption } from 'echarts';
import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
import EpidemicPerson from '@/models/home/epidemic-persion';
import epidemicDynamicService from '@/api/epidemic-dynamic/epidemic-dynamic.service';
import moment from 'moment';
import { debounce } from 'lodash';
import { EpidemicInfoFormComponent } from '../epidemic-info-form/epidemic-info-form';
import { Getter } from 'vuex-class';

@Component({
  template: epidemicListHtml,
  style: epidemicListStyle,
  themes: [{ name: 'white', style: epidemicListStyle }],
  components: {
    'side-frame': SideFrameComponent,
    'epidemic-info-form': EpidemicInfoFormComponent
  }
})
export class EpidemicListComponent extends Vue {
  isShowTabs: boolean = false;

  @Getter('outbreakDuty_epidemicPersonList')
  epidemicPersonList!: EpidemicPerson[];
  @Getter('outbreakDuty_totalCount')
  totalCount!: number;
  currentPage: number = 1;
  pageSize: number = 10;
  keyWords: string = '';

  // 当前省疫情数据
  curProEpidemicData: any = {};

  citiesEpidemicData: any[] = [];

  editEpidemicPerson: EpidemicPerson = new EpidemicPerson();

  /**
   * 搜索防抖
   */
  debounceSearch = debounce(this.handleSearch, 500);

  sort: any = { type: 'submitTime', flag: 'desc' };

  async mounted() {
    this.queryEpidemicPersons();
  }

  async queryEpidemicPersons() {
    this.$store.dispatch(eventNames.OutbreakDuty.SetEpidemicPersons, {
      page: this.currentPage - 1,
      count: this.pageSize,
      sort: this.sort
    });
  }

  handleSearch() {
    this.$store.dispatch(eventNames.OutbreakDuty.SetEpidemicPersons, {
      page: 0,
      count: this.pageSize,
      keyowrds: this.keyWords,
      sort: this.sort
    });
  }

  addEpidemicPersion() {
    this.editEpidemicPerson = new EpidemicPerson();
    const sideFrame: any = this.$refs['sideFrame'];
    sideFrame.open();
  }

  savePersonSuccess() {
    const sideFrame: any = this.$refs['sideFrame'];
    sideFrame.close();
    this.queryEpidemicPersons();
    this.$store.dispatch(eventNames.OutbreakDuty.SetEpidemicStaticalData);
  }

  handleSizeChange(val: any) {
    this.pageSize = val;
    this.queryEpidemicPersons();
    console.log(`每页 ${val} 条`);
  }
  handleCurrentChange(val: any) {
    this.currentPage = val;
    this.queryEpidemicPersons();
    console.log(`当前页: ${val}`);
  }

  /**
   * 编辑
   */
  handleEdit(data: EpidemicPerson) {
    this.editEpidemicPerson = data;
    const sideFrame: any = this.$refs['sideFrame'];
    sideFrame.open();
  }

  handleDelete(data: EpidemicPerson) {

  }

  resetData() {
    this.currentPage = 1;
    this.pageSize = 10;
    this.queryEpidemicPersons();
    this.$store.dispatch(eventNames.OutbreakDuty.SetEpidemicStaticalData);
  }

  handleSort() {
    if (this.sort.flag === 'desc') {
      this.sort.flag = 'asc';
    } else {
      this.sort.flag = 'desc';
    }
    this.queryEpidemicPersons();
  }
}
