
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Html from './person-diagram.html';
import styles from './person-diagram.module.scss';
import blackStyles from './person-diagram.black.module.scss';
import Circle from './diagram/circle';
import Line from './diagram/line';
import Dashboard from './diagram/dashboard';

@Component({
    name: 'epidemic-diagram',
    template: Html,
    style: styles,
    themes: [{ name: 'white', style: styles }, { name: 'black', style: blackStyles }],
    components: {

    },
})
export default class EpidemicDiagram extends Vue {

    @Prop({
        type: String,
        default: 'circle'
    })
    type: any;
    @Prop()
    show: any;
    @Prop()
    width: any;
    @Prop()
    height: any;
    @Prop()
    radius: any;
    @Prop({
        type: String,
        default: '10'
    })
    lineWidth: any;

    @Prop({
        type: String,
        default: '#3498DB'
    })
    strokeStyle: any;
    @Prop()
    percentage: any;
    @Prop()
    text: any;
    @Prop()
    count: any;

    canvas: any;

    canvasDomElement: any;

    @Watch('show')
    showAnimation() {
        // if (this.show) {
        //     // this.canvas.animate();
        //     this.canvas.init(this.canvasDomElement, {
        //         width: this.width,
        //         height: this.height,
        //         lineWidth: this.lineWidth,
        //         percentage: number(this.percentage),
        //         strokeStyle: this.strokeStyle
        //     });
        // }
    }

    @Watch('percentage')
    onPercentageChange() {
        this.canvas.init(this.canvasDomElement, {
            width: this.width,
            height: this.height,
            lineWidth: this.lineWidth,
            percentage: this.percentage,
            strokeStyle: this.strokeStyle
        });
    }

    mounted() {
        this.canvasDomElement = this.$refs['canvas'] as HTMLCanvasElement;
        if (this.type === 'circle') {
            this.canvas = new Circle(this.canvasDomElement, {
                width: this.width,
                height: this.height,
                lineWidth: this.lineWidth,
                percentage: this.percentage,
                strokeStyle: this.strokeStyle
            });
        } else if (this.type === 'line') {
            this.canvas = new Line(this.canvasDomElement, {
                width: this.width,
                height: 30,
                lineWidth: this.lineWidth,
                percentage: this.percentage,
                strokeStyle: this.strokeStyle
            });
        } else if (this.type === 'dashboard') {
            this.canvas = new Dashboard(this.canvasDomElement, {
                width: this.width,
                height: this.height,
                lineWidth: this.lineWidth,
                percentage: this.percentage,
                strokeStyle: this.strokeStyle
            });
        }
    }

    beforeDestroy() {
        this.canvas.removeEventListener();
    }
}

