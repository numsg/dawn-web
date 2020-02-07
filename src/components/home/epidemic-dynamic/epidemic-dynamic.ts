import { getGuid32 } from '@gsafety/cad-gutil/dist/utilhelper';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import epidemicDynamicStyle from './epidemic-dynamic.module.scss';
import epidemicDynamicHtml from './epidemic-dynamic.html';
import { ECharts, EChartOption } from 'echarts';
import * as echarts from 'echarts';
import 'echarts/map/js/china.js';
import 'echarts/map/js/province/hubei.js';
import { EpidemicInfoFormComponent } from './epidemic-info-form/epidemic-info-form';
import { SideFrameComponent } from '@/components/share/side-frame/side-frame';
import EpidemicPerson from '@/models/home/epidemic-persion';
import epidemicDynamicService from '@/api/epidemic-dynamic/epidemic-dynamic.service';
import moment from 'moment';

@Component({
  template: epidemicDynamicHtml,
  style: epidemicDynamicStyle,
  themes: [{ name: 'white', style: epidemicDynamicStyle }],
  components: {
    'side-frame': SideFrameComponent,
    'epidemic-info-form': EpidemicInfoFormComponent
  }
})
export class EpidemicDynamicComponent extends Vue {
  chart!: ECharts;
  option!: EChartOption;

  mapChart!: ECharts;
  mapOption!: EChartOption;

  isShowTabs: boolean = false;

  epidemicPersonList: EpidemicPerson[] = [
    {
      id: getGuid32(),
      name: '王小虎',
      gender: '1',
      district: '213',
      address: '上海市普陀区金沙江路 1518 弄',
      medicalCondition: '2016-05-03',
      specialSituation: 'sss',
      submitTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      note: '',
      diseaseTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      multiTenancy: 'zd',
      expendProperty: '213312'
    },
    {
      id: getGuid32(),
      name: '赵小虎',
      gender: '1',
      district: '213',
      address: '上海市普陀区金沙江路 1518 弄',
      medicalCondition: '2016-05-03',
      specialSituation: 'sss',
      submitTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      note: '',
      diseaseTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      multiTenancy: 'zd',
      expendProperty: '213312'
    },
    {
      id: getGuid32(),
      name: '啊小虎',
      gender: '1',
      district: '213',
      address: '上海市普陀区金沙江路 1518 弄',
      medicalCondition: '2016-05-03',
      specialSituation: 'sss',
      submitTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      note: '',
      diseaseTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      multiTenancy: 'zd',
      expendProperty: '213312'
    },
    {
      id: getGuid32(),
      name: '徐小虎',
      gender: '1',
      district: '213',
      address: '上海市普陀区金沙江路 1518 弄',
      medicalCondition: '2016-05-03',
      specialSituation: 'sss',
      submitTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      note: '',
      diseaseTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      multiTenancy: 'zd',
      expendProperty: '213312'
    },
    {
      id: getGuid32(),
      name: '郭小虎',
      gender: '1',
      district: '213',
      address: '上海市普陀区金沙江路 1518 弄',
      medicalCondition: '2016-05-03',
      specialSituation: 'sss',
      submitTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      note: '',
      diseaseTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      multiTenancy: 'zd',
      expendProperty: '213312'
    },
    {
      id: getGuid32(),
      name: '六小虎',
      gender: '1',
      district: '213',
      address: '上海市普陀区金沙江路 1518 弄',
      medicalCondition: '2016-05-03',
      specialSituation: 'sss',
      submitTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      note: '',
      diseaseTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      multiTenancy: 'zd',
      expendProperty: '213312'
    },
    {
      id: getGuid32(),
      name: '黄小虎',
      gender: '1',
      district: '213',
      address: '上海市普陀区金沙江路 1518 弄',
      medicalCondition: '2016-05-03',
      specialSituation: 'sss',
      submitTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      note: '',
      diseaseTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      multiTenancy: 'zd',
      expendProperty: '213312'
    },
    {
      id: getGuid32(),
      name: '普小虎',
      gender: '1',
      district: '213',
      address: '上海市普陀区金沙江路 1518 弄',
      medicalCondition: '2016-05-03',
      specialSituation: 'sss',
      submitTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      note: '',
      diseaseTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      multiTenancy: 'zd',
      expendProperty: '213312'
    },
    {
      id: getGuid32(),
      name: '王大小虎',
      gender: '1',
      district: '213',
      address: '上海市普陀区金沙江路 1518 弄',
      medicalCondition: '2016-05-03',
      specialSituation: 'sss',
      submitTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      note: '',
      diseaseTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      multiTenancy: 'zd',
      expendProperty: '213312'
    },
    {
      id: getGuid32(),
      name: '抢小虎',
      gender: '1',
      district: '213',
      address: '上海市普陀区金沙江路 1518 弄',
      medicalCondition: '2016-05-03',
      specialSituation: 'sss',
      submitTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      note: '',
      diseaseTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      multiTenancy: 'zd',
      expendProperty: '213312'
    }
  ];

