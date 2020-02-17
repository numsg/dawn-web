import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import styles from './community-statistics.module.scss';
import template from './community-statistics.html';
import eventNames from '@/common/events/store-events';
import communityStatisticsService from '@/api/community-statistics/community-statistics.service';
import { Getter } from 'vuex-class';

@Component({
  name: 'community-statistics',
  template: template,
  style: styles
})
export class CommunityStatistics extends Vue {
  @Prop({
    default: '1'
  })
  dimension!: string;

  @Getter('outbreakDuty_communityFocusOnData')
  communityStatisticsData!: any;

  mounted() {}

  @Watch('dimension')
  async handleDimensionOfStatisticsChange(val: string) {
    this.queryCommunityFocusOnPersons();
  }

  async queryCommunityFocusOnPersons() {
    await this.$store.dispatch(eventNames.OutbreakDuty.SetCommunityFocusOnPersonData, { dimension: this.dimension });
  }
}
