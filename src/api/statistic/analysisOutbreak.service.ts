import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import DataSource from '@/models/data-source/data-source';

import odataClient from '@gsafety/odata-client/dist';

export default {
  queryPlotsRecord(districtCode: any, plots: any): Promise<any> {
    const url = store.getters.configs.communityManagerUrl + 'troubleshoot-statistic/' + districtCode;
    return httpClient.postPromise(url, plots);
  },
  queryDDataSourceIdAndName(dataSourceId: any): Promise<any> {
    const q = odataClient({
      service: store.getters.configs.communityManagerOdataUrl,
      resources: 'DSourceDataEntity',
      format: 'json'
    });
    return q
      .filter('dataSourceId', 'eq', dataSourceId)
      .get()
      .then((response: any) => {
        return JSON.parse(response.body).value;
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
};
