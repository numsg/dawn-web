import PlanRelevanceModel, { PlanModel } from '@/models/plan-manage/plan-model';
import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import odataClient from '@gsafety/odata-client/dist';
import store from '@/store';
import planQueryService from './plan-query.service';
import { stringFormat } from '@gsafety/cad-gutil/dist/stringformat';
import { PlanManageUrl } from '@/common/url/plan-manage-url';
import PlanQueryConditions from '@/models/plan-manage/plan-query-conditions';

export default {
  /**
   * 空白新建预案
   *
   * @param {PlanRelevanceModel} data
   * @returns {Promise<any>}
   */
  blankMakeNewPlan(data: any): Promise<any> {
    const url = store.getters.configs.planPreparationUrl + 'plans';
    const fd: any = this.planModelToPlanFile(data);
    return httpClient.postPromise(url, fd, {
      headers: {
        'content-type': 'application/json'
      }
    });
  },

  /**
   * 加载预案模板列表
   *
   * @param {number} tempType 预案模板类型
   * @param {number} loadCount 预加载数量
   * @param {*} page 所需加载的页数
   * @returns {Promise<any>}
   * @memberof TemplateManageService
   */
  LoadPlans(sort: any, loadCount: number, page: number, dateRange?: string[]): Promise<any> {
    // let filterStr = '';
    // if (dateRange && dateRange.length === 2) {
    //   filterStr = '((updateTime gt ' + dateRange[0] + ') and ' + '(updateTime lt ' + dateRange[1] + '))';
    // }
    return (
      planQueryService
        .planBasicQuery(loadCount, page)
        // .filter(filterStr)
        .orderby(sort.type, sort.flag)
        .get()
        .then((response: any) => {
          return planQueryService.buildTemplateList(JSON.parse(response.toJSON().body).value);
        })
        .catch((error: any) => { })
    );
  },

  /**
   * 加载同一事件类型相关联的其他模板
   *
   * @param {*} eventType 事件类型
   * @param {*} loadCount 所需加载的数量
   * @returns {Promise<any>}
   * @memberof TemplateManageService
   */
  LoadRelevanceTemplates(eventType: any, loadCount: number): Promise<any> {
    return httpClient
      .postPromise('', {
        eventTypes: eventType,
        loadCount: loadCount
      })
      .then(response => {
        return response.data;
      })
      .catch(error => { });
  },

  /**
   * 获取事件类型统计
   */
  getEventTypeStatistics(conditions?: PlanQueryConditions) {
    const url = store.getters.configs.planPreparationUrl + PlanManageUrl.eventTypes;
    return httpClient.getPromise(url);
  },

  /**
   * 获取行政级别统计
   */
  getDistrictLevelStatistics() {
    const url = store.getters.configs.planPreparationUrl + PlanManageUrl.districtLevels;
    return httpClient.getPromise(url);
  },

  /**
   * 获取预案属性统计
   */
  getPlanUseStatistics() {
    const url = store.getters.configs.planPreparationUrl + PlanManageUrl.planUses;
    return httpClient.getPromise(url);
  },

  /**
   * 获取事件类型统计
   */
  queryEventTypeStatistics(conditions?: PlanQueryConditions) {
    const isUseRmsSys: boolean = store.getters.configs.rmsConfig.useResourceServer;
    const url = store.getters.configs.planPreparationUrl + PlanManageUrl.conditions + `/${isUseRmsSys}`;
    // const url = store.getters.configs.planPreparationUrl + PlanManageUrl.conditions;
    return httpClient.postPromise(url, conditions);
  },

  /**
   * 根据预案id查询预案
   * @param planId 预案id
   */
  queryPlanDetail(planId: string) {
    const url = store.getters.configs.planPreparationUrl + stringFormat(PlanManageUrl.planDetail, String(planId));
    return httpClient.getPromise(url);
  },

  queryPlanDetailById(planId: string) {
    const filterStr = 'id eq \'' + planId + '\'';
    const q = odataClient({
      service: store.getters.configs.odataUrl,
      resources: 'PlanEntity'
    });
    return q
      // .expand('eventTypeEntity')
      .expand('districtLevelEntity')
      .expand('responseSubEntity')
      .expand('planUseEntity')
      .filter(filterStr)
      .get()
      .then((response: any) => {
        return planQueryService.buildTemplateList(JSON.parse(response.toJSON().body).value);
      })
      .catch((error: any) => { });
  },
  deletePlan(planId: string) {
    const url = store.getters.configs.planPreparationUrl + stringFormat(PlanManageUrl.planDetail, String(planId));
    return httpClient.deletePromise(url);
  },

  templateMakeNew() { },

  /**
   * 修改预案,保存为新版本
   *
   * @param {*} param
   * @returns {Promise<any>}
   */
  editNewVersion(param: any, planId: string): Promise<any> {
    const url = store.getters.configs.planPreparationUrl + 'plans/version/' + planId;
    const fd: any = this.planModelToPlanFile(param);
    return httpClient.putPromise(url, fd, {
      headers: {
        'content-type': 'application/json'
      }
    });
  },

  /**
   * 修改预案, 不另存为新版本
   *
   * @param {*} param
   * @returns {Promise<any>}
   */
  editSave(param: any): Promise<any> {
    const url = store.getters.configs.planPreparationUrl + 'plans';
    const fd = this.planModelToPlanFile(param);
    return httpClient.putPromise(url, fd, {
      headers: {
        'content-type': 'application/json'
      }
    });
  },

  // 预案转换成file之后上传
  planModelToPlanFile(planModel: any) {
    const bolb = new Blob([JSON.stringify(planModel)]);
    return bolb;
  },

  /**
   * 根据预案名称查询预案<完全匹配>
   *
   * @param {String} name
   * @returns {Promise<any>}
   */
  queryPlanByName(name: any, id: any) {
    const url = store.getters.configs.planPreparationUrl + 'plans/name/judge-repeating/' + id + '/' + name;
    return httpClient.getPromise(url).catch(() => {
      return 'error';
    });
  }
};
