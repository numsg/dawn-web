import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import template from './route-leave-dialog.html';
import styles from './route-leave-dialog.module.scss';

@Component({
    name: 'route-leave-dialog',
    template: template,
    style: styles,
    components: {}
})
export class RouteLeaveDialog extends Vue {

    @Prop({
        default: false
    })
    visible!: boolean;

    /**
    * 路由跳转
    * @memberof DynamicPage
    */
    routeLeave() {
        this.$emit('route-leave');
    }

    close() {
        this.$emit('update:visible', false);
    }


}
