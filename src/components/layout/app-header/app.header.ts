import { Vue, Component, Watch } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';

import appHeaderStyle from './app.header.module.scss';
import { NavbarComponent } from '../navbar/navbar';
import SessionStorage from '@/utils/session-storage';
import userService from '@/api/user-manage/user-manage.service';
import notifyUtil from '@/common/utils/notifyUtil';
import { Skin } from '@/utils/skin';
import store from '@/store';
import { SystemSetComponent } from '../system-set/system-set';
import Avatar from 'vue-avatar-component';
import headerStyle from './app.header.module.scss';
import headerBlackStyle from './app.header.black.module.scss';
import i18n from '@/i18n';
import Config from '@/utils/config-decorator';
import { asyncConfirm } from '@/common/utils/confirmUtil';
import eventNames from '@/common/events/store-events';
import moment from 'moment';
@Component({
  template: require('./app.header.html'),
  style: appHeaderStyle,
  themes: [{ name: 'white', style: headerStyle }, { name: 'black', style: headerBlackStyle }],
  components: {
    'nav-bar': NavbarComponent,
    'system-set': SystemSetComponent,
    Avatar
  }
})
export class AppHeaderComponent extends Vue {
  sysName: any = 'VUE-SEED';
  collapsed = false;
  isChangePassword: boolean = false;
  userInfo: any = {
    name: ''
  };

  changePwdForm = {
    userName: SessionStorage.get('userInfo').userName,
    oldPwd: '',
    newPwd1: '',
    newPwd2: ''
  };

  gapTime: any = 0;
  beforeUnloadTime: any = 0;

  currentLange: string = 'zh';

  changePwdRules = {
    oldPwd: [{ required: true, message: i18n.t('layout.input_primary_pwd'), trigger: 'blur' }],
    newPwd1: [{ required: true, min: 6, max: 18, message: i18n.t('layout.length_limit6_18'), trigger: 'blur' }],
    newPwd2: [{ required: true, min: 6, max: 18, message: i18n.t('layout.length_limit6_18'), trigger: 'blur' }]
  };

  // 是否是超级管理员
  get isSuperUser(): boolean {
    if (SessionStorage.get('Admin-Token') === store.getters.configs.superToken) {
      return true;
    }
    return false;
  }

  get language(): string {
    const lang = this.$i18n.locale;
    if (lang === 'zh') {
      return ' iconpms-icon_ch';
    } else {
      return ' iconpms-icon_en';
    }
  }

  public systemSetVisible: boolean = false;

  private skins: any[] = [{ name: 'white', label: i18n.t('layout.default_theme') }, { name: 'black', label: i18n.t('layout.thematic') }];

  private languages: any[] = [{ name: 'en', label: 'english' }, { name: 'zh', label: '中文' }, { name: 'es', label: 'espanñol' }];

  public messageCount: number = 0;

  private curRole: any = null;

  @Getter('menuStatus') menuStatus: any;
  @Action('MenuStatus') menuStatusAction: any;

  // 系统设置
  @Getter('systemSetOptions') systemSetOptions: any;

  @Getter('userManage_isCurUserUpdate') isCurUserUpdate: any;

  sysUserAvatar: any = require('@/assets/img/useravatar.png');
  systemLogo: any = require('@/assets/img/system-logo.png');

  oldTime!: number;
  timer: any;

  // @Config('globalConfig.timeOut')
  timeOut: number = 3000;


  @Watch('isCurUserUpdate')
  onCurUserUpdate() {
    if (this.isCurUserUpdate) {
      this.getuserInfo();
      this.$store.dispatch(eventNames.UserManage.OnCurChange, false);
    }
  }

  public collapse() {
    this.menuStatusAction();
  }

  created() {
    this.getuserInfo();
  }

