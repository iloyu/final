//three js 变量;
var scene,
  camera,mapCamera,
  pointcontrols,
  trackballcontrols,
  fieldOfView,
  aspectRatio,
  nearPlane,
  farPlane,
  shadowLight,
  backLight,
  light,renderer,
  maprenderer,
  container;
  var mapHeight=200;
  var mapWidth=200;
//窗口变量
var HEIGHT,
  WIDTH,
  windowHalfX,
  windowHalfY,
  mousePos = {
    x: 0,
    y: 0
  };
  //cannon
var world,sphereBody;
//动画
var speed=1000;
var upSpeed=800;
var velocity = new THREE.Vector3();
var rotation = new THREE.Vector3();
var direction = new THREE.Vector3();
var raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
var upRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3( 0, 1, 0), 0, 10);
var horizontalRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 10);
var downRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3( 0, -1, 0), 0, 10);
//场景对象，游戏变量
var pig,buildings,land,flos,tube,score=0;
var cubeNum=10;
var cubeHeight=250;
var color = new THREE.Color();
var angleSpeed=0.5;
var boxes=[];
var boxMeshes=[];
var greenBalls;
var particles;
//记分板
var fieldDistance,energyBar,replayMessage,energy=100;
var clock = new THREE.Clock();
fieldDistance = document.getElementById("distValue");
replayMessage = document.getElementById("replayMessage");
energyBar = document.getElementById("energyBar");
var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );
var pointcontrolsEnabled = false;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var spaceUp = true; //处理一直按着空格连续跳的问题
//datgui变量
var gui;
var datGui;
//调色板
 var Colors ={
        white:'#f7fff3',
        flo1:'#e0c9e4',
        flo2:'#e4c4c0',
        flo3:'#e4a5a7',
        branch1:'#435516',
        branch2:'#55492c',
        blue:'#65f7e2',
        glass:'#95e9aa'
    };




function initControls(){
  trackballcontrols = new THREE.TrackballControls(camera);     //创建场景旋转缩放事件
  trackballcontrols.rotateSpeed = 2.5;
  trackballcontrols.zoomSpeed = 1.2;
  trackballcontrols.panSpeed = 0.8;
  trackballcontrols.noZoom = false;
  trackballcontrols.noPan = false;
  trackballcontrols.staticMoving = true;
  trackballcontrols.dynamicDampingFactor = 0.3;
  pointcontrols = new THREE.PointerLockControls( camera );
  pointcontrols.getObject().position.y = 50;
  pointcontrols.getObject().position.x = 0;
  scene.add( pointcontrols.getObject() );
        var onKeyDown = function ( event ) {
            switch ( event.keyCode ) {
                case 38: // up
                case 87: // w
                    moveForward = true;
                    break;
                case 37: // left
                case 65: // a
                    moveLeft = true;
                    break;
                case 40: // down
                case 83: // s
                    moveBackward = true;
                    break;
                case 39: // right
                case 68: // d
                    moveRight = true;
                    break;
                case 32: // space
                    if ( canJump && spaceUp ) velocity.y += upSpeed;
                    canJump = false;
                    spaceUp = false;
                    break;
            }
        };
        var onKeyUp = function ( event ) {
            switch( event.keyCode ) {
                case 38: // up
                case 87: // w
                    moveForward = false;
                    break;
                case 37: // left
                case 65: // a
                    moveLeft = false;
                    break;
                case 40: // down
                case 83: // s
                    moveBackward = false;
                    break;
                case 39: // right
                case 68: // d
                    moveRight = false;
                    break;
                case 32: // space
                    spaceUp = true;
                    break;
            }
        };
        document.addEventListener( 'keydown', onKeyDown, false );
        document.addEventListener( 'keyup', onKeyUp, false );
  }

function initGui(){
  //声明一个保存需求修改的相关数据的对象
        gui = {
            smileRZ:0, //笑脸
            Pigspeed:1000,
            buildingNum:10,
            // pigrot:0
        };
        datGui = new dat.GUI();
        //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
        datGui.add(gui,"smileRZ",-Math.PI,Math.PI);
        datGui.add(gui,"Pigspeed",1000,2000);
        datGui.add(gui,"buildingNum",10,100);
         // datGui.add(gui,"pigrot",-Math.PI,Math.PI);
}
function initAxes(){
  var axes = new THREE.AxisHelper(2000);               //创建三轴表示
  scene.add(axes);

}
function initScene() {
  scene = new THREE.Scene();
  // scene.background=createCubeMap();
   scene.fog = new THREE.Fog('#f7fff3', 100,950);
  // scene.fog = new THREE.Fog( 0xf7d9aa, 450, 500);
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  // renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  maprenderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  maprenderer.setSize(mapWidth, mapHeight);
  document.getElementById('map').appendChild(maprenderer.domElement);
  window.addEventListener('resize', onWindowResize, false);

  stats= new Stats();
  sta = document.getElementById('stats');
  sta.appendChild(stats.domElement);
}

