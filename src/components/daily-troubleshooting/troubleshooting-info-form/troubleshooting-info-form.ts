import notifyUtil from '@/common/utils/notifyUtil';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import Style from './troubleshooting-info-form.scss';
import Html from './troubleshooting-info-form.html';

import epidemicDynamicService from '@/api/epidemic-dynamic/epidemic-dynamic.service';
import * as format from 'dateformat';

import { PersonInfo } from '@/models/daily-troubleshooting/person-info';
import { getUuid32 } from '@gsafety/cad-gutil/dist/utilhelper';

import DailyTroubleshootingService from '@/api/daily-troubleshooting/daily-troubleshooting';
@Component({
  template: Html,
  style: Style,
  themes: [{ name: 'white', style: Style }],
  components: {}
})
export class TroubleshootingInfoForm extends Vue {

  troublePerson: PersonInfo = new PersonInfo();

  rules = {
    // code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    // identificationNumber: [{ required: true, message: '请输入身份证编号', trigger: 'change' }],
    // sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
    phone: [{ required: true, message: '请输入电话', trigger: 'change' }],
    address: [{ required: true, message: '请填写住址', trigger: 'change' }],
    // plot: [{ required: true, message: '请填写小区', trigger: 'change' }],
    // building: [{ required: true, message: '请填写楼栋', trigger: 'change' }],
    // unitNumber: [{ required: true, message: '请填写单元号', trigger: 'change' }],
    // roomNo: [{ required: true, message: '请填写房间号', trigger: 'change' }],
    bodyTemperature: [{ required: true, message: '请填写体温', trigger: 'change' }],
    // leaveArea: [{ required: true, message: '请选择是否过去14天是否离开过本地区', trigger: 'change' }],
    // confirmed_diagnosis: [{ required: true, message: '请填写确诊情况', trigger: 'change' }],
  };

  submitForm(formName: string) {
    console.log(11111112);
    const form: any = this.$refs[formName];
    form.validate((valid: any) => {
      if (valid) {
        // alert('submit!');
        console.log(this.troublePerson);
        this.troublePerson.createTime = format.default(new Date(), 'yyyy-mm-dd HH:mm:ss');
        this.troublePerson.id = getUuid32();
        DailyTroubleshootingService
          .addDailyTroubleshooting(this.troublePerson)
          .then(res => {
            if (res) {
              notifyUtil.success('添加填报记录成功');
              this.$emit('colse');
              this.resetForm('ruleForm');
              this.troublePerson = new PersonInfo();
            } else {
              notifyUtil.error('添加失败');
            }
          })
          .catch(err => {
            console.log(err);
            notifyUtil.error('添加失败');
          });
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  resetForm(formName: string) {
    const form: any = this.$refs[formName];
    form.resetFields();
  }
  colse() {
    this.$emit('colse');
  }
}
