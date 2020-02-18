// 疫情人员信息
export class EpidemicPerson {
  id!: string;
  name!: string;
  // district!: string;
  submitTime!: Date | string;
  note!: string;
  diseaseTime!: Date | string;
  multiTenancy!: string;
  expendProperty!: string;
  age: number = 20;
  temperature!: string;
  updateTime!: Date | string;
  mobileNumber!: string;
  gender: string = '0';
  genderModel: any;
  villageId!: string;
  communityModel: any;
  diagnosisSituation!: string;
  diagnosisSituationModel: any;
  medicalCondition!: string;
  /**
   * 就医情况对象，包含ID及对应名称
   *
   * @type {*}
   * @memberof EpidemicPerson
   */
  medicalConditionModel: any;
  /**
   * 特殊情况ID
   *
   * @type {string}
   * @memberof EpidemicPerson
   */
  specialSituation!: string;
  /**
   * 特殊情况对象，包含ID及对应名称
   *
   * @type {*}
   * @memberof EpidemicPerson
   */
  specialSituationModel: any;
  /**
   * 分类诊疗意见 / 就诊情况ID
   *
   * @type {*}
   * @memberof EpidemicPerson
   */
  confirmedDiagnosis: any;
  /**
   * 分类诊疗意见 / 就诊情况 对象
   *
   * @type {*}
   * @memberof EpidemicPerson
   */
  medicalOpinionModel: any;
}
export default EpidemicPerson;
