import PlanCell from './plan-cell';
import PlanContent from './plan-content';
/**
 *  预案大纲
 * @export
 * @class PlanRelevanceModel
 */
export class PlanRelevanceModel {
  /**
   * 大纲项的id
   *
   * @type {String}
   * @memberof PlanRelevanceModel
   */
  public id: string = '';

  /**
   * 大纲的name
   *
   * @type {String}
   * @memberof PlanRelevanceModel
   */
  public name: string = '';

  /**
   * 大纲层次 填'1'
   *
   * @type {String}
   * @memberof PlanRelevanceModel
   */
  public outlineLevel: string = '';

  /**
   * 一级大纲pid为'-1'
   *
   * @type {String}
   * @memberof PlanRelevanceModel
   */
  public pid: string = '';

  /**
   * 新建填空
   *
   * @type {String}
   * @memberof PlanRelevanceModel
   */
  public planId: string = '';

  /**
   * 大纲节点元件
   *
   * @type {PlanCell}
   * @memberof PlanRelevanceModel
   */
  public planCellModels: PlanCell[] = [];

  /**
   * 大纲节点文本
   *
   * @type {PlanContent}
   * @memberof PlanRelevanceModel
   */
  public planContentModel: PlanContent = new PlanContent();
  public children: Array<PlanRelevanceModel> = [];
  // public outlineContentModels?: Array<any> = [];
  /**
   *内容原件数组
   * @type {any[]}
   * @memberof PlanRelevanceModel
   */
  components: any[] = [];

  /*
  * 标识
  * 1表示其它，0标识整体大纲本身
  */
  identification: number = 1;

}
export default PlanRelevanceModel;
