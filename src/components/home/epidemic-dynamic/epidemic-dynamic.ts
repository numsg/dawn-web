import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import epidemicDynamicStyle from './epidemic-dynamic.module.scss';
import epidemicDynamicHtml from './epidemic-dynamic.html';
import { ECharts, EChartOption } from 'echarts';
import * as echarts from 'echarts';
import 'echarts/map/js/china.js';
import 'echarts/map/js/province/hubei.js';

@Component({
  template: epidemicDynamicHtml,
  style: epidemicDynamicStyle,
  themes: [{ name: 'white', style: epidemicDynamicStyle }],
  components: {}
})
export class EpidemicDynamicComponent extends Vue {
  chart!: ECharts;
  option!: EChartOption;

  mapChart!: ECharts;
  mapOption!: EChartOption;

  isShowTabs: boolean = false;

  tableData = [
    {
      date: '2016-05-03',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄',
    },
    {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄',
    },
    {
      date: '2016-05-04',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄',
    },
    {
      date: '2016-05-01',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄',
    },
    {
      date: '2016-05-08',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄',
    },
    {
      date: '2016-05-06',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄',
    },
    {
      date: '2016-05-07',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄',
    }
  ];

  mounted() {
    const ele: HTMLDivElement = document.querySelector('#doughnut') || document.createElement('div');
    this.chart = echarts.init(ele);
    this.setOption();

    const mapEle: HTMLDivElement = document.querySelector('#map') || document.createElement('div');
    this.mapChart = echarts.init(mapEle);
    this.setMapOption();
  }

  setOption() {
    this.option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70],
          type: 'bar'
        }
      ]
    };
    this.chart.setOption(this.option);
  }

  setMapOption1() {
    this.mapOption = {
      // backgroundColor: '#404a59',
      tooltip: {
        trigger: 'item'
      },
      geo: {
        show: true,
        roam: false,
        map: '湖北',
        label: {
          show: false,
          color: '#555'
        },
        itemStyle: {
          areaColor: '#F5DEB9',
          borderColor: '##efd3a6'
        },
        emphasis: {
          label: {
            show: false,
            color: '#ADA'
          },
          itemStyle: {
            areaColor: '#F60'
          }
        },
        data: [
          { name: '十堰市', value: 222 },
          { name: '神农架林区', value: 222 },
          {
            name: '恩施土家族苗族自治州',
            value: 222
          },
          { name: '宜昌市', value: 222 },
          { name: '襄阳市', value: 222 },
          { name: '荆门市', value: 222 },
          { name: '荆州市', value: 222 },
          { name: '潜江市', value: 222 },
          { name: '天门市', value: 222 },
          { name: '仙桃市', value: 222 },
          { name: '随州市', value: 222 },
          { name: '孝感市', value: 222 },
          { name: '咸宁市', value: 222 },
          { name: '武汉市', value: 222 },
          { name: '黄冈市', value: 222 },
          { name: '黄石市', value: 222 }
        ]
      },
      visualMap: {
        min: 0,
        max: 600,
        show: false,
        calculable: true,
        inRange: {
          color: ['#ccc', 'yellow', '#fff']
        },
        textStyle: {
          color: '#fff'
        }
      },
      series: [
        {
          type: 'effectScatter',
          silent: false,
          coordinateSystem: 'geo',
          data: [
            { name: '宜昌', value: [111.290843, 30.702636, 600] },
            { name: '孝感市	', value: [113.926655, 30.926423, 200] },
            { name: '十堰市	', value: [110.787916, 32.646907, 100] },
            { name: '荆门市	', value: [112.204251, 31.03542, 150] },
            { name: '仙桃市	', value: [113.453974, 30.364953, 350] }
          ],
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: true
            }
          },
          symbolSize: (val: any) => {
            return val[2] / 25;
          },
          rippleEffect: {
            brushType: 'fill' // 波纹绘制方式 stroke, fill
          },
          hoverAnimation: true
        }
      ]
    };
    this.mapChart.setOption(this.mapOption);
  }

  setMapOption() {
    this.mapOption = {
      // backgroundColor: '#404a59',
      tooltip: {
        trigger: 'item'
      },
      visualMap: {
        min: 0,
        max: 600,
        calculable: true,
        inRange: {
          color: ['#f5d7ad', '#dba524', '#da4e09']
        },
        textStyle: {
          color: '#fff'
        }
      },
      series: [
        {
          name: '地图',
          type: 'map',
          map: '湖北',
          roam: false,
          label: {
            normal: {
              show: true
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
          zoom: 1,
          data: [
            { name: '十堰市', value: Math.round(Math.random() * 500) },
            { name: '神农架林区', value: Math.round(Math.random() * 500) },
            { name: '恩施土家族苗族自治州', value: Math.round(Math.random() * 500) },
            { name: '宜昌市', value: Math.round(Math.random() * 500) },
            { name: '襄阳市', value: Math.round(Math.random() * 500) },
            { name: '荆门市', value: Math.round(Math.random() * 500) },
            { name: '荆州市', value: Math.round(Math.random() * 500) },
            { name: '潜江市', value: Math.round(Math.random() * 500) },
            { name: '天门市', value: Math.round(Math.random() * 500) },
            { name: '仙桃市', value: Math.round(Math.random() * 500) },
            { name: '随州市', value: Math.round(Math.random() * 500) },
            { name: '孝感市', value: Math.round(Math.random() * 500) },
            { name: '咸宁市', value: Math.round(Math.random() * 500) },
            { name: '武汉市', value: Math.round(Math.random() * 500) },
            { name: '黄冈市', value: Math.round(Math.random() * 500) },
            { name: '黄石市', value: Math.round(Math.random() * 500) }
          ]
        }
      ]
    };
    this.mapChart.setOption(this.mapOption);
  }

  showTabs() {
    this.isShowTabs = !this.isShowTabs;
  }
}
