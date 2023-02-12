import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';
import nebula from '../../assets/nebula.jpg'
import star from '../../assets/star.jpg'


//Use for rendering the convas in our web application
const renderer = new THREE.WebGLRenderer();
//Setting the size of the renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
//displaying it in the DOM
document.body.appendChild(renderer.domElement);

//Creating a scene where you can add an object to it
const scene = new THREE.Scene();

//add texture
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(star);

const cubeTextureLoader = new THREE.CubeTextureLoader();
// scene.background = cubeTextureLoader.load([
//     nebula,
//     nebula,
//     star,
//     star,
//     star,
//     star
// ])

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//orbit is used to move the camera of axes using mouse
const orbit = new OrbitControls(camera, renderer.domElement);

//Helper for x, y and z axes
const axesHelper = new THREE.AxesHelper(2);

//adding axeshelper in scene
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);
//setting the position of camera
camera.position.set(0, 5, 20);

//updating the camera every time the mouse is moved
orbit.update();

//creating an CUBE
const boxGeometry = new THREE.BoxGeometry(7, 7, 7);
const boxMaterial = new THREE.MeshStandardMaterial({ color: "red" });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
//Adding the object to the scene
scene.add(box);
box.position.y = 7;


//Plane object
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({ 
    color: "white",
    //Plane from downside is not there so to add it, we add THREE.DoubleSide
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

//SPHERE object

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 'blue',
    wireframe: false
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

sphere.position.set(-10, 4, 0);
//Rotate the plane to grid alignment
plane.rotation.x = -0.5 * Math.PI;


const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
scene.add(directionalLight);

directionalLight.position.set(-30, 50, 0);

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(dLightHelper);
//For customization and debugging we use dat.gui
const gui = new dat.GUI();

const option = {
    sphereColor: '#ccc',
    cubeColor: '#ccc',
    speed: 0.01,
    rotation: 10
}

const shape = [{
    name: 'sphere',
    color: 'sphereColor'
},
{
    name: 'box',
    color: 'cubeColor'
}];

//Dynamically addition of color for the objects
gui.addColor(option, 'sphereColor').onChange( (e) => {
    sphere.material.color.set(e);
})

gui.addColor(option, 'cubeColor').onChange( (e) => {
    box.material.color.set(e);
})

gui.add(option, 'speed', 0, 0.1);

gui.add(option, 'rotation', 10, 1000);

let step = 5;
sphere.castShadow = true;
plane.receiveShadow = true;
directionalLight.castShadow = true
directionalLight.shadow.camera.bottom = -12;
//time - function which give us the time ( random )
function animate(time) {
  box.rotation.x = time / option.rotation;
  box.rotation.y = time / option.rotation;

  //setting dynamic motion of the sphere
  step += option.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step)) + 4;
  renderer.render(scene, camera);
}

//changing the background
renderer.setClearColor(0xFFEA00)



//calling the animation in loop for the rotation
renderer.setAnimationLoop(animate);
