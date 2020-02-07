import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import accessControlStyle from './access-control.module.scss';
import accessControleHtml from './access-control.html';

import { ResourceTransfers } from '@/components/home/elements-information/resource-manage/resource-transfers/resource-transfers';
import { ResourceEdit } from '@/components/home/elements-information/resource-manage/resource-edit/resource-edit';
import { ResourceRecords } from '@/components/home/elements-information/resource-manage/resource-records/resource-records';

import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
import { AccessControlEdit } from './access-control-edit/access-control-edit';
@Component({
  template: accessControleHtml,
  style: accessControlStyle,
  themes: [{ name: 'white', style: accessControlStyle }],
  components: {
    ResourceTransfers,
    // accessControlAddHtml,
    AccessControlEdit,
    ResourceRecords,
    'el-side-frame': SideFrameComponent,
   }
})
export class AccessControl extends Vue {
  private currentPage = 0;
  private pageSize = 4;
  private pageSizes = [4, 8, 12];
  private tableData = [
    {
      time: '2020.2.1',
      room: '1-20-02',
      name: '张三',
      phone: '12345678977',
      temperature: '36.5',
      type: '出',
      resunit: '片',
      method: '自驾',
      reason: '',
      note: ''
    },
    {
      time: '2020.2.1',
      room: '1-20-02',
      name: '张三',
      phone: '12345678977',
      temperature: '36.5',
      type: '出',
      resunit: '片',
      method: '自驾',
      reason: '',
      note: ''
    },
    {
      time: '2020.2.1',
      room: '1-20-02',
      name: '李四',
      phone: '12345678977',
      temperature: '36.5',
      type: '出',
      resunit: '片',
      method: '自驾',
      reason: '',
      note: ''
    },
    {
      time: '2020.2.1',
      room: '1-20-02',
      name: '李四',
      phone: '12345678977',
      temperature: '36.5',
      type: '出',
      resunit: '片',
      method: '自驾',
      reason: '',
      note: ''
    },
    {
      time: '2020.2.1',
      room: '1-20-02',
      name: '李四',
      phone: '12345678977',
      temperature: '36.5',
      type: '出',
      resunit: '片',
      method: '自驾',
      reason: '',
      note: ''
    }
  ];
  private currentFrame = '';

  handleEdit() {
    this.currentFrame = 'AccessControlEdit';
    this.frameOpen();
  }
  handleCheck() {
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
