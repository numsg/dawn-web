import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import SessionStorage from '@/utils/session-storage';
import store from '@/store';

class CommunityStatisticsService {
  async queryFocusOnPersonData(dimension: string) {
    const multiTenancy = SessionStorage.get('district');
    // const url = store.getters.configs.communityManagerUrl + `epidemic-person/total/all/${multiTenancy}`;
    let conditionUrl = '';
    let apiUrl = '';
    if (dimension === '1') {
      conditionUrl = store.getters.configs.medicalOpinionsId;
      apiUrl = `epidemic-person/plot-classification/${multiTenancy}/${conditionUrl}`;
    } else {
      conditionUrl = store.getters.configs.medicalConditionDataSourceId;
      apiUrl = `epidemic-person/plot-medical/${multiTenancy}/${conditionUrl}`;
    }
    const url = store.getters.configs.communityManagerUrl + apiUrl;
    return httpClient.getPromise(url);
  }
}

const communityStatisticsService = new CommunityStatisticsService();
export default communityStatisticsService;
