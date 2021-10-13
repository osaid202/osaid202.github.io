import './style.css'
//import * as THREE from 'three';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.133.1/build/three.module.js';
import {OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

//Three required elements.
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  //dom element
  canvas: document.querySelector('#bg'),

})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30); 

//Three required elements for any shape.
//Torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
//mesh standard is too expensive.
const material = new THREE.MeshPhongMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);

torus.position.set(-250,50,-100)
scene.add(torus);

const torus_p_light = new THREE.PointLight(0xffffff, 1, 100);
const name_p_light = new THREE.PointLight(0xffffff);

name_p_light.position.set()
torus_p_light.position.set(20,5,30);

const ambientLight = new THREE.AmbientLight(0xffffff);

const lightHelper = new THREE.PointLightHelper(torus_p_light);
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(lightHelper, gridHelper);

scene.add(torus_p_light, ambientLight);
//Alows mouse camera pans
const controls = new OrbitControls(camera, renderer.domElement)

//Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24)
  const material = new THREE.MeshPhongMaterial( {color: 0xffffff})
  const star = new THREE.Mesh( geometry, material)

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))
  
  star.position.set(x, y, z)
  scene.add(star)
}
Array(200).fill().forEach(addStar)

//Mars sphere
const marsTexture = new THREE.TextureLoader().load('mars_2k_color.jpg')
//not working?
const normalTexture = new THREE.TextureLoader().load('mars_2k_normal.jpg')
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshPhongMaterial({map: marsTexture, normalMap: normalTexture})
)
mars.position.z = 30;
mars.position.setX(-10)
scene.add(mars)

//3D name object
const loader = new GLTFLoader();
//move inside loader?
/* const dddname = new THREE.Object3D();
dddname.matrix.scale(1000);
 */
loader.load('name.gltf', function(gltf){
  let model = gltf.scene;
/* 
  model.traverse(o => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
 */
  scene.add(model);

  model.scale.set(100,100, 70);
}, undefined, function (error){
  console.error(error);
});

//can use a callback function  for a loading bar 
const spaceTexture = new THREE.TextureLoader().load('space.jpg')
scene.background = spaceTexture;

function moveCamera() {
  const t = document.body.getBoundingClientRect().top
  mars.rotation.x += 0.05
  mars.rotation.y += 0.075
  mars.rotation.z += 0.05

  camera.position.z = t * -0.005 +30
  camera.position.x = t * -0.005
}

document.body.onscroll = moveCamera

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();