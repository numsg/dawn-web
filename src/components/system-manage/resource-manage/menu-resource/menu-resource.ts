import { Vue, Component, Watch } from 'vue-property-decorator';
import Html from './menu-resource.html';
import Styles from './menu-resource.module.scss';
import MenuInfo from '@/models/resource-manage/menu-info';
import menuManageService from '@/api/resource-manage/menu-manage.service';
import { getUuid32, getGuid32 } from '@gsafety/cad-gutil/dist/utilhelper';
import PriRouter from '@/utils/pri-router';
import roleManageService from '@/api/role-manage/role-manage.service';
import GenerateTree from '@/utils/generate-tree';
import i18n from '@/i18n';
import menuBlackStyle from './menu-resource.black.module.scss';
import notifyUtil from '@/common/utils/notifyUtil';
import { LOGACTION } from '@/common/enums/log';
import EventNames from '@/common/events/store-events';

@Component({
  name: 'menu-resource',
  template: Html,
  style: Styles,
  themes: [{ name: 'white', style: Styles }, { name: 'black', style: menuBlackStyle }],
  components: {}
})
export class MenuResourceComponent extends Vue {
  // treeNodeKey = Date.now();

  /**当前菜单节点 */
  public currentMenuInfo: MenuInfo = new MenuInfo();
  private _currentMenuInfo: MenuInfo = new MenuInfo();
  // 数据源
  dataSource: MenuInfo[] = [];

  defaultProps = {
    label: 'name'
  };
  // isaddMenu: boolean = false; // 1
  // 当前展开节点数组
  currentExpandedKeys: string[] = [];
  // 当前选中节点
  currentNodeKey: string = '';
  // 是否是新增节点
  isNewFunction: boolean = false;
  // 图标
  imageURL: string = '';
  // 默认图标
  sysResAvatar: any = require('@/assets/img/res-default.png');
  // 当前资源是否发生改变
  isChanged: boolean = false;
  // 是否高亮
  isHighLight: boolean = false;
  // 显示选择图标的弹框
  isShowImgBox: boolean = false;

  private get rolePrivilege(): any {
    return PriRouter.handleRole('resource-manage');
  }

  public images = {
    defaultImg: require('@/assets/img/no_picture.png'),
    vectorIcon: [
      { className: 'iconpms-icon_resource-management', id: 'icon_Health', upload: false },
      { className: 'iconpms-icon_System-logs', id: 'icon_Natural-disaster', upload: false },
      { className: 'iconpms-icon_Role-management-menu', id: 'icon_Public-Health', upload: false },
      { className: 'iconpms-icon_user-management-menu', id: 'icon_Social-security', upload: false },
      { className: 'iconpms-icon_Adding-Preplan', id: 'icon_Economics', upload: false },
      { className: 'iconpms-icon_Rule-base', id: 'icon_influence', upload: false },
      { className: 'iconpms-icon_Data-Source-Management', id: 'icon_level', upload: false },
      { className: 'iconpms-icon_Supporting-data-management', id: 'icon_Disaster-level', upload: false },
      { className: 'iconpms-icon_Component-Library', id: 'icon_order-response1', upload: false },
      { className: 'iconpms-icon_Plan-model', id: 'icon_order-response2', upload: false },
      { className: 'iconpms-icon_Plan-system', id: 'icon_order-response3', upload: false },
      { className: 'iconpms-icon_Plan-management-menu', id: 'icon_order-response4', upload: false },
      { className: 'iconpms-icon_Create-deduction', id: 'icon_order-response4', upload: false },
      { className: 'iconpms-icon_scene', id: 'icon_order-response4', upload: false }
    ]
  };

  private get isNotSuper(): any {
    if (!this.rolePrivilege.update && !this.rolePrivilege.add && !this.rolePrivilege.delete) {
      return true;
    }
  }

  // 表单校验规则
  rules = {
    title: [
      // { required: true, min: 1, max: 64, message: i18n.t('common.length_limit64'), tigger: 'blur' },
      { required: true, message: i18n.t('resource-manage.privile_nama_null'), trigger: 'blur' },
      { min: 1, max: 64, message: i18n.t('common.length_limit64'), trigger: ['blur', 'change'] }
    ],
    name: [
      { required: true, message: i18n.t('resource-manage.router_name_null'), trigger: 'blur' },
      { min: 1, max: 64, message: i18n.t('common.length_limit64'), trigger: ['blur', 'change'] }
    ],
    expression: [
      // { required: true, min: 1, max: 64, message: i18n.t('common.length_limit64'), tigger: 'blur' },
      { required: true, message: i18n.t('resource-manage.route_address_null'), trigger: 'blur' },
      { min: 1, max: 64, message: i18n.t('common.length_limit64'), trigger: ['blur', 'change'] }
    ],
    description: [
      // { required: true, min: 1, max: 64, message: i18n.t('common.length_limit64'), tigger: 'blur' },
      { required: true, message: i18n.t('resource-manage.component_path_null'), trigger: 'blur' },
      { min: 1, max: 64, message: i18n.t('common.length_limit64'), trigger: ['blur', 'change'] }
    ],
    icon: [{ required: false, trigger: blur }, { validator: this.validataIcon, trigger: blur }]
  };

