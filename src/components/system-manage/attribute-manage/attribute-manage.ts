import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from './attribute-manage.html';
import Styles from './attribute-manage.module.scss';

import { LevelDefinecontentComponent } from './level-define-content/level-define-content';

import { NewDataSourceComponent } from '@/components/system-manage/attribute-manage/new-data-source/new-data-source';

import { AnchorNavComponent } from '@/components/system-manage/attribute-manage/anchor-nav/anchor-nav';

import { ImportDataSourceComponent } from './import-data-source/import-data-source';

import dataSourceService from '@/api/data-source/data-source.service';
import dSourceDataService from '@/api/data-source/d-data-source.service';

import DataSource from '@/models/data-source/data-source';
// import notifyUtil from '@/common/utils/notifyUtil';
import eventNames from '@/common/events/store-events';

import PriRouter from '@/utils/pri-router';
import Config from '@/utils/config-decorator';
import externalResourceService from '@/api/external-resource/external-resource.service';
import * as R from 'ramda';
import attributeBlackStyle from './attribute-manage.black.module.scss';
import attributeStyle from './attribute-manage.module.scss';
import eventTypeServie from '@/api/base-data-define/event-type.service';
import notifyUtil from '@/common/utils/notifyUtil';
import i18n from '@/i18n';
import communityQrManageService from '@/api/community-qr-manage/community-qr-manage.service';

@Component({
  template: Html,
  style: Styles,
  themes: [
    { name: 'white', style: attributeStyle },
    { name: 'black', style: attributeBlackStyle }
  ],
  components: {
    'el-level-define-content': LevelDefinecontentComponent,
    'new-data-source': NewDataSourceComponent,
    'el-anchor-nav': AnchorNavComponent,
    'import-data-source': ImportDataSourceComponent
  }
})
export class AttributeManageComponent extends Vue {
  /**
   * 当前数据源
   *
   * @type {*}
   * @memberof AttributeManageComponent
   */
  public currentSource: any = {};

  private get rolePrivilege(): any {
    return PriRouter.handleRole('attribute-manage');
  }
  /**
   * 数据源
   *
   * @private
   * @type {*}
   * @memberof AttributeManageComponent
   */
  private dataSourceArr: any = [];

  /**
   * 当前页<暂时不做分页>
   *
   * @private
   * @type {*}
   * @memberof AttributeManageComponent
   */
  private currentPage: any = 1;

  public newSourceVisible = false;

  public isEditSource: boolean = false;

  public importVisible: boolean = false;

  public onScrollTo: number = 0;

  private _beforeScrollTop: any = 0;
  scrollTimer: any;
  stopScroll: boolean = false;

  headerTitle: any = '';

  public page: any = 0;
  public cellIdsMap: Map<string, any> = new Map();

  /**
   * 数据源数据标题
   *
   * @type {string}
   * @memberof AttributeManageComponent
   */
  public detailTitle: string = '';
  searchValue: string = '';
  editStatus: string = '';

  currentIndex: number = 0;

  isDataBull: boolean = false;

  handelPRolePri: boolean = true;

  eventTypes: Array<any> = [];

  // @Config('rmsConfig.useResourceServer')
  useResourceServer: boolean = false;

  @Watch('searchValue')
  async searchValueChange() {
    if (this.searchValue) {
      const keyword = this.searchValue.replace(/\s*/g, '');
      const data = await this.queryDataSource();
      this.dataSourceArr = data.filter((source: any) => source.name.includes(keyword));
      if (this.dataSourceArr.length > 0) {
        this.isDataBull = false;
        this.currentIndex = 0;
        this.currentSource = this.dataSourceArr[0];
      } else {
        this.isDataBull = true;
      }
    } else {
      const data = await this.queryDataSource();
      this.isDataBull = false;
      if (Array.isArray(data) && data.length > 0) {
        this.dataSourceArr = data;
        this.currentIndex = 0;
        this.currentSource = this.dataSourceArr[0];
      }
    }
  }

  onSearchChange(val: any) {
    this.searchValue = val;
  }

  mounted() {
    // this.getEventTypes();
    this.initData();
  }

