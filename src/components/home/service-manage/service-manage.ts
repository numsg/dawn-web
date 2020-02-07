import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import serviceManageStyle from './service-manage.module.scss';
import serviceManageHtml from './service-manage.html';

import { CommunityTriageComponent } from '@/components/home/service-manage/community-triage/community-triage';
@Component({
  template: serviceManageHtml,
  style: serviceManageStyle,
  themes: [{ name: 'white', style: serviceManageStyle }],
  components: {
    CommunityTriageComponent
  }
})
export class ServiceManageComponent extends Vue {
  private activeName = 'first';

}
