import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import CommunityTriageStyle from './community-triage.module.scss';
import CommunityTriageHtml from './community-triage.html';

@Component({
  template: CommunityTriageHtml,
  style: CommunityTriageStyle,
  themes: [{ name: 'white', style: CommunityTriageStyle }],
  components: {}
})
export class CommunityTriageComponent extends Vue {
  private activeName = 'first';
}