  private async getEventTypes() {
    const eventTypes = await eventTypeServie.HttpLoadEventTypes();
    if (eventTypes) {
      this.eventTypes = eventTypes;
    }
  }

  private async initData(positionData?: any) {
    this.$store.dispatch(eventNames.layout.SetLoading, true);
    this.dataSourceArr = await this.queryDataSource();
    if (Array.isArray(this.dataSourceArr) && this.dataSourceArr.length > 0) {
      this.currentSource = positionData ? positionData : this.dataSourceArr[0];
      this.detailTitle = this.currentSource.name;
      if (positionData) {
        const index = this.dataSourceArr.findIndex((i: any) => i.id === positionData.id);
        this.currentIndex = index;
        this.currentSource = this.dataSourceArr[index];
        this.$nextTick(() => {
          this.onIndexChange(index);
        });
      } else {
        this.currentIndex = 0;
        this.$nextTick(() => {
          this.onIndexChange(0);
        });
      }
      this.$store.dispatch(eventNames.layout.SetLoading, false);
    } else {
      this.dataSourceArr = [];
      this.$store.dispatch(eventNames.layout.SetLoading, false);
    }
  }

  /**
   * 刷新界面操作
   *
   * @memberof AttributeManageComponent
   */
  onSuccess(data?: any) {
    this.editStatus = '';
    this.initData(data);
  }

  onDeleteSource() {
    this.onSuccess();
  }

  /**
   * 新建数据源
   *
   * @memberof AttributeManageComponent
   */
  onMakeNewDataSource() {
    this.currentSource = new DataSource();
    this.isEditSource = false;
    this.editStatus = 'add';
    this.newSourceVisible = !this.newSourceVisible;
    this.headerTitle = this.$t('data_source.add_attribute');
  }

  /**
   * 导入数据源
   *
   */
  onImportDataSource() {
    this.importVisible = true;
  }

  /**
   * 1. 数据源导入成功，定位到导入数据源[0]
   *
   * @param {*} data
   * @memberof AttributeManageComponent
   */
  onCloseLoad(data: any) {
    if (Array.isArray(data) && data.length > 0) {
      this.initData(data[0]);
    }
  }

  /**
   * 关闭导入数据源窗口
   */
  onCloseImport(visible: any) {
    this.importVisible = visible;
  }

  /**
   * 关闭数据源编辑弹窗
   *
   * @memberof AttributeManageComponent
   */
  onCloseNewDialog() {
    this.newSourceVisible = false;
  }

  /**
   * 编辑数据源
   *
   * @param {*} item
   * @memberof AttributeManageComponent
   */
  onSourceEdit(item: any) {
    if (this.newSourceVisible) {
      this.newSourceVisible = false;
    }
    this.newSourceVisible = true;
    this.currentSource = JSON.parse(JSON.stringify(item));
    this.isEditSource = true;
    this.headerTitle = this.$t('data_source.edit_attribute');
  }

  /**
   * 当前数据源数据分页变化
   *
   * @memberof AttributeManageComponent
   */
  onPageIncrease() {
    this.currentPage = this.currentPage + 1;
  }

  /**
   * 删除数据源数据item
   *
   * @param {*} item
   * @memberof AttributeManageComponent
   */
  onDeleteLeveItem(item: any) {
    dSourceDataService.deleteDDataSource(item.id).then(res => {
      if (res) {
        // this.$message({ message: this.$tc('common.delete_success'), type: 'success' });
        notifyUtil.success(this.$tc('common.delete_success'));
      } else {
        // this.$message({ message: this.$tc('base_data_manage.delete_associated'), type: 'error' });
        notifyUtil.error(this.$tc('common.delete_success'));
        notifyUtil.error(this.$tc(this.$tc('base_data_manage.delete_associated')));
      }
    });
  }

  onAnchorNavclick(item: any) {
    this.currentSource = item;
  }

