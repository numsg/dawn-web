import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import dailyDisinfectionStyle from './daily-disinfection.module.scss';
import dailyDisinfectionHtml from './daily-disinfection.html';

@Component({
  template: dailyDisinfectionHtml,
  style: dailyDisinfectionStyle,
  themes: [{ name: 'white', style: dailyDisinfectionStyle }],
  components: {}
})
export class DailyDisinfection extends Vue {

}
