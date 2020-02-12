import notifyUtil from '@/common/utils/notifyUtil';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import QrcodeInfoAddStyle from './qrcode-info-add.module.scss';
import QrcodeInfoAddHtml from './qrcode-info-add.html';
import QrcodeInfo from '@/models/home/qrcode-info';
import store from '@/store';
import communityQrManageService from '@/api/community-qr-manage/community-qr-manage.service';
import { arrayToTree } from '@/common/utils/utils';
@Component({
  template: QrcodeInfoAddHtml,
  style: QrcodeInfoAddStyle,
  themes: [{ name: 'white', style: QrcodeInfoAddStyle }],
  components: {}
})
export class QrcodeInfoAddComponent extends Vue {
  @Prop()
  qrcodeInfoForm!: QrcodeInfo;
  defaultProps = {
    label: 'name',
    value: 'id'
  };

  options: any = [];

  value: any = '';

  // private props = {
  //   multiple: false,
  //   lazy: true,
  //   lazyLoad: this.lazyLoad,
  //   value: 'districtCode',
  //   label: 'name',
  //   checkStrictly: true
  // };

  currentQRCodeForm: QrcodeInfo = new QrcodeInfo();
  // 二维码url
  qrCodeUrl: any = '';
  disabledFlag: any = true;
  rules = {
    // regionalismCode: [{ required: true, message: '行政区划code', trigger: 'change' }],
    responsible: [{ required: true, message: '责任人', trigger: 'change' }],
    responsiblePhone: [{ required: true, message: '责任人电话', trigger: 'change' }]
  };
  @Watch('qrcodeInfoForm')
  onQrCode() {
    this.currentQRCodeForm = JSON.parse(JSON.stringify(this.qrcodeInfoForm));
    this.qrCodeUrl = store.getters.configs.qrCodeUrl;
  }
  submitForm(formName: string) {
    const form: any = this.$refs[formName];
    form.validate((valid: any) => {
      if (valid) {
        // const regionalismCode = this.convert(this.currentQRCodeForm.regionalismCode);
        const obj: any = {
          businessId: this.currentQRCodeForm.commuityCode,
          content:
            this.qrCodeUrl +
            '?' +
            'commuityCode=' +
            this.currentQRCodeForm.commuityCode +
            '&commuityName=' +
            encodeURIComponent(this.currentQRCodeForm.commuityName) +
            '&regionalismCode=' +
            this.currentQRCodeForm.regionalismCode +
            // regionalismCode +
            '&responsible=' +
            encodeURIComponent(this.currentQRCodeForm.responsible) +
            '&responsiblePhone=' +
            this.currentQRCodeForm.responsiblePhone
        };
        communityQrManageService.generateQRCodeImage(obj).then((res: any) => {
          this.$emit('save-qrcode-success');
        });
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  resetForm(formName: string) {
    // const form: any = this.$refs[formName];
    // form.resetFields();
    this.$emit('save-qrcode-success');
  }

  async mounted() {
    // this.options = await communityQrManageService.queryAdmCodesByParentId('000000');
  }
  // async lazyLoad(node: any, resolve: any) {
  //   const result = await communityQrManageService.queryAdmCodesByParentId(node.value);
  //   resolve(result);
  // }

  // handleNodeChange(node: any) {
  // }

  // convert(data: Array<any>) {
  //   return data.join().replace(',' , '/');
  // }

}
