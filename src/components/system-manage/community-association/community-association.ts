import { Vue, Component} from 'vue-property-decorator';
import Html from './community-association.html';
import Styles from './community-association.scss';

import { AddCommunityComponent } from './add-community/add-community';
import { CommunityListComponent } from './community-list/community-list';
import { Action } from 'vuex-class';

@Component({
  template: Html,
  style: Styles,
  components: {
    AddCommunityComponent,
    CommunityListComponent

  },
})
export class CommunityAssociationComponent extends Vue {
  @Action('getAllRolesInfoCommunity')
  getRoleInfo!: () => void;

  @Action('getAllAreaCodeInfos')
  getAllAreaCodeInfo!: () => void;

  @Action('getAllRelationsInfos')
  getAllRelationsInfos!: () => void;

  created() {
    this.init();
  }
  init() {
    this.getRoleInfo();
    this.getAllAreaCodeInfo();
    this.getAllRelationsInfos();
  }
}
