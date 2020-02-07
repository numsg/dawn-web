import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';

import template from './component-filter.html';
import style from './component-filter.module.scss';

import { ComponentFilter } from '@gsafety/whatever/dist';
import StoreEvents from '@/common/events/store-events';
import { verifyArrayEmptyOrUndefined, verifyStringPropEmpty } from '@gsafety/whatever/dist/util';
import filterBlackStyle from './component-filter.black.module.scss';

@Component({
  template: template,
  style: style,
  themes: [
    { name: 'white', style: style },
    { name: 'black', style: filterBlackStyle }
  ],
  components: {
    ComponentFilter
  }
})
export class PmsComponentFilter extends Vue {
  @Prop()
  instance: any;
  @Prop({
    default: {}
  })
  extraFilter: any;
  @Prop({
    default: false
  })
  disableExtraFilter!: boolean;
  @Prop({
    default: () => {
      return {
        cleanExtraFilter: true,
        enableTimeFilter: true
      };
    }
  })
  options!: any;
  /**
   * 所有事件类型列表
   *
   * @type {Array<any>}
   * @memberof PmsComponentFilter
   */
  @State((state: any) => {
    return state.eventType.eventTypes.data;
  })
  eventTypes!: Array<any>;
  /**
   * 所有疫情种类列表
   *
   * @type {Array<any>}
   * @memberof PmsComponentPreviewer
   */
  @State((state: any) => {
    return state.PMSComponentManager.componentProps.epidemicTypes;
  })
  epidemicTypes!: Array<any>;
  /**
   * 所有元件类型列表
   *
   * @type {Array<any>}
   * @memberof PmsComponentFilter
   */
  @State((state: any) => {
    return state.PMSComponentManager.componentProps.componentTypes;
  })
  componentTypes!: Array<any>;
  /**
   * 所有资源类型列表
   *
   * @type {Array<any>}
   * @memberof PmsComponentFilter
   */
  @State((state: any) => {
    return state.PMSComponentManager.componentProps.resourceTypes;
  })
  resourceTypes!: Array<any>;
  /**
   * 为元件所选的事件类型
   *
   * @type {Array<any>}
   * @memberof PmsComponentFilter
   */
  selectEventTypes: any = [];
  selectEventTypeName: any = '';
  /**
   * 为元件所选的疫情种类
   *
   * @type {Array<any>}
   * @memberof PmsComponentFilter
   */
  selectEpidemicTypes: any = [];
  selectEpidemicTypeName: any = '';
  /**
   * 所选元件类型
   *
   * @type {*}
   * @memberof PmsComponentFilter
   */
  selectComponentType: any = '';
  selectComponentTypeName: any = '';
  /**
   * 所选资源类型
   *
   * @type {*}
   * @memberof PmsComponentFilter
   */
  selectResourceType: any = '';
  selectResourceTypeName: any = '';

  /**
   * 级联控件默认绑定字段
   *
   * @type {*}
   * @memberof PmsComponentFilter
   */
  defaultProps: any = { children: 'children', label: 'label' };
  /**
   * 附加筛选条件
   *
   * @type {String}
   * @memberof PmsComponentFilter
   */
  extraFilterData: any = [];
  displayResourceTypeSelector: boolean = false;
  displayEpidemicTypeSelector: boolean = false;
  displayHumanInfoSelector: boolean = false;

  @Watch('extraFilter', { deep: true })
  handleExtraFilterChange(val: any) {
    if (!val) {
      return;
    }
    if (val.epidemicTypeId) {
      this.handleEpidemicTypeChange(val.epidemicTypeId);
    }
    if (val.componentTypeId) {
      this.handleComponentTypeChange(val.componentTypeId);
    }
    if (val.eventTypeId) {
      this.handleEventTypeChange(val.eventTypeId);
    }
  }

  @Watch('selectComponentType')
  handleSelectComponentTypeChanged(val: any) {
    if (!verifyArrayEmptyOrUndefined(this.componentTypes)) {
      const result = this.componentTypes.filter((type: any) => {
        return type.id === val;
      });
      if (result.length > 0) {
        this.displayResourceTypeSelector = result[0].name.indexOf('物资信息') >= 0;
        this.displayEpidemicTypeSelector = result[0].name.indexOf('疫情信息') >= 0;
        this.displayHumanInfoSelector = result[0].name.indexOf('人员信息') >= 0;
      }
    }
  }

