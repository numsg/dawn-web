import { Vue, Component } from 'vue-property-decorator';
import outbreakDutyHtml from './outbreak-duty.html';
import outbreakDutyStyle from './outbreak-duty.module.scss';
import { EpidemicStatisticsComponent } from './epidemic-statistics/epidemic-statistics';
import { EpidemicListComponent } from './epidemic-list/epidemic-list';

@Component({
  template: outbreakDutyHtml, // require('./login.html'),
  style: outbreakDutyStyle,
  components: {
    'epidemic-statistics': EpidemicStatisticsComponent,
    'epidemic-list': EpidemicListComponent
  }
})
export class OutbreakDutyComponent extends Vue {

}