  currentPage: number = 1;
  keyWords: string = '';

  // 当前省疫情数据
  curProEpidemicData: any = {};

  citiesEpidemicData: any[] = [];

  async creted() {
    // await this.queryProvinceEpidemicData();
    // await this.queryCityEpidemicData();
  }

  async mounted() {
    console.log(this.epidemicPersonList);
    await this.queryProvinceEpidemicData();
    await this.queryCityEpidemicData();
    console.log(this.curProEpidemicData);
    console.log(this.citiesEpidemicData);
    const ele: HTMLDivElement = document.querySelector('#doughnut') || document.createElement('div');
    this.chart = echarts.init(ele);
    this.setOption();

    const mapEle: HTMLDivElement = document.querySelector('#map') || document.createElement('div');
    this.mapChart = echarts.init(mapEle);
    this.setMapOption();
  }

  async queryProvinceEpidemicData() {
    this.curProEpidemicData = await epidemicDynamicService.queryProvinceEpidemicData();
  }

  async queryCityEpidemicData() {
    this.citiesEpidemicData = await epidemicDynamicService.queryCityEpidemicData();
  }

  setOption() {
    this.option = {
      xAxis: {
        type: 'category',
        data: ['关山春小', '关南小区', '软件园', '曙光新城']
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

  // setMapOption1() {
  //   this.mapOption = {
  //     tooltip: {
  //       trigger: 'item'
  //     },
  //     geo: {
  //       show: true,
  //       roam: false,
  //       map: '湖北',
  //       label: {
  //         show: false,
  //         color: '#555'
  //       },
  //       itemStyle: {
  //         areaColor: '#F5DEB9',
  //         borderColor: '##efd3a6'
  //       },
  //       emphasis: {
  //         label: {
  //           show: false,
  //           color: '#ADA'
  //         },
  //         itemStyle: {
  //           areaColor: '#F60'
  //         }
  //       },
  //       data: [
  //         { name: '十堰市', value: 222 },
  //         { name: '神农架林区', value: 222 },
  //         {
  //           name: '恩施土家族苗族自治州',
  //           value: 222
  //         },
  //         { name: '宜昌市', value: 222 },
  //         { name: '襄阳市', value: 222 },
  //         { name: '荆门市', value: 222 },
  //         { name: '荆州市', value: 222 },
  //         { name: '潜江市', value: 222 },
  //         { name: '天门市', value: 222 },
  //         { name: '仙桃市', value: 222 },
  //         { name: '随州市', value: 222 },
  //         { name: '孝感市', value: 222 },
  //         { name: '咸宁市', value: 222 },
  //         { name: '武汉市', value: 222 },
  //         { name: '黄冈市', value: 222 },
  //         { name: '黄石市', value: 222 }
  //       ]
  //     },
  //     visualMap: {
  //       min: 0,
  //       max: 600,
  //       show: false,
  //       calculable: true,
  //       inRange: {
  //         color: ['#ccc', 'yellow', '#fff']
  //       },
  //       textStyle: {
  //         color: '#fff'
  //       }
  //     },
  //     series: [
  //       {
  //         type: 'effectScatter',
  //         silent: false,
  //         coordinateSystem: 'geo',
  //         data: [
  //           { name: '宜昌', value: [111.290843, 30.702636, 600] },
  //           { name: '孝感市	', value: [113.926655, 30.926423, 200] },
  //           { name: '十堰市	', value: [110.787916, 32.646907, 100] },
  //           { name: '荆门市	', value: [112.204251, 31.03542, 150] },
  //           { name: '仙桃市	', value: [113.453974, 30.364953, 350] }
  //         ],
  //         label: {
  //           normal: {
  //             formatter: '{b}',
  //             position: 'right',
  //             show: true
  //           }
  //         },
  //         symbolSize: (val: any) => {
  //           return val[2] / 25;
  //         },
  //         rippleEffect: {
  //           brushType: 'fill' // 波纹绘制方式 stroke, fill
  //         },
  //         hoverAnimation: true
  //       }
  //     ]
  //   };
  //   this.mapChart.setOption(this.mapOption);
  // }

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
          color: ['#eea61c', '#d76b32', '#db3838']
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

  addEpidemicPersion() {
    const sideFrame: any = this.$refs['sideFrame'];
    sideFrame.open();
  }

  savePersonSuccess() {
    const sideFrame: any = this.$refs['sideFrame'];
    sideFrame.close();
  }

  handleSizeChange(val: any) {
    console.log(`每页 ${val} 条`);
  }
  handleCurrentChange(val: any) {
    console.log(`当前页: ${val}`);
  }
}
