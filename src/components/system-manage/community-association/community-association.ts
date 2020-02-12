import { Vue, Component} from 'vue-property-decorator';
import Html from './community-association.html';
import Styles from './community-association.scss';

@Component({
  template: Html,
  style: Styles,
  components: {
  },
})
export class CommunityAssociationComponent extends Vue {

}
