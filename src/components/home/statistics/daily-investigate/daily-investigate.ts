import { Vue, Component } from 'vue-property-decorator';
import styles from './daily-investigate.module.scss';
import template from './daily-investigate.html';
import { ECharts, EChartOption } from 'echarts';
import * as echarts from 'echarts';

import _ from 'lodash';
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
  housingEstateData: any = [];
  currenHousingEstate: any = [];
  districtCode: any = '';
  mounted() {
    this.districtCode = SessionStorage.get('district');
    if (this.districtCode) {
      this.initDailyCharts();
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
    const data = await analysisOutbreakService.queryPlotsRecord(this.districtCode.toString(), val);
    this.buildOptionsData(val, data);
  }

  private async initDailyCharts() {
    const lineChartEle: HTMLDivElement = document.querySelector('#staffStatisticsChart') || document.createElement('div');
    this.histogramChart = echarts.init(lineChartEle);
  }

  buildOptionsData(plotsids: any, data: any) {
    const xdata: any = [];
    const ydata: any = [];
    plotsids.forEach((p: any) => {
      Object.getOwnPropertyNames(data).forEach(function(key) {
        if (key === p) {
          if (data[key]) {
            data[key].forEach((plotdaily: any) => {
              const index = xdata.findIndex((date: any) => date === plotdaily.date);
              if (index >= 0) {
                ydata[index] += plotdaily.count;
              } else {
                xdata.push(plotdaily.date);
                ydata.push(plotdaily.count);
              }
            });
          }
        }
      });
    });
    this.setOptions(xdata, ydata);
  }

  private setOptions(xdata: any, ydata: any) {
    const options: any = {
      color: ['#3398DB'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: xdata,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '',
          type: 'bar',
          barWidth: '60%',
          data: ydata
        }
      ]
    };
    this.histogramChart.setOption(options);
  }
}