  getuserInfo(): any {
    if (SessionStorage.get('userInfo')) {
      const roles: Array<any> = SessionStorage.get('userInfo').roles;
      if (roles.length === 1) {
        this.curRole = roles[0];
      } else {
        this.curRole = roles.filter((e: any) => e.isCur)[0];
      }
      this.userInfo = SessionStorage.get('userInfo');
    }
  }

  public logout() {
    const _this = this;
    this.$confirm(this.$tc('user_setting.confirm_exit'), this.$tc('common.prompt'), {
      confirmButtonText: this.$tc('common.determine'),
      cancelButtonText: this.$tc('common.cancel'),
      type: 'warning',
      title: this.$tc('common.prompt'),
      showClose: false
    })
      .then(() => {
        const userName = SessionStorage.get('userInfo').userName;
        if (userName === 'super' || userName === 'manager_pms') {
          _this.$router.push('/login');
        } else {
          userService.userLogout();
          _this.$router.push('/login');
        }
        SessionStorage.get('Admin-Token');
        SessionStorage.get('privilegeChilds');
        SessionStorage.get('handleCom');
      })
      .catch(() => { });
  }

  // 修改密码弹框
  changePassword() {
    this.isChangePassword = true;
  }

  // 确认修改密码  两次新密码对比 , 与自身密码对比 ,修改完成之后重新登陆
  async submitPwd(changePwdForm: any) {
    const pwdRef: any = this.$refs[changePwdForm];
    pwdRef.validate(async (valid: any) => {
      if (!valid) {
        return;
      }
      if (this.changePwdForm.newPwd1 !== this.changePwdForm.newPwd2) {
        notifyUtil.error(this.$tc('user_setting.new_pwd_agree'));
        // LimitMessage.showMessage({ type: 'error', message: this.$tc('user_setting.new_pwd_agree') });
        return;
      }
      if (this.changePwdForm.newPwd1 === this.changePwdForm.oldPwd) {
        notifyUtil.error(this.$tc('layout.new_pwd_same_old'));
        // LimitMessage.showMessage({ type: 'error', message: this.$tc('layout.new_pwd_same_old') });
        this.clearAllPwd();
        return;
      }
      const obj = {
        oldPassword: this.changePwdForm.oldPwd,
        newPassword: this.changePwdForm.newPwd1
      };
      userService
        .changePassWord(obj)
        .then((result: any) => {
          if (result.oldPassword === this.changePwdForm.oldPwd) {
            this.$store.dispatch('RevampPassword', {
              data: '',
              router: '',
              user: JSON.stringify(this.userInfo)
            });
            notifyUtil.success(this.$tc('user_setting.change_pwd_success'));
            // LimitMessage.showMessage({ type: 'error', message: this.$tc('user_setting.change_pwd_success') });
            setTimeout(() => {
              this.$router.push({ path: '/login' });
            }, 2000);
          }
        })
        .catch((error: any) => {
          notifyUtil.error(this.$tc('user_setting.old_pwd_error'));
          // LimitMessage.showMessage({ type: 'error', message: this.$tc('user_setting.old_pwd_error') });
          this.changePwdForm.oldPwd = '';
          this.changePwdForm.newPwd1 = '';
          this.changePwdForm.newPwd2 = '';
        });
    });
  }

  // 关闭修改密码
  closeChangePwd() {
    this.isChangePassword = false;
    this.changePwdForm.oldPwd = '';
    this.changePwdForm.newPwd1 = '';
    this.changePwdForm.newPwd2 = '';
    const pwdRef: any = this.$refs['changePwdForm'];
    pwdRef.clearValidate();
  }

  // 清除所有密码
  clearAllPwd() {
    this.changePwdForm.oldPwd = '';
    this.changePwdForm.newPwd1 = '';
    this.changePwdForm.newPwd2 = '';
  }

