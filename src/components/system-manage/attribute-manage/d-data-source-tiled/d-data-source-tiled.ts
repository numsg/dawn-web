import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from './d-data-source-tiled.html';
import Styles from './d-data-source-tiled.module.scss';
import dSourceDataService from '@/api/data-source/d-data-source.service';
import DSourceDataModel from '@/models/data-source/d-source-data';
import Guid from '@/utils/guid';
import sourceBlackStyle from './d-data-source-tiled.black.module.scss';

@Component({
  template: Html,
  style: Styles,
  themes: [{ name: 'white', style: Styles }, { name: 'black', style: sourceBlackStyle }],
  name: 'd-data-source-tiled',
  components: {}
})
export class DDataSourceTiledComponent extends Vue {
  public dataArr: Array<any> = [];
  public isEdit: boolean = false;
  public currentItem: any = {};
  public isAdd: boolean = false;
  public addModel = {
    name: '',
    image: JSON.stringify({
      isIcon: true,
      iconfont: 'iconfont iconpms-icon_Event-type',
      iconColor: ''
    }),
    imgColor: ''
  };

  @Prop({
    default: false
  })
  isAttribute: any;

  private _beforeEdit: any = {};

  public searchValue: string = '';

  // 显示选择图标的弹框
  isShowImgBox: boolean = false;

  // 本地图片库
  private _backgroundImgs = [
    { url: require('@/assets/img/home.png'), id: 'Home', upload: false },
    { url: require('@/assets/img/Plan-brain.png'), id: 'PlanBrain', upload: false },
    { url: require('@/assets/img/Plan-management.png'), id: 'PlanManagement', upload: false }
  ];

  // img
  img: any = { isIcon: true, iconfont: '', iconColor: '' };

  // 默认的矢量图标
  private _vectorIcon = [
    { isVector: true, className: 'iconpms-icon_Health', fontColor: '#F2DEC9', id: 'icon_Health', upload: false },
    { isVector: true, className: 'iconpms-icon_Natural-disaster', fontColor: '#8BC1C5', id: 'icon_Natural-disaster', upload: false },
    { isVector: true, className: 'iconpms-icon_Public-Health', fontColor: '#AAC58B', id: 'icon_Public-Health', upload: false },
    { isVector: true, className: 'iconpms-icon_Social-security', fontColor: '#BBC58B', id: 'icon_Social-security', upload: false },
    { isVector: true, className: 'iconpms-icon_Disaster-level', fontColor: '#88F8C6', id: 'icon_Disaster-level1', upload: false },
    { isVector: true, className: 'iconpms-icon_Disaster-level', fontColor: '#88DEF8', id: 'icon_Disaster-level2', upload: false },
    { isVector: true, className: 'iconpms-icon_Disaster-level', fontColor: '#FCDC67', id: 'icon_Disaster-level3', upload: false },
    { isVector: true, className: 'iconpms-icon_Disaster-level', fontColor: '#F15424', id: 'icon_Disaster-level4', upload: false }
  ];

  private vectorIcon: Array<any> = [];
  // 显示的图标列表
  public backgroundImgs: Array<any> = [];

  // 当前图片的下标
  currentBackIndex: number = -1;

  // 图片
  imageUrl: string = '';

  // 默认颜色
  defaultColor: any = 'rgba(255,69,0,0.68)';

  // 预定义颜色
  predefineColors: any = ['rgb(235, 247, 255)', '#f56c6c', '#E6A23C', '#ffd700', '#90ee90', '#00ced1', '#B1DCF7', '#c71585'];

  public disableRemoveImg: boolean = true;

  // 级别定义类型
  @Prop() title: any;

  // 查询到的数据
  @Prop() data: any;

  @Prop() showTitle: any;

  @Prop() currentData: any;

  @Watch('data')
  onreadystatechange() {
    if (this.data && Array.isArray(this.data)) {
      this.handData();
    }
  }

