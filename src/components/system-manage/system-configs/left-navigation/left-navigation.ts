import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import Html from './left-navigation.html';
import styles from './left-navigation.module.scss';
import prop from 'ramda/es/prop';

import SystemConfig from '@/models/common/system-config-model';

@Component({
  template: Html,
  style: styles,
  components: {}
})
export class LeftNavigationComponent extends Vue {
  @Prop() data: any;

  @Prop() defaultActiveId: any;

  handleOpen(key: any, keyPath: any) {
  }

  handleClose(key: any, keyPath: any) {}

  onMenuItem(item: any) {
    this.$emit('on-menu-item', item.id);
  }
}
