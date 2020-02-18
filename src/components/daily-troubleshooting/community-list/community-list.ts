import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from './community-list.html';
import styles from './community-list.module.scss';
import moment from 'moment';
import { Getter, State } from 'vuex-class';
import eventNames from '@/common/events/store-events';
import DailyTroubleshootingService from '@/api/daily-troubleshooting/daily-troubleshooting';
import CommunityBrief from '@/models/daily-troubleshooting/community-brief';
import { ModelType } from '@/models/daily-troubleshooting/model-type';

@Component({
  name: 'epidemic-statistics',
  template: Html,
  style: styles,
  themes: [
    { name: 'white', style: styles },
  ],
})
export class CommunityList extends Vue {

    @Getter('dailyTroubleshooting_statisticsData')
    statisticsData!: any[];

    modelType = ModelType;

    checkType = ModelType.fillRate;

    comCountImg = require('@/assets/img/trouble-shoot-record/com-count.png');
    todayCountImg = require('@/assets/img/trouble-shoot-record/today-count.png');
    totalCountImg = require('@/assets/img/trouble-shoot-record/total-count.png');
    abnormalImg = require('@/assets/img/trouble-shoot-record/abnormal.png');
    communityImg = require('@/assets/img/trouble-shoot-record/community.png');

    communityName: string = '';


    @State((state: any) => state.dailyTroubleshooting.communityBrief)
    communityBrief!: CommunityBrief;

    created() {
      DailyTroubleshootingService.queryCommunity().then((res: any) => {
        if ( res && Array.isArray(res) && res.length > 0 ) {
          this.communityName = res[0].name;
        }
      });
      this.$store.dispatch(eventNames.DailyTroubleshooting.SetCommunityBrief);
    }

    mounted() {
        this.$store.dispatch(eventNames.DailyTroubleshooting.SetStatisticsData);
        console.log(this.statisticsData);
    }

    sort(type: ModelType) {
      this.checkType = type;
    }

}
