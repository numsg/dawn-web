// 疫情人员信息
export class EpidemicPerson {
     id!: string;
     name!: string;
     gender: string = '0';
     address!: string;
     district!: string;
     medicalCondition!: string;
     specialSituation!: string;
     submitTime!: Date | string;
     note!: string;
     diseaseTime!: Date| string;
     multiTenancy!: string;
     expendProperty: string = '213';
}
export default EpidemicPerson;
