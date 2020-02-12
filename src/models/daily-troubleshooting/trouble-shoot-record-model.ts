export class RecordModel {
    id!: string;
    name!: string;  //  姓名
    idNumber!: string; //  身份证号
     sex!: string; // 性别（0:男，1:女）
     age!: string; // 年龄
     residence!: string; // 家庭住址
     community!: string; // 小区（详细地址）
     building!: string; // 楼栋（详细地址）
     unit!: string; // 单元（详细地址）
     roomNumber!: string; // 房号（详细地址）
     phone!: string;  //  联系电话
     fever!: string; // 是否发热（体温大于37.3度）（0:否，1:是）
    /**
     * 其他症状（0:无，1:乏力，2:干咳，3:肌痛，4:寒战，
     * 5:呼吸困难，6:咽痛，7:头疼，8:眩晕，9:腹痛，
     * 10:腹泻，11:恶心，12:呕吐，13:鼻塞）
     */
     symptom!: string;
     travelLivingHubei!: string; // 是否有湖北旅居史（1是0否）
    /**
     * 行程 1. 【 点选 】武汉以外的湖北人入常德人员 2.【 点选 】武汉入常德
     * 3. 【 点选 】常德入武汉以外的湖北辖区后返回常德
     * 4. 【 点选 】常德入武汉后返回常德
     * 5. 【 点选 】既非常德人又非湖北人，途径湖北进入常德
     * 6. 【 点选 】既非常德人又非武汉人，途径武汉进入常德
     */
     trip!: string;
     touchPersonIsolation!: string; // 是否有新型肺炎接触史（0:否，1:是）
     touchHubei!: string; // 是否与湖北暴露史人员接触【 1是0否 】
     temperature!: string;  // 体温
     discomfort!: string; // 有无咳嗽、胸闷等不适症状（1是0否）
     wuhanAddress!: string; // 常德人入武汉后居住地
     leaveHubeiDate!: string; // 离开湖北日期(yyyymmdd)
     vehicle!: string; // 交通工具飞机、火车、大巴、自驾车
     vehicleNo!: string; // 车次/航班
     stayPlace!: string; // 沿途停留地点
     backDate!: string; // 返回常德日期
     fourteenDays!: string;  // 满14天日期(1是0否)
     otherToWuling!: string; // 是否外地返武陵区人员(1是0否)
     whereToWuling!: string; // 回程地点【填空】
     howToWuling!: string; // 火车/飞机/汽车/自驾
     vehicleNoWuling!: string; // 航班/车次
     togetherPersonWuling!: string; // 同程人员
     workUnitWuling!: string; // 工作单位
     permanentWuling!: string; // 是否本街道常驻人口【1是0否】
     proveWuling!: string;  // 是否有相关证明(1是0否)
     remark!: string; // 备注
     createTime!: string;
}
