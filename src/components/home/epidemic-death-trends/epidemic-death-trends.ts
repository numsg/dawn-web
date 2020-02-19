import { Vue, Component, Watch } from 'vue-property-decorator';
import styles from './epidemic-death-trends.module.scss';
import template from './epidemic-death-trends.html';
import { ECharts } from 'echarts';
import * as echarts from 'echarts';

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
  curedCaseImg = require('@/assets/img/statistics/cured-case.png');
  deathCaseImg = require('@/assets/img/statistics/death-case.png');

  curedCaseData: any = {
    name: '治愈',
    new: 0,
    cumulativeTotal: 0,
    data: []
  };
  deathCaseData: any = {
    name: '死亡',
    new: 0,
    cumulativeTotal: 0,
    data: []
  };

  weekdays: any = [];
  isDaily = true;
  cumulativeTitle = '累计';
  lineChartData = [];
  seriesTemplate = {
    name: '',
    type: 'line',
    symbol: 'circle',
    symbolSize: 10,
    itemStyle: {
      color: '#ee8240'
    },
    data: []
  };
  seriesType = [
    {
      name: '治愈',
      color: '#10aeb5'
    },
    {
      name: '死亡',
      color: '#757575'
    }
  ];
  seriesData: any = [];

  mounted() {
    this.initialCureAndDeathTrends();
  }

  @Watch('isDaily')
  handleSwitchDimension(val: boolean) {
    this.resetData();
    this.initialCureAndDeathTrends();
  }

  resetData() {
    this.curedCaseData.data = null;
    this.curedCaseData.data = [];
    this.deathCaseData.data = null;
    this.deathCaseData.data = [];
    this.seriesData = null;
    this.seriesData = [];
  }

  initialData(data: any) {
    if (Array.isArray(data) && data.length > 0) {
      this.weekdays = data.map((d: any) => {
        return d.date;
      });

      data.forEach((d: any) => {
        if (!this.isDaily) {
          this.curedCaseData.data.push(d.allCure);
          this.deathCaseData.data.push(d.allDeath);
        } else {
          this.curedCaseData.data.push(d.cure);
          this.deathCaseData.data.push(d.death);
        }
      });

      this.seriesType.forEach((type: any) => {
        const template = JSON.parse(JSON.stringify(this.seriesTemplate));
        template.name = this.isDaily ? type.name : this.cumulativeTitle + type.name;
        template.itemStyle.color = type.color;
        if (template.name.indexOf('治愈') >= 0) {
          template.data = this.curedCaseData.data;
        }
        if (template.name.indexOf('死亡') >= 0) {
          template.data = this.deathCaseData.data;
        }
        this.seriesData.push(template);
      });

      this.curedCaseData.name = this.seriesData[0].name;
      this.curedCaseData.new = data[data.length - 1].cure;
      this.curedCaseData.cumulativeTotal = data[data.length - 1].allCure;

      this.deathCaseData.name = this.seriesData[1].name;
      this.deathCaseData.new = data[data.length - 1].death;
      this.deathCaseData.cumulativeTotal = data[data.length - 1].allDeath;
    }
  }

  private async initialCureAndDeathTrends() {
    const lineChartEle: HTMLDivElement = document.querySelector('#deathTrendsLineChart') || document.createElement('div');
    this.lineChart = echarts.init(lineChartEle);
    let data = await regionalStatisticsService.loadCureAndDeathCaseData();
    this.initialData(data);
    this.setOptions();
    data = null;
  }

  private setOptions() {
    const options: any = {
      title: {
        // text: '江夏区 新增确诊/死亡 趋势图',
        subtext: '单位 例',
        left: 15
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        top: 3,
        right: 20,
        backgroundColor: '#eaeaea',
        borderRadius: 5,
        padding: [10, 15],
        icon: 'circle',
        data: this.seriesType.map((d: any) => {
          return this.isDaily ? d.name : this.cumulativeTitle + d.name;
        })
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
        data: this.weekdays,
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
      series: this.seriesData
    };
    this.lineChart.setOption(options);
  }
}
