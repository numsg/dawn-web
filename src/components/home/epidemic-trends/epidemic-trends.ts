import { Vue, Component } from 'vue-property-decorator';
import styles from './epidemic-trends.module.scss';
import template from './epidemic-trends.html';
import { ECharts } from 'echarts';
import * as echarts from 'echarts';
import moment from 'moment';

import { regionalStatisticsService } from '../../../api/regional-statistics/regional-statistics.service';

@Component({
  name: 'epidemic-trends',
  template: template,
  style: styles,
  components: {}
})
export class EpidemicTrends extends Vue {
  // 通用折线图配置选项
  commonLineChartOptions = {};
  // Echart对象
  lineChart!: ECharts;

  mounted() {
    this.initialNewCaseTrends();
  }

  private async initialNewCaseTrends() {
    const lineChartEle: HTMLDivElement = document.querySelector('#newCaseLineChart') || document.createElement('div');
    this.lineChart = echarts.init(lineChartEle);
    let data = await regionalStatisticsService.loadNewCaseData('');
    this.setOptions(data);
    data = null;
  }

  private setOptions(datas: Array<any>) {
    const weekdays = [];
    for (let index = 1; index < 8; index++) {
      const day = moment()
        .weekday(index)
        .format('YYYY-MM-DD');
      weekdays.push(day);
    }
    const options: any = {
      title: {
        // text: '江夏区 新增确诊/疑似 趋势图',
        subtext: '单位 例',
        left: 15
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        top: 10,
        right: 20,
        backgroundColor: '#eaeaea',
        borderRadius: 5,
        padding: [10, 15],
        icon: 'circle',
        data: ['新增确诊', '新增疑似']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: weekdays,
        splitLine: {
          lineStyle: {
            opacity: 0.5
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            opacity: 0.3
          }
        }
      },
      series: [
        {
          name: '新增确诊',
          type: 'line',
          stack: '总量',
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#ce3636'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(238, 130, 64, 0.7)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(238, 130, 64, 0)' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          },
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '新增疑似',
          type: 'line',
          stack: '总量',
          symbol: 'circle',
          symbolSize: 10,
          itemStyle: {
            color: '#ee8240'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(250, 205, 161, 1)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(250, 205, 161, 0)' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          },
          data: [220, 182, 191, 234, 290, 330, 310]
        }
      ]
    };
    this.lineChart.setOption(options);
  }
}
