export class FormatCellModel {

    /**
     * id
     *
     * @type {String}
     * @memberof FormatCellModel
     */
    id: string = '';

    /**
     * key
     *
     * @type {String}
     * @memberof FormatCellModel
     */
    key: string = '';

    /**
     * 元件类型id
     *
     * @type {String}
     * @memberof FormatCellModel
     */
    cellTypeId: string = '';


    /**
     * 原件名称
     *
     * @type {String}
     * @memberof FormatCellModel
     */
    name: string = '';


    /**
     * 数据
     *
     * @type {Array<any>}
     * @memberof FormatCellModel
     */
    data: Array<any> = [];


    /**
     * 编辑时间
     *
     * @type {String}
     * @memberof FormatCellModel
     */
    editTime: string = '';


    /**
     * 二级事件类型id
     *
     * @type {String}
     * @memberof FormatCellModel
     */
    eventTypeId: string = '';



    /**
     * 布局
     *
     * @type {*}
     * @memberof FormatCellModel
     */
    layout: any;


    /**
     * 验证
     *
     * @type {*}
     * @memberof FormatCellModel
     */
    rules: any;


    /**
     * 标签
     *
     * @type {Array<string>}
     * @memberof FormatCellModel
     */
    tag: Array<string> = [];

    /**
     * 组件数量
     *
     * @type {Number}
     * @memberof FormatCellModel
     */
    widgetCount: number = 0;


    /**
     * 组件
     *
     * @type {Array<any>}
     * @memberof FormatCellModel
     */
    widgets: Array<any> = [];

    eventTypeIcon: string = '';

    extraInfo: any = {};
}
export default FormatCellModel;
