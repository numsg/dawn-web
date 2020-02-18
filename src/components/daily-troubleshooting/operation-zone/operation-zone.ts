import { DailyQueryConditions } from '@/models/common/daily-query-conditions';
import { Vue, Component, Watch } from 'vue-property-decorator';
import Html from './operation-zone.html';
import Style from './operation-zone.module.scss';
import notifyUtil from '@/common/utils/notifyUtil';

import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
import { TroubleshootingInfoForm } from '@/components/daily-troubleshooting/troubleshooting-info-form/troubleshooting-info-form';

import { ModelType } from '@/models/daily-troubleshooting/model-type';

import DailyTroubleshootingService from '@/api/daily-troubleshooting/daily-troubleshooting';
import { Getter, Mutation } from 'vuex-class';
import eventNames from '@/common/events/store-events';
import { debounce } from 'lodash';
import moment from 'moment';
import { DATE_PICKER_FORMAT } from '@/common/filters/dateformat';

@Component({
  template: Html,
  style: Style,
  components: {
    'side-frame': SideFrameComponent,
    TroubleshootingInfoForm,
  }
})
export class OperationZone extends Vue {
    fileList: any = [];
    keyWords = '';
    modelType = ModelType;
    // 选择模式
    currentModelType = ModelType.checked;

    // isShowgGroup = true;

  feverOptions = [
    {
      label: '是',
      value: true
    },
    {
      label: '否',
      value: false
    }
  ];

  get isShowgGroup() {
    return this.$store.state.dailyTroubleshooting.isShowgGroup;
  }

  // set isShowgGroup(value: string) {
  //   this.$store.dispatch(eventNames.DailyTroubleshooting.SetIsShowGroup, value);
  //   this.keyWords = '';
  // }
  // set isShowgGroup(value: string) {
  //   this.$store.dispatch(eventNames.DailyTroubleshooting.SetIsShowGroup, value);
  // }

  get isFaver() {
    return this.$store.state.dailyTroubleshooting.conditions.isFaver;
  }

  set isFaver(val: any) {
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetConditions, {
      isFaver: val,
      page: 0
    });
  }

  // 医疗意见
  @Getter('baseData_medicalOpinions')
  medicalOpinions!: any[];

  @Getter('dailyTroubleshooting_checkedTotalCount')
  checkedTotalCount!: number;

  @Getter('dailyTroubleshooting_unCheckedTotalCount')
  unCheckedTotalCount!: number;
  @Getter('dailyTroubleshooting_totalCount')
  totalCount!: number;

  @Mutation('SET_CONDITIONS_IS_CHECKED')
  setConditionsIsChecked!: (status: boolean) => void;

  @Mutation('SET_DAILY_TROUBLE_SHOOTING_FORM_STATUS')
  setFormStatus!: (status: boolean) => void;

  @Getter('dailyTroubleshooting_modelType')
  checkType: any;

  get medicalOpinionIds() {
    return this.$store.state.dailyTroubleshooting.conditions.medicalOpinion;
    }

  set medicalOpinionIds(val: any) {
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetConditions, {
      medicalOpinion: val,
      page: 0
    });
  }

    // 本社区小区
  @Getter('baseData_communities')
  communities!: any[];
  get plots() {
    return this.$store.state.dailyTroubleshooting.conditions.plots;
  }

  set plots(val: any) {
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetConditions, {
      plots: val,
      page: 0
    });
  }

  dateRange: string[] = [];

  pickerOptions: any;

  debounceSearch = debounce(this.handleSearch, 500);

  handleSearch() {
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetConditions, {
      keyWord: this.keyWords,
      page: 0
    });
  }

  created() {
    const self = this;
    this.pickerOptions = {
      shortcuts: [
        {
          text: '过去一周',
          onClick(picker: any) {
            self.datePickerClick(picker, 1);
          }
        },
        {
          text: '过去二周',
          onClick(picker: any) {
            self.datePickerClick(picker, 2);
          }
        }
      ],
      onPick: (zone: any) => {
        if (zone.maxDate && zone.minDate) {
          const startTime = moment(zone.minDate).format(DATE_PICKER_FORMAT);
          const endTime = moment(zone.maxDate)
            .add(1, 'day')
            .format(DATE_PICKER_FORMAT);
          self.dateRange = [startTime, endTime];
          console.log(self.dateRange);
        }
      },
      disabledDate: (date: Date) => {
        return (
          date >
          moment()
            .endOf('day')
            // .subtract(1, 'day')
            .toDate()
        );
      }
    };
  }

  /**
   * @param timeZone
   */
  onTimeZoneChange(timeZone: any) {
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetConditions, {
      dateRange: this.dateRange
    });
  }

  datePickerClick(picker: any, subtract: any) {
    const startTime = moment()
      .startOf('day')
      .subtract(subtract, 'week');
    const endTime = moment().endOf('day');
    picker.$emit('pick', [startTime.toDate(), endTime.toDate()]);
    this.dateRange = [startTime.format(DATE_PICKER_FORMAT), endTime.format(DATE_PICKER_FORMAT)];
  }

  modelTypeClick(type: ModelType) {
    console.log(type);
    this.currentModelType = type;
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetModelType, type);
    this.setConditionsIsChecked( type === ModelType.checked );
  }
    @Watch('currentModelType')
    watchCurrentModelType(value: any) {
      this.$emit('modelTypeChange');
    }

    handleSort() {

    }

    resetPlans() {

    }

    searchByKeyWords() {

    }

    reset() {
      this.keyWords = '';
      // this.$emit('reset');
      this.$store.dispatch(eventNames.DailyTroubleshooting.SetConditions, new DailyQueryConditions);
      this.$store.dispatch(eventNames.DailyTroubleshooting.SetStatisticsData);
    }

    exportExcel() {
      this.$emit('exportExcel');
    }

    success() {
      this.$emit('success');
    }
    async onUploadChange(file: any) {
      const formData: any = new FormData();
      formData.append('file', file.raw);
      const result = await DailyTroubleshootingService.addDailyTroubleshootingByxlsx(formData);
      console.log(result);
      if (result) {
        if (Array.isArray(result) && result.length > 0) {
          notifyUtil.success('成功导入' + result.length + '条数据');
        } else {
          notifyUtil.warning('数据导入为空');
        }
        this.$emit('uploadSuccess');
        this.$emit('colse');
      } else {
        notifyUtil.error('导入失败');
      }
    }

    addTroubleShoot() {
      const sideFrame: any = this.$refs['sideFrame'];
      sideFrame.open();
      this.setFormStatus(true);
    }
    colse() {
      const sideFrame: any = this.$refs['sideFrame'];
      sideFrame.close();
    }
    formClose() {
      this.setFormStatus(false);
    }

    groupTypeClick(isGroup: boolean) {
      this.$store.dispatch(eventNames.DailyTroubleshooting.SetIsShowGroup, isGroup);
    }

    /**
     * 拉去最新数据
     */
    pullNewData() {
      DailyTroubleshootingService.pullNewData().then(res => {
        if (res) {
          this.$store.dispatch(eventNames.DailyTroubleshooting.ResetData);
          this.$emit('pull-data');
        }
      });
    }
}
