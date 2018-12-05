var scale=0.5;
var globalSpeedRate=1;
//颜色+材质盘
var yellowMat = new THREE.MeshPhongMaterial({
        color: 0xfdde8c,
        shading: THREE.FlatShading
      });

      var redMat = new THREE.MeshPhongMaterial({
        color: 0xcb3e4c,
        shading: THREE.FlatShading
      });

      var whiteMat = new THREE.MeshPhongMaterial({
        color: 0xfaf3d7,
        shading: THREE.FlatShading
      });

      var brownMat = new THREE.MeshPhongMaterial({
        color: 0x874a5c,
        shading: THREE.FlatShading
      });

      var blackMat = new THREE.MeshPhongMaterial({
        color: 0x403133,
        shading: THREE.FlatShading
      });
      var pinkMat = new THREE.MeshPhongMaterial({
        color: 0xd0838e,
        shading: THREE.FlatShading
      });
     //制造正方体
function makeCube(mat, w, h, d, posX, posY, posZ, rotX, rotY, rotZ) {
  var geom = new THREE.BoxGeometry(w, h, d);
  var mesh = new THREE.Mesh(geom, mat);
  mesh.position.x = posX;
  mesh.position.y = posY;
  mesh.position.z = posZ;
  mesh.rotation.x = rotX;
  mesh.rotation.y = rotY;
  mesh.rotation.z = rotZ;
  return mesh;
}
//制造圆柱体
function makeRound(mat, r, h, o, posX, posY, posZ, rotX, rotY, rotZ) {
  var geom = new THREE.CylinderGeometry(r,r,h,8,1,o);
  var mesh = new THREE.Mesh(geom, mat);
  mesh.position.x = posX;
  mesh.position.y = posY;
  mesh.position.z = posZ;
  mesh.rotation.x = rotX;
  mesh.rotation.y = rotY;
  mesh.rotation.z = rotZ;
  return mesh;
}
Pig = function() {
      this.tailAmplitude = 3*scale*scale;

      this.tailAngle = 0;
      this.tailSpeed = .07;
      this.earAmplitude = Math.PI / 16;
      this.earAngle = 0;
      this.earSpeed = 0.1

      this.threegroup = new THREE.Group();
      // 身体
      this.body = new THREE.Group();
      //主躯干
      this.bellyRadius=45*scale;
      var geomBelly = new THREE.SphereGeometry(this.bellyRadius, 8*scale, 6, 0, Math.PI * 2, 0, Math.PI);
      var matBelly = new THREE.MeshPhongMaterial({
        color: 0xf25346,
        shading: THREE.FlatShading
      });

      this.belly = new THREE.Mesh(geomBelly, matBelly);
      this.belly.castShadow = true;
      this.belly.receiveShadow = true;
      // 尾巴
      this.tail = new THREE.Group();
      this.tail.position.z = 20*scale*scale;
      this.tail.position.y = 10*scale*scale;

      var tailMat = new THREE.LineBasicMaterial({
        color: 0x5da683,
        linewidth: 5*scale
      });

      var tailGeom = new THREE.Geometry();
      tailGeom.vertices.push(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 5*scale*scale, -10*scale*scale),
        new THREE.Vector3(0, -5*scale*scale, -20*scale*scale),
        new THREE.Vector3(0, 0, -100*scale*scale)//-100
      );

      this.tailLine = new THREE.Line(tailGeom, tailMat);

      // 尾巴尖
      var pikeGeom = new THREE.CylinderGeometry(0, 10*scale, 10*scale, 4*scale, 1*scale);
      pikeGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      this.tailPike = new THREE.Mesh(pikeGeom, yellowMat);
      this.tailPike.scale.set(.2*scale, 1*scale, 1*scale);
      this.tailPike.position.z = -105*scale*scale;
      this.tailPike.position.y = 0;

      this.tail.add(this.tailLine);
      this.tail.add(this.tailPike);
      this.body.add(this.belly);
      this.body.add(this.tail);

      // 头
      this.head = new THREE.Group();

      // 脸
      this.face = makeRound(pinkMat, 30*scale, 45*scale, false, 0, 10*scale, 0, -Math.PI / 2, 0, 0);
      this.earsL = makeCube(yellowMat, 2*scale, 35*scale, 10*scale, 0, 0, 10*scale,0 ,0 , 0);//-Math.PI / 4-Math.PI / 4
     this.earsL.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 45*scale, 0));
     this.earsR = this.earsL.clone();
      this.earsR.position.y = -this.earsL.position.y;
      this.earsR.rotation.z = -this.earsL.rotation.z;

      // 笑　圆环面（TorusGeometry）的形状类似甜甜圈，
      var smileGeom = new THREE.TorusGeometry(6*scale, 2*scale, 2, 10*scale, Math.PI);
      this.smile = new THREE.Mesh(smileGeom, blackMat);
      this.smile.position.z = 15;
      this.smile.position.y = 0;//-10*scale;
      this.smile.rotation.z = -Math.PI;

      // 眼睛
      this.eyeL = makeCube(blackMat, 5*scale, 5*scale, 8*scale, 10*scale, 30*scale, 20*scale, 0, 0, 0);
      console.log(this.eyeL.position);
      this.eyeR = this.eyeL.clone();
      this.eyeR.position.x = -this.eyeL.position.x;

      this.head.position.z = 30*scale;
      this.head.add(this.face);
      this.head.add(this.earsL);
      this.head.add(this.earsR);
      this.head.add(this.eyeL);
      this.head.add(this.eyeR);
      this.head.add(this.smile);
      // 四肢
      this.legFL = makeCube(blackMat, 40*scale, 10*scale, 20*scale, 40*scale, -60*scale, 40*scale, 0, 0, 0);
      this.legFR = this.legFL.clone();
      this.legFR.position.x =-this.legFL.position.x;
      this.legBL = this.legFL.clone();
      this.legBL.position.z =-this.legFL.position.z;
      this.legBR = this.legBL.clone();
      this.legBR.position.x =  -this.legBL.position.x;

      this.threegroup.add(this.body);
      this.threegroup.add(this.head);
      this.threegroup.add(this.legFL);
      this.threegroup.add(this.legFR);
      this.threegroup.add(this.legBL);
      this.threegroup.add(this.legBR);

      var up = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 10, 0x00ff00);
     var  horizontal = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 10, 0x00ffff);
      var down = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(), 10, 0xffff00);

      this.threegroup.add(up);
      this.threegroup.add(horizontal);
      this.threegroup.add(down);

      this.threegroup.traverse(function(object) {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
};
Pig.prototype.update = function() {

  this.tailAngle += this.tailSpeed / globalSpeedRate;
  this.earAngle += this.earSpeed / globalSpeedRate;
  for (var i = 0; i < this.tailLine.geometry.vertices.length; i++) {
    var v = this.tailLine.geometry.vertices[i];
    v.y = Math.sin(this.tailAngle - (Math.PI / 3) * i) * this.tailAmplitude * i * i;
    v.x = Math.cos(this.tailAngle / 2 + (Math.PI / 10) * i) * this.tailAmplitude * i * i;
    if (i == this.tailLine.geometry.vertices.length - 1) {
      this.tailPike.position.x = v.x;
      this.tailPike.position.y = v.y;
      this.tailPike.rotation.x = (v.y / 30);
    }
  }
  this.tailLine.geometry.verticesNeedUpdate = true;

  this.earsL.rotation.z = -Math.PI / 3 + Math.cos(this.earAngle) * this.earAmplitude;
  this.earsR.rotation.z = Math.PI / 3 - Math.cos(this.earAngle) * this.earAmplitude;

};
var PI=Math.PI;
Pig.prototype.run = function(velo){

 var rot=-Math.atan(velo.z/velo.x);

 this.legFL.rotation.y=rot;
 this.legFR.rotation.y =rot;
 this.legBL.rotation.y=rot;
 this.legBR.rotation.y =rot;

};
