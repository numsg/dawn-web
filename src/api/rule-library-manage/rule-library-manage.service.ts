
import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';

import odataClient from '@gsafety/odata-client/dist';
import RuleModel from '@/models/rule-library/rule-model';

export default {
  /**
   * 分页查询规则库
   * @param page
   * @param count
   * @param keyWords
   */
  queryRule(page: number, count: number, keyWords: any, ruleTypeId: any, sort: any) {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'RuleEntity',
    });
    const filterStr = this.setFilterStr(keyWords, ruleTypeId);
    let result = {};
    if (filterStr === '') {
      return q.skip(count * page).top(count)
        .orderby(sort.type, sort.flag)
        .orderby('id')
        .count(true)
        .get(null)
        .then((response: any) => {
           result = {
            count: JSON.parse(response.body)['@odata.count'],
            value: JSON.parse(response.body).value
           // value: this.bulidData(JSON.parse(response.body).value, ruleTypeId)
          };
          return  result;
        }).catch((error: any) => {

        });
    } else {
      return q.skip(count * page).top(count)
        .filter(filterStr)
        .orderby(sort.type, sort.flag)
        .orderby('id')
        .count(true)
        .get(null)
        .then(this.odataResult)
        .catch((error: any) => {

        });
    }
  },

  odataResult(response: any) {
    const result = {
      count: JSON.parse(response.body)['@odata.count'],
      value: JSON.parse(response.body).value
    };
    return result;
  },


  /**
   * 设置过滤条件
   *
   * @param {*} keyWords
   * @param {*} ruleTypeId
   * @returns
   */
  setFilterStr(keyWords: any, ruleTypeId: any) {
    let filterStr = '';

    if (keyWords !== '') {
      filterStr = '(contains( name, \'' + keyWords + '\')' + ' or ' +
        'contains( result, \'' + keyWords + '\')' + ' or ' +
        'contains( ruleTypeName, \'' + keyWords + '\')' + ' or ' +
        'contains( description, \'' + keyWords + '\')' + ' or ' +
        'contains( resultSourceName, \'' + keyWords + '\'))';
    }

    if (ruleTypeId !== '' && keyWords !== '') {
      filterStr = filterStr + ' and ' + '(ruleTypeId eq \'' + ruleTypeId + '\')';
    }

    if (keyWords === '' && ruleTypeId !== '') {
      filterStr = '(ruleTypeId eq \'' + ruleTypeId + '\')';
    }
    return filterStr;
  },

  // bulidData(rules: any, ruleTypeId: any) {
  //   const ruleType = this.queryRuleTypeById(ruleTypeId);
  //   rules.forEach((el: any) => {
  //       el.ruleTypeName = ruleType.name;
  //   });
  //   return rules;
  // },


  // /**
  //  *通过规则类型id查询规则类型
  // *
  // * @param {*} ruleTypeId
  // * @returns
  // */
  // queryRuleTypeById(ruleTypeId: any) {
  //   const q = odataClient({
  //     service: store.getters.configs.baseSupportOdataUrl,
  //     resources: 'RuleTypeEntity'
  //   });
  //   return q
  //   .get(null)
  //   .filter('(id eq \'' + ruleTypeId + '\')')
  //     .then((response: any) => {
  //       return JSON.parse(response.body).value;
  //     }).catch((err: any) => {
  //       console.log(err);
  //     });
  // },


  /**
   * 新增一条规则
   * @param ruleModel  规则
   */
  addRule(ruleModel: RuleModel): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'rules';
    return httpClient.postPromise(url, ruleModel).catch(e => {
      return false;
    });
  },

  /**
   * 统计规则数量
   *
   * @param {*} keyWords  关键字
   * @param {*} ruleTypeId 规则类型
   * @returns {Promise<any>}
   */
  getRuleCount(keyWords: any, ruleTypeId: any): Promise<any> {
    const filterStr = this.setFilterStr(keyWords, ruleTypeId);

    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'RuleEntity',
    });

    if (filterStr === '') {
      return q.count(true)
        .get(null)
        .then(this.odataResult).catch((error: any) => {

        });
    } else {
      return q.count(true)
        .filter(filterStr)
        .get(null)
        .then(this.odataResult).catch((error: any) => {

        });
    }
  },

  /**
   * 删除一条规则
   *
   * @param {*} index 规则 id
   * @returns {Promise<any>}
   */
  deleteRule(index: any): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'rules/' + index;
    return httpClient.deletePromise(url).catch(e => {
      return false;
    });
  },
  /**
   * 修改一条规则
   * @param ruleModel
   */
  updateRule(ruleModel: RuleModel): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'rules';
    return httpClient.putPromise(url, ruleModel).catch(e => {
      return false;
    });
  },

  /**
   * 根据规则id查询规则的条件
   *
   * @param {*} index
   * @returns {Promise<any>}
   */
  queryRuleConditionsByRuleId(index: any): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'RuleConditionEntity',
      format: 'json'
    });
    return q.filter('ruleId', 'eq', index).get()
      .then((response: any) => {
        return JSON.parse(response.body).value;
      }).catch((err: any) => {
        console.log(err);
      });
  },

  /**
   * 通过规则类型查询所有规则
   *
   * @returns {Promise<any>}
   */
  queryRulesByRuleType(ruleTypeId: any): Promise<any> {
    const url = store.getters.configs.baseSupportUrl + 'rules/rule-types/' + ruleTypeId;
    return httpClient.getPromise(url);
  },

  /**
   *查询规则是否被数据源使用
   *
   * @returns {Promise<any>}
   */
  queryRulesAssData(): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'RuleEntity',
    });
    return q.top(10000).select('resultSourceId' , 'conditionSourceIds' , 'resultIds').get().then((response: any) => {
      return JSON.parse(response.body).value;
    }).catch((err: any) => {
      console.log(err);
    });
  },

  queryRuleConAssData(): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'RuleConditionEntity',
    });
    return q.select('dSourceDataId').top(10000).get().then((response: any) => {
      return JSON.parse(response.body).value;
    }).catch((err: any) => {
      console.log(err);
    });
  }
};