  @Watch('searchValue')
  async searchValueChange() {
    if (this.searchValue) {
      const keyword = this.searchValue.replace(/\s*/g, '');
      this.dataArr = this.dataArr.filter((source: any) => source.name.includes(keyword));
    } else {
      const data = await dSourceDataService.queryDDataSource(this.currentData.id);
      if (Array.isArray(data) && data.length > 0) {
        this.dataArr = data;
      }
    }
  }

  // 是否在选在图标
  @Watch('isShowImgBox')
  innerVisiblechange() {
    if (this.isShowImgBox) {
      this.backgroundImgs = [];
      const temp: any = [];
      this.$data._backgroundImgs.forEach((item: any) => {
        const newitem = Object.assign({}, item);
        temp.push(newitem);
      });
      this.backgroundImgs = temp;
    }
  }

  mounted() {
    this.handData();
  }

  handData() {
    this.dataArr = [];
    this.dataArr = this.data;
  }

  onNew() {
    if (this.isEdit) {
      this.$confirm('当前编辑未保存是否离开', { confirmButtonText: '确定', cancelButtonText: '取消' })
        .then(() => {
          this.isEdit = false;
          this.isAdd = false;
          this.currentItem = {};
          this.addModel = {
            name: '',
            image: JSON.stringify({
              isIcon: true,
              iconfont: '',
              iconColor: ''
            }),
            imgColor: ''
          };
        })
        .catch();
    } else {
      this.isAdd = true;
      this.addModel = {
        name: '',
        image: JSON.stringify({
          isIcon: true,
          iconfont: '',
          iconColor: ''
        }),
        imgColor: ''
      };
    }
  }

  // 加载更多事件
  onLoadMore() {
    this.$emit('on-page-increase');
  }

  onEdit(item: any) {
    if ((item.id !== this.currentItem.id && this.isEdit) || this.isAdd) {
      this.$confirm('当前编辑尚未保存,是否离开', { confirmButtonText: '确定', cancelButtonText: '取消' })
        .then(() => {
          this.currentItem = item;
          this.defaultColor = item.imgColor;
          this._beforeEdit = Object.assign({}, item);
          this.isEdit = true;
        })
        .catch();
    } else {
      this.currentItem = item;
      this.defaultColor = item.imgColor;
      this._beforeEdit = Object.assign({}, item);
      this.isEdit = true;
    }
  }

  onDelete(item: any, i: number) {
    this.$confirm('删除不可恢复,是否确认删除', { confirmButtonText: '确定', cancelButtonText: '取消' })
      .then(() => {
        this.$emit('on-delete-item', { item: item, index: i });
      })
      .catch();
  }

  onCloseEdit() {
    this.isEdit = false;
    this.addModel = {
      name: '',
      image: JSON.stringify({
        isIcon: true,
        iconfont: '',
        iconColor: ''
      }),
      imgColor: ''
    };
  }

  onSaveEdit(data: any) {
    this.$emit('on-edit-save', data);
    this.isEdit = false;
  }

  onSaveAdd() {
    if (this.addModel.name.replace(/\s/g, '') === '') {
      this.$message({ message: '名称不能为空', type: 'error' });
      return;
    }
    this.isAdd = false;
    const temp = new DSourceDataModel();
    temp.name = this.addModel.name;
    temp.image = this.addModel.image;
    temp.imgColor = this.addModel.imgColor;
    temp.id = Guid.newGuid();
    temp.pid = '-1';
    temp.dataSourceId = this.currentData ? this.currentData.id : '';
    this.$emit('on-add-item', temp);
  }

  onCloseAdd() {
    this.addModel = { name: '', image: '', imgColor: '' };
    this.isAdd = false;
  }

  // 上传前验证
  beforeAvatarUpload(file: any) {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 <= 0.5;
    if (!isJPG) {
      this.$message.error('上传头像图标只能是JPG或png格式！');
    }
    if (!isLt2M) {
      this.$message.error('上传头像图标大小不能超过50kb！');
    }
    return isJPG && isLt2M;
  }

