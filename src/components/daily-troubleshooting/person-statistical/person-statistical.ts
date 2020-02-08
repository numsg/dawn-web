import eventNames from '@/common/events/store-events';
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
    name: '杨桥湖社区',
    count: 300,
    strokeStyle: '#990000'
  };

  epidemicData = [
    {
      id: getUuid32(),
      selected: false,
      name: '卡梅尔小镇',
      count: 20,
      strokeStyle: '#990000'
    },
    {
      id: getUuid32(),
      selected: false,
      name: '水晶丽都',
      count: 15,
      strokeStyle: '#CC9934'
    },
    {
      id: getUuid32(),
      selected: false,
      name: '惠丰同庆-蜜糖镇',
      count: 1,
      strokeStyle: '#9494A6'
    },
    {
      id: getUuid32(),
      selected: false,
      name: '藏龙新城二期-梁山头商业门面房一栋',
      count: 1,
      strokeStyle: '#00CC34'
    },
    {
      id: getUuid32(),
      selected: false,
      name: '藏龙新城',
      count: 11,
      strokeStyle: '#990000'
    },
    {
      id: getUuid32(),
      selected: false,
      name: '中海',
      count: 22,
      strokeStyle: '#CC9934'
    },
    {
      id: getUuid32(),
      selected: false,
      name: '东城华府',
      count: 12,
      strokeStyle: '#CC9934'
    },
  ];

  totalCount: number = 1;

  @Getter('dailyTroubleshooting_statisticsData')
  statisticsData!: any[];

  constructor() {
    super();
  }

  async mounted() {
    const doughnut: HTMLDivElement = document.querySelector('#doughnut') || document.createElement('div');
    this.chart = echarts.init(doughnut);
    this.setOption();
    this.addEventListener();
    await this.$store.dispatch(eventNames.DailyTroubleshooting.SetStatisticsData);
  }

  @Watch('statisticsData')
  onStaticalDataLoad(val: any) {
    console.log(val);
    this.totalCount = val.reduce((prev: any, cur: any) => {
      return Number(cur.count) + Number(prev);
    }, 0);
    this.setOption();
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
        data: ['卡梅尔小镇', '水晶丽都', '惠丰同庆-蜜糖镇', '藏龙新城二期-梁山头商业门面房一栋', '藏龙新城', '中海', '东城华府']
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
              fontWeight: 'bold',
              formatter: '{b}: {d}'
            }
          },
          label: {
            fontSize: '14',
            formatter: '{b}: {d}%'
          },
          radius: ['40%', '60%'],
          center: ['50%', '50%'],
          selectedMode: true,
          data: [
            { value: 20, name: '卡梅尔小镇' },
            { value: 15, name: '水晶丽都' },
            { value: 1, name: '惠丰同庆-蜜糖镇' },
            { value: 1, name: '藏龙新城二期-梁山头商业门面房一栋' },
            { value: 11, name: '藏龙新城' },
            { value: 22, name: '中海' },
            { value: 12, name: '东城华府' }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: `rgba(0, 0, 0, 0.5)`
            },
            normal: {
              // color: (params: any) => {
              //   const data = this.statisticsData[params.dataIndex];
              //   return data.strokeStyle;
              // }
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
    this.statisticsData.forEach((item, index) => {
      if (item.id === id) {
        item.selected = !item.selected;
        this.emitStatisticsEvent();
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
      this.statisticsData.forEach((item, index) => {
        if (item.name === evt.name) {
          item.selected = !item.selected;
          this.emitStatisticsEvent();
        }
      });
    });
  }

  emitStatisticsEvent() {
    let ids = this.statisticsData.map(e => {
      if (e.selected) {
        return e.id;
      }
    });
    ids = ids.filter(e => e !== undefined);
    this.$emit('statistics-click', ids);
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
