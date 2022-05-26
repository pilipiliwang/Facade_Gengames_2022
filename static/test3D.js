// import * as THREE from 'https://unpkg.com/browse/three@0.140.2/build/three.module.js';
// import { OrbitControls } from 'https://unpkg.com/three@0.140.2/examples/jsm/controls/OrbitControls.js';
// import { OrbitControls } from 'https://unpkg.com/three@0.140.2/examples/jsm/controls/OrbitControls.js';
let transZ,cube,thick,geometry,route,cubeTexture,colormaterial,texmaterial,draw_width,draw_height,draw_positionX,draw_positionY,scene, camera, renderer, arrowLineTexture, flowingLineTexture, stats, controls, clock;

//设置尺寸
const width = 1024;
const height = 512;
const cubelist = [];
const rate = 8;
let tranZ;

//scene
function initScene() {
  scene = new THREE.Scene();
  // scene.add(new THREE.AxesHelper(50)); //添加坐标轴辅助线
  //用一张图加载为纹理作为场景背景
  scene.background = new THREE.TextureLoader().load('static/images/background3.jpg'); //载入背景
// scene.background = new THREE.Color("rgb(239,238,238)");//背景为纯色

}
//camera,修改‘window.innerWidth / window.innerHeight’
function initCamera() {
  camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 2000);
  camera.position.set(20, 30, 80);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
}
//light，贴BasicMesh可以不调用
function initLight() {
  //添加环境光
  const ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight('#fff')
  directionalLight.position.set(30, 30, 30).normalize()
  scene.add(directionalLight)

  //添加聚光灯
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);
}

//BOX几何体直接创建的方式，需要做坐标点处理
function drawBoxGeometry(inputlist,route,thick,transZ,label){
      //设置坐标的属性，inputlist = [x_a '0',y_a '1',mouseX '2',mouseY '3']
  draw_width = (inputlist[2]-inputlist[0])/rate;
  draw_height = (inputlist[3]-inputlist[1])/rate;
  draw_positionX = (inputlist[0]+inputlist[2])/2/rate;
  draw_positionY = (inputlist[1]+inputlist[3])/2/rate;

    //创建几何体
  geometry = new THREE.BoxGeometry(draw_width,draw_height,thick);
      //创建材质
  // route = 'static/images/ACT (49).jpg'; //材质文件路径
  cubeTexture = new THREE.TextureLoader().load(route);
      texmaterial = new THREE.MeshBasicMaterial({map: cubeTexture});
      // texmaterial = new THREE.MeshBasicMaterial({color:'rgb(13,56,230)'}) //测试label颜色
  colormaterial = new THREE.MeshBasicMaterial({color:'rgb(196,196,196)'});//设置其他面的颜色

  var material = [
    new THREE.MeshBasicMaterial(colormaterial),
    new THREE.MeshBasicMaterial(colormaterial),
    new THREE.MeshBasicMaterial(colormaterial),
    new THREE.MeshBasicMaterial(colormaterial),
    new THREE.MeshBasicMaterial(texmaterial),
    new THREE.MeshBasicMaterial(colormaterial),
  ]
  //创建cube
      cube = new THREE.Mesh( geometry, material );
  //cube位置,y轴是算出来的偏移
  cube.position.set(draw_positionX,-draw_positionY+10,0);
  // cube.position.set(0,0,0)
  cube.translateZ(transZ);

  //设置屋顶cube的旋转
  if (label == '屋顶_Roof'){
    cube.geometry.rotateX(-0.5)
  }

      //命名cube
      cube.name = label

      //加载cube
  scene.add( cube );
      //把所有的mesh存在cubelist里
   cubelist.push(cube);

} //drawBoxGeometry的大括号



