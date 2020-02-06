import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator';
import Html from './user-manage.html';
import Styles from './user-manage.module.scss';
import UserInfo from '@/models/user-manage/user-info';
import User from '@/models/user-manage/user';
import userManageService from '@/api/user-manage/user-manage.service';
import mapperManager from '@/common/odata/mapper-manager.service';
import Role from '@/models/role-manage/role';
import roleManageService from '@/api/role-manage/role-manage.service';
import { UserListComponent } from './user-list';
import { UserRoleComponent } from './user-role/user-role';
import { ResourceCardComponent } from '@/components/system-manage/role-resource-manage/resource-card/resource-card';
import { Getter } from 'vuex-class';
import PriRouter from '@/utils/pri-router';
import eventNames from '@/common/events/store-events';
import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
import SessionStorage from '@/utils/session-storage';
import Avatar from 'vue-avatar-component';
import i18n from '@/i18n';
import UserBlackStyle from './user-manage.black.module.scss';
import notifyUtil from '@/common/utils/notifyUtil';
import { InputType } from '@/common/enums/input-type';

@Component({
  template: Html,
  style: Styles,
  themes: [{ name: 'white', style: Styles }, { name: 'black', style: UserBlackStyle }],
  components: {
    'user-list': UserListComponent,
    'el-user-role': UserRoleComponent,
    'el-resource-card': ResourceCardComponent,
    'el-side-frame': SideFrameComponent,
    Avatar
  },
  beforeRouteLeave(to: any, from: any, next: any) {
    const el: any = this;
    el.toRouter = to;
    if (el.isNewUser || el.showCanSave) {
      el.routerLeaveDialogVisible = true;
    } else {
      next();
    }
  }
})
export class UserManageComponent extends Vue {
  // 当前用户信息
  currentUserInfo: UserInfo = new UserInfo();
  // 编辑之前的用户信息
  _beforeEditUserInfo: UserInfo = new UserInfo();
  // currentUser: User = new User();
  // 用户列表
  userList: Array<UserInfo> = new Array<UserInfo>();
  // 角色列表
  roleList: Array<Role> = new Array<Role>();
  // 用户头像
  imageUrl: string = '';
  // 搜索值
  searchValue: string = '';
  // 选中的用户
  selectedUser: UserInfo = new UserInfo();
  // 表单是否处于编辑状态
  isFormEdit: boolean = false;
  // 是否修改用户
  isEditUserInfo: boolean = false;
  // 是否是新增用户
  isNewUser: boolean = false;
  // 表格标题
  formTitle: string = i18n.t('user-manage.user_detail').toString();
  sysUserAvatar: any = require('@/assets/img/user.png');
  // 当前角色
  currentRole: any = null;
  routerLeaveDialogVisible: boolean = false;
  toRouter: any;

  // 显示详情或者添加角色
  public formVisible: boolean = true;

  // 控制取消保存按钮
  public showCanSave: boolean = false;

  // 控制保存按钮
  public showSave: boolean = true;

  // 显示角色详情
  resVisible: boolean = false;
  isCloseSideFrame: boolean = false;
  // 角色详情标题
  resTitle: string = '';

  // 切换用户显示loading
  showLoading: boolean = false;

  // 生日选择范围
  datepickerOptions = {};

  // 搜索结果是否为空
  isSearchNull: boolean = false;

  passwordType: string = 'password';
  loadCount: number = 0;
  loadCountStr: string = '';

  private get rolePrivilege(): any {
    return PriRouter.handleRole('user-manage');
  }

