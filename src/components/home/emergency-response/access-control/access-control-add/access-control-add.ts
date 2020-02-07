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
