import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import roleManageService from '@/api/role-manage/role-manage.service';
import styles from './resource-card-edit.module.scss';
import Html from './resource-card-edit.html';
import menuManageService from '@/api/resource-manage/menu-manage.service';
import privilegeManageService from '@/api/resource-manage/privilege-manage.service';
import RolePrivilege from '@/models/role-manage/role-privilege';
import { Logger } from '@/utils/log';
import GenerateTree from '@/utils/generate-tree';
import resourceBlackStyle from './resource-card-edit.black.module.scss';
import notifyUtil from '@/common/utils/notifyUtil';

@Component({
  name: 'el-resource-card-edit',
  template: Html,
  style: styles,
  themes: [{ name: 'white', style: styles }, { name: 'black', style: resourceBlackStyle }],
  components: {}
})
export class ResourceCardEditComponent extends Vue {
  public activeTabName: string = 'authorityResource';

  /**
   * 显示在界面上面的menulist
   *
   * @type {Array<any>}
   * @memberof ResourceCardEditComponent
   */
  public allMenu: Array<any> = [];

  // public treeProps = { children: 'children', label: 'name' };

  public treeProps = {
    children: 'children',
    label: 'title',
    disabled: 'isResource'
  };

  // 默认勾选
  public hasMenuIdList: Array<string> = [];

  // 功能资源树是item显示还是整体显示
  isShowFullTree: boolean = true;

  private _menuListIds: Array<string> = [];

  public eventTemp: Array<string> = [];

  public auth: any = [];

  public authIds: any = [];

  privilegeList: Array<any> = [];

  prilegeIds: Array<any> = [];
  prilegeDatas: Array<any> = [];

  // 日志
  public ResLogger: Logger = new Logger();

  // 角色configuration
  roleConfigArr: Array<any> = [];

  /**
   * 当前用户已经拥有的权限
   *
   * @type {*}
   * @memberof ResourceCardEditComponent
   */
  @Prop(Array) menuList: any;
  @Prop() currentRole: any;

  @Watch('currentRole')
  onRoleChange() {
    if (Array.isArray(this.$data.allMenu) && this.$data.allMenu.length === 0) {
      // this.ResLogger.info('做了切换角色关闭侧边栏');
    }
  }

  @Watch('menuList')
  menuListChange() {
    this.$data._menuListIds = GenerateTree.uniqArray(this.menuList);
    this.hasMenuIdList = GenerateTree.uniqArray(this.menuList);
    if (Array.isArray(this.$refs.tree) && this.$refs.tree.length > 0) {
      this.$refs.tree.forEach((childtree: any) => {
        childtree.setCheckedKeys(this.hasMenuIdList);
      });
    }
  }

  async mounted() {
    await this.getMenuList();
    await this.getPrivilegeList();
    this.$data._menuListIds = this.menuList;
    this.hasMenuIdList = this.menuList;
  }

  private async getMenuList() {
    const data = await menuManageService.queryMenuNodes();
    if (Array.isArray(data) && data.length > 0) {
      this.allMenu = await this.handleTreeStructure([], data);
    }
  }
  async node_click(node: any, data: any) {
    // this.roleReConfig();
    // const refTree: any = this.$refs.tree;
  }

  private async getPrivilegeList() {
    const data = await privilegeManageService.queryAllPrivilegeNodes();
    const rolePrivilege = await roleManageService.codeReferRolePrivileges(this.currentRole.code);
    if (data && Array.isArray(data) && rolePrivilege && Array.isArray(rolePrivilege)) {
      this.privilegeList = data.map((item: any) => {
        const newPrivilege = new RolePrivilege();
        const choose = rolePrivilege.findIndex((ro: any) => ro.id === item.id) >= 0;
        newPrivilege.children = item.children;
        newPrivilege.code = item.code;
        newPrivilege.description = item.description;
        newPrivilege.expression = item.expression;
        newPrivilege.hasChildren = item.hasChildren;
        newPrivilege.id = item.id;
        newPrivilege.name = item.name;
        newPrivilege.parentId = item.parentId;
        newPrivilege.choose = choose;
        return newPrivilege;
      });
    }
  }

  /**
   * 角色权限配置
   *
   */
  roleReConfig() {
    this.roleConfigArr = [];
    const refTree: any = this.$refs.tree;
    const checkedNodes: any = [];
    const temp: Array<any> = [];
    refTree.forEach((element: any) => {
      if (element.getCheckedNodes().length > 0) {
        element.getCheckedNodes().forEach((element: any) => {
          checkedNodes.push(element);
        });
      }
    });
    this.handleRoleConfig(checkedNodes, temp);
    const configNodes = this.roleConfigData(temp, []).filter((e: any, index: any, self: any) => {
      return self.indexOf(e) === index;
    });
    if (Array.isArray(configNodes) && configNodes.length > 0) {
      configNodes.forEach((element: any) => {
        const config = {
          id: element.id,
          title: element.title,
          priName: element.expression,
          componentName: element.name,
          isPrivelege: element.privilege
        };
        this.roleConfigArr.push(config);
      });
    }
  }

  /**
   * 角色配置数据
   */
  handleRoleConfig(data: Array<any>, roleConfig: Array<any>) {
    if (data.length > 0) {
      data.forEach((e: any) => {
        if (e.hasChildren && e.parentId !== '') {
          roleConfig.push(e.children);
          this.handleRoleConfig(e.children, roleConfig);
        }
      });
    }
    return roleConfig;
  }

