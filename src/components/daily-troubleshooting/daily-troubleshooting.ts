import { Vue, Component } from 'vue-property-decorator';
import dailyTroubleshootingHtml from './daily-troubleshooting.html';
import dailyTroubleshootingStyle from './daily-troubleshooting.scss';

@Component({
  template: dailyTroubleshootingHtml,
  style: dailyTroubleshootingStyle,
  components: {}
})
export class DailyTroubleshootingComponent extends Vue {

}
