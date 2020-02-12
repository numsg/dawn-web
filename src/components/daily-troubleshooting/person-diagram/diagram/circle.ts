import ColorUtil from './util';

export default class Circle {
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
      strokeStyle: '#3498DB',
      fillStyle: '#3498DB',
      lineCap: 'round',
      speed: 0.016,
      anticlockwise: true,
      initialPercentage: 0,
      percentage: 1
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

  drawCircle() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.options.outStrokeStyle;
    this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2 - this.options.lineWidth, 0, 2 * Math.PI, true);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();

    if (this.options.percentage > 0) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.options.strokeStyle;
      this.options.initialPercentage += this.options.speed;
      let percentage;
      if (this.options.initialPercentage < this.options.percentage) {
        percentage = this.options.anticlockwise ? 1 - this.options.initialPercentage : this.options.initialPercentage;
      } else {
        const per =  this.options.percentage < 0.01 ? 0.01 : this.options.percentage - 0.01;
        percentage = this.options.anticlockwise ?  1 - per : per;
      }
      this.ctx.arc(
        this.canvas.width / 2,
        this.canvas.height / 2,
        this.canvas.width / 2 - this.options.lineWidth,
        0,
        2 * Math.PI * percentage,
        this.options.anticlockwise
      );
      this.ctx.stroke();
      this.ctx.closePath();
      if (this.options.initialPercentage < this.options.percentage) {
        requestAnimationFrame(this.drawCircle.bind(this));
      } else {
        this.options.initialPercentage = 0;
      }
    }
  }

  animate() {
    requestAnimationFrame(this.drawCircle.bind(this));
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

  scaleAnimate() {
    requestAnimationFrame(this.handleMouseOver.bind(this));
  }

  handleMouseOut() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawScaleCircle(1);
  }

  drawScaleCircle(factor: number) {
    this.ctx.beginPath();
    this.ctx.scale(factor, factor);
    this.ctx.strokeStyle = this.options.outStrokeStyle;
    this.ctx.arc(
      this.canvas.width / 2 / factor,
      this.canvas.height / 2 / factor,
      this.canvas.width / 2 - this.options.lineWidth,
      0,
      2 * Math.PI,
      true
    );
    this.ctx.stroke();
    this.ctx.closePath();
    if (this.options.percentage > 0) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = factor > 1 ? this.transformColor : this.options.strokeStyle;
      const per =  this.options.percentage < 0.01 ? 0.01 : this.options.percentage - 0.01;
      this.ctx.arc(
        this.canvas.width / 2 / factor,
        this.canvas.height / 2 / factor,
        this.canvas.width / 2 - this.options.lineWidth,
        0,
        2 * Math.PI * (1 - per),
        true
      );
      this.ctx.stroke();
      this.ctx.closePath();
    }
    this.ctx.restore();
  }

  removeEventListener() {
    this.canvas.removeEventListener('mouseover', this.scaleAnimate);
    this.canvas.removeEventListener('mouseout', this.handleMouseOut);
  }
}
