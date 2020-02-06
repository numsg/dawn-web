import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import SystemConfig from '@/models/common/system-config-model';
import Html from './right-content.html';
import styles from './right-content.module.scss';

import systemConfigService from '@/api/system-config/system-config.service';
import dataSourceService from '@/api/data-source/data-source.service';
import ruleTypeService from '@/api/base-data-define/rule-type.service';

import eventNames from '@/common/events/store-events';
import i18n from '@/i18n';
import store from '@/store';
import rightBlackStyle from './right-content.black.module.scss';
import notifyUtil from '@/common/utils/notifyUtil';

@Component({
  template: Html,
  style: styles,
  themes: [{ name: 'white', style: styles }, { name: 'black', style: rightBlackStyle }],
  components: {}
})
export class RightContentComponent extends Vue {
  @Prop() data: any;
  @Prop() leftClickItemId: any;

  // 是否添加
  private isAdd: any = false;
  // 是否修改
  private isEdit: any = false;
  // 当前选择的配置项的id
  private currentItemId: any = '';

  // 正在添加配置项的父类id
  private currentParentId: any = '';
  // 缓存编辑之前的数据
  beforeEditData: SystemConfig = new SystemConfig();
  // 表单数据
  configOption: SystemConfig = new SystemConfig();

  // 数据源
  dataSources: Array<any> = [];

  // 规则类型
  ruleTypes: Array<any> = [];

  // 选择的数据Id
  selectDataId: any = '';

  // 权限
  @Prop() rolePrivilege: any;

  rules = {
    name: [
      { required: true, message: i18n.t('resource-manage.name_not_null'), tigger: 'blur' },
      { min: 1, max: 128, message: i18n.t('common.length_limit128'), tigger: ['blur', 'change'] },
      { required: true, validator: this.validateName, tigger: 'blur' }
    ],
    key: [
      { required: true, message: i18n.t('system-config.key_not_null'), tigger: 'blur' },
      { min: 1, max: 128, message: i18n.t('common.length_limit128'), tigger: ['blur', 'change'] },
      { required: true, validator: this.validateKey, tigger: 'blur' }
    ],
    value: [
      { required: true, message: i18n.t('system-config.value_not_null'), tigger: 'blur' },
      { min: 1, max: 128, message: i18n.t('common.length_limit128'), tigger: ['blur', 'change'] }
    ],

    description: [
      { required: true, message: i18n.t('system-config.description_not_null'), tigger: 'blur' },
      { min: 1, max: 2000, message: i18n.t('common.length_limit2000'), tigger: ['blur', 'change'] }
    ]
  };

  // 新增时验证名称是否重复
  async validateName(rule: any, value: any, callback: any) {
    const result = await systemConfigService.queryCountByName(value);
    if (result.count > 0) {
      callback(new Error(this.$tc('system-config.name_is_repeated')));
    }
  }

  async validateKey(rule: any, value: any, callback: any) {
    const result = await systemConfigService.queryCountByKey(value);
    if (result.count > 0) {
      callback(new Error(this.$tc('system-config.key_is_repeated')));
    }
  }

  @Watch('leftClickItemId')
  leftItemChanged() {
    this.currentItemId = this.leftClickItemId;
    const ele = document.getElementById(this.currentItemId) as HTMLElement;
    if (ele) {
      ele.scrollIntoView(true);
    }
  }

  mounted() {
    this.queryData();
  }

  async queryData() {
    this.dataSources = await dataSourceService.queryAllDataSources();
    this.ruleTypes = await ruleTypeService.queryAllRuleTypes();
  }

  // @Watch('selectDataId')
  /**
   * 没有表单，修改时
   *
   * @memberof RightContentComponent
   */
  getSelectIdWhenEdit(child: any) {
    child.value = this.selectDataId;
  }

  /**
   * 表单中添加
   * @memberof RightContentComponent
   */
  getSelectIdWhenAdd() {
    this.configOption.value = this.selectDataId;
  }

