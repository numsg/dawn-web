import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from './d-data-source-tiled.html';
import Styles from './d-data-source-tiled.module.scss';
import DSourceDataModel from '@/models/data-source/d-source-data';
import Guid from '@/utils/guid';
import notifyUtil from '@/common/utils/notifyUtil';
import draggable from 'vuedraggable';
import tiledBlackStyle from './d-data-source-tiled.black.module.scss';
import tiledStyle from './d-data-source-tiled.module.scss';
import i18n from '@/i18n';
@Component({
  template: Html,
  style: Styles,
  themes: [{ name: 'white', style: tiledStyle }, { name: 'black', style: tiledBlackStyle }],
  name: 'd-data-source-tiled',
  components: {
    draggable: draggable
  }
})
export class DDataSourceTiledComponent extends Vue {
  public dataArr: Array<any> = [];
  public isEdit: boolean = false;
  public currentItem: any = {};
  public isAdd: boolean = false;

  // 是否拖拽
  public isDrag: boolean = false;

  public dragTitile: string = i18n.t('data_source.drag_sort').toString();

  public addModel = {
    name: '',
    image: JSON.stringify({
      isIcon: true,
      iconfont: 'iconfont iconpms-icon_Event-type',
      iconColor: ''
    }),
    imgColor: ''
  };

  @Prop() rolePrivilege: any;

  private _beforeEdit: any = {};

  public searchValue: string = '';

  // 显示选择图标的弹框
  isShowImgBox: boolean = false;

  // 过滤结果是否为空
  isSearchNull: boolean = false;

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
    { isVector: true, className: 'iconpms-icon_Economics', fontColor: '#88F8C6', id: 'icon_Disaster-level1', upload: false },
    { isVector: true, className: 'iconpms-icon_influence', fontColor: '#88DEF8', id: 'icon_Disaster-level2', upload: false },
    { isVector: true, className: 'iconpms-icon_level', fontColor: '#FCDC67', id: 'icon_Disaster-level3', upload: false },
    { isVector: true, className: 'iconpms-icon_Disaster-level', fontColor: '#F15424', id: 'icon_Disaster-level4', upload: false },
    { isVector: true, className: 'iconpms-icon_First-order-response', fontColor: '#F15424', id: 'icon_order-response1', upload: false },
    { isVector: true, className: 'iconpms-icon_Two-level-response', fontColor: '#F15424', id: 'icon_order-response2', upload: false },
    { isVector: true, className: 'iconpms-icon_Three-level-response', fontColor: '#F15424', id: 'icon_order-response3', upload: false },
    { isVector: true, className: 'iconpms-icon_Four-leve-response', fontColor: '#F15424', id: 'icon_order-response4', upload: false }
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

  @Watch('isDrag')
  convertDragTitle() {
    if (this.isDrag) {
      this.dragTitile = this.$tc('data_source.cancel_drag');
    } else {
      this.dragTitile = this.$tc('data_source.drag_sort');
    }
  }

