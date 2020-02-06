import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import styles from './menu-edit.module.scss';
import Html from './menu-edit.html';

import roleManageService from '@/api/role-manage/role-manage.service';
import menuManageService from '@/api/resource-manage/menu-manage.service';
import { Logger } from '@/utils/log';
import GenerateTree from '@/utils/generate-tree';
import LimitMessage from '@/utils/message-limit';
import menuBlackStyle from './menu-edit.black.module.scss';
import notifyUtil from '@/common/utils/notifyUtil';

@Component({
  name: 'el-menu-edit',
  template: Html,
  style: styles,
  themes: [{ name: 'white', style: styles }, { name: 'black', style: menuBlackStyle }],
  components: {}
})
export class MenuEditComponent extends Vue {
  public childProps = { children: 'children', label: 'title', disabled: 'isResource' };

  // 默认勾选
  public defaultChoose: Array<string> = [];
  private _exceptChoosed: Array<string> = [];
  private _chooseIds: Array<string> = [];

  public menuTree: Array<any> = [];
  public ResLogger: Logger = new Logger();
  // public roleDetail: any = null;
  public roleAllConfig: Array<any> = [];

  @Prop(Array) roleHasmenuIds: any;
  @Prop() rolecode: any;
  @Prop(Array) menuData: any;
  @Prop() roleDetail: any;
  @Watch('menuData')
  menuLChange() {
    // this.ResLogger.info('menu list change');
    this.initData();
  }

  async mounted() { }

  async initData() {
    const menus = await menuManageService.queryMenuNodes();
    // this.roleDetail = await roleManageService.codeReferRoleDetail(this.rolecode);
    this.roleAllConfig = JSON.parse(this.roleDetail.configuration.toString());
    if (Array.isArray(menus) && menus.length > 0 && this.menuData.length > 0) {
      menus.forEach((item: any) => {
        if (item.id === this.menuData[0].id) {
          this.menuTree = [item];
        }
      });
    }
    const tempChoose: any = roleManageService.returnTreeIds([], this.menuData, 'id');
    const chooses: any = [];
    tempChoose.forEach((tc: string) => {
      if (chooses.findIndex((cho: string) => cho === tc) < 0) {
        chooses.push(tc);
      }
    });
    // const allids = roleManageService.returnTreeIds([], this.menuTree, 'id');
    this.defaultChoose = chooses;
    this.nodePri(this.menuTree);
    this._chooseIds = this.defaultChoose;
    let temp = [];
    temp = this.roleHasmenuIds;
    if (temp.length > 0) {
      temp.forEach((all: any) => {
        if (this.defaultChoose.findIndex((defau: any) => defau === all) < 0) {
          this.$data._exceptChoosed.push(all);
        }
      });
    }
  }

  /**
   * 为每个节点添加privilege
   * @param data
   * @param isChecked
   * @param isCheckedChild
   */
  nodePri(data: Array<any>) {
    if (data.length > 0) {
      GenerateTree.getChildren(data, []).forEach((element: any) => {
        let flag = true;
        element.privilege = false;
        this.defaultChoose.forEach((e: any) => {
          if (flag && e === element.id) {
            element.privilege = true;
            flag = false;
          }
          if (element.name === 'resource-manage' && element.description === '1') {
            element.isResource = true;
          }
        });
      });
    }
  }

  onCheckChange(data: any, isChecked: any, isCheckedChild: any) {
    const refTree: any = this.$refs.tree;
    if (isChecked) {
      const temp: any = [];
      data.privilege = true;
      temp.push(...refTree.getCheckedKeys());
      temp.push(data.parentId);
      refTree.setCheckedKeys(temp);
    } else {
      data.privilege = false;
      const cancelCheckedIds: any = [];
      const temp: any = [];
      temp.push(...refTree.getCheckedKeys());
      if (data.hasChildren && data.children.length > 0) {
        GenerateTree.getChildren(data.children, []).forEach((element: any) => {
          cancelCheckedIds.push(element.id);
        });
      }
      const nodes: any = temp.filter((x: any) => !cancelCheckedIds.find((y: any) => x === y));
      refTree.setCheckedKeys(nodes);
    }
  }

  /**
   * 角色配置信息
   * 1. 过滤所有description 为 1
   * 2. 勾选的节点转化成配置
   * 3. 与原有角色配置对比，替换其中重复部分
   * @param data
   * @param event
   */
  roleReConfig() {
    const temp: Array<any> = [];
    if (this.menuTree.length > 0) {
      GenerateTree.getChildren(this.menuTree, []).forEach((element: any) => {
        if (element.description === '1') {
          temp.push(element);
        }
      });
    }
    const roleConfig: any = [];
    temp.forEach((element: any) => {
      const config = {
        id: element.id,
        title: element.title,
        priName: element.expression,
        componentName: element.name,
        isPrivelege: element.privilege
      };
      roleConfig.push(config);
    });
    this.roleAllConfig.forEach((e: any) => {
      let flag = true;
      roleConfig.forEach((t: any) => {
        if (flag && t.id === e.id) {
          e.isPrivelege = t.isPrivelege;
          flag = false;
        }
      });
    });
  }

  onCheckClick(data: any, event: any) {
    this._chooseIds = event.checkedKeys;
  }

  /**
   * 1.角色code 获取角色信息
   *
   */
  async onSave() {
    const data = this._chooseIds.concat(this.$data._exceptChoosed);
    this.roleReConfig();
    this.roleDetail.configuration = JSON.stringify(this.roleAllConfig);
    const result = await roleManageService.handleRoleMenus([this.rolecode], data);
    const updateRoleInfo = await roleManageService.modificationRoleDetail(this.rolecode, this.roleDetail);
    if (result === '' && updateRoleInfo) {
      // LimitMessage.showMessage({ type: 'success', message: this.$tc('role-resource-manage.update_success') });
      notifyUtil.success(this.$tc('role-resource-manage.update_success'));
      const router: any = this.$router.currentRoute;
      const user: any = sessionStorage.getItem('userInfo');
      this.$store.dispatch('UpdataRoleResource', {
        router: router,
        user: user,
        data: updateRoleInfo,
        resourceType: 'menu'
      });
    }
    if (result === '') {
      this.$emit('on-menu-item-edit', true);
    }
  }
}
