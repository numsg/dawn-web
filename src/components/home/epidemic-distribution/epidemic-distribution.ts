import { Vue, Component, Watch } from 'vue-property-decorator';
import html from './epidemic-distribution.html';
import styles from './epidemic-distribution.module.scss';
import { ECharts } from 'echarts';
import * as echarts from 'echarts';
import { Getter } from 'vuex-class';
import { StatisticalDimension } from '@/models/common/statistical-dimension';
import moment from 'moment';
// import { DATE_PICKER_FORMAT } from '@/common/filters/dateformat';
import SessionStorage from '@/utils/session-storage';
import DailyTroubleshootingService from '@/api/daily-troubleshooting/daily-troubleshooting';

@Component({
  template: html,
  style: styles,
  components: {}
})
export class EpidemicDistribution extends Vue {
  chart!: ECharts;
  option!: any;

  // 就诊情况
  @Getter('baseData_medicalOpinions')
  diagnosisSituations!: any[];

  dimension = StatisticalDimension.plot;

  analysisDimensions = [
    {
      name: '小区',
      value: StatisticalDimension.plot
    },
    {
      name: '性别',
      value: StatisticalDimension.gender
    },
    {
      name: '年龄',
      value: StatisticalDimension.age
    }
  ];

  dateRange: string[] = [];

  pickerOptions: any = {};

  // 就医情况
  @Getter('baseData_medicalSituations')
  medicalSituations!: any[];

  analysisObject: any = '';

  // 本社区小区
  @Getter('baseData_communities')
  communities!: any[];

  // 性别
  @Getter('baseData_genderClassification')
  genderClassification!: any[];

  seriesData: {id: string, value: number, name: string}[] = [];

  colors = ['#bac888', '#5eb8c0', '#5179bc', '#b65b7d', '#e96873', '#fe912a', '#fdcd66'];

  created() {

    const startTime = moment()
      .startOf('day')
      .subtract(1, 'week');
    const endTime = moment().endOf('day');
    this.dateRange = [startTime.format('YYYY-MM-DD HH:mm:ss'), endTime.format('YYYY-MM-DD HH:mm:ss')];
    if (Array.isArray(this.medicalSituations) && this.medicalSituations.length > 0) {
      this.analysisObject = this.medicalSituations[0].id;
      this.queryData();
    }

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
          const startTime = moment(zone.minDate).format('YYYY-MM-DD HH:mm:ss');
          const endTime = moment(zone.maxDate)
            .add(1, 'day')
            .format('YYYY-MM-DD HH:mm:ss');
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

  @Watch('medicalSituations')
  onMedicalSituationsLoad(val: any) {
    if (Array.isArray(val) && val.length > 0) {
      this.analysisObject = val[0].id;
      this.queryData();
    }
  }

  async mounted() {
    const doughnut = document.querySelector('#doughnut') as HTMLDivElement;
    this.chart = echarts.init(doughnut);
    // this.queryData();
    // this.setOption();
  }

  setOption() {
    this.option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        bottom: 10,
        data: this.seriesData.map(e => e.name),
        tooltip: {
          show: true
        },
        formatter: (value: string) => {
          if (value.length > 8) {
            return value.slice(0, 8) + '...';
          }
          return value;
        }
      },
      series: [
        {
          name: '社区疫情分布统计',
          type: 'pie',
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              textStyle: {
                fontSize: '16',
                fontWeight: 'bold'
              }
            },
            label: {
              fontSize: '16',
              fontWeight: 'bold',
              show: true,
              // formatter: '{b}: {d}'
              formatter: (val: any) => {
                let name = val.name;
                if (name.length > 8) {
                  name = name.slice(0, 8) + '...';
                }
                return name + ': ' + val.value + '(' + val.percent + '%)';
              }
            }
          },
          label: {
            fontSize: '14',
            show: true,
            formatter: (val: any) => {
              let name = val.name;
              if (name.length > 8) {
                name = name.slice(0, 8) + '...';
              }
              return name + ': ' + val.value + '(' + val.percent + '%)';
            }
          },
          radius: ['40%', '60%'],
          center: ['50%', '50%'],
          selectedMode: true,
          data: this.seriesData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: `rgba(0, 0, 0, 0.5)`
            },
            normal: {
              color: (params: any) => {
                return this.colors[params.dataIndex];
              }
            }
          }
        }
      ]
    };
    this.chart.setOption(this.option);
  }

  datePickerClick(picker: any, subtract: any) {
    const startTime = moment()
      .startOf('day')
      .subtract(subtract, 'week');
    const endTime = moment().endOf('day');
    picker.$emit('pick', [startTime.toDate(), endTime.toDate()]);
    this.dateRange = [startTime.format('YYYY-MM-DD HH:mm:ss'), endTime.format('YYYY-MM-DD HH:mm:ss')];
  }

  /**
   * 清楚时间时
   * @param timeZone
   */
  onTimeZoneChange(timeZone: any) {
    this.queryData();
  }

  /**
   * 分析对象改变
   */
  analysisObjectChange() {
    this.queryData();
  }

  /**
   * 分析维度改变
   */
  dimensionChange() {
    this.queryData();
  }

  queryData() {
    const multiTenancy = SessionStorage.get('district');
    DailyTroubleshootingService.getDistributionStatistics({
      medicalConditionId: this.analysisObject,
      startTime: this.dateRange[0],
      endTime: this.dateRange[1],
      multiTenancy: multiTenancy.toString(),
      type: this.dimension
    }).then(res => {
      this.buildData(res);
      console.log('---queryData---');
      console.log(res);
    });
  }

  buildData(result: { id: string; value: number }[]) {
    this.seriesData = [];
    result.forEach(item => {
      const data = {} as { id: string; value: number; name: string };
      switch (this.dimension) {
        case StatisticalDimension.plot:
          data.id = item.id;
          const community = this.communities.find(e => e.id === item.id);
          data.name = community.name;
          data.value = item.value;
          break;
        case StatisticalDimension.gender:
          data.id = item.id;
          const gender = this.genderClassification.find(e => e.id === item.id);
          data.name = gender.name;
          data.value = item.value;
          break;
        case StatisticalDimension.age:
          data.id = item.id;
          data.name = item.id + '岁';
          data.value = item.value;
          break;
      }
      this.seriesData.push(data);
    });
    this.setOption();
  }
}
