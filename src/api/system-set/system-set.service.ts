import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import odataClient from '@gsafety/odata-client/dist';

export default {

  // 修改系统名称和标题
  updateSystemSet(param: any): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'system-set';
    return httpClient.putPromise(url, param);
  },

  // 获取系统名称和标题
  querySystemSet(): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'SystemSetEntity',
      format: 'json'
    });
    return q.filter('id', 'eq', store.getters.configs.systemSetId).get().then((response: any) => {
      return JSON.parse(response.body).value;
    }).catch((err: any) => {
      console.log(err);
    });
  }
};
