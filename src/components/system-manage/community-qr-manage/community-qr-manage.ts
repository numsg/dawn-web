import { Vue, Component } from 'vue-property-decorator';
import communityQRManageHtml from './community-qr-manage.html';
import communityQRManageStyle from './community-qr-manage.module.scss';
import dDataSourceService from '@/api/data-source/d-data-source.service';
import html2canvas from 'html2canvas';

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
    // 控制dialog 显示与隐藏
    dialogFormVisible: any = false;
    // 当前选中行信息
    currentSelectRowInfo: any = {};
    tempPicture = require('../../../assets/img/temp_qrcode.png');
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
   * 打印预览
   */
  preView(row: any) {
   this.$set(this.currentSelectRowInfo, 'name', row.name);
  //  this.$set(this.currentSelectRowInfo, 'name', row.QRImg);
   this.dialogFormVisible = true;
  }
 /**
  * 打印二维码信息
  */
  printQRCode() {
    const _this = this;
      const contentRef = this.$refs.contentRef as HTMLElement;
      html2canvas(contentRef, { allowTaint: false, useCORS: true, backgroundColor: '#f5f5f5' }).then((canvas: any) => {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // IE10+
        const blob = canvas.msToBlob();
        const name = _this.currentSelectRowInfo.name + '信息' + '.png';
        return window.navigator.msSaveOrOpenBlob(blob, name);
        } else {
          const image = canvas.toDataURL('image/jpeg' , 1.0 );
          const pHtml = `<img src='` + image + `'/>`;
          const alink = document.createElement('a');
          alink.style.display = 'none';
          alink.href = image;
          alink.download = _this.currentSelectRowInfo.name + '信息' + '.png';
          // 出发点击-然后移除
          document.body.appendChild(alink);
          alink.click();
          document.body.removeChild(alink);
        }
      });
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
