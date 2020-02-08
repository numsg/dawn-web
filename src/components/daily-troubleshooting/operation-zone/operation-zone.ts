import { Vue, Component } from 'vue-property-decorator';
import Html from './operation-zone.html';
import Style from './operation-zone.module.scss';

import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
import { TroubleshootingInfoForm } from '@/components/daily-troubleshooting/troubleshooting-info-form/troubleshooting-info-form';

@Component({
  template: Html,
  style: Style,
  components: {
    'side-frame': SideFrameComponent,
    TroubleshootingInfoForm,
  }
})
export class OperationZone extends Vue {

    keyWords = '';
    handleSort() {

    }

    resetPlans() {

    }

    searchByKeyWords() {

    }
    debounceSearch() {

    }

    addTroubleShoot() {
      const sideFrame: any = this.$refs['sideFrame'];
      sideFrame.open();
    }
    colse() {
      const sideFrame: any = this.$refs['sideFrame'];
      sideFrame.colse();
    }

}