function onWindowResize() {
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function initCamera(){
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 0.1;
  farPlane = 1000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane);
  camera.position.x = 0;
  camera.position.z = 300;
  camera.position.y = 100;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  // orthographic 相机
    mapCamera = new THREE.OrthographicCamera(
      window.innerWidth / -2,       // Left
      window.innerWidth / 2,        // Right
      window.innerHeight / 2,       // Top
      window.innerHeight / -2,  // Bottom
      -5000,                        // Near
      2000 );                      // Far
    mapCamera.up = new THREE.Vector3(0,0,-1);
    mapCamera.lookAt( new THREE.Vector3(0,-1,0) );
    scene.add(mapCamera);
}
 function Land(){
        var geom = new THREE.PlaneGeometry( 1000, 1000);//(700,80,80);
        geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
        var mat = new THREE.MeshPhongMaterial({
            color:Colors.glass,
            transparent:true,
            opacity:0.8,
            shading:THREE.FlatShading
        });
        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.receiveShadow = true;

    }
    function CreateLand(){
        land = new Land();
        land.mesh.position.y = -550;
        land.mesh.position.x = 80;
        land.mesh.position.z = -50;
        scene.add(land.mesh);
    }
function addCube(cubeNum){

    var boxGeometry = new THREE.BoxGeometry(50,cubeHeight,50,10,100,10);
    var radius=cubeNum+250;
    for ( var i = 0; i < cubeNum; i ++ )
    {
      var boxMaterial = new THREE.MeshPhongMaterial({color:Math.random()*0xffffff});
      // var texture = THREE.ImageUtils.loadTexture("image/box.jpg",null,function(t)
      //       {
      //       });
      // var boxMaterial = new THREE.MeshPhongMaterial( {map:texture,color:Math.random()*0xffffff});//,side:THREE.DoubleSide,side:THREE.DoubleSidecolor:Math.random()*0xffffff
      var box = new THREE.Mesh( boxGeometry, boxMaterial );

      box.position.z = Math.floor(radius*(Math.sin(i)+Math.random()) );//Math.random() * 2 - 1 ) * 50;
      box.position.y = 25;//Math.floor( Math.random() * 20 ) * 20 + 10;
      box.position.x = Math.floor( radius*(Math.cos(i)+Math.random()));
      box.name=i;
      scene.add( box);
      boxes.push( box );
  }
}

function createGreenballs(){
  greenBalls = new GreenBalls();
  particles = new Particles();
}

function createCubeMap() {

        var path = "image/Yokohama/";//nature 可以修改为不同文件夹下的纹理
        var format = '.jpg';
        var urls = [
            path + 'posx' + format, path + 'negx' + format,
            path + 'posy' + format, path + 'negy' + format,
            path + 'posz' + format, path + 'negz' + format
        ];
        var textureCube = THREE.CubeTextureLoader(urls);//THREE.CubeTextureLoader()// new THREE.CubeReflectionMapping()
        return textureCube;
  }

function sky(){
  var textureCube=createCubeMap();
  var shader = THREE.ShaderLib['cube'];
  shader.uniforms['tCube'].value = textureCube;
  var material = new THREE.ShaderMaterial({
      fragmentShader:shader.fragmentShader,
      vertexShader:shader.vertexShader,
      uniforms:shader.uniforms,
      depthWrite:false,
      side:THREE.BackSide,
});
cubeMesh = new THREE.Mesh(new THREE.CubeGeometry(500,500,500),material);
scene.add(cubeMesh);
}
function createLights()
{

  var ambient = new THREE.AmbientLight(0x111111);
  scene.add(ambient);
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0xffffff, .9);
  shadowLight = new THREE.DirectionalLight(0xffffff, .5);
  shadowLight.position.set(0, 200, 0);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;
  scene.add(hemisphereLight);
  scene.add(shadowLight);
}

