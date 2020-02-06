
/**
 * 情景表
 *
 * @export
 * @class SituationModel
 */
export class SituationModel {
    public id: string = '';

    /**
     * 预案id
     *
     * @type {String}
     * @memberof SituationModel
     */
    public templateId: string = '';

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

}
export default SituationModel;
