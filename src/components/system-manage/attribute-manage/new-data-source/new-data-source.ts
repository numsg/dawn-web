import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Guid from '@/utils/guid';
import Styles from './new-data-source.module.scss';
import Html from './new-data-source.html';

import DataSource from '@/models/data-source/data-source';
import DSourceDataModel from '@/models/data-source/d-source-data';
import DataSourceCorrelation from '@/models/data-source/data-source-correlation';
import dataSourceService from '@/api/data-source/data-source.service';

import { DDataSourceTiledComponent } from '@/components/system-manage/attribute-manage/d-data-source-tiled/d-data-source-tiled';

import { DetailTreeComponent } from '@/components/system-manage/attribute-manage/detail-tree/detail-tree';
// import notifyUtil from '@/common/utils/notifyUtil';
import Config from '@/utils/config-decorator';
import externalResourceService from '@/api/external-resource/external-resource.service';
import * as R from 'ramda';
import EventNames from '@/common/events/store-events';
import sourceBlackStyle from './new-data-source.black.module.scss';
import i18n from '@/i18n';
import notifyUtil from '@/common/utils/notifyUtil';

@Component({
  template: Html,
  style: Styles,
  themes: [{ name: 'white', style: Styles }, { name: 'black', style: sourceBlackStyle }],
  name: 'new-data-source',
  components: {
    'el-detail-tree': DetailTreeComponent,
    'd-data-source-tiled': DDataSourceTiledComponent
  }
})
export class NewDataSourceComponent extends Vue {
  dialogVisible: boolean = false;

  @Prop()
  headerTitle: any;

  @Prop()
  addDataSourceVisible: any;

  /**
   * 编辑状态
   *
   * @type {*}
   * @memberof NewDataSourceComponent
   */
  @Prop()
  isEdit: any;

  @Prop()
  sourceModel: any;

  @Prop()
  editData: any;
  @Prop()
  editDData: any;

  isAdd: boolean = false;

  isCompletedAdd: boolean = true;

  /**
   * 新增数据源
   *
   * @type {DataSource}
   * @memberof NewDataSourceComponent
   */
  public newDataSource: DataSource = new DataSource();

  tabposition: string = 'left';

  // 树形或者列表
  structure: any = '1';
  // 上传或者默认
  imgType: string = '1';

  currentStep: string = 'select_data_structure';

  // 是否是新增数据源
  isAttribute: boolean = true;

  /**
   * 是否新增tag
   *
   * @type {Boolean}
   * @memberof NewDataSourceComponent
   */
  isAddtag: boolean = false;

  /**
   * new tag model
   *
   * @type {DataSourceCorrelation}
   * @memberof NewDataSourceComponent
   */
  newTagModel: DataSourceCorrelation = new DataSourceCorrelation();

  /**
   * tags
   *
   * @type {Array<DataSourceCorrelation>}
   * @memberof NewDataSourceComponent
   */
  tags: Array<DataSourceCorrelation> = [];

  /**
   * 可以保存
   *
   * @type {Boolean}
   * @memberof NewDataSourceComponent
   */
  public canSave: boolean = false;

  public images = {
    singleStage: require('@/assets/img/data-source/single-stage.png'),
    treeStage: require('@/assets/img/data-source/tree-stage.png')
  };
  private _backgroundImgs = [
    { url: require('@/assets/img/data-source/handle-stage-define.png'), id: 'handleStage', upload: false },
    { url: require('@/assets/img/data-source/handle-main-point.png'), id: 'handleMainPoint', upload: false },
    { url: require('@/assets/img/data-source/event-classification.png'), id: 'eventClassification', upload: false },
    { url: require('@/assets/img/data-source/response-level.png'), id: 'responseLevel', upload: false },
    { url: require('@/assets/img/data-source/plan-classification.png'), id: 'planClassification', upload: false },
    { url: require('@/assets/img/data-source/disaster-level.png'), id: 'disasterLevel', upload: false },
    { url: require('@/assets/img/data-source/disaster-loss.png'), id: 'disasterLoss', upload: false }
  ];
  public backgroundImgs: Array<any> = [];
  temp = {
    url: require('@/assets/img/data-source/source-default.png')
  };

