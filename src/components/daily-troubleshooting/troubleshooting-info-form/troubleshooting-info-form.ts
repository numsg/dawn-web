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
import TroubleshootRecord from '@/models/daily-troubleshooting/trouble-shoot-record';
import SessionStorage from '@/utils/session-storage';

import moment from 'moment';
import PersonBase from '@/models/daily-troubleshooting/person-base';
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

  // troublePerson: PersonInfo = new PersonInfo();

  @Prop({ default: false })
  isEdit!: boolean;

  @Prop({ default: () => null })
  currentPerson!: PersonInfo;

  otherSymptomsList: string[] = [];

  troublePerson: TroubleshootRecord = new TroubleshootRecord();

  rules = {
    // code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
    'personBase.name': [{ required: true, message: '请输入姓名', trigger: ['blur', 'change'] }],
    age: [ { required: true}, { validator: this.validateAge, trigger: ['blur', 'change'] }],
    // 'personBase.identificationNumber': [{ required: true}, { validator: this.validateIdentificationNumber, trigger: ['blur', 'change'] }],
    'personBase.identificationNumber': [{ required: true, message: '请输入身份证号', trigger: ['blur', 'change']}],
    'personBase.sex': [{ required: true, message: '请选择性别', trigger: 'change' }],
    'personBase.phone': [{ required: true, message: '请输入联系方式', trigger: ['blur', 'change']}, { validator: this.validatePhone, trigger: ['blur', 'change'] }],
    // 'personBase.phone': [{ required: true, message: '请输入联系方式', trigger: ['blur', 'change']}],
    'personBase.address': [{ required: true, message: '请填写住址', trigger: ['blur', 'change'] }],
    plot: [{ required: true, message: '请选择小区', trigger: ['blur', 'change'] }],
    building: [{ required: true, message: '请填写楼栋', trigger: ['blur', 'change'] }],
    unitNumber: [{ required: true, message: '请填写单元号', trigger: ['blur', 'change'] }],
    roomNo: [{ required: true, message: '请填写房间号', trigger: ['blur', 'change'] }],
    // bodyTemperature: [{ required: true, message: '请填写体温', trigger: 'change' }],
    // leaveArea: [{ required: true, message: '请选择是否过去14天是否离开过本地区', trigger: 'change' }],
    // confirmed_diagnosis: [{ required: true, message: '请填写确诊情况', trigger: 'change' }],
    isExceedTemp: [{ required: true, message: '请选择发热情况', trigger: ['blur', 'change'] }],
    isContact: [{ required: true, message: '请选择发热情况', trigger: ['blur', 'change'] }]
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
      this.resetForm('recordForm');
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
      this.troublePerson.personBase.sex = this.genderClassification[0].id;
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
    form.validate(async (valid: any) => {
      if (valid) {
        const {name, phone} = this.troublePerson.personBase;
        const isDuplicate = await DailyTroubleshootingService.isUserDuplicate(name, phone);
        if (isDuplicate) {
          notifyUtil.error('用户已存在, 请检查名称和手机号');
          return;
        }
        this.troublePerson.id = getUuid32();
        this.troublePerson.otherSymptoms = this.otherSymptomsList.join(',');
        this.troublePerson.createTime = moment(this.troublePerson.createTime).format('YYYY-MM-DD HH:mm:ss');
        this.troublePerson.multiTenancy = SessionStorage.get('district');
        this.troublePerson.districtCode = SessionStorage.get('district-all');
        this.troublePerson.personBase.multiTenancy = SessionStorage.get('district');
        this.troublePerson.personBase.districtCode = SessionStorage.get('district-all');
        // DailyTroubleshootingService.addDailyTroubleshooting(JSON.parse( JSON.stringify(this.troublePerson) ))
        DailyTroubleshootingService.addTroubleshootingRecord(JSON.parse( JSON.stringify(this.troublePerson) ))
          .then(res => {
            if (res) {
              notifyUtil.success('添加填报记录成功');
              this.$emit('colse');
              this.$emit('success');
              this.resetForm('recordForm');
              // this.troublePerson = new PersonInfo();
              this.troublePerson = new TroubleshootRecord();
              this.troublePerson.personBase = new PersonBase();
              this.otherSymptomsList = [];
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
        this.$message.error('校验失败');
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
        troublePerson.createDate = dataFormat.formatTime(this.troublePerson.createDate);
        // DailyTroubleshootingService.editDailyTroubleshooting(troublePerson)
        DailyTroubleshootingService.updateTroubleshootingRecord(troublePerson)
          .then(res => {
            if ( res ) {
              notifyUtil.success('修改填报记录成功');
              this.$emit('colse');
              this.$emit('edit-success');
              this.resetForm('recordForm');
              // this.troublePerson = new PersonInfo();
              this.troublePerson = new TroubleshootRecord();
              this.troublePerson.personBase = new PersonBase();
              this.otherSymptomsList = [];
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
        this.$message.error('校验失败');
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
    this.colse();
  }
}
