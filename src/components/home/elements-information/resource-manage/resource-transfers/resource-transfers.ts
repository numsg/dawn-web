import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import ResourceTransfersStyle from './resource-transfers.module.scss';
import ResourceTransfersHtml from './resource-transfers.html';

import { SideFrameComponent } from '@/components/share/side-frame/side-frame';

import resourceManageService from '@/api/elements-information/resource-manage-service';
import notifyUtil from '@/common/utils/notifyUtil';
@Component({
  template: ResourceTransfersHtml,
  style: ResourceTransfersStyle,
  themes: [{ name: 'white', style: ResourceTransfersStyle }],
  components: {
    'el-side-frame': SideFrameComponent,
  }
})
export class ResourceTransfers extends Vue {
  @Prop( { default: () => {} })
  private currentRes!: any;

  private resCount = 1;
  private remask = '';

  created() {
    console.log('ResourceTransfers') ;
  }
  // 调派资源
  async submit() {
    const resourceInfo = {};
    const result = await resourceManageService.transferResource(resourceInfo);
    if ( result ) {
      notifyUtil.success('资源出库成功');
      this.$emit('refresh');
    } else {
      notifyUtil.error('添加出库失败');
    }
    this.close();
  }
  clean() {
    this.resCount = 1;
    this.remask = '';
  }
  close() {
    this.$emit('colse');
    this.clean();
  }
}
