import transformToColor from './../../common/filters/colorformat';
import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import { treeToArray } from '@/common/utils/utils';
import mapperManager from '@/common/odata/mapper-manager.service';
import EpidemicPerson from '@/models/home/epidemic-persion';
import odataClient from '@gsafety/odata-client/dist';
import moment from 'moment';
import mapperManagerService from '@/common/odata/mapper-manager.service';
import { communityQRManageUrl } from '@/common/url/community-qr-manage-url';
import { stringFormat } from '@gsafety/cad-gutil/dist/stringformat';

export default {
  /**
   * 生成单个二维码
   */
  generateQRCodeImage(param: any): Promise<any> {
    const baseUrl = store.getters.configs.communityManagerUrl;
    const url = stringFormat(`${baseUrl}${communityQRManageUrl.generateQRCodeImage}`);
    return httpClient.postPromise(url, param);
  },
  /**
   * 批量生成二维码
   */
  batchGenerateQRCodeImage(param: any): Promise<any> {
    const baseUrl = store.getters.configs.communityManagerUrl;
    const url = stringFormat(`${baseUrl}${communityQRManageUrl.batchGenerateQRCodeImage}`);
    return httpClient.postPromise(url, param);
  },

  /**
   * 根据Id查询二维码详情
   */
  getQRCodeById(id: any) {
    const baseUrl = store.getters.configs.communityManagerUrl;
    const url = stringFormat(`${baseUrl}${communityQRManageUrl.getQRCodeById}`, id);
    return httpClient.getPromise(url);
  },
  /**
   * 根据Id查询二维码详情
   */
  getQRCodeListByIds(param: any): Promise<any> {
    const url = store.getters.configs.communityManagerUrl + communityQRManageUrl.getQRCodeListByIds;
    return httpClient.postPromise(url, param);
  }
};