  onIndexChange(index: number) {
    this.currentIndex = index;
    this.currentSource = this.dataSourceArr[index];
    this.stopScroll = true;
    const scrollWrapper = this.$refs['scrollWrapper'] as HTMLDivElement;
    const contentHeight = scrollWrapper.clientHeight;
    const target = contentHeight * index;
    clearInterval(this.scrollTimer);
    const self = this;
    this.scrollTimer = setInterval(() => {
      const offsetTop = scrollWrapper.scrollTop;
      let step = (target - offsetTop) / 4;
      step = step > 0 ? Math.ceil(step) : Math.floor(step);
      if (Math.abs(target - offsetTop) > step) {
        scrollWrapper.scrollTop += step;
      } else {
        scrollWrapper.scrollTop = target;
        clearInterval(self.scrollTimer);
        self.stopScroll = false;
      }
    }, 24);
  }

  onScroll(event: any) {
    if (this.stopScroll) {
      return;
    }
    const scrollWrapper = this.$refs['scrollWrapper'] as HTMLDivElement;
    const distance = scrollWrapper.clientHeight * Number(this.currentIndex);
    const clientHeight = scrollWrapper.clientHeight;
    const flag = scrollWrapper.scrollTop - distance;
    if (Math.abs(scrollWrapper.scrollTop - distance) > clientHeight * 0.2) {
      scrollWrapper.scrollTop = flag > 0 ? distance + clientHeight : distance - clientHeight;
      this.currentIndex = flag > 0 ? Number(this.currentIndex) + 1 : Number(this.currentIndex) - 1;
      this.currentSource = this.dataSourceArr[Number(this.currentIndex)];
    }
    const navWrapper = this.$refs['navWrapper'] as HTMLDivElement;
    const navDistance = 50 * Number(this.currentIndex);
    if (Math.abs(navWrapper.scrollTop - navDistance) > 50 * 0.1) {
      navWrapper.scrollTop = flag > 0 ? navDistance + 50 : navDistance - 50;
    }
  }
  onNavScroll(event: any, flag: any) {
    // const sourceMark: any = this.$refs['sourceMark'] as HTMLDivElement;
    // const scrollWrapper = this.$refs['scrollWrapper'] as HTMLDivElement;
  }

  // 下载数据源模板
  downloadtmp() {
    const lang = i18n.locale;
    const link: any = document.createElement('a');
    link.href = '/template-file/data-source-template-' + lang + '.7z';
    link.download = 'data-source-template-' + lang + '.7z';
    link.style = 'visibility:hidden';
    document.body.appendChild(link);
    link.click();
  }

  /**
   *查询数据源
   * @memberof AttributeManageComponent
   */
  async queryDataSource() {
    let result = [];
    if (this.useResourceServer) {
      // 对接资源系统
      const externalRes = await externalResourceService.queryDataSource();
      const localRes = await dataSourceService.queryDataSource();
      result = externalRes.concat(localRes);
      result = R.uniqBy((x: any) => x.id, result);
    } else {
      // 使用本系统数据
      result = await dataSourceService.queryDataSource();
      for (let i = 0; i < result.length; i++) {
        const element = result[i];
        if (element.description) {
          const discricts: any = await communityQrManageService.queryDistrictByCode(String(element.description));
          if (Array.isArray(discricts) && discricts.length > 0) {
            element.districtName = discricts[0].name;
          }
        }
      }
      console.log(result);
      const userString = sessionStorage.getItem('userInfo');
      if (userString) {
        const userInfo = JSON.parse(userString);
        if (userInfo.userName === 'manager_pms') {
          return result;
        }
      }
      const districtCode = sessionStorage.getItem('district');
      // 过滤 1. 显示所有数据源的权限  2.当前社区code过滤
      if (!this.rolePrivilege.displayAll) {
        result = result.filter((a: any) => a.description === districtCode && a.tag === '[{\'id\':\'\',\'name\':\'code\',\'description\':\'\'}]');
      } else {
        const publicDataSOurce = result.filter((a: any) => a.description === '');
        const curDataSource = result.filter(
          (a: any) => a.description === districtCode && a.tag === '[{\'id\':\'\',\'name\':\'code\',\'description\':\'\'}]'
        );
        result = publicDataSOurce.concat(curDataSource);
      }

    }
    return result;
  }
}
