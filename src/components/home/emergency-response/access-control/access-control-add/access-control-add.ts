import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import accessControlAddStyle from './access-control-add.module.scss';
import accessControlAddHtml from './access-control-add.html';

import { SideFrameComponent } from '@/components/share/side-frame/side-frame';

@Component({
  template: accessControlAddHtml,
  style: accessControlAddStyle,
  themes: [{ name: 'white', style: accessControlAddHtml }],
  components: {
    'el-side-frame': SideFrameComponent,
  }
})
export class AccessControlAdd extends Vue {
  private resform = {
    resId: '1111111111111111',
    resName: '口罩',
    resType: 'N95',
    resSpec: '1片',
    resCount: 200,
    resunit: '片',
    resUpdateTime: '2020.2.1'
  };
  resourceAdd() {
    const sideFrame: any = this.$refs['sideFrame'];
    if ( sideFrame ) {
      sideFrame.open();
    }
  }
  close() {
    const sideFrame: any = this.$refs['sideFrame'];
    if ( sideFrame ) {
      sideFrame.close();
    }
  }
  submit() {
    this.close();
  }
}
