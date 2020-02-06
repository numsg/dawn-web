import PlanRelevanceModel from './plan-relevance-models';
import AppendixGraph from './appendix-graph';
import AppendixContact from './appendix-contacts';
export class PlanModel {
  public id: string = '';
  public name: string = '';

  /**
   * 事件类型id
   *
   * @type {String}
   * @memberof PlanModel
   */
  public eventTypeId: string = '';

  /**
   * 行政区划id
   *
   * @type {String}
   * @memberof PlanModel
   */
  public districtIds: string = '';

  /**
   * 行政级别id
   *
   * @type {String}
   * @memberof PlanModel
   */
  public districtLevelId: string = '';

  /**
   * 用途id
   *
   * @type {String}
   * @memberof PlanModel
   */
  public planUseId: string = '';

  /**
   * 创建时间
   *
   * @type {String}
   * @memberof PlanModel
   */
  public createTime: string = '';

  /**
   * 封面图片
   *
   * @type {String}
   * @memberof PlanModel
   */
  public cover: string = '';

  /**
   * 创建人
   *
   * @type {String}
   * @memberof PlanModel
   */
  public createPerson: string = '';

  /**
   * 预案模板描述
   *
   * @type {String}
   * @memberof PlanModel
   */
  public description: string = '';

  /**
   * 是否为默认模板
   *
   * @type {Number}
   * @memberof PlanModel
   */
  public isDefault: number = 0;

  /**
   * 责任主体id
   *
   * @type {String}
   * @memberof PlanModel
   */
  public responseSubId: string = '';

  /**
   * 状态
   *
   * @type {Number}
   * @memberof PlanModel
   */
  public status: number = 0;

  /**
   * 类型(0: word编制,1:元件编制)
   *
   * @type {Number}
   * @memberof PlanModel
   */
  public type: number = 0;

  /**
   * tag
   *
   * @type {String}
   * @memberof PlanModel
   */
  public tag: string = '';

  /**
   * 最近一次更新人
   *
   * @type {String}
   * @memberof PlanModel
   */
  public updatePerson: string = '';

  /**
   * 最近一次更新时间
   *
   * @type {Date}
   * @memberof PlanModel
   */
  public updateTime: string | Date = new Date();

  /**
   * 版本号
   *
   * @type {String}
   * @memberof PlanModel
   */
  public version: string = 'v1.0';

  /**
   * 预案大纲
   *
   * @type {Array<PlanRelevanceModel>}
   * @memberof PlanModel
   */
  public planOutlineModels: Array<PlanRelevanceModel> = [];

  /**
   * 预案的高级配置项
   *
   * @type {String}
   * @memberof PlanModel
   */
  public config: string = '{}';

  /**
   * 流程图
   * @type {AppendixGraph[]}
   * @memberof PlanModel
   */
  public appendixGraphModels: AppendixGraph[] = [];

  /**
   * 通讯录
   * @type {AppendixContact[]}
   * @memberof PlanModel
   */
  public appendixContactModels: AppendixContact[] = [];

  public multiTenancy: string = '';
}
export default PlanModel;
