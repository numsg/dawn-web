import { EpidemicPerson } from '@/models/home/epidemic-persion';
import { Vue, Component, Prop } from 'vue-property-decorator';
import template from './epidemic-info-detail.html';
import styles from './epidemic-info-detail.module.scss';
import moment from 'moment';
import { Getter } from 'vuex-class';

@Component({
  name: 'epidemic-info-detail',
  template: template,
  style: styles,
  components: {}
})
export class EpidemicInfoDetail extends Vue {
  @Prop()
  currentPerson!: EpidemicPerson;

  // 本社区小区
  @Getter('baseData_communities')
  communities!: any[];
  // 诊疗情况
  @Getter('baseData_medicalOpinions')
  diagnosisSituations!: any[];
  // 就医情况
  @Getter('baseData_medicalSituations')
  medicalSituations!: any[];
  // 特殊情况
  @Getter('baseData_specialSituations')
  specialSituations!: any[];
  // 性别
  @Getter('baseData_genderClassification')
  genderClassification!: any[];

  get CanShowSpecialFlag() {
    return (
      this.currentPerson.specialSituation !== '20b8e1da-284c-4d90-9a97-898b1e5b4c66' &&
      this.specialSituations.filter((d: any) => {
        return d.id === this.currentPerson.specialSituation;
      }).length > 0
    );
  }

  returnDicDataName(id: string, dicDataName: string) {
    let component: any = this;
    const dicDatas = component[dicDataName];
    let result: any = [];
    if (Array.isArray(dicDatas) && dicDatas.length > 0) {
      result = dicDatas.filter((d: any) => {
        return d.id === id;
      });
    }
    const name = result.length > 0 ? result[0].name : '未知';
    component = null;
    result = null;
    return name;
  }

  replaceTime(time: string) {
    if (time) {
      // return format.default(time, 'yyyy-mm-dd HH:mm:ss');
      return moment(time).format('YYYY-MM-DD HH:mm:ss');
    }
    return '';
  }
}
