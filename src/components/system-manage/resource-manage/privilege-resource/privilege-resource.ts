import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from '@/components/system-manage/resource-manage/privilege-resource/privilege-resource.html';
import Styles from '@/components/system-manage/resource-manage/privilege-resource/privilege-resource.module.scss';
import menuBlackStyle from '@/components/system-manage/resource-manage/privilege-resource/privilege-resource.black.module.scss';
import Privilege from '@/models/resource-manage/privilege';
import privilegeManageService from '@/api/resource-manage/privilege-manage.service';
import { getUuid32 } from '@gsafety/cad-gutil/dist/utilhelper';
import PriRouter from '@/utils/pri-router';
import i18n from '@/i18n';
import notifyUtil from '@/common/utils/notifyUtil';
import { LOGACTION } from '@/common/enums/log';
import EventNames from '@/common/events/store-events';

@Component({
  name: 'privilege-resource',
  template: Html,
  style: Styles,
  themes: [{ name: 'white', style: Styles }, { name: 'black', style: menuBlackStyle }],
  components: {}
})
export class PrivilegeResourceComponent extends Vue {
  // 所有权限点集合
  privilegeList: Array<Privilege> = new Array<Privilege>();
  // 当前权限点
  currentPrivilege: Privilege = new Privilege();
  private _currentPrivilege: Privilege = new Privilege();
  // 弹出窗是否显示
  formVisible: boolean = false;
  // 没有子节点的权限点集合
  privilegeListWithoutNodes: Array<Privilege> = new Array<Privilege>();
  privilegeProps = {
    children: 'children',
    label: 'name'
  };
  // 搜索条件
  searchValue = '';
  // 是否修改权限点
  isUpdatePrivilege: boolean = false;
  // 添加or修改API资源
  handleApiRes: string = i18n.t('resource-manage.add_api_resource').toString();
  // 是否新增
  isNewRes: boolean = false;

  private get rolePrivilege(): any {
    return PriRouter.handleRole('resource-manage');
  }

  // 表单校验规则
  rules = {
    name: [
      // {required: true,  min: 1, max: 64, message: i18n.t('common.length_limit64'), tigger: 'blur' },
      { required: true, message: i18n.t('resource-manage.name_not_null'), trigger: 'blur' },
      { min: 1, max: 64, message: i18n.t('common.length_limit64'), trigger: ['blur', 'change'] }
    ],
    description: [{ min: 0, max: 4000, message: i18n.t('common.length_limit4000'), trigger: ['blur', 'change'] }],
    expression: [
      { required: true, message: '规则不能为空', trigger: 'blur' },
      { min: 1, max: 64, message: i18n.t('common.length_limit64'), trigger: ['blur', 'change'] }
    ]
  };

  /**
   * 移除表单校验结果
   * @memberof MenuResourceComponent
   */
  clearValidate() {
    const form: any = this.$refs.currentPrivilege;
    form.clearValidate();
  }

  async mounted() {
    await this.queryAllPrivilegeNodes();
  }

  /**
   * 添加权限点
   * @memberof PrivilegeManageComponent
   */
  addPrivilege() {
    this.currentPrivilege = new Privilege();
    this.formVisible = true;
    this.isUpdatePrivilege = false;
    this.handleApiRes = this.$tc('resource-manage.add_api_resource');
    this.isNewRes = !this.isNewRes;
    if (this.isNewRes) {
      const newPrivilege = new Privilege();
      newPrivilege.name = '';
      this.currentPrivilege = newPrivilege;
      this.privilegeList.push(newPrivilege);
      this.clearValidate();
      this.isNewRes = true;
    } else {
      notifyUtil.error(this.$tc('resource-manage.save_then_add'));
      this.isNewRes = false;
    }
  }

  /**
   * 保存权限点
   * @memberof PrivilegeManageComponent
   */
  async savePrivilege() {
    const form: any = this.$refs['currentPrivilege'];
    form.validate(async (valid: any, object: any) => {
      if (valid) {
        if (!this.currentPrivilege.code) {
          this.currentPrivilege.code = getUuid32();
        }
        // api 名称重复判别
        const isRepeat =
          this.privilegeList.findIndex(a => this.currentPrivilege.name === a.name && a.code !== this.currentPrivilege.code) >= 0;
        if (isRepeat) {
          notifyUtil.error(this.$tc('system-config.name_is_repeated'));
          return;
        }
        if (!this.isUpdatePrivilege) {
          this.isNewRes = false;
          const res: any = await privilegeManageService.addprivilege(this.currentPrivilege).catch(() => {
            notifyUtil.error(this.$tc('resource-manage.add_fail'));
            return;
          });
          if (res.error) {
            notifyUtil.error(this.$tc('resource-manage.add_fail'));
            return;
          }
          this.handleLog(LOGACTION.ADD);
          notifyUtil.success(this.$tc('resource-manage.add_success'));
        } else {
          const res: any = await privilegeManageService.updatePrivilege(this.currentPrivilege.id, this.currentPrivilege).catch(() => {
            notifyUtil.error(this.$tc('base_data_manage.update_error'));
            return;
          });
          if (res.error) {
            notifyUtil.error(this.$tc('base_data_manage.update_error'));
            return;
          }
          this.handleLog(LOGACTION.EDIT);
          notifyUtil.success(this.$tc('base_data_manage.update_success'));
        }
        await this.queryAllPrivilegeNodes();
        this.formVisible = false;
      } else {
        notifyUtil.success(this.$tc('resource-manage.validate_fail'));
      }
    });
  }