  /**
   * role configuration
   */
  roleConfigData(data: Array<any>, temp: Array<any>) {
    data.forEach((e: any) => {
      e.forEach((element: any) => {
        if (element.description === '1') {
          temp.push(element);
        }
      });
    });
    return temp;
  }

  // 选中的角色权限节点
  checkedPris() {
    this.prilegeIds = [];
    this.prilegeDatas = [];
    const refTree: any = this.$refs.tree;
    refTree.forEach((element: any) => {
      if (Array.isArray(element.getCheckedNodes()) && element.getCheckedNodes().length > 0) {
        element.getCheckedNodes().forEach((e: any) => {
          this.prilegeIds.push(e.id);
          this.prilegeDatas.push(e);
        });
      }
    });
  }

  getChildren(data: any, newChildren: any) {
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((item: any) => {
        newChildren.push(item);
        if (item.children != null) {
          this.getChildren(item.children, newChildren);
        }
      });
    }
    return newChildren;
  }

  generateTree(data: any, pid: any) {
    const result = [];
    let temp;
    for (let i = 0; i < data.length; i++) {
      if (data[i].parentId === pid) {
        temp = this.generateTree(data, data[i].id);
        if (temp.length > 0) {
          data[i].children = temp;
        }
        result.push(data[i]);
      }
    }
    return result;
  }

  /**
   * menu 树变成分割成很多小的
   *
   * @private
   * @param {*} tempArr
   * @param {Array<any>} data
   * @returns
   * @memberof ResourceCardEditComponent
   */
  private handleTreeStructure(tempArr: any, data: Array<any>) {
    this.getChildren(data, []).forEach((element: any) => {
      let flag = true;
      GenerateTree.uniqArray(this.menuList).forEach((e: any) => {
        if (flag && e === element.id) {
          element.privilege = true;
          flag = false;
        } else if (flag) {
          element.privilege = false;
        }
      });
      if (element.name === 'resource-manage' && element.description === '1') {
        element.isResource = true;
      }
    });
    data.forEach((item: any) => {
      tempArr.push([item]);
    });
    return tempArr;
  }

  // tab 切换
  handleTabClick(tab: any, event: any) {}

  onCheckedClick(data: any, event: any) {
    event.checkedKeys.forEach((co: string) => {
      if (
        (this.$data._menuListIds.length > 0 && this.$data._menuListIds.findIndex((de: any) => co === de) < 0) ||
        this.$data._menuListIds.length === 0
      ) {
        this.$data._menuListIds.push(co);
      }
    });
  }

  // 子节点被选中父节点也被选中
  onCheckChange(data: any, isChecked: any, isCheckedChild: any) {
    const refTree: any = this.$refs.tree;
    if (isChecked) {
      data.privilege = true;
      const temp: any = [];
      refTree.forEach((element: any) => {
        temp.push(...element.getCheckedKeys());
        temp.push(data.parentId);
        element.setCheckedKeys(temp);
      });
    } else {
      data.privilege = false;
      const cancelCheckedIds: any = [];
      const temp: any = [];
      refTree.forEach((element: any) => {
        temp.push(...element.getCheckedKeys());
      });
      if (data.hasChildren && data.children.length > 0) {
        GenerateTree.getChildren(data.children, []).forEach((element: any) => {
          cancelCheckedIds.push(element.id);
        });
      }
      const nodes: any = temp.filter((x: any) => !cancelCheckedIds.find((y: any) => x === y));
      refTree.forEach((element: any) => {
        element.setCheckedKeys(nodes);
      });
    }
  }

  /**
   * 1. 父节点选中，子节点可不选中
   */

  nodeChecked(currentNode: any, event: any) {
    const result = event.checkedNodes.some((item: any) => {
      if (item.id === currentNode.id) {
        return true;
      } else {
        return false;
      }
    });
    const exist = this.menuList.includes(currentNode.id);
    if (result && !exist) {
      this.menuList.push(currentNode.id);
    }
    if (!result && exist) {
      this.menuList.splice(this.menuList.indexOf(currentNode.id), 1);
    }
  }

  async onSaveMenuEdit() {
    const priviIds: any = [];
    const priviData: any = [];
    this.privilegeList.forEach((item: any) => {
      if (item.choose) {
        priviIds.push(item.id);
        priviData.push(item);
      }
    });
    const router: any = this.$router.currentRoute;
    const user: any = sessionStorage.getItem('userInfo');

    const prisResult = await roleManageService.handleRolePricileges([this.currentRole.code], priviIds);
    this.checkedPris();
    this.$store.dispatch('UpdataRoleResource', {
      router: router,
      user: user,
      data: this.currentRole,
      resourceType: 'api'
    });

    const menuResult = await roleManageService.handleRoleMenus([this.currentRole.code], GenerateTree.uniqArray(this.prilegeIds));
    this.roleReConfig();
    this.$store.dispatch('UpdataRoleResource', {
      router: router,
      user: user,
      data: this.currentRole,
      resourceType: 'menu'
    });

    this.roleConfigArr.forEach((e: any) => {
      delete e.title;
      delete e.id;
    });
    this.currentRole.configuration = JSON.stringify(this.roleConfigArr);
    const updateRoleInfo = await roleManageService.modificationRoleDetail(this.currentRole.code, this.currentRole);
    if (menuResult === '' && prisResult === '' && updateRoleInfo) {
      this.$emit('on-add-menu-list', true);
      // LimitMessage.showMessage({ message: this.$tc('role-resource-manage.role_ass_resource_success'), type: 'success' });
      notifyUtil.success(this.$tc('role-resource-manage.update_success'));
    }
  }
}
