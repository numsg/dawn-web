import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from './community-list.html';
import styles from './community-list.module.scss';
import moment from 'moment';
import { Getter } from 'vuex-class';
import eventNames from '@/common/events/store-events';
import DailyTroubleshootingService from '@/api/daily-troubleshooting/daily-troubleshooting';

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

    comCountImg = require('@/assets/img/trouble-shoot-record/com-count.png');
    todayCountImg = require('@/assets/img/trouble-shoot-record/today-count.png');
    totalCountImg = require('@/assets/img/trouble-shoot-record/total-count.png');
    abnormalImg = require('@/assets/img/trouble-shoot-record/abnormal.png');
    communityImg = require('@/assets/img/trouble-shoot-record/community.png');

    communityName: string = '';

    created() {
      DailyTroubleshootingService.queryCommunity().then((res: any) => {
        if ( res && Array.isArray(res) && res.length > 0 ) {
          this.communityName = res[0].name;
        }
      });
    }

    mounted() {
        this.$store.dispatch(eventNames.DailyTroubleshooting.SetStatisticsData);
        console.log(this.statisticsData);
    }

}
