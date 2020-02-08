import { Vue, Component } from 'vue-property-decorator';
import dailyTroubleshootingHtml from './daily-troubleshooting.html';
import dailyTroubleshootingStyle from './daily-troubleshooting.scss';

import { OperationZone } from './operation-zone/operation-zone';
import { PersonCard } from './person-card/person-card';
import { PersonStatistical } from './person-statistical/person-statistical';
import FilterPanelComponent from './filter-panel/filter-panel';

import DailyTroubleshootingService from '@/api/daily-troubleshooting/daily-troubleshooting';

import { ModelType } from '@/models/daily-troubleshooting/model-type';

@Component({
  template: dailyTroubleshootingHtml,
  style: dailyTroubleshootingStyle,
  components: {
    OperationZone,
    PersonCard,
    PersonStatistical,
    FilterPanelComponent,
  }
})
export class DailyTroubleshootingComponent extends Vue {
  private leftActive = 'statistic';
  currentType = ModelType.ALL;
  personData: any = [];

  async created() {
    const result = await DailyTroubleshootingService.queryAllDailyRecord( 1, 10);
    this.personData = result.value;
    console.log(this.personData, '----------------------------');
  }

  modelTypeChange(type: ModelType) {
    this.currentType = type;
  }

  paginationChange(pagination: {pageSize: number, currentPage: number}) {
    DailyTroubleshootingService.queryAllDailyRecord(pagination.currentPage, pagination.pageSize);
  }
}
