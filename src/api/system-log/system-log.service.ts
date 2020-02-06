import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import odataClient from '@gsafety/odata-client/dist';
import { Model } from 'vue-property-decorator';
import { LOGTYPE } from '@/common/enums/log';

export default {
  addSystemLog(param: any) {
    const url = store.getters.configs.baseSupportUrl + 'system-logs';
    return httpClient.postPromise(url, param);
  },

  querySystemLog(conditions: any, pageCount: any, page: any) {
    const q = odataClient({
      service: store.getters.configs.baseSupportOdataUrl,
      resources: 'SystemLogEntity',
    });
    let filterStr = '(type eq \'' + LOGTYPE.INFO + '\') and ';
    if (conditions.operatePerson) {
      filterStr += 'contains( operatePerson, \'' + conditions.operatePerson + '\')' + ' and ';

    }
     if (conditions.keyword) {
      filterStr += 'contains( description, \'' + conditions.keyword + '\')' + ' and ';
    }
     if (conditions.module) {
      if (conditions.module && Array.isArray(conditions.module)) {
        let str = '';
        const temp: any = [];
        conditions.module.forEach((mod: any) => {
          if ( temp.findIndex((i: any) => i === Model.name) < 0) {
            temp.push(mod.name);
            str += '(module eq \'' + mod.name + '\') or ';
          }
        });
        str += conditions.isConditions ? '' : '(module eq \''  + '\') or ';
        str = '(' + str.substring(0, str.length - 4) + ') and ';
        filterStr += str;
      }
    }
     if (conditions.action) {
      filterStr += '(action eq \'' + conditions.action + '\') and ';
    }

    if (conditions.dateRange && conditions.dateRange.length === 2) {
      filterStr += '(time gt ' + conditions.dateRange[0] + ') and '
          + '(time lt ' + conditions.dateRange[1] + ') and ';
  }
    filterStr = '(' + filterStr.substring(0, filterStr.length - 5) + ')';
    return q.skip(pageCount * page)
    .top(pageCount)
    .count(true)
    .filter(filterStr)
    .orderby('time', 'desc')
    .get()
    .then((response: any) => {
      const data = {
        list: JSON.parse(response.body).value,
        count: JSON.parse(response.body)['@odata.count']
      };
        return data;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
};
