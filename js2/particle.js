Particles = function () {

  this.mesh = new THREE.Object3D();

  scene.add(this.mesh)

}
const Particle = function() {
  const geom = new THREE.TetrahedronGeometry(3, 0);
  const mat = new THREE.MeshPhongMaterial({
    color: 0x009999,
    shininess: 0,
    specular: 0xFFFFFF
  });
  mat.flatShading = true;
  this.mesh = new THREE.Mesh(geom,mat);
}
Particle.prototype.animate = function(position, color, scale) {
  this.mesh.material.color = new THREE.Color(color);
  this.mesh.material.needsUpdate = true;
  this.mesh.scale.set(scale, scale, scale);
  // 向周围四散
  const speed = 0.6 + Math.random() * 0.2;
  TweenMax.to(this.mesh.rotation, speed, {
    x: Math.random() * 12, 
    y: Math.random() * 12,
    z: Math.random() * 12
  });
  TweenMax.to(this.mesh.scale, speed, {
    x: 0.1,
    y: 0.1, 
    z: 0.1
  });
  TweenMax.to(this.mesh.position, speed, {
    x: position.x + (Math.random() * 2 - 1) * 50, 
    y: position.y + (Math.random() * 2 - 1) * 50, 
    z:position.z + (Math.random() * 2 - 1) * 50,
    delay: Math.random() * 0.1, 
    ease: Power2.easeOut
  });
}
Particles.prototype.generate = function(count, position, color, scale) {
  for (var i = 0; i < count; i++) {
    const particle = new Particle();
    particle.mesh.visible = true;
    particle.mesh.position.x = position.x ;
    particle.mesh.position.y = position.y;
    particle.mesh.position.z = position.z;
    this.mesh.add(particle.mesh);
    particle.animate(position, color, scale);
  }
}