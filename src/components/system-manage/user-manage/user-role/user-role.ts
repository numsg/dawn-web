import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from './user-role.html';
import Styles from './user-role.module.scss';
// import UserInfo from '@/models/user-manage/user-info';
import userManageService from '@/api/user-manage/user-manage.service';
import roleManageService from '@/api/role-manage/role-manage.service';
import { ResourceCardComponent } from '../../role-resource-manage/resource-card/resource-card';
import Role from '@/models/role-manage/role';
import { async } from 'q';
import { userInfo } from 'os';
import { isArray } from 'tinymce';
import LimitMessage from '@/utils/message-limit';
import roleBlackStyle from './user-role.black.module.scss';
import notifyUtil from '@/common/utils/notifyUtil';

@Component({
  template: Html,
  style: Styles,
  themes: [{ name: 'white', style: Styles }, { name: 'black', style: roleBlackStyle }],
  name: 'el-user-role',
  components: {
    'el-resource-card': ResourceCardComponent
  }
})
export class UserRoleComponent extends Vue {
  public searchValue: string = '';
  public allRoles: Array<any> = [];
  public currentRole: Role = new Role();
  public handleMenuFlag = false;
  public menuList: Array<any> = [];

  private _allRoles: Array<any> = [];
  rolePriNull: any = require('@/assets/img/role-privilege-null.png');

  count: number = 0;

  @Prop() user: any;
  @Watch('user')
  async onUserChange() {
    const userinfo = await userManageService.usernameQueryInfo(this.user.userName);
    if (userinfo && userinfo.roles && Array.isArray(userinfo.roles) && this._allRoles.length > 0) {
      this.handleRolelist(this._allRoles, userinfo.roles);
    }
  }

  // 搜索
  @Watch('searchValue')
  async searchUserByuserName() {
    if (this.searchValue) {
      this.allRoles = this.allRoles.filter(e => e.name.includes(String(this.searchValue)));
    } else {
      const userinfo = await userManageService.usernameQueryInfo(this.user.userName);
      if (userinfo && userinfo.roles && Array.isArray(userinfo.roles)) {
        this.handleRolelist(this._allRoles, userinfo.roles);
      }
    }
  }

  async mounted() {
    let roles = await roleManageService.getRoleList();
    roles = roles.filter((e: any) => e.name !== 'SuperManager');
    const userinfo = await userManageService.usernameQueryInfo(this.user.userName);
    if (roles && Array.isArray(roles)) {
      this._allRoles = roles;
    } else {
      // this.$message(this.$tc('user-manage.role_list_null'));
      notifyUtil.info(this.$tc('user-manage.role_list_null'));
      return;
    }
    this.currentRole = Array.isArray(roles) && roles.length > 0 ? Object.assign({}, roles[0]) : new Role();
    if (userinfo && userinfo.roles && Array.isArray(userinfo.roles)) {
      this.handleRolelist(this._allRoles, userinfo.roles);
    }
  }

  private handleRolelist(data: Array<any>, roles: Array<any>) {
    this.allRoles = data.map((role: any) => {
      const newRole = new Role();
      let choose = false;
      roles.forEach((item: any) => {
        if (item.id === role.id) {
          choose = true;
        }
      });
      newRole.name = role.name;
      newRole.usedStatus = role.usedStatus;
      newRole.id = role.id;
      newRole.description = role.description;
      newRole.configuration = role.configuration;
      newRole.code = role.code;
      newRole.choose = choose;
      return newRole;
    });
  }

  // 保存用户关联的角色
  async onSave() {
    const tempArr: Array<string> = [];
    this.allRoles.forEach((role: any) => {
      if (role.choose) {
        tempArr.push(role.code);
      }
    });
    const result = await userManageService.userRelaseRole([this.user.userName], tempArr);
    if (result === '') {
      // LimitMessage.showMessage({
      //     type: 'success',
      //     message: this.$tc('user-manage.add_role_success')
      // });
      notifyUtil.success(this.$tc('user-manage.add_role_success'));
      this.$emit('on-cancel-edit-role', true);
    } else {
      // LimitMessage.showMessage({
      //     type: 'error',
      //     message: this.$tc('user-manage.add_role_error')
      // });
      notifyUtil.error(this.$tc('user-manage.add_role_error'));
    }
  }

  onRoleClick(role: any) {
    this.currentRole = Object.assign({}, role);
    this.count = 0;
  }
  onBack() {
    this.$emit('on-cancel-edit-role', true);
  }
  async menuChange(data: any) {
    this.count = await data.data.length;
  }
  handleMenu(menuList: any) {
    this.menuList = menuList;
    if (isArray(menuList) && menuList.length > 0) {
      this.handleMenuFlag = true;
      this.$emit('on-cancel-save', false);
    } else {
      this.handleMenuFlag = false;
      this.$emit('on-cancel-save', true);
    }
  }
}
