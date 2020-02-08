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
  medicalConditionModel: any;
  specialSituation!: string;
  specialSituationModel: any;
}
export default EpidemicPerson;