function createBuilding(){
buildings=new ProceduralCity();
scene.add(buildings)
}
 function MuitiFlo(){
        this.mesh = new THREE.Object3D();
        this.nFlowers = 50;
        var stepAngle = Math.PI*2 / this.nFlowers;
        for(var i=0; i<this.nFlowers; i++){
            var c = new Flower();
            var a = stepAngle*i;
            var h = 650 + Math.random()*200;
            c.mesh.position.y = Math.sin(a)*h;
            c.mesh.position.x = Math.cos(a)*h;
            c.mesh.position.z = -100-Math.random()*100;
            c.mesh.rotation.z = a - Math.PI/2;
            var s = 0.2+Math.random()*0.2;
            c.mesh.scale.set(s,s,s);
            this.mesh.add(c.mesh);
        }
 
    }
 
    //花朵
    function Flower() {
        this.mesh = new THREE.Object3D();
 
        var trunk = new THREE.CylinderGeometry(1, 2, 16);
        var petal=new THREE.CylinderGeometry(1, 1, 14);
        var trunkmat = new THREE.MeshPhongMaterial({color: Colors.branch1, shading: THREE.FlatShading});
        var trunkpetal = new THREE.MeshPhongMaterial({color: Colors.flo2, shading: THREE.FlatShading});
        var trunkpetal1 = new THREE.MeshPhongMaterial({color: Colors.flo3, shading: THREE.FlatShading});
        var tmesh = new THREE.Mesh(trunk, trunkmat);
        tmesh.castShadow = true;
        tmesh.receiveShadow = true;
        this.mesh.add(tmesh);
 
        var angleIndex=(Math.PI*2)/12;
        var len,moveX,moveY,moveZ,i;
        for (i = 0; i <12; i++) {
            var m = new THREE.Mesh(petal, trunkpetal);
            m.castShadow = true;
            m.receiveShadow = true;
 
            m.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI/3));
            m.applyMatrix(new THREE.Matrix4().makeRotationY(angleIndex*i));
            len=Math.cos(Math.PI/6)*7;
            moveX=-Math.cos(angleIndex*i)*len;
            moveY=8;
            moveZ=Math.sin(angleIndex*i)*len;
            m.position.set(moveX,moveY,moveZ);
 
            this.mesh.add(m);
        }
 
        angleIndex=(Math.PI*2)/8;
        for (i = 0; i <8; i++) {
            var m1 = new THREE.Mesh(petal, trunkpetal1);
            m1.castShadow = true;
            m1.receiveShadow = true;
 
            m1.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI/6));
            m1.applyMatrix(new THREE.Matrix4().makeRotationY(angleIndex*i));
            len=Math.cos(Math.PI/3)*7;
            moveX=-Math.cos(angleIndex*i)*len;
            moveY=8;
            moveZ=Math.sin(angleIndex*i)*len;
            m1.position.set(moveX,moveY,moveZ);
 
            this.mesh.add(m1);
        }
    }
 


function createPig() {
  pig= new Pig();
  scene.add(pig.threegroup);
}

