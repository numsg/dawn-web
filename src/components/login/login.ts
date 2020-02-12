import { Vue, Component } from 'vue-property-decorator';
import loginHtml from './login.html';
import loginStyle from './login.module.scss';
import loginService from './login.service';
import roleManageService from '@/api/role-manage/role-manage.service';
import GenerateTree from '@/utils/generate-tree';
import LocalStorage from '@/utils/local-storage';
import { Getter } from 'vuex-class';
import store from '@/store/index';
import { Logger } from '@/utils/log';
import sessionStorage from '@/utils/session-storage';
import userManageService from '@/api/user-manage/user-manage.service';
import notifyUtil from '@/common/utils/notifyUtil';
import i18n from '@/i18n';
import { Skin } from '@/utils/skin';
import CommunityAssocitionService from '@/api/community-association/community-association-service.ts'
@Component({
  template: loginHtml, // require('./login.html'),
  style: loginStyle,
  components: {}
})
export class LoginComponent extends Vue {

  @Getter('routerarr') routerArr: any;

  // 系统设置
  @Getter('systemSetOptions')
  systemOptions!: any;

  // 登录
  loginFlag = false;

  // 账户的角色
  roles: Array<any> = [];

  // 当前选择的角色
  selectedRole: any = null;

  // 路由树
  routerTree: any = null;

  // 记住密码
  checked = false;

  // 角色权限
  rolesPris: any = [];

  // 角色配置
  roleConfig: any = [];

  // 记住密码
  rempwd: any = [];

  // 是否登陆成功
  isSuccessLogin: boolean = false;

  // 系统图标
  systemLogo: any = require('@/assets/img/rms-logo.png');

  // 日志
  public LoggerRes: Logger = new Logger();

  // 登陆异常
  loginErr: boolean = false;

  // 登陆错误
  loginError!: string;

  // 登陆异常
  loginFinal: boolean = false;

  // 提示输入名称
  suggestNames: any = [];

  form = {
    username: '',
    // username: 'manager_pms',
    // username: Cookies.get('username'),
    password: ''
    // password: this.loadPassword(),
    // password: Cookies.get('password')
  };
  rules = {
    username: [{ required: true, message: i18n.t('login.input_user_name'), trigger: 'blur' }],
    password: [{ required: true, message: i18n.t('login.input_user_pwd'), trigger: 'blur' }]
  };
  // 请求时的loading效果
  load_data = false;

  loadPassword() {
    return '123456';
  }

  public async handleLogin() {
    const lForm: any = this.$refs.loginForm;
    lForm.validate(async (valid: any) => {
      if (valid) {
        this.load_data = true;
        // this.loginJump();
        const username = this.form.username.trim();
        // 登陆验证
        await loginService
          .postLoginVali(username, this.form.password)
          .then((response: any) => {
            this.loginPms(response);
            this.loginFinal = true;
            return;
          })
          .catch((error: any) => {
            this.load_data = false;
            if (error.response.data.error === 'invalid_grant') {
              this.loginError = this.$tc('login.username_pwd_error');
              this.loginErr = true;
              this.loginFinal = true;
              return;
            }
            if (error.response.data.error === '501001') {
              this.loginError = this.$tc('login.username_pwd_error');
              this.loginErr = true;
              this.loginFinal = true;
              return;
            }
            if (error.response.data.error === '701001') {
              this.loginError = this.$tc('login.username_pwd_error');
              this.loginErr = true;
              this.loginFinal = true;
              return;
            }
            if (error.response.data.error !== 'invalid_grant' || error.response.data.error !== '501001') {
              this.loginError = this.$tc('login.service_exception');
              this.loginErr = true;
              this.loginFinal = true;
              return;
            }
          })
          .finally(() => {
            if (this.loginFinal) {
              return;
            }
            this.loginError = this.$tc('login.server_exception');
            this.loginErr = true;
            return;
          });
      }
    });
  }

  get language() {
    const lang = this.$i18n.locale;
    return lang;
  }

  // 登陆
  loginPms(data: any) {
    this.$store
      .dispatch('SetToken', data)
      .then(async (response: any) => {
        this.roles = await loginService.getUserRoleInfo('/user/roles');
        if (this.roles.length < 1) {
          notifyUtil.error(this.$tc('login.user_no_role'));
          this.loginFlag = false;
          this.load_data = false;
          return;
        }
        if (this.form.username === 'super' || this.form.username === 'manager_pms') {
          this.loginSuperAccount();
          return;
        }
        if (this.roles.length === 1) {
          this.loginOneRole();
          return;
        }
        if (this.roles.length > 1) {
          this.load_data = true;
          this.loginFlag = true;
        }
      })
      .catch((error: any) => {
        this.load_data = false;
      });
  }

