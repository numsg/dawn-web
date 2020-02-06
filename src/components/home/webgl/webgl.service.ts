import * as THREE from 'three';
import TWEEN from 'three-tween';
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

export default class WebglService {
  camera: any;
  scene: any;
  renderer: any;
  controls: any;
  targets: any = {
    table: [],
    sphere: [],
    helix: [],
    grid: []
  };
  objects: any[] = [];
  dataSource: any[] = [];
  cameraPositionZ: number;
  status!: number;
  constructor(
    id: string,
    type: string,
    dataSource: any[],
    width: number,
    height: number,
    cameraPositionZ: number,
    positionX: number,
    positionY: number
  ) {
    this.dataSource = dataSource;
    this.init(id, type, width, height, cameraPositionZ, positionX, positionY);
    this.cameraPositionZ = cameraPositionZ;
  }

  init(id: string, type: string, width: number, height: number, cameraPositionZ: number, positionX: number, positionY: number) {
    const rowCount = 3;
    const padding = 20;
    this.status = 1;
    if (this.scene) {
      return;
    }
    const container = document.getElementById(id) as HTMLDivElement;
    // this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 1, 1000);
    this.camera.position.z = cameraPositionZ;
    this.scene = new THREE.Scene();
    this.dataSource.forEach((e, i) => {
      const element = document.getElementById(e.id) as HTMLElement;
      const object = new CSS3DObject(element);
      object.position.x = Math.random() * 500 - 250;
      object.position.y = Math.random() * 500 - 250;
      object.position.z = Math.random() * 500 - 250;
      this.scene.add(object);
      this.objects.push(object);
      // table
      const object3d = new THREE.Object3D();
      //   object3d.position.x = i * 140 - 280;
      if (type === 'module') {
        object3d.position.x = (i % rowCount) * (width + padding) - width - 40;
        object3d.position.y = height - (Math.floor(i / rowCount) % rowCount) * (height + padding) - 60;
      } else {
        object3d.position.x = i * (width + padding) - positionX;
        // object3d.position.y = -200 + positionY;
        object3d.position.y = 0;
      }

      this.targets.table.push(object3d);
    });

    // helix
    const vectorHelix = new THREE.Vector3();
    for (let i = 0, l = this.objects.length; i < l; i++) {
      // const theta = i * 1.3 + Math.PI;
      // const theta = i * 1.047; // 6
      // const theta = i * 1.26; // 5
      // const theta = i * 1.54; // 4
      const theta = i * (6.282 / l); // 6

      const y = 0;
      const object = new THREE.Object3D();

      object.position.setFromCylindricalCoords(width, theta, y);

      vectorHelix.x = object.position.x * 2;
      vectorHelix.y = object.position.y;
      vectorHelix.z = object.position.z * 2;

      object.lookAt(vectorHelix);
      this.targets.helix.push(object);
    }

    if (!this.renderer) {
      this.renderer = new CSS3DRenderer();
    }
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    const children = container.childNodes;
    if (children.length > 2) {
      container.removeChild(children[1]);
    }

    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 100;
    this.controls.maxDistance = 3000;
    this.controls.addEventListener('change', this.renderWebgl.bind(this));
    // this.transform('table', 1000);
    return this;
  }

  transform(type: string, duration: any = 2000) {
    let targets = [];
    if (type === 'table') {
      targets = this.targets.table;
    } else if (type === 'helix') {
      targets = this.targets.helix;
    }
    TWEEN.removeAll();
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = this.cameraPositionZ;
    this.camera.rotation.x = 0;
    this.camera.rotation.y = 0;
    this.camera.rotation.z = 0;
    this.scene.position.x = 0;
    this.scene.position.y = 0;
    this.scene.position.z = 0;
    this.scene.rotation.x = 0;
    this.scene.rotation.y = 0;
    this.scene.rotation.z = 0;
    this.controls.object.x = 0;
    this.controls.object.y = 0;
    this.controls.object.z = 0;
    this.controls.object.quaternion.x = 0;
    this.controls.object.quaternion.y = 0;
    this.controls.object.quaternion.z = 0;
    this.controls.object.quaternion.w = 1;
    for (let i = 0; i < this.objects.length; i++) {
      const object = this.objects[i];
      const target = targets[i];

      new TWEEN.Tween(object.position)
        .to(
          {
            x: target.position.x,
            y: target.position.y,
            z: target.position.z
          },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

      new TWEEN.Tween(object.rotation)
        .to(
          {
            x: target.rotation.x,
            y: target.rotation.y,
            z: target.rotation.z
          },
          duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    }

    // new TWEEN.Tween(this.camera.position)
    //   .to({
    //     x: 0,
    //     y: 0,
    //     z: this.cameraPositionZ
    //   }, duration)
    //   // .easing(TWEEN.Easing.Exponential.InOut)
    //   .start();
    // new TWEEN.Tween(this.camera.rotation)
    //   .to({
    //     x: 0,
    //     y: 0,
    //     z: 0
    //   }, duration)
    //   // .easing(TWEEN.Easing.Exponential.InOut)
    //   .start();

    // new TWEEN.Tween(this.scene.position)
    //   .to({
    //     x: 0,
    //     y: 0,
    //     z: 0
    //   }, duration)
    //   // .easing(TWEEN.Easing.Exponential.InOut)
    //   .start();

    // new TWEEN.Tween(this.controls.object)
    //   .to({
    //     x: 0,
    //     y: 0,
    //     z: 0
    //   }, duration)
    //   // .easing(TWEEN.Easing.Exponential.InOut)
    //   .start();

    new TWEEN.Tween(this)
      .to({}, duration * 2)
      .onUpdate(this.renderWebgl.bind(this))
      .start();

  }

  animate() {
    if (this.status === 1) {
      requestAnimationFrame(this.animate.bind(this));
      TWEEN.update();
      this.controls.update();
    }
  }

  renderWebgl() {
    this.renderer.render(this.scene, this.camera);
  }

  destory() {
    this.status = 2;
    this.camera = null;
    this.scene = null;
    this.renderer = null;
    this.controls = null;
    this.dataSource = [];
  }
}
