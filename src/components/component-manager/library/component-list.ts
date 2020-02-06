import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
import template from './component-list.html';
import style from './component-list.module.scss';
import { ComponentList } from '@gsafety/whatever/dist';
import { PmsComponentFilter } from '../filter/component-filter';
import './overwrite.scss';
import componentBlackStyle from './component-list.black.module.scss';
import { State } from 'vuex-class';

@Component({
  template: template,
  style: style,
  themes: [{ name: 'white', style: style }, { name: 'black', style: componentBlackStyle }],
  components: { ComponentList, PmsComponentFilter }
})
export class PmsComponentList extends Vue {
  @Prop({
    default: () => {
      return {};
    }
  })
  instance: any;
  @Prop({
    default: () => {
      return {
        miniMode: false,
        choosenItems: []
      };
    }
  })
  options!: any;
  @Prop({
    default: () => {
      return {};
    }
  })
  filter!: any;
  @Prop({
    default: false
  })
  disableExtraFilter!: boolean;
  @Prop({
    default: true
  })
  enableSelfDataLoad!: boolean;
  @Prop({
    default: () => {
      return {
        cleanExtraFilter: true,
        enableTimeFilter: true
      };
    }
  })
  filterOptions!: any;

  @State((state: any) => state.eventType.allEventTypes)
  eventTypes: any;

  multiTenancys: Array<any> = [];

  handleSelectChange: any = () => { };
  handleEdit: any = () => { };
  handlePush: any = () => { };

  @Watch('instance', { deep: true })
  handleInstanceChange(val: any) {
    // console.log('------------ dynamic page selector ----------------');
    // console.log(val);
    this.initializeEvents(val);
  }

  created() {
    if (this.instance) {
      this.initializeEvents(this.instance);
    }
  }

  /**
   * 初始化事件
   *
   * @param {*} val
   * @memberof PmsComponentList
   */
  initializeEvents(val: any) {
    if (val.handleComponentEdit) {
      this.handleEdit = val.handleComponentEdit;
    }
    if (val.handleItemSelectChange) {
      this.handleSelectChange = val.handleItemSelectChange;
    }
    if (val.handleInsertComponent) {
      this.handlePush = val.handleInsertComponent;
    }
  }

  /**
   * 处理元件多租户
   */
  loadMultiTenancy(multiTenancy: any) {
    let arr = multiTenancy.split(';');
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
  }

}