  changePwd(isSave: any) {
    this.checked = isSave;
  }

  /**
   * 用户名和密码的数组，默认记住用户名
   * 1. 不是空，是否包含该用户，不包含则把该用户加入，包含则
   * 2.  把其它用户的isLast改为false，该用户设置为true
   *
   * @memberof LoginComponent
   */
  remPwd(curUser: any) {
    let userLoginMes: any = LocalStorage.get('rempwd');
    // 如果是空，则把该用户加入进去
    if (!userLoginMes) {
      userLoginMes = [];
      userLoginMes.push(curUser);
      LocalStorage.set('rempwd', userLoginMes, 7);
      return;
    }
    let isContain: any = false;
    // 当前登陆用户不存在，把当前用户加入
    if (userLoginMes.length > 0) {
      userLoginMes.forEach((e: any) => {
        if (e.username === curUser.username) {
          e.password = curUser.password;
          e.isChecked = curUser.isChecked;
          e.isLast = curUser.isLast;
          isContain = true;
          if (!curUser.isChecked) {
            e.password = '';
          }
        } else {
          e.isLast = false;
        }
      });
    }
    LocalStorage.set('rempwd', userLoginMes, 7);
    // 不包含
    if (!isContain) {
      userLoginMes.push(curUser);
      LocalStorage.set('rempwd', userLoginMes, 7);
    }
  }

  // 获取当前选择的角色 角色权限
  async selecteRole(role: any) {
    this.selectedRole = role;
    await roleManageService.loginRoleCodeQueryMenuNodes(this.selectedRole.code).then(result => {
      if (Array.isArray(result) && result.length > 0) {
        this.filterIsAss(result);
        sessionStorage.set('handleCom', JSON.parse(this.selectedRole.configuration.toString()));
        store.commit('SET_ROUTERARR', this.$router.options.routes);
      }
    });
  }

  /**
   * 选择角色确定后进行跳转
   */
  async getRolePrivileges() {
    if (this.selectedRole) {
      await roleManageService
        .loginRoleCodeQueryMenuNodes(this.selectedRole.code)
        .then(async result => {
          if (Array.isArray(result) && result.length > 0) {
            store.commit('SET_PRIVILEGES', result);
            await this.getUserInfo();
            // notifyUtil.success('登陆成功');
            this.loginJump();
          } else {
            notifyUtil.error(this.$tc('login.contact_manager_add_role'));
          }
        })
        .catch(error => {
          this.LoggerRes.error(error);
        });
    } else {
      notifyUtil.warning(this.$tc('login.select_role'));
    }
  }

  /**
   * 登陆的用户是超级管理员账户,直接使用SuperManager角色登陆
   * @param roleCode
   */
  loginSuperAccount() {
    let superRole: any = null;
    this.loginFlag = false;
    this.load_data = true;
    superRole = this.roles.filter((e: any) => e.name === 'SuperManager');
    roleManageService.loginRoleCodeQueryMenuNodes(superRole[0].code).then(async result => {
      if (Array.isArray(result) && result.length > 0) {
        // const privilegeChilds = GenerateTree.getChildren(result, []);
        // const unPriAss: any =  this.filterIsAss(privilegeChilds);
        // this.rolesPris = unPriAss;
        // sessionStorage.set('privilegeChilds', unPriAss);

        this.filterIsAss(result);
        await this.getRolePri(superRole[0].code);
        store.commit('SET_ROUTERARR', this.$router.options.routes);
        store.commit('SET_PRIVILEGES', result);
        await this.getUserInfo();
        // notifyUtil.success('登陆成功');
        this.loginJump();
        this.isSuccessLogin = true;
      }
    });
  }

  // 当前用户只有一个角色时,选择该角色进行登陆
  loginOneRole() {
    this.load_data = true;
    if (this.roles.length === 1) {
      roleManageService.loginRoleCodeQueryMenuNodes(this.roles[0].code).then(async result => {
        if (Array.isArray(result) && result.length > 0) {

          // const privilegeChilds = GenerateTree.getChildren(result, []);
          // const unPriAss: any =  this.filterIsAss(privilegeChilds);
          // this.rolesPris = unPriAss;
          // sessionStorage.set('privilegeChilds', unPriAss);

          this.filterIsAss(result);

          await this.getRolePri(this.roles[0].code);
          store.commit('SET_ROUTERARR', this.$router.options.routes);
          store.commit('SET_PRIVILEGES', result);
          await this.getUserInfo();
          this.loginJump();
        } else {
          notifyUtil.error(this.$tc('login.contact_manager_add_role'));
          this.loginFlag = true;
        }
      });
    }
  }

