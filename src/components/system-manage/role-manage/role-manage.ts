import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { getUuid32 } from '@gsafety/cad-gutil/dist/utilhelper';

import Html from './role-manage.html';
import styles from './role-manage.module.scss';
import Role from '../../../models/role-manage/role';

import roleManageService from '@/api/role-manage/role-manage.service';
import { ResourceCardComponent } from '../role-resource-manage/resource-card/resource-card';
import { MenuEditComponent } from '../role-resource-manage/resource-card-edit/menu-edit';
import { ResourceCardEditComponent } from '../role-resource-manage/resource-card-edit/resource-card-edit';
import PriRouter from '@/utils/pri-router';
import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
import { sleep } from '@/common/utils/utils';
import eventNames from '@/common/events/store-events';
import userService from '@/api/user-manage/user-manage.service';
import i18n from '@/i18n';
import roleBlackStyle from './role-manage.black.module.scss';
import notifyUtil from '@/common/utils/notifyUtil';
import { Url } from '@/common/enums/url';

@Component({
  template: Html,
  style: styles,
  themes: [{ name: 'white', style: styles }, { name: 'black', style: roleBlackStyle }],
  components: {
    'el-resource-card': ResourceCardComponent,
    'el-menu-edit': MenuEditComponent,
    'resource-card-edit': ResourceCardEditComponent,
    'el-side-frame': SideFrameComponent
  },
  beforeRouteLeave(to: any, from: any, next: any) {
    const el: any = this;
    el.toRouter = to;
    if (el.isNewRole || el.showCanSave) {
      el.routerLeaveDialogVisible = true;
    } else {
      next();
    }
  }
})
export class RoleManageComponent extends Vue {
  /**
   *
   * 用户列表
   * @type {Array<Role>}
   * @memberof RoleManageComponent
   */
  roleList: Array<Role> = [];

  routerLeaveDialogVisible: boolean = false;
  toRouter: any;

  /**
   *
   * 角色搜索关键字
   * @type {*}
   * @memberof RoleManageComponent
   */
  roleSearchKey: any = '';

  /**
   * 当前用户信息
   *
   * @type {Role}
   * @memberof RoleManageComponent
   */
  currentRole: Role = new Role();

  resourceCount: number = 0;

  /**
   * 编辑之前的用户对象
   *
   * @type {Role}
   * @memberof RoleManageComponent
   */
  _beforeEditModel: Role = new Role();

  _tempRole: any = null;

  _isEdit: boolean = false;
  _isAdd: boolean = false;
  isNewRole: boolean = false;

  /**
   * 用以提交的权限id
   *
   * @private
   * @type {Array<string>}
   * @memberof RoleManageComponent
   */
  private _privilegeIdList: Array<string> = [];

  activeReleaseName: string = 'authorityResource';
  public showConRes: boolean = true;
  public showCanSave: boolean = false;

  public selChanged: boolean = false;
  // public addRoleCount: number = 0;

  public menuItem: any[] = [];

  rolePriNull: any = require('@/assets/img/role-privilege-null.png');

  /**
   * 当前角色所有menuList id集合
   *
   * @type {Array<string>}
   * @memberof RoleManageComponent
   */
  public menuIdList: Array<string> = [];

  /**
   * 是否加载完毕
   *
   * @type {Boolean}
   * @memberof RoleManageComponent
   */
  public completeLoad: boolean = false;

  /**
   * 显示滚动加载中
   *
   * @type {Boolean}
   * @memberof RoleManageComponent
   */
  public loadding: boolean = false;

  /**
   * 当前请求页
   *
   * @type {Number}
   * @memberof RoleManageComponent
   */
  public page: number = 0;
  private _pageCount: number = 4;

  /**
   * 切换角色显示loading
   *
   * @type {Boolean}
   * @memberof RoleManageComponent
   */
  public showLoading: boolean = false;

  sideCardEditVisible: boolean = false;

  menuEditVisible: boolean = false;

