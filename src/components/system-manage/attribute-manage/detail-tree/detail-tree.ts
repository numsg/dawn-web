import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import Style from './detail-tree.module.scss';
import Html from './detail-tree.html';
import Guid from '@/utils/guid';
import store from '@/store';
import notifyUtil from '@/common/utils/notifyUtil';
import { State } from 'vuex-class';
import DataSource from '@/models/data-source/data-source';
import DetailTreeBlackStyle from './detail-tree.black.module.scss';
@Component({
  template: Html,
  style: Style,
  themes: [{ name: 'white', style: Style }, { name: 'black', style: DetailTreeBlackStyle }],
  name: 'el-detail-tree',
  components: {}
})
export class DetailTreeComponent extends Vue {
  /**
   * 当前点击节点信息
   *
   * @type {*}
   * @memberof DetailTreeComponent
   */
  curData: any;

  // 编辑之前的节点
  beforeEditNode: any;
  @Prop() rolePrivilege: any;

  /**
   * 编辑框绑定值
   *
   * @type {*}
   * @memberof DetailTreeComponent
   */
  inputValue: any = '';

  /**
   * 过滤字符串
   *
   * @type {*}
   * @memberof DetailTreeComponent
   */
  @Prop() filterText: any;

  /**
   * 是否在编辑状态
   *
   * @type {*}
   * @memberof DetailTreeComponent
   */
  editStatus: any = false;

  editor: boolean = false;

  // 显示选择图标的弹框
  isShowImgBox: boolean = false;

  // 默认的矢量图标
  private vectorIcon = [
    { isVector: true, className: 'iconpms-icon_Health', fontColor: '#F2DEC9', id: 'icon_Health', upload: false },
    { isVector: true, className: 'iconpms-icon_Natural-disaster', fontColor: '#8BC1C5', id: 'icon_Natural-disaster', upload: false },
    { isVector: true, className: 'iconpms-icon_Public-Health', fontColor: '#AAC58B', id: 'icon_Public-Health', upload: false },
    { isVector: true, className: 'iconpms-icon_Social-security', fontColor: '#BBC58B', id: 'icon_Social-security', upload: false },
    { isVector: true, className: 'iconpms-icon_Economics', fontColor: '#88F8C6', id: 'icon_Economics', upload: false },
    { isVector: true, className: 'iconpms-icon_influence', fontColor: '#88DEF8', id: 'icon_influence', upload: false },
    { isVector: true, className: 'iconpms-icon_level', fontColor: '#FCDC67', id: 'icon_level', upload: false },
    { isVector: true, className: 'iconpms-icon_Disaster-level', fontColor: '#F15424', id: 'icon_Disaster-level', upload: false },
    { isVector: true, className: 'iconpms-icon_First-order-response', fontColor: '#F15424', id: 'icon_order-response1', upload: false },
    { isVector: true, className: 'iconpms-icon_Two-level-response', fontColor: '#F15424', id: 'icon_order-response2', upload: false },
    { isVector: true, className: 'iconpms-icon_Three-level-response', fontColor: '#F15424', id: 'icon_order-response3', upload: false },
    { isVector: true, className: 'iconpms-icon_Four-leve-response', fontColor: '#F15424', id: 'icon_order-response4', upload: false }
  ];

  // 当前图片的下标
  currentBackIndex: number = 0;

  // 图片
  imageUrl: string = '';

  private _vectorIcon: Array<any> = [];

  public disableRemoveImg: boolean = true;

  // 控制保存编辑按钮
  handleEditSave: boolean = true;

  // 默认颜色
  defaultColor: any = '#EBF7FF';

  // 是否高亮当前节点
  isHighLight: boolean = false;

  text_component: string = '';
  online_component: string = '';

  // 预定义颜色
  predefineColors: any = ['rgb(235, 247, 255)', '#f56c6c', '#E6A23C', '#ffd700', '#90ee90', '#00ced1', '#B1DCF7', '#c71585'];

  /**
   * 添加状态
   *
   * @type {*}
   * @memberof DetailTreeComponent
   */
  addStatus: any = false;

  @Prop() isEdit: any;

  @Prop()
  treeModelList: any;

  @Prop()
  showSearch: any;

  @Prop()
  currentSource!: DataSource;

  @Prop()
  makeNewSource: any;

  // 是否拖拽
  @Prop({
    default: false
  })
  isDrag: any;

  @Prop({
    default: false
  })
  isAttribute: any;

  @Prop({
    default: 0
  })
  currentAnchor!: number;

  @Prop({
    type: Array,
    default: () => []
  })
  externalDataSource!: any[];

  @Watch('filterText')
  onFilterTree(val: any) {
    const tree: any = this.$refs.detailTree;
    tree.filter(val);
  }

