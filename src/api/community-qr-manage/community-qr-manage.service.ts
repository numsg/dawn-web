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
import userManageUrl from '@/common/url/user-manage-url';

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
  },
  /**
   * 根据角色分页查询用户
   *
   * @param {*} param
   * @returns {Promise<any>}
   */
  pageQueryUsersByRole(param: any, role: any): Promise<any> {
    const url = store.getters.configs.uapUrl + stringFormat(userManageUrl.getUserByRole, store.getters.configs.clientId, String(role));
    const token = store.getters.configs.superToken;
    return httpClient.postPromise(url, param, {
      headers: {
        'content-type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    });
  },

  /**
   * 查询行政区划code
   */
  queryAdmCodes(): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.communityManagerOdataUrl,
      resources: 'DistrictEntity'
    });
    return q
      .top(100000)
      .get(null)
      .then((response: any) => {
        console.log(response);
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {
        return false;
      });
  },

  queryAdmCodesByParentId(parentId: any): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.communityManagerOdataUrl,
      resources: 'DistrictEntity'
    });
    return q
      .filter('parentId' , 'eq' , parentId)
      .top(100000)
      .get(null)
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {
        return false;
      });
  },

     getAreaCodeInfos(code: string) {
            try {
                const q = odataClient({
                    service: store.getters.configs.communityManagerOdataUrl,
                    resources: 'DistrictEntity',
                });
                const filterStr = '(parentId eq \'' + code + '\')';
                return q.skip(0)
                    .filter(filterStr)
                    .count(true)
                    .get(null)
                    .then((response: any) => {
                    const result = {
                        count: JSON.parse(response.body)['@odata.count'],
                        value: JSON.parse(response.toJSON().body).value,
                    };
                    return result.value;
                    })
                    .catch((error: any) => []);
            } catch (e) {
                console.log(e);
                return [];
            }
        },

    // 根据多租户获取数据源数据及其数据
    queryDataSourceByDistrict(districtCode: any): Promise<any> {
      const q = odataClient({
        service: store.getters.configs.communityManagerOdataUrl,
        resources: 'DataSourceEntity'
      });
      return q
        .filter('description' , 'eq' , districtCode)
        .top(10000)
        .get(null)
        .then((response: any) => {
          return JSON.parse(response.body).value;
        })
        .catch((err: any) => {
          return false;
        });
    },

    queryDistrictByCode(code: any): Promise<any> {
      const q = odataClient({
        service: store.getters.configs.communityManagerOdataUrl,
        resources: 'DistrictEntity'
      });
      return q
        .skip(0)
        .filter('districtCode' , 'eq' , code)
        .get(null)
        .then((response: any) => {
          return JSON.parse(response.body).value;
        })
        .catch((err: any) => {
          return false;
        });
    },
};
