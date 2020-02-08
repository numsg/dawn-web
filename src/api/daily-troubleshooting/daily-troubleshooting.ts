import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import odataClient from '@gsafety/odata-client/dist';

import { PersonInfo } from '@/models/daily-troubleshooting/person-info';

export default {
    // 新增填报记录
    addDailyTroubleshooting(info: PersonInfo) {
        const url = store.getters.configs.baseSupportUrl + 'daily-troubleshoot-record';
        return httpClient
        .postPromise(url, info)
        .then(res => {
            return res;
        })
        .catch(err => {
            return false;
        });
    },
    // 通过导入新增文件
    addDailyTroubleshootingByxlsx(info: any) {
      const url = store.getters.configs.baseSupportUrl + 'daily-troubleshoot-record/import';
        return httpClient
        .postPromise(url, info, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(res => {
            return res;
        })
        .catch(err => {
            return false;
        });
    },

  queryAttachments(businessId: any): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.odataUrl,
      resources: 'AttachmentEntity'
    });
    return q
      .filter('businessId', '=', businessId)
      .get()
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {
        return false;
      });
  },

  removeRelation(fileId: any) {
    const url = store.getters.configs.planPreparationUrl + 'attachments/' + fileId;
    return httpClient
      .deletePromise(url)
      .then(res => {
        return res;
      })
      .catch(err => {
        return false;
      });
  }
};
