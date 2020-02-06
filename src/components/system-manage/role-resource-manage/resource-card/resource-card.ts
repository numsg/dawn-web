import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import styles from './resource-card.module.scss';
import Html from './resource-card.html';
import roleManageService from '@/api/role-manage/role-manage.service';
import menuManageService from '@/api/resource-manage/menu-manage.service';
import { Logger } from '@/utils/log.ts';
import Generate from '@/utils/generate-tree';
import LimitMessage from '@/utils/message-limit';
import resourceBlackStyle from './resource-card.black.module.scss';
import { treeToArray, arrayToTree } from '@/common/utils/utils';
import notifyUtil from '@/common/utils/notifyUtil';
import { Url } from '@/common/enums/url';

@Component({
  name: 'el-resource-card',
  template: Html,
  style: styles,
  themes: [{ name: 'white', style: styles }, { name: 'black', style: resourceBlackStyle }],
  components: {}
})
export class ResourceCardComponent extends Vue {
  activeReleaseName: string = 'authorityResource';
  public menuList: Array<any> = [];
  private _twoStageMenus: Array<any> = [];
  private _menuData: Array<any> = [];
  public LoggerRes: Logger = new Logger();

  privilegeList: Array<any> = [];

  @Prop() currentRole: any;
  @Prop(Boolean) isNewRole: any;

  @Prop(Boolean) showEdit: any;

  @Prop()
  rolePrivilege: any;

  @Watch('currentRole')
  onRoleChange() {
    if (!this.isNewRole) {
      this.initRoleMenus();
      this.getPrivilegeList();
    }
  }

  mounted() {
    if (this.currentRole && this.currentRole.id) {
      this.initRoleMenus();
      this.getPrivilegeList();
    }
  }

  private async getPrivilegeList() {
    this.privilegeList = await roleManageService.codeReferRolePrivileges(this.currentRole.code);
    this.$emit('on-count-change', this.menuList.length + this.privilegeList.length);
  }

  private async initRoleMenus() {
    const menus = await menuManageService.queryMenuNodes();
    const roleMenu = await roleManageService.roleCodeQueryMenuNodes(this.currentRole.code, Url.ROLES) + '/';
    this.$emit('on-count-change', roleMenu.length + this.privilegeList.length);
    if (menus && Array.isArray(menus) && menus.length > 0) {
      this.$data._twoStageMenus = roleManageService.getNewList(menus);
    }
    if (Array.isArray(roleMenu)) {
      this.menuList = this.findTreeParent(this.comTreeParent(menus, roleMenu));
      this.$data._menuData = roleManageService.returnTreeIds([], roleMenu, 'id');
    }
    if (Array.isArray(this.menuList)) {
      let menuList = treeToArray(this.menuList);
      menuList = menuList.filter(e => e.directAssociate === 0);
      this.menuList = Generate.generateTreePar(menuList, '');
      this.$emit('on-menuList', this.menuList);
    }
    const param = { idData: this.$data._menuData, data: this.$data.menuList };
    this.$emit('on-menu-change', param);
  }

  onMenuEdit(item: any) {
    this.$emit('on-menu-item-edit', Object.assign({}, item));
  }

  onMenuDelete(item: any) {
    this.$confirm(this.$tc('role-resource-manage.config_delete_resource'), this.$tc('common.prompt'), {
      confirmButtonText: this.$tc('common.determine'),
      cancelButtonText: this.$tc('common.cancel'),
      type: 'warning',
      title: this.$tc('common.prompt'),
      showClose: false
    }).then(() => {
      const removeIds = roleManageService.returnTreeIds([], [item], 'id');
      const parm: any = [];
      this.$data._menuData.forEach((ids: any) => {
        if (removeIds.findIndex((de: any) => de === ids) < 0) {
          parm.push(ids);
        }
      });
      roleManageService.handleRoleMenus([String(this.currentRole.code)], parm).then(result => {
        if (result === '') {
          this.initRoleMenus();
          // LimitMessage.showMessage({
          //   message: this.$tc('common.delete') +
          //     item.title + this.$tc('role-resource-manage.resource_success'), type: 'success'
          // });
          notifyUtil.success(this.$tc('common.delete') + item.title + this.$tc('role-resource-manage.resource_success'));
        }
      });
    });
  }

  findTreeParent(dataArr: Array<any>) {
    const data: any = [];
    dataArr.forEach((item: any) => {
      const index = data.findIndex((o: any) => o.id === item.parentId);
      if (item.parentId && item.parentId.length > 0 && index < 0) {
        const parent = this.$data._twoStageMenus.find((p: any) => p.id === item.parentId);
        if (parent) {
          parent.children = [item];
          data.push(parent);
        }
      } else if (item.parentId && item.parentId.length > 0 && index >= 0) {
        data[index].children.push(item);
      } else {
        data.push(item);
      }
    });
    return roleManageService.getNewList(data);
  }

  comTreeParent(parentTree: any, childTree: any) {
    const result: any = [];
    const relChildTree: any = [];
    const newChilds: any = [];
    const allChilds = Generate.getChildren(parentTree, newChilds);
    const combineTree: any = [];
    childTree.filter((e: any) => {
      if (e.parentId === '') {
        result.push(e);
      } else {
        e.children = [];
        relChildTree.push(e);
      }
    });
    let reschilds: any = [];
    reschilds = this.searchTree(allChilds, relChildTree, combineTree);
    const temp: any = [];
    for (let i = 0; i < reschilds.length; i++) {
      if (temp.indexOf(reschilds[i]) === -1) {
        reschilds[i].children = null;
        temp.push(reschilds[i]);
      }
    }
    let resultTree: any = [];
    resultTree = Generate.generateTreePar(temp, '');
    if (resultTree.length !== 0) {
      resultTree.forEach((element: any) => {
        result.push(element);
      });
    }
    return result;
  }

  // 根据子节点在树中查找父节点
  searchTree(allChilds: any, childs: any, result: any) {
    const otherChilds: any = [];
    childs.forEach((e: any) => {
      e.children = [];
      result.push(e);
      allChilds.forEach((o: any) => {
        if (e.parentId === o.id) {
          o.children = [];
          result.push(o);
          if (o.parentId !== '') {
            otherChilds.push(o);
          }
        }
      });
    });
    if (otherChilds.length) {
      this.searchTree(allChilds, otherChilds, result);
    }
    return result;
  }

  onPriDelete(data: any, event: any) {
    this.$confirm(this.$tc('role-resource-manage.confirm_delete_privilege'), {
      confirmButtonText: this.$tc('common.determine'),
      cancelButtonText: this.$tc('common.cancel'),
      type: 'warning',
      title: this.$tc('common.prompt'),
      showClose: false
    })
      .then(() => {
        const ids: any = [];
        this.privilegeList.forEach((item: any) => {
          if (data.id !== item.id) {
            ids.push(item.id);
          }
        });
        roleManageService.handleRolePricileges([this.currentRole.code], ids).then(result => {
          if (result === '') {
            notifyUtil.success(this.$tc('common.delete') + data.name + this.$tc('role-resource-manage.privilege_success'));
            const router: any = this.$router.currentRoute;
            const user: any = sessionStorage.getItem('userInfo');
            this.$store.dispatch('UpdataRoleResource', {
              router: router,
              user: user,
              data: this.currentRole,
              resourceType: 'api'
            });
            this.getPrivilegeList();
          }
        });
      })
      .catch(this.LoggerRes.error);
  }
}
