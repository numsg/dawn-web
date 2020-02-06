import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from '@/components/system-manage/resource-manage/resource-manage.html';
import Styles from '@/components/system-manage/resource-manage/resource-manage.module.scss';
import { MenuResourceComponent } from './menu-resource/menu-resource';
import { PrivilegeResourceComponent } from './privilege-resource/privilege-resource';
import i18n from '@/i18n';
import ResourceBlackStyle from './resource-manage.black.module.scss';
import ResourceStyle from './resource-manage.module.scss';

@Component({
    template: Html,
    style: Styles,
    themes: [{ name: 'white', style: ResourceStyle }, { name: 'black', style: ResourceBlackStyle }],
    components: {
        'menu-resource': MenuResourceComponent,
        'privilege-resource': PrivilegeResourceComponent
    }
})
export class ResourceManageComponent extends Vue {

    activeName = 'first';

    private menu = {
        funcList: i18n.t('resource-manage.function_list'),
        apiRes: i18n.t('resource-manage.api_resource'),
    };

    labelActive() {
        // const labelElements = document.querySelectorAll('.resource-tabs');
    }

}
