import { Vue, Component } from 'vue-property-decorator';
import HomeStyle from './home.module.scss';
import HomeHtml from './home.html';
import Draggable from 'vuedraggable';

import TWEEN from 'three-tween';
import WebglService from './webgl/webgl.service';
import { Getter } from 'vuex-class';
import Plan from '@/models/plan-manage/plan';
import eventNames from '@/common/events/store-events';
import homePageService from '@/api/home-page/home-page.service';
import { HomePageConfig } from '@/models/home/home-page-config';
import SessionStorage from '@/utils/session-storage';
import PageType from '@/models/home/page-type';
import mapperManagerService from '@/common/odata/mapper-manager.service';
import TypeData from '@/models/home/type-data';
import PriRouter from '@/utils/pri-router';
import notifyUtil from '@/common/utils/notifyUtil';
import homeStyle from './home.module.scss';
import homeBlackStyle from './home.black.module.scss';
import i18n from '@/i18n';
import { getUuid32 } from '@gsafety/cad-gutil/dist/utilhelper';
// import { EpidemicDynamicComponent } from './epidemic-dynamic/epidemic-dynamic';
import { RegionalStatistics } from './regional-statistics/regional-statistics';
import { EpidemicTrends } from './epidemic-trends/epidemic-trends';
import { EpidemicCumulativeTrends } from './epidemic-cumulative-trends/epidemic-cumulative-trends';
import { EpidemicDeathTrends } from './epidemic-death-trends/epidemic-death-trends';
import { DailyInvestigate } from './statistics/daily-investigate/daily-investigate';
import { HebdomadDiagonsis } from './statistics/hebdomad-diagonsis/hebdomad-diagonsis';
import { EpidemicDistribution } from './epidemic-distribution/epidemic-distribution';

@Component({
  template: HomeHtml,
  style: HomeStyle,
  themes: [
    { name: 'white', style: homeStyle },
    { name: 'black', style: homeBlackStyle }
  ],
  components: {
    Draggable,
    EpidemicTrends,
    RegionalStatistics,
    EpidemicCumulativeTrends,
    EpidemicDeathTrends,
    DailyInvestigate,
    HebdomadDiagonsis,
    EpidemicDistribution
  }
  // beforeRouteLeave(to: any, next: any) {
  //   const el: any = this;
  //   el.toRouter = to;
  //   if (el.editMode) {
  //     el.routerLeaveDialogVisible = true;
  //   } else {
  //     next();
  //   }
  // }
})
export class HomeComponent extends Vue {
  composingDialog: boolean = false; // 编辑排版弹窗
  moduleDialog: boolean = false; // 添加模块弹窗

  types = [
    {
      id: getUuid32(),
      typeName: 'one',
      desc: i18n.t('home.layout_1'),
      items: [
        {
          id: getUuid32(),
          index: 1,
          flex: 1,
          span: 10,
          dataList: []
        }
      ]
    },
    {
      id: getUuid32(),
      typeName: 'two',
      desc: i18n.t('home.layout_2'),
      items: [
        {
          id: getUuid32(),
          index: 1,
          flex: 1,
          span: 5,
          dataList: []
        },
        {
          id: getUuid32(),
          index: 2,
          flex: 1,
          span: 5,
          dataList: []
        }
      ]
    },
    {
      id: getUuid32(),
      typeName: 'three',
      desc: i18n.t('home.layout_3'),
      items: [
        {
          id: getUuid32(),
          index: 1,
          flex: 3,
          span: 3,
          dataList: []
        },
        {
          id: getUuid32(),
          index: 2,
          flex: 7,
          span: 7,
          dataList: []
        }
      ]
    },
    {
      id: getUuid32(),
      typeName: 'four',
      desc: i18n.t('home.layout_4'),
      items: [
        {
          id: getUuid32(),
          index: 1,
          flex: 7,
          span: 7,
          dataList: []
        },
        {
          id: getUuid32(),
          index: 2,
          flex: 3,
          span: 3,
          dataList: []
        }
      ]
    },
    {
      id: getUuid32(),
      typeName: 'five',
      desc: i18n.t('home.layout_5'),
      items: [
        {
          id: getUuid32(),
          index: 1,
          flex: 1,
          span: 3,
          dataList: []
        },
        {
          id: getUuid32(),
          index: 2,
          flex: 1,
          span: 3,
          dataList: []
        },
        {
          id: getUuid32(),
          index: 3,
          flex: 1,
          span: 3,
          dataList: []
        }
      ]
    }
  ];

  private get rolePrivilege(): any {
    return PriRouter.handleRole('index');
  }

  currentType: PageType = new PageType();

