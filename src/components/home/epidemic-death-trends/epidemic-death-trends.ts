import { Vue, Component } from 'vue-property-decorator';
import styles from './epidemic-death-trends.module.scss';
import template from './epidemic-death-trends.html';
import { ECharts } from 'echarts';
import * as echarts from 'echarts';
import moment from 'moment';

import { regionalStatisticsService } from '../../../api/regional-statistics/regional-statistics.service';

@Component({
  name: 'epidemic-death-trends',
  template: template,
  style: styles,
  components: {}
})
export class EpidemicDeathTrends extends Vue {
  // 通用折线图配置选项
  commonLineChartOptions = {};
  // Echart对象
  lineChart!: ECharts;
  // 累计死亡趋势数据
  cumulativeDeathTrends = {};

  mounted() {
    this.initialNewCaseTrends();
  }

  private async initialNewCaseTrends() {
    const lineChartEle: HTMLDivElement = document.querySelector('#deathTrendsLineChart') || document.createElement('div');
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
        // text: '江夏区 累计治愈/疑似 趋势图',
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
        data: ['累计治愈', '累计死亡']
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
          name: '累计治愈',
          type: 'line',
          stack: '总量',
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#3cb371'
          },
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '累计死亡',
          type: 'line',
          stack: '总量',
          symbol: 'circle',
          symbolSize: 10,
          itemStyle: {
            color: '#42435d'
          },
          data: [220, 182, 191, 234, 290, 330, 310]
        }
      ]
    };
    this.lineChart.setOption(options);
  }
}
