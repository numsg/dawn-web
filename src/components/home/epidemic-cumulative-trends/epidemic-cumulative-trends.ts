import { Vue, Component } from 'vue-property-decorator';
import styles from './epidemic-cumulative-trends.module.scss';
import template from './epidemic-cumulative-trends.html';
import { ECharts } from 'echarts';
import * as echarts from 'echarts';
import moment from 'moment';

import { regionalStatisticsService } from '../../../api/regional-statistics/regional-statistics.service';

@Component({
  name: 'epidemic-cumulative-trends',
  template: template,
  style: styles,
  components: {}
})
export class EpidemicCumulativeTrends extends Vue {
  // 通用折线图配置选项
  commonLineChartOptions = {};
  // Echart对象
  lineChart!: ECharts;

  // 累计确诊病例数据
  cumulativeConfirmedCaseData = [];
  // 累计疑似病例数据
  cumulativeSuspectedCaseData = [];

  // 累计确诊/疑似趋势数据
  cumulativeCaseTrends = {};

  mounted() {
    this.initialNewCaseTrends();
  }

  private async initialNewCaseTrends() {
    const lineChartEle: HTMLDivElement = document.querySelector('#cumulativeLineChart') || document.createElement('div');
    this.lineChart = echarts.init(lineChartEle);
    // let data = await regionalStatisticsService.loadNewCaseData('');
    // this.setOptions(data);
    // data = null;
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
        // text: '江夏区 累计确诊/疑似 趋势图',
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
        data: ['累计确诊', '累计疑似']
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
        },
        axisLine: {
          lineStyle: {
            color: '#555',
            opacity: 0.2
          }
        },
        axisTick: {
          lineStyle: {
            color: '#555',
            opacity: 0.2
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
          name: '累计确诊',
          type: 'line',
          stack: '总量',
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#ce3636'
          },
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '累计疑似',
          type: 'line',
          stack: '总量',
          symbol: 'circle',
          symbolSize: 10,
          itemStyle: {
            color: '#ee8240'
          },
          data: [220, 182, 191, 234, 290, 330, 310]
        }
      ]
    };
    this.lineChart.setOption(options);
  }
}
