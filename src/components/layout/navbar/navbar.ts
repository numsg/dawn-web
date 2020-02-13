import { Vue, Component, Watch } from 'vue-property-decorator';
import navbarStyle from './navbar.module.scss';
import { Getter } from 'vuex-class';
import dataSourceService from '@/api/data-source/data-source.service';
import store from '@/store/index';
import SessionUtil from '@/utils/session-storage';
import RouterElement from '@/models/router-element/router-element';
import GenerateTree from '@/utils/generate-tree';
import eventNames from '@/common/events/store-events';
import { treeToArray } from '@/common/utils/utils';

import navbarBlackStyle from './navbar.black.module.scss';

@Component({
  template: require('./navbar.html'),
  style: navbarStyle,
  themes: [{ name: 'white', style: navbarStyle }, { name: 'black', style: navbarBlackStyle }],
  components: {},
  computed: {
    name: function () {
      return this.$store.state.name;
    },
    age: function () {
      return this.$store.getters.menuStatus;
    }
  }
})
export class NavbarComponent extends Vue {
  paichiImg = require('@/assets/img/new-img/paichi.png');
  guanliImg = require('@/assets/img/new-img/guanli.png');
  peizhiImg = require('@/assets/img/new-img/peizhi.png');

  // 系统模块标题
  moduleTitle: any = [];

  routerElements: any[] = [];

  public stairMenu: string = '';
  hoverShow: string = '';

  visibleShow: boolean = false;

  reLoadMark: any = '';

  // 不显示的菜单
  hiddenMenus: any = [
    'plan-digital-overview',
    'plan-preview',
    'situation-deduction',
    'template-manager',
    'new-text-plan',
    'new-digital-plan',
    'user_manual',
    'plan-system-construction'
  ]; //

  // collapsed: boolean =  false;

  @Getter('menuStatus') menuStatus: any;

  public handleopen(index: any, indexPath: any) {
    // console.log(index, indexPath);
  }
  public handleselect(key: any, keyPath: any) {
    // console.log(key, this.$route.path);
  }

  public onSubmit() {
    // console.log('handleopen');
  }

  public handleclose() { }

  public showMenu(i: any, status: any) {
    const ele: any = this.$refs.menuCollapsed;
    ele.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
  }

  async created() {
    await this.$store.dispatch(eventNames.baseData.SetCommunities);
    await this.$store.dispatch(eventNames.baseData.SetDiagnosisSituations);
    await this.$store.dispatch(eventNames.baseData.SetMedicalSituations);
    await this.$store.dispatch(eventNames.baseData.SetSpecialSituations);
    await this.$store.dispatch(eventNames.baseData.SetGenderClassification);

    await this.$store.dispatch(eventNames.baseData.SetOtherSymptoms);
    await this.$store.dispatch(eventNames.baseData.SetMedicalOpinions);

    // await this.$store.dispatch(eventNames.EventTypes.LoadAllEventTypes);

    await this.$store.dispatch(eventNames.systemSet.SystemSetData);
  }

  mounted() {
    this.moduleTitle = this.handleReLoad();
    if (Array.isArray(this.moduleTitle) && this.moduleTitle.length > 0) {
      this.moduleTitle.forEach((e: any) => {
        if (Array.isArray(e.children) && e.children.length > 0) {
          this.handleMenuSort(e.children);
          // e.children.sort((a: any, b: any) => {
          //   if (a.menuOrder < b.menuOrder) {
          //     return -1;
          //   } else if (a.menuOrder === b.menuOrder) {
          //     return 0;
          //   } else {
          //     return 1;
          //   }
          // });
        }
      });
    }

    this.routerElements = treeToArray(this.moduleTitle);
    const active = this.moduleTitle.find((item: any) => item.name === this.reLoadMark);
    if (active === undefined) {
      this.$router.push({ path: '/login' });
      return;
    }
    this.stairMenu = active.id;
    const userInfo: any = localStorage.getItem('userInfo');
    store.commit('SET_USER_INFO', JSON.parse(userInfo));
  }

  @Watch('$route')
  onRouterChange(val: any, oldVal: any) {
    const active = this.routerElements.find(e => e.name === val.name);
    if (active === undefined) {
      return;
    }
    const activeParent = this.moduleTitle.find((item: any) => item.id === active.pid);
    this.stairMenu = this.$set({}, 'id', activeParent.id);
  }

  handleReLoad() {
    const permissions = SessionUtil.get('privilegeChilds');
    const temp: any = [];
    if (Array.isArray(permissions) && permissions.length > 0) {
      const visiblePers = permissions.filter((e: any) => {
        return this.hiddenMenus.indexOf(e.name) === -1;
      });
      visiblePers.forEach((element: any) => {
        const routerElement = new RouterElement();
        routerElement.id = element.id;
        routerElement.pid = element.parentId;
        routerElement.name = element.name;
        routerElement.path = element.expression;
        routerElement.iconCls = element.icon;
        routerElement.children = [];
        routerElement.menuOrder = element.menuOrder;
        temp.push(routerElement);
      });
    }
    const result = GenerateTree.generateTree(temp, '');
    const reLoadPath: any = this.$route.fullPath.split('/')[1];
    this.$router.options.routes.forEach((e: any) => {
      if (e.path === reLoadPath) {
        this.reLoadMark = e.name;
      } else {
        e.children.forEach((t: any) => {
          if (t.path === reLoadPath) {
            this.reLoadMark = e.name;
          }
        });
      }
    });
    // result.sort((a: any, b: any) => {
    //   if (a.menuOrder < b.menuOrder) {
    //     return -1;
    //   } else if (a.menuOrder === b.menuOrder) {
    //     return 0;
    //   } else {
    //     return 1;
    //   }
    // });
    this.handleMenuSort(result);
    return result;
  }

  handleCmomand(command: any) {
    const curPath = window.document.location.href;
    const path = curPath.split('/');
    const pathName = path[path.length - 1];
    let commandPath: any = command.path.split('/');
    commandPath = commandPath[commandPath.length - 1];
    if (commandPath === pathName) {
      return;
    }
    const parents = this.secondaryTitle([], [command]);
    const url = '/' + parents.join('/');
    this.$router.push({ path: url });
  }

  /**
   * 回到主页
   * @memberof NavbarComponent
   */
  goHome(item: any) {
    const url = '/' + item.children[0].path;
    this.$router.push({
      path: url
    });
  }

  private returnChildrens(children: Array<any>, data: Array<any>) {
    data.forEach(item => {
      children.push(item.path);
      if (item.children && item.children.length > 0) {
        this.returnChildrens(children, [item.children[0]]);
      }
    });
    return children;
  }

  private secondaryTitle(children: Array<any>, data: Array<any>) {
    data.forEach((item: any) => {
      children.push(item.path);
    });
    return children;
  }

  mouseShow(item: any) {
    this.hoverShow = this.$set({}, 'id', item.id);
  }

  visibleChange(show: any) {
    this.visibleShow = show;
    if (!show) {
      this.hoverShow = this.$set({}, 'id', '');
    }
  }

  handleMenuSort(result: any[]) {
    result.sort((a: any, b: any) => {
      if (a.menuOrder < b.menuOrder) {
        return -1;
      } else if (a.menuOrder === b.menuOrder) {
        return 0;
      } else {
        return 1;
      }
    });
  }
}
