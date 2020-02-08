import ColorUtil from './util';
export default class Line {
  defaultOptions: any;
  options: any;
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  transformColor!: string;
  constructor(canvas: HTMLCanvasElement, options: any) {

    this.init(canvas, options);
    this.canvas.addEventListener('mouseover', this.handleMouseOver.bind(this));
    this.canvas.addEventListener('mouseout', this.handleMouseOut.bind(this));
  }

  init(canvas: HTMLCanvasElement, options: any) {
    this.defaultOptions = {
      lineWidth: 30,
      width: 300,
      height: 30,
      strokeStyle: 'skyblue',
      outStrokeStyle: '#E5E9F2',
      lineCap: 'round',
      speed: 0.01,
      initialPercentage: 0,
      percentage: 1
    };
    const config = JSON.parse(JSON.stringify(this.defaultOptions));
    this.options = Object.assign(config, options);
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d') || new CanvasRenderingContext2D();
    canvas.width = this.options.width;
    canvas.height = this.options.height;
    ctx.lineCap = this.options.lineCap;
    ctx.lineWidth = this.options.lineWidth;
    ctx.strokeStyle = this.options.strokeStyle = this.options.strokeStyle ? this.options.strokeStyle : this.defaultOptions.strokeStyle;
    this.canvas = canvas;
    this.ctx = ctx;
    if (this.options.strokeStyle.startsWith('rgb')) {
      this.transformColor = ColorUtil.getRGB(this.options.strokeStyle);
    } else {
      this.ctx.strokeStyle = ColorUtil.isHex(String(this.ctx.strokeStyle)) ? this.ctx.strokeStyle : this.defaultOptions.strokeStyle;
      this.options.strokeStyle = this.ctx.strokeStyle;
      this.transformColor = ColorUtil.toRgba(String(this.ctx.strokeStyle));
    }
    this.animate();
  }

  drawLine() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.options.outStrokeStyle;
    this.ctx.moveTo(this.ctx.lineWidth / 2, this.options.height / 2);
    this.ctx.lineTo(this.canvas.width - this.ctx.lineWidth / 2, this.canvas.height / 2);
    this.ctx.stroke();
    this.ctx.closePath();

    if (this.options.percentage > 0) {
      //   this.ctx.restore();
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.options.strokeStyle;
      this.options.initialPercentage += this.options.speed;
      this.ctx.moveTo(this.ctx.lineWidth / 2, this.canvas.height / 2);
      this.ctx.lineTo(this.canvas.width * this.options.initialPercentage - this.ctx.lineWidth / 2, this.canvas.height / 2);
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.restore();
      if (this.options.initialPercentage < this.options.percentage) {
        requestAnimationFrame(this.drawLine.bind(this));
      } else {
        this.options.initialPercentage = 0;
      }
    }
  }

  animate() {
    requestAnimationFrame(this.drawLine.bind(this));
  }

  handleMouseOver() {
    this.drawOnMouseEvent(this.transformColor);
  }

  handleMouseOut() {
    this.drawOnMouseEvent(this.ctx.strokeStyle);
  }

  drawOnMouseEvent(color: any) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.options.outStrokeStyle;
    this.ctx.moveTo(this.ctx.lineWidth / 2, this.options.height / 2);
    this.ctx.lineTo(this.canvas.width - this.ctx.lineWidth / 2, this.canvas.height / 2);
    this.ctx.stroke();
    if (this.options.percentage > 0) {
      this.ctx.closePath();
      this.ctx.beginPath();
      this.ctx.strokeStyle = color;
      this.ctx.moveTo(this.ctx.lineWidth / 2, this.canvas.height / 2);
      this.ctx.lineTo(this.canvas.width * (this.options.percentage + this.options.speed) - this.ctx.lineWidth / 2, this.canvas.height / 2);
      this.ctx.stroke();
      this.ctx.closePath();
    }
    this.ctx.restore();
  }
  removeEventListener() {
    this.canvas.removeEventListener('mouseover', this.handleMouseOver.bind(this));
    this.canvas.removeEventListener('mouseout', this.handleMouseOut.bind(this));
  }
}
