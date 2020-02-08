import { Vue, Component } from 'vue-property-decorator';
import communityQRManageHtml from './community-qr-manage.html';
import communityQRManageStyle from './community-qr-manage.module.scss';
import dDataSourceService from '@/api/data-source/d-data-source.service';

@Component({
  template: communityQRManageHtml,
  style: communityQRManageStyle,
  components: {}
})
export class CommunityQRManageComponent extends Vue {
  // 模糊查询g
  keywords: any = '';
  tableData: any = [];
  multipleSelection: any = [];
    // 社区信息
    communityInformation: any = [];
    // 当前社区id
    currentCommunityId: any = 'a2e01f0e-6c86-4a41-bcf3-c07c1ffa2f82';
    // 管辖区域
    manageArea: any = [];
    created() {
      this.getCommunityInformationById(this.currentCommunityId);
    }
  /**
   * 批量生成二维码
   */
  batchGenerationQRCode() {}

  toggleSelection(rows: any) {
    const multipleTableRef: any = this.$refs.multipleTable;
    if (rows) {
      rows.forEach((row: any) => {
        multipleTableRef.toggleRowSelection(row);
      });
    } else {
      multipleTableRef.clearSelection();
    }
  }

  handleSelectionChange(val: any) {
    this.multipleSelection = val;
  }
  /**
   * 生成二维码
   */
  generateQRCode() {}
  /**
   * 导出信息
   */
  exportInfo() {

  }
    /**
   * 根据id获取社区信息
   * @param id
   *
   */
  async getCommunityInformationById(id: any) {
    const res = await dDataSourceService.findDDataSourceByDataSourceId(id);
    if (res) {
      this.communityInformation = res;
    } else {
      this.communityInformation = [];
    }
    this.tableData = this.communityInformation;
  }
}
