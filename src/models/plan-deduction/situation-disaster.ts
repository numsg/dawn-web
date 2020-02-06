

/**
 * 情景灾损
 *
 * @export
 * @class SituationDisasterModel
 */
export class SituationDisasterModel {

    /**
     * 情景id
     *
     * @type {String}
     * @memberof SituationDisasterModel
     */
    public situationId: string = '';


    /**
     * 灾害损失id(数据源表中灾害损失的数据源数据id)
     *
     * @type {String}
     * @memberof SituationDisasterModel
     */
    public disasterId: string = '';

    /**
     * 灾害损失id
     *
     * @type {String}
     * @memberof SituationDisasterModel
     */
    public disasterName: string = '';

    /**
     * 灾害级别id(数据源表灾害级别的数据源数据id)
     *
     * @type {String}
     * @memberof SituationDisasterModel
     */
    public dLevelId: string = '';


    /**
     * 灾害级别名称
     *
     * @type {String}
     * @memberof SituationDisasterModel
     */
    public dLevelName: string = '';
}
export default SituationDisasterModel;