function normalize(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

function createSky(){
  sky = new Sky();
  sky.mesh.position.y = 20;
  scene.add(sky.mesh);
}
function createFlo(){
    flos = new MuitiFlo();
        flos.mesh.position.y = -550;
        scene.add(flos.mesh);
}


window.addEventListener("click", function(e) {
  if(energy>0) {
    if (pointcontrols.enabled == true) {
      var view=pointcontrols.getObject();
      mousePos.x=(e.clientX-container.getBoundingClientRect().left)/container.offsetWidth*2-1;
      // mousePos.x=(e.clientX/windowHalfX)-1;
      mousePos.y=-(e.clientY-container.getBoundingClientRect().top)/container.offsetWidth*2+1;

      // mousePos.y=-(e.clientY/windowHalfY)+1;
      var vector = new THREE.Vector3(mousePos.x, mousePos.y, 1);
      vector = vector.unproject(camera);
       var raycaster=new THREE.Raycaster(view.position, vector.sub(view.position).normalize());
    var intersects=raycaster.intersectObjects(boxes);
    if(intersects.length>0)
    {
       // var points = [];
       // points.push(intersects[0].point);
       // points.push(view.position);
      // console.log(points[0],points[1]);
      // var mat = new THREE.MeshPhongMaterial({color: 0xFF0000,transparent:true,opacity:0.7});
      // var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 60, 1);
      // if (tube) scene.remove(tube);
      // tube = new THREE.Mesh(tubeGeometry, mat);
       // if (tube) scene.remove(tube);
      // scene.add(tube);
      var position=intersects[0].object.position;
       particles.generate(10, position, 0x009999, 3);
     for( var i =0;i<boxes.length;i++)
     if(boxes[i].name==intersects[0].object.name)
     {
     boxes.splice(i,1);
     break;
   }
       score+=10;
       scene.remove(intersects[0].object);
      }
    }
  }

}
);

function render() {
    pig.smile.rotation.z = gui.smileRZ;
    speed=gui.Pigspeed;
    cubenum=gui.buildingNum;
     trackballcontrols.update();
    // pig.threegroup.rotation.y=gui.pigrot;
  // sky.mesh.rotation.x += .01;
   if ( pointcontrolsEnabled === true ) {
            //获取刷新时间
          var delta = clock.getDelta();
          var view=pointcontrols.getObject();
         //velocity每次的速度，为了保证有过渡
          velocity.x -= velocity.x * 10.0 * delta;
          velocity.z -= velocity.z * 10.0 * delta;
          velocity.y -= 9.8 * 100.0 * delta; // 默认下降的速度
          direction.z = Number( moveForward ) - Number( moveBackward );
          direction.x = Number( moveLeft ) - Number( moveRight );
          direction.normalize();

          pig.threegroup.position.copy(view.position);
                      //判断是否接触到了模型
          rotation.copy(view.getWorldDirection().multiply(new THREE.Vector3(-1, 0, -1)));
           //判断鼠标按下的方向
            var m = new THREE.Matrix4();
            if(direction.z > 0){
                if(direction.x > 0){
                    m.makeRotationY(Math.PI/4);
                }
                else if(direction.x < 0){
                    m.makeRotationY(-Math.PI/4);
                }
                else{
                    m.makeRotationY(0);
                }
            }
            else if(direction.z < 0){
                if(direction.x > 0){
                    m.makeRotationY(Math.PI/4*3);
                }
                else if(direction.x < 0){
                    m.makeRotationY(-Math.PI/4*3);
                }
                else{
                    m.makeRotationY(Math.PI);
                }
            }
            else{
                if(direction.x > 0){
                    m.makeRotationY(Math.PI/2);
                }
                else if(direction.x < 0){
                    m.makeRotationY(-Math.PI/2);
                }
            }
            //给向量使用变换矩阵
            rotation.applyMatrix4(m);
            horizontalRaycaster.set( view.position , rotation );

            var horizontalIntersections = horizontalRaycaster.intersectObjects( boxes);
            var horOnObject = horizontalIntersections.length ;
                var flag=false;
            //判断移动方向修改速度方向
           for(var i=0;i<horOnObject;i++)
          // {console.log(horizontalIntersections);
           {
             if(horizontalIntersections[i].distance<15)
             {
              flag=true;
              if(energy>0)
              energy-=10;
              console.log("检测到碰撞");
              break;
            }
          }
          if(!flag){
            if ( moveForward || moveBackward ) velocity.z -= direction.z * speed * delta;
                if ( moveLeft || moveRight ) velocity.x -= direction.x * speed * delta;
               pig.run(velocity);
          }

            //复制相机的位置
            downRaycaster.ray.origin.copy( view.position );
            //获取相机靠下10的位置
            downRaycaster.ray.origin.y -= 10;
            //判断是否停留在了立方体上面
            var intersections = downRaycaster.intersectObjects( scene.children, true);
            var onObject = intersections.length > 0;
            //判断是否停在了立方体上面
            if ( onObject === true ) {
                velocity.y = Math.max( 0, velocity.y );
                canJump = true;
            }
            //根据速度值移动控制器
            view.translateX( velocity.x * delta );
            view.translateY( velocity.y * delta );
            view.translateZ( velocity.z * delta );
            //保证控制器的y轴在10以上
            if ( view.position.y < 10 ) {
                velocity.y = 0;
                view.position.y = 0;
                canJump = true;
            }
          pig.threegroup.position.copy(view.position);
          pig.threegroup.rotation.y=view.rotation.y+Math.PI;
          greenBalls.update(delta,angleSpeed,pig.threegroup.position);
          fieldDistance.innerHTML = Math.floor(score);
          UpdateEnergy();
  if(energy>0)
    hideReplay();
    }
    flos.mesh.rotation.z += .002;
      renderer.render(scene, camera);
      mapCamera.position.x=camera.position.x;
      mapCamera.position.z=camera.position.z;
      maprenderer.render(scene,mapCamera);
}

function loop() {
  render();
  pig.update();
  stats.update();
  requestAnimationFrame(loop);
}
function showReplay(){
  replayMessage.style.display="block";
}

function hideReplay(){
  replayMessage.style.display="none";
}
function UpdateEnergy(){
  if(energy>100)energy=100;
  energyBar.style.right = (100-energy)+"%";
  energyBar.style.backgroundColor = (energy<50)? "#f25346" : "#68c3c0";
  if (energy<30){
    energyBar.style.animationName = "blinking";
  }else{
    energyBar.style.animationName = "none";
  }

  if (energy <1){
   showReplay();
  }
}
initPointerLock();
initGui();
initScene();
initCamera();
// initAxes();
initControls();
createLights();
createPig();
CreateLand();
createFlo();
createGreenballs();
addCube(cubeNum);
// sky();
// createBuilding();
createSky();
// createEnnemies();
loop();

