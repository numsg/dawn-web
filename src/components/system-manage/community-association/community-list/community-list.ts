import { Vue, Component} from 'vue-property-decorator';
import Html from './community-list.html';
import Styles from './community-list.scss';

import { RoleAreaCodeInfo } from '@/models/community-association/role-areacode-info';
import { Action, Getter } from 'vuex-class';

import { CommunityConditionInfo } from '@/models/community-association/community-condition';

import notifyUtil from '@/common/utils/notifyUtil';
import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
import { EditCommunityComponent } from '@/components/system-manage/community-association/edit-community/edit-community';
import ComAssocService from '@/api/community-association/community-association-service';
import dataFormat from '@/utils/data-format';
@Component({
  template: Html,
  style: Styles,
  components: {
    EditCommunityComponent,
    'side-frame': SideFrameComponent
  },
})
export class CommunityListComponent extends Vue {

  private currentRelationInfo = new RoleAreaCodeInfo();

  @Getter('getCommunitycondition')
  condition!: CommunityConditionInfo;

  @Getter('getCommunityRelationships')
  relationships!: RoleAreaCodeInfo[];

  @Getter('getCommunityRoleName')
  getCommunityRoleName!: (id: string) => string;

  @Action('getCommunitycondition')
  setCondition!: (condition: CommunityConditionInfo) => void;

  @Action('getAllRelationsInfos')
  getAllRelationsInfos!: () => void;

  @Action('deleteRelatinsInfo')
  deleteRelatinsInfo!: (ids: string[]) => boolean;
  private currentPage = 1;
  private pageSizes = [10, 20, 30, 40];
  private pageSize = this.pageSizes[0];
  private searchValue = '';
  private relations = [
    1 , 2, 3, 4, 5
  ];
  private activeRelationId = '';
  async edit(info: RoleAreaCodeInfo) {
    this.currentRelationInfo = info;
    this.framePpen();

  }
  async deleteInfo(info: RoleAreaCodeInfo) {
    this.$alert('确定要删除此关联关系吗？', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      showClose: false,
      showCancelButton: true,
      callback: async (value: any) => {
        console.log(value);
        if ( value === 'confirm' ) {
          const result = await this.deleteRelatinsInfo([info.id]);
          if (result) {
            notifyUtil.success('删除成功');
          } else {
            notifyUtil.warning('删除失败');
          }
        }
      }
    });
  }
  // 页数改变
  handleSizeChange(pageSize: number) {
    this.condition.pageSize = pageSize;
    this.setCondition(this.condition);
    this.getAllRelationsInfos();
  }
  // 选中页改变
  handleCurrentChange(page: number) {
    this.condition.page = page;
    this.setCondition(this.condition);
    this.getAllRelationsInfos();
  }
  selectRelation() {

  }

  // 编辑关闭
  closeFrame() {
    this.currentRelationInfo = new RoleAreaCodeInfo();
    this.frameClose();
  }

  // 打开编辑
  framePpen() {
    const sideFrame: any = this.$refs['sideFrameCard'];
    sideFrame.open();
  }
  // 关闭编辑
  frameClose() {
    const sideFrame: any = this.$refs['sideFrameCard'];
    sideFrame.close();
  }

  async repalceName(areacodeInfo: RoleAreaCodeInfo ) {
    const codes = areacodeInfo.administrativeCodes.split('/');
    const result = await ComAssocService.getAreaCodeBycode(codes);
    areacodeInfo.name = result.map( (item: RoleAreaCodeInfo) => item.name ).join('');
    return '';
  }
  replaceTime(time: string) {
    if (time) {
      return dataFormat.formatTime(time);
    }
    return '';
  }
}
