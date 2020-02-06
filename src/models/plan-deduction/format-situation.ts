import TagModel from '../common/tag-model';
/**
 * 情景表
 *
 * @export
 * @class FormatSituationModel
 */
export class FormatSituationModel {
  public id: string = '';

  /**
   * 名称
   *
   * @type {String}
   * @memberof FormatSituationModel
   */
  public name: string = '';

  /**
   * 描述
   *
   * @type {String}
   * @memberof FormatSituationModel
   */
  public description: string = '';

  /**
   * 创建时间
   *
   * @type {String}
   * @memberof NewSituationModel
   */
  public createTime: string = '';

  /**
   * 已经去掉了暂时保留
   *
   * @type {Array<any>}
   * @memberof FormatSituationModel
   */
  public tag: Array<any> = [];

  public eventType = { name: '', id: '' };

  public eventTypeId: string = '';
}
export default FormatSituationModel;
