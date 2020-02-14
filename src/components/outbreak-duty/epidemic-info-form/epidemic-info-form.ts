import notifyUtil from '@/common/utils/notifyUtil';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import epidemicInfoFormStyle from './epidemic-info-form.module.scss';
import epidemicInfoFormHtml from './epidemic-info-form.html';
import EpidemicPerson from '@/models/home/epidemic-persion';
import epidemicDynamicService from '@/api/epidemic-dynamic/epidemic-dynamic.service';
import * as format from 'dateformat';
import { Getter } from 'vuex-class';
import SessionStorage from '@/utils/session-storage';

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

  rules = {
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' }
      // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
    address: [{ required: true, message: '请输入地址', trigger: 'change' }],
    district: [{ required: true, message: '请输入行政区划', trigger: 'change' }],
    // medicalCondition: [{ required: true, message: '请输入医疗情况', trigger: 'change' }],
    submitTime: [{ type: 'date', required: true, message: '请选择报送时间', trigger: 'change' }]
    // diseaseTime: [{ type: 'date', required: true, message: '请选择发病时间', trigger: 'change' }]
  };

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

  isEdit: boolean = false;

  submitForm(formName: string) {
    const form: any = this.$refs[formName];
    form.validate((valid: any) => {
      if (valid) {
        this.curEpidemicPerson.diseaseTime = format.default(this.curEpidemicPerson.diseaseTime, 'yyyy-mm-dd HH:mm:ss');
        this.curEpidemicPerson.submitTime = format.default(this.curEpidemicPerson.submitTime, 'yyyy-mm-dd HH:mm:ss');
        this.curEpidemicPerson.updateTime = format.default(new Date, 'yyyy-mm-dd HH:mm:ss');
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
                notifyUtil.success('修改成功');
                this.$emit('save-person-success');
                this.resetForm('ruleForm');
                this.curEpidemicPerson = new EpidemicPerson();
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
    }
  }
}
