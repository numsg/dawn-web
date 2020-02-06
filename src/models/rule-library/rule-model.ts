import RuleConditionModel from './rule-condition-model';

export class RuleModel {
  /**
   * 唯一约束
   *
   * @type {String}
   * @memberof RuleModel
   */
  public id: string = '';

  /**
   * 规则类型id
   *
   * @type {String}
   * @memberof RuleModel
   */
  public ruleTypeId: string = '';

  /**
    * 规则类型名称
    *
    * @type {String}
    * @memberof RuleModel
    */
  public ruleTypeName: string = '';

  /**
   * 描述
   *
   * @type {String}
   * @memberof RuleModel
   */
  public description: string = '';


  /**
   * 名称
   *
   * @type {String}
   * @memberof RuleModel
   */
  public name: string = '';


  /**
   * 名称来源（数据源id）
   * @type {String}
   * @memberof RuleModel
   */
  public nameSourceIds: string = '';

  /**
   * 条件来源（多个数据源数据id)
   */
  public conditionSourceIds: string = '';

  /**
   * 规则输出
   *
   * @type {String}
   * @memberof RuleModel
   */
  public result: string = '';

  /**
  * 规则输出ids
  *
  * @type {String}
  * @memberof RuleModel
  */
  public resultIds: string = '';

  /**
   * 结果类型id
   * 自定义'0'和数据源id
   * @type {String}
   * @memberof RuleModel
   */
  public resultSourceId: string = '';

  /**
   * 结果类型名称
   */
  public resultSourceName: string = '';

  /**
   * 规则字符串
   *
   * @type {String}
   * @memberof RuleModel
   */
  public ruleStr: string = '';

  /**
   * 规则条件
   *
   * @type {Array<RuleConditionModel>}
   * @memberof RuleModel
   */
  public conditionModels: Array<RuleConditionModel> = [];

}
export default RuleModel;