  rules = {
    name: [
      { required: true, message: i18n.t('data_source.data_source_name_null'), tigger: 'blur' },
      { min: 1, max: 512, message: i18n.t('common.length_limit128'), tigger: 'blur' }
    ],
    description: [{ max: 2000, message: i18n.t('common.description_length_under_2000'), tigger: 'blur' }]
  };

  imageUrl: string = '';

  innerVisible: boolean = false;
  currentBackIndex: number = 0;
  treeModel: any = JSON.parse(
    JSON.stringify([
      {
        id: Guid.newGuid(),
        pid: '-1',
        label: i18n.t('data_source.attribute_name'),
        image: '',
        imgColor: '',
        children: [],
        hidden: true,
        hiddenDelButton: true,
        hiddenInput: true,
        topNode: true
      }
    ])
  );

  // @Config('rmsConfig.useResourceServer')
  useResourceServer: boolean = false;

  @Config('resourceDataSourceIds')
  resourceDataSourceIds!: any;

  /**
   * 列表数据源数据
   *
   * @type {Array<DSourceDataModel>}
   * @memberof NewDataSourceComponent
   */
  public tiledArray: Array<DSourceDataModel> = [];

  @Watch('isEdit')
  onIsEdit() {}

  @Watch('addDataSourceVisible')
  visibleChange() {
    this.dialogVisible = this.addDataSourceVisible;
    this.structure = '1';
    if (this.addDataSourceVisible && this.editData) {
      const data = Object.assign({}, this.editData);
      this.tags = data.tags;
    } else {
      this.tags = [];
      this.newDataSource = Object.assign({}, this.editData);
    }
  }

  @Watch('editData')
  editDataChange() {
    if (this.isEdit) {
      this.newDataSource = Object.assign({}, this.editData);
      this.imageUrl = this.newDataSource.image ? this.newDataSource.image : '';
      this.tags = Object.assign({}, this.editData).tags;
      this.currentStep = 'new_data_source';
    } else {
      this.newDataSource = new DataSource();
      this.imageUrl = '';
      this.currentStep = 'select_data_structure';
      this.tags = [];
    }
  }

  @Watch('innerVisible')
  innerVisiblechange() {
    if (this.innerVisible) {
      this.backgroundImgs = [];
      const temp: any = [];
      this.$data._backgroundImgs.forEach((item: any) => {
        const newitem = Object.assign({}, item);
        temp.push(newitem);
      });
      this.backgroundImgs = temp;
    }
  }

