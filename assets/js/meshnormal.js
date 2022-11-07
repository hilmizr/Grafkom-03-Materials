import * as THREE from "three";
import { OrbitControls } from "orbitControls";
import GUI from "https://cdn.jsdelivr.net/npm/lil-gui@0.17/+esm";
import { Color, CubeReflectionMapping, CubeRefractionMapping } from "three";

const scene = new THREE.Scene();

// Perspective camera most closely mimics real world and human eye
var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x += 0;
camera.position.y += 2;
camera.position.z += 7;

var renderer = new THREE.WebGLRenderer({
  antialias: true,
});
// renderer.setClearColor("#e5e5e5");
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Auto resize windows
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Textures and Materials
const brickTexture = new THREE.TextureLoader().load("./assets/img/brick.jpg");
const brickAlpha = new THREE.TextureLoader().load("./assets/img/brick_alpha.png");
const cobblestoneTexture = new THREE.TextureLoader().load("./assets/img/cobblestone.png");
const cobblestoneAlpha = new THREE.TextureLoader().load("./assets/img/cobblestone_alpha.png");
const diamondTexture = new THREE.TextureLoader().load("./assets/img/diamond.png");
const diamondAlpha = new THREE.TextureLoader().load("./assets/img/diamond_alpha.png");
const obsidianTexture = new THREE.TextureLoader().load("./assets/img/obsidian.png");
const obsidianAlpha = new THREE.TextureLoader().load("./assets/img/obsidian_alpha.png");
const damascusTexture = new THREE.TextureLoader().load("./assets/img/damascus_steel.jpg");
const damascusAlpha = new THREE.TextureLoader().load("./assets/img/damascus_steel_alpha.png");

const guiTextureHash = {
  none: 0,
  brick: brickTexture,
  brick_alpha: brickAlpha,
  cobblestone: cobblestoneTexture,
  cobblestone_alpha: cobblestoneAlpha,
  diamond: diamondTexture,
  diamond_alpha: diamondAlpha,
  obsidian: obsidianTexture,
  obsidian_alpha: obsidianAlpha,
  damascus: damascusTexture,
  damascus_alpha: damascusAlpha,
};

// Radius, Width and Height
// x,y,z position
var box = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
var boxMat = new THREE.MeshNormalMaterial();
var boxMesh = new THREE.Mesh(box, boxMat);
// Poisition coordinates x,y,z
boxMesh.position.set(0, 0.5, 0.5);
boxMesh.scale.set(1, 1, 1);
scene.add(boxMesh);

let planeGeo = new THREE.PlaneGeometry(100, 100);
let planeMesh = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
planeMesh.rotation.x -= Math.PI / 2;
planeMesh.position.y -= 0.5;
scene.add(planeMesh);

var Grid = new THREE.GridHelper(100, 100, 0x0a0a0a, 0x000000);
Grid.position.set(0, -0.5, 0);
scene.add(Grid);

let stopCount = 0;
let transCount = 0;
var options = {
  boxReset: function () {
    boxMesh.scale.set(1, 1, 1);
    boxMesh.rotation.set(0, 0, 0);
    boxMesh.position.set(0, 0.5, 0.5);
    boxMat.map = 0;
    boxMat.alphaMap = 0;
    boxMat.bumpMap = 0;
    boxMat.needsUpdate = true;
  },
  stop: function () {
    if (stopCount % 2 == 0) vely = 0;
    else if (stopCount % 2 == 1) vely = 0.01;
    stopCount += 1;
  },
};

let gui = new GUI();

const boxFolder = gui.addFolder("Box");

const rotateFolder = boxFolder.addFolder("Rotation");
rotateFolder.add(boxMesh.rotation, "x", 0, Math.PI * 2);
rotateFolder.add(boxMesh.rotation, "y", 0, Math.PI * 2);
rotateFolder.add(boxMesh.rotation, "z", 0, Math.PI * 2);
rotateFolder.open();

const posFolder = boxFolder.addFolder("Position");
posFolder.add(boxMesh.position, "x", -4, 4);
posFolder.add(boxMesh.position, "y", 0, 4);
posFolder.add(boxMesh.position, "z", -4, 4);
posFolder.open();

const scaleFolder = boxFolder.addFolder("Scale");
scaleFolder.add(boxMesh.scale, "x", 0, 4).name("Width").listen();
scaleFolder.add(boxMesh.scale, "y", 0, 4).name("Height").listen();
scaleFolder.add(boxMesh.scale, "z", 0, 4).name("Length").listen();
scaleFolder.open();

