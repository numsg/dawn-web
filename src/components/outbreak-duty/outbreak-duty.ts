import { EpidemicPerson } from '@/models/home/epidemic-persion';
import { Vue, Component, Watch } from 'vue-property-decorator';
import outbreakDutyHtml from './outbreak-duty.html';
import outbreakDutyStyle from './outbreak-duty.module.scss';
import { EpidemicStatisticsComponent } from './epidemic-statistics/epidemic-statistics';
import { EpidemicListComponent } from './epidemic-list/epidemic-list';
import { CommunityStatistics } from './community-statistics/community-statistics';
import { EpidemicInfoDetail } from './epidemic-info-detail/epidemic-info-detail';

@Component({
  template: outbreakDutyHtml, // require('./login.html'),
  style: outbreakDutyStyle,
  components: {
    'epidemic-statistics': EpidemicStatisticsComponent,
    'epidemic-list': EpidemicListComponent,
    CommunityStatistics,
    EpidemicInfoDetail
  }
})
export class OutbreakDutyComponent extends Vue {
  currentPerson: any = {};
  isEdit = false;
  typeOfStatistics = [
    {
      id: '1',
      label: '诊疗情况'
    },
    {
      id: '2',
      label: '就医情况'
    }
  ];
  currentDimension = '';

  mounted() {
    this.currentDimension = this.typeOfStatistics[0].id;
  }

  // @Watch('currentDimension')
  // handleCurrentDimensionChange(val: string) {
  //   console.log(val);
  // }

  handlePersonSelected(person: any) {
    this.currentPerson = person;
  }
  handleCurrentPersonEdit(person: any) {
    this.currentPerson = person;
    this.isEdit = true;
  }

  async handlePageRefresh(person: EpidemicPerson) {
    this.currentPerson = person;
    const epidemicStatisticsPage: any = this.$refs['community-statistics'];
    if (epidemicStatisticsPage) {
      epidemicStatisticsPage.handleDimensionOfStatisticsChange();
    }
    const communityStatisticsPage: any = this.$refs['community-statistics'];
    if (communityStatisticsPage) {
      communityStatisticsPage.queryCommunityFocusOnPersons();
    }
  }
}
