import { Vue, Component } from 'vue-property-decorator';
import Html from './operation-zone.html';
import Style from './operation-zone.module.scss';
import notifyUtil from '@/common/utils/notifyUtil';

import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
import { TroubleshootingInfoForm } from '@/components/daily-troubleshooting/troubleshooting-info-form/troubleshooting-info-form';

import DailyTroubleshootingService from '@/api/daily-troubleshooting/daily-troubleshooting';
@Component({
  template: Html,
  style: Style,
  components: {
    'side-frame': SideFrameComponent,
    TroubleshootingInfoForm,
  }
})
export class OperationZone extends Vue {
    fileList: any = [];
    keyWords = '';
    handleSort() {

    }

    resetPlans() {

    }

    searchByKeyWords() {

    }
    debounceSearch() {

    }
    async onUploadChange(file: any) {
      const formData: any = new FormData();
      formData.append('file', file.raw);
      const result = await DailyTroubleshootingService.addDailyTroubleshootingByxlsx(formData);
      console.log(result);
      if (result) {
        notifyUtil.success('导入成功');
        this.$emit('colse');
      } else {
        notifyUtil.error('导入失败');
      }
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
