import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from './anchor-nav.html';
import Styles from './anchor-nav.module.scss';
import DataSource from '@/models/data-source/data-source';
import { type } from 'os';
import anchorBlackStyle from './anchor-nav.black.module.scss';
import anchorStyle from './anchor-nav.module.scss';
@Component({
  template: Html,
  style: Styles,
  themes: [{ name: 'white', style: anchorStyle }, { name: 'black', style: anchorBlackStyle }],
  name: 'el-anchor-nav',
  components: {}
})
export class AnchorNavComponent extends Vue {
  @Prop()
  data: any;

  @Prop()
  scrollTo: any;


  @Prop({
    default: false
  })
  newTopNode!: boolean;

  @Prop({
    default: true
  })
  showSearchInput!: boolean;

  searchValue: string = '';

  /**
   * 当前数据源
   *
   * @type {DataSource}
   * @memberof AnchorNavComponent
   */
  public currentItem: DataSource = new DataSource();

  @Watch('data')
  dataChange() {
    this.currentItem = this.data[0];
  }

  @Watch('searchValue')
  searchValueChange(val: any) {
    this.$emit('on-search-change', val);
  }


  mounted() {
    this.currentItem = this.data[0];
  }

  onAnchorNavClick(item: any, index: any) {
    if (this.newTopNode) {
      return;
    }
    this.currentItem = item;
    this.$emit('on-index-change', index, true);
  }
}
