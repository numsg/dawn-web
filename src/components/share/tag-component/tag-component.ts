import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from '@/components/share/tag-component/tag-component.html';
import Style from '@/components/share/tag-component/tag-component.module.scss';
import Guid from '@/utils/guid';

import TagModel from '@/models/common/tag-model';
import tagBlackStyle from './tag-component.black.module.scss';
import tagStyle from './tag-component.module.scss';
import notifyUtil from '@/common/utils/notifyUtil';
import i18n from '@/i18n';

@Component({
  template: Html,
  style: Style,
  themes: [{ name: 'white', style: tagStyle }, { name: 'black', style: tagBlackStyle }],
  name: 'pms-tag',
  components: {}
})
export class TagComponent extends Vue {
  public currentTag: TagModel = new TagModel();
  public addModel: TagModel = new TagModel();
  public isAdd: boolean = false;
  public isEdit: boolean = false;

  public tags: Array<TagModel> = [];

  tagRules = {
    tagName: [
      { required: true, message: i18n.t('plan_deduction.situation_name_bull'), trigger: 'blur' },
      { min: 1, max: 256, message: i18n.t('common.name_length_limit128'), trigger: 'blur' }
    ]
  };

  @Prop() dataSource: any;

  @Prop() needGuidId: any;

  @Prop() disableAdd: any;

  @Prop({
    default: false
  })
  isStringTags!: boolean;

  @Watch('dataSource')
  dataSourceChange(val: any) {
    this.initData();
  }

  @Watch('isAdd')
  addStatusChange(val: any) {
    this.$emit('edit-status-change', { add: this.isAdd, edit: this.isEdit });
  }

  @Watch('isEdit')
  editStatusChange(val: any) {
    this.$emit('edit-status-change', { add: this.isAdd, edit: this.isEdit });
  }

  @Watch('addModel.tagName')
  addModelagName(val: any) {}

  mounted() {
    this.initData();
  }

  initData() {
    if (this.isStringTags && this.dataSource && this.dataSource !== '') {
      const arr = this.dataSource.split(',');
      this.tags = this.setStringTagId(arr, []);
    } else if (Array.isArray(this.dataSource)) {
      this.tags = this.dataSource;
    }
  }

  setStringTagId(data: Array<string>, newData: Array<any>) {
    data.forEach((t: string) => {
      const tag = new TagModel();
      tag.tagId = Guid.newGuid();
      tag.tagName = t;
      newData.push(tag);
    });
    return newData;
  }

  buildStringTags(data: Array<TagModel>) {
    const newData = data.map((t: TagModel) => {
      const stringTag = t.tagName;
      return stringTag;
    });
    return newData;
  }

  onAddSave() {
    const tagForm: any = this.$refs['tagForm'];
    tagForm.validate(async (valid: any, object: any) => {
      if (valid) {
        if (this.addModel.tagName.replace(/\s*/g, '') === '') {
          this.$message({ message: this.$tc('share.tag_no_null'), type: 'error' });
          return;
        }
        this.addModel.tagId = this.needGuidId ? '' : Guid.newGuid();
        this.tags.push(this.addModel);
        const tagData = this.isStringTags ? this.buildStringTags(this.tags) : this.tags;
        this.$emit('on-tags-change', { addTag: this.addModel, tags: tagData });
        this.isAdd = false;
        this.addModel = new TagModel();
      } else {
        return;
      }
    });
  }

  onAddCancel() {
    this.isAdd = false;
    this.addModel = new TagModel();
  }

  onInput(val: any, flag: any) {
    if (this.isStringTags) {
      if (flag === 'addModel') {
        this.addModel.tagName = val.replace(/,/g, '');
      } else {
        this.currentTag.tagName = val.replace(/,/g, '');
      }
    }
  }
  onEdit(item: TagModel) {
    if ((item.tagId !== this.currentTag.tagId && this.isEdit) || this.isAdd) {
      this.$confirm(this.$tc('share.confirm_leave_now_edit'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(() => {
          this.currentTag = Object.assign({}, item);
          this.addModel = new TagModel();
          this.isEdit = true;
          this.isAdd = false;
        })
        .catch(() => {
          return;
        });
    } else {
      this.currentTag = Object.assign({}, item);
      this.isEdit = true;
    }
  }
  onDelete(tag: TagModel) {
    this.$confirm(this.$tc('share.confirm_delete'), {
      confirmButtonText: this.$tc('common.determine'),
      cancelButtonText: this.$tc('common.cancel'),
      type: 'warning',
      title: this.$tc('common.prompt'),
      showClose: false
    })
      .then(() => {
        this.tags.splice(this.tags.findIndex((t: any) => t.tagId === tag.tagId), 1);
        const tagData = this.isStringTags ? this.buildStringTags(this.tags) : this.tags;
        this.$emit('on-tags-change', { deletaTag: tag, tags: tagData });
      })
      .catch(() => {
        return;
      });
  }

  onSaveEdit() {
    const edittagForm: any = this.$refs['edittagForm'];
    edittagForm[0].validate(async (valid: any, object: any) => {
      if (valid) {
        if (this.currentTag.tagName.replace(/\s*/g, '') === '') {
          this.$message({ message: this.$tc('share.tag_no_null'), type: 'error' });
          return;
        }
        const editItme = this.currentTag;
        this.tags.splice(this.tags.findIndex((t: any) => t.tagId === this.currentTag.tagId), 1, editItme);
        const tagData = this.isStringTags ? this.buildStringTags(this.tags) : this.tags;
        this.$emit('on-tags-change', { editTag: this.currentTag, tags: tagData });
        this.isEdit = false;
      } else {
        return;
      }
    });
  }

  onCancelEdit() {
    this.isEdit = false;
    this.currentTag = new TagModel();
  }

  makeNewTag() {
    if (this.isEdit) {
      this.$confirm(this.$tc('share.confirm_leave_now_edit'), {
        confirmButtonText: this.$tc('common.determine'),
        cancelButtonText: this.$tc('common.cancel'),
        type: 'warning',
        title: this.$tc('common.prompt'),
        showClose: false
      })
        .then(() => {
          this.currentTag = new TagModel();
          this.isEdit = false;
          this.isAdd = true;
        })
        .catch(() => {
          return;
        });
    } else {
      this.addModel = new TagModel();
      this.isAdd = true;
    }
  }
}
