import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';

export default {

  /**
   *规则导入
   *
   * @param {*} file
   * @returns {Promise<any>}
   */
  importRules(file: any): Promise<any> {
    const url = store.getters.configs.planFileUrl + 'rule/import';
    return httpClient.postPromise(url, file);
  }
};
