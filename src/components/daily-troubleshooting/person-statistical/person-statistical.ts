import { getUuid32 } from '@gsafety/cad-gutil/dist/utilhelper';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from './person-statistical.html';
import styles from './person-statistical.module.scss';
import * as echarts from 'echarts';
import { ECharts, EChartOption } from 'echarts';
import moment from 'moment';
import { Getter } from 'vuex-class';
import { generateUUID } from '@gsafety/whatever/dist/util';
import EpidemicDiagram from '../person-diagram/person-diagram';
import transformToColor from '@/common/filters/colorformat';

@Component({
  name: 'epidemic-statistics',
  template: Html,
  style: styles,
  themes: [
    { name: 'white', style: styles },
  ],
  components: {
    'epidemic-diagram': EpidemicDiagram
  }
})
export class PersonStatistical extends Vue {
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
  allPersonData = {
    id: getUuid32(),
    selected: false,
    name: '幸福里社区',
    count: 300,
    strokeStyle: '#990000'
  };

  epidemicData = [
    {
      id: getUuid32(),
      selected: false,
      name: '春桥小区',
      count: 20,
      strokeStyle: '#990000'
    },
    {
      id: getUuid32(),
      selected: false,
      name: '夏桥小区',
      count: 15,
      strokeStyle: '#CC9934'
    },
    {
      id: getUuid32(),
      selected: false,
      name: '冬桥小区',
      count: 1,
      strokeStyle: '#9494A6'
    },
    {
      id: getUuid32(),
      selected: false,
      name: '秋桥小区',
      count: 1,
      strokeStyle: '#00CC34'
    },
    {
      id: getUuid32(),
      selected: false,
      name: '夏里小区',
      count: 50,
      strokeStyle: '#990000'
    },
  ];
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
        data: ['春桥小区', '夏桥小区', '冬桥小区', '秋桥小区', '夏里小区']
      },
      series: [
        {
          name: '社区填报记录',
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
            { value: 20, name: '春桥小区' },
            { value: 15, name: '夏桥小区' },
            { value: 1, name: '冬桥小区' },
            { value: 1, name: '秋桥小区' },
            { value: 50, name: '夏里小区' }
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
