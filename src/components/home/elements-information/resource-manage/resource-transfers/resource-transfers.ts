import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import ResourceTransfersStyle from './resource-transfers.module.scss';
import ResourceTransfersHtml from './resource-transfers.html';

import { SideFrameComponent } from '@/components/share/side-frame/side-frame';

@Component({
  template: ResourceTransfersHtml,
  style: ResourceTransfersStyle,
  themes: [{ name: 'white', style: ResourceTransfersStyle }],
  components: {
    'el-side-frame': SideFrameComponent,
  }
})
export class ResourceTransfers extends Vue {
  private resCount = 1;

  created() {
    console.log('ResourceTransfers') ;
  }
  handleChange() {

  }

  submit() {
    this.close();
  }

  close() {
    this.$emit('colse');
  }
}
