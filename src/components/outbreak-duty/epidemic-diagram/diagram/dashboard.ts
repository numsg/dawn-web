import ColorUtil from './util';

export default class Dashboard {

  options: any;
  defaultOptions: any;
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  scaleFactor!: number;
  initialFactor!: number;
  transformColor!: string;
  constructor(canvas: HTMLCanvasElement, options: any) {

    this.init(canvas, options);
    this.canvas.addEventListener('mouseover', this.scaleAnimate.bind(this));
    this.canvas.addEventListener('mouseout', this.handleMouseOut.bind(this));
  }

  init(canvas: HTMLCanvasElement, options: any) {
    this.options = options;
    this.defaultOptions = {
      width: 300,
      height: 300,
      lineWidth: 30,
      outStrokeStyle: '#E5E9F2',
      strokeStyle: 'skyblue',
      fillStyle: 'skyblue',
      lineCap: 'round',
      speed: 0.02,
      anticlockwise: true,
      initialPercentage: 0,
      percentage: 1,
    };
    const config = JSON.parse(JSON.stringify(this.defaultOptions));
    this.options = Object.assign(config, options);
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d') || new CanvasRenderingContext2D();
    canvas.width = this.options.width;
    canvas.height = this.options.height;
    ctx.lineWidth = this.options.lineWidth;
    ctx.lineCap = this.options.lineCap;
    ctx.strokeStyle = this.options.strokeStyle = this.options.strokeStyle ? this.options.strokeStyle : this.defaultOptions.strokeStyle;
    this.canvas = canvas;
    this.ctx = ctx;
    this.scaleFactor = 1 + this.options.lineWidth / this.canvas.width;
    this.initialFactor = 1;
    if (this.options.strokeStyle.startsWith('rgb')) {
      this.transformColor = ColorUtil.getRGB(this.options.strokeStyle);
    } else {
      this.ctx.strokeStyle = ColorUtil.isHex(String(this.ctx.strokeStyle)) ? this.ctx.strokeStyle : this.defaultOptions.strokeStyle;
      this.options.strokeStyle = this.ctx.strokeStyle;
      this.transformColor = ColorUtil.toRgba(String(this.ctx.strokeStyle));
    }
    this.animate();
  }

  drawDashboard() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.options.outStrokeStyle;
    this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2,
      (this.canvas.width / 2) - this.options.lineWidth, Math.PI / 4, Math.PI * 3 / 4, true);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();

    if (this.options.percentage > 0) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.options.strokeStyle;
      this.options.initialPercentage += this.options.speed;
      let endAngle;
      if (this.options.initialPercentage > 1 / 6) {
        endAngle = 9 / 4 * Math.PI - 3 / 2 * Math.PI * this.options.initialPercentage;
      } else {
        endAngle = Math.PI / 4 - 3 / 2 * Math.PI * this.options.initialPercentage;
      }
      this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2,
        (this.canvas.width / 2) - this.options.lineWidth, Math.PI / 4, endAngle, true);
      this.ctx.stroke();
      this.ctx.closePath();
      if (this.options.initialPercentage < this.options.percentage) {
        requestAnimationFrame(this.drawDashboard.bind(this));
      } else {
        this.options.initialPercentage = 0;
      }
    }
  }

  animate() {
    requestAnimationFrame(this.drawDashboard.bind(this));
  }

  handleMouseOver() {
    this.ctx.save();
    if (this.initialFactor < this.scaleFactor) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.initialFactor += 0.02;
    } else {
      return;
    }
    this.drawScaleCircle(this.initialFactor);
    if (this.initialFactor < this.scaleFactor) {
      requestAnimationFrame(this.handleMouseOver.bind(this));
    } else {
      this.initialFactor = 1;
    }

  }

  handleMouseOut() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawScaleCircle(1);
  }

  scaleAnimate() {
    requestAnimationFrame(this.handleMouseOver.bind(this));
  }

  drawScaleCircle(factor: number) {
    this.ctx.beginPath();
    this.ctx.scale(factor, factor);
    this.ctx.strokeStyle = this.options.outStrokeStyle;
    this.ctx.arc(this.canvas.width / 2 / factor, this.canvas.height / 2 / factor,
      (this.canvas.width / 2) - this.options.lineWidth, 0, Math.PI * 3 / 4, true);
    this.ctx.stroke();
    this.ctx.closePath();
    if (this.options.percentage > 0) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = factor > 1 ? this.transformColor : this.options.strokeStyle;
      // this.ctx.strokeStyle = factor > 1 ? this.options.strokeStyle : this.options.strokeStyle;
      let endAngle;
      if (this.options.percentage > 1 / 6) {
        endAngle = 9 / 4 * Math.PI - 3 / 2 * Math.PI * this.options.percentage;
      } else {
        endAngle = Math.PI / 4 - 3 / 2 * Math.PI * this.options.percentage;
      }
      this.ctx.arc(this.canvas.width / 2 / factor, this.canvas.height / 2 / factor,
        (this.canvas.width / 2) - this.options.lineWidth, Math.PI / 4, endAngle, true);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    this.ctx.restore();
  }

  removeEventListener() {
    this.canvas.removeEventListener('mouseover', this.scaleAnimate.bind(this));
    this.canvas.removeEventListener('mouseout', this.handleMouseOut.bind(this));
  }

}
