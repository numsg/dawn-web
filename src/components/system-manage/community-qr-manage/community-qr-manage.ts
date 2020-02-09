import { Vue, Component } from 'vue-property-decorator';
import communityQRManageHtml from './community-qr-manage.html';
import communityQRManageStyle from './community-qr-manage.module.scss';
import dDataSourceService from '@/api/data-source/d-data-source.service';
import html2canvas from 'html2canvas';
import { debounce } from 'lodash';
import communityQrManageService from '@/api/community-qr-manage/community-qr-manage.service';
import store from '@/store';

@Component({
  template: communityQRManageHtml,
  style: communityQRManageStyle,
  components: {}
})
export class CommunityQRManageComponent extends Vue {
  // 模糊查询g
  keywords: any = '';
  tableData: any = [];
  defaultTableData: any = [];
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
  // 当前选中行id
  currentSelectRowId: any = '';
  // 当前选中行ids
  currentSelectRowsIds: any = [];
  // 二维码url
  qrCodeUrl: any = '';
  // 社区二维码集合
  cummunityIds: any = [];
  // 二维码List
  qrCodeListInfo: any = [];
  /**
   * 搜索防抖
   */
  debounceSearch = debounce(this.search, 500);
  created() {
    this.qrCodeUrl = store.getters.configs.qrCodeUrl;
    this.getCommunityInformationById(this.currentCommunityId);
  }

  /**
   * 查询
   */
  search() {
    const searchValue: any = this.keywords.trim();
    if (searchValue === '') {
      this.tableData = JSON.parse(JSON.stringify(this.defaultTableData));
    } else {
      this.tableData = [];
      this.defaultTableData.map((item: any) => {
        if (item.name.indexOf(searchValue) !== -1) {
          this.tableData.push(item);
        }
      });
    }
  }

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
  async generateQRCode(row: any) {
    this.currentSelectRowId = row.id;
    const obj: any = {
      businessId: this.currentSelectRowId,
      content: this.qrCodeUrl
    };
    const res = await communityQrManageService.generateQRCodeImage(obj);
    if (res) {
      this.getCommunityInformationById(this.currentCommunityId);
    }
  }

  /**
   * 批量生成二维码
   */
  async batchGenerationQRCode() {
    this.currentSelectRowsIds = [];
    this.multipleSelection.map((item: any) => {
      if (item.image === '') {
        const obj: any = {
          businessId: item.id,
          content: this.qrCodeUrl
        };
        this.currentSelectRowsIds.push(obj);
      }
    });
    const res = await communityQrManageService.batchGenerateQRCodeImage(this.currentSelectRowsIds);
    if (res) {
      this.getCommunityInformationById(this.currentCommunityId);
    }
  }
  /**
   * 通过id获取二维码
   */
  async getQRCodeById() {
    const res = await communityQrManageService.getQRCodeById(this.currentSelectRowId);
  }
  /**
   * 通过id集合获取二维码信息
   */
  async getQRCodeListByIds() {
    this.qrCodeListInfo = [];
    const res = await communityQrManageService.getQRCodeListByIds(this.cummunityIds);
    if (res) {
      this.qrCodeListInfo = res;
    }
  }
  /**
   * 打印预览
   */
  preView(row: any) {
    this.$set(this.currentSelectRowInfo, 'name', row.name);
    this.$set(this.currentSelectRowInfo, 'image', row.image);
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
        const image = canvas.toDataURL('image/jpeg', 1.0);
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
    this.cummunityIds = [];
    // 通过社区id获取社区信息
    const res = await dDataSourceService.findDDataSourceByDataSourceId(id);
    if (res) {
      this.communityInformation = res;
      this.communityInformation.map((item: any) => {
        this.cummunityIds.push(item.id);
      });
      // 通过社区id获取二维码信息
      await this.getQRCodeListByIds();
      // 包装列表显示数据
      this.communityInformation.map((ele: any) => {
        ele.image = '';
        this.qrCodeListInfo.map((p: any) => {
          if (ele.id === p.businessId) {
            ele.image = p.image;
          }
        });
      });
    } else {
      this.communityInformation = [];
    }
    this.tableData = JSON.parse(JSON.stringify(this.communityInformation));
    this.defaultTableData = JSON.parse(JSON.stringify(this.communityInformation));
  }
}
