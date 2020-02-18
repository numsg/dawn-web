import eventNames from '@/common/events/store-events';
import { getGuid32 } from '@gsafety/cad-gutil/dist/utilhelper';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import epidemicListStyle from './epidemic-list.module.scss';
import epidemicListHtml from './epidemic-list.html';
import { ECharts, EChartOption } from 'echarts';
import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
import EpidemicPerson from '@/models/home/epidemic-persion';
import epidemicDynamicService from '@/api/epidemic-dynamic/epidemic-dynamic.service';
import moment from 'moment';
import { debounce } from 'lodash';
import { EpidemicInfoFormComponent } from '../epidemic-info-form/epidemic-info-form';
import { Getter } from 'vuex-class';

@Component({
  template: epidemicListHtml,
  style: epidemicListStyle,
  themes: [{ name: 'white', style: epidemicListStyle }],
  components: {
    'side-frame': SideFrameComponent,
    'epidemic-info-form': EpidemicInfoFormComponent
  }
})
export class EpidemicListComponent extends Vue {
  isShowTabs: boolean = false;

  @Getter('outbreakDuty_epidemicPersonList')
  epidemicPersonList!: EpidemicPerson[];
  @Getter('outbreakDuty_totalCount')
  totalCount!: number;
  // 本社区小区
  @Getter('baseData_communities')
  communities!: any[];
  // 当前小区
  selectionCommunities = [];
  // 就诊情况
  @Getter('baseData_medicalOpinions')
  diagnosisSituations!: any[];
  // 当前就诊情况
  selectionDiagnosisSituation = [];
  // 医疗情况
  @Getter('baseData_medicalSituations')
  medicalSituations!: any[];
  // 特殊情况
  @Getter('baseData_specialSituations')
  specialSituations!: any[];
  selectionMedicalSituations = [];
  currentPage: number = 1;
  pageSize: number = 10;
  keyWords: string = '';

  // 当前省疫情数据
  curProEpidemicData: any = {};
  citiesEpidemicData: any[] = [];
  editEpidemicPerson: EpidemicPerson = new EpidemicPerson();
  currentMedicalSituation = '';
  showChangeModal = false;
  /**
   * 搜索防抖
   */
  debounceSearch = debounce(this.handleSearch, 500);

  sort: any = { type: 'submitTime', flag: 'desc' };

  formTitle: string = '疫情人员信息登记';
  canClose: boolean = true;
  personDataTable: Element | any = {};
  @Prop({
    default: 'table'
  })
  displayMode!: string;

  @Watch('epidemicPersonList', { deep: true })
  handlePersonListChange(val: any) {
    if (Array.isArray(val) && val.length > 0) {
      setTimeout(() => {
        let focusData = null;
        if (this.editEpidemicPerson && this.editEpidemicPerson.id) {
          const result = val.filter((d: any) => {
            return d.id && d.id !== '' && d.id === this.editEpidemicPerson.id;
          });
          if (result.length > 0) {
            focusData = result[0];
          }
        } else {
          focusData = val[0];
        }
        if (focusData && focusData['id'] && focusData.id !== '') {
          this.handleClickRow(focusData);
        }
      }, 500);
    }
  }

  canShowSpecialFlag(person: EpidemicPerson) {
    return (
      person.specialSituation !== '20b8e1da-284c-4d90-9a97-898b1e5b4c66' &&
      this.specialSituations.filter((d: any) => {
        return d.id === person.specialSituation;
      }).length > 0
    );
  }

  async mounted() {
    this.queryEpidemicPersons();
    this.personDataTable = this.$refs['personDataTable'];
  }

  handleCreate(val: boolean) {
    this.canClose = !val;
  }

  async handleSubmitMedicalSituationChange() {
    await this.$store.dispatch(eventNames.OutbreakDuty.UpdatePersonMedicalSituation, {
      person: this.editEpidemicPerson,
      newSituation: this.currentMedicalSituation
    });
    setTimeout(() => {
      this.queryEpidemicPersons();
      this.showChangeModal = false;
    }, 500);
  }

  handleShowChangeMedical(data: EpidemicPerson) {
    this.showChangeModal = true;
    this.$nextTick(() => {
      this.editEpidemicPerson = data;
    });
  }

