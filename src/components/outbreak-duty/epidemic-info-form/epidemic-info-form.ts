import notifyUtil from '@/common/utils/notifyUtil';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import epidemicInfoFormStyle from './epidemic-info-form.module.scss';
import epidemicInfoFormHtml from './epidemic-info-form.html';
import EpidemicPerson from '@/models/home/epidemic-persion';
import epidemicDynamicService from '@/api/epidemic-dynamic/epidemic-dynamic.service';
import * as format from 'dateformat';
import { Getter } from 'vuex-class';
import SessionStorage from '@/utils/session-storage';
import moment from 'moment';
import { verifyArrayEmptyOrUndefined } from '@gsafety/whatever/dist/util';

@Component({
  template: epidemicInfoFormHtml,
  style: epidemicInfoFormStyle,
  themes: [{ name: 'white', style: epidemicInfoFormStyle }],
  components: {}
})
export class EpidemicInfoFormComponent extends Vue {
  @Prop()
  editEpidemicPerson!: EpidemicPerson;

  curEpidemicPerson: EpidemicPerson = new EpidemicPerson();

  // 本社区小区
  @Getter('baseData_communities')
  communities!: any[];
  // 就诊情况
  @Getter('baseData_medicalOpinions')
  diagnosisSituations!: any[];
  // 就医情况
  @Getter('baseData_medicalSituations')
  medicalSituations!: any[];
  // 特殊情况
  @Getter('baseData_specialSituations')
  specialSituations!: any[];
  // 性别
  @Getter('baseData_genderClassification')
  genderClassification!: any[];

  @Prop({
    default: false
  })
  readOnlyMode!: boolean;

  isEdit: boolean = false;
  rules = {
    // code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
    name: [{ required: true, message: '请输入姓名', trigger: ['blur', 'change'] }],
    age: [{ required: true }, { validator: this.validateAge, trigger: ['blur', 'change'] }],
    // 'personBase.identificationNumber': [{ required: true}, { validator: this.validateIdentificationNumber, trigger: ['blur', 'change'] }],
    'personBase.identificationNumber': [{ required: true, message: '请输入身份证号', trigger: ['blur', 'change'] }],
    gender: [{ required: true }, { validator: this.validateGender, trigger: 'blur, change' }],
    mobileNumber: [
      { required: true, message: '请输入联系方式', trigger: ['blur', 'change'] },
      { validator: this.validatePhone, trigger: ['blur', 'change'] }
    ],
    // submitTime: [{ type: 'date', required: true, message: '请选择报送时间', trigger: 'change' }],
    villageId: [{ required: true, message: '请选择小区', trigger: ['blur', 'change'] }],
    building: [{ required: true, message: '请填写楼栋', trigger: ['blur', 'change'] }],
    unitNumber: [{ required: true, message: '请填写单元号', trigger: ['blur', 'change'] }],
    roomNo: [{ required: true, message: '请填写房间号', trigger: ['blur', 'change'] }],
    // bodyTemperature: [{ required: true, message: '请填写体温', trigger: 'change' }],
    // leaveArea: [{ required: true, message: '请选择是否过去14天是否离开过本地区', trigger: 'change' }],
    // confirmed_diagnosis: [{ required: true, message: '请填写确诊情况', trigger: 'change' }],
    isExceedTemp: [{ required: true, message: '请选择发热情况', trigger: ['blur', 'change'] }],
    isContact: [{ required: true, message: '请选择发热情况', trigger: ['blur', 'change'] }]
  };
  isNew: boolean = false;

  validateIdentificationNumber(rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('请输入身份证账号'));
    } else if (!/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) {
      callback(new Error('身份证不符合规范'));
    } else {
      callback();
    }
  }

  validateGender(rule: any, value: any, callback: any) {
    if (value === '0') {
      callback(new Error('请选择性别'));
    } else {
      callback();
    }
  }

  validateAge(rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('请输入年龄'));
    } else if (!/^(?:[0-9][0-9]?|1[04][0-9]|150)$/.test(value)) {
      callback(new Error('年龄限制为0 - 150岁'));
    } else {
      callback();
    }
  }

  validatePhone(rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('请输入电话号码'));
    } else if (!/^([1]\d{10}|([\(（]?0[0-9]{2,3}[）\)]?[-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?)$/.test(value)) {
      callback(new Error('电话号码不符合规范'));
    } else {
      callback();
    }
  }

  submitForm(formName: string) {
    const form: any = this.$refs[formName];
    form.validate((valid: any) => {
      if (valid) {
        this.curEpidemicPerson.diseaseTime = moment(this.curEpidemicPerson.diseaseTime).format('YYYY-MM-DD HH:mm:ss');
        this.curEpidemicPerson.submitTime = moment(this.curEpidemicPerson.submitTime).format('YYYY-MM-DD HH:mm:ss');
        this.curEpidemicPerson.updateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        if (!this.isEdit) {
          this.curEpidemicPerson.multiTenancy = SessionStorage.get('district');
          epidemicDynamicService
            .addEpidemicPerson(this.curEpidemicPerson)
            .then(res => {
              if (res) {
                notifyUtil.success('添加人员成功');
                this.$emit('save-person-success');
                this.resetForm('ruleForm');
                this.curEpidemicPerson = new EpidemicPerson();
              } else {
                notifyUtil.error('添加失败');
              }
            })
            .catch(err => {
              console.log(err);
              notifyUtil.error('添加失败');
            });
        } else {
          epidemicDynamicService
            .editEpidemicPerson(this.curEpidemicPerson)
            .then(res => {
              if (res) {
                this.curEpidemicPerson = new EpidemicPerson();
                notifyUtil.success('修改成功');
                this.$emit('save-person-success', res);
                this.resetForm('ruleForm');
              } else {
                notifyUtil.error('修改失败');
              }
            })
            .catch(err => {
              console.log(err);
              notifyUtil.error('修改失败');
            });
        }
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
    this.$emit('cancel');
  }

  cancel() {
    this.$emit('cancel');
  }

  @Watch('editEpidemicPerson')
  onEidtPerson(val: EpidemicPerson) {
    if (val && val.id) {
      this.isEdit = true;
      this.curEpidemicPerson = JSON.parse(JSON.stringify(val));
      this.curEpidemicPerson.diseaseTime = new Date(this.curEpidemicPerson.diseaseTime);
      this.curEpidemicPerson.submitTime = new Date(this.curEpidemicPerson.submitTime);
    } else {
      this.curEpidemicPerson = new EpidemicPerson();
      this.isEdit = false;
      this.isNew = true;
      this.$emit('on-create-data', this.isNew);
    }
  }

  returnDicDataName(id: string, dicDataName: string) {
    let component: any = this;
    const dicDatas = component[dicDataName];
    let result: any = [];
    if (Array.isArray(dicDatas) && dicDatas.length > 0) {
      result = dicDatas.filter((d: any) => {
        return d.id === id;
      });
    }
    const name = result.length > 0 ? result[0].name : '未知';
    component = null;
    result = null;
    return name;
  }

  replaceTime(time: string) {
    if (time) {
      // return format.default(time, 'yyyy-mm-dd HH:mm:ss');
      return moment(time).format('YYYY-MM-DD HH:mm:ss');
    }
    return '';
  }
}
