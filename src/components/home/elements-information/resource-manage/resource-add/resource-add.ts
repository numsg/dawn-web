import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import resourceAddStyle from './resource-add.module.scss';
import resourceAddHtml from './resource-add.html';

import notifyUtil from '@/common/utils/notifyUtil';

import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
import resourceManageService from '@/api/elements-information/resource-manage-service';
@Component({
  template: resourceAddHtml,
  style: resourceAddStyle,
  themes: [{ name: 'white', style: resourceAddStyle }],
  components: {
    'el-side-frame': SideFrameComponent,
  }
})
export class ResourceAdd extends Vue {
  private resform = {
    resId: '',
    resName: '',
    resType: '',
    resSpec: '',
    resCount: 0,
    resunit: '',
    resUpdateTime: ''
  };

  resourceRules = {
    resName: [
      { validator: this.validatePassName, trigger: 'blur' },
    ],
    resType: [
      { validator: this.validatePassType, trigger: 'blur' },
    ],
    resSpec: [
      { validator: this.validatePassSpec, trigger: 'blur' },
    ],
    resCount: [
      { validator: this.validatePassResCount, trigger: 'blur' },
    ],
    resunit: [
      { validator: this.validatePassResunit, trigger: 'blur' },
    ],
  };

  private resTypes = [{
    value: 'KN95',
    label: 'KN95'
  }, {
    value: 'N90',
    label: 'N90'
  }];

  resourceAdd() {
    const sideFrame: any = this.$refs['sideFrame'];
    if ( sideFrame ) {
      sideFrame.open();
    }
  }
  close() {
    const sideFrame: any = this.$refs['sideFrame'];
    if ( sideFrame ) {
      sideFrame.close();
    }
  }

  resetForm() {
    const form: any = this.$refs.resform;
    form.resetFields();
  }

  async submit() {
    if ( this.$refs.resform ) {
      (this.$refs.resform as any).validate(async (valid: any) => {
        if (valid) {
          const result = await resourceManageService.addResource(this.resform);
          if ( result ) {
            notifyUtil.success('添加资源成功');
            this.resetForm();
            this.$emit('addSuccess');
          } else {
            notifyUtil.error('添加资源失败');
            console.log(result);
          }
          this.close();
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
