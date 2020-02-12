import TroubleshootRecord from './trouble-shoot-record';

export default class PersonBase {

    id: string = '';

    code: string = '';

    // name
    name: string = '';

    // 电话
    phone: string = '';

    // 性别
    sex: string = '';

    // 住址
    address: string = '';

    // 身份证号码
    identificationNumber: string = '';

    // other
    other: string = '';

    multiTenancy: string = '';

    /**
     * 最新的排查记录id
     */
    troubleshootRecordId: string = '';

    /**
     * 最新的排查记录
     */
    // troubleshootRecord: TroubleshootRecord = new TroubleshootRecord;

    /**
     * 数据是否通过移动端
     */
    isByPhone: boolean = false;

    /**
     * 行政区划code
     */
    districtCode: string = '';
}

