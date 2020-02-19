import { Vue, Component, Watch } from 'vue-property-decorator';
import html from './epidemic-distribution.html';
import styles from './epidemic-distribution.module.scss';
import { ECharts } from 'echarts';
import * as echarts from 'echarts';
import { Getter } from 'vuex-class';
import { StatisticalDimension } from '@/models/common/statistical-dimension';
import moment from 'moment';
import { DATE_PICKER_FORMAT } from '@/common/filters/dateformat';

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

  pickerOptions: any;

  // 就医情况
  @Getter('baseData_medicalSituations')
  medicalSituations!: any[];

  analysisObject: any = '';

  created() {
      if (this.medicalSituations) {
        this.analysisObject = this.medicalSituations[0].id;
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

  @Watch('medicalSituations')
  onMedicalSituationsLoad(val: any) {
      if (Array.isArray(val) && val.length > 0) {
          this.analysisObject = val[0].id;
      }
  }

  async mounted() {
    const doughnut = document.querySelector('#doughnut') as HTMLDivElement;
    this.chart = echarts.init(doughnut);
    this.setOption();
    this.addEventListener();
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
        data: ['武昌大道', '环卫所', '西郊路', '西市街'],
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
          data: [
            { name: '武昌大道', value: 2 },
            { name: '环卫所', value: 3 },
            { name: '西郊路', value: 2 },
            { name: '西市街', value: 3 }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: `rgba(0, 0, 0, 0.5)`
            }
            // normal: {
            //   color: (params: any) => {
            //     const data = this.statisticsData[params.dataIndex];
            //     return data.strokeStyle;
            //   }
            // }
          }
        }
      ]
    };
    this.chart.setOption(this.option);
  }

  /**
   * 监听事件
   */
  addEventListener() {
    this.chart.on('pieselectchanged', (evt: any) => {});
  }

  datePickerClick(picker: any, subtract: any) {
    const startTime = moment()
      .startOf('day')
      .subtract(subtract, 'week');
    const endTime = moment().endOf('day');
    picker.$emit('pick', [startTime.toDate(), endTime.toDate()]);
    this.dateRange = [startTime.format(DATE_PICKER_FORMAT), endTime.format(DATE_PICKER_FORMAT)];
  }

    /**
   * 清楚时间时
   * @param timeZone
   */
  onTimeZoneChange(timeZone: any) {

  }

  /**
   * 分析对象改变
   */
  analysisObjectChange() {

  }

  /**
   * 分析维度改变
   */
  dimensionChange() {

  }
}
