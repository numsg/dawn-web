import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import resourceAddStyle from './resource-add.module.scss';
import resourceAddHtml from './resource-add.html';

import { SideFrameComponent } from '@/components/share/side-frame/side-frame';

@Component({
  template: resourceAddHtml,
  style: resourceAddStyle,
  themes: [{ name: 'white', style: resourceAddStyle }],
  components: {
    'el-side-frame': SideFrameComponent,
  }
})
export class ResourceAdd extends Vue {
  private resform = {
    resId: '',
    resName: '',
    resType: '',
    resSpec: '',
    resCount: 0,
    resunit: '',
    resUpdateTime: ''
  };

  private resTypes = [{
    value: 'KN95',
    label: 'KN95'
  }, {
    value: 'N90',
    label: 'N90'
  }];

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