  // 选择图标
  selectIcon(item: any) {
    this.isShowImgBox = true;
    this.vectorIcon = this.$data._vectorIcon.map((i: any) => {
      const temp = {
        isVector: i.isVector,
        className: i.className,
        fontColor: i.fontColor,
        id: i.id,
        upload: true
      };
      return temp;
    });
    if (item && item.image && item.image.iconfont) {
      const temp = {
        isVector: item.image.isIcon,
        className: item.image.iconfont,
        fontColor: item.image.iconColor,
        id: item.id,
        upload: true
      };
      const index = this.vectorIcon.findIndex((i: any) => i.className === item.image.iconfont);
      if (index >= 0) {
        this.currentBackIndex = index;
      } else {
        this.vectorIcon.push(temp);
        this.currentBackIndex = this.vectorIcon.length - 1;
      }
    } else {
      this.vectorIcon = this.$data._vectorIcon;
      this.currentBackIndex = -1;
    }
    this.disableRemoveImg = this.currentBackIndex === -1;
  }

  // 上传图片
  handleAvatarSuccess(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.raw);
    let imageUrl: any = null;
    reader.onload = (res: any) => {
      imageUrl = res.target.result;
      this.vectorIcon.push({ isVector: false, className: imageUrl, fontColor: '', id: '', upload: true });
      this.currentBackIndex = this.vectorIcon.length - 1;
      this.disableRemoveImg = this.currentBackIndex === -1;
    };
  }

  // 关闭选择图标
  onCancel() {
    this.isShowImgBox = false;
  }

  // 确认选择的图标
  onSavebackground() {
    this.imageUrl = this.vectorIcon[this.currentBackIndex.valueOf()] ? this.vectorIcon[this.currentBackIndex.valueOf()].className : '';
    const isVector = this.vectorIcon[this.currentBackIndex.valueOf()] ? this.vectorIcon[this.currentBackIndex.valueOf()].isVector : false;
    const image = JSON.stringify({
      isIcon: isVector,
      iconfont: this.imageUrl,
      iconColor: isVector
        ? this.vectorIcon[this.currentBackIndex.valueOf()].fontColor
        : this.currentItem.imgColor !== null
        ? this.currentItem.imgColor
        : '#3498db'
    });
    if (!this.isAdd) {
      this.currentItem.image = image;
      this.onSaveEdit(this.currentItem);
    } else {
      this.addModel.image = image;
    }
    this.isShowImgBox = false;
    this.currentBackIndex = -1;
    this.disableRemoveImg = true;
  }

  // 图标列表选择图标
  onImgClick(item: any, key: any) {
    this.currentBackIndex = key;
    this.imageUrl = item.className;
    this.disableRemoveImg = false;
  }

  // 移除用户添加的图片
  removeImg(img: any, index: any) {
    this.imageUrl = '';
    this.vectorIcon.splice(index, 1);
    this.currentBackIndex = -1;
    this.disableRemoveImg = true;
  }

  // 确定选择颜色安
  changeColor(currentColor: any) {
    if (!this.isAdd) {
      this.currentItem.imgColor = currentColor;
      if (!(this.currentItem.image instanceof Object)) {
        this.currentItem.image = JSON.parse(this.currentItem.image.toString());
      }
      if (!this.currentItem.image.isIcon) {
        this.currentItem.image.iconColor = currentColor;
      }
      this.currentItem.image = JSON.stringify(this.currentItem.image);
      this.onSaveEdit(this.currentItem);
    } else {
      this.addModel.imgColor = currentColor;
      this.currentItem.image = JSON.stringify(this.currentItem.image);
      this.onSaveEdit(this.currentItem);
    }
  }

  onRemoveImg() {
    this.imageUrl = '';
    this.currentBackIndex = -1;
    this.disableRemoveImg = this.currentBackIndex === -1;
  }
}
