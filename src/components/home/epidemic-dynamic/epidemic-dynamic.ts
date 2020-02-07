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
  option!: any;

  mapChart!: ECharts;
  mapOption!: any;

  isShowTabs: boolean = false;

  epidemicPersonList: EpidemicPerson[] = [
    {
      id: getGuid32(),
      name: '王小虎',
      gender: '1',
      district: '213',
      address: '上海市普陀区金沙江路 1518 弄',
      medicalCondition: '确诊',
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
      medicalCondition: '确诊',
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
      medicalCondition: '确诊',
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
      medicalCondition: '确诊',
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
      medicalCondition: '确诊',
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
      medicalCondition: '确诊',
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
      medicalCondition: '确诊',
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
      medicalCondition: '确诊',
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
      medicalCondition: '确诊',
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
      medicalCondition: '确诊',
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

  setMapOption() {
    const citiesData: any = [];
    this.citiesEpidemicData.forEach(e => {
      if (e.name === '神农架地区') {
        e.name = '神农架林区';
      } else if (e.name.startsWith( '恩施')) {
        e.name = '恩施土家族苗族自治州';
      } else {
        e.name = e.name + '市';
      }
      const data: any = {
        name: e.name,
        value: e.confirm
      };
      citiesData.push(data);
    });
    console.log(citiesData);
    this.mapOption = {
      // backgroundColor: '#404a59',
      tooltip: {
        trigger: 'item'
      },
      visualMap: {
        type: 'piecewise',
        pieces: [
          {min: 10000, label: '>10000', color: '#660208'},
          {min: 1000, max: 9999, label: '1000-9999', color: '#8C0D0D'},
          {min: 100, max: 999, label: '100-999', color: '#CC2929'},
          {min: 10, max: 99, label: '10-99', color: '#FF7B69'},
          {min: 1, max: 9, label: '1-9', color: '#FFAA85'}
      ],
        min: 1,
        max: 20000,
        bottom: 20,
        calculable: true,
        inRange: {
          color: ['#eea61c', '#d76b32', '#db3838']
        },
        // textStyle: {
        //   color: '#fff'
        // }
      },
      series: [
        {
          name: '确诊病例',
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
          data: citiesData
          // data: [
          //   { name: '十堰市', value: Math.round(Math.random() * 500) },
          //   { name: '神农架林区', value: Math.round(Math.random() * 500) },
          //   { name: '恩施土家族苗族自治州', value: Math.round(Math.random() * 500) },
          //   { name: '宜昌市', value: Math.round(Math.random() * 500) },
          //   { name: '襄阳市', value: Math.round(Math.random() * 500) },
          //   { name: '荆门市', value: Math.round(Math.random() * 500) },
          //   { name: '荆州市', value: Math.round(Math.random() * 500) },
          //   { name: '潜江市', value: Math.round(Math.random() * 500) },
          //   { name: '天门市', value: Math.round(Math.random() * 500) },
          //   { name: '仙桃市', value: Math.round(Math.random() * 500) },
          //   { name: '随州市', value: Math.round(Math.random() * 500) },
          //   { name: '孝感市', value: Math.round(Math.random() * 500) },
          //   { name: '咸宁市', value: Math.round(Math.random() * 500) },
          //   { name: '武汉市', value: Math.round(Math.random() * 500) },
          //   { name: '黄冈市', value: Math.round(Math.random() * 500) },
          //   { name: '黄石市', value: Math.round(Math.random() * 500) }
          // ]
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
