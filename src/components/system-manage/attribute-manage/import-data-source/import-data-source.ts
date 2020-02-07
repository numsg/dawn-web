import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import styles from './import-data-source.module.scss';
import Html from './import-data-source.html';
import notifyUtil from '@/common/utils/notifyUtil';
import eventNames from '@/common/events/store-events';
import importDataSourceService from '@/api/data-source/import-data-source.service';
import dataSourceService from '@/api/data-source/data-source.service';
import { Getter } from 'vuex-class';
import Config from '@/utils/config-decorator';
import externalResourceService from '@/api/external-resource/external-resource.service';
import * as R from 'ramda';
import importBlackStyle from './import-data-source.black.module.scss';

@Component({
  template: Html,
  style: styles,
  name: 'import-data-source',
  themes: [{ name: 'white', style: styles }, { name: 'black', style: importBlackStyle }],
  components: {}
})
export class ImportDataSourceComponent extends Vue {
  // 树形或者列表
  structure: any = '1';

  uploadData: any = {};

  dataSourcePrompt: any = {
    toatal: 0,
    success: 0,
    repeat: 0,
    error: 0,
    time: 0,
    errorLog: '',
    errorLogDisabled: true,
    activeName: 'selectFile'
  };

  public images = {
    singleStage: require('@/assets/img/data-source/single-stage.png'),
    treeStage: require('@/assets/img/data-source/tree-stage.png')
  };

  @Getter('layout_loading')
  loading!: boolean;

  @Getter('layout_loadingText')
  loadingText!: string;

  @Getter('layout_background')
  loadingBackground!: boolean;

  @Getter('layout_spinner')
  loadingSpinner!: string;

  dialogVisible: boolean = false;

  @Prop()
  importDataSourceVisible: any;

  // @Config('rmsConfig.useResourceServer')
  useResourceServer: boolean = false;

  onCloseDialog(done: any) {
    done();
    this.$emit('on-close-import', false);
    this.dialogVisible = false;
  }

  @Watch('importDataSourceVisible')
  visibleChange() {
    this.dialogVisible = this.importDataSourceVisible;
  }

  outsideClose() {
    this.dialogVisible = false;
    this.$emit('on-close-import', false);
  }

  // 上传验证
  async beforeUpload(file: any) {
    console.log('before', file);
  }

  onUploadError(file: any) {
    console.log('error', file);
  }

