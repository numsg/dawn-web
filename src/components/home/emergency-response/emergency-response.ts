import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import emergencyResponseStyle from './emergency-response.module.scss';
import emergencyResponseHtml from './emergency-response.html';
import { AccessControl } from './access-control/access-control';
import { DailyDisinfection } from './daily-disinfection/daily-disinfection';
import { CommunityPatrol } from './community-patrol/community-patrol';
import { AccessControlAdd } from './access-control/access-control-add/access-control-add';

@Component({
  template: emergencyResponseHtml,
  style: emergencyResponseStyle,
  themes: [{ name: 'white', style: emergencyResponseStyle }],
  components: {AccessControl, DailyDisinfection, CommunityPatrol, AccessControlAdd}
})
export class EmergencyResponseComponent extends Vue {
  private activeName = 'accessControl';
  private serchValue = '';

  handleClick() {
    console.log(this.activeName);
  }
}