  private get userListIsNull(): any {
    if (this.userList.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  loginUser: any;
  router: any;

  /**
   * 当前页码
   *
   * @type {Number}
   * @memberof UserManageComponent
   */
  public page: number = 0;

  /**
   * pageCount
   *
   * @private
   * @type {Number}
   * @memberof UserManageComponent
   */
  private _pageCount: number = 10;

  public completeLoad: boolean = false;
  public loadding: boolean = false;

  public totalCount: number = 0;

  @Getter('privileges')
  rolePrivileges: any;

  // 表单校验规则
  rules = {
    userName: [
      { required: true, message: i18n.t('user-manage.user_name_not_null'), trigger: 'blur' },
      { min: 1, max: 64, message: i18n.t('common.length_limit64'), trigger: ['blur', 'change'] },
      { validator: this.valiadateUserName, trigger: ['blur', 'change'] }
    ],
    password: [{ min: 0, max: 64, message: i18n.t('common.length_limit64'), trigger: 'blur' }],
    name: [
      { required: true, message: i18n.t('user-manage.name_not_null'), trigger: 'blur' },
      { min: 1, max: 64, message: i18n.t('common.length_limit64'), trigger: ['blur', 'change'] }
      // { validator: this.validateName, trigger: 'blur' },
    ],
    phone: [
      { required: true, message: i18n.t('user-manage.tel_not_null'), trigger: 'blur' },
      { min: 1, max: 64, message: i18n.t('common.length_limit64'), trigger: ['blur', 'change'] },
      { validator: this.validatePhone, trigger: ['blur', 'change'] }
    ],
    email: [
      { required: true, message: i18n.t('user-manage.email_not_null'), trigger: 'blur' },
      { min: 1, max: 64, message: i18n.t('common.length_limit64'), trigger: ['blur', 'change'] },
      { validator: this.valiadateEmail, trigger: ['blur', 'change'] }
    ],
    address: [{ min: 0, max: 512, message: i18n.t('common.length_limit512'), trigger: ['blur', 'change'] }],
    description: [{ min: 0, max: 2000, message: i18n.t('common.length_limit4000'), trigger: ['blur', 'change'] }]
  };

  // 用户名验证
  async valiadateUserName(rule: any, value: any, callback: any) {
    const reg = /[^A-Za-z0-9._]/;
    if (!value) {
      return;
    }
    const regEndAndStart = /^[._]|[._]$/;
    if (regEndAndStart.test(value)) {
      callback(new Error(this.$tc('user-manage.input_format_error')));
    } else if (reg.test(value)) {
      callback(new Error(this.$tc('user-manage.input_format_error')));
    } else {
      callback();
    }
  }

  // 邮箱校验
  valiadateEmail(rule: any, value: any, callback: any) {
    const mailReg = /^([A-Za-z0-9_\-\.]){1,128}\@([A-Za-z0-9_\-.]){1,60}\.([A-Za-z]{2,4})$/;
    if (!value) {
      return;
    }
    if (!mailReg.test(value)) {
      callback(new Error(this.$tc('user-manage.email_format_error')));
    } else {
      callback();
    }
  }

  // 姓名验证
  validateName(rule: any, value: any, callback: any) {
    if (!value) {
      // callback(new Error(this.$tc('common.length_limit64')));
      return;
    }
    // else {
    //   callback();
    // }
  }

  // 电话号码验证

  validatePhone(rule: any, value: any, callback: any) {
    const phoneReg = /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
    const telReg = /^(\d{3,4}-)?\d{7,8}$/;
    if (!value) {
      // callback(new Error(this.$tc('user-manage.please_input_tel')));
      return;
    }
    if (!phoneReg.test(value) && !telReg.test(value)) {
      callback(new Error(this.$tc('user-manage.mobile_fixed')));
    } else {
      callback();
    }
  }

  mounted() {
    this.router = this.$router.currentRoute;
    this.loginUser = sessionStorage.getItem('userInfo');

    this.initData();
    this.queryRoleList();
    this.buildQuickTimezone();
  }

  routeLeave() {
    this.isNewUser = false;
    this.showCanSave = false;
    this.routerLeaveDialogVisible = false;
    this.$router.push({ name: this.toRouter.name });
  }

  private buildQuickTimezone() {
    this.datepickerOptions = {
      disabledDate(time: any) {
        return time.getTime() > Date.now() || time.getTime() < Date.now() - 3600 * 1000 * 24 * 365 * 100;
      }
    };
  }

  async initData() {
    this.page = 0;
    this.completeLoad = false;
    this.userList = [];
    await this.queryUsers();
    if (this.userList.length > 0) {
      this.selectedUser = this.userList[0];
      this.queryUserInfoByUserName(this.selectedUser.userName);
    }
  }

  @Watch('searchValue')
  async searchUserByuserName() {
    // if (this.searchValue) {
    //   this.userList = this.userList.filter(e => e.userName.includes(String(this.searchValue)));
    // } else {
    //   this.page = 0;
    //   this.completeLoad = false;
    //   this.userList = [];
    //   this.queryUsers();
    // }
    this.page = 0;
    this.userList = [];
    await this.queryUsers();
  }

  @Watch('userList')
  onUserList() {
    if (this.userList.length === 0) {
      this.isSearchNull = true;
      this.currentUserInfo = new UserInfo();
    } else {
      this.isSearchNull = false;
    }
    if (this.loadCount === this.totalCount) {
      this.loadCountStr = this.$tc('plan_manage.plan_list.load_summary', undefined, [this.totalCount]);
    } else {
      this.loadCountStr = this.$tc('plan_manage.plan_list.load_during', undefined, [this.loadCount, this.totalCount]);
    }
  }

  @Watch('currentUserInfo', { deep: true })
  handleCanSave() {
    const changed = this.isCurrentUserChange();
    if (changed) {
      this.selectedUser.userName = this.currentUserInfo.userName;
      this.showCanSave = true;
    } else {
      this.showCanSave = false;
    }
  }

  /**
   * 获取所有角色
   * @memberof UserManageComponent
   */
  async queryRoleList() {
    this.roleList = await roleManageService.getRoleList();
  }

  // 上传头像
  handleAvatarSuccess(event: any) {
    this.imageUrl = '';
    // 说明展示的是上传的
    const reader = new FileReader();
    reader.readAsDataURL(event.raw);
    reader.onload = (res: any) => {
      this.imageUrl = res.target.result;
    };
  }

  // 重置图像
  restImage(event: any) {
    const filesExgep: RegExp = /(jpg|png|jpeg)/;
    const name: any = event.file.name.split('.')[event.file.name.split('.').length - 1];
    const flag = filesExgep.test(name.toLowerCase());
    const isLt2M = event.file.size / 1024 / 1024 <= 0.1;
    if (!flag) {
      notifyUtil.error(this.$tc('user-manage.upload_image_format'));
      return;
    }
    if (!isLt2M) {
      notifyUtil.error(this.$tc('user-manage.upload_image_size_100'));
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.file);
    reader.onload = (res: any) => {
      const form: any = this.$refs['currentUserInfo'];
      const userTemp = Object.assign({}, this.currentUserInfo);
      form.validate(async (valid: any, object: any) => {
        this.currentUserInfo.image = res.target.result;
        this.selectedUser.image = res.target.result;
        if (valid) {
          this.clearValidate();
          userTemp.image = res.target.result;
          const user = new User();
          mapperManager.mapper(userTemp, user);
          await this.saveUserInfo();
        }
      });
    };
  }

  beforeAvatarUpload(file: any) {}

  /**
   * 添加用户
   */
  addUser() {
    this.isNewUser = !this.isNewUser;
    this.isFormEdit = true;
    this.isEditUserInfo = false;
    this.formTitle = this.$tc('user-manage.add_user');
    if (this.isNewUser) {
      this.clearValidate();
      this.imageUrl = '';
      this.selectedUser = new UserInfo();
      this.currentUserInfo = new UserInfo();
      this.userList.push(this.selectedUser);
    } else {
      notifyUtil.error(this.$tc('user-manage.save_then_add'));
      this.isNewUser = true;
      this._beforeEditUserInfo = this.currentUserInfo;
      this.currentUserInfo = JSON.parse(JSON.stringify(this._beforeEditUserInfo));
    }
  }

  /**
   * 保存用户信息
   * @memberof UserManageComponent
   */
  async saveUserInfo() {
    const form: any = this.$refs['currentUserInfo'];
    const userTemp = Object.assign({}, this.currentUserInfo);

    form.validate(async (valid: any, object: any) => {
      if (!valid) {
        return;
      }
      if (valid && !this.isFormEdit) {
        this.clearValidate();
        let user = new User();
        user = mapperManager.mapper(userTemp, user);
        this.$store.dispatch(eventNames.layout.SetLoading, true);
        const result = await userManageService.updateUserInfo(user).catch(e => {
          this.$store.dispatch(eventNames.layout.SetLoading, false);
          notifyUtil.error(this.$tc('user-manage.modify_user-fail'));
          throw e;
        });
        if (result) {
          this.addRolesForUser(user.userName); // 为用户配置系统角色
          this.isFormEdit = false;
          this.currentUserInfo = await this.queryUserInfoByUserName(user.userName);
          const beforeEditInfo: any = this.selectedUser;
          const afterEditInfo = JSON.parse(JSON.stringify(this.currentUserInfo));
          Object.keys(beforeEditInfo).forEach((key: string) => {
            if (beforeEditInfo[key] !== afterEditInfo[key]) {
              beforeEditInfo[key] = afterEditInfo[key];
            }
          });
          this.$store.dispatch(eventNames.SystemLog.HandleDataEdit, {
            router: this.router,
            user: this.loginUser,
            data: { name: user.userName },
            dataType: 'user_info',
            state: 'system_log.state_success'
          });
          notifyUtil.success(this.$tc('user-manage.modify_user_success'));
          this.selectedUser.image = result.image;
          this.userList.filter((e: any) => e.id === this.currentUserInfo.id)[0].image = result.image;
          this.curUserUpdate(this.currentUserInfo);
        } else {
          this.$store.dispatch(eventNames.layout.SetLoading, false);
          notifyUtil.error(this.$tc('user-manage.modify_user-fail'));
        }
      }
      if (valid && this.isFormEdit) {
        let user = new User();
        user = mapperManager.mapper(userTemp, user);
        let isHas = false;
        this.userList.forEach((user: any) => {
          if (user.userName === this.currentUserInfo.userName && user.id !== this.currentUserInfo.id) {
            isHas = true;
          }
        });
        if (isHas) {
          this.isFormEdit = true;
          notifyUtil.warning(this.$tc('user-manage.user_aleady'));
        } else {
          this.$store.dispatch(eventNames.layout.SetLoading, true);
          const result = await userManageService.addUserInfo(user).catch(e => {
            if (e.response.data.error === '501004') {
              notifyUtil.error(this.$tc('user-manage.user_aleady_ass'));
            } else {
              notifyUtil.error(this.$tc('user-manage.add_user_fail'));
            }
            this.$store.dispatch(eventNames.layout.SetLoading, false);
            throw e;
          }); // 新增用户信息
          if (result) {
            this.$store.dispatch(eventNames.SystemLog.HandleDataAdd, {
              router: this.router,
              user: this.loginUser,
              data: { name: result.userName },
              dataType: 'user_info'
            });
            this.addRolesForUser(result.userName); // 为用户配置系统角色
            this.isFormEdit = false;
            this.isNewUser = false;
            this.page = 0;
            this.completeLoad = false;
            this.userList = [];
            await this.queryUsers();
            this.selectedUser = this.userList.find(e => e.userName === result.userName) || new UserInfo();
            await this.queryUserInfoByUserName(this.selectedUser.userName);
            this.selectedUser.image = this.currentUserInfo.image;
            notifyUtil.success(this.$tc('user-manage.add_user_success'));
          } else {
            notifyUtil.error(this.$tc('user-manage.add_user_fail'));
          }
        }
      }
    });
  }

  // 当前用户修改信息
  curUserUpdate(userInfo: any) {
    const sessionUser = SessionStorage.get('userInfo');
    if (sessionUser.id === userInfo.id) {
      SessionStorage.set('userInfo', userInfo);
      this.$store.dispatch(eventNames.UserManage.OnCurChange, true);
    }
  }

  /**
   * 为用户配置业务系统角色
   * @param {String} userName 用户名
   * @param {any} roleCodes 用户code集合
   * @memberof UserManageComponent
   */
  async addRolesForUser(userName: string) {
    if (this.currentUserInfo.roles.length > 0) {
      // tslint:disable-next-line:prefer-const
      let roleCodes: string[] = [];
      this.currentUserInfo.roles.forEach(e => {
        roleCodes.push(e.code);
      });
      const userRole: any = await userManageService.addRolesForUser(userName, roleCodes);
      console.log('UpdataUserRole', this.currentUserInfo.roles, userRole);
      this.$store.dispatch('UpdataUserRole', {
        router: this.router,
        user: this.loginUser,
        data: this.currentRole
      });
    }
  }

  /**
   * 取消保存
   * @memberof UserManageComponent
   */
  cancelSubmit() {
    if (this.isNewUser) {
      this.userList.splice(this.userList.length - 1, 1);
      this.isNewUser = false;
      this.isFormEdit = false;
      this.initData();
      this.clearValidate();
    } else {
      this.clearValidate();
      this.isFormEdit = false;
      this.formVisible = true;
      this.showSave = true;
      if (!this.isEditUserInfo) {
        this.selectedUser = this.userList[0];
        this.queryUserInfoByUserName(this.selectedUser.userName);
      } else {
        this.isFormEdit = false;
        this.queryUserInfoByUserName(this.currentUserInfo.userName);
      }
    }
  }

  private clearValidate() {
    const form: any = this.$refs['currentUserInfo'];
    form.clearValidate();
  }

  /**
   * 查询用户列表
   * @memberof UserManageComponent
   */
  async queryUsers() {
    const data = await userManageService.pageQueryUsers({
      pageIndex: this.page,
      pageSize: this.$data._pageCount,
      userName: this.searchValue
    });
    if (data && data.records) {
      this.userList = this.userList.concat(data.records);
      // this.userList = this.userList.filter(e => e.userName !== 'super' && e.userName !== 'manager_pms');
      this.totalCount = data.totalElements;
    }
    this.loadCount = this.userList.length;
    this.loadding = false;
  }

  /**
   * 无限加载
   * @memberof UserManageComponent
   */
  infiniteLoad() {
    this.page = Number(this.page) + 1;
    this.queryUsers();
  }

  /**
   * 选择用户
   * @param {UserInfo} userinfo
   * @memberof UserManageComponent
   */
  async selectUser(userinfo: UserInfo, index: any) {
    this.clearValidate();
    if (this.isNewUser && this.currentUserInfo.name === userinfo.name) {
      return;
    } else if (this.isNewUser && this.currentUserInfo.name !== userinfo.name) {
      this.$confirm(this.$tc('user-manage.save_then_leave'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(() => {
          this.userList.splice(this.userList.length - 1, 1);
          this.isNewUser = false;
          this.isFormEdit = false;
          this.$store.dispatch(eventNames.layout.SetLoading, true);
          this.initData();
        })
        .catch(() => {
          return;
          // console.log(action);
        });
    } else {
      const result = await userManageService.queryUserInfoByUserName(this.selectedUser.userName).catch(e => {
        this.$store.dispatch(eventNames.layout.SetLoading, false);
        throw e;
      });
      if (result) {
        this._beforeEditUserInfo = JSON.parse(JSON.stringify(result)); // 编辑之前的用户信息
      }
      const changed = this.isCurrentUserChange();
      if (changed && !this.isNewUser) {
        this.$confirm(this.$tc('user-manage.edit_not_save'), {
          confirmButtonText: this.$tc('common.determine'),
          cancelButtonText: this.$tc('common.cancel'),
          type: 'warning',
          title: this.$tc('common.prompt'),
          showClose: false
        })
          .then(() => {
            this.isFormEdit = false;
            this.selectedUser = userinfo;
            this.currentUserInfo.roles.length = 0;
            this.$store.dispatch(eventNames.layout.SetLoading, true);
            this.queryUserInfoByUserName(this.selectedUser.userName);
          })
          .catch(() => {
            this.$store.dispatch(eventNames.layout.SetLoading, false);
            return;
          });
      } else {
        // this.currentUserInfo = JSON.parse(JSON.stringify(this._beforeEditUserInfo));
        // this.selectedUser = userinfo;
        this.selectedUser = Object.assign({}, userinfo);
        this.currentUserInfo.roles.length = 0;
        this.$store.dispatch(eventNames.layout.SetLoading, true);
        this.queryUserInfoByUserName(this.selectedUser.userName);
      }
    }
  }

  /**
   * 根据用户名查询用户信息
   * @param {String} username 用户名
   * @memberof UserManageComponent
   */
  async queryUserInfoByUserName(userName: string) {
    const result = await userManageService.queryUserInfoByUserName(userName).catch(e => {
      this.$store.dispatch(eventNames.layout.SetLoading, false);
      throw e;
    });
    if (result && !this.isNewUser) {
      // this.currentUserInfo = Object.assign(this.currentUserInfo, result);
      this.currentUserInfo = result;
      this._beforeEditUserInfo = JSON.parse(JSON.stringify(this.currentUserInfo));
      this.formTitle = this.$tc('user-manage.user_detail');
    }
    if (!result && !this.isNewUser) {
      this.currentUserInfo = new UserInfo();
    }
    this.$store.dispatch(eventNames.layout.SetLoading, false);
    return result;
  }

  /**
   * 编辑用户信息
   * @memberof UserManageComponent
   */
  editUserInfo() {
    this.isFormEdit = true;
    this.isEditUserInfo = true;
    this.imageUrl = 'data:image/png;base64,' + this.currentUserInfo.image;
    this.formTitle = this.$tc('user-manage.edit_user_detail');
  }

  /**
   * 删除用户
   * @memberof UserManageComponent
   */
  async deleteUser(userName: string) {
    if (this.isNewUser) {
      this.$confirm(this.$tc('user-manage.add_user_not_save'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(() => {
          this.clearValidate();
          this.userList.splice(this.userList.length - 1, 1);
          this.isNewUser = false;
          this.initData();
          this.showCanSave = false;
          this.isFormEdit = false;
        })
        .catch(() => {
          return;
        });
    } else {
      let message = '';
      if (userName === SessionStorage.get('userInfo').userName) {
        message = this.$tc('user-manage.delete_user_logining');
      } else {
        message = this.$tc('user-manage.delete_user_permanent');
      }
      this.$confirm(message.toString(), this.$tc('common.prompt'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(async () => {
          const res = await userManageService.deleteUser(userName);
          if (res) {
            // LimitMessage.showMessage({
            //   type: 'success',
            //   message: this.$tc('common.delete_success')
            // });
            notifyUtil.success(this.$tc('common.delete_success'));
            this.$store.dispatch(eventNames.SystemLog.HandleDataDelete, {
              router: this.router,
              user: this.loginUser,
              data: { name: userName },
              dataType: 'user'
            });
            if (userName === SessionStorage.get('userInfo').userName) {
              this.$router.push('/login');
              return;
            }
            this.initData();
          } else {
            // LimitMessage.showMessage({
            //   type: 'error',
            //   message: this.$tc('common.delete_error'),
            //   duration: 3000
            // });
            notifyUtil.error(this.$tc('common.delete_error'));
          }
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

  /**
   * 重置用户密码
   * @param {String} userName 用户名
   * @memberof UserManageComponent
   */
  resetPassword(userName: string) {
    if (this.isNewUser) {
      // LimitMessage.showMessage({ type: 'warning', message: this.$tc('user-manage.save_new_role'), duration: 3000 });
      notifyUtil.warning(this.$tc('user-manage.save_new_role'));
    } else {
      const res = userManageService.resetPassword(userName);
      if (res) {
        // LimitMessage.showMessage({
        //   type: 'success',
        //   message: this.$tc('user-manage.reset_pwd_success'),
        //   duration: 3000
        // });

        notifyUtil.success(this.$tc('user-manage.reset_pwd_success'));

        this.$store.dispatch('RevampPassword', {
          router: this.router,
          user: this.loginUser,
          data: { name: userName },
          isManager: true
        });
      } else {
        // LimitMessage.showMessage({
        //   type: 'error',
        //   message: this.$tc('user-manage.reset_ped_fail'),
        //   duration: 3000
        // });
        notifyUtil.error(this.$tc('user-manage.reset_ped_fail'));
      }
    }
  }

  // 当前用户是否发生变化
  private isCurrentUserChange() {
    if (this._beforeEditUserInfo === undefined) {
      return false;
    }
    let change = false;
    if (this.isFormEdit) {
      change = true;
    } else {
      const beforeEditInfo = JSON.parse(JSON.stringify(this._beforeEditUserInfo));
      const afterEditInfo = JSON.parse(JSON.stringify(this.currentUserInfo));
      Object.keys(beforeEditInfo).forEach((key: string) => {
        if (
          beforeEditInfo[key] !== afterEditInfo[key] &&
          key !== 'updateTime' &&
          key !== 'roles' &&
          key !== 'authority' &&
          key !== 'lastPwdUpdateTime'
        ) {
          change = true;
        }
      });
    }
    return change;
  }

  // 删除关联的角色
  async ondeleteRole(currentUserInfo: any, currentRole: any) {
    const tempArr: Array<string> = [];
    currentUserInfo.roles.forEach((role: any) => {
      if (role.code !== currentRole.code) {
        tempArr.push(role.code);
      }
    });
    const result = await userManageService.userRelaseRole([currentUserInfo.userName], tempArr);
    if (result === '') {
      this.$store.dispatch('UpdataUserRole', {
        router: this.router,
        user: this.loginUser,
        data: currentUserInfo.roles
      });
      notifyUtil.success(this.$tc('common.delete_success'));
    }
    this.currentUserInfo.roles = currentUserInfo.roles.filter((temp: any) => temp !== currentRole);
  }

  // 当前角色
  onCurrentRole(role: any) {
    this.currentRole = role;
    this.resTitle = role.name;
    this.resVisible = true;
    this.isCloseSideFrame = false;

    const sideFrame: any = this.$refs['sideFrame'];
    sideFrame.open();
  }

  // 添加角色
  onAddRole() {
    if (this.isNewUser) {
      // LimitMessage.showMessage({
      //   type: 'warning',
      //   message: this.$tc('user-manage.new_user_before_save'),
      //   duration: 3000
      // });
      notifyUtil.warning(this.$tc('user-manage.new_user_before_save'));
    } else {
      this.formVisible = false;
    }
  }

  //
  closeAddRole(event: any) {
    this.formVisible = true;

    this.queryUserInfoByUserName(this.selectedUser.userName);
  }

  // 关闭角色资源卡片
  colseSideFrame() {
    this.isCloseSideFrame = true;
    setTimeout(() => {
      this.resVisible = false;
    }, 3000);
  }

  // 控制取消保存
  handleCancelSave(event: any) {
    if (event) {
      this.showCanSave = true;
      this.showSave = false;
    } else {
      this.showCanSave = false;
    }
  }
  checkdPassword() {
    if (!this.isNewUser) {
      return;
    }
    if (this.passwordType === InputType.PASSWORD) {
      this.passwordType = InputType.TEXT;
    } else {
      this.passwordType = InputType.PASSWORD;
    }
  }
}
