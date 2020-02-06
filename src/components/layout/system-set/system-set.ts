import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import styles from './system-set.module.scss';
import Html from './system-set.html';
import systemSetService from '@/api/system-set/system-set.service';
import SessionStorage from '@/utils/session-storage';
import notifyUtil from '@/common/utils/notifyUtil';
import eventNames from '@/common/events/store-events';
import i18n from '@/i18n';
import { Getter } from 'vuex-class';
import store from '@/store';
import SystemSetModel from '@/models/system-set/system-set-model';
import SystemBlackStyle from './system-set.black.module.scss';
import LimitMessage from '@/utils/message-limit';

@Component({
  template: Html,
  style: styles,
  themes: [{ name: 'white', style: styles }, { name: 'black', style: SystemBlackStyle }],
  name: 'system-set',
  components: {
  }
})

export class SystemSetComponent extends Vue {


  systemLogo: any = require('@/assets/img/system-logo.png');

  // 系统设置
  @Getter('systemSetOptions')
  systemOptions!: any;

  isChanged: boolean = false;

  systemModel: any = new SystemSetModel();

  isSystemSet: boolean = false;

  rules = {
    systemName: [
      { min: 1, max: 128, message: i18n.t('common.name_length_limit128'), trigger: 'blur' },
      // { validator: this.valiadateUserName, trigger: 'blur' },
      { required: true, message: i18n.t('layout.system_name_null'), trigger: 'blur' }
    ]
  };

  @Prop()
  systemSetVisible: any;

  onCloseDialog(done: any) {
    done();
    this.$emit('on-close-system-set', false);
    this.isSystemSet = false;
  }

  @Watch('systemSetVisible')
  visibleChange() {
    this.isSystemSet = this.systemSetVisible;
  }

  outsideClose() {
    this.isSystemSet = false;
    this.$store.dispatch(eventNames.systemSet.SystemSetData);
    this.$emit('on-close-system-set', false);
  }

  async resetSystemImage(event: any) {
  }

  onUploadChange(event: any) {
    const filesExgep: RegExp = /(jpg|png|jpeg)/;
    const name: any = event.raw.name.split('.')[event.raw.name.split('.').length - 1];
    const flag = filesExgep.test(name.toLowerCase());
    const isJPG = event.raw.type === 'image/jpeg' || event.raw.type === 'image/png';
    const isLt2M = event.raw.size / 1024 / 1024 <= 0.5;
    if (!flag || !isJPG) {
      notifyUtil.error(this.$tc('common.upload_image_format'));
      return;
    }
    if (!isLt2M) {
      notifyUtil.error(this.$tc('common.upload_image_size'));
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.raw);
    reader.onload = (res: any) => {
      this.systemModel.systemLogo = res.target.result;
      this.systemOptions.systemImg = res.target.result;
    };
  }

  // 上传验证
  async beforeUpload(file: any) {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 <= 0.5;
    if (!isJPG) {
      notifyUtil.error(this.$tc('common.upload_image_format'));
      // LimitMessage.showMessage({ type: 'error', message: this.$tc('common.upload_image_format') });
    }
    if (!isLt2M) {
      notifyUtil.error(this.$tc('common.upload_image_size'));
      // LimitMessage.showMessage({ type: 'error', message: this.$tc('common.upload_image_size') });
    }
    return isJPG && isLt2M;
  }

  // 保存系统设置
  async saveSystemSet() {
    const systemOptionsRef: any = this.$refs['systemOptionsRef'];
    systemOptionsRef.validate(async (valid: any) => {
      if (!valid) {
        return;
      }
      this.systemModel.systemName = this.systemOptions.systemName;
      this.systemModel.id = store.getters.configs.systemSetId;
      this.systemModel.updateUser = SessionStorage.get('userInfo').userName;
      if (this.systemModel.systemLogo === '') {
        this.systemModel.systemLogo = this.systemOptions.systemImg;
      }
      const result = await systemSetService.updateSystemSet(this.systemModel);
      if (result && result > 0) {
        this.$store.dispatch(eventNames.systemSet.SystemSetData);
        notifyUtil.success(this.$tc('common.update_success'));
        // LimitMessage.showMessage({ type: 'error', message: this.$tc('common.update_success') });
        this.outsideClose();
      } else {
        notifyUtil.error(this.$tc('common.update_fail'));
        // LimitMessage.showMessage({ type: 'error', message: this.$tc('common.update_success') });
      }
    });
  }

}