const materialFolder = boxFolder.addFolder("Material");
let colorPick = materialFolder.addColor(boxMat, "color").name("Color").listen();
let wireframeCheck = materialFolder.add(boxMat, "wireframe").name("Wireframe").listen();
// let flatshadingCheck = materialFolder.add(boxMat, "flatShading").name("FlatShading").listen();

const guiOptions = {
  Map: "none",
  "Alpha Map": "none",
  "Bump Map": "none",
  "Displacement Map": "none",
  Transparent: false,
  FlatShading: false,
};

let transparentCheck = materialFolder.add(guiOptions, "Transparent", true, false).onChange((value) => {
  if (transCount == 0) {
    boxMat.transparent = true;
    boxMat.needsUpdate = true;
    transCount = 1;
  } else if (transCount == 1) {
    boxMat.transparent = false;
    boxMat.needsUpdate = true;
    transCount = 0;
  }
});

let flatshadingCount = 0;
let flatshadingCheck = materialFolder.add(guiOptions, "FlatShading", true, false).onChange(() => {
  if (flatshadingCount == 0) {
    boxMat.flatShading = true;
    boxMat.needsUpdate = true;
    flatshadingCount = 1;
  } else if (flatshadingCount == 1) {
    boxMat.flatShading = false;
    boxMat.needsUpdate = true;
    flatshadingCount = 0;
  }
});

let mapDropdown = materialFolder.add(guiOptions, "Map", Object.keys(guiTextureHash)).onChange((value) => {
  boxMat.map = guiTextureHash[value];
  boxMat.needsUpdate = true;
  console.log("updated", value);
});

let alphaMapDropdown = materialFolder.add(guiOptions, "Alpha Map", Object.keys(guiTextureHash)).onChange((value) => {
  boxMat.alphaMap = guiTextureHash[value];
  boxMat.needsUpdate = true;
  console.log("updated", value);
});

let bumpMapDropdown = materialFolder.add(guiOptions, "Bump Map", Object.keys(guiTextureHash)).onChange((value) => {
  boxMat.bumpMap = guiTextureHash[value];
  boxMat.needsUpdate = true;
  console.log("updated", value);
});

materialFolder.add(boxMat, "bumpScale", 0, 1).name("Bump Scale").listen();

let displacementMapDropdown = materialFolder.add(guiOptions, "Displacement Map", Object.keys(guiTextureHash)).onChange((value) => {
  boxMat.displacementMap = guiTextureHash[value];
  boxMat.needsUpdate = true;
  console.log("updated", value);
});

materialFolder.add(boxMat, "displacementScale", 0, 1).name("Displacement Scale").listen();

var options2 = {
  dropdownReset: function () {
    boxMesh.scale.set(1, 1, 1);
    boxMesh.rotation.set(0, 0, 0);
    boxMesh.position.set(0, 0.5, 0.5);
    boxMat.map = 0;
    boxMat.alphaMap = 0;
    boxMat.bumpMap = 0;
    boxMat.color.set(0x00ffff);
    boxMat.bumpScale = 1;
    boxMat.displacementScale = 1;
    boxMat.needsUpdate = true;
    mapDropdown.setValue("none");
    alphaMapDropdown.setValue("none");
    bumpMapDropdown.setValue("none");
    displacementMapDropdown.setValue("none");
    transparentCheck.setValue(false);
    wireframeCheck.setValue(false);
    flatshadingCheck.setValue(false);
  },
};

boxFolder.open();

boxFolder.add(options2, "dropdownReset").name("Reset").listen();
boxFolder.add(options, "stop").name("Stop").listen();

let keyboard = [];

document.body.onkeydown = function (evt) {
  keyboard[evt.key] = true;
};
document.body.onkeyup = function (evt) {
  keyboard[evt.key] = false;
};

function process_keyboard() {
  if (keyboard["d"]) {
    camera.position.x += 0.03;
  } else if (keyboard["a"]) {
    camera.position.x -= 0.03;
  } else if (keyboard["w"]) {
    camera.position.y += 0.03;
  } else if (keyboard["s"]) {
    camera.position.y -= 0.03;
  }
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

let vely = 0.01;
// rotation, position, scale -> animation
var render = function () {
  process_keyboard();
  requestAnimationFrame(render);
  boxMesh.rotation.y += vely;
  controls.update();
  renderer.render(scene, camera);
};

render();
