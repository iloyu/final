// 绿色小球
const GreenBalls = function () {
  this.generate();
}

GreenBalls.prototype.generate = function () {
  // 删除已有mesh
  if (this.meshArr) {
    for (let i = 0; i < this.meshArr.length; i++) {
      this.mesh.remove(this.meshArr[i]);
    }
  }
  // 生成一排绿色球
  this.mesh = new THREE.Object3D();
  this.meshArr = [];
  const geom = new THREE.TetrahedronGeometry(10, 0);
  const mat = new THREE.MeshPhongMaterial({
    color: 0x00CD66,
    shininess: 0,
    specular: 0xFFFFFF
  });
  mat.flatShading = true;
  // 每次几个球
  const count = Math.floor(2 + Math.random() * 6);
  const ANGLE = Math.PI / 50;
  // 高度范围620-800
  const h = 100 + Math.random() * 180;
  for (let i = 0; i < count; i++) {
    const greenBallMesh = new THREE.Mesh(geom.clone(), mat);
    greenBallMesh.position.x = Math.sin(ANGLE * i + Math.PI / 3) * h;
    greenBallMesh.position.y = 20;
    greenBallMesh.position.z = Math.cos(ANGLE * i + Math.PI / 3) * h;
    // greenBallMesh.rotation.y = Math.random() * Math.PI;
    // greenBallMesh.rotation.z = Math.random() * Math.PI;
    // greenBallMesh.angle = ANGLE * i + Math.PI / 3;
    greenBallMesh.h = h;
    this.mesh.add(greenBallMesh);
    this.meshArr.push(greenBallMesh);
  }
  // this.mesh.position.y = -600;
  scene.add(this.mesh);
};

GreenBalls.prototype.update = function (deltaTime,angleSpeed,position) {
  const count = this.meshArr.length;
  for (let i = 0; i < count; i++) {
    this.meshArr[i].angle -= deltaTime * angleSpeed;
    const angle = this.meshArr[i].angle;
    const h = this.meshArr[i].h;
    this.meshArr[i].position.x = Math.sin(angle) * h;
    this.meshArr[i].position.y =20;
    this.meshArr[i].position.z = Math.cos(angle) * h;
    // 判断是否碰撞
    let diffX = this.meshArr[i].position.x - position.x;
    diffX = diffX > 0 ? diffX : -diffX;
    let diffZ = this.meshArr[i].position.z - position.z;
    diffZ = diffZ > 0 ? diffZ : -diffZ;
    if (diffX < 10&&
      diffZ < 10) {
        particles.generate(10, position.clone(), 0x009999, 3);
        this.mesh.remove(this.meshArr[i]);
        // this.meshArr.shift();
        // 计分
      score += 50;

        break;
    }
  }
  // 绿球都被吃或超过左边界
  if (this.meshArr.length === 0 || this.meshArr[0].angle < -Math.PI / 3) {
    this.generate();
  }
};