// toshape\extrude的布尔运算方法
let stop3Ddraw = false;
function shapecutted(inputlist,shape_coored) {
  const path = new THREE.ShapePath();

    // 设定砖墙坐标,x_a,y_a,mouseX,mouseY
  if (stop3Ddraw == false) {
    const brickdraw_x0 = inputlist[0] / rate; //起点x
    const brickdraw_y0 = inputlist[1] / rate; //起点y
    const brickdraw_x1 = inputlist[0] / rate;
    const brickdraw_y1 = inputlist[3] / rate;
    const brickdraw_x2 = inputlist[2] / rate;
    const brickdraw_y2 = inputlist[3] / rate;
    const brickdraw_x3 = inputlist[2] / rate;
    const brickdraw_y3 = inputlist[1] / rate;
    // // 先画砖墙big，逆时针（需要镜像）
    // path.moveTo(brickdraw_x0, -brickdraw_y0);
    // path.lineTo(brickdraw_x3, -brickdraw_y3);
    // path.lineTo(brickdraw_x2, -brickdraw_y2);
    // path.lineTo(brickdraw_x1, -brickdraw_y1);

    //顺时针（需要镜像）,test
    path.moveTo(brickdraw_x0, -brickdraw_y0);
    path.lineTo(brickdraw_x1, -brickdraw_y1);
    path.lineTo(brickdraw_x2, -brickdraw_y2);
    path.lineTo(brickdraw_x3, -brickdraw_y3);
    // console.log(path)

  }

  //  // test,逆时针小方块
  // path.moveTo(10, 10);
  // path.lineTo(10, 20);
  // path.lineTo(20, 20);
  // path.lineTo(20, 10);


  // redraw之前的绘制路径，当下路径砖墙不作绘制
  if(stop3Ddraw == false){
    for (i = 0; i < shapes_coord.length; i++) {
    //其他布尔形状的坐标:shapes_coord[i][0] -- 0,shapes_coord[i][1]--1,shapes_coord[i][2],shapes_coord[i][3]; /x_a,y_a,mouseX-x_a,mouseY-y_a
      const drawmouseX = shapes_coord[i][2]+shapes_coord[i][0];
      const drawmouseY = shapes_coord[i][3]+shapes_coord[i][1];
      const stop3Ddraw_x0 = shapes_coord[i][0] / rate; //起点x
      const stop3Ddraw_y0 = shapes_coord[i][1] / rate; //起点y
      const stop3Ddraw_x1 = shapes_coord[i][0] / rate;
      const stop3Ddraw_y1 = drawmouseY / rate;
      const stop3Ddraw_x2 = drawmouseX / rate;
      const stop3Ddraw_y2 = drawmouseY / rate;
      const stop3Ddraw_x3 = drawmouseX / rate;
      const stop3Ddraw_y3 = shapes_coord[i][1] / rate;

      //  // 再画其他小的，顺时针（镜像）
      // path.moveTo(stop3Ddraw_x0, -stop3Ddraw_y0);
      // path.lineTo(stop3Ddraw_x1, -stop3Ddraw_y1);
      // path.lineTo(stop3Ddraw_x2, -stop3Ddraw_y2);
      // path.lineTo(stop3Ddraw_x3, -stop3Ddraw_y3);
      // //
        //逆时针(镜像)
      path.moveTo(stop3Ddraw_x0, -stop3Ddraw_y0);
      path.lineTo(stop3Ddraw_x3, -stop3Ddraw_y3);
      path.lineTo(stop3Ddraw_x2, -stop3Ddraw_y2);
      path.lineTo(stop3Ddraw_x1, -stop3Ddraw_y1);
      // console.log(i)
      // console.log(path)

    }
  }
  stop3Ddraw = true;



  // if(stop3Ddraw == false){
  // // test 大方块，顺时针
  // path.moveTo(0, 0);
  // path.lineTo(20, 0);
  // path.lineTo(20, 20);
  // path.lineTo(0, 20);
  // stop3Ddraw = true;
  // }

  // if(stop3Ddraw == true){
  //  // test 小方块能否布尔运算，逆时针
  //  path.moveTo(10, 10);
  //  path.lineTo(10, 20);
  //  path.lineTo(20, 20);
  //  path.lineTo(20, 10);
  //   }




    //创建布尔路径shapepath
    const simpleShape = path.toShapes(true, false);
    console.log(simpleShape)

    //shapepath绘制的对象挤出extrude
    const shape3d = new THREE.ExtrudeGeometry(simpleShape, {
        // depth: 2,
        bevelEnabled: false
      });
    // console.log(shape3d)

    //挤出obj的material和mesh
    const shapematerial = new THREE.MeshBasicMaterial({color: 'rgb(13,56,230)'});
    const shapemesh = new THREE.Mesh(shape3d, shapematerial);

    scene.add(shapemesh);


  }


//点击删除按钮，删除3D模型
function clear3Dcanvas(){
  // scene.remove(cubelist);
  scene.clear();
  // scene.add(new THREE.AxesHelper(50)); //添加坐标轴辅助线

}


// 创建底面，用来看的清楚，最后在initmodel处取消
function initPlane() {
  const planeGeometry = new THREE.PlaneGeometry(50, 50, 1, 1); //创建一个平面几何对象,PlaneGeometry(width : Float, height : Float, widthSegments : Integer, heightSegments : Integer)

  //材质
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 'rgb(140,137,137)',
    transparent: true,
    opacity: 1.0 //透明度
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  //设置平面位置
  plane.rotation.x = -0.5 * Math.PI;
  //y方向position，y轴向下偏移512/rate的值
  plane.position.set(0, -25.6/2, 0);

  //平面添加到场景中
  scene.add(plane);
}

//初始化渲染器
function initRender() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setClearColor(0x111111, 1); //设置背景颜色
  renderer.setSize(width,height);
  //renderer.shadowMap.enabled = true; //显示阴影
  document.getElementById("WebGL-output").appendChild(renderer.domElement);
}
//初始化轨道控制器
function initControls() {
  clock = new THREE.Clock(); //创建THREE.Clock对象，用于计算上次调用经过的时间
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  // controls.autoRotate = true; //是否自动旋转
}
//性能监控
function initStats() {
  stats = new Stats();
  stats.setMode(0); //0: fps, 1: ms
  document.getElementById("Stats-output").appendChild(stats.domElement);
}
//render
function render() {

  const delta = clock.getDelta(); //获取自上次调用的时间差
  controls.update(delta); //控制器更新
  stats.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

//页面初始化
function init() {
  initScene();
  initCamera();
  // initLight();
  // initPlane();
  // shapecutted();//在sketch.js里调用
  // clear3Dcanvas();//在sketch.js里调用
  initRender();
  initStats();
  initControls();
  render();
}

window.onload = init;