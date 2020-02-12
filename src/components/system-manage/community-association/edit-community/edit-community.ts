import { Vue, Component, Prop} from 'vue-property-decorator';
import Html from './edit-community.html';
import Styles from './edit-community.scss';
import { Getter, Action } from 'vuex-class';

import { RoleAreaCodeInfo } from '@/models/community-association/role-areacode-info';
import notifyUtil from '@/common/utils/notifyUtil';

@Component({
  template: Html,
  style: Styles,
  components: {
  },
})
export class EditCommunityComponent extends Vue {

  @Prop({ default: () => new RoleAreaCodeInfo() })
  currentRelationInfo!: RoleAreaCodeInfo;

  @Getter('getCommunityRoles')
  roleInfos!: any;

  @Getter('getCommunityAreacodes')
  private areaCodes!: any;

  @Action('editRelationsInfos')
  editRelationsInfos!: (info: RoleAreaCodeInfo) => boolean;

  currentRelation = new RoleAreaCodeInfo();

  currentRoles = [];
  currentCodes = [];

  private note = '';
  private props = { multiple: true };

  async editSubmit() {
    const result = await this.editRelationsInfos(this.currentRelation);
    if (result) {
      notifyUtil.success('编辑成功');
      this.closeFrame();
    } else {
      notifyUtil.warning('编辑失败');
    }
  }

  closeFrame() {
    this.$emit('closeFrame');
  }

}
