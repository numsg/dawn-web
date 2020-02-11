import notifyUtil from '@/common/utils/notifyUtil';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import Style from './troubleshooting-info-form.scss';
import Html from './troubleshooting-info-form.html';

import epidemicDynamicService from '@/api/epidemic-dynamic/epidemic-dynamic.service';
import * as format from 'dateformat';

import { PersonInfo } from '@/models/daily-troubleshooting/person-info';
import { getUuid32 } from '@gsafety/cad-gutil/dist/utilhelper';
import { Getter, State } from 'vuex-class';
import DailyTroubleshootingService from '@/api/daily-troubleshooting/daily-troubleshooting';


import dataFormat from '@/utils/data-format';
@Component({
  template: Html,
  style: Style,
  themes: [{ name: 'white', style: Style }],
  components: {}
})
export class TroubleshootingInfoForm extends Vue {
  @Getter('dailyTroubleshooting_formStatus')
  formStatus!: boolean;
  // 本社区小区
  @Getter('baseData_communities')
  communities!: any[];
  // 确诊情况
  @Getter('baseData_diagnosisSituations')
  diagnosisSituations!: any[];
  // 医疗情况
  @Getter('baseData_medicalSituations')
  medicalSituations!: any[];
  // 特殊情况
  @Getter('baseData_specialSituations')
  specialSituations!: any[];
  // 性别
  @Getter('baseData_genderClassification')
  genderClassification!: any[];
  // 其他症状
  @Getter('baseData_otherSymptoms')
  otherSymptoms!: any[];
  // 医疗意见
  @Getter('baseData_medicalOpinions')
  medicalOpinions!: any[];

  troublePerson: PersonInfo = new PersonInfo();

  @Prop({ default: false })
  isEdit!: boolean;

  @Prop({ default: () => null })
  currentPerson!: PersonInfo;

  otherSymptomsList: string[] = [];


  rules = {
    // code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    age: [{ validator: this.validateAge, trigger: 'blur' }],
    identificationNumber: [{ validator: this.validateIdentificationNumber, trigger: 'blur' }],
    sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
    phone: [{ validator: this.validatePhone, trigger: 'blur' }],
    address: [{ required: true, message: '请填写住址', trigger: 'change' }],
    plot: [{ required: true, message: '请选择小区', trigger: 'change' }],
    building: [{ required: true, message: '请填写楼栋', trigger: 'change' }],
    unitNumber: [{ required: true, message: '请填写单元号', trigger: 'change' }],
    roomNo: [{ required: true, message: '请填写房间号', trigger: 'change' }],
    // bodyTemperature: [{ required: true, message: '请填写体温', trigger: 'change' }],
    // leaveArea: [{ required: true, message: '请选择是否过去14天是否离开过本地区', trigger: 'change' }],
    // confirmed_diagnosis: [{ required: true, message: '请填写确诊情况', trigger: 'change' }],
    exceedTemp: [{ required: true, message: '请选择发热情况', trigger: 'change' }]
  };

  validateIdentificationNumber (rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('请输入身份证账号'));
    } else if (
      ! (/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value) )
    ) {
      callback(new Error('身份证不符合规范'));
    } else {
      callback();
    }
  }

  validateAge (rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('请输入年龄'));
    } else if (
      ! ( /^(?:[0-9][0-9]?|1[04][0-9]|150)$/.test(value) )
    ) {
      callback(new Error('年龄限制为0 - 150岁'));
    } else {
      callback();
    }
  }

  validatePhone (rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('请输入电话号码'));
    } else if (
      !( /^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/.test(value) )
    ) {
      callback(new Error('电话号码不符合规范'));
    } else {
      callback();
    }
  }



  @Watch('formStatus')
  watchFormStatus(value: boolean) {
    if ( !value ) {
      this.resetForm('ruleForm');
    }
    if (  !this.isEdit  && value && this.communities.length === 1) {
        this.troublePerson.plot = this.communities[0].id;
    }
  }

  @Watch('currentPerson', { deep: true })
  watchCurrentPerson(value: PersonInfo) {
    if (value) {
      this.troublePerson = JSON.parse(JSON.stringify(value));
      this.otherSymptomsList = this.troublePerson.otherSymptoms.split(',');
    }
  }

  created() {
    if (this.genderClassification.length > 0) {
      this.troublePerson.sex = this.genderClassification[0].id;
    }
  }

  mounted() {
    if (!this.troublePerson.medicalOpinion || this.troublePerson.medicalOpinion === '') {
      if ( this.medicalOpinions.length > 0 ) {
        this.troublePerson.medicalOpinion = this.medicalOpinions[0].id;
      }
    }
  }

  submitForm(formName: string) {
    const form: any = this.$refs[formName];
    form.validate((valid: any) => {
      if (valid) {
        this.troublePerson.id = getUuid32();
        this.troublePerson.otherSymptoms = this.otherSymptomsList.join(',');
        console.log(this.troublePerson, 'this.troublePerson');
        DailyTroubleshootingService.addDailyTroubleshooting(JSON.parse( JSON.stringify(this.troublePerson) ))
          .then(res => {
            if (res) {
              notifyUtil.success('添加填报记录成功');
              this.$emit('colse');
              this.$emit('success');
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
  // 编辑确定
  submitEditForm(formName: string) {
    const form: any = this.$refs[formName];
    form.validate((valid: any) => {
      if (valid) {
        const troublePerson = JSON.parse( JSON.stringify(this.troublePerson) );
        troublePerson.otherSymptoms = this.otherSymptomsList.join(',');
        troublePerson.createTime = dataFormat.formatTime(this.troublePerson.createTime);
        console.log(troublePerson, 'troublePerson');
        DailyTroubleshootingService.editDailyTroubleshooting(troublePerson)
          .then(res => {
            if ( res ) {
              notifyUtil.success('修改填报记录成功');
              this.$emit('colse');
              this.$emit('success');
              this.resetForm('ruleForm');
              this.troublePerson = new PersonInfo();
            } else {
              notifyUtil.error('修改失败');
            }
          })
          .catch(err => {
            console.log(err);
            notifyUtil.error('修改失败');
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

  cancel() {
    this.resetForm('ruleForm');
    this.colse();
  }
}
