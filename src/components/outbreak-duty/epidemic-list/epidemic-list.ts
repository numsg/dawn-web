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
import XLSXUtils from '@/common/utils/XLSXUtils';
import DailyTroubleshootingService from '@/api/daily-troubleshooting/daily-troubleshooting';

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
  // 诊疗情况
  @Getter('baseData_medicalOpinions')
  diagnosisSituations!: any[];
  // 当前诊疗情况
  selectionDiagnosisSituation = [];
  // 就医情况
  @Getter('baseData_medicalSituations')
  medicalSituations!: any[];
  selectionMedicalSituations = [];
  // 特殊情况
  @Getter('baseData_specialSituations')
  specialSituations!: any[];
  currentPage: number = 1;
  pageSize: number = 10;
  keyWords: string = '';

  // 当前省疫情数据
  curProEpidemicData: any = {};
  citiesEpidemicData: any[] = [];
  editEpidemicPerson: EpidemicPerson = new EpidemicPerson();
  currentMedicalSituation = '';
  showChangeModal = false;
  startResetData = false;
  /**
   * 搜索防抖
   */
  debounceSearch = debounce(this.handleSearch, 500);

  sort: any = { type: 'submitTime', flag: 'desc' };

  selectFeverState = '';
  feverStates = [
    // {
    //   value: '0',
    //   label: '所有发热情况'
    // },
    {
      value: '1',
      label: '发热'
    },
    {
      value: '2',
      label: '正常'
    }
  ];

  formTitle: string = '疫情人员信息登记';
  canClose: boolean = true;
  personDataTable: Element | any = {};
  @Prop({
    default: 'table'
  })
  displayMode!: string;

  async mounted() {
    this.queryEpidemicPersons();
    this.personDataTable = this.$refs['personDataTable'];
  }

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
        this.startResetData = false;
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
    this.currentMedicalSituation = '';
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
    if (!this.startResetData) {
      this.handleSearch();
    }
  }
  @Watch('selectionDiagnosisSituation')
  handleSelectionDiagnosisSituationChange(val: any) {
    if (!this.startResetData) {
      this.handleSearch();
    }
  }
  @Watch('selectionMedicalSituations')
  handleSelectionMedicalSituationsChange(val: any) {
    if (!this.startResetData) {
      this.handleSearch();
    }
  }
  @Watch('selectFeverState')
  handleSelectFeverStateChange(val: boolean) {
    if (!this.startResetData) {
      this.handleSearch();
    }
  }

  handleSearch() {
    this.$store.dispatch(eventNames.OutbreakDuty.SetEpidemicPersons, {
      page: 0,
      count: this.pageSize,
      keywords: this.keyWords,
      villageIds: this.selectionCommunities,
      confirmedDiagnosis: this.selectionDiagnosisSituation,
      medicalCondition: this.selectionMedicalSituations,
      feverState: this.selectFeverState,
      sort: this.sort
    });
  }

  addEpidemicPersion() {
    const sideFrame: any = this.$refs['sideFrame'];
    this.formTitle = '疫情人员信息登记';
    sideFrame.open();
    this.editEpidemicPerson = new EpidemicPerson();
    const confirmedDiagnosis = this.diagnosisSituations.filter((d: any) => {
      return d.name === '无';
    });
    this.editEpidemicPerson.confirmedDiagnosis = confirmedDiagnosis.length > 0 ? confirmedDiagnosis[0].id : '';
    const medicalCondition = this.medicalSituations.filter((d: any) => {
      return d.name === '暂无';
    });
    this.editEpidemicPerson.medicalCondition = medicalCondition.length > 0 ? medicalCondition[0].id : '';
    const specialSituation = this.specialSituations.filter((d: any) => {
      return d.name === '无';
    });
    this.editEpidemicPerson.specialSituation = specialSituation.length > 0 ? specialSituation[0].id : '';
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
    this.startResetData = true;
    this.keyWords = '';
    this.currentPage = 1;
    this.pageSize = 10;
    this.selectFeverState = '';
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

  async exportExcel() {
    const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const execlName = `重点关注人员数据${now}`;
    const result = await epidemicDynamicService.queryEpidemicPersons({
      page: 0,
      count: 1000,
      keywords: this.keyWords,
      villageIds: this.selectionCommunities,
      confirmedDiagnosis: this.selectionDiagnosisSituation,
      medicalCondition: this.selectionMedicalSituations,
      sort: this.sort
    });
    const res = await DailyTroubleshootingService.queryCommunity();
    let communityName = '';
    if (res && Array.isArray(res) && res.length > 0) {
      communityName = res[0].name;
    }
    // 构造表头数据
    const headerNames = this.getHeaderNames();
    // 构造表格数据
    const execlData = this.convertToExeclData(result.value);
    XLSXUtils.exportExcel({
      title: '社区重点人员情况信息表',
      communityName: communityName,
      sheetName: '重点关注人员记录表',
      execlName: execlName,
      headerNames: headerNames,
      data: execlData
    });
  }

  getHeaderNames() {
    return [
      '序号',
      '姓名',
      '年龄',
      '性别',
      '联系方式',
      '所在小区',
      '楼栋号',
      '发热(体温>37.3℃)',
      '是否有密切接触史',
      '特殊情况',
      '确认患者',
      '疑似患者',
      'CT诊断肺炎患者',
      '一般发热患者',
      '密切接触者',
      '备注'
    ];
  }

  convertToExeclData(result: EpidemicPerson[]) {
    const execlData = [] as any[];
    result.forEach((person, index) => {
      const data = {} as any;
      data.index = index + 1;
      data.name = person.name;
      data.age = person.age;
      data.sex = person.genderModel.name; // 替换 性别
      data.phone = person.mobileNumber;
      data.community = person.communityModel.name;
      data.building = person.building + '-' + person.unitNumber + '-' + person.roomNumber;
      data.isExceedTemp = person.temperature ? '是' : '';
      data.isContact = person.isContact ? '是' : '';
      data.specialSituation = person.specialSituationModel.name;
      data.isAdmit = this.replaceMedicalOpinion(person.confirmedDiagnosis) === '确诊患者' ? '是' : ''; // 替换 确认患者
      data.isSuspected = this.replaceMedicalOpinion(person.confirmedDiagnosis) === '疑似患者' ? '是' : ''; // 替换 疑似患者
      data.isCT = this.replaceMedicalOpinion(person.confirmedDiagnosis) === 'CT诊断肺炎患者' ? '是' : ''; // 替换 CT诊断肺炎患者
      data.isNormal = this.replaceMedicalOpinion(person.confirmedDiagnosis) === '一般发热患者' ? '是' : ''; // 替换 一般发热患者
      data.isClose = this.replaceMedicalOpinion(person.confirmedDiagnosis) === '密切接触者' ? '是' : ''; // 替换 密切接触者
      data.note = person.note ? person.note : '';
      execlData.push(data);
    });
    return execlData;
  }

  replaceMedicalOpinion(medicalOpinion: any) {
    const otherSymptomsItem = this.diagnosisSituations.find((item: any) => item.id === medicalOpinion);
    return otherSymptomsItem ? otherSymptomsItem.name : '';
  }
}
