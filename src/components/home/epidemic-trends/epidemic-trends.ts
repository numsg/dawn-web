import { Vue, Component, Watch } from 'vue-property-decorator';
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

  confirmedCaseImg = require('@/assets/img/statistics/confirmed-case.png');
  suspectedCaseImg = require('@/assets/img/statistics/suspect-case.png');
  feverCaseImg = require('@/assets/img/statistics/fever-case.png');
  closeContactCaseImg = require('@/assets/img/statistics/close-contact-case.png');

  confirmedCaseData: any = {
    name: '确诊',
    new: 0,
    cumulativeTotal: 0,
    data: []
  };
  suspectedCaseData: any = {
    name: '疑似',
    new: 0,
    cumulativeTotal: 0,
    data: []
  };
  feverCaseData: any = {
    name: '发热',
    new: 0,
    cumulativeTotal: 0,
    data: []
  };
  closeContactCaseData: any = {
    name: '密切接触',
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
      name: '确诊',
      color: '#ce3636'
    },
    {
      name: '疑似',
      color: '#ee8240'
    },
    {
      name: '发热',
      color: '#f0b605'
    },
    {
      name: '密切接触',
      color: '#b081e6'
    }
  ];
  seriesData: any = [];

  mounted() {
    this.initialNewCaseTrends();
  }

  @Watch('isDaily')
  handleSwitchDimension(val: boolean) {
    this.resetData();
    this.initialNewCaseTrends();
  }

  resetData() {
    this.confirmedCaseData.data = null;
    this.confirmedCaseData.data = [];
    this.suspectedCaseData.data = null;
    this.suspectedCaseData.data = [];
    this.feverCaseData.data = null;
    this.feverCaseData.data = [];
    this.closeContactCaseData.data = null;
    this.closeContactCaseData.data = [];
    this.seriesData = null;
    this.seriesData = [];
  }

  private async initialNewCaseTrends() {
    const lineChartEle: HTMLDivElement = document.querySelector('#newCaseLineChart') || document.createElement('div');
    this.lineChart = echarts.init(lineChartEle);
    let data = await regionalStatisticsService.loadNewCaseData();
    this.initialData(data);
    this.setOptions();
    data = null;
  }

  initialData(data: any) {
    if (Array.isArray(data) && data.length > 0) {
      this.weekdays = data.map((d: any) => {
        return d.date;
      });

      data.forEach((d: any) => {
        if (!this.isDaily) {
          this.confirmedCaseData.data.push(d.allConfirmed);
          this.suspectedCaseData.data.push(d.allSuspect);
          this.feverCaseData.data.push(d.allFever);
          this.closeContactCaseData.data.push(d.allContact);
        } else {
          this.confirmedCaseData.data.push(d.confirmed);
          this.suspectedCaseData.data.push(d.suspect);
          this.feverCaseData.data.push(d.fever);
          this.closeContactCaseData.data.push(d.contact);
        }
      });

      this.seriesType.forEach((type: any) => {
        const template = JSON.parse(JSON.stringify(this.seriesTemplate));
        template.name = this.isDaily ? type.name : this.cumulativeTitle + type.name;
        template.itemStyle.color = type.color;
        if (template.name.indexOf('确诊') >= 0) {
          template.data = this.confirmedCaseData.data;
        }
        if (template.name.indexOf('疑似') >= 0) {
          template.data = this.suspectedCaseData.data;
        }
        if (template.name.indexOf('发热') >= 0) {
          template.data = this.feverCaseData.data;
        }
        if (template.name.indexOf('密切接触') >= 0) {
          template.data = this.closeContactCaseData.data;
        }
        this.seriesData.push(template);
      });

      this.confirmedCaseData.name = this.seriesData[0].name;
      this.confirmedCaseData.new = data[data.length - 1].confirmed;
      this.confirmedCaseData.cumulativeTotal = data[data.length - 1].allConfirmed;

      this.suspectedCaseData.name = this.seriesData[1].name;
      this.suspectedCaseData.new = data[data.length - 1].suspect;
      this.suspectedCaseData.cumulativeTotal = data[data.length - 1].allSuspect;

      this.feverCaseData.name = this.seriesData[2].name;
      this.feverCaseData.new = data[data.length - 1].fever;
      this.feverCaseData.cumulativeTotal = data[data.length - 1].allFever;

      this.closeContactCaseData.name = this.seriesData[3].name;
      this.closeContactCaseData.new = data[data.length - 1].contact;
      this.closeContactCaseData.cumulativeTotal = data[data.length - 1].allContact;
    }
  }

  private setOptions() {
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
        minInterval: 1,
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