  // 搜索结果是否为空
  isSearchNull: boolean = false;

  loginUser: any;
  router: any;

  /**
   * 当前角色的所有menu 集合
   *
   * @type {Array<any>}
   * @memberof RoleManageComponent
   */
  // public roleMenus: Array<any> = [];
  validateRole: any = {
    name: [
      { min: 1, max: 64, message: i18n.t('common.length_limit128'), trigger: ['blur', 'change'] },
      { required: true, message: i18n.t('role-manage.role_name_not_null'), trigger: 'blur' }
    ],
    description: [{ min: 1, max: 2000, message: i18n.t('common.length_limit4000'), trigger: ['blur', 'change'] }]
  };

  private get rolePrivilege(): any {
    return PriRouter.handleRole('role-manage');
  }

  private get roleListIsNull(): any {
    if (this.roleList.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  async onSideFrameClose() {
    await sleep(600);
    this.sideCardEditVisible = false;
  }

  async onMenuEditClose() {
    await sleep(600);
    this.menuEditVisible = false;
  }

  created() {
    this.getRoleList();
  }

  @Watch('roleSearchKey')
  async searchRoleName() {
    if (this.roleSearchKey) {
      const keyword = this.roleSearchKey.replace(/\s*/g, '');
      const data = await roleManageService.getRoleList();
      this.roleList = data.filter((role: any) => role.name.includes(keyword) && role.name !== 'SuperManager');
    } else {
      const data = await roleManageService.getRoleList();
      if (Array.isArray(data) && data.length > 0) {
        this.roleList = data.filter((e: any) => e.name !== 'SuperManager');
        await this.usersAssRoles();
      }
    }
  }

  @Watch('currentRole', { deep: true })
  handleCanSave() {
    const changed = this.isCurrentRoleChange(this.currentRole, this._beforeEditModel);
    if (!changed && !this._isAdd) {
      this.showCanSave = false;
    } else {
      this.showCanSave = true;
    }
  }

  @Watch('roleList')
  onUserList() {
    if (this.roleList.length === 0) {
      this.isSearchNull = true;
    } else {
      this.isSearchNull = false;
    }
  }

  mounted() {
    this.router = this.$router.currentRoute;
    this.loginUser = sessionStorage.getItem('userInfo');
  }

  /**
   * 查询role list,默认展示roleList的第一个
   *
   * @memberof RoleManageComponent
   */
  async getRoleList() {
    let data = await roleManageService.getRoleList();
    data = data.filter((e: any) => e.name !== 'SuperManager');
    this.sortRoleByName(data);
    this.roleList = data;
    if (Array.isArray(data) && data.length > 0 && this._tempRole === undefined) {
      this._isAdd = false;
      await this.usersAssRoles();
      this.currentRole = data[0];
      this._beforeEditModel = Object.assign({}, data[0]);
      return;
    } else {
      this._isAdd = false;
      await this.usersAssRoles();
      this.currentRole = Object.assign({}, this._tempRole);
      this._beforeEditModel = Object.assign({}, this._tempRole);
    }
  }

  // 角色根据名称排序
  sortRoleByName(data: any) {
    if (Array.isArray(data) && data.length > 0) {
      data.sort((a: any, b: any) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });
    }
  }

  // 点击添加角色
  onAddRole() {
    this._isAdd = !this._isAdd;
    if (this._isAdd) {
      this.showCanSave = true;
      this.currentRole = new Role();
      this.resourceCount = 0;
      this.roleList.push(this.currentRole);
    } else {
      this.showCanSave = true;
      // LimitMessage.showMessage({ message: this.$tc('role-manage.save_then_new'), type: 'error' });
      notifyUtil.error(this.$tc('role-manage.save_then_new'));
      this._isAdd = true;
      this._beforeEditModel = this.currentRole;
      this.currentRole = Object.assign({}, this._beforeEditModel);
    }
  }

  // 点击角色列表
  async onRoleClick(role: any) {
    if (this._isAdd && this.currentRole.name === role.name) {
      return;
    } else if (this._isAdd && this.currentRole.name !== role.name) {
      this.$confirm(this.$tc('role-manage.save_then_leave'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(() => {
          this.roleList.splice(this.roleList.length - 1, 1);
          this._isAdd = false;
          this.showCanSave = false;
          this.getRoleList();
        })
        .catch(() => {
          return;
        });
    } else {
      const changed = this.isCurrentRoleChange(this.currentRole, this._beforeEditModel);
      if (changed && role.id !== this._beforeEditModel.id && this.currentRole.name !== role.name) {
        this.$confirm(this.$tc('role-manage.edit_then_leave'), {
          confirmButtonText: this.$tc('common.determine'),
          cancelButtonText: this.$tc('common.cancel'),
          type: 'warning',
          title: this.$tc('common.prompt'),
          showClose: false
        })
          .then(() => {
            this._beforeEditModel = new Role();
            this.changeRole(role);
          })
          .catch(() => {
            return;
          });
      } else if (changed && role.id === this._beforeEditModel.id) {
        return;
      } else {
        this.showLoading = true;
        this.$store.dispatch(eventNames.layout.SetLoading, true);
        this.currentRole = Object.assign({}, role);
        this._beforeEditModel = Object.assign({}, this.currentRole);
      }
    }
  }

  /**
   * 切换角色
   *
   * @private
   * @param {*} role 角色model
   * @memberof RoleManageComponent
   */
  private changeRole(role: any) {
    const form: any = this.$refs['currentRole'];
    form.clearValidate();
    this.currentRole = Object.assign({}, role);
    this._beforeEditModel = Object.assign({}, role);
  }

  /**
   * 点击删除角色
   *
   * @param {*} role 角色model
   * @memberof RoleManageComponent
   */
  onRoleDelete(role: any, e: any) {
    if (this._isAdd) {
      this.$confirm(this.$tc('user-manage.add_role_not_save'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(() => {
          this.roleList.splice(this.roleList.length - 1, 1);
          this._tempRole = undefined;
          this._isAdd = false;
          this.getRoleList();
        })
        .catch(() => {
          return;
        });
    } else {
      e.stopPropagation();
      const changed = this.isCurrentRoleChange(this.currentRole, this._beforeEditModel);
      if (!this.currentRole.code || changed) {
        // LimitMessage.showMessage({ message: this.$tc('role-manage.edit_no_save'), type: 'success' });
        notifyUtil.success(this.$tc('role-manage.edit_no_save'));
      } else {
        this.$confirm(this.$tc('role-manage.confirm_delete_role'), {
          confirmButtonText: this.$tc('common.determine'),
          cancelButtonText: this.$tc('common.cancel'),
          type: 'warning',
          title: this.$tc('common.prompt'),
          showClose: false
        })
          .then(() => {
            roleManageService.deleteRole(role.code).then(deleteInfo => {
              this._tempRole = undefined;
              this.$store.dispatch(eventNames.SystemLog.HandleDataDelete, {
                router: this.router,
                user: this.loginUser,
                data: role,
                dataType: 'role'
              });
              this.getRoleList();
              const form: any = this.$refs['currentRole'];
              form.clearValidate();
            });
            // LimitMessage.showMessage({ message: this.$tc('common.delete_success'), type: 'success' });
            notifyUtil.success(this.$tc('common.delete_success'));
          })
          .catch(() => {
            // LimitMessage.showMessage({
            //   type: 'info',
            //   message: this.$tc('user-manage.cancel_delete'),
            //   duration: 3000
            // });
            notifyUtil.info(this.$tc('user-manage.cancel_delete'));
          });
      }
    }
  }

  // 取消修改
  cancelEdit() {
    const form: any = this.$refs['currentRole'];
    form.clearValidate();
    this.currentRole = Object.assign({}, this._beforeEditModel);
    if (this._isAdd) {
      this.roleList.splice(this.roleList.length - 1, 1);
      this._isAdd = false;
    }
  }

  /**
   * 重置界面数据,并且不可编辑
   *
   * @private
   * @memberof RoleManageComponent
   */
  private clearData() {
    this._isAdd = false;
    // this._beforeEditModel = this.currentRole;
    this._isEdit = false;
    this.getRoleList();
  }

  // 判断当前角色model信息是否变化
  private isCurrentRoleChange(beforeRole: any, afterRole: any) {
    let change = false;
    if (beforeRole.name !== afterRole.name || beforeRole.description !== afterRole.description) {
      change = true;
    }
    return change;
  }

  onMenuChanged(data: any) {
    this.menuIdList = data.idData;
    this.showConRes = this.resourceCount > 0;
  }

  // 编辑某项功能权限(menu)
  async handMenuItemEdit(item: any) {
    if (this.showCanSave) {
      notifyUtil.warning(this.$tc('role-manage.save_cur_edit'));
      return;
    }
    this.menuEditVisible = true;
    await sleep(100);
    this.menuItem = [item];
    const sideFrameMenuEdit: any = this.$refs['sideFrameMenuEdit'];
    sideFrameMenuEdit.open();
  }

  onMenuEditOpen() {
    this.menuItem = JSON.parse(JSON.stringify(this.menuItem));
  }

  async onSave() {
    const form: any = this.$refs['currentRole'];
    const changeed = this.isCurrentRoleChange(this._beforeEditModel, this.currentRole);
    if (!changeed && !this._isAdd) {
      // LimitMessage.showMessage({ message: this.$tc('role-manage.role_no_change'), type: 'warning' });
      notifyUtil.warning(this.$tc('role-manage.role_no_change'));
      return;
    }
    const _this = this;
    form.validate(async (valid: any, data: any) => {
      if (valid) {
        let isHas = false;
        const roleList = await roleManageService.getRoleList();
        this.usersAssRoles();
        roleList.forEach((user: any) => {
          if (user.name === this.currentRole.name) {
            isHas = true;
          }
        });
        if (this._isAdd) {
          if (isHas) {
            // LimitMessage.showMessage({ type: 'warning', message: this.$tc('role-manage.role_name_aleady') });
            notifyUtil.warning(this.$tc('role-manage.role_name_aleady'));
          } else {
            _this.showLoading = true;
            _this.$store.dispatch(eventNames.layout.SetLoading, true);
            _this.$data.currentRole.code = getUuid32(36);
            const addInfo = await roleManageService.addRole(_this.currentRole);
            if (!addInfo) {
              // LimitMessage.showMessage({ message: this.$tc('role-manage.add_role_save_error'), type: 'error' });
              notifyUtil.error(this.$tc('role-manage.add_role_save_error'));
              return;
            }
            this._tempRole = this.currentRole;
            this.clearData();
            this.$store.dispatch(eventNames.SystemLog.HandleDataAdd, {
              router: this.router,
              user: this.loginUser,
              data: addInfo,
              state: 'system_log.state_success',
              dataType: 'role'
            });
            // LimitMessage.showMessage({ message: this.$tc('role-manage.add_role_success'), type: 'success' });
            notifyUtil.success(this.$tc('role-manage.add_role_success'));
          }
        } else {
          const editInfo = await roleManageService.modificationRoleDetail(this._beforeEditModel.code, this.currentRole);
          this.showLoading = true;
          this.$store.dispatch(eventNames.layout.SetLoading, true);
          if (!editInfo) {
            // LimitMessage.showMessage({ message: this.$tc('role-manage.edit_role_error'), type: 'error' });
            notifyUtil.error(this.$tc('role-manage.edit_role_error'));
            return;
          }
          this.$store.dispatch(eventNames.SystemLog.HandleDataEdit, {
            router: this.router,
            user: this.loginUser,
            data: this._beforeEditModel,
            dataType: 'role',
            state: 'system_log.state_success'
          });
          this._tempRole = this.currentRole;
          this.clearData();
          // LimitMessage.showMessage({ message: this.$tc('role-manage.edit_role_success'), type: 'success' });
          notifyUtil.success(this.$tc('role-manage.edit_role_success'));
        }
      }
    });
  }

  // 关联资源权限
  async onReleaseAuthority() {
    if (this.roleList.length < 1) {
      // LimitMessage.showMessage({ type: 'warning', message: this.$tc('role-manage.please_select_role') });
      notifyUtil.warning(this.$tc('role-manage.please_select_role'));
      return;
    }
    if (this._isAdd) {
      // LimitMessage.showMessage({ message: this.$tc('role-manage.save_then_new_role'), type: 'warning' });
      notifyUtil.warning(this.$tc('role-manage.save_then_new_role'));
    } else if (this.showCanSave) {
      notifyUtil.warning(this.$tc('role-manage.save_cur_edit'));
    } else {
      // const changed = this.isCurrentRoleChange(this.currentRole, this._beforeEditModel);
      // if (changed) {
      //   this.$confirm(this.$tc('role-manage.confirm_cancel_edit'), {
      //     confirmButtonText: this.$tc('common.determine'),
      //     cancelButtonText: this.$tc('common.cancel'),
      //     type: 'warning',
      //     title: this.$tc('common.prompt'),
      //     showClose: false
      //   })
      //     .then(async () => {
      //       this.currentRole = Object.assign({}, this._beforeEditModel);
      //     })
      //     .catch(() => {
      //       return;
      //     });
      // }
      this.sideCardEditVisible = true;
      await sleep(100);
      const sideFrame: any = this.$refs['sideFrameCardEdit'];
      sideFrame.open();
    }
  }

  // 添加menu list 成功, 界面menuList刷新, api资源刷新
  async onMenuListChange(add: boolean) {
    if (add) {
      const data = (await roleManageService.roleCodeQueryMenuNodes(String(this.currentRole.code), Url.ROLES)) + '/';
      if (Array.isArray(data)) {
        this.currentRole = Object.assign({}, this.currentRole);
        this._beforeEditModel = this.currentRole;
      }
      this.showCanSave = false;
      this._tempRole = this.currentRole;
      await this.getRoleList();
    }
  }

  async resourceCountChange(count: number) {
    this.resourceCount = count;
    await sleep(600);
    this.showLoading = false;
    this.$store.dispatch(eventNames.layout.SetLoading, false);
  }

  /**
   * 分页查询
   *
   * @memberof RoleManageComponent
   */
  async pageQuerUser() {
    const data = await roleManageService.pageQueryRoles({
      pageIndex: this.page,
      pageSize: this.$data._pageCount
    });
    this.roleList = this.roleList.concat(data.records);
    this.completeLoad = data.totalPages < Number(this.page) + 1;
    this.loadding = false;
  }

  /**
   *
   * 获取角色关联的用户
   * @memberof RoleManageComponent
   */
  async usersAssRoles() {
    const data = await userService.pageQueryUsers({
      pageIndex: 0,
      pageSize: 1000000
    });
    const userAllRoles: any = [];
    if (data && data.records) {
      const users = data.records;
      for (let i = 0; i < users.length; i++) {
        const res = await userService.queryUserInfoByUserName(users[i].userName).catch(e => {
          console.log(e);
        });
        if (res) {
          userAllRoles.push(...res.roles);
        }
      }
    }
    userAllRoles.forEach((element: any) => {
      let flag = true;
      this.roleList.forEach((e: any) => {
        if (flag && element.code === e.code) {
          e.disabled = true;
          e.prompt = this.$tc('role-manage.role_ass_user');
          flag = false;
        }
      });
    });
  }

  routeLeave() {
    this.isNewRole = false;
    this.showCanSave = false;
    this.routerLeaveDialogVisible = false;
    this.$router.push({ name: this.toRouter.name });
  }
}
