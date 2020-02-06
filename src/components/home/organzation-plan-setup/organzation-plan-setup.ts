import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import RecentWorkListStyle from './organzation-plan-setup.module.scss';
import RecentWorkListHtml from './organzation-plan-setup.html';

import recentStyle from './organzation-plan-setup.module.scss';
import recentBlackStyle from './organzation-plan-setup.black.module.scss';
import { Getter, Action } from 'vuex-class';
import Plan from '@/models/plan-manage/plan';
import planSortService from '@/api/base-data-define/plan-sort.service';
import { VoBasic } from 'vue-orgchart';
import { arrayToTree } from '@/common/utils/utils';
import eventTypeServie from '@/api/base-data-define/event-type.service';

@Component({
  template: RecentWorkListHtml,
  style: RecentWorkListStyle,
  name: 'organzation-plan-setup',
  themes: [{ name: 'white', style: recentStyle }, { name: 'black', style: recentBlackStyle }],
  components: { VoBasic }
})
export class OrganzationPlanSetupComponent extends Vue {
  chartSource: any = {};

  @Prop({
    default: 11
  })
  span!: number;

  @Getter('planCensus_plans')
  allPlans!: Plan[];

  currentTargrt: any = {};
  currentParentTarget: any = {};

  responseSubs: Array<any> = [];

  eventTypes: Array<any> = [];

  @Watch('allPlans', { deep: true })
  onAllPlanChange(val: any) {
    if (val) {
      this.buildData();
    }
  }

  @Watch('span', { deep: true })
  onSpanChange(val: any) {
    const chartContainer: any = document.querySelector('#chart-container') as HTMLElement;
    if (chartContainer.childNodes && chartContainer.childNodes.length > 0) {
      if (this.span === 3) {
        chartContainer.childNodes[0].style.transform =
          'matrix3d(-3.13509e-17, 0.512, -6.27021e-17, 0, 0.512, 3.13509e-17, 0, 0, 7.4988e-33, -1.22465e-16, -1, 0, -217, -56, 0, 1)';
      } else {
        chartContainer.childNodes[0].style.transform = '';
      }
    }
  }

  async mounted() {
    let responseSubresult;
    let eventTypes;
    if (
      this.$store.state.baseData.eventTypes &&
      Array.isArray(this.$store.state.baseData.eventTypes) &&
      this.$store.state.baseData.eventTypes.length > 0
    ) {
      eventTypes = this.$store.state.baseData.eventTypes;
    } else {
      eventTypes = await eventTypeServie.HttpLoadEventTypes();
    }
    if (
      this.$store.state.baseData.responseSubs &&
      Array.isArray(this.$store.state.baseData.responseSubs) &&
      this.$store.state.baseData.responseSubs.length > 0
    ) {
      responseSubresult = this.$store.state.baseData.responseSubs;
    } else {
      responseSubresult = await planSortService.LoadResponseSub();
    }
    if (responseSubresult && eventTypes && Array.isArray(responseSubresult) && Array.isArray(eventTypes)) {
      this.eventTypes = arrayToTree(eventTypes, '-1');
      this.responseSubs = responseSubresult;
    }
    if (this.allPlans.length > 0) {
      this.buildData();
    }
  }

  private async buildData() {
    const chartContainer: any = document.querySelector('#chart-container') as HTMLElement;
    if (chartContainer.childNodes && chartContainer.childNodes.length > 0) {
      chartContainer.removeChild(chartContainer.childNodes[0]);
    }
    const source: any = [];
    this.responseSubs.forEach((r: any) => {
      const obj = {
        id: r.id,
        name: r.name,
        itemName: r.name,
        count: 0,
        planList: new Array(),
        children: new Array()
      };
      this.allPlans.forEach((p: any) => {
        if (p.responseSubId === r.id) {
          obj.count++;
          obj.planList.push(p);
        }
      });
      const eventTypeCount = this.handleEventTypePlansCount(obj.planList);
      obj.children = eventTypeCount;
      obj.name = obj.name + '( ' + obj.count + ' )';
      source.push(obj);
    });
    this.chartSource = { name: this.$tc('plan_census.emergency_system'), children: source };
    setTimeout(() => {
      this.$nextTick(() => {
        const chartContainer: any = document.querySelector('#chart-container') as HTMLElement;
        chartContainer.addEventListener('mouseover', this.onMouseOver);
        const orgchart = chartContainer.querySelector('.orgchart');
        orgchart.style.display = 'block';

        const titles: any = chartContainer.querySelectorAll('.title');
        titles.forEach((element: HTMLElement) => {
          if (element.childNodes && element.childNodes.length > 0 && element.childNodes[0]) {
            if (element.childNodes[0].nodeName === '#text') {
              element.style.fontSize = '13px';
              element.style.borderRadius = '3px';
              element.style.height = '26px';
              element.style.lineHeight = '26px';
              element.style.backgroundColor = '#ecf5ff';
              element.style.border = '1px solid #409eff';
              element.style.color = '#409eff';
            }
          }
        });
        if (chartContainer.childNodes && chartContainer.childNodes.length > 0) {
          if (this.span === 3) {
            chartContainer.childNodes[0].style.transform =
              'matrix3d(-3.13509e-17, 0.512, -6.27021e-17, 0, 0.512, 3.13509e-17, 0, 0, 7.4988e-33, -1.22465e-16, -1, 0, -217, -56, 0, 1)';
          } else {
            chartContainer.childNodes[0].style.transform = '';
          }
        }
        const localTheme = localStorage.getItem('system-theme');
        if (localTheme === 'black') {
          const downLine: any = chartContainer.querySelectorAll('.downLine');
          downLine.forEach((dl: HTMLElement) => {
            dl.style.backgroundColor = '#ffffff';
          });
          const lines: any = chartContainer.querySelectorAll('.lines');
          lines.forEach((li: HTMLElement) => {
            li.childNodes.forEach((dl: HTMLElement) => {
              if (
                dl.className === 'leftLine' ||
                dl.className === 'rightLine' ||
                dl.className === 'rightLine topLine' ||
                dl.className === 'leftLine topLine'
              ) {
                dl.style.borderColor = '#ffffff';
              }
            });
          });
        }
      });
    }, 5);
  }

  private handleEventTypePlansCount(plans: any) {
    const typeCount: any = [];
    this.eventTypes.forEach((t: any) => {
      const obj = {
        id: t.id,
        name: t.name,
        itemName: t.name,
        count: 0,
        planList: new Array()
      };
      plans.forEach((p: any) => {
        if (p.eventTypeId === t.id) {
          obj.count++;
          obj.planList.push(p);
        }
      });
      obj.name = obj.name + '( ' + obj.count + ' )';
      typeCount.push(obj);
    });
    return typeCount;
  }

  onMouseOver(event: any) {
    if (this.currentParentTarget.style) {
      this.currentParentTarget = {};
    }
    if (event.target.parentNode.className === 'node ') {
      this.currentParentTarget = event.target.parentNode;
      event.target.parentNode.style.backgroundColor = 'rgba(0,0,0,0)';
    }
  }
}
