import { getUuid32 } from '@gsafety/cad-gutil/dist/utilhelper';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from './epidemic-statistics.html';
import styles from './epidemic-statistics.module.scss';
import * as echarts from 'echarts';
import { ECharts, EChartOption } from 'echarts';
import moment from 'moment';
import { Getter } from 'vuex-class';
import { generateUUID } from '@gsafety/whatever/dist/util';
import EpidemicDiagram from '../epidemic-diagram/epidemic-diagram';
import statisticsStyleBlackStyle from './epidemic-statistics.black.module.scss';
import transformToColor from '@/common/filters/colorformat';

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

  clearable: boolean = false;

  @Getter('planManager_conditions_dateRange')
  dateRange!: string[];

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
    },
  ];
  currentTotalCount = 87;
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
        left: 10,
        data: ['确诊病例', '疑似病例', '死亡病例', '治愈病例', '发热人员']
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
              fontWeight: 'bold'
            }
          },
          radius: '50%',
          center: ['50%', '50%'],
          data: [
            { value: 20, name: '确诊病例' },
            { value: 15, name: '疑似病例' },
            { value: 1, name: '死亡病例' },
            { value: 1, name: '治愈病例' },
            { value: 50, name: '发热人员' }
          ]
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

  }

  /**
   * 监听事件
   */
  addEventListener() {
    this.chart.on('pieselectchanged', (evt: any) => {

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
