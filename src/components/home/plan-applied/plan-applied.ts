import { Vue, Component } from 'vue-property-decorator';
import PlanAppliedHtml from './plan-applied.html';
import PlanEntranceStyle from './plan-applied.module.scss';

@Component({
  template: PlanAppliedHtml,
  style: PlanEntranceStyle,
  components: {}
})
export class PlanAppliedComponent extends Vue {}
