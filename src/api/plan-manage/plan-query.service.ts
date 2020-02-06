import * as httpClient from '@gsafety/vue-httpclient/dist/httpclient';
import odataClient from '@gsafety/odata-client/dist';
import store from '@/store';
import * as format from 'dateformat';
import Plan from '@/models/plan-manage/plan';
import mapperManagerService from '@/common/odata/mapper-manager.service';
import PlanQueryConditions from '@/models/plan-manage/plan-query-conditions';
import moment from 'moment';
import contains from 'ramda/es/contains';
import EventType from '@/models/data-define/event-type';

// import oData from '@gsafety/odata-client/dist';

export default {



    QueryPlansByConditions(conditions: PlanQueryConditions) {
        let filterStr = '';
        filterStr += '(status eq ' + 2 + ') and ';

        if (conditions.type !== -1) {
            filterStr += '(type eq ' + conditions.type + ') and ';
        }
        if (conditions.isDefault !== -1) {
            filterStr += '(isDefault eq ' + conditions.isDefault + ') and ';
        }

        if (conditions.eventTypeIds && conditions.eventTypeIds.length > 0) {
            let str = '';
            for (let i = 0, len = conditions.eventTypeIds.length - 1; i < conditions.eventTypeIds.length; i++) {
                const id = conditions.eventTypeIds[i];
                if (i !== len) {
                    str += '(eventTypeId eq \'' + id + '\') or ';
                } else {
                    str = '(' + str + '(eventTypeId eq \'' + id + '\')' + ') and ';
                    filterStr += str;
                }
            }
        }
        if (conditions.districtLevelIds && conditions.districtLevelIds.length > 0) {
            let str = '';
            for (let i = 0, len = conditions.districtLevelIds.length - 1; i < conditions.districtLevelIds.length; i++) {
                const id = conditions.districtLevelIds[i];
                if (i !== len) {
                    str += '(districtLevelId eq \'' + id + '\') or ';
                } else {
                    str = '(' + str + '(districtLevelId eq \'' + id + '\')' + ') and ';
                    filterStr += str;
                }
            }
        }
        if (conditions.responseSubIds && conditions.responseSubIds.length > 0) {
            let str = '';
            for (let i = 0, len = conditions.responseSubIds.length - 1; i < conditions.responseSubIds.length; i++) {
                const id = conditions.responseSubIds[i];
                if (i !== len) {
                    str += '(responseSubId eq \'' + id + '\') or ';
                } else {
                    str = '(' + str + '(responseSubId eq \'' + id + '\')' + ') and ';
                    filterStr += str;
                }
            }
        }
        if (conditions.planUseIds && conditions.planUseIds.length > 0) {
            let str = '';
            for (let i = 0, len = conditions.planUseIds.length - 1; i < conditions.planUseIds.length; i++) {
                const id = conditions.planUseIds[i];
                if (i !== len) {
                    str += '(planUseId eq \'' + id + '\') or ';
                } else {
                    str = '(' + str + '(planUseId eq \'' + id + '\')' + ') and ';
                    filterStr += str;
                }
            }
        }
        if (conditions.otherCons && conditions.otherCons.length > 0) {
            let str = '';
            for (let i = 0, len = conditions.otherCons.length - 1; i < conditions.otherCons.length; i++) {
                const value = conditions.otherCons[i];
                if (i !== len) {
                    str += '(isDefault eq ' + value + ') or ';
                } else {
                    str = '(' + str + '(isDefault eq ' + value + ')' + ') and ';
                    filterStr += str;
                }
            }
        }
        if (conditions.districtIds && conditions.districtIds.length > 0) {
            let str = '';
            for (let i = 0, len = conditions.districtIds.length - 1; i < conditions.districtIds.length; i++) {
                const id = conditions.districtIds[i];
                if (i !== len) {
                    str += 'contains( districtIds, \'' + id + '\"]' + '\') or ';
                } else {
                    str = '(' + str + 'contains( districtIds, \'' + id + '\"]' + '\')' + ') and ';
                    filterStr += str;
                }
            }
        }
        if (conditions.dateRange && conditions.dateRange.length === 2) {
            filterStr += '(updateTime gt ' + conditions.dateRange[0] + ') and '
                + '(updateTime lt ' + conditions.dateRange[1] + ') and ';
        }
        if (conditions.keyWords) {
            filterStr = 'contains( name, \'' + conditions.keyWords + '\')' + ' and ' + filterStr;
        }
        if (conditions.keywords && conditions.keywords.length > 0) {
            let str = '';
            conditions.keywords.forEach((k: any) => {
                str += 'contains( name, \'' + k + '\') or contains( tag, \'' + k + '\') or ';
            });
            filterStr += '(' + str.substring(0, str.length - 3) + ') \') \')';
        }

        filterStr = '(' + filterStr.substring(0, filterStr.length - 5) + ')';
        return this.planBasicQuery(Number(conditions.pageSize), Number(conditions.page))
            .filter(filterStr)
            .orderby(conditions.sort.type, conditions.sort.flag)
            .get()
            .then((response: any) => {
                const result = {
                    total: JSON.parse(response.toJSON().body)['@odata.count'],
                    value: this.buildTemplateList(JSON.parse(response.toJSON().body).value, conditions)
                };
                return result;
            }
            ).catch((error: any) => {
                console.log('time: ' + new Date() + error);
            });
    },



    /**
     * ODATA - 模板基础查询语句
     *
     * @param {number} loadCount
     * @param {number} page
     * @returns
     */
    planBasicQuery(loadCount: number, page: number): any {
        const q = odataClient({
            service: store.getters.configs.odataUrl,
            resources: 'PlanEntity',
        });

        return q.skip(loadCount * page).top(loadCount)
            .count(true)
            //  .expand('eventTypeEntity')
            .expand('districtLevelEntity')
            .expand('responseSubEntity')
            .expand('planUseEntity');
    },

    buildTemplateList(result: any, conditions?: any) {
        const res: any[] = [];
        if (Array.isArray(result) && result.length > 0) {
            result.forEach((data: any) => {
                const plan = new Plan();
                mapperManagerService.mapper(data, plan);
                plan.tag = data.tag.startsWith('[') ? JSON.parse(data.tag) : [data.tag];
                plan.districtIds = data.districtIds.startsWith('[') ? JSON.parse(data.districtIds) : [data.districtIds];
                plan.createTime = moment(data.createTime)
                    // .utc(false)
                    .format('YYYY-MM-DD HH:mm:ss');
                plan.updateTime = moment(data.updateTime)
                    // .utc(false)
                    .format('YYYY-MM-DD HH:mm:ss');
                // mapperManagerService.mapper(data.eventTypeEntity, plan.eventType);
                // plan.eventType.image = data.eventTypeEntity.image ? JSON.parse(data.eventTypeEntity.image) : {};
                // plan.eventType.iconString = data.eventTypeEntity.icon ? 'data:image/png;base64,' + data.eventTypeEntity.icon : '';
                // plan.eventType.label = data.eventTypeEntity.name;
                // plan.eventType.imgColor = data.eventTypeEntity.imgColor;
                mapperManagerService.mapper(data.districtLevelEntity, plan.districtLevel);
                mapperManagerService.mapper(data.planUseEntity, plan.planUse);
                mapperManagerService.mapper(data.responseSubEntity, plan.responseSub);
                res.push(plan);
            });
        }
        return this.mapperEventType(res, conditions);
    },

    /**
     * 根据事件类型过滤预案
     * @param {Plan} plans
     * @param {PlanQueryConditions} conditions
     */
    mapperEventType(plans: Plan[], conditions?: PlanQueryConditions) {
        if (plans && plans.length > 0) {
            const eventTypes: EventType[] = store.getters.baseData_oneDimensionalEventTypes;
            plans.forEach(e => {
                e.eventType = (eventTypes.find(k => k.id === e.eventTypeId) as EventType) || new EventType();
            });
        }
        return plans;
    },



    /**
     * 通过id查询预案详情, 包含planOutlineModels
     *
     *  @param {string} planUseId
     * @returns {Promise<any>}
     * */
    queryPlanByPlanId(planUseId: string): Promise<any> {
        const url = store.getters.configs.planPreparationUrl + 'plans/' + planUseId;
        return httpClient
            .getPromise(url)
            .then(response => {
                return response.data;
            })
            .catch(error => { });
    },

    pageQueryHistoryVersion(param: any): Promise<any> {
        const url = store.getters.configs.planPreparationUrl + 'plans/history';
        return httpClient
            .postPromise(url, param)
            .then(response => {
                return response;
            })
            .catch(error => {
                return false;
            });
    }
};
