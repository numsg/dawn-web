import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from './level-define-content.html';
import Styles from './level-define-content.module.scss';

import dataSourceService from '@/api/data-source/data-source.service';

import { DDataSourceTiledComponent } from '@/components/system-manage/attribute-manage/base-data-manage/d-data-source-tiled/d-data-source-tiled';
import { DetailTreeComponent } from '@/components/system-manage/attribute-manage/detail-tree/detail-tree';

import Guid from '@/utils/guid';
import dSourceDataService from '@/api/data-source/d-data-source.service';

import DataSource from '@/models/data-source/data-source';
import DSourceDataModel from '@/models/data-source/d-source-data';
import PriRouter from '@/utils/pri-router';
import notifyUtil from '@/common/utils/notifyUtil';
import Config from '@/utils/config-decorator';
import externalResourceService from '@/api/external-resource/external-resource.service';
import { treeToArray } from '@/common/utils/utils';
import eventNames from '@/common/events/store-events';
import ruleTypeService from '@/api/base-data-define/rule-type.service';
import LimitMessage from '@/utils/message-limit';
import ruleService from '@/api/rule-library-manage/rule-library-manage.service';
import levelBlackStyle from './level-define-content.black.module.scss';
import i18n from '@/i18n';
import store from '@/store';

@Component({
  template: Html,
  style: Styles,
  themes: [{ name: 'white', style: Styles }, { name: 'black', style: levelBlackStyle }],
  name: 'el-level-define-content',
  components: {
    'd-data-source-tiled': DDataSourceTiledComponent,
    'el-detail-tree': DetailTreeComponent
  }
})
export class LevelDefinecontentComponent extends Vue {
  /**
   * 数据源数据
   *
   * @type {Array<any>}
   * @memberof LevelDefinecontentComponent
   */
  public dDataSources: Array<any> = [];

  // 按钮权限
  private get rolePrivilege(): any {
    return PriRouter.handleRole('attribute-manage');
  }

  /**
   * 当前数据源
   *
   * @type {DataSource}
   * @memberof LevelDefinecontentComponent
   */
  public currentSource: DataSource = new DataSource();

  /**
   * 是否展示数据源数据
   *
   * @type {Boolean}
   * @memberof LevelDefinecontentComponent
   */
  public dDataSourceVisible: boolean = true;

  dataSource: Array<DataSource> = [];

  externalDataSource: Array<DataSource> = [];

  isEditDDataSource: boolean = false;

  status: any;
  searchTreeValue: string = '';
  makeNewSource: string = '1';

  private _beforeScrollTop: any = 0;
  scrollTimer: any;
  stopScroll: boolean = false;

  defaultImage: any = require('@/assets/img/data-source/source-default.png');

  // 平铺数据为空
  isNullSearch: boolean = false;

  // 是否拖拽
  public isDrag: boolean = false;

  // 拖拽之前的数据
  public beforeDragData: any = {};

  // 来自资源的数据源禁止删除
  idResourceDelete: boolean = true;

  public dragTitile: string = i18n.t('data_source.drag_sort').toString();

  router: any;
  user: any;

  @Prop() data: any;

  @Prop() currentItem: any;

  @Prop() editStatus: any;

  @Prop() eventTypes: any;

  @Prop({
    default: 0
  })
  currentIndex: any;

  // @Config('rmsConfig.useResourceServer')
  useResourceServer: boolean = false;

  @Config('resourceDataSourceIds')
  resourceDataSourceIds!: any;

  @Watch('currentSource.id')
  onCurrentSourceChange() {
    this.idResourceDelete = true;
    if (this.resourceDataSourceIds) {
      Object.keys(this.resourceDataSourceIds).forEach((key: string) => {
        if (this.resourceDataSourceIds[key] === this.currentSource.id) {
          this.idResourceDelete = false;
        }
      });
    }
  }

  @Watch('isDrag')
  convertDragTitle() {
    if (this.isDrag) {
      this.dragTitile = i18n.t('data_source.cancel_drag').toString();
    } else {
      this.dragTitile = i18n.t('data_source.drag_sort').toString();
    }
  }

  @Watch('currentIndex', { deep: true })
  onCurrentItem(val: any) {
    this.searchTreeValue = '';
    if (this.data && Array.isArray(this.data)) {
      this.onDataSourceClick(this.data[this.currentIndex]);
    }
  }

