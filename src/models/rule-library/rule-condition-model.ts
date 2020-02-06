export class RuleConditionModel {

    /**
     * 唯一约束
     *
     * @type {String}
     * @memberof RuleConditionModel
     */
    public id: string = '';

    /**
     * 属性名称
     *
     * @type {String}
     * @memberof RuleConditionModel
     */
    public param: string = '';

    /**
     * 正则表达式
     *
     * @type {String}
     * @memberof RuleConditionModel
     */
    public regExp: string = '';

    /**
     * 规则id
     *
     * @type {String}
     * @memberof RuleConditionModel
     */
    public ruleId: string = '';


    /**
     * 符号
     *
     * @type {String}
     * @memberof RuleConditionModel
     */
    public symbol: string = '';

    /**
     * 属性值
     *
     * @type {String}
     * @memberof RuleConditionModel
     */
    public value: string = '';

    /**
     * 数据源数据id
     *
     * @type {String}
     * @memberof RuleConditionModel
     */
    public dSourceDataId: string = '';


    /**
     * 点击按钮，显示编辑正则表达式
     */
    public inputVisible: boolean = false;

}
export default RuleConditionModel;
