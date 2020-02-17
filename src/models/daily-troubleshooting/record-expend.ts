
/**
 * 扩展属性model
 * @export
 * @class RecordExpend
 */
export class RecordExpend {
    // 如何去武汉( 火车/飞机/汽车/自驾)
    howToWuling: string = '';
    currentCounty: string = '';
    // 是否有湖北旅居史（1是0否）
    travelLivingHubei: number = 0;
    // 工作单位
    workUnitWuling: string = '';
    currentCity: string = '';
    currentCountry: string = '';
     // 交通工具飞机、火车、大巴、自驾车
    vehicle: string = '';
     // 是否与湖北暴露史人员接触【 1是0否 】
    touchHubei: number = 0;
    /**
   * 行程
   * 1. 【 点选 】武汉以外的湖北人入常德人员
   * 2.【 点选 】武汉入常德
   * 3. 【 点选 】常德入武汉以外的湖北辖区后返回常德
   * 4. 【 点选 】常德入武汉后返回常德
   * 5. 【 点选 】既非常德人又非湖北人，途径湖北进入常德
   * 6. 【 点选 】既非常德人又非武汉人，途径武汉进入常德
   */
    trip: number = 0;
    // 返回常德日期
    backDate: string = '';
    // 满14天日期(1是0否)
    fourteenDays: string = '';
    // 体温
    temperature: string = '';
    // 家庭住址
    residence: string = '';
    // 是否外地返武陵区人员(1是0否)
    otherToWuling: number = 0;
    // 回程地点【填空】
    whereToWuling: string = '';
    // 小区（详细地址）
    community: string = '';
    // 车次/航班
    vehicleNo: string = '';
    // 航班/车次
    vehicleNoWuling: string = '';
    // 离开湖北日期(yyyymmdd)
    leaveHubeiDate: string = '';
    // 有无咳嗽、胸闷等不适症状（1是0否）
    discomfort: number = 0;
    // 是否有相关证明(1是0否)
    proveWuling: number = 0;
    // 沿途停留地点
    stayPlace: string = '';
    // 同程人员
    togetherPersonWuling: string = '';
    // 是否本街道常驻人口【1是0否】
    permanentWuling: string = '';
    currentProvince: string = '';
    // 是行政区划code
    currentVillage: string = '';
    // 常德人入武汉后居住地
    // wuhanAddress: string = '';
    // 报告人
    reporterName: string = '';
    // 报告人电话
    reporterPhone: string = '';
}
export default RecordExpend;
