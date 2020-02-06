import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import store from '@/store';
import { HomePageConfig } from '@/models/home/home-page-config';
import axios, { AxiosResponse } from 'axios';

export default {
  getDataBaseCheck() {
    const isUseRmsSys: boolean = store.getters.configs.rmsConfig.useResourceServer;
    const url = store.getters.configs.planPreparationUrl + 'home-configs/check' + `/${isUseRmsSys}`;
    return httpClient.getPromise(url);
  },

  saveHomePageConfig(pageConfig: HomePageConfig) {
    const url = store.getters.configs.planPreparationUrl + 'home-configs/config';
    // return httpClient.postPromise(url, pageConfig);
    return axios.post(url, pageConfig);
  },
  getHomePageConfig(userId: string) {
    const url = store.getters.configs.planPreparationUrl + `home-configs/${userId}`;
    return httpClient.getPromise(url);
  }
};
