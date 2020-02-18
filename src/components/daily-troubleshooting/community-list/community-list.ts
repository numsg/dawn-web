import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from './community-list.html';
import styles from './community-list.module.scss';
import moment from 'moment';
import { Getter, State } from 'vuex-class';
import eventNames from '@/common/events/store-events';
import DailyTroubleshootingService from '@/api/daily-troubleshooting/daily-troubleshooting';
import CommunityBrief from '@/models/daily-troubleshooting/community-brief';
import { ModelType } from '@/models/daily-troubleshooting/model-type';
import PlotBrief from '@/models/daily-troubleshooting/plot-brief';

@Component({
  name: 'epidemic-statistics',
  template: Html,
  style: styles,
  themes: [
    { name: 'white', style: styles },
  ],
})
export class CommunityList extends Vue {

    modelType = ModelType;

    checkType = ModelType.fillRate;

    comCountImg = require('@/assets/img/trouble-shoot-record/com-count.png');
    todayCountImg = require('@/assets/img/trouble-shoot-record/today-count.png');
    totalCountImg = require('@/assets/img/trouble-shoot-record/total-count.png');
    abnormalImg = require('@/assets/img/trouble-shoot-record/abnormal.png');
    communityImg = require('@/assets/img/trouble-shoot-record/community.png');

    @State((state: any) => state.dailyTroubleshooting.communityBrief)
    communityBrief!: CommunityBrief;

    plotsBrief: PlotBrief[] = [];

    created() {
      this.$store.dispatch(eventNames.DailyTroubleshooting.SetCommunityBrief);
    }

    mounted() {
    }

    @Watch('communityBrief')
    onCommunityBriefChange() {
      this.plotsBrief = JSON.parse(JSON.stringify(this.communityBrief.plotBriefModels));
      this.sort(this.checkType);
    }

    sort(type: ModelType) {
      this.checkType = type;
      if (this.checkType === ModelType.fillRate) {
        this.plotsBrief = this.plotsBrief.sort((a, b) => {
          if (a.plotAbnormalTotal < b.plotAbnormalTotal) {
            return 1;
          } else if (a.plotAbnormalTotal === b.plotAbnormalTotal) {
            return 0;
          } else {
            return -1;
          }
        });
      } else {
        this.plotsBrief = this.plotsBrief.sort((a, b) => {
          if (parseFloat(a.troubleshootRate) < parseFloat(b.troubleshootRate)) {
            return 1;
          } else if (parseFloat(a.troubleshootRate) === parseFloat(b.troubleshootRate)) {
            return 0;
          } else {
            return -1;
          }
        });
      }
    }

}