  created() {
    this.$store.dispatch(StoreEvents.PMSComponentManage.onLoadComponentTypes);
    // this.$store.dispatch(StoreEvents.EventTypes.LoadEventTypes);
    setTimeout(() => {
      this.handleExtraFilterChange(this.extraFilter);
    }, 200);
  }

  /**
   * 处理疫情种类的切换
   *
   * @param {*} val
   * @memberof PmsComponentFilter
   */
  handleEpidemicTypeChange(val: any) {
    this.selectEpidemicTypes = val;
    // 拿到最终的叶子节点id
    const finalType = val[val.length - 1];
    // 在事件类型集合中筛选正确的事件类型对象
    const epidemicTypeData = this.filterEpidemicType(finalType, this.epidemicTypes);
    const matchEpidemicTypeFilter = this.extraFilterData.filter((s: any) => {
      return s.field === 'extraInfo' && s.tag === 'epidemicType';
    });
    const matchIndex = !verifyArrayEmptyOrUndefined(matchEpidemicTypeFilter)
      ? this.extraFilterData.indexOf(matchEpidemicTypeFilter[0])
      : -1;
    if (!verifyStringPropEmpty(epidemicTypeData, 'id')) {
      this.selectEventTypeName = epidemicTypeData.name;
      const filter = {
        field: 'extraInfo',
        tag: 'epidemicType',
        searchContent: finalType
      };
      if (!verifyArrayEmptyOrUndefined(this.extraFilterData) && matchIndex >= 0) {
        this.extraFilterData.splice(matchIndex, 1, filter);
        return;
      }
      this.extraFilterData.push(filter);
    } else {
      this.selectEpidemicTypes = null;
      this.selectEpidemicTypeName = '';
      this.extraFilterData.splice(matchIndex, 1);
    }
  }
  /**
   * 处理事件类型的切换
   *
   * @param {*} val
   * @memberof PmsComponentFilter
   */
  handleEventTypeChange(val: any) {
    this.selectEventTypes = val;
    // 拿到最终的叶子节点id
    const finalType = val[val.length - 1];
    // 在事件类型集合中筛选正确的事件类型对象
    const eventTypeData = this.filterEventType(finalType, this.eventTypes);
    const matchEventTypeFilter = this.extraFilterData.filter((s: any) => {
      return s.field === 'extraInfo' && s.tag === 'eventType';
    });
    const matchIndex = !verifyArrayEmptyOrUndefined(matchEventTypeFilter) ? this.extraFilterData.indexOf(matchEventTypeFilter[0]) : -1;
    if (!verifyStringPropEmpty(eventTypeData, 'id')) {
      this.selectEventTypeName = eventTypeData.name;
      const filter = {
        field: 'extraInfo',
        tag: 'eventType',
        searchContent: finalType
      };
      if (!verifyArrayEmptyOrUndefined(this.extraFilterData) && matchIndex >= 0) {
        this.extraFilterData.splice(matchIndex, 1, filter);
        return;
      }
      this.extraFilterData.push(filter);
    } else {
      this.selectEventTypes = null;
      this.selectEventTypeName = '';
      this.extraFilterData.splice(matchIndex, 1);
    }
  }
  /**
   * 处理事件类型的切换
   *
   * @param {*} val
   * @memberof PmsComponentFilter
   */
  handleResourceTypeChange(val: any) {
    this.selectResourceType = val;
    // 拿到最终的叶子节点id
    const finalType = val[val.length - 1];
    // 在事件类型集合中筛选正确的事件类型对象
    const resourceTypeData = this.filterEventType(finalType, this.resourceTypes);
    const matchResourceTypeFilter = this.extraFilterData.filter((s: any) => {
      return s.field === 'extraInfo' && s.tag === 'resourceType';
    });
    const matchIndex = !verifyArrayEmptyOrUndefined(matchResourceTypeFilter)
      ? this.extraFilterData.indexOf(matchResourceTypeFilter[0])
      : -1;
    if (!verifyStringPropEmpty(resourceTypeData, 'id')) {
      this.selectEventTypeName = resourceTypeData.name;
      const filter = {
        field: 'extraInfo',
        tag: 'resourceType',
        searchContent: finalType
      };
      if (!verifyArrayEmptyOrUndefined(this.extraFilterData) && matchIndex >= 0) {
        this.extraFilterData.splice(matchIndex, 1, filter);
        return;
      }
      this.extraFilterData.push(filter);
    } else {
      this.selectEventTypes = null;
      this.selectEventTypeName = '';
      this.extraFilterData.splice(matchIndex, 1);
    }
  }

