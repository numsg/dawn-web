import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import resourceManageStyle from './resource-manage.module.scss';
import resourceManageHtml from './resource-manage.html';

import { ResourceTransfers } from '@/components/home/elements-information/resource-manage/resource-transfers/resource-transfers';
import { ResourceEdit } from '@/components/home/elements-information/resource-manage/resource-edit/resource-edit';
import { ResourceRecords } from '@/components/home/elements-information/resource-manage/resource-records/resource-records';
import { ResourceSearch } from '@/components/home/elements-information/resource-manage/resource-search/resource-search';

import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
@Component({
  template: resourceManageHtml,
  style: resourceManageStyle,
  themes: [{ name: 'white', style: resourceManageStyle }],
  components: {
    ResourceTransfers,
    ResourceEdit,
    ResourceRecords,
    ResourceSearch,
    'el-side-frame': SideFrameComponent,
   }
})
export class ResourceManage extends Vue {
  private currentPage = 0;
  private pageSize = 4;
  private pageSizes = [4, 8, 12];
  private resourceDate = [
    {
      resId: 'YJ1001',
      resName: '口罩',
      resType: 'N95',
      resSpec: '1片',
      resCount: 200,
      resunit: '片',
      resUpdateTime: '2020.2.1'
    },
    {
      resId: 'YJ1001',
      resName: '口罩',
      resType: 'N95',
      resSpec: '1片',
      resCount: 200,
      resunit: '片',
      resUpdateTime: '2020.2.1'
    },
    {
      resId: 'YJ1001',
      resName: '口罩',
      resType: 'N95',
      resSpec: '1片',
      resCount: 200,
      resunit: '片',
      resUpdateTime: '2020.2.1'
    },
    {
      resId: 'YJ1001',
      resName: '口罩',
      resType: 'N95',
      resSpec: '1片',
      resCount: 200,
      resunit: '片',
      resUpdateTime: '2020.2.1'
    },
    {
      resId: 'YJ1001',
      resName: '口罩',
      resType: 'N95',
      resSpec: '1片',
      resCount: 200,
      resunit: '片',
      resUpdateTime: '2020.2.1'
    },
  ];
  private currentRes = {
    resId: '',
    resName: '',
    resType: '',
    resSpec: '',
    resCount: 0,
    resunit: '',
    resUpdateTime: ''
  };

  private currentFrame = '';

  // 刷新列表
  refresh() {

  }



  // // 打开调派物资弹框
  showTransfersDialog(res: any) {
    this.currentFrame = 'ResourceTransfers';
    this.currentRes = res;
    this.frameOpen();
  }
  showEditDialog(res: any) {
    this.currentFrame = 'ResourceEdit';
    this.currentRes = res;
    this.frameOpen();
  }
  showRecordsDialog(res: any) {
    this.currentFrame = 'ResourceRecords';
    this.currentRes = res;
    this.frameOpen();
  }
  deleteDialog(res: any) {
    this.currentRes = res;
  }

  frameColse() {
    const sideFrame: any = this.$refs['ResourceSideFrame'];
    if ( sideFrame ) {
      sideFrame.close();
    }
  }

  frameOpen() {
    const sideFrame: any = this.$refs['ResourceSideFrame'];
    if ( sideFrame ) {
      sideFrame.open();
    }
  }

  handleSizeChange() {

  }

  handleCurrentChange() {

  }


}