  /**
   *上传解析数据源
   *
   * @param {*} file
   * @returns
   * @memberof ImportDataSourceComponent
   */
  async onUploadChange(file: any) {
    const type = file.raw.type;
    const size = file.size / 1024;
    if (size === 0) {
      notifyUtil.error(this.$tc('data_source.data_source_import.file_empty'));
      return;
    }
    if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel') {
      notifyUtil.error(this.$tc('data_source.data_source_import.upload_excel'));
      return;
    }
    if (size > 3072) {
      notifyUtil.error(this.$tc('data_source.data_source_import.upload_amount'));
      return;
    }
    const formData: any = new FormData();
    formData.append('file', file.raw);
    const loadPayloads: any = {
      loading: true,
      loadingText: this.$tc('plan_manage.file_parsing')
    };
    // this.$store.dispatch(eventNames.layout.SetLoading, loadPayloads);
    let result: any = null;
    if (this.structure === '2') {
      const response = await importDataSourceService.importSingleDataSource(formData);
      result = this.handleImportResult(response);
    } else if (this.structure === '1') {
      const response = await importDataSourceService.importTreeDataSource(formData);
      result = this.handleImportResult(response);
    }
    this.dataSourcePrompt.activeName = 'errorLog';
    // 判断是否数据是否重复，并去重，写入
    this.cleraPrompt();
    if (result) {
      await this.judgeDataRepeat(result.data);
      this.dataSourcePrompt.errorLogDisabled = false;
      loadPayloads.loadingText = this.$tc('data_source.data_source_import.data_load');
      loadPayloads.loading = false;
    } else {
      this.cleraPrompt();
      notifyUtil.error(this.$tc('rule_library.rule_import.content_conform_specificiation'));
      this.dataSourcePrompt.errorLog = this.$tc('rule_library.rule_import.content_conform_specificiation');
      return;
    }
  }

  private handleImportResult(response: any) {
    if (response === undefined) {
      return;
    }
    if (response.response && response.response.data.code === 413) {
      notifyUtil.error(this.$tc('data_source.data_source_import.total_number_limit'));
      return;
    }
    return response;
  }

  /**
   * 判断数据源名称是否重复 并 写入
   * 1. 先把返回的数据判断，重复则去掉 , 由于 excel 的 sheet 自带sheet名称不能重复，所以该步骤无需做
   * 2. 在把 去重的数据 和 数据源已有的数据判断，重复则去掉
   *
   * @param {*} data
   * @memberof ImportDataSourceComponent
   */
  async judgeDataRepeat(data: any) {
    if (data === undefined) {
      return;
    }
    const length = data.length;
    this.dataSourcePrompt.toatal = length;
    if (length === 0) {
      notifyUtil.warning(this.$tc('data_source.data_source_import.file_error'));
      this.dataSourcePrompt.errorLog = this.$tc('data_source.data_source_import.file_error');
      return;
    }

    const errorData = data.filter((e: any) => e.dSourceDataModels === null || e.dSourceDataModels.length === 0);
    if (errorData.length > 0) {
      this.dataSourcePrompt.error = errorData.length;
      errorData.forEach((element: any) => {
        this.dataSourcePrompt.errorLog +=
          this.$tc('data_source.data_source_import.bad_data') +
          element.name +
          this.$tc('data_source.data_source_import.no_data_source') +
          '\r\n';
      });
    }

    data = data.filter((e: any) => e.dSourceDataModels && e.dSourceDataModels.length > 0);
    // 去除已经存在的数据源的重复
    const dataSource = await this.queryDataSource();
    dataSource.forEach((e: any) => {
      data.forEach((t: any) => {
        if (e.name === t.name) {
          this.dataSourcePrompt.errorLog += this.generateErrorLog(t, this.$tc('rule_library.rule_import.repeat_data'));
          this.dataSourcePrompt.repeat++;
          data.splice(data.indexOf(t), 1);
        }
      });
    });
    // 如果是平铺行数据源，则在每个数据源内部数据去重
    data.forEach((t: any) => {
      if (t.type === 2) {
        const res = new Map();
        t.dSourceDataModels = t.dSourceDataModels.filter((a: any) => !res.has(a.name) && res.set(a.name, 1));
        t.dSourceDataModels.forEach((element: any) => {
          element.image = '';
        });
      }
    });
    let result = [];
    if (data.length > 0) {
      result = await importDataSourceService.imporDataSourceBatch(data);
      this.dataSourcePrompt.success = result.length;
      this.dataSourcePrompt.errorLog = this.generateSuccessLog(data);
    } else {
      // notifyUtil.warning(this.$tc('data_source.data_source_import.data_repeat'));
      return;
    }
    if (!result) {
      notifyUtil.error(this.$tc('data_source.data_source_import.import_error'));
    }
    const str: any =
      this.dataSourcePrompt.errorLog +
      '; ' +
      this.$tc('system_log.import') +
      this.$tc('system_log.total') +
      this.dataSourcePrompt.toatal +
      '; ' +
      this.$tc('system_log.import') +
      this.$tc('system_log.state_success') +
      ': ' +
      this.dataSourcePrompt.success +
      '; ';
    if (Array.isArray(result) && result.length > 0 && data.length === length) {
      const router: any = this.$router.currentRoute;
      // const user: any = sessionStorage.getItem('userInfo');
      this.$store.dispatch(eventNames.SystemLog.ImportDataSource, {
        router: router,
        data: JSON.stringify(result),
        description: str
      });
      notifyUtil.success(this.$tc('data_source.data_source_import.import_success'));
    } else if (Array.isArray(result) && result.length > 0 && data.length < length) {
      notifyUtil.success(this.$tc('data_source.data_source_import.import_success_repeat'));
    }
    // 关闭之后 数据源界面 若导入成功则定位到导入数据源的位置
    this.$emit('on-close-load', result);
  }

  // 生成重复数据源日志信息
  generateErrorLog(data: any, type: any) {
    if (!data) {
      return '';
    }
    let log: any = '';
    log += this.$tc('data_source.data_source_import.duplicate_data_source') + data.name + '\r\n';
    return log;
  }

  // 生成成功导入数据源信息日志
  generateSuccessLog(data: any) {
    if (!data) {
      return this.$tc('data_source.data_source_import.import_success');
    }
    if (data.length < 1) {
      return this.$tc('data_source.data_source_import.import_error');
    }
    let successLog = '';
    data.forEach((element: any) => {
      successLog +=
        this.$tc('data_source.import_data_source_success') +
        element.name +
        this.$tc('data_source.data_source_have') +
        element.dSourceDataModels.length +
        this.$tc('data_source.data_count') +
        '\r\n';
    });
    return successLog;
  }

  // 下载数据源模板
  downloadtmp() {
    const link: any = document.createElement('a');
    link.href = '/template-file/data-source-template.rar';
    link.download = 'data-source-template.rar';
    link.style = 'visibility:hidden';
    document.body.appendChild(link);
    link.click();
  }

  // 上传之前把rulePrompt中的属性清空
  cleraPrompt() {
    this.dataSourcePrompt.toatl = 0;
    this.dataSourcePrompt.success = 0;
    this.dataSourcePrompt.repeat = 0;
    this.dataSourcePrompt.error = 0;
    this.dataSourcePrompt.time = 0;
    this.dataSourcePrompt.errorLog = '';
    this.dataSourcePrompt.errorLogDisabled = false;
    this.dataSourcePrompt.activeName = 'errorLog';
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
}
