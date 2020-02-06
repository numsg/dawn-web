import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';

import odataClient from '@gsafety/odata-client/dist';
import RuleTypeModel from '@/models/data-define/rule-type';

export default {
  /**
   * 查询所有规则类型
   *
   * @returns {Promise<any>}
   */
  queryAllRuleTypes(): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'RuleTypeEntity'
    });
    return q
      .top(100)
      .skip(0)
      .get(null)
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {
        console.log(err);
      });
  },

  queryRuleTypeById(ruleTypeId: string): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'RuleTypeEntity'
    });
    return q
      .filter('id', 'eq', ruleTypeId)
      .get(null)
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {
        console.log(err);
      });
  },

  /**
   *根据规则类型id查询规则
   *
   * @param {*} ruleTypeId
   * @returns {Promise<any>}
   */
  queryRuleByRuleTypeId(ruleTypeId: string): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'RuleEntity'
    });
    return q
      .top(100)
      .filter('ruleTypeId', 'eq', ruleTypeId)
      .get(null)
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {
        console.log(err);
      });
  },

  /**
   * 根据id删除一个规则类型
   *
   * @param {*} id
   * @returns {Promise<any>}
   */
  deleteOneRuleType(id: any): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'rule-types/' + id;
    return httpClient.deletePromise(url);
  },

  /**
   * 新增一个规则类型
   *
   * @param {*} ruleType
   * @returns {Promise<any>}
   */
  addOneRuleType(ruleType: any): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'rule-types/';
    return httpClient.postPromise(url, ruleType);
  },

  /**
   * 修改一个规则类型
   *
   * @param {*} ruleType
   * @returns {Promise<any>}
   */
  updateOneRuleType(ruleType: any): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'rule-types/';
    return httpClient.putPromise(url, ruleType);
  }
  /**
   *分页查询规则类型
   *
   * @param {number} page 页数
   * @param {number} count 数量
   * @param {*} keyWords 关键字
   * @returns
   */
  // pageQueryRuleTypes(page: number, count: number, keyWords: any) {
  //   const q = odataClient({
  //     service: store.getters.configs.baseSupportOdataUrl,
  //     resources: 'RuleTypeEntity'
  //   });

  //   if (keyWords === '') {
  //     return q
  //       .skip(count * page)
  //       .top(count)
  //       .count(true)
  //       .get(null)
  //       .then((response: any) => {
  //         const result = {
  //           count: JSON.parse(response.body)['@odata.count'],
  //           value: JSON.parse(response.body).value
  //         };
  //         return result;
  //       })
  //       .catch((error: any) => {});
  //   } else {
  //     const filterStr = '(contains( name, \'' + keyWords + '\')';
  //     return q
  //       .skip(count * page)
  //       .top(count)
  //       .filter(filterStr)
  //       .count(true)
  //       .get(null)
  //       .then((response: any) => {
  //         const result = {
  //           count: JSON.parse(response.body)['@odata.count'],
  //           value: JSON.parse(response.body).value
  //         };
  //         return result;
  //       })
  //       .catch((error: any) => {});
  //   }
  // },

  /**
   * 查询规则数量
   */
  // queryRuleTypeCount(keyWords: any): Promise<any> {
  //   const q = odataClient({
  //     service: store.getters.configs.baseSupportOdataUrl,
  //     resources: 'RuleTypeEntity',
  //   });

  //   if (keyWords === '') {
  //     return q.count(true)
  //       .get(null)
  //       .then((response: any) => {
  //         const result = {
  //           count: JSON.parse(response.body)['@odata.count'],
  //           value: JSON.parse(response.body).value
  //         };
  //         return result;
  //       }).catch((error: any) => {

  //       });
  //   } else {
  //     const filterStr = '(contains( name, \'' + keyWords + '\')';
  //     return q.count(true)
  //       .filter(filterStr)
  //       .get(null)
  //       .then((response: any) => {
  //         const result = {
  //           count: JSON.parse(response.body)['@odata.count'],
  //           value: JSON.parse(response.body).value
  //         };
  //         return result;
  //       }).catch((error: any) => {

  //       });
  //   }
  // },
};
