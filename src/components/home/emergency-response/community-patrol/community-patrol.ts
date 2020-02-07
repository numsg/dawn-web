import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import communityPatrolStyle from './community-patrol.module.scss';
import communityPatrolHtml from './community-patrol.html';
@Component({
  template: communityPatrolHtml,
  style: communityPatrolStyle,
  themes: [{ name: 'white', style: communityPatrolStyle }],
  components: {}
})
export class CommunityPatrol extends Vue {}
