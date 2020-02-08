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
import { EpidemicInfoFormComponent } from '@/components/home/epidemic-dynamic/epidemic-info-form/epidemic-info-form';

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

  epidemicPersonList: EpidemicPerson[] = [];

  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  keyWords: string = '';

  // 当前省疫情数据
  curProEpidemicData: any = {};

  citiesEpidemicData: any[] = [];

  /**
   * 搜索防抖
   */
  debounceSearch = debounce(this.handleSearch, 500);

  async mounted() {

    this.queryEpidemicPersons();
  }

  async queryEpidemicPersons() {
    const data = await epidemicDynamicService.queryEpidemicPersons(this.currentPage - 1, this.pageSize);
    this.totalCount = data.count;
    this.epidemicPersonList = data.value;
  }


  showTabs() {
    this.isShowTabs = !this.isShowTabs;
    if (this.isShowTabs) {
      this.queryEpidemicPersons();
    }
  }

  handleSearch() {
    epidemicDynamicService.queryEpidemicPersons(this.currentPage - 1, this.pageSize, this.keyWords).then((data: any) => {
      this.totalCount = data.count;
      this.epidemicPersonList = data.value;
    });
  }

  addEpidemicPersion() {
    const sideFrame: any = this.$refs['sideFrame'];
    sideFrame.open();
  }

  savePersonSuccess() {
    const sideFrame: any = this.$refs['sideFrame'];
    sideFrame.close();
    this.queryEpidemicPersons();
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
}