  @Watch('makeNewSource')
  onMakeNewSource() {
    this.onMakeNewNode();
  }

  mounted() {
    this._vectorIcon = this.vectorIcon;
    // this.text_component = store.getters.configs.cellTypeConfig.text_component;
    // this.online_component = store.getters.configs.cellTypeConfig.online_component;

    // const nodes = Generate.getChildren(this.treeModelList, []);
    // nodes.forEach((e: any) => {
    //   if (e.label === '' && e.hiddenDelButton) {
    //     nodes.splice(e);
    //   }
    // });

    // this.treeModelList = Generate.generateTree(nodes , '-1');
  }

  /**
   * 搜索树
   *
   * @param {*} value
   * @param {*} data
   * @returns
   * @memberof DetailTreeComponent
   */
  filterTree(value: any, data: any) {
    if (!value) {
      return true;
    }
    return data.label.indexOf(value) !== -1;
  }

  /**
   * 单击node节点事件
   *
   * @param {*} node
   * @param {*} data
   * @returns
   * @memberof DetailTreeComponent
   */
  node_click(node: any, data: any) {
    // 是否有操作数据项的权限
    if (this.rolePrivilege && !this.rolePrivilege.operate) {
      return;
    }
    // node.loading = true;
    if (this.editStatus) {
      return;
    }
    if (!this.handleEditSave) {
      return;
    }
    if (this.curData) {
      this.curData.hidden = true;
    }
    data.hidden = false;
    this.curData = data;
    this.$nextTick(() => {
      this.isHighLight = true;
      const refTree: any = this.$refs.detailTree;
      // refTree.setCurrentKey(data.id);
      refTree.setCurrentKey(node);
    });
    this.beforeEditNode = JSON.parse(JSON.stringify(this.curData));
    data.hiddenDelButton = false;
    this.$emit('node-click', this.treeModelList);
  }

  /**
   * 添加节点
   *
   * @param {*} data
   * @returns
   * @memberof DetailTreeComponent
   */
  append(data: any, node: any) {
    if (this.editStatus) {
      return;
    }
    if (!this.handleEditSave) {
      return;
    }
    if (this.addStatus) {
      return;
    }
    this.curData.hidden = true;
    this.addStatus = true;
    this.editor = false;
    this.handleEditSave = false;
    node.expanded = true;
    this.inputValue = '';
    const temp = data.children.length ? data.children.length + 1 : 1;
    // this.editor = true;
    const newChild = {
      id: Guid.newGuid(),
      label: '',
      hidden: false,
      hiddenDelButton: false,
      hiddenInput: false,
      image: '',
      imgColor: '',
      pid: data.id,
      sort: data.sort + '-' + temp,
      children: []
    };
    setTimeout(() => {
      data.children.push(newChild);
      this.curData = newChild;
      this.$nextTick(() => {
        const $saveInput: any = this.$refs.saveInput;
        $saveInput.$refs.input.focus();
        this.isHighLight = true;
        const refTree: any = this.$refs.detailTree;
        refTree.setCurrentKey(this.curData.id);
      });
    }, 200);

    this.$emit('tree-add-node', true);
  }

