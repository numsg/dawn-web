import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import resourceManageStyle from './resource-manage.module.scss';
import resourceManageHtml from './resource-manage.html';

import { ResourceTransfers } from '@/components/home/elements-information/resource-manage/resource-transfers/resource-transfers';
import { ResourceEdit } from '@/components/home/elements-information/resource-manage/resource-edit/resource-edit';
import { ResourceRecords } from '@/components/home/elements-information/resource-manage/resource-records/resource-records';

import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
@Component({
  template: resourceManageHtml,
  style: resourceManageStyle,
  themes: [{ name: 'white', style: resourceManageStyle }],
  components: {
    ResourceTransfers,
    ResourceEdit,
    ResourceRecords,
    'el-side-frame': SideFrameComponent,
   }
})
export class ResourceManage extends Vue {
  private currentPage = 0;
  private pageSize = 4;
  private pageSizes = [4, 8, 12];
  private resourceDate = [
    {
      resId: '1111111111111111',
      resName: '口罩',
      resType: 'N95',
      resSpec: '1片',
      resCount: 200,
      resunit: '片',
      resUpdateTime: '2020.2.1'
    },
    {
      resId: '1111111111111111',
      resName: '口罩',
      resType: 'N95',
      resSpec: '1片',
      resCount: 200,
      resunit: '片',
      resUpdateTime: '2020.2.1'
    },
    {
      resId: '1111111111111111',
      resName: '口罩',
      resType: 'N95',
      resSpec: '1片',
      resCount: 200,
      resunit: '片',
      resUpdateTime: '2020.2.1'
    },
  ];
  private currentFrame = '';
  // // 调派物资弹框
  // private transfersVisible = false;
  // // 物资编辑
  // private editVisible = false;
  // // 打开调派物资弹框
  showTransfersDialog() {
    this.currentFrame = 'ResourceTransfers';
    this.frameOpen();
  }
  showEditDialog() {
    this.currentFrame = 'ResourceEdit';
    this.frameOpen();
  }
  showRecordsDialog() {
    this.currentFrame = 'ResourceRecords';
    this.frameOpen();
  }
  // // 调派物资弹框状态改变
  // transfersVisibleChange(value: boolean) {
  //   this.transfersVisible = value;
  // }

  // showEditVisible() {
  //   this.editVisible = true;
  // }

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