  @Watch('searchValue')
  async searchValueChange() {
    if (this.searchValue) {
      const keyword = this.searchValue.replace(/\s*/g, '');
      this.dataArr = this.data.filter((source: any) => source.name.includes(keyword));
      if (this.dataArr.length === 0) {
        this.isSearchNull = true;
      }
    } else {
      this.dataArr = this.data;
      this.isSearchNull = false;
    }
    this.$emit('on-search-null', this.isSearchNull);
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
      this.$confirm(this.$tc('base_data_manage.edit_confirm_leave'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(() => {
          this.isEdit = false;
          this.isAdd = true;
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
        .catch(() => { });
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
    if (this.isAdd) {
      notifyUtil.info(this.$tc('base_data_manage.cancel_edit'));
      return;
    }
    if (item.id !== this.currentItem.id && this.isEdit) {
      this.$confirm(this.$tc('share.confirm_leave_now_edit'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(() => {
          this.currentItem = item;
          this._beforeEdit = JSON.parse(JSON.stringify(item));
          this.defaultColor = item.imgColor;
          this._beforeEdit = Object.assign({}, item);
          this.isEdit = true;
        })
        .catch(() => { });
    } else {
      this.currentItem = item;
      this.defaultColor = item.imgColor;
      this._beforeEdit = Object.assign({}, item);
      this.isEdit = true;
    }
  }

  onDelete(item: any, i: number) {
    if (this.isAdd) {
      notifyUtil.info(this.$tc('base_data_manage.cancel_edit'));
      return;
    }
    this.$confirm(this.$tc('share.confirm_delete'), {
      confirmButtonText: this.$tc('common.determine'),
      cancelButtonText: this.$tc('common.cancel'),
      type: 'warning',
      title: this.$tc('common.prompt'),
      showClose: false
    })
      .then(() => {
        this.$emit('on-delete-item', { item, index: i, dataType: this.currentData, duration: 1000 });
      })
      .catch(() => { });
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
    if (!data.name) {
      notifyUtil.error(this.$tc('resource-manage.name_not_null'));
      return;
    }
    if (!this.isChangeNode()) {
      this.isEdit = false;
      return;
    }
    this.currentItem.image = JSON.stringify(this.currentItem.image);
    this.$emit('on-edit-save', data, this._beforeEdit);
    setTimeout(() => {
      this.currentItem.image = JSON.parse(this.currentItem.image);
    }, 300);
    this.isEdit = false;
  }

  isChangeNode() {
    let change = false;
    Object.keys(this.currentItem).forEach((element: any) => {
      if (this.currentItem[element] !== this._beforeEdit[element]) {
        change = true;
      }
    });
    return change;
  }

  onSaveAdd() {
    if (this.addModel.name.replace(/\s/g, '') === '') {
      notifyUtil.error(this.$tc('resource-manage.name_not_null'));
      return;
    }
    this.isAdd = false;
    const temp = new DSourceDataModel();
    temp.name = this.addModel.name;
    temp.image = JSON.stringify(this.addModel.image);
    temp.imgColor = this.addModel.imgColor;
    temp.id = Guid.newGuid();
    temp.pid = '-1';
    temp.sort = this.dataArr.length.toString();

    temp.dataSourceId = this.currentData ? this.currentData.id : '';
    this.$emit('on-add-item', temp);
    this.currentItem = temp;
    setTimeout(() => {
      if (this.currentItem.image) {
        this.currentItem.image = JSON.parse(this.currentItem.image);
      }
    }, 400);
  }

  onCloseAdd() {
    this.addModel = { name: '', image: '', imgColor: '' };
    this.isAdd = false;
  }

  // 上传前验证
  beforeAvatarUpload(file: any) { }

  // 选择颜色
  activeColor(currentColor: any) {
    // console.log(currentColor);
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
    if (this.currentBackIndex === -1) {
      this.disableRemoveImg = true;
    }
    this.disableRemoveImg = false;
  }

  // 上传图片
  handleAvatarSuccess(event: any) {
    const filesExgep: RegExp = /(jpg|png|jpeg)/;
    const name: any = event.raw.name.split('.')[event.raw.name.split('.').length - 1];
    const flag = filesExgep.test(name.toLowerCase());
    const isJPG = event.raw.type === 'image/jpeg' || event.raw.type === 'image/png';
    const isLt2M = event.raw.size / 1024 / 1024 <= 0.5;
    if (!flag || !isJPG) {
      notifyUtil.error(this.$tc('common.upload_image_format'));
      return;
    }
    if (!isLt2M) {
      notifyUtil.error(this.$tc('common.upload_image_size'));
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.raw);
    let imageUrl: any = null;
    reader.onload = (res: any) => {
      imageUrl = res.target.result;
      this.vectorIcon.push({ isVector: false, className: imageUrl, fontColor: '', id: '', upload: true });
      this.currentBackIndex = this.vectorIcon.length - 1;
      if (this.currentBackIndex === -1) {
        this.disableRemoveImg = true;
      }
      this.disableRemoveImg = false;
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
    const image: any = {
      isIcon: isVector,
      iconfont: this.imageUrl,
      iconColor: isVector
        ? this.vectorIcon[this.currentBackIndex.valueOf()].fontColor
        : this.currentItem.imgColor !== null
          ? this.currentItem.imgColor
          : '#3498db'
    };
    if (!this.isAdd) {
      this.currentItem.image = image;
      this.onSaveEdit(this.currentItem);
    } else {
      // this.addModel.image = JSON.stringify(image);
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

  // 确定选择颜色
  changeColor(currentColor: any) {
    if (!this.isAdd) {
      this.currentItem.imgColor = currentColor ? currentColor : '';
      if (this.currentItem.image && !(this.currentItem.image instanceof Object)) {
        this.currentItem.image = JSON.parse(this.currentItem.image.toString());
      }
      if (this.currentItem.image && !this.currentItem.image.isIcon) {
        this.currentItem.image.iconColor = currentColor ? currentColor : '';
      }
      this.onSaveEdit(this.currentItem);
    } else {
      this.addModel.imgColor = currentColor ? currentColor : '';
      this.currentItem.image = JSON.stringify(this.currentItem.image);
      this.onSaveAdd();
    }
  }

  onRemoveImg() {
    this.imageUrl = '';
    this.currentBackIndex = -1;
    if (this.currentBackIndex === -1) {
      this.disableRemoveImg = true;
    }
    this.disableRemoveImg = false;
  }

  change(event: any) {
    //  const newIndex = event.moved.newIndex;  // 移动位置的下标
    ///  const oldIndex = event.moved.oldIndex; // 原位置的下标
    // this.dataArr 的顺序已发生变化
    // if (newIndex >= oldIndex) {
    //   for (let i = oldIndex; i <= newIndex; i++) {
    //       this.dataArr[i].sort = i ;
    //   }
    // }
  }

  drag() {
    if (this.isDrag) {
      this.$confirm(this.$tc('base_data_manage.confirm_leave_no_save'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(() => {
          this.isDrag = false;
          this.cancelDragSort();
          this._beforeEdit = {};
        })
        .catch(() => { });
      return;
    } else {
      this.isDrag = true;
      this._beforeEdit = this.dataArr;
      return;
    }
  }

  saveDragSort() {
    for (let i = 0; i < this.dataArr.length; i++) {
      this.dataArr[i].image = JSON.stringify(this.dataArr[i].image);
      this.dataArr[i].sort = i + '';
    }
    this.$emit('on-sort-item', this.dataArr);
    this.isDrag = false;
  }

  cancelDragSort() {
    this.isDrag = false;
    this.dataArr = this._beforeEdit;
  }
}