  // 过滤掉非直接关联的角色权限
  filterIsAss(result: Array<any>) {
    const privilegeChilds = GenerateTree.getChildren(result, []);
    if (Array.isArray(privilegeChilds) && privilegeChilds.length > 0) {
      this.rolesPris = privilegeChilds.filter((a: any) => a.directAssociate === 0);
    }
    sessionStorage.set('privilegeChilds', this.rolesPris);
  }




  // 登陆跳转
  loginJump() {
    const curUser: any = {
      username: this.form.username,
      password: btoa(this.form.password.toString()),
      // password: this.form.password,
      isChecked: this.checked,
      isLast: true
    };
    this.remPwd(curUser);
    this.$router.push({ path: '/daily-troubleshoot' });
    this.isSuccessLogin = true;
  }

  // 角色配置
  async getRolePri(roleCode: any) {
    const roleDetail = await roleManageService.codeReferRoleDetail(roleCode);
    store.commit('SET_USER_INFO', roleDetail);
    if (roleDetail.configuration) {
      sessionStorage.set('handleCom', JSON.parse(roleDetail.configuration.toString()));
    }
  }

  /**
   *  查询用户信息
   */
  async getUserInfo() {
    const userInfo = await userManageService.loginPersonalQueryUserInfo(this.form.username);
    if (userInfo.roles.length > 1) {
      userInfo.roles.forEach((e: any) => {
        if (e.id === this.selectedRole.id) {
          e.isCur = true;
        } else {
          e.isCur = false;
        }
      });
    }
    sessionStorage.set('userInfo', userInfo);
    const roles = userInfo.roles;
    if (roles && Array.isArray(roles) && roles.length > 0) {
      const result = await CommunityAssocitionService.getDistrictById(roles[0].id);
      if ( Array.isArray(result) && result.length > 0 ) {
        const codelist = result[0].administrativeCodes.split('/');
        const code = codelist[codelist.length - 1];
        sessionStorage.set('district', code);
      } else {
        sessionStorage.set('district', '');
      }
      console.log(result, '------relation----------');
    } else {
      sessionStorage.set('district', '');
    }
    store.commit('SET_USER_DETAIL', userInfo);
  }

  // 登陆账户密码验证
  loginVali(userInfo: any) {
    const username = userInfo.username.trim();
    loginService.postLoginVali(username, userInfo.password).catch((error: any) => {
      console.log(error.data);
    });
  }

  // 取消选择角色
  cancel() {
    this.loginFlag = false;
    this.load_data = false;
  }

  // 获取pid 集合
  getChildPid(data: any) {
    const pidList: any = [];
    data.forEach((item: any) => {
      if (item.parentId !== '') {
        pidList.push(item.parentId);
      }
    });
    return pidList;
  }

  // 最后登陆用户
  lastLogin() {
    const userList: any = LocalStorage.get('rempwd');
    if (!userList) {
      return;
    }
    if (Array.isArray(userList) && userList.length > 0) {
      userList.forEach((e: any) => {
        if (e.isLast) {
          this.form.username = e.username;
          if (e.isChecked) {
            this.form.password = atob(e.password);
            this.checked = e.isChecked;
            // this.form.password = e.password;
          }
        }
      });
    }
  }

  // 输入用户名后提示
  handleSelect(item: any) {
    if (this.form.username) {
      const userList: any = LocalStorage.get('rempwd');
      userList.forEach((e: any) => {
        if (e.username === this.form.username) {
          this.form.password = atob(e.password);
          this.checked = e.isChecked;
        }
      });
    }
  }

  // 搜索提示
  querySearch(queryString: any, cb: any) {
    // const suggestions = this.suggestNames;
    const results = queryString ? this.suggestNames.filter((e: any) => e.value.indexOf(queryString) !== -1) : this.suggestNames;
    cb(results);
  }

  createFilter(queryString: any) {
    return (suggestion: any) => {
      return suggestion.username.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
    };
  }

  // 已经登陆过的用户
  loadedUsers() {
    const loadedUsers: any = LocalStorage.get('rempwd');
    if (!loadedUsers) {
      return;
    }
    loadedUsers.forEach((e: any) => {
      this.suggestNames.push({ value: e.username });
    });
  }

  mounted() {
    this.lastLogin();
    this.loadedUsers();
    const theme = localStorage.getItem('system-theme');
    if (!theme) {
      localStorage.setItem('system-theme', 'white');
      Skin.changeTheme('white');
    } else {
      Skin.changeTheme(theme);
    }
  }
}