  moduleList = [
    // {
    //   id: '1',
    //   title: '江夏区确诊病例分布总览',
    //   added: false,
    //   // image: require('@/assets/img/home/navigation-guidance-' + i18n.locale + '.png'),
    //   componentName: 'regional-statistics',
    //   privilege: this.rolePrivilege.navigation,
    //   desc: 'home.plan_system_meaning'
    // },
    {
      id: '4',
      title: '日常排查人员统计',
      added: false,
      componentName: 'daily-investigate-statistics',
      privilege: this.rolePrivilege.navigation,
      desc: 'home.plan_system_meaning'
    },
    {
      id: '5',
      title: '治愈、死亡人员 7日数据统计',
      added: false,
      componentName: 'epidemic-death-trends',
      privilege: this.rolePrivilege.navigation,
      desc: 'home.plan_system_meaning'
    },
    {
      id: '6',
      title: '确诊 疑似 发热 接触人员7日数据统计',
      added: false,
      componentName: 'epidemic-trends',
      privilege: this.rolePrivilege.navigation,
      desc: 'home.plan_system_meaning'
    },
    {
      id: '7',
      title: '社区疫情分布情况统计',
      added: false,
      componentName: 'epidemic-distribution',
      privilege: this.rolePrivilege.rapidPreparation,
      desc: 'home.repid_preparation_preplan_description'
    }
  ];

  drag: boolean = false;

  /**
   * 编辑模式
   */
  editMode: boolean = false;

  dragOptions = {
    animation: 200,
    disabled: false
  };

  camera: any;
  composingScene: any;
  renderer: any;
  controls: any;

  isHover: boolean = false;
  webglShowType: string = 'table';

  moduleScene: any;
  moduleCamera: any;
  moduleRenderer: any;
  moduleControls: any;
  moduleTaggets: any = {
    table: [],
    helix: []
  };
  moduleObjects: any[] = [];

  composingWebgl: any;

  moduleWebgl: any;

  homeScroll: boolean = false;

  @Getter('planCensus_plans')
  allPlans!: Plan[];

  pageConfig: HomePageConfig = new HomePageConfig();

  originalType: PageType = new PageType();

  routerLeaveDialogVisible: boolean = false;

  toRouter: any;

  nodataBg: string = '';

  get userInfo(): any {
    if (SessionStorage.get('userInfo')) {
      return SessionStorage.get('userInfo');
    }
  }

  async created() {
    this.nodataBg = '/themes/white/img/home/add-module-' + i18n.locale + '.png';
    console.log(this.nodataBg);
    // this.moduleList = this.moduleList.filter(e => e.privilege);
    // const result = await homePageService.getHomePageConfig(this.userInfo.id).catch(e => {
    //   console.log(e);
    // });
    // if (result) {
    //   this.pageConfig = result;
    //   this.originalType = JSON.parse(this.pageConfig.config);
    //   this.currentType = JSON.parse(this.pageConfig.config);
    //   this.currentType.items.forEach(e => {
    //     e.dataList.forEach(data => {
    //       const moduleItem = this.moduleList.find(m => m.id === data.id);
    //       if (moduleItem) {
    //         moduleItem.added = true;
    //         data.privilege = moduleItem.privilege;
    //       }
    //     });
    //   });
    //   return;
    // }
    this.currentType = JSON.parse(JSON.stringify(this.types[1]));
    const len = this.currentType.items.length;
    const index = Math.ceil(this.moduleList.length / len);
    for (let i = 0; i < this.currentType.items.length; i++) {
      const element = this.currentType.items[i];
      const dataList = this.moduleList.slice(i * index, (i + 1) * index);
      dataList.forEach(e => {
        e.added = true;
        const dataItem = new TypeData();
        mapperManagerService.mapper(e, dataItem);
        element.dataList.push(dataItem);
      });
    }
    this.originalType = JSON.parse(JSON.stringify(this.currentType));
  }

  async mounted() {}

  /**
   * 保存首页配置
   * @memberof HomeComponent
   */
  async savePageConfig() {
    this.pageConfig.id = this.userInfo.id;
    this.pageConfig.config = JSON.stringify(this.currentType);
    const result = await homePageService.saveHomePageConfig(this.pageConfig);
    if (result && result.status === 200) {
      this.originalType = JSON.parse(this.pageConfig.config);
      this.editMode = !this.editMode;
      const user: any = sessionStorage.getItem('userInfo');
      this.$store.dispatch(eventNames.SystemLog.UpdateHomePage, {
        router: { name: 'home' },
        user: user
      });
      notifyUtil.success(this.$tc('home.save_configuration_successful'));
    } else {
      notifyUtil.error(this.$tc('home.save_configuration_error'));
    }
  }

  /**
   * 取消编辑
   * @memberof HomeComponent
   */
  cancelEdit() {
    this.currentType = JSON.parse(JSON.stringify(this.originalType));
    this.editMode = false;
  }

