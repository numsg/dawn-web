import notifyUtil from '@/common/utils/notifyUtil';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import epidemicInfoFormStyle from './epidemic-info-form.module.scss';
import epidemicInfoFormHtml from './epidemic-info-form.html';
import EpidemicPerson from '@/models/home/epidemic-persion';
import epidemicDynamicService from '@/api/epidemic-dynamic/epidemic-dynamic.service';
import * as format from 'dateformat';
@Component({
  template: epidemicInfoFormHtml,
  style: epidemicInfoFormStyle,
  themes: [{ name: 'white', style: epidemicInfoFormStyle }],
  components: {}
})
export class EpidemicInfoFormComponent extends Vue {
  ruleForm = {
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: ''
  };

  curEpidemicPerson: EpidemicPerson = new EpidemicPerson();

  rules = {
    name: [
      { required: true, message: '请输入姓名', trigger: 'blur' }
      // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
    address: [{ required: true, message: '请输入地址', trigger: 'change' }],
    district: [{ required: true, message: '请输入行政区划', trigger: 'change' }],
    medicalCondition: [{ required: true, message: '请输入医疗情况', trigger: 'change' }],
    submitTime: [{ type: 'date', required: true, message: '请选择报送时间', trigger: 'change' }],
    diseaseTime: [{ type: 'date', required: true, message: '请选择发病时间', trigger: 'change' }]
  };

  submitForm(formName: string) {
    const form: any = this.$refs[formName];
    form.validate((valid: any) => {
      if (valid) {
        // alert('submit!');
        console.log(this.curEpidemicPerson);
        this.curEpidemicPerson.diseaseTime = format.default(this.curEpidemicPerson.diseaseTime, 'yyyy-mm-dd HH:mm:ss');
        this.curEpidemicPerson.submitTime = format.default(this.curEpidemicPerson.submitTime, 'yyyy-mm-dd HH:mm:ss');
        epidemicDynamicService
          .addEpidemicPerson(this.curEpidemicPerson)
          .then(res => {
            if (res) {
              notifyUtil.success('添加人员成功');
              this.$emit('save-person-success');
              this.resetForm('ruleForm');
              this.curEpidemicPerson = new EpidemicPerson();
            } else {
              notifyUtil.success('添加失败');
            }
          })
          .catch(err => {
            console.log(err);
            notifyUtil.success('添加失败');
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
}
