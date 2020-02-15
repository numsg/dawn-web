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

  totalCount: number = 0;

  @Getter('dailyTroubleshooting_statisticsData')
  statisticsData!: any[];

  constructor() {
    super();
  }

  async mounted() {
    const doughnut: HTMLDivElement = document.querySelector('#doughnut') || document.createElement('div');
    this.chart = echarts.init(doughnut);
    // this.setOption();
    this.addEventListener();
    await this.$store.dispatch(eventNames.DailyTroubleshooting.SetStatisticsData);
  }

  @Watch('statisticsData')
  onStaticalDataLoad(val: any) {
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
        data: this.statisticsData.map((e: any) => e.name),
        tooltip: {
          show: true
        },
        formatter: (value: string) => {
          if (value.length > 8) {
            return value.slice(0, 8) + '...';
          }
          return value;
        },
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
            show: false,
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
          data: this.statisticsData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: `rgba(0, 0, 0, 0.5)`
            },
            normal: {
              color: (params: any) => {
                const data = this.statisticsData[params.dataIndex];
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
    this.statisticsData.forEach((item, index) => {
      if (item.id === id) {
        if (item.count === 0) {
          return;
        }
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
        if (item.count === 0) {
          return;
        }
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
    this.$store.dispatch(eventNames.DailyTroubleshooting.SetConditions, {
      plots: ids,
      page: 0
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