  /**
   * 处理元件类型选择切换
   *
   * @param {string} val
   * @memberof PmsComponentFilter
   */
  handleComponentTypeChange(val: string) {
    if (verifyArrayEmptyOrUndefined(this.componentTypes)) {
      this.selectComponentType = null;
      this.selectComponentTypeName = null;
      return;
    }
    const matchComponentTypeFilter = this.extraFilterData.filter((s: any) => {
      return s.field === 'extraInfo' && s.tag === 'componentType';
    });
    const matchIndex = !verifyArrayEmptyOrUndefined(matchComponentTypeFilter)
      ? this.extraFilterData.indexOf(matchComponentTypeFilter[0])
      : -1;
    const result = this.componentTypes.filter((type: any) => {
      return type.id === val;
    });
    if (result.length > 0) {
      const componentType = result[0];
      this.selectComponentType = componentType.id;
      this.selectComponentTypeName = componentType.name;
      const filter = {
        field: 'extraInfo',
        tag: 'componentType',
        searchContent: this.selectComponentType
      };
      if (!verifyArrayEmptyOrUndefined(this.extraFilterData) && matchIndex >= 0) {
        this.extraFilterData.splice(this.extraFilterData.indexOf(result[0]), 1, filter);
        return;
      }
      this.extraFilterData.push(filter);
    } else {
      this.selectComponentType = null;
      this.selectComponentTypeName = null;
      this.extraFilterData.splice(matchIndex, 1);
    }
  }

  /**
   * 根据所选事件类型ID返回对应的事件类型数据
   *
   * @param {string} eventTypeId
   * @param {Array<any>} eventTypes
   * @returns {*}
   * @memberof PmsComponentFilter
   */
  filterEventType(eventTypeId: string, eventTypes: Array<any>): any {
    let data;
    const result = eventTypes.filter((type: any) => {
      return type.id === eventTypeId;
    });
    if (result.length > 0) {
      data = result[0];
    } else {
      for (let index = 0; index < eventTypes.length; index++) {
        const type = eventTypes[index];
        if (Array.isArray(type.children) && type.children.length > 0) {
          data = this.filterEventType(eventTypeId, type.children);
          if (data) {
            break;
          }
        }
      }
    }
    return data;
  }

  /**
   * 根据所选事件类型ID返回对应的事件类型数据
   *
   * @param {string} epidemicTypeId
   * @param {Array<any>} epidemicTypes
   * @returns {*}
   * @memberof PmsComponentFilter
   */
  filterEpidemicType(epidemicTypeId: string, epidemicTypes: Array<any>): any {
    let data;
    const result = epidemicTypes.filter((type: any) => {
      return type.id === epidemicTypeId;
    });
    if (result.length > 0) {
      data = result[0];
    } else {
      for (let index = 0; index < epidemicTypes.length; index++) {
        const type = epidemicTypes[index];
        if (Array.isArray(type.children) && type.children.length > 0) {
          data = this.filterEpidemicType(epidemicTypeId, type.children);
          if (data) {
            break;
          }
        }
      }
    }
    return data;
  }

  /**
   * 处理附加过滤条件的清理逻辑
   *
   * @memberof PmsComponentFilter
   */
  handleCleanFilter() {
    if (this.options.cleanExtraFilter) {
      this.extraFilterData = null;
      this.extraFilterData = [];
      this.selectComponentType = '';
      this.selectEventTypes = null;
      this.selectEventTypes = [];
      this.selectEventTypeName = '';
    }
  }
}
