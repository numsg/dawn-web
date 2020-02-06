export class SituationDisasterModels {
  public id: string = '';
  public disasterId: string = '';
  public disasterLevelId: string = '';
  public disasterLevelName: string = '';
  public disasterName: string = '';
  public situationId: string = '';
}

export class PlanSituationModels {
  public id: string = '';
  public planId: string = '';
  public situationId: string = '';
}
export class NewSituationModel {
  public id: string = '';

  /**
   * 预案id
   *
   * @type {String}
   * @memberof SituationModel
   */
  // public templateId: string = '';

  /**
   * 名称
   *
   * @type {String}
   * @memberof SituationModel
   */
  public name: string = '';

  /**
   * 描述
   *
   * @type {String}
   * @memberof SituationModel
   */
  public description: string = '';

  /**
   * 标签
   *
   * @type {String}
   * @memberof SituationModel
   */
  public tag: string = '';

  /**
   * 创建时间
   *
   * @type {String}
   * @memberof NewSituationModel
   */
  public createTime: string = '';


  /**
   * 推演时间
   *
   * @type {String}
   * @memberof NewSituationModel
   */
  public deduceTime: string = '';

  deduceModel: any = {};
}
export default NewSituationModel;