  mounted() {
    this.getuserInfo();
    const localTheme = localStorage.getItem('system-theme');
    if (localTheme && localTheme !== '') {
      Skin.changeTheme(localTheme);
    }
    // const changePwd: any = document.querySelector('#change-pwd-dialog') as HTMLDivElement;
    // changePwd.children[0].style.borderRadius = '6px';
    // if (localStorage.getItem('system-theme') === 'black') {
    //   changePwd.children[0].style.background = '#2e4773';
    // } else {
    //   changePwd.children[0].style.background = '#ecedf1';
    // }
    this.oldTime = Date.now();
    // this.registerEvent();
    // this.timeOutTimer();
    window.onbeforeunload = () => {
      this.beforeUnloadTime = new Date().getTime();
    };
    window.addEventListener('unload', e => {
      this.gapTime = new Date().getTime() - this.beforeUnloadTime;
      if (this.gapTime <= 5) {
        this.writeExitLog();
      }
    });
    this.currentLange = this.$i18n.locale;
  }

  writeExitLog() {

  }

  goHome() {
    this.$router.push({
      path: '/home'
    });
  }

  systemSet() {
    this.systemSetVisible = true;
  }

  onCloseSystemSet(visible: any) {
    this.systemSetVisible = visible;
  }

  // 换肤
  public async handleCommandSkin(command: string) {
    if (command !== localStorage.getItem('system-theme')) {
      let flag = true;
      if (this.$route.name === 'new-digital-plan' || this.$route.name === 'new-text-plan') {
        flag = await asyncConfirm(
          this.$tc('plan_manage.make-new-plan.change_theme_will_reload_page_without_save_plan'),
          this.$tc('common.prompt')
        );
      }
      if (flag) {
        localStorage.setItem('system-theme', command);
        window.location.reload();
        // Skin.changeTheme(command);
      }
    }
  }

  // 切换语言
  async handleCommandLanguage(language: string) {
    if (this.$i18n.locale === language) {
      return;
    }
    let flag = true;
    if (this.$route.name === 'new-digital-plan' || this.$route.name === 'new-text-plan') {
      flag = await asyncConfirm(
        this.$tc('plan_manage.make-new-plan.change_language_will_reload_page_without_save_plan'),
        this.$tc('common.prompt')
      );
    }
    if (flag) {
      this.$i18n.locale = language;
      SessionStorage.set('language', language);
      window.location.reload();
    }
  }

  userManual() {
    // this.$router.push('/user-manual');
    const curPath = window.document.location.href;
    const pathName = window.document.location.pathname;
    const pos = curPath.indexOf(pathName);
    const localPath = curPath.substr(0, pos);
    const newWindow: any = window.open('about:blank');
    newWindow.location.href = localPath + '/pms-user-manual/default.htm';
  }

  timeOutTimer() {
    const timeOut = this.timeOut * 60 * 1000;
    this.timer = setInterval(() => {
      const newTime = Date.now();
      if (newTime - this.oldTime > timeOut) {
        clearInterval(this.timer);
        this.$alert(this.$tc('home.wait_long_time_to_log_out'), {
          confirmButtonText: this.$tc('common.determine'),
          showClose: false,
          callback: () => {
            SessionStorage.remove('Admin-Token');
            this.$router.push('/login');
          }
        });
      }
    }, 1000);
  }

  registerEvent() {
    const html = document.querySelector('html') as HTMLElement;
    html.addEventListener('click', () => {
      this.oldTime = Date.now();
    });

    html.addEventListener('keydown', () => {
      this.oldTime = Date.now();
    });

    html.addEventListener('mousemove', () => {
      this.oldTime = Date.now();
    });

    html.addEventListener('mousewheel', () => {
      this.oldTime = Date.now();
    });
    const body = html.querySelector('html > body') as HTMLElement;
    body.ondrop = (e: any) => {
      e.stopPropagation();
      e.preventDefault();
    };
  }

  beforeDestroyed() {
    this.writeExitLog();
  }
  destroyed() {
    this.writeExitLog();
  }
}