  chooseType(type: any) {
    if (this.currentType.typeName === type.typeName) {
      this.composingDialog = false;
      return;
    }
    const items = JSON.parse(JSON.stringify(this.currentType.items));
    switch (type.typeName) {
      case 'one':
        const dataList: any[] = [];
        items.forEach((e: any) => {
          // dataList = dataList.concat(e.dataList);
          Array.prototype.push.apply(dataList, e.dataList);
        });
        const choosedType: any = this.types.find(e => e.typeName === type.typeName);
        // this.currentType = this.types.find(e => e.typeName === type.typeName);
        mapperManagerService.mapper(choosedType, this.currentType);
        this.currentType.items[0].dataList = dataList;
        break;
      case 'two':
      case 'three':
      case 'four':
      case 'five':
        let colOneDataList = [];
        const colTwoDataList: any[] = [];
        colOneDataList = JSON.parse(JSON.stringify(this.currentType.items[0].dataList));
        items.forEach((e: any) => {
          if (e.index !== 1) {
            Array.prototype.push.apply(colTwoDataList, e.dataList);
          }
        });
        // this.currentType = this.types.find(e => e.typeName === type.typeName);
        const choosed = this.types.find(e => e.typeName === type.typeName);
        mapperManagerService.mapper(choosed, this.currentType);
        this.currentType.items[0].dataList = colOneDataList;
        this.currentType.items[1].dataList = colTwoDataList;
        if (type.typeName === 'five') {
          this.currentType.items[2].dataList = [];
        }
        break;
    }
    this.composingDialog = false;
  }

  handleDialogClose() {
    if (this.composingWebgl) {
      this.composingWebgl.destory();
    }
    if (this.moduleWebgl) {
      this.moduleWebgl.destory();
    }
    this.composingWebgl = null;
    this.moduleWebgl = null;
  }

  closeDialog() {
    this.moduleDialog = false;
    this.composingDialog = false;
  }

  handleAdd() {}

  handleRemoved() {}

  handleModuleAdd(component: any) {
    let item = this.currentType.items[0];
    this.currentType.items.forEach((e: any) => {
      const len = item.dataList.length;
      if (len > e.dataList.length) {
        item = e;
      }
    });
    component.added = true;
    const typedata = new TypeData();
    mapperManagerService.mapper(component, typedata);
    item.dataList.push(typedata);
    this.moduleDialog = false;
  }

  handleModuleRemove(data: any, item: any) {
    this.currentType.items.forEach((e: any) => {
      if (e.id === item.id) {
        data.added = false;
        e.dataList = e.dataList.filter((i: any) => i.id !== data.id);
      }
    });
    this.moduleList.forEach(e => {
      if (e.id === data.id) {
        e.added = false;
      }
    });
  }

  handleComposingBtnClick() {
    this.composingDialog = true;
    this.$nextTick(() => {
      // this.composingWebglInit();
      // this.animate();
      if (!this.composingWebgl) {
        // this.composingWebgl = new WebglService('container', this.types, 120, 780, 280, 200);
        this.composingWebgl = new WebglService('composingContainer', 'composing', this.types, 200, 200, 780, 450, 200);
      }
      this.composingWebgl.transform('table', 1000);
      this.composingWebgl.animate();
    });
  }

  handleModultBtnClick() {
    this.moduleDialog = true;
    this.$nextTick(() => {
      if (!this.moduleWebgl) {
        // this.moduleWebgl = new WebglService('moduleContainer', this.moduleList, 200, 780, 450, 200);
        this.moduleWebgl = new WebglService('moduleContainer', 'module', this.moduleList, 610, 348, 1400, 1220, 200);
      }
      this.moduleWebgl.transform('helix', 1000);
      this.moduleWebgl.animate();
    });
  }

  handleTableClick() {
    this.webglShowType = 'table';
    this.composingWebgl.transform('table', 1000);
  }

  handleHelixClick() {
    this.webglShowType = 'helix';
    this.composingWebgl.transform('helix', 1000);
  }

  handleModuleTableClick() {
    this.moduleWebgl.transform('table', 1000);
  }

  handleModuleHelixClick() {
    this.moduleWebgl.transform('helix', 1000);
  }

  /**
   *编辑模板弹窗关闭
   * @memberof HomeComponent
   */
  handleComposingDialogClose() {
    TWEEN.removeAll();
  }

  handleChoose() {}

  handleMoveCallback() {}

  handleStartDrag() {
    this.drag = true;
  }

  handleEndDrag() {
    this.drag = false;
  }

  async routeLeave(isLeave: boolean) {
    if (isLeave) {
      this.editMode = false;
      this.routerLeaveDialogVisible = false;
      this.$router.push({ name: this.toRouter.name });
    } else {
      this.routerLeaveDialogVisible = false;
    }
  }

  onScroll() {
    this.homeScroll = true;
  }

  handleHomeScroll() {
    this.homeScroll = false;
  }

  beforeDestroy() {
    // this.savePageConfig();
    // this.composingWebgl = null;
    // this.moduleWebgl = null;
    this.handleDialogClose();
  }
}
