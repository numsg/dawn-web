import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import template from './dynamic-page.html';
import style from './dynamic-page.module.scss';
import './overwrite.scss';

import { DynamicPage } from '@gsafety/whatever/dist';
import { PmsComponentPreviewer } from '../previewer/component-previewer';
import { PmsComponentList } from '../library/component-list';
import { PmsComponentEditor } from '../editor/component-editor';
import { State } from 'vuex-class';

@Component({
  template: template,
  style: style,
  components: { DynamicPage, PmsComponentPreviewer, PmsComponentList, PmsComponentEditor }
})
export class PmsDynamicPage extends Vue {
  /**
   * 动态页面名称标识，必填
   *
   * @type {*}
   * @memberof DynamicPage
   */
  @Prop({
    default: '',
    required: true
  })
  name: any;
  /**
   * 允许外部控制动态页面内部的功能交互
   * 现暂时只支持外部呼出元件选择器
   *
   * @type {boolean}
   * @memberof DynamicPage
   */
  @Prop({
    default: false
  })
  showComponentSelector!: boolean;
  /**
   * 数据源
   *
   * @type {Array<any>}
   * @memberof PmsDynamicPage
   */
  @Prop({
    type: Array,
    default: () => {
      return [];
    }
  })
  dataSource!: Array<any>;
  /**
   * 数据源地址
   *
   * @type {String}
   * @memberof PmsDynamicPage
   */
  @Prop({
    type: String,
    default: ''
  })
  dataSourceUrl!: string;
  /**
   * 动态页面可操作配置项
   *
   * @type {*}
   * @memberof PmsDynamicPage
   */
  @Prop({
    default: () => {
      return {
        disableDefaultToolBar: false,
        disableDefaultOperations: false,
        enableManuallySelectorHide: false,
        saveToLocalCache: true
      };
    }
  })
  operationOptions!: any;
  /**
   * 元件内容选项，包含界面呈现选项以及操作选项
   *
   * @type {*}
   * @memberof DynamicPage
   */
  @Prop({
    default: () => {
      return {
        // 启用元件内容的在动态页面中的删除权限
        enableContentRemoveBtn: true,
        // 启用元件内容在动态页面中的编辑权限
        enableContentEditBtn: true,
        // 启用元件内容在动态页面中的复制权限
        enableContentCopyBtn: true,
        // 隐藏动态页面内部的loading效果
        hideLoading: false,
        // 隐藏动态页面内容项的标题
        hideContentTitle: false,
        // 美化动态页面内容显示的效果，默认为true
        prettyContentDisplay: true,
        // 禁用动态页面中数据项的默认显示样式
        disableDefaultContent: false,
        // 禁用附加页面内容区域
        disableExtraContent: false,
        // 高亮效果显示选中的元件内容
        highlightContentSelect: true,
        // 启用自动页面滚动效果
        enableAutoScroll: true
      };
    }
  })
  contentOptions!: any;
  /**
   * 页面内容项的显示选项
   *
   * @type {*}
   * @memberof PmsDynamicPage
   */
  @Prop({
    default: () => {
      return {
        showComponentTitle: false,
        normalDisplay: true,
        showBasicInfo: false,
        readMode: false
      };
    }
  })
  contentDataOptions!: any;
  /**
   * 显示元件内容的类型
   *
   * @type {*}
   * @memberof PmsDynamicPage
   */
  @Prop({
    default: ''
  })
  displayContentType: any;
  /**
   * 元件选择器相关选项
   *
   * @type {*}
   * @memberof PmsDynamicPage
   */
  @Prop({
    default: () => {
      return {
        miniMode: true,
        choosenItems: [],
        enableSelfDataLoad: true,
        filterOptions: {
          cleanExtraFilter: true,
          enableTimeFilter: true
        }
      };
    }
  })
  componentSelectorOptions!: any;
  @Prop({
    default: false
  })
  disableComponentExtraFilter!: boolean;
  @Prop({
    default: ''
  })
  customContent!: any;

  /**
   * 当前所选元件
   *
   * @type {*}
   * @memberof PmsComponentManager
   */
  @State((state: any) => {
    return state.whatever.selectComponent;
  })
  currentComponent!: any;
  /**
   * 元件附加属性
   *
   * @type {*}
   * @memberof PmsComponentManager
   */
  componentExtraInfo: any = { tag: '' };
  showSelectorFlag = false;
  filter: any = {};

  /**
   * 监听当前所选元件的变化，以初始化相关值
   *
   * @param {*} val
   * @memberof PmsComponentManager
   */
  @Watch('currentComponent', { deep: true })
  onCurrentComponentChange(val: any) {
    if (val && Object.keys(val).indexOf('extraInfo') >= 0 && val.extraInfo) {
      this.componentExtraInfo = val.extraInfo;
    }
  }

  @Watch('showSelectorFlag')
  handleShowSelectorFlagChange(val: any) {
    this.$emit('update:showComponentSelector', val);
  }
  @Watch('showComponentSelector')
  handleOutsideFlagChange(val: any) {
    if (val) {
      this.componentSelectorOptions.choosenItems = this.dataSource;
    }
    this.showSelectorFlag = val;
  }
  @Watch('displayContentType')
  handleDisplayContentTypeChange(val: string) {
    this.$set(this.filter, 'componentTypeId', val);
  }

  handleInsertContent(eventParams: any) {
    this.$emit('on-inserted-to-page', eventParams);
  }
  handleCloneFinished(eventParams: any) {
    this.$emit('on-clone-finished', eventParams);
  }
  handleRemoveContent(eventParams: any) {
    this.$emit('on-removed-from-page', eventParams);
  }
  handleClearContent() {
    this.$emit('on-clear-page');
  }
  handleComponentEdit() {
    this.$emit('on-start-component-edit');
  }
  handleComponentEditUndo() {
    this.$emit('on-undo-component-edit');
  }
}
