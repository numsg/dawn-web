import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import template from './component-template.html';
import styles from './component-template.module.scss';
import './overwrite.scss';
import { ComponentTemplate } from '@gsafety/whatever/dist/components/component-template';
import { State } from 'vuex-class';
import { PmsComponentEditor } from '../editor/component-editor';
import { verifyArrayEmptyOrUndefined, verifyStringPropEmpty, copyObject } from '@gsafety/whatever/dist/util';
import i18n from '@/i18n';
import { RouteLeaveDialog } from '@/components/share/route-leave-dialog/route-leave-dialog';

@Component({
  name: 'pms-comp-template-manager',
  template: template,
  style: styles,
  components: {
    ComponentTemplate,
    PmsComponentEditor,
    RouteLeaveDialog
  },
  beforeRouteLeave(to: any, from: any, next: any) {
    const el: any = this;
    el.toRouter = to;
    const compTemplate = el.$refs['componentTemplate'];
    if (compTemplate.showEditor) {
      if (!el.isRedirect) {
        el.dialogVisible = true;
      } else {
        next();
      }
    } else {
      next();
    }
  }
})
export class PmsCompTemplateManager extends Vue {
  get finalChooseEventTypeName() {
    return this.currentTypeName !== ''
      ? i18n.t('component_manager.all_event') + '：' + this.currentTypeName
      : i18n.t('component_manager.select_event_type');
  }
  @Prop({
    default: () => {
      return {};
    }
  })
  instance: any;
  @State((state: any) => state.eventType.eventTypes.data)
  baseEventTypes: any;
  @State((state: any) => state.eventType.eventsNext.data)
  childEventTypes: any;
  @State((state: any) => state.eventType.allEventTypes)
  eventTypes: any;
  @State((state: any) => {
    return state.templateStore.templates;
  })
  templateList!: Array<any>;

  selectTemplate: any = {};

  extraFilter: any = {
    field: '',
    searchContent: ''
  };
  independentMode = false;
  showDetail = false;
  showEventTypes = false;
  displayBaseEventTypes: Array<any> = [];
  currentBaseEventType: any = {};
  currentEventType: any = {};
  filterText = '';
  currentTypeName = '';
  isShowModel: boolean = false;
  showFullEmptyNotice: boolean = true;
  defaultType = {
    code: '',
    description: null,
    id: '',
    image: { isIcon: true, iconfont: 'iconpms-icon_Event-classification', iconColor: '#fff' },
    imgColor: '',
    name: i18n.t('component_manager.all_event'),
    pid: '-1',
    sort: '0',
    children: []
  };

  multiTenancys: Array<any> = [];
  isRedirect: boolean = false;
  dialogVisible: boolean = false;
  toRouter: any;

  @Watch('baseEventTypes')
  handleBaseEventTypesLoaded(val: any) {
    if (!verifyArrayEmptyOrUndefined(val)) {
      this.defaultType.children = val;
      this.displayBaseEventTypes = [this.defaultType].concat(val);
    }
  }
  @Watch('childEventTypes')
  handleChildEventTypesLoaded(val: any) {
    console.log(val);
  }
  @Watch('filterText')
  handleFilterTextChange(val: string) {
    const tree: any = this.$refs.eventTypeTree;
    if (tree) {
      tree.filter(val);
    }
  }
  @Watch('selectTemplate', { deep: true })
  handleMultiTenancy() {
    if (this.templateList.length > 0 && this.selectTemplate.extraInfo && this.selectTemplate.extraInfo.multiTenancy) {
      this.isShowModel = true;
    } else {
      this.isShowModel = false;
    }
  }

  mounted() {
    this.independentMode = Object.keys(this.instance).length === 0;
    // this.$store.dispatch('LoadEventTypes');
  }

  handleReset() {
    this.currentTypeName = '';
    this.currentBaseEventType = null;
    this.currentBaseEventType = {};
    this.currentEventType = null;
    this.currentEventType = {};
    this.showEventTypes = false;
    this.extraFilter = null;
    this.extraFilter = {
      field: '',
      searchContent: ''
    };
    this.showFullEmptyNotice = true;
  }

  handleEventTypeChange(eventType: any) {
    this.showDetail = false;
    this.currentBaseEventType = eventType;
    if (eventType.id !== '') {
      this.currentTypeName = eventType.name;
      this.extraFilter = null;
      this.extraFilter = {
        field: 'eventTypeId',
        searchContent: eventType.id
      };
    }
    setTimeout(() => {
      this.showDetail = true;
      const templateRefs: any = this.$refs['componentTemplate'];
      if (templateRefs) {
        this.showFullEmptyNotice = !templateRefs.showFullEmptyNotice;
      }
    }, 50);
  }

  handleChildEventTypeChange(eventType: any) {
    this.currentEventType = eventType;
    this.currentTypeName = eventType.name;
    this.extraFilter = null;
    this.extraFilter = {
      field: 'eventTypeId',
      searchContent: eventType.id
    };
    const templateRefs: any = this.$refs['componentTemplate'];
    if (templateRefs) {
      this.showFullEmptyNotice = !templateRefs.showFullEmptyNotice;
    }
  }

  handleFilterEventType(value: any, data: any) {
    if (!value) {
      return true;
    }
    return data.label.indexOf(value) >= 0;
  }

  handleChooseEventTypes() {
    this.showEventTypes = !this.showEventTypes;
    if (this.showEventTypes && !verifyArrayEmptyOrUndefined(this.displayBaseEventTypes)) {
      this.handleEventTypeChange(
        !verifyStringPropEmpty(this.currentBaseEventType, 'id') ? this.currentBaseEventType : this.displayBaseEventTypes[0]
      );
    }
  }

  handleNavigateToComponentMgr() {
    this.$router.push({ path: 'component-manager' });
  }

  /**
   * 元件模板多租户
   */
  loadMultiTenancy() {
    if (this.selectTemplate.extraInfo && this.selectTemplate.extraInfo.multiTenancy) {
      let arr = this.selectTemplate.extraInfo.multiTenancy.split(';');
      const tempArr: any = [];
      const res = new Map();
      arr = arr.filter((a: any) => !res.has(a) && res.set(a, 1));
      if (arr && Array.isArray(arr) && arr.length > 0) {
        arr.forEach((item: any) => {
          const eventType = this.eventTypes.find((i: any) => i.id === item);
          if (eventType) {
            const temp = Object.assign({}, eventType);
            temp.image = eventType.image && !eventType.image.iconfont ? JSON.parse(eventType.image) : eventType.image;
            tempArr.push(temp);
          }
        });
      }
      this.multiTenancys = tempArr;
    } else {
      this.multiTenancys = [];
    }
  }

  // 当前选择模板
  onSelectTemplete(selectTemData: any) {
    this.selectTemplate = selectTemData.template;
  }

  /**
 * 处理路由跳转
 *
 * @memberof ComponentTemplate
 */
  handleRouteLeave() {
    this.isRedirect = true;
    this.dialogVisible = false;
    this.$router.push({ name: this.toRouter.name });
  }

}