  async queryEpidemicPersons() {
    this.$store.dispatch(eventNames.OutbreakDuty.SetEpidemicPersons, {
      page: this.currentPage - 1,
      count: this.pageSize,
      keywords: this.keyWords,
      sort: this.sort
    });
  }

  @Watch('selectionCommunities')
  handleSelectionCommunitiesChange(val: any) {
    this.handleSearch();
  }
  @Watch('selectionDiagnosisSituation')
  handleSelectionDiagnosisSituationChange(val: any) {
    this.handleSearch();
  }
  @Watch('selectionMedicalSituations')
  handleselectionMedicalSituationsChange(val: any) {
    this.handleSearch();
  }

  handleSearch() {
    this.$store.dispatch(eventNames.OutbreakDuty.SetEpidemicPersons, {
      page: 0,
      count: this.pageSize,
      keywords: this.keyWords,
      villageIds: this.selectionCommunities,
      confirmedDiagnosis: this.selectionDiagnosisSituation,
      medicalCondition: this.selectionMedicalSituations,
      sort: this.sort
    });
  }

  addEpidemicPersion() {
    const sideFrame: any = this.$refs['sideFrame'];
    this.formTitle = '疫情人员信息登记';
    sideFrame.open();
    this.editEpidemicPerson = new EpidemicPerson();
  }

  async savePersonSuccess(personData: EpidemicPerson) {
    const sideFrame: any = this.$refs['sideFrame'];
    sideFrame.close();
    this.editEpidemicPerson = personData;
    this.queryEpidemicPersons();
    await this.$store.dispatch(eventNames.OutbreakDuty.SetEpidemicStaticalData);
    this.$emit('on-person-data-change', this.editEpidemicPerson);
    this.handleClickRow(this.editEpidemicPerson);
  }

  handleSizeChange(val: any) {
    this.pageSize = val;
    this.queryEpidemicPersons();
    console.log(`每页 ${val} 条`);
  }
  handleCurrentChange(val: any) {
    this.currentPage = val;
    this.queryEpidemicPersons();
    console.log(`当前页: ${val}`);
  }

  replaceTime(time: string) {
    if (time) {
      // return format.default(time, 'yyyy-mm-dd HH:mm:ss');
      return moment(time).format('YYYY-MM-DD HH:mm:ss');
    }
    return '';
  }

  /**
   * 编辑
   */
  handleEdit(data: EpidemicPerson) {
    this.editEpidemicPerson = data;
    const sideFrame: any = this.$refs['sideFrame'];
    this.formTitle = '修改疫情人员信息';
    sideFrame.open();
    this.$emit('on-edit-person', data);
  }

  handleDelete(data: EpidemicPerson) {
    this.$confirm(this.$tc('notice.confirm_delete'), {
      confirmButtonText: this.$tc('common.determine'),
      cancelButtonText: this.$tc('common.cancel'),
      type: 'warning',
      title: this.$tc('common.prompt'),
      showClose: false
    }).then(() => {
      epidemicDynamicService.editEpidemicPerson(data);
    });
  }

  resetData() {
    this.keyWords = '';
    this.currentPage = 1;
    this.pageSize = 10;
    this.selectionCommunities = [];
    this.selectionDiagnosisSituation = [];
    this.selectionMedicalSituations = [];
    this.queryEpidemicPersons();
    this.$store.dispatch(eventNames.OutbreakDuty.SetEpidemicStaticalData);
  }

  handleSort() {
    if (this.sort.flag === 'desc') {
      this.sort.flag = 'asc';
    } else {
      this.sort.flag = 'desc';
    }
    this.queryEpidemicPersons();
  }

  cancelEdit() {
    const sideFrame: any = this.$refs['sideFrame'];
    sideFrame.close();
  }

  handleClickRow(data: EpidemicPerson) {
    if (!this.personDataTable) {
      this.personDataTable = this.$refs['personDataTable'];
    }
    this.personDataTable.setCurrentRow(data);
    this.editEpidemicPerson = data;
    this.$emit('on-person-selection-change', data);
  }
}
