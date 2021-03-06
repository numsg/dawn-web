import { Vue, Component } from 'vue-property-decorator';
import styles from './daily-investigate.module.scss';
import template from './daily-investigate.html';
import { ECharts } from 'echarts';
import * as echarts from 'echarts';
import communityQrManageService from '@/api/community-qr-manage/community-qr-manage.service';
import ddatasourceService from '@/api/data-source/d-data-source.service';
import SessionStorage from '@/utils/session-storage';
import analysisOutbreakService from '@/api/statistic/analysisOutbreak.service';

@Component({
  name: 'daily-investigate',
  template: template,
  style: styles,
  components: {}
})
export class DailyInvestigate extends Vue {
  histogramChartOptions = {};
  histogramChart!: ECharts;
  staffStatisticsData = {};
  housingEstateData: Array<any> = [];
  currenHousingEstate: any = [];
  districtCode: any = '';
  weekDays: any = [];

  mounted() {
    this.districtCode = SessionStorage.get('district');
    const xdata: any = [];
    for (let i = 0; i < 7; i++) {
      xdata.push(this.getdays(-i));
    }
    this.weekDays = xdata.reverse();
    this.initDailyCharts();
    this.setOptions(this.weekDays, [], []);
    if (this.districtCode) {
      this.getHousingEstate();
    }
  }

  async getHousingEstate() {
    const dataSource: any = await communityQrManageService.queryDataSourceByDistrict(this.districtCode.toString());
    if (!dataSource) {
      return;
    }
    const dataSourcedata: any = await ddatasourceService.queryDDataSourceIdAndName(dataSource[0].id);
    if (dataSourcedata && Array.isArray(dataSourcedata)) {
      this.housingEstateData = dataSourcedata;
      if (dataSourcedata.length > 0) {
        this.currenHousingEstate = [this.housingEstateData[0].id];
        const data = await analysisOutbreakService.queryPlotsRecord(this.districtCode.toString(), [this.housingEstateData[0].id]);
        this.buildOptionsData([this.housingEstateData[0].id], data);
      }
    }
  }
  // 切换小区显示该小区排查历史
  async changeHousingEstate(val: any) {
    this.setOptions(this.weekDays, [], []);
    if (val.length > 0) {
      const data = await analysisOutbreakService.queryPlotsRecord(this.districtCode.toString(), val);
      this.buildOptionsData(val, data);
    }
  }

  private async initDailyCharts() {
    const lineChartEle: HTMLDivElement = document.querySelector('#staffStatisticsChart') || document.createElement('div');
    this.histogramChart = echarts.init(lineChartEle);
  }
  getdays(day: any) {
    const today = new Date();
    const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds);
    let tMonth = today.getMonth();
    let tDate = today.getDate();
    tMonth = this.doHandleMonth(tMonth + 1);
    tDate = this.doHandleMonth(tDate);
    return tMonth + '月' + tDate + '号';
  }
  doHandleMonth(month: any) {
    let m = month;
    if (month.toString().length === 1) {
      m = '0' + month;
    }
    return m;
  }

  buildOptionsData(plotsids: any, data: any) {
    const legend: any = [];
    const series: any = [];
    const housdata = this.housingEstateData;
    plotsids.forEach((p: any, i: any) => {
      const temp = housdata.find((h: any) => h.id === p);
      const colors: any = ['#fe912a', '#e96873', '#5eb8c0', '#5179bc', '#b65b7d', '#fdcd66', '#bac888'];
      const obj = {
        name: temp.name,
        type: 'bar',
        data: [],
        itemStyle: {
          color: colors[i]
        },
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        }
      };
      const ydata: any = [0, 0, 0, 0, 0, 0, 0];
      const self = this;
      Object.getOwnPropertyNames(data).forEach(function(key) {
        if (key === p) {
          if (data[key]) {
            legend.push(temp.name);
            data[key].forEach((plotdaily: any) => {
              const index = self.weekDays.findIndex((date: any) => date === plotdaily.date);
              if (index >= 0) {
                ydata[index] = plotdaily.count;
              }
            });
          }
        }
      });
      obj.data = ydata;
      series.push(obj);
    });
    this.setOptions(this.weekDays, series, legend);
  }

  private setOptions(xdata: any, series: any, legend: any) {
    const options: any = {
      title: {
        subtext: '单位 例',
        left: 15
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: legend,
        right: 15
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        show: true
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          data: xdata
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: series
    };
    this.histogramChart.setOption(options, true);
  }
}
