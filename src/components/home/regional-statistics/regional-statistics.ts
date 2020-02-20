import { Vue, Component } from 'vue-property-decorator';
import styles from './regional-statistics.module.scss';
import template from './regional-statistics.html';
import { ECharts, EChartOption } from 'echarts';
import * as echarts from 'echarts';
import { regionalStatisticsService } from '../../../api/regional-statistics/regional-statistics.service';
import _ from 'lodash';

@Component({
  name: 'regional-statistics',
  template: template,
  style: styles,
  components: {}
})
export class RegionalStatistics extends Vue {
  // 通用地图配置选项
  commonMapOptions: any = {};
  // Echart对象
  mapChart!: ECharts;

  mounted() {
    this.intialStatisticsCharts();
  }

  /**
   * 初始化统计图表
   *
   * @memberof RegionalStatistics
   */
  intialStatisticsCharts() {
    this.initialRegionalMapChart();
  }

  /**
   * 初始化区域地图统计图表
   *
   * @private
   * @memberof RegionalStatistics
   */
  private async initialRegionalMapChart() {
    const mapEle: HTMLDivElement = document.querySelector('#regionalMap') || document.createElement('div');
    this.mapChart = echarts.init(mapEle);
    let data = await regionalStatisticsService.loadMapDatas('./map-data/jiangxia-regional-data.json');
    if (data) {
      let mapDistributionDatas = await regionalStatisticsService.loadMapDistributionDatas();
      const tempDatas1: Array<any> = [];
      const tempDatas2: Array<any> = [];
      if (Array.isArray(data.features)) {
        data.features.forEach((element: any) => {
          const townData = {
            name: element.properties.name,
            value: 0
          };
          tempDatas1.push(townData);
        });
        if (Array.isArray(mapDistributionDatas)) {
          mapDistributionDatas.forEach((element: any) => {
            const townData = {
              name: element.name + '道',
              value: element.new
            };
            tempDatas2.push(townData);
          });
        }
        for (const data1 of tempDatas1) {
          for (const data2 of tempDatas2) {
            if (data1.name === data2.name) {
              data1.value = data2.value;
              if (data1.value === 0) {
                data1.value = Math.round(Math.random() * 500);
              }
            }
          }
        }
        echarts.registerMap('JIANGXIA', data);
        this.setMapOptions(tempDatas1);
      }
      mapDistributionDatas = null;
    }
    data = null;
  }

  /**
   * 设置区域地图统计图表选项
   *
   * @private
   * @param {Array<any>} mapDatas 地图信息数据
   * @memberof RegionalStatistics
   */
  private setMapOptions(mapDatas: Array<any>) {
    this.commonMapOptions = {
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          let value: any = (params.value + '').split('.');
          value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
          return params.seriesName + '<br/>' + params.name + ': ' + value;
        }
      },
      visualMap: {
        type: 'piecewise',
        pieces: [
          { min: 10000, label: '大于 10000 例', color: '#660208' },
          { min: 1000, max: 9999, label: '1000-9999 例', color: '#8e3726' },
          { min: 100, max: 999, label: '100-999 例', color: '#b9742c' },
          { min: 10, max: 99, label: '10-99 例', color: '#f7bf32' },
          { min: 1, max: 9, label: '1-9 例', color: '#fef5bc' }
        ],
        min: 1,
        max: 20000,
        bottom: 20,
        calculable: true,
        inRange: {
          color: ['#eea61c', '#d76b32', '#db3838']
        }
      },
      series: [
        {
          label: {
            normal: {
              show: true,
              // formatter: (param: object | Array<any>) => {}
              formatter: '{b} \r\n \r\n {a} : {c}'
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            emphasis: {
              label: {
                show: true
              }
            }
          },
          zoom: 4,
          name: '确诊病例',
          type: 'map',
          map: 'JIANGXIA',
          roam: true,
          center: [114.2952965814168, 30.318273403997726],
          data: mapDatas
        }
      ]
    };
    this.mapChart.setOption(this.commonMapOptions);
  }
}
