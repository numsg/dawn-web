import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import resourceEditStyle from './resource-edit.module.scss';
import resourceEditHtml from './resource-edit.html';

import notifyUtil from '@/common/utils/notifyUtil';
import resourceManageService from '@/api/elements-information/resource-manage-service';

@Component({
  template: resourceEditHtml,
  style: resourceEditStyle,
  themes: [{ name: 'white', style: resourceEditStyle }],
  components: {}
})
export class ResourceEdit extends Vue {
  @Prop( { default: () => {} })
  private currentRes!: any;

  private resformEdit = {
    resId: '1111111111111111',
    resName: '口罩',
    resType: 'N95',
    resSpec: '1片',
    resCount: 200,
    resunit: '片',
    resUpdateTime: '2020.2.1'
  };

  resourceRules = {
    // resName: [
    //   { validator: this.validatePassName, trigger: 'blur' },
    // ],
    // resType: [
    //   { validator: this.validatePassType, trigger: 'blur' },
    // ],
    // resSpec: [
    //   { validator: this.validatePassSpec, trigger: 'blur' },
    // ],
    resCount: [
      { validator: this.validatePassResCount, trigger: 'blur' },
    ],
    // resunit: [
    //   { validator: this.validatePassResunit, trigger: 'blur' },
    // ],
  };

  private resTypes = [{
    value: 'KN95',
    label: 'KN95'
  }, {
    value: 'N90',
    label: 'N90'
  }];

  created() {
    console.log('ResourceEdit') ;
    this.resformEdit = this.currentRes;
  }
  colse() {
    this.$emit('colse');
  }
  resetForm() {
    const form: any = this.$refs.resform;
    form.resetFields();
  }
  submit() {
    if ( this.$refs.resform ) {
      (this.$refs.resform as any).validate(async (valid: any) => {
        if (valid) {
          const result = await resourceManageService.editResource(this.resformEdit);
          if ( result ) {
            notifyUtil.success('编辑资源成功');
            this.resetForm();
            this.$emit('addSuccess');
          } else {
            notifyUtil.error('编辑资源失败');
            console.log(result);
          }
          this.colse();
        }
      });
    }
  }


  validatePassName(rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('请输入资源名称'));
    } else {
      callback();
    }
  }
  validatePassType(rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('请填写资源类型'));
    } else {
      callback();
    }
  }
  validatePassSpec(rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('请填写资源规格'));
    } else {
      callback();
    }
  }
  validatePassResCount(rule: any, value: any, callback: any) {
    if (value <= 0) {
      callback(new Error('请填写资源数量'));
    } else if ( !this.isNumber(value) ) {
      callback(new Error('请输入数值'));
    } else {
      callback();
    }
  }
  validatePassResunit(rule: any, value: any, callback: any) {
    if (value === '') {
      callback(new Error('请填写资源单位'));
    } else {
      callback();
    }
  }
  isNumber(val: any) {
    const regPos = /^\d+(\.\d+)?$/; // 非负浮点数
    // const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val)) {
        return true;
    } else {
        return false;
    }
  }
}
