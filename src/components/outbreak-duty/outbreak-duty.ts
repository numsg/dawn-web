import { Vue, Component } from 'vue-property-decorator';
import outbreakDutyHtml from './outbreak-duty.html';
import outbreakDutyStyle from './outbreak-duty.scss';

@Component({
  template: outbreakDutyHtml, // require('./login.html'),
  style: outbreakDutyStyle,
  components: {}
})
export class OutbreakDutyComponent extends Vue {

}
