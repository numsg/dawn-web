import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import PlanEntranceHtml from './plan-entrance.html';
import PlanEntranceStyle from './plan-entrance.module.scss';
import BaseDataCheck from '@/models/home/base-data-check';
import homePageSerive from '@/api/home-page/home-page.service';
// import PlanEntranceStyle from './plan-entrance.module.scss';
import PlanEntranceBlackStyle from './plan-entrance.black.module.scss';

@Component({
  template: PlanEntranceHtml,
  style: PlanEntranceStyle,
  themes: [{ name: 'white', style: PlanEntranceStyle }, { name: 'black', style: PlanEntranceBlackStyle }],
  components: {}
})
export class PlanEntranceComponent extends Vue {
  tipsPassingImage = require('@/assets/img/home/authorized.png');

  tipsFailedImage = require('@/assets/img/home/unauthorized.png');

  popoverVisible: boolean = false;

  @Prop({
    default: 11
  })
  span!: number;

  @Prop({
    default: false
  })
  homeScroll!: boolean;

  /**
   *校验
   * @type {BaseDataCheck}
   * @memberof PlanEntranceComponent
   */
  baseDaaCheck: BaseDataCheck = new BaseDataCheck();

  isAllCheck: boolean = false;

  @Watch('span', { deep: true })
  onSpansChange(val: any) {
  }

  @Watch('homeScroll', { deep: true })
  homeScrollChange(val: any) {
    if (val) {
      this.popoverVisible = false;
    }
  }

  async mounted() {
    this.baseDaaCheck = await homePageSerive.getDataBaseCheck();
    this.isAllCheck = Object.values(this.baseDaaCheck).every(e => e === true);
    this.$nextTick(() => {
      this.popoverVisible = true;
    });
  }
  onReminClick() {
    this.$emit('popover-visible');
  }
  handleNavigator(routerName: string) {
    this.$router.push({ name: routerName });
  }
}
