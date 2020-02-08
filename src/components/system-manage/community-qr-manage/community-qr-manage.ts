import { Vue, Component } from 'vue-property-decorator';
import communityQRManageHtml from './community-qr-manage.html';
import communityQRManageStyle from './community-qr-manage.module.scss';

@Component({
  template: communityQRManageHtml,
  style: communityQRManageStyle,
  components: {}
})
export class CommunityQRManageComponent extends Vue {

}
