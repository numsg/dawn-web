/**
 * 大纲节点元件
 *
 * @export
 * @class PlanCell
 */
export class PlanCell {
  /**
   * id
   *
   * @type {String}
   * @memberof PlanCell
   */
  id: string = '';

  /**
   * 元件name
   *
   * @type {String}
   * @memberof PlanCell
   */
  name: string = '';

  /**
   * 预案id,新建填空
   *
   * @type {String}
   * @memberof PlanCell
   */
  planId: string = '';

  /**
   * 对应的大纲id
   *
   * @type {String}
   * @memberof PlanCell
   */
  planOutlineId: string = '';

  /**
   * 元件的id
   *
   * @type {String}
   * @memberof PlanCell
   */
  cellId: string = '';

  /**
   * 元件的编辑时间
   *
   * @type {String}
   * @memberof PlanCell
   */
  editTime: string = '';

  /**
   * 元件类型id<大纲类或者非大纲类>
   *
   * @type {String}
   * @memberof PlanCell
   */
  cellTypeId: string = '';

  /**
   * 元件类型名称
   *
   * @type {String}
   * @memberof PlanCell
   */
  cellTypeName: string = '';

  /**
   * 元件的事件类型id
   *
   * @type {String}
   * @memberof PlanCell
   */
  eventTypeId: string = '';

  /**
   * 元件的事件类型名称
   *
   * @type {String}
   * @memberof PlanCell
   */
  eventTypeName: string = '';

  /**
   * 元件的标签
   *
   * @type {String}
   * @memberof PlanCell
   */
  tag: string = '';

  /**
   * 元件的布局
   *
   * @type {String}
   * @memberof PlanCell
   */
  layout: string = '';

  /**
   * 元件的数据
   *
   * @type {String}
   * @memberof PlanCell
   */
  data: string = '';

  /**
   * 元件的规则
   *
   * @type {String}
   * @memberof PlanCell
   */
  rules: string = '';

  extraInfo: string = '';

  /**
   * 元件中的小部件
   *
   * @type {String}
   * @memberof PlanCell
   */
  widgets: string = '';

  /**
   * 元件中部件的数量
   *
   * @type {Number}
   * @memberof PlanCell
   */
  widgetCount: number = 0;

  conditions: string = '';

  key: string = '';
}

export default PlanCell;