  // 组件路径校验
  validateComponent(rule: any, value: any, callback: any) {
    if (value === undefined || String(value).trim() === '') {
      callback(new Error(this.$tc('resource-manage.input_component_path')));
    } else {
      callback();
    }
  }

  // 图片base64校验
  validataIcon(rule: any, value: any, callback: any) {
    if (this.currentMenuInfo.parentId !== '' || !value) {
      callback();
      return;
    }
    const mailReg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z]+=[a-z0-9]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
    if (!mailReg.test(value)) {
      callback(new Error(this.$tc('resource-manage.base64_image')));
      return;
    } else {
      callback();
    }
  }

  @Watch('currentMenuInfo', { deep: true })
  isCurMenuChange() {
    const result = this.isChangedSource();
    if (result) {
      this.isChanged = true;
    } else {
      this.isChanged = false;
    }
  }

  /**
   * 移除表单校验结果
   * @memberof MenuResourceComponent
   */
  clearValidate() {
    const form: any = this.$refs.currentMenuInfo;
    form.clearValidate();
  }

  async mounted() {
    await this.queryMenuList();
    if (this.dataSource.length > 0) {
      this.setExpandedKey(this.dataSource[0].id);
      this.currentMenuInfo = Object.assign({}, this.dataSource[0]);
      this._currentMenuInfo = Object.assign({}, this.dataSource[0]);
    }
  }

  /**
   * 设置默认展开行
   * @param {String} id
   * @memberof MenuResourceComponent
   */
  setExpandedKey(id: string) {
    this.currentExpandedKeys = [id];
    // this.currentNodeKey = id;
    const menuTree: any = this.$refs.menuTree;
    menuTree.setCurrentKey(id);
  }

  /**
   * 添加根结点
   * @memberof MenuResourceComponent
   */
  addRootMenu() {
    if (this.isNewFunction) {
      // LimitMessage.showMessage({ type: 'warning', message: this.$tc('resource-manage.new_no_save'), duration: 500 });
      notifyUtil.warning(this.$tc('resource-manage.new_no_save'));
      return;
    }
    this.isNewFunction = true;
    // this.isaddMenu = true;  // 2
    this.clearValidate();
    this.currentMenuInfo = new MenuInfo();
    this.currentMenuInfo.title = '';
    this.currentMenuInfo.id = getGuid32();
    this.currentMenuInfo.code = getUuid32();
    this.dataSource.push(this.currentMenuInfo);
    this.isChanged = true;
  }

  /**
   * 添加菜单
   * @memberof MenuResourceComponent
   */
  append(data: any, node: any) {
    if (this.isNewFunction) {
      // LimitMessage.showMessage({ type: 'warning', message: this.$tc('resource-manage.new_no_save'), duration: 500 });
      notifyUtil.warning(this.$tc('resource-manage.new_no_save'));
      return;
    }
    node.expanded = true;
    this.clearValidate();
    const newMenu = new MenuInfo();
    newMenu.id = getGuid32();
    newMenu.code = getUuid32();
    newMenu.parentId = data.id;
    newMenu.title = '';
    if (data.children === null) {
      this.$set(data, 'children', []);
    }
    this.currentMenuInfo = newMenu;
    data.children.push(this.currentMenuInfo);
    setTimeout(() => {
      const refTree: any = this.$refs['menuTree'];
      refTree.setCurrentKey(this.currentMenuInfo.id);
      this.isHighLight = true;
    }, 200);
    this.isChanged = true;
    this.isNewFunction = true;
  }

  updateMenu(menuInfo: MenuInfo) {
    this.currentMenuInfo = JSON.parse(JSON.stringify(menuInfo));
  }

  async deleteMenu(menuInfo: MenuInfo) {
    if (this.isNewFunction) {
      this.$confirm(this.$tc('resource-manage.confirm_delete_new'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(() => {
          // LimitMessage.showMessage({ type: 'success', message: this.$tc('common.delete_success'), duration: 500 });
          notifyUtil.success(this.$tc('common.delete_success'));
          this.isNewFunction = false;
          this.dataSource.splice(this.dataSource.length - 1, 1);
          this.queryMenuList();
          if (this.dataSource.length > 0) {
            this.setExpandedKey(this.dataSource[0].id);
            this.currentMenuInfo = Object.assign({}, this.dataSource[0]);
            this._currentMenuInfo = Object.assign({}, this.dataSource[0]);
          }
        })
        .catch(() => {
          return;
        });
    } else {
      const flag = await this.resourceAssRole();
      if (flag) {
        // LimitMessage.showMessage({ type: 'error', message: this.$tc('resource-manage.resource_ass_role'), duration: 500 });
        notifyUtil.error(this.$tc('resource-manage.resource_ass_role'));
        return;
      }
      this.$confirm(this.$tc('resource-manage.confirm_delte_menu'), this.$tc('common.prompt'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(async () => {
          const delMenu = Object.assign({}, menuInfo);
          const res = await menuManageService.deleteMenuNode(menuInfo.id);
          if (res) {
            const router: any = this.$router.currentRoute;
            const user: any = sessionStorage.getItem('userInfo');
            this.$store.dispatch(EventNames.SystemLog.HandleDataDelete, {
              router: router,
              user: user,
              data: menuInfo,
              dataType: 'menu_resource'
            });
            notifyUtil.success(this.$tc('common.delete_success'));
            this.currentMenuInfo = new MenuInfo();
            await this.queryMenuList();
            let data: any;
            if (delMenu.parentId) {
              this.setExpandedKey(delMenu.parentId);
              data = this.findCurrentNodeById(delMenu.parentId, this.dataSource);
              this.isNewFunction = false;
            } else {
              data = this.dataSource[0];
              this.setExpandedKey(data.id);
            }
            this._currentMenuInfo = Object.assign({}, data);
            this.currentMenuInfo = data;
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
   * 保存菜单
   * @memberof MenuResourceComponent
   */
  async saveMenuInfo() {
    const form: any = this.$refs.currentMenuInfo;
    form.validate(async (valid: any, object: any) => {
      if (valid) {
        const flag = await this.confirmResource();
        if (flag) {
          notifyUtil.error(this.$tc('resource-manage.name_repeat'));
          return;
        }
        if (this.isNewFunction) {
          const res: any = await menuManageService.addMenu(this.currentMenuInfo);
          if (res) {
            this.currentMenuInfo.id = res.id;
            this._currentMenuInfo = Object.assign({}, this.currentMenuInfo);
            notifyUtil.success(this.$tc('base_data_manage.success_new'));
            this.handleLog(LOGACTION.ADD);
            this.isNewFunction = false;
            this.isChanged = false;
          } else {
            notifyUtil.error(this.$tc('base_data_manage.error_new'));
          }
          this.currentNodeKey = res.id;
        } else {
          const res = await menuManageService.updateMenuNode(this.currentMenuInfo.id, this.currentMenuInfo);
          if (res.error) {
            notifyUtil.error(this.$tc('base_data_manage.update_error'));
            return;
          }
          this.handleLog(LOGACTION.EDIT);
          this.currentNodeKey = this.currentMenuInfo.id;
          notifyUtil.success(this.$tc('base_data_manage.update_success'));
          this.isChanged = false;
          this.currentMenuInfo = Object.assign({}, res);
          this._currentMenuInfo = Object.assign({}, res);
        }
        await this.queryMenuList();
        this.setExpandedKey(this.currentNodeKey);
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
        data: this.currentMenuInfo,
        state: true,
        dataType: 'menu_resource'
      });
    } else if (action === LOGACTION.EDIT) {
      this.$store.dispatch(EventNames.SystemLog.HandleDataEdit, {
        router: router,
        user: user,
        data: this.currentMenuInfo,
        state: true,
        dataType: 'menu_resource'
      });
    }
  }

  async queryMenuList() {
    this.dataSource = await menuManageService.queryMenuNodes();
    if (Array.isArray(this.dataSource) && this.dataSource.length > 0) {
      this.dataSource.forEach((element: any) => {
        element.visible = false;
        if (element.hasChildren && element.children.length > 0) {
          element.children.forEach((child: any) => {
            child.visible = false;
          });
        }
      });
    }
    this.currentExpandedKeys = [];
  }

  /**
   * 取消保存
   * @memberof MenuResourceComponent
   */
  cancelSubmit() {
    if (this.isNewFunction) {
      this.isNewFunction = false;
      this.dataSource.splice(this.dataSource.length - 1, 1);
      this.currentMenuInfo = Object.assign({}, this._currentMenuInfo);
      this.clearValidate();
    } else {
      // this.isaddMenu = true; // 8
      this.currentMenuInfo = Object.assign({}, this._currentMenuInfo);
      this.clearValidate();
    }
  }

  // 判断资源是否发生改变
  isChangedSource() {
    let change = false;
    if (
      this.currentMenuInfo.title !== this._currentMenuInfo.title ||
      this.currentMenuInfo.name !== this._currentMenuInfo.name ||
      this.currentMenuInfo.expression !== this._currentMenuInfo.expression ||
      this.currentMenuInfo.description !== this._currentMenuInfo.description ||
      this.currentMenuInfo.icon !== this._currentMenuInfo.icon
    ) {
      change = true;
    }
    return change;
  }

  /**
   * 树节点点击事件
   * @param {*} e
   * @memberof PrivilegeManageComponent
   */
  handleNodeClick(e: any, node: any) {
    if (this.isNewFunction && this.currentMenuInfo.id !== e.id) {
      this.$confirm(this.$tc('resource-manage.add_no_save_leave'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(() => {
          this.dataSource.splice(this.dataSource.length - 1, 1);
          this.isNewFunction = false;
          this.queryMenuList();
          if (this.dataSource.length > 0) {
            this.setExpandedKey(this.dataSource[0].id);
            this.currentMenuInfo = Object.assign({}, this.dataSource[0]);
            this._currentMenuInfo = Object.assign({}, this.dataSource[0]);
          }
        })
        .catch(() => {
          return;
        });
    } else {
      this.isChanged = true;
      this.currentMenuInfo = node.data;
      this.currentMenuInfo = this.findCurrentNodeById(node.data.id, this.dataSource);
      this._currentMenuInfo = Object.assign({}, this.currentMenuInfo);
      this.clearValidate();
    }
  }

  // 上传前验证
  beforeAvatarUpload(file: any) {}

  // 上传图标
  async uploadImage(event: any) {
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
    reader.onload = async (res: any) => {
      if (res.target.result.length > 204800) {
        notifyUtil.error(this.$tc('resource-manage.image_exceed_specified'));
        return;
      }
      this.currentMenuInfo.icon = res.target.result;
      // await this.saveMenuInfo();
    };
  }

  /**
   * 根据节点id查找节点信息
   * @param {String} id
   * @param {Privilege[]} menuList
   * @returns {Privilege}
   * @memberof PrivilegeManageComponent
   */
  findCurrentNodeById(id: string, menuList: MenuInfo[]): MenuInfo {
    let menu = new MenuInfo();
    // tslint:disable-next-line:prefer-const
    let menuArr: MenuInfo[] = [];
    for (let i = 0, len = menuList.length; i < len; i++) {
      if (menuList[i].id === id) {
        menu = menuList[i];
        break;
      }
      if (menuList[i].hasChildren) {
        menuArr = menuArr.concat(menuList[i].children);
      }
    }
    if (!menu.id) {
      return this.findCurrentNodeById(id, menuArr);
    }
    // return menu;
    return Object.assign({}, menu);
  }

  /**
   *资源保存前验证
   * 1. 验证路由名称，路由地址验证  非 /
   * 2.
   *
   * @memberof MenuResourceComponent
   */
  async confirmResource() {
    if (this.currentMenuInfo.description === '1') {
      return false;
    }
    const result = await menuManageService.queryMenuNodes();
    const childs: any = GenerateTree.getChildren(result, []);
    let repeat = false;
    const filterChilds = childs.filter((e: any) => e.id !== this.currentMenuInfo.id);
    filterChilds.forEach((e: any) => {
      if (
        this.currentMenuInfo.name === e.name ||
        this.currentMenuInfo.title === e.title ||
        (this.currentMenuInfo.expression !== '/' && this.currentMenuInfo.expression === e.expression)
      ) {
        repeat = true;
      }
    });
    return repeat;
  }

  /**
   * 资源是否被角色关联
   * 1. 初始化的时候给每个被关联的按钮加禁用按钮
   * 2. 删除的时候更变提示语
   *
   *
   * @param {*} id
   * @memberof MenuResourceComponent
   */
  async resourceAssRole() {
    // 所有角色
    const allRoles = await roleManageService.getRoleList();
    const privileges: any = [];
    // 被角色关联的权限
    for (let i = 0; i < allRoles.length; i++) {
      const temp = await roleManageService.codeRoleMenus(allRoles[i].code);
      privileges.push(...temp);
    }
    const childs: any = GenerateTree.getChildren(privileges, []);
    let flag = false;
    childs.forEach((e: any) => {
      if (e.id === this.currentMenuInfo.id && e.directAssociate === 0) {
        flag = true;
      }
    });
    return flag;
  }
  onCancel() {
    this.isShowImgBox = false;
    this.currentMenuInfo.icon = this._currentMenuInfo.icon;
  }
  onSavebackground() {
    this.isShowImgBox = false;
  }
  onImgClick(img: any, key: any) {
    this.currentMenuInfo.icon = img.className;
  }
}