  @Watch('data')
  ondataChange() {
    if (this.data && Array.isArray(this.data)) {
      this.handleNewData();
    } else {
      this.currentSource = new DataSource();
      this.dataSource = [];
    }
  }

  @Watch('dDataSources')
  onDataSource() {
    if (this.dDataSources.length === 0) {
      this.isNullSearch = true;
    } else {
      this.isNullSearch = false;
    }
  }

  async mounted() {
    this.router = this.$router.currentRoute;
    this.user = sessionStorage.getItem('userInfo');

    await this.queryExternalDataSource();
  }

  onSearchNull(isNull: any) {
    this.isNullSearch = isNull;
  }

  /**
   * build data source about tag
   *
   * @memberof LevelDefinecontentComponent
   */
  handleNewData() {
    this.dataSource = this.data.map((item: any) => {
      const newItem = new DataSource();
      newItem.id = item.id;
      newItem.image = item.image;
      newItem.name = item.name;
      newItem.tags = item.tag && Array.isArray(JSON.parse(item.tag.replace(/\'/g, '"'))) ? JSON.parse(item.tag.replace(/\'/g, '"')) : [];
      newItem.type = item.type;
      newItem.originalId = item.originalId;
      newItem.dSourceDataModels = item.dSourceDataModels;
      newItem.description = item.description;
      return newItem;
    });
    this.currentSource = this.currentItem;
    this.$emit('on-dd-show', this.dDataSourceVisible);
    this.queryDDataSource();
  }

  // 点击数据源
  onDataSourceClick(item: any) {
    this.currentSource = item;
    this.dDataSourceVisible = true;
    // 执行向下点击滚动动画
    // this.$emit('on-dd-show', this.dDataSourceVisible);
    this.isDrag = false;
    this.queryDDataSource();
  }

  /**
   * 编辑数据源
   *
   * @param {*} item
   * @memberof LevelDefinecontentComponent
   */
  onEdit(item: any) {
    this.status = 'edit';
    this.$emit('on-source-item-edit', item);
  }

  /**
   * 删除数据源
   *
   * @param {*} item
   * @memberof LevelDefinecontentComponent
   */
  async onDelete(item: any) {
    // const isUse = await this.isRuleTypeUse(item.id);
    // if (isUse !== -1) {
      // LimitMessage.showMessage({ type: 'warning', message: this.$tc('data_source.data_is_associated_ban') });
    //   notifyUtil.warning(this.$tc('data_source.data_is_associated_ban'));
    //   return;
    // }
    this.$confirm(this.$tc('data_source.delete_unrecoverable'), {
      confirmButtonText: this.$tc('common.determine'),
      cancelButtonText: this.$tc('common.cancel'),
      type: 'warning',
      title: this.$tc('common.prompt'),
      showClose: false
    })
      .then(() => {
        this.deleteDataSource(item, async (res: any) => {
          this.$emit('on-delete-source-success');
          await this.queryExternalDataSource();
          this.$store.dispatch(eventNames.SystemLog.HandleDataDelete, {
            router: this.router,
            user: this.user,
            data: { name: item.name },
            state: 'system_log.state_success',
            dataType: 'data_source'
          });
        });
      })
      .catch(() => {
        return;
      });
  }

  /**
   *1. 数据源是否被规则类型使用
   *
   * @param {*} dataSourceId
   * @returns
   * @memberof LevelDefinecontentComponent
   */
  async isRuleTypeUse(dataSourceId: any) {
    const ruleTypes: any = await ruleTypeService.queryAllRuleTypes();
    let dataSourceUses = '';
    ruleTypes.forEach((element: any) => {
      dataSourceUses += element.ruleInputSources;
      dataSourceUses += element.ruleOutputSources;
    });
    return dataSourceUses.indexOf(dataSourceId);
  }

  /**
   * 数据源数据是否被规则使用
   * @param dataSource
   * @param callBack
   */
  async isRuleUse(data: any) {
    const ruleConditions: any = await ruleService.queryRuleConAssData();
    const ruleDatas: any = await ruleService.queryRulesAssData();
    let str = '';
    ruleConditions.forEach((element: any) => {
      str += element.dSourceDataId;
    });
    ruleDatas.forEach((element: any) => {
      str += element.conditionSourceIds;
      str += element.resultSourceId;
      str += element.resultIds;
    });
    const ids: any = this.treeNodeIds(data, []);
    let result = false;
    ids.forEach((id: any) => {
      if (str.indexOf(id) !== -1) {
        result = true;
      }
    });
    return result;
  }

  /**
   *1. 获取节点下所有的ids
   *
   * @param {*} node
   * @param {Array<String>} ids
   * @returns
   * @memberof LevelDefinecontentComponent
   */
  treeNodeIds(node: any, ids: Array<string>) {
    if (node === undefined || node.id === undefined) {
      return ids;
    }
    ids.push(node.id);
    if (node.children === undefined || !Array.isArray(node.children)) {
      return ids;
    }
    node.children.forEach((element: any) => {
      this.treeNodeIds(element, ids);
    });
    return ids;
  }

  /**
   * 删除数据源
   * @param {Function} callBack
   * @memberof LevelDefinecontentComponent
   */
  async deleteDataSource(dataSource: DataSource, callBack: Function) {
    const useResourceServer = this.isUseResourceServer();
    if (useResourceServer) {
      const resources = await externalResourceService.queryResourcesById(dataSource.originalId).catch(e => {
        console.log(e);
      });
      if (resources && resources.length > 0) {
        // notifyUtil.error(`数据被资源${resources[0].name}使用不可删除`);
        this.$tc('data_source.data_used_ban_delete', undefined, [resources[0].name]);
        return;
      }
      externalResourceService
        .deleteDataSource(dataSource.originalId)
        .then((res: any) => {
          callBack(res);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      dataSourceService
        .deleteDataSource(dataSource.id.toString())
        .then((res: any) => {
          callBack(res);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  /**
   * 删除数据源数据item
   *
   * @param {*} item
   * @memberof LevelDefinecontentComponent
   */
  onDeleteLeveItem(item: any) {
    dSourceDataService.deleteDDataSource(item.item.id).then(res => {
      if (res) {
        this.$store.dispatch(eventNames.SystemLog.HandleDataDelete, {
          router: this.router,
          user: this.user,
          data: item.dataType,
          state: 'system_log.state_success',
          dataType: 'data_source_data'
        });
        notifyUtil.success(this.$tc('common.delete_success'));
        this.dDataSources.splice(item.index, 1);
      } else {
        this.$store.dispatch('HandleDataDeleteError', {
          router: this.router,
          user: this.user,
          data: { name: item.label },
          state: 'system_log.state_fail'
        });
        notifyUtil.warning(this.$tc('base_data_manage.delete_associated'));
      }
    });
  }

  // delete tree node
  async onDeleteLeveTree(data: any, node: any) {
    const isUse = await this.isRuleUse(data);
    if (isUse) {
      // LimitMessage.showMessage({ type: 'warning', message: this.$tc('data_source.data_is_associated_ban') });
      notifyUtil.warning(this.$tc('data_source.data_is_associated_ban'));
      return;
    }
    this.deleteDDataSource(data, (res: any) => {
      if (res) {
        this.$store.dispatch(eventNames.SystemLog.HandleDataDelete, {
          router: this.router,
          user: this.user,
          data: { name: data.label },
          state: 'system_log.state_success',
          dataType: 'data_source_data'
        });
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex((d: any) => d.id === data.id);
        children.splice(index, 1);
        notifyUtil.success(this.$tc('common.delete_success'));
      } else {
        notifyUtil.warning(this.$tc('base_data_manage.delete_associated'));
      }
    });
  }

  /**
   * 删除数据源数据项
   * @param {DSourceDataModel} dDataSource
   * @memberof LevelDefinecontentComponent
   */
  async deleteDDataSource(dDataSource: DSourceDataModel, callBack: Function) {
    const useResourceServer = this.isUseResourceServer();
    if (useResourceServer) {
      const resources = await externalResourceService.queryResourcesById(dDataSource.id).catch(e => {
        console.log(e);
      });
      if (resources && resources.length > 0) {
        // notifyUtil.error(`数据被资源${resources[0].name}使用不可删除`);
        this.$tc('data_source.data_used_ban_delete', undefined, [resources[0].name]);
        return;
      }
      externalResourceService.deleteDDataSource(dDataSource.id).then((res: any) => {
        callBack(res);
      });
    } else {
      dSourceDataService.deleteDDataSource(dDataSource.id.toString()).then((res: any) => {
        callBack(res);
      });
    }
  }

  /**
   * 保存当前d data 编辑
   *
   * @param {*} item
   * @memberof LevelDefinecontentComponent
   */
  async onEditSaveItem(item: any, beforEdit: any) {
    const flag = await this.isNameDuplicate(item);
    if (flag) {
      item.name = beforEdit.name;
      notifyUtil.warning(this.$tc('base_data_manage.repeat_name'));
      return;
    }
    const temp = new DSourceDataModel();
    temp.id = item.id;
    temp.name = item.name;
    temp.pid = item.pid;
    temp.dataSourceId = item.dataSourceId;
    temp.image = item.image;
    temp.imgColor = item.imgColor;
    const result = await dSourceDataService.modifyDDataSource(temp);
    if (result) {
      this.$store.dispatch(eventNames.SystemLog.HandleDataEdit, {
        router: this.router,
        user: this.user,
        data: beforEdit,
        dataType: 'data_source_data',
        state: 'system_log.state_success'
      });
      notifyUtil.success(this.$tc('base_data_manage.update_success'));
    }
  }

  /**
   * 新增数据源数据
   *
   * @param {*} item
   * @memberof LevelDefinecontentComponent
   */
  async onAddDDataItem(item: any) {
    const temp = new DSourceDataModel();
    temp.name = item.name ? item.name : item.label;
    temp.dataSourceId = this.currentSource.id;
    temp.pid = item.pid;
    temp.id = item.id;
    temp.imgColor = item.imgColor;
    temp.image = item.image;
    temp.sort = item.sort;
    const flag = await this.isNameDuplicate(temp);
    if (flag) {
      notifyUtil.warning(this.$tc('base_data_manage.repeat_name'));
      return;
    }
    const res: any = await dSourceDataService.addDDataSource(temp);
    if (res && res.id) {
      this.$store.dispatch(eventNames.SystemLog.HandleDataAdd, {
        router: this.router,
        user: this.user,
        data: res,
        state: 'system_log.state_success',
        dataType: 'data_source_data'
      });
      notifyUtil.success(this.$tc('base_data_manage.success_new'));
      this.dDataSources.push(item);
    } else {
      notifyUtil.error(this.$tc('base_data_manage.error_new'));
    }
  }

  // 判断名称是否重复
  async isNameDuplicate(addTag: any) {
    let repeat = false;
    const useResourceServer = this.isUseResourceServer();
    if (useResourceServer) {
      repeat = await externalResourceService.isNameDuplicate(addTag.name).catch(e => {
        console.log(e);
      });
    } else {
      const res = await dSourceDataService.queryDDataSource(this.currentSource.id.toString()).catch(e => {
        console.log(e);
      });
      const index = res.findIndex((item: any) => item.name.trim() === addTag.name.trim() && item.id !== addTag.id);
      repeat = index >= 0;
    }
    return repeat;
  }

  /**
   * 新增数据源数据
   * @param {*} item
   * @memberof LevelDefinecontentComponent
   */
  async onAddDDataTree(item: any, node: any) {
    const flag = this.isRepeatData(item);
    if (flag) {
      // LimitMessage.showMessage({ type: 'error', message: this.$tc('base_data_manage.repeat_name') });
      notifyUtil.error(this.$tc('base_data_manage.repeat_name'));
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d: any) => d.id === item.id);
      children.splice(index, 1);
      return;
    }
    const temp = new DSourceDataModel();
    temp.name = item.name ? item.name : item.label;
    temp.dataSourceId = this.currentSource.id;
    temp.pid = item.pid;
    temp.id = item.id;
    temp.imgColor = item.imgColor;
    temp.image = item.image;
    temp.sort = item.sort;
    const res: any = await this.addDDataSource(temp);
    if (res && res.id) {
      this.$store.dispatch(eventNames.SystemLog.HandleDataAdd, {
        router: this.router,
        user: this.user,
        data: res,
        state: 'system_log.state_success',
        dataType: 'data_source_data'
      });
      notifyUtil.success(this.$tc('base_data_manage.success_new'));
      // this.queryDDataSource();
      this.setNewNodeId(this.dDataSources, temp, res);
    } else {
      notifyUtil.error(this.$tc('base_data_manage.error_new'));
    }
  }

  /**
   *1. 判断数据源数据新增节点是否重复
   *
   * @param {*} node
   * @returns
   * @memberof LevelDefinecontentComponent
   */
  isRepeatData(node: any) {
    let same: any = null;
    if (node.pid === this.currentItem.originalId) {
      same = this.dDataSources.filter((e: any) => e.label === node.label && e.id !== node.id);
    } else {
      const result = this.getTreeChild(this.dDataSources, node.pid, []);
      same = result.filter((e: any) => e.label === node.label && e.id !== node.id);
    }
    // if (node.pid !== '-1') {
    //   const result = this.getTreeChild(this.dDataSources, node.pid, []);
    //   same = result.filter((e: any) => e.label === node.label && e.id !== node.id);
    // } else {
    //   same = this.dDataSources.filter((e: any) => e.label === node.label && e.id !== node.id);
    // }
    return same.length > 0;
  }

  /**
   *获取兄弟节点
   *
   * @param {*} data
   * @param {*} pid
   * @returns
   * @memberof LevelDefinecontentComponent
   */
  getTreeChild(data: any, pid: any, broderNodes: any) {
    if (!Array.isArray(data) || data.length < 1) {
      return broderNodes;
    }
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === pid) {
        broderNodes = data[i].children;
        break;
      }
      if (Array.isArray(data[i].children) && data[i].children.length > 0) {
        this.getTreeChild(data[i].children, pid, broderNodes);
      }
    }
    return broderNodes;
  }

  /**
   * 根据服务返回值给新增节点重新赋id
   * @param {DSourceDataModel} oldData
   * @param {DSourceDataModel} newData
   * @memberof LevelDefinecontentComponent
   */
  setNewNodeId(dDataSources: any[], oldData: DSourceDataModel, newData: DSourceDataModel) {
    dDataSources.forEach(e => {
      if (e.id === oldData.id) {
        e.id = newData.id;
        return;
      }
      if (e.children && e.children.length > 0) {
        this.setNewNodeId(e.children, oldData, newData);
      }
    });
  }

  /**
   * 新增数据源
   * @param {DSourceDataModel} dDataSource
   * @returns
   * @memberof LevelDefinecontentComponent
   */
  async addDDataSource(dDataSource: DSourceDataModel) {
    const useResourceServer = this.isUseResourceServer();
    if (useResourceServer) {
      dDataSource.dataSourceId = this.currentSource.originalId;
      return await externalResourceService.addDDataSource(dDataSource);
    } else {
      return await dSourceDataService.addDDataSource(dDataSource);
    }
  }

  /**
   * 判断是不是是资源服务的数据
   * @memberof LevelDefinecontentComponent
   */
  isUseResourceServer() {
    return this.useResourceServer && this.externalDataSource.map(e => e.id).includes(this.currentSource.id);
  }

  /**
   * 查询资源系统数据
   * @memberof LevelDefinecontentComponent
   */
  async queryExternalDataSource() {
    if (this.useResourceServer) {
      this.externalDataSource = await externalResourceService.queryDataSource();
    }
  }

  /**
   * 查询数据源数据
   * @memberof LevelDefinecontentComponent
   */
  async queryDDataSource() {
    this.dDataSources = [];
    let data: any = [];
    const useResourceServer = this.isUseResourceServer();
    const dataSourceId = useResourceServer ? this.currentSource.originalId.toString() : this.currentSource.id.toString();
    if (useResourceServer) {
      data = await externalResourceService.findDDataSourceByDataSourceId(dataSourceId);
    } else {
      data = await dSourceDataService.findDDataSourceByDataSourceId(dataSourceId);
    }

    if (Array.isArray(data) && data.length > 0) {
      data.forEach((element: any) => {
        if (element.image) {
          element.image = JSON.parse(element.image.replace(/\'/g, '"'));
        }
        if (element.multiTenancy) {
          element['multiTenancyData'] = this.handleMultiTenancyData(element.multiTenancy);
        }
      });
      if (data[0].dataSourceId === this.currentSource.id) {
        this.dDataSources =
          this.currentSource.type === 1 ? dSourceDataService.buildTree(data, useResourceServer ? dataSourceId : '-1') : data;
      }
    } else {
      this.dDataSources = [];
    }
  }

  private handleMultiTenancyData(multiTenancy: any) {
    const arr = multiTenancy.split(';');
    const tempArr: any = [];
    if (arr && Array.isArray(arr) && arr.length > 0) {
      arr.forEach((item: any) => {
        const eventType = this.eventTypes.find((i: any) => i.id === item);
        if (eventType) {
          const temp = Object.assign({}, eventType);
          temp.image = eventType.image;
          tempArr.push(temp);
        }
      });
    }
    return tempArr;
  }

  /**
   * 关闭列表数据源数据
   *
   * @memberof AttributeManageComponent
   */
  onCloseDDataSource() {
    this.dDataSourceVisible = false;
    this.$emit('on-dd-show', this.dDataSourceVisible);
  }

  async onDDataTreeEdit(data: any, beforEditNode: any) {
    const flag = this.isRepeatData(data);
    if (flag) {
      data.label = beforEditNode.label;
      // LimitMessage.showMessage({ type: 'error', message: this.$tc('base_data_manage.repeat_name') });
      notifyUtil.error(this.$tc('base_data_manage.repeat_name'));
      return;
    }
    const param = new DSourceDataModel();
    param.id = data.id;
    param.name = data.label;
    param.pid = data.pid;
    // tslint:disable-next-line:quotemark
    param.image = data.image !== '""' ? data.image.replace(/\"/g, "'") : '';
    param.imgColor = data.imgColor;
    param.dataSourceId = this.currentSource.id;
    const issuccess = await this.modifyDDataSource(param);
    if (issuccess) {
      notifyUtil.success(this.$tc('base_data_manage.update_success'));
    } else {
      notifyUtil.error(this.$tc('base_data_manage.update_error'));
    }
  }

  /**
   * 修改数据源数据
   * @param {DSourceDataModel} param
   * @memberof LevelDefinecontentComponent
   */
  async modifyDDataSource(param: DSourceDataModel) {
    const useResourceServer = this.isUseResourceServer();
    if (useResourceServer) {
      param.dataSourceId = this.currentSource.originalId;
      return await externalResourceService.modifyDDataSource(param);
    } else {
      return await dSourceDataService.modifyDDataSource(param);
    }
  }

  onMakeNewNode() {
    this.$emit('tree-add-node', true);
    this.makeNewSource = Guid.newGuid();
  }

  stopPropagation(e: any) {
    e.preventDefault();
    e.stopPropagation();
  }

  // 拖拽排序
  async onDragSort(dataArr: any) {
    this.isDrag = false;
    const result = await this.updateDSourceDataSort(dataArr, this.currentSource.type);
    if (result !== null && result.length > 0) {
      notifyUtil.success(this.$tc('base_data_manage.update_sort_success'));
      this.$store.dispatch(eventNames.SystemLog.UpdateDSourceDataSort, {
        router: this.router,
        user: this.user,
        data: this.currentSource,
        state: true
      });
    } else {
      this.$store.dispatch(eventNames.SystemLog.UpdateDSourceDataSort, {
        router: this.router,
        user: this.user,
        data: this.currentSource,
        state: false
      });
      notifyUtil.error(this.$tc('base_data_manage.update_sort_error'));
    }
  }

  /**
   * 排序
   * @param {DSourceDataModel[]} dataSources
   * @param {number} type
   * @memberof LevelDefinecontentComponent
   */
  async updateDSourceDataSort(dataSources: DSourceDataModel[], type: number) {
    const useResourceServer = this.isUseResourceServer();
    if (useResourceServer) {
      if (type === 1) {
        const dataList: any[] = treeToArray(dataSources);
        return await externalResourceService.updateDSourceDataSort(dataList);
      } else {
        return await externalResourceService.updateDSourceDataSort(dataSources);
      }
    } else {
      return await dSourceDataService.UpdateDSourceDataSort(dataSources, type);
    }
  }

  // 点击拖拽
  drag() {
    if (this.isDrag) {
      this.$confirm(this.$tc('base_data_manage.confirm_leave_no_save'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(() => {
          this.cancelDrag();
        })
        .catch(() => {});
      return;
    } else {
      this.isDrag = true;
      this.beforeDragData = JSON.parse(JSON.stringify(this.dDataSources));
      return;
    }
  }

  // 取消拖拽
  cancelDrag() {
    this.isDrag = false;
    this.dDataSources = this.beforeDragData;
  }
}
