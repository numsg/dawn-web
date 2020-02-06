import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import RecentWorkListStyle from './recent-work-list.module.scss';
import RecentWorkListHtml from './recent-work-list.html';
import systemLogService from '@/api/system-log/system-log.service';
import { treeToArray } from '@/common/utils/utils';
import sessionStorage from '@/utils/session-storage';
import moment from 'moment';
import recentStyle from './recent-work-list.module.scss';
import recentBlackStyle from './recent-work-list.black.module.scss';

@Component({
  template: RecentWorkListHtml,
  style: RecentWorkListStyle,
  themes: [{ name: 'white', style: recentStyle }, { name: 'black', style: recentBlackStyle }],
  components: {},
  filters: {
    timeFormat: (data: any) => {
      if (data) {
        return moment(data).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }
})
export class RecentWorkListComponent extends Vue {
  @Prop({
    default: 11
  })
  span!: number;

  boxWidth: string = '';
  moduleData: Array<any> = [];
  public dataSource: Array<any> = [];
  @Watch('span', { deep: true })
  onSpansChange(val: any) {
    this.logData(15);
  }

  /**
   *
   *
   * @type {Array<any>}
   * @memberof RecentWorkListComponent
   */
  mounted() {
    const privileges: any = sessionStorage.get('privilegeChilds');
    if (privileges && Array.isArray(privileges)) {
      this.moduleData = treeToArray(privileges.filter((item: any) => item.expression === '/'));
      this.logData(15);
    }
  }

  private async logData(pageSize: number) {
    const data: any = await systemLogService.querySystemLog({ module: this.moduleData }, pageSize, 0);
    if (data && data.list) {
      this.dataSource = data.list;
    }
  }
  showMore() {
    this.$router.push({ name: 'system_log' });
  }

}
