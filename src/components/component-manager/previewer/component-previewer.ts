import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import template from './component-previewer.html';
import styles from './component-previewer.module.scss';
import blackStyle from './component-previewer.black.module.scss';
import { State } from 'vuex-class';
import { ComponentPreviewer } from '@gsafety/whatever/dist';
import { TagComponent } from '../../share/tag-component/tag-component';
import './overwrite.scss';

@Component({
  name: 'pms-component-previewer',
  template: template,
  style: styles,
  themes: [
    { name: 'white', style: styles },
    { name: 'black', style: blackStyle }
  ],
  components: { ComponentPreviewer, TagComponent }
})
export class PmsComponentPreviewer extends Vue {
  /**
   * 元件附加属性
   *
   * @type {*}
   * @memberof PmsComponentPreviewer
   */
  @Prop({
    default: () => {
      return { tag: '' };
    }
  })
  componentExtraInfo: any;
  @Prop({
    default: () => {
      return {};
    }
  })
  previewer: any;
  @Prop({
    default: () => {
      return {
        showComponentTitle: false,
        normalDisplay: false,
        showBasicInfo: true,
        readMode: false,
        printMode: false
      };
    }
  })
  options!: any;
  @Prop({
    default: 'component'
  })
  target!: string;
  /**
   * 所有事件类型列表
   *
   * @type {Array<any>}
   * @memberof PmsComponentPreviewer
   */
  @State((state: any) => {
    return state.eventType.eventTypes.data;
  })
  eventTypes!: Array<any>;
  /**
   * 所有元件类型列表
   *
   * @type {Array<any>}
   * @memberof PmsComponentPreviewer
   */
  @State((state: any) => {
    return state.PMSComponentManager.componentProps.componentTypes;
  })
  componentTypes!: Array<any>;

  /**
   * 为元件所选的事件类型
   *
   * @type {Array<any>}
   * @memberof PmsComponentPreviewer
   */
  selectEventTypes: Array<any> = [];

  /**
   * 级联控件默认绑定字段
   *
   * @type {*}
   * @memberof PmsComponentPreviewer
   */
  defaultProps: any = { children: 'children', label: 'label' };
  /**
   * 所选元件类型
   *
   * @type {*}
   * @memberof PmsComponentPreviewer
   */
  selectComponentType: any = '';
  /**
   * 添加的标签
   *
   * @type {*}
   * @memberof PmsComponentPreviewer
   */
  tags: any = '';

  created() {
    this.intializeOptions(this.componentExtraInfo);
  }

  /**
   * 初始化界面数据
   *
   * @param {*} options
   * @memberof PmsComponentPreviewer
   */
  intializeOptions(options: any) {
    if (options) {
      this.selectComponentType = options.cellTypeId
        ? options.cellTypeId
        : Array.isArray(this.componentTypes) && this.componentTypes.length > 0
        ? this.componentTypes[0].id
        : '';
      this.selectEventTypes = [options.eventTypeId ? options.eventTypeId : ''];
      this.tags = null;
      this.tags = options.tag;
      this.handleComponentTypeChange(this.selectComponentType);
    }
  }

  /**
   * 处理事件类型的切换
   *
   * @param {*} val
   * @memberof PmsComponentPreviewer
   */
  handleEventTypeChange(val: any) {
    const finalType = val[val.length - 1];
    const eventTypeData = this.filterEventType(finalType, this.eventTypes);
    if (eventTypeData && Object.keys(eventTypeData).indexOf('id') >= 0) {
      this.$set(this.componentExtraInfo, 'eventTypeId', eventTypeData.id);
      this.$set(this.componentExtraInfo, 'eventTypeName', eventTypeData.name);
    }
    this.selectEventTypes = val;
  }

  /**
   * 处理元件类型选择切换
   *
   * @param {string} val
   * @memberof PmsComponentPreviewer
   */
  handleComponentTypeChange(val: string) {
    if (Array.isArray(this.componentTypes) && this.componentTypes.length > 0) {
      const result = this.componentTypes.filter((type: any) => {
        return type.id === val;
      });
      if (result.length > 0) {
        this.$set(this.componentExtraInfo, 'cellTypeId', result[0].id);
        this.$set(this.componentExtraInfo, 'cellTypeName', result[0].name);
      }
    }
  }
  /**
   * 处理标签项的改变
   *
   * @param {*} val
   * @memberof PmsComponentPreviewer
   */
  handleTagsChange(val: any) {
    this.tags = '';
    if (Array.isArray(val.tags) && val.tags.length > 0) {
      val.tags.forEach((tag: any) => {
        this.tags += tag + ',';
      });
    }
    this.tags = this.tags.substring(0, this.tags.length - 1);
    this.$set(this.componentExtraInfo, 'tag', this.tags);
  }

  /**
   * 根据所选事件类型ID返回对应的事件类型数据
   *
   * @param {string} eventTypeId
   * @param {Array<any>} eventTypes
   * @returns {*}
   * @memberof PmsComponentPreviewer
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

  handlePreviewValidation(flag: any) {
    this.$emit('on-info-validated', flag);
  }

  beforeDestroy() {
    // this.$set(this.componentExtraInfo, 'cellTypeId', null);
    // this.$set(this.componentExtraInfo, 'cellTypeName', null);
    // this.$set(this.componentExtraInfo, 'eventTypeId', null);
    // this.$set(this.componentExtraInfo, 'eventTypeName', null);
    // this.$set(this.componentExtraInfo, 'tag', null);
  }
}
