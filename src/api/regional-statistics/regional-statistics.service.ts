import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import { verifyArrayEmptyOrUndefined } from '@gsafety/whatever/dist/util';

class RegionalStatisticsService {
  /**
   * 读取地图统计数据
   *
   * @param {string} url 数据来源地址
   * @returns
   * @memberof RegionalStatisticsService
   */
  async loadMapDatas(url: string) {
    return await httpClient.getPromise(url).catch((err: any) => {
      throw new Error(err);
    });
  }

  /**
   * 加载地图疫情分布情况
   *
   * @param {string} [url] 数据服务地址
   * @returns
   * @memberof RegionalStatisticsService
   */
  async loadMapDistributionDatas(url?: string) {
    let finalUrl = 'http://39.105.209.108:3001/ncov/d420115/findNewStatics?area_id=420115';
    if (url && url !== '') {
      finalUrl = url;
    }
    return await httpClient.getPromise(finalUrl).catch((err: any) => {
      throw new Error(err);
    });
  }

  async loadNewCaseData(url: string) {
    let data = await httpClient.getPromise(url).catch((err: any) => {
      throw new Error(err);
    });
    if (!verifyArrayEmptyOrUndefined(data)) {
      data = [];
    }
    return data;
  }
}

export const regionalStatisticsService = new RegionalStatisticsService();