  /**
   * 移除节点
   *
   * @param {*} node
   * @param {*} data
   * @returns
   * @memberof DetailTreeComponent
   */
  remove(node: any, data: any) {
    if (this.addStatus) {
      this.$confirm(this.$tc('base_data_manage.give_up_new'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(() => {
          this.handleEditSave = true;
          this.addStatus = false;
          const parent = node.parent;
          const children = parent.data.children || parent.data;
          const index = children.findIndex((d: any) => d.id === data.id);
          children.splice(index, 1);
          this.$emit('tree-add-node', false);
        })
        .catch(() => {});
      return;
    }
    if (this.isEdit) {
      this.$confirm(this.$tc('notice.confirm_delete'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(() => {
          this.$emit('on-delete', data, node);
        })
        .catch(() => {});
      return;
    }
    this.$emit('delete-node', node, data);
  }

  replaceLikeValue() {
    // tslint:disable-next-line: quotemark
    if (this.inputValue.indexOf('"')) {
      this.inputValue = this.inputValue.replace(/\"/g, '');
    }
  }

  /**
   *
   * @param {*} this
   * @param {*} node
   * @param {*} data
   * @returns
   * @memberof DetailTreeComponent
   */
  handleContentInputConfirm(this: any, node: any, data: any) {
    if (!this.addStatus) {
      if (!this.isChangeNode()) {
        this.$emit('tree-add-node', false);
        this.handleEditSave = true;
        data.hiddenInput = true;
        this.editor = false;
        return;
      }
    }
    // this.editor = false;
    this.editStatus = true;
    if (this.inputValue.replace(/\s/g, '') === '') {
      this.$nextTick(() => {
        if (this.$refs) {
          const $saveInput: any = this.$refs.saveInput;
          const styles: any = Style;
          if ($saveInput) {
            $saveInput.$refs.input.className = $saveInput.$refs.input.className + ' ' + styles.focusInput;
            $saveInput.$refs.input.focus();
          } else {
            this.editStatus = false;
          }
        }
      });
      return;
    }
    node.data.hiddenInput = true;
    node.data.label = this.inputValue;
    this.inputValue = '';
    this.editStatus = false;
    this.handleEditSave = true;
    // 新增和编辑状态的判断有问题<先编辑在新增,增加状态没有改变>
    this.$emit('tree-add-node', false);
    if (this.editor) {
      this.curData.image = this.curData.image ? JSON.stringify(this.curData.image) : '';
      this.$emit('on-edit', data, this.beforeEditNode);
      setTimeout(() => {
        this.curData.hidden = true;
        this.curData.image = this.curData.image && JSON.parse(this.curData.image);
      }, 300);
      this.editor = false;
      return;
    }
    if (this.addStatus) {
      this.$emit('on-add', data, node);
      data.hidden = true;
      this.addStatus = false;
    }
    this.$emit('confirm-input', this.treeModelList);
  }

  cancelEdit(node: any, data: any) {
    this.editor = false;
    data.hiddenInput = true;
    this.handleEditSave = true;
    this.$emit('tree-add-node', false);
  }

  isChangeNode() {
    let change = false;
    if (this.curData.label !== this.inputValue) {
      change = true;
    }
    return change;
  }

  /**
   * 进入编辑状态
   *
   * @param {*} node
   * @param {*} data
   * @returns
   * @memberof DetailTreeComponent
   */
  showInput(node: any, data: any, isEdit: any) {
    if (this.isDrag) {
      return;
    }
    if (this.rolePrivilege && !this.rolePrivilege.operate) {
      return;
    }
    if (!this.handleEditSave) {
      return;
    }
    if (data.label === this.$tc('cell_type.outline_type')) {
      return;
    }
    this.beforeEditNode = JSON.parse(JSON.stringify(this.curData));
    this.editor = isEdit;
    node.data.hiddenInput = false;
    this.$emit('tree-add-node', true);
    this.$nextTick(() => {
      this.inputValue = node.data.label;
      const $saveInput: any = this.$refs.saveInput;
      $saveInput.$refs.input.focus();
    });
    this.handleEditSave = false;
  }

  onfocus(node: any, data: any) {
    this.$nextTick(() => {
      const $saveInput: any = this.$refs.saveInput;
      const styles: any = Style;
      if (node.data.label === '') {
        $saveInput.$refs.input.className = $saveInput.$refs.input.className + ' ' + styles.focusInput;
      }
    });
  }

  // 添加一级菜单
  onMakeNewNode() {
    if (this.addStatus) {
      return;
    }
    if (this.curData) {
      this.curData.hidden = true;
      this.curData.hiddenInput = true;
    }
    this.handleEditSave = false;
    this.addStatus = true;
    this.editStatus = false;
    this.editor = false;
    // console.log(this.externalDataSource);
    // console.log(this.externalDataSource.map(e => e.id));
    const isUseResourceServer = this.externalDataSource.map(e => e.id).includes(this.currentSource.id);
    const newChild = {
      id: Guid.newGuid(),
      label: '',
      hidden: false,
      hiddenDelButton: false,
      hiddenInput: false,
      pid: isUseResourceServer ? this.currentSource.originalId : '-1',
      children: [],
      image: '',
      sort: this.treeModelList.length ? this.treeModelList.length + 1 : 1,
      imgColor: null
    };
    this.treeModelList.push(newChild);
    this.$nextTick(() => {
      const $saveInput: any = this.$refs.saveInput;
      $saveInput.$refs.input.focus();
      const refTree: any = this.$refs.detailTree;
      refTree.setCurrentKey(newChild.id);
    });
    this.addStatus = true;
  }

  // 上传前验证
  beforeAvatarUpload(file: any) {}

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
      this.disableRemoveImg = this.currentBackIndex === -1;
    };
  }

  // 选择图标
  selectIcon(item: any) {
    this.isShowImgBox = true;
    this.vectorIcon = this._vectorIcon;
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
      this.vectorIcon = this._vectorIcon;
      this.currentBackIndex = -1;
    }
    this.disableRemoveImg = this.currentBackIndex === -1;
  }

  // 图标列表选择图标
  onImgClick(item: any, key: any) {
    this.currentBackIndex = key;
    this.imageUrl = item.className;
    this.disableRemoveImg = false;
  }

  // 关闭选择图标
  onRemoveImg() {
    this.imageUrl = '';
    this.currentBackIndex = -1;
  }

  // 确认选择的图标
  onSavebackground() {
    this.imageUrl = this.vectorIcon[this.currentBackIndex.valueOf()] ? this.vectorIcon[this.currentBackIndex.valueOf()].className : '';
    const iconColor = this.vectorIcon[this.currentBackIndex.valueOf()] ? this.vectorIcon[this.currentBackIndex.valueOf()].fontColor : '';
    const isVector = this.vectorIcon[this.currentBackIndex.valueOf()] ? this.vectorIcon[this.currentBackIndex.valueOf()].isVector : false;
    // this.curData.imgColor = iconColor;
    this.curData.image = {
      isIcon: isVector,
      iconfont: this.imageUrl,
      iconColor: iconColor
    };
    // const image = {
    //   isIcon: isVector,
    //   iconfont: this.imageUrl,
    //   iconColor: iconColor
    // };
    this.curData.image = this.curData.image ? JSON.stringify(this.curData.image) : '';
    this.$emit('on-edit', this.curData, this.beforeEditNode);
    this.curData.hiddenInput = true;
    this.handleEditSave = true;
    this.editor = false;
    setTimeout(() => {
      this.curData.image = this.curData.image && JSON.parse(this.curData.image);
    }, 300);
    this.$emit('confirm-input', this.treeModelList);
    this.isShowImgBox = false;
    this.$emit('tree-add-node', false);
  }

  // 移除用户添加的图片
  removeImg(img: any, index: any) {
    this.imageUrl = '';
    this.vectorIcon.splice(index, 1);
    this.currentBackIndex = -1;
    this.disableRemoveImg = true;
  }
  onCancel() {
    this.isShowImgBox = false;
    this.currentBackIndex = -1;
    this.disableRemoveImg = this.currentBackIndex === -1;
  }

  // 确定选择颜色安
  changeColor(currentColor: any) {
    if (currentColor === null) {
      this.curData.imgColor = '';
    } else {
      this.curData.imgColor = currentColor;
    }
    this.curData.image = this.curData.image ? JSON.stringify(this.curData.image) : '';
    this.$emit('on-edit', this.curData, this.beforeEditNode);
    this.curData.hiddenInput = true;
    this.handleEditSave = true;
    this.editor = false;
    setTimeout(() => {
      this.curData.image = this.curData.image && JSON.parse(this.curData.image);
    }, 300);
    this.$emit('edit-node', this.curData, this.treeModelList);
    this.$emit('tree-add-node', false);
  }

  // 滚动之前去除当前节点属性
  beforeDestroy() {
    if (this.curData !== undefined) {
      this.curData.hidden = true;
    }
  }

  saveDragSort(dataArr: any) {
    const isUseResourceServer = this.externalDataSource.map(e => e.id).includes(this.currentSource.id);
    const temp = this.setSort(dataArr, 0, isUseResourceServer ? this.currentSource.originalId : -1);
    this.$emit('on-sort-item', temp);
  }

  setSort(dataArr: any, sort: any, pid: any) {
    let i = 1;
    dataArr.forEach((data: any) => {
      data.pid = pid;
      if (sort === 0) {
        data.sort = i;
      } else {
        data.sort = sort + '-' + i;
      }
      if (data.children !== null && data.children.length > 0) {
        this.setSort(data.children, data.sort, data.id);
      }
      i++;
    });
    return dataArr;
  }

  cancelDragSort() {
    this.$emit('on-cancel-sort');
    // console.log(this.currentSource)
    // this.treeModelList =
  }

  /**
   * 拖拽时判断目标节点能否被放置
   *
   * @param {*} draggingNode  拖拽的节点
   * @param {*} dropNode  目标节点
   * @param {*} type 类型 prev:目标节点前 inner：插入    next ：目标节点后
   * @memberof DetailTreeComponent
   */
  allowDrop(draggingNode: any, dropNode: any, type: any) {
    if (dropNode.data.id === this.online_component || dropNode.data.id === this.text_component) {
      //  this.$message({ message: this.$tc('base_data_manage.no_drag'), type: 'warning', center: true });
      return false;
    } else {
      return true;
    }
  }

  /**
   * 判断节点是否可以被拖拽
   *
   * @param {*} draggingNode
   * @memberof DetailTreeComponent
   */
  allowDrag(draggingNode: any) {
    if (draggingNode.data.id === this.online_component || draggingNode.data.id === this.text_component) {
      // this.$message({ message: this.$tc('base_data_manage.no_drag'), type: 'warning', center: true });
      notifyUtil.warning(this.$tc('base_data_manage.no_drag'));
      return false;
    } else {
      return true;
    }
  }
}
