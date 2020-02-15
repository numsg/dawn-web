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
import dataFormat from '@/utils/data-format';

@Component({
  template: Html,
  style: Style,
  components: {
    'side-frame': SideFrameComponent,
    TroubleshootingInfoForm,
  }
})
export class OperationZone extends Vue {
    dialogVisible = false;
    startTime: any[] = [];
    startDate: any = '';
    endDate: any = '';


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

  debounceSearch = debounce(this.handleSearch, 500);

  pickerOptions = {
    onPick: (dateRange: any) => {
      this.startDate = dateRange.minDate;
      this.endDate = dateRange.maxDate;
    },
    disabledDate: (time: any) => {
      if (this.startDate) {
        return time.getTime() < this.startDate.getTime() || time.getTime() >= this.startDate.getTime() + 7 * 8.64e7;
    }
      return false;
    },
  };

  created() {
    this.startTime = [
      new Date(new Date().setHours(0, 0, 0, 0)),
      new Date(new Date().setHours(23, 59, 59, 59))
    ];
  }

  handleSearch() {
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetConditions, {
      keyWord: this.keyWords,
      page: 0
    });
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

    // exportExcel() {
    //   this.$emit('exportExcel');
    // }

    exportExcel() {
      this.dialogVisible = true;
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

    exportConfim() {
      console.log(this.startTime);
      if ( Array.isArray(this.startTime) && this.startTime.length === 2 ) {
        const startTime = this.replaceTime(this.startTime[0]);
        const endTime = this.replaceTime(this.startTime[1]);
        const param = {  startDate: startTime, endDate: endTime, currentVillageId: ''};
        this.$emit('exportExcel', param);
      } else {
        notifyUtil.warning('时间选取有问题');
      }
      this.dialogVisible = false;
    }

    handleClose() {

    }
    replaceTime(time: any) {
      if (time) {
        // return format.default(time, 'yyyy-mm-dd HH:mm:ss');
        return dataFormat.formatTime(time);
      }
      return '';
    }
}
