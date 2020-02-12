import { QrcodeInfo } from './../../../models/home/qrcode-info';
import { Vue, Component } from 'vue-property-decorator';
import communityQRManageHtml from './community-qr-manage.html';
import communityQRManageStyle from './community-qr-manage.module.scss';
import dDataSourceService from '@/api/data-source/d-data-source.service';
import html2canvas from 'html2canvas';
import { debounce } from 'lodash';
import communityQrManageService from '@/api/community-qr-manage/community-qr-manage.service';
import store from '@/store';
import { QrcodeInfoAddComponent } from './qrcode-info-add/qrcode-info-add';
import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
import sessionStorage from '@/utils/session-storage';

@Component({
  template: communityQRManageHtml,
  style: communityQRManageStyle,
  components: {
    'side-frame': SideFrameComponent,
    'qrcode-info-add': QrcodeInfoAddComponent
  }
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
  // currentCommunityId: any = 'a2e01f0e-6c86-4a41-bcf3-c07c1ffa2f82';
  currentCommunityId: any = '';
  // 网格员角色code
  roleCode: any = '477174202197774088264551523168824749';
  // 网格员List
  gridMemberList: any = [];
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
  // 二维码信息form
  qrcodeInfoForm: QrcodeInfo = new QrcodeInfo();
  /**
   * 当前页码
   *
   * @type {Number}
   * @memberof UserManageComponent
   */
  pageIndex: number = 0;
  pageSize: number = 1000;
  /**
   * 搜索防抖
   */
  debounceSearch = debounce(this.search, 500);
  async created() {
    this.qrCodeUrl = store.getters.configs.qrCodeUrl;
    await this.getDataSOurceByDistrictCode();
    this.getCommunityInformationById(this.currentCommunityId);
    this.getCommunityGridMember();
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
    // const obj: any = {
    //   businessId: this.currentSelectRowId,
    //   content: this.qrCodeUrl
    // };
    // const res = await communityQrManageService.generateQRCodeImage(obj);
    // if (res) {
    //   this.getCommunityInformationById(this.currentCommunityId);
    // }
    this.qrcodeInfoForm = new QrcodeInfo();
    this.$set(this.qrcodeInfoForm, 'commuityCode', row.id);
    this.$set(this.qrcodeInfoForm, 'commuityName', row.name);
    // 行政区编码从session获取  sessionStorage.get('district')
    this.$set(this.qrcodeInfoForm, 'regionalismCode', sessionStorage.get('district-all'));
    for (let i = 0; i < this.gridMemberList.length; i++) {
      if (this.gridMemberList[i].address.indexOf(row.id) !== -1) {
        this.$set(this.qrcodeInfoForm, 'responsible', this.gridMemberList[i].name);
        this.$set(this.qrcodeInfoForm, 'responsiblePhone', this.gridMemberList[i].phone);
        break;
      }
    }
    const sideFrame: any = this.$refs['sideFrame'];
    sideFrame.open();
  }
  /**
   * 二维码保存成功
   */
  saveQrcodeSuccess() {
    const sideFrame: any = this.$refs['sideFrame'];
    sideFrame.close();
    this.getCommunityInformationById(this.currentCommunityId);
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
  /**
   * 获取网格员信息
   */
  async getCommunityGridMember() {
    const res: any = await communityQrManageService.pageQueryUsersByRole(
      {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      },
      this.roleCode
    );
    if (res && res.records) {
      this.gridMemberList = res.records;
    } else {
      this.gridMemberList = [];
    }
  }

  /**
   * 通过行政区划code获取数据源
   */
  async getDataSOurceByDistrictCode() {
    const districtCode = sessionStorage.get('district');
    const dataSource: any = await communityQrManageService.queryDataSourceByDistrict(String(districtCode));
    if (dataSource.length > 0) {
      this.currentCommunityId = dataSource[0].id;
    }
  }
}
