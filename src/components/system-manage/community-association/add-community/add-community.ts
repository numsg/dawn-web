import { Vue, Component} from 'vue-property-decorator';
import Html from './add-community.html';
import Styles from './add-community.scss';
import { Getter, Action } from 'vuex-class';
import notifyUtil from '@/common/utils/notifyUtil';

import ComAssocService from '@/api/community-association/community-association-service';
import { AreaInfo } from '@/models/community-association/area-info';
import { RoleAreaCodeInfo } from '@/models/community-association/role-areacode-info';
@Component({
  template: Html,
  style: Styles,
  components: {
  },
})
export class AddCommunityComponent extends Vue {
  personImg = require('@/assets/img/association/person.png');
  areaImg = require('@/assets/img/association/area.png');

  @Getter('getCommunityRoles')
  private roleInfos!: any;

  @Getter('getCommunityAreacodes')
  private areaCodes!: any;

  @Action('addRelationsInfo')
  addRelationsInfo!: (pyload: any) => boolean;

  private note = '';
  private props = {
    multiple: true,
    lazy: true,
    lazyLoad: this.lazyLoad,
    value: 'districtCode',
    label: 'name',
  };

  private currentRoles = [];
  private currentCodes = [];
  // 需要过虑
  get filtersRoles() {
    return [];
  }
  // 需要过虑
  get filtersAreaCodes() {
    return [];
  }

  async addRelations() {
    // currentRoles
    // currentCodes  一一对应传入
    console.log(this.currentRoles, this.currentCodes);
    const pyload: RoleAreaCodeInfo[] = [];
    this.currentRoles.forEach( (role: string) => {
      this.currentCodes.forEach( (codes: string[]) => {
        const info = new RoleAreaCodeInfo();
        info.rolesInformation = role;
        info.administrativeCodes = codes.join('/');
        info.description = this.note;
        pyload.push(info);
      });
    });
    const result = await this.addRelationsInfo(pyload);
    if (result) {
      this.currentRoles = [];
      this.currentCodes = [];
      notifyUtil.success('关联成功');
    } else {
      notifyUtil.warning('关联失败');
    }
  }

  async lazyLoad (node: any, resolve: any) {
    const { value } = node;
    const result = await  ComAssocService.getAreaCodeInfos(value);
    resolve(result.value);
  }
}
