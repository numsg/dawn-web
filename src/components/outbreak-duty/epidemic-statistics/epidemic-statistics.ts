import { getUuid32 } from '@gsafety/cad-gutil/dist/utilhelper';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from './epidemic-statistics.html';
import styles from './epidemic-statistics.module.scss';
import * as echarts from 'echarts';
import { ECharts, EChartOption } from 'echarts';
import moment from 'moment';
import { Getter } from 'vuex-class';
import EpidemicDiagram from '../epidemic-diagram/epidemic-diagram';
import statisticsStyleBlackStyle from './epidemic-statistics.black.module.scss';
import transformToColor from '@/common/filters/colorformat';
import eventNames from '@/common/events/store-events';

@Component({
  name: 'epidemic-statistics',
  template: Html,
  style: styles,
  themes: [
    { name: 'white', style: styles },
    { name: 'black', style: statisticsStyleBlackStyle }
  ],
  components: {
    'epidemic-diagram': EpidemicDiagram
  }
})
export class EpidemicStatisticsComponent extends Vue {
  pickerOptions: any = {};
  defaultDate: any[] = [];

  @Prop()
  showStatistics!: boolean;
  @Prop({
    default: '1'
  })
  dimension!: string;

  clearable: boolean = false;

  currentDateZone: string[] = [];
  startTime: string = '';
  endTime: string = '';

  legendData: string[] = [];

  seriesName: string[] = [];
  seriesIndex: number[] = [];

  selectedEventTypeIds: string[] = [];

  selectedCount: number = 0;

  chart!: ECharts;
  option!: any;

  epidemicData = [
    {
      id: getUuid32(),
      selected: false,
      name: '确诊病例',
      count: 20,
      strokeStyle: '#990000'
    },
    {
      id: getUuid32(),
      selected: false,
      name: '疑似病例',
      count: 15,
      strokeStyle: '#CC9934'
    },
    {
      id: getUuid32(),
      selected: false,
      name: '死亡病例',
      count: 1,
      strokeStyle: '#9494A6'
    },
    {
      id: getUuid32(),
      selected: false,
      name: '治愈病例',
      count: 1,
      strokeStyle: '#00CC34'
    },
    {
      id: getUuid32(),
      selected: false,
      name: '发热人员',
      count: 50,
      strokeStyle: '#990000'
    }
  ];

  @Getter('outbreakDuty_epidemicStaticalData')
  epidemicStaticalData!: any[];
  totalCount: number = 0;
  constructor() {
    super();
    // const startDate = moment()
    //   .startOf('day')
    //   .subtract(3, 'month');
    // const endDate = moment().endOf('day');
    // this.dateRange = [startDate.format(DATE_PICKER_FORMAT), endDate.format(DATE_PICKER_FORMAT)];
  }

  async mounted() {
    const doughnut: HTMLDivElement = document.querySelector('#doughnut') || document.createElement('div');
    this.chart = echarts.init(doughnut);
    this.addEventListener();
    // await this.$store.dispatch(eventNames.OutbreakDuty.SetEpidemicStaticalData, { dimension: this.dimension });
  }

  @Watch('epidemicStaticalData')
  onStaticalDataLoad(val: any) {
    // this.totalCount = val.reduce((prev: any, cur: any) => {
    //   return Number(cur.value) + Number(prev);
    // }, 0);
    this.totalCount = this.$store.state.outbreakDuty.medicalConditionStatisticTotal;
    this.setOption();
  }

  @Watch('dimension')
  async handleDimensionOfStatisticsChange() {
    await this.$store.dispatch(eventNames.OutbreakDuty.SetEpidemicStaticalData, { dimension: this.dimension });
  }

  setOption() {
    this.option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        // data: ['确诊病例', '疑似病例', '死亡病例', '治愈病例', '发热人员']
        data: this.epidemicStaticalData.map((e: any) => e.name)
      },
      series: [
        {
          name: '确诊数量',
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
              show: true,
              fontWeight: 'bold',
              // formatter: '{b}: {d}%'
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
            show: false,
            // formatter: '{b}: {d}%'
            formatter: (val: any) => {
              let name = val.name;
              if (name.length > 8) {
                name = name.slice(0, 8) + '...';
              }
              return name + ': ' + val.value + '(' + val.percent + '%)';
            }
          },
          // radius: '60%',
          radius: ['40%', '60%'],
          center: ['50%', '40%'],
          data: this.epidemicStaticalData,
          selectedMode: true,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: `rgba(0, 0, 0, 0.5)`
            },
            normal: {
              color: (params: any) => {
                const data = this.epidemicStaticalData[params.dataIndex];
                return data.strokeStyle;
              }
            }
          }
        }
      ]
    };
    this.chart.setOption(this.option);
  }
  /**
   * 处理下方 pie 图点击事件
   * @param id 事件类型id
   */
  handleStatisticsClick(id: string) {
    this.epidemicStaticalData.forEach((item, index) => {
      if (item.id === id) {
        if (item.count === 0) {
          return;
        }
        item.selected = !item.selected;
        this.filterEpidemicPersons();
        this.chart.dispatchAction({
          type: 'pieToggleSelect',
          seriesIndex: 0,
          dataIndex: index
        });
        this.chart.dispatchAction({
          type: item.selected ? 'highlight' : 'downplay',
          seriesIndex: 0,
          dataIndex: index
        });
      }
    });
  }

  /**
   * 监听事件
   */
  addEventListener() {
    this.chart.on('pieselectchanged', (evt: any) => {
      console.log('---pieselectchanged---');
      console.log(evt);
      this.epidemicStaticalData.forEach((item, index) => {
        if (item.name === evt.name) {
          item.selected = !item.selected;
          // this.filterEpidemicPersons();
        }
      });
    });
  }

  filterEpidemicPersons() {
    let diagnosisIds = this.epidemicStaticalData.map(e => {
      if (e.selected) {
        return e.id;
      }
    });
    diagnosisIds = diagnosisIds.filter(e => e !== undefined);
    this.$store.dispatch(eventNames.OutbreakDuty.SetEpidemicPersons, {
      page: 0,
      count: 10,
      diagnosisIds: diagnosisIds
    });
  }

  beforeDestroy() {
    if (this.chart) {
      this.chart.off('pieselectchanged');
      this.chart.clear();
      this.chart.dispose();
    }
  }

  /**
   * 转换事件类型背景色
   * @param {*} data
   * @returns
   * @memberof PlanStatisticsComponent
   */
  transformEventBgColor(data: any) {
    return data.item.imgColor ? data.item.imgColor : transformToColor(data.name);
  }
}
