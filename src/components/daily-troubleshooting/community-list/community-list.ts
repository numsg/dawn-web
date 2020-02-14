import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from './community-list.html';
import styles from './community-list.module.scss';
import moment from 'moment';
import { Getter } from 'vuex-class';
import eventNames from '@/common/events/store-events';

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

    mounted() {
        this.$store.dispatch(eventNames.DailyTroubleshooting.SetStatisticsData);
        console.log(this.statisticsData);
    }

}
