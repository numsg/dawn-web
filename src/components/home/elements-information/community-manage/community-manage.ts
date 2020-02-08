import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import CommunityManageStyle from './community-manage.module.scss';
import CommunityManageHtml from './community-manage.html';

@Component({
  template: CommunityManageHtml,
  style: CommunityManageStyle,
  themes: [{ name: 'white', style: CommunityManageStyle }],
  components: {}
})
export class CommunityManage extends Vue {
  private currentPage = 0;
  private pageSize = 4;
  private pageSizes = [4, 8, 12];
  private workerData = [
    {
      id: '123123123',
      community: '幸福社区',
      gridNumber: '0101',
      houseHoldCount: '300',
      personCount: '1200',
      worker: '张三',
      workerPhone: '123323234',
      userName: 'zhangsan0101',
      ResponsibleCommunity: '张庄小区',
    },
    {
      id: '123123123',
      community: '幸福社区',
      gridNumber: '0101',
      houseHoldCount: '300',
      personCount: '1200',
      worker: '张三',
      workerPhone: '123323234',
      userName: 'zhangsan0101',
      ResponsibleCommunity: '张庄小区',
    }
  ];

  showTransfersDialog() {

  }

  handleSizeChange() {

  }

  handleCurrentChange() {

  }
}