  replaceLikeValue() {
    // tslint:disable-next-line: quotemark
    if (this.newDataSource.name.indexOf('"')) {
      this.newDataSource.name = this.newDataSource.name.replace(/\"/g, '');
    }
  }

  /**
   * 下一步
   *
   * @memberof NewDataSourceComponent
   */
  onNextStep() {
    this.currentStep = 'new_data_source';
  }

  /**
   * 返回
   *
   * @memberof NewDataSourceComponent
   */
  onBack() {
    this.currentStep = 'select_data_structure';
  }

  /**
   * 上传图片
   *
   * @param {*} event
   * @memberof NewDataSourceComponent
   */
  handleAvatarSuccess(event: any) {
    const filesExgep: RegExp = /(jpg|png|jpeg)/;
    const isJPG = event.raw.type === 'image/jpeg' || event.raw.type === 'image/png';
    const isLt2M = event.raw.size / 1024 / 1024 <= 2;
    const name: any = event.raw.name.split('.')[event.raw.name.split('.').length - 1];
    const flag = filesExgep.test(name.toLowerCase());
    if (!flag || !isJPG) {
      notifyUtil.error(this.$tc('common.upload_image_format'));
      return;
    }
    if (!isLt2M) {
      notifyUtil.error(this.$tc('common.upload_image_size'));
      return;
    }
    this.imageUrl = '';
    const reader = new FileReader();
    reader.readAsDataURL(event.raw);
    reader.onload = (res: any) => {
      const url = res.target.result.substring(res.target.result.indexOf(',') + 1);
      const temp = { url: url, name: '', id: '', upload: true };
      this.backgroundImgs.push(temp);
      this.imageUrl = url;
    };
  }
  beforeAvatarUpload(file: any) {
    console.log(file);
  }

  /**
   * 移除图片
   *
   * @memberof NewDataSourceComponent
   */
  removeImg(img: any, index: any) {
    this.imageUrl = '';
    this.newDataSource.image = '';
    this.backgroundImgs.splice(index, 1);
  }

  /**
   * 新增一个树形数据源数据
   *
   * @param {*} data
   * @memberof NewDataSourceComponent
   */
  confirmInput(data: any) {
    // const temp = Object.assign({}, data[0]);
    const temp = JSON.parse(JSON.stringify(data[0]));
    this.treeModel = [temp];
  }

  deleteNode(node: any, data: any) {
    this.$confirm(this.$tc('common.confirm_delete'), {
      confirmButtonText: this.$tc('common.determine'),
      cancelButtonText: this.$tc('common.cancel'),
      type: 'warning',
      title: this.$tc('common.prompt'),
      showClose: false
    })
      .then(() => {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex((d: any) => d.id === data.id);
        children.splice(index, 1);
      })
      .catch(() => {});
  }

  // 新增属性-编辑节点
  editNode(data: any, treeModel: any) {}

  /**
   * new tag
   *
   * @memberof NewDataSourceComponent
   */
  onNewTag() {
    this.isAddtag = true;
  }

  /**
   * close new tag
   *
   * @memberof NewDataSourceComponent
   */
  onCloseAddTag() {
    this.newTagModel = new DataSourceCorrelation();
    this.isAddtag = false;
  }

  /**
   * save new tag
   *
   * @memberof NewDataSourceComponent
   */
  onSaveAddTag() {
    if (this.newTagModel.name.replace(/\s/g, '') === '') {
      this.$message({ message: this.$tc('share.tag_no_null'), type: 'warning' });
      return;
    }

    const repeatname = this.tags.findIndex((t: any) => t.name.replace(/\s/g, '') === this.newTagModel.name.replace(/\s/g, '')) >= 0;

    if (repeatname) {
      this.$message({ message: this.$tc('share.tag_no_repeat'), type: 'warning' });
      return;
    }

    const newTag = Object.assign({}, this.newTagModel);
    // newTag.id = Guid.newGuid();
    this.tags.push(newTag);
    this.newTagModel = new DataSourceCorrelation();
    this.isAddtag = false;
  }

  /**
   * delete tag item;
   *
   * @param {number} i
   * @memberof NewDataSourceComponent
   */
  deleteTagItem(i: number) {
    this.tags.splice(i, 1);
  }

  // edit tag
  editTagItem(tag: any) {
    console.log(tag);
  }

  /**
   * save new or edit data source
   *
   * @memberof NewDataSourceComponent
   */
  async onSaveNewDataSource() {
    const form: any = this.$refs['newDataSource'];
    form.validate(async (valid: any, object: any) => {
      if (valid) {
        // 校验通过, 名称不能重复
        this.isAdd = true;
        const allSource = await this.queryDataSource();
        let repeat = false;
        const index = allSource.findIndex((s: any) => s.name.replace(/\s/g, '') === this.newDataSource.name.replace(/\s/g, ''));
        repeat = index >= 0;
        if (repeat && allSource[index].id !== this.newDataSource.id) {
          // LimitMessage.showMessage({ type: 'warning', message: this.$tc('data_source.data_source_name_repeat') });
          notifyUtil.warning(this.$tc('data_source.data_source_name_repeat'));
          return;
        }
        // 执行保存
        if (this.imageUrl === '') {
          const imgTarget: any = this.$refs.defaultBackground;
          const imgType = imgTarget.src.substr(imgTarget.src.lastIndexOf('.') + 1, imgTarget.src.length - 1);
          const url = this.getBase64(imgTarget, imgType);
          this.imageUrl = url.substring(url.indexOf(',') + 1);
        }
        const param: DataSource = new DataSource();
        param.id = this.newDataSource.id;
        param.image = this.imageUrl;
        param.name = this.newDataSource.name;
        param.tag = JSON.stringify(this.tags);
        // tslint:disable-next-line:quotemark
        param.tag = param.tag.replace(/\"/g, "'");
        param.type = this.newDataSource.type !== 0 ? this.newDataSource.type : this.structure === '1' ? 1 : 2;
        param.description = this.newDataSource.description;
        param.originalId = this.newDataSource.originalId;
        const data = dataSourceService.treeToTiledArr([], this.treeModel);
        if (param.type === 1 && data.length > 0) {
          const dsourceData = data.map(item => {
            const newDsource = new DSourceDataModel();
            newDsource.id = item.id;
            newDsource.pid = item.pid;
            newDsource.name = item.label;
            newDsource.image = JSON.stringify(item.image);
            newDsource.imgColor = item.imgColor;
            newDsource.dataSourceId = '';
            return newDsource;
          });
          param.dSourceDataModels = dsourceData;
          this.treeModel = JSON.parse(
            JSON.stringify([
              {
                id: Guid.newGuid(),
                pid: '-1',
                label: i18n.t('data_source.attribute_name'),
                image: '',
                imgColor: '',
                children: [],
                hidden: true,
                hiddenDelButton: true,
                hiddenInput: true,
                topNode: true
              }
            ])
          );
        } else if (param.type === 2) {
          param.dSourceDataModels = this.tiledArray;
          this.tiledArray = [];
        }
        const router: any = this.$router.currentRoute;
        const user: any = sessionStorage.getItem('userInfo');
        if (this.isCompletedAdd) {
          this.isCompletedAdd = false;
          if (!this.isEdit) {
            const addResult = await dataSourceService.addDataSource(param);
            if (addResult) {
              this.$store.dispatch(EventNames.SystemLog.HandleDataAdd, {
                router: router,
                user: user,
                data: addResult,
                state: 'system_log.state_success',
                dataType: 'data_source'
              });
              this.isAdd = false;
              notifyUtil.success(this.$tc('data_source.add_data_source_success'));
              this.isCompletedAdd = true;
              this.$emit('on-success', addResult);
              this.$emit('on-close-new-dialog');
            } else {
              notifyUtil.error(this.$tc('data_source.add_data_source_error'));
              this.isCompletedAdd = true;
            }
          }
          if (this.isEdit) {
            const editResult = await this.modifyDataSource(param);
            if (editResult) {
              this.$store.dispatch(EventNames.SystemLog.HandleDataEdit, {
                router: router,
                user: user,
                data: param,
                dataType: 'data_source',
                state: 'system_log.state_success'
              });
              this.isAdd = false;
              notifyUtil.success(this.$tc('data_source.update_data_source_success'));
              this.isCompletedAdd = true;
              this.$emit('on-success', editResult);
              this.$emit('on-close-new-dialog');
            } else {
              this.isCompletedAdd = true;
              notifyUtil.error(this.$tc('data_source.update_data_source_error'));
            }
          }
        }
      } else {
        // 校验失败
        return;
      }
    });
  }

  /**
   * new data source add data source data
   *
   * @param {*} dItem
   * @memberof NewDataSourceComponent
   */
  onAddDDataSource(dItem: any) {
    const temp = new DSourceDataModel();
    temp.id = Guid.newGuid();
    temp.pid = '-1';
    temp.name = dItem.name;
    temp.dataSourceId = '';
    this.tiledArray.push(temp);
  }

  /**
   * 移除新增的数据源数据
   *
   * @param {*} item
   * @param {number} i
   * @memberof NewDataSourceComponent
   */
  onDelDDataSource(item: any, i: number) {
    this.tiledArray.splice(i, 1);
  }

  /**
   * 点击关闭新增弹窗
   *
   * @param {*} done
   * @memberof NewDataSourceComponent
   */
  onCloseDialog(done: any) {
    console.log(this.editData, this.newDataSource);

    this.tags = [];
    this.newDataSource = Object.assign({}, this.editData);
    done();
    this.$emit('on-close-new-dialog');
  }

  /**
   * 点击图片选择背景图片
   *
   * @param {*} img
   * @param {*} index
   * @memberof NewDataSourceComponent
   */
  onImgClick(img: any, index: any) {
    this.currentBackIndex = index;
    if (!img.upload) {
      img.upload = true;
      const imgTarget: any = document.querySelector('#img_target' + index);
      const imgType = img.url.substr(img.url.lastIndexOf('.') + 1, img.url.length - 1);
      const url = this.getBase64(imgTarget, imgType);
      this.imageUrl = img.url = url.substring(url.indexOf(',') + 1);
    } else {
      this.imageUrl = img.url.substring(img.url.indexOf(',') + 1);
    }
  }

  private getBase64(target: any, type: any) {
    const canvas: any = document.createElement('canvas');
    const ctx: any = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 656;
    ctx.drawImage(target, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/' + type);
    return dataUrl;
  }

  outsideClose() {
    this.dialogVisible = false;
    this.$emit('on-close-new-dialog');
  }

  /**
   * 确认选择图片
   *
   * @memberof NewDataSourceComponent
   */
  onSavebackground() {
    if (this.imageUrl === '') {
      const imgTarget: any = document.querySelector('#img_target' + this.currentBackIndex);
      const imgType = imgTarget.src.substr(imgTarget.src.lastIndexOf('.') + 1, imgTarget.src.length - 1);
      const url = this.getBase64(imgTarget, imgType);
      this.imageUrl = url.substring(url.indexOf(',') + 1);
    }
    this.newDataSource.image = this.imageUrl;
    this.innerVisible = false;
  }

  onRemoveImg() {
    this.imageUrl = '';
    this.innerVisible = false;
  }
  onAddTreeNode() {
    const item = {
      id: Guid.newGuid(),
      pid: '-1',
      label: '',
      image: '',
      imgColor: '',
      children: [],
      hidden: false,
      hiddenDelButton: false,
      hiddenInput: false,
      topNode: false
    };
    this.treeModel.push(item);
  }

  /**
   *查询数据源
   * @memberof AttributeManageComponent
   */
  async queryDataSource() {
    let result = [];
    if (this.useResourceServer) {
      // 对接资源系统
      const externalRes = await externalResourceService.queryDataSource();
      const localRes = await dataSourceService.queryDataSource();
      result = externalRes.concat(localRes);
      result = R.uniqBy((x: any) => x.id, result);
    } else {
      // 使用本系统数据
      result = await dataSourceService.queryDataSource();
    }
    return result;
  }

  /**
   *修改数据源
   * @param {DataSource} dataSource
   * @memberof NewDataSourceComponent
   */
  async modifyDataSource(dataSource: DataSource) {
    const flag = this.isResourceServer(dataSource);
    if (flag) {
      return await externalResourceService.modifyDataSource(dataSource);
    } else {
      return await dataSourceService.modifyDataSource(dataSource);
    }
  }

  // 是否来自资源系统
  isResourceServer(dataSource: DataSource) {
    let flag = false;
    Object.keys(this.resourceDataSourceIds).forEach((key: any) => {
      if (this.resourceDataSourceIds[key] === dataSource.id) {
        flag = true;
      }
    });
    return flag && this.useResourceServer;
  }
}