  private handleLog(action: any) {
    const router: any = this.$router.currentRoute;
    const user: any = sessionStorage.getItem('userInfo');
    if (action === LOGACTION.ADD) {
      this.$store.dispatch(EventNames.SystemLog.HandleDataAdd, {
        router: router,
        user: user,
        data: this.currentPrivilege,
        state: true,
        dataType: 'api_resource'
      });
    } else if (action === LOGACTION.EDIT) {
      this.$store.dispatch(EventNames.SystemLog.HandleDataEdit, {
        router: router,
        user: user,
        data: this.currentPrivilege,
        state: true,
        dataType: 'api_resource'
      });
    }
  }

  /**
   * 查询业务系统权限点
   * @memberof PrivilegeManageComponent
   */
  async queryAllPrivilegeNodes() {
    this.privilegeList = await privilegeManageService.queryAllPrivilegeNodes();
    this.currentPrivilege = this.privilegeList[0];
  }

  /**
   * 查询业务系统根权限点（不包括子权限点）
   * @memberof PrivilegeManageComponent
   */
  async queryPrivilegeRootNodes() {
    this.privilegeListWithoutNodes = await privilegeManageService.queryPrivilegeRootNodes();
  }
  handleUpdateClick(privilege: Privilege) {
    if (this.isNewRes && this.currentPrivilege.createTime !== privilege.createTime) {
      this.$confirm(this.$tc('resource-manage.confirm_leave'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(() => {
          this.privilegeList.splice(this.privilegeList.length - 1, 1);
          this.isNewRes = false;
          this.handleApiRes = this.$tc('resource-manage.update_api_resource');
          this.queryAllPrivilegeNodes();
        })
        .catch(() => {
          return;
        });
    } else {
      this.currentPrivilege = JSON.parse(JSON.stringify(privilege));
      this._currentPrivilege = Object.assign({}, this.currentPrivilege);
      this.formVisible = true;
      this.isUpdatePrivilege = true;
      this.handleApiRes = this.$tc('resource-manage.update_api_resource');
      this.clearValidate();
    }
  }

  handledeleteClick(privilege: Privilege, e: any) {
    if (this.isNewRes) {
      this.$confirm(this.$tc('resource-manage.confirm_delete_new'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      }).then(() => {
        this.privilegeList.splice(this.privilegeList.length - 1, 1);
        this.currentPrivilege = Object.assign({}, this._currentPrivilege);
        this.isNewRes = false;
      });
    } else {
      e.stopPropagation();
      this.$confirm(this.$tc('resource-manage.confirm_delete_api'), this.$tc('common.prompt'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(async () => {
          const res = await privilegeManageService.deletePrivilegeById(privilege.id).catch(() => {
            notifyUtil.error(this.$tc('common.delete_error'));
            return;
          });
          if (res) {
            const router: any = this.$router.currentRoute;
            const user: any = sessionStorage.getItem('userInfo');
            this.$store.dispatch(EventNames.SystemLog.HandleDataDelete, {
              router: router,
              user: user,
              data: privilege,
              dataType: 'api_resource'
            });

            notifyUtil.success(this.$tc('common.delete_success'));
            await this.queryAllPrivilegeNodes();
            this.formVisible = false;
            this.currentPrivilege = new Privilege();
          } else {
            notifyUtil.error(this.$tc('common.delete_error'));
          }
        })
        .catch(() => {
          notifyUtil.info(this.$tc('resource-manage.cancel_delete'));
        });
    }
  }

  /**
   * 取消保存
   * @memberof PrivilegeResourceComponent
   */
  cancelSubmit() {
    if (this.isNewRes) {
      this.formVisible = false;
      this.isNewRes = false;
      this.currentPrivilege = Object.assign({}, this._currentPrivilege);
      this.privilegeList.splice(this.privilegeList.length - 1, 1);
      this.clearValidate();
    } else {
      this.formVisible = false;
      this.currentPrivilege = Object.assign({}, this._currentPrivilege);
      this.clearValidate();
    }
  }

  @Watch('searchValue')
  searchPrivilegeByName() {
    if (this.searchValue) {
      this.privilegeList = this.privilegeList.filter(e => e.name.includes(String(this.searchValue)));
    } else {
      this.queryAllPrivilegeNodes();
    }
  }
}
