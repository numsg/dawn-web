import PersonBase from './person-base';
import RecordExpend from './record-expend';

/**
 * 最新的排查记录
 */
export default class TroubleshootRecord {

    id: string = '';

    // 小区
    plot: string = '';

    // 楼栋
    building: string = '';

    // 单元号
    unitNumber: string = '';

    // 房号
    roomNo: string = '';

    // 年龄
    age: number = 1;

    // 过去14天是否离开过本地区
    isLeaveArea: boolean = false;

    // 确诊情况
    confirmed_diagnosis: string = '';

    // 填报时间
    createTime!: Date | string;

    personBaseId: string = '';
    personBase: PersonBase = new PersonBase();
    /**
     * 排查日期
     */
    createDate!: Date | string;

    // 多租户
    multiTenancy: string = '';

        /**
     * 行政区划code
     */
    districtCode: string = '';

    // 体温是否大于37.3
    isExceedTemp: string = '';

    // 是否有接触史
    isContact: boolean = false;

    // 其它症状
    otherSymptoms: string = '';

    // 医疗意见
    medicalOpinion: string = '';

    // 备注
    note: string = '';

    /**
     * 数据是否通过移动端
     */
    isByPhone: boolean = false;

    /**
     * 扩展属性
     */
    expendProperty: string = '';

    expendModel: RecordExpend = new RecordExpend();
}
