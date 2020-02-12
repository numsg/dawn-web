import { Vue, Component, Prop, Watch} from 'vue-property-decorator';
import Html from './edit-community.html';
import Styles from './edit-community.scss';
import { Getter, Action } from 'vuex-class';

import { RoleAreaCodeInfo } from '@/models/community-association/role-areacode-info';
import notifyUtil from '@/common/utils/notifyUtil';
import ComAssocService from '@/api/community-association/community-association-service';
import dataFormat from '@/utils/data-format';
@Component({
  template: Html,
  style: Styles,
  components: {
  },
})
export class EditCommunityComponent extends Vue {
  personImg = require('@/assets/img/association/person.png');
  areaImg = require('@/assets/img/association/area.png');

  private props = {
    multiple: false,
    lazy: true,
    lazyLoad: this.lazyLoad,
    value: 'districtCode',
    label: 'name',
  };

  @Prop({ default: () => new RoleAreaCodeInfo() })
  currentRelationInfo!: RoleAreaCodeInfo;

  @Getter('getCommunityRoles')
  roleInfos!: any;

  @Getter('getCommunityRoleName')
  getCommunityRoleName!: (id: string) => string;

  @Getter('getCommunityAreacodes')
  private areaCodes!: any;

  @Action('editRelationsInfos')
  editRelationsInfos!: (info: RoleAreaCodeInfo) => boolean;

  currentRelation!: RoleAreaCodeInfo;

  currentRoles: any = '';
  currentCodes: any[]  = [];

  private note = '';

  @Watch('currentRelationInfo')
  wtchcurrentRelationInfo(value: RoleAreaCodeInfo) {
    if ( value && value.rolesInformation && value.administrativeCodes ) {
      this.currentRelation = this.currentRelationInfo;
      this.currentRoles = value.rolesInformation;
      this.currentCodes = [value.administrativeCodes.split('/')];
    }
  }

  async editSubmit() {
    this.currentRelation.rolesInformation = this.currentRoles;
    this.currentRelation.administrativeCodes = this.currentCodes.join('/');
    this.currentRelation.createTime = this.replaceTime(this.currentRelation.createTime);
    this.currentRelation.updateTime = this.replaceTime(new Date().toDateString());
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

  async lazyLoad (node: any, resolve: any) {
    const { value } = node;
    const result = await  ComAssocService.getAreaCodeInfos(value);
    resolve(result.value);
  }

  replaceTime(time: string) {
    if (time) {
      return dataFormat.formatTime(time);
    }
    return '';
  }

}