  onAdd(id: any) {
    this.selectDataId = '';
    this.currentParentId = id;
    this.queryData();
    this.isAdd = true;
  }
  /**
   * 保存添加的配置项
   * @param item 父类
   */
  async onSaveAdd(item: any) {
    const form: any = this.$refs['form'];
    form[0].validate(async (valid: any) => {
      if (valid) {
        this.configOption.pid = item.id;
        const result = await systemConfigService.addOneConfig(this.configOption);
        if (result) {
          item.children.push(result);
          this.onCancelAdd();
          this.currentItemId = result.id;
          this.$store.dispatch(eventNames.SystemConfig.addConfigs, systemConfigService.toConvertJsonStr(this.data));
          notifyUtil.success(this.$tc('resource-manage.add_success'));
          const router: any = this.$router.currentRoute;
          const user: any = sessionStorage.getItem('userInfo');
          this.$store.dispatch(eventNames.SystemLog.HandleDataAdd, {
            data: result,
            router: router,
            user: user,
            dataType: 'system-config'
          });
        } else {
          notifyUtil.success(this.$tc('resource-manage.add_fail'));
        }
      }
    });
  }

  /**
   * 取消添加
   */
  onCancelAdd() {
    this.currentParentId = '';
    this.configOption = new SystemConfig();
    this.isAdd = false;
  }

  /**
   * 修改配置项
   */
  onEdit(child: any) {
    this.beforeEditData.value = child.value;
    this.currentItemId = child.id;
    this.selectDataId = '';
    this.queryData();
    this.isEdit = true;
  }

  /**
   * 保存修改的配置项
   * @param child
   */
  async onSaveEdit(child: any) {
    const value = child.value.replace(/\s/g, '');
    if (!value) {
      // notifyUtil.error(this.$tc('system-config.value_not_null'));
      this.$message({ message: this.$tc('system-config.value_not_null'), type: 'warning', center: true });
      return;
    }
    const result = await systemConfigService.updateOneConfig(child);
    if (result) {
      this.currentItemId = '';
      this.isEdit = false;
      const router: any = this.$router.currentRoute;
      const user: any = sessionStorage.getItem('userInfo');
      this.$store.dispatch(eventNames.SystemLog.HandleDataEdit, {
        router: router,
        user: user,
        data: child,
        state: true,
        dataType: 'system-config'
      });
      this.$store.dispatch(eventNames.SystemConfig.addConfigs, systemConfigService.toConvertJsonStr(this.data));
      notifyUtil.success(this.$tc('base_data_manage.update_success'));
    } else {
      notifyUtil.error(this.$tc('base_data_manage.update_error'));
    }
  }

  /**
   * 取消修改
   */
  onCancleEdit(child: any) {
    child.value = this.beforeEditData.value;
    this.currentItemId = '';
    this.isEdit = false;
  }

  /**
   * 删除配置项
   * @param parent  配置项的父类
   * @param child  配置项
   */
  onDelete(parent: any, child: any) {
    this.$confirm(this.$tc('rule_library.confirm_delete'), this.$tc('common.prompt'), {
      confirmButtonText: this.$tc('common.determine'),
      cancelButtonText: this.$tc('common.cancel'),
      type: 'warning',
      title: this.$tc('common.prompt'),
      showClose: false
    })
      .then(async () => {
        this.confirmDelete(parent, child);
      })
      .catch(() => {
        return;
      });
  }

  /**
   * 确认删除
   * @param parent 配置项的父类
   * @param child 配置项
   */
  async confirmDelete(parent: any, child: any) {
    const result = await systemConfigService.deleteOneConfig(child.id);
    if (result) {
      parent.children.splice(parent.children.indexOf(child), 1);
      this.$store.dispatch(eventNames.SystemConfig.addConfigs, systemConfigService.toConvertJsonStr(this.data));
      const router: any = this.$router.currentRoute;
      const user: any = sessionStorage.getItem('userInfo');
      this.$store.dispatch(eventNames.SystemLog.HandleDataDelete, { router: router, user: user, data: child, dataType: 'system-config' });
      notifyUtil.success(this.$tc('common.delete_success'));
    } else {
      notifyUtil.error(this.$tc('common.delete_error'));
    }
  }

  onclickItem(child: any) {
    this.currentItemId = child.id;
    this.$emit('on-content-item', child.id);
  }

  // querySearchRuleType(queryString: any, cb: any) {
  //   const ruleTypes = this.ruleTypes;
  //   const results = queryString ? ruleTypes.filter(this.createFiler(queryString)) : ruleTypes;
  //   cb(results);
  // }

  // createFiler(queryString: any) {
  //   return (ruleType: any) => {
  //     return (ruleType.id.includes(queryString));
  //   };
  // }
}
