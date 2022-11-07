myCanvas = document.getElementById('myCanvas');

var box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshDepthMaterial());
box.position.set(-0.25, 0, -0.25);

var scene = new THREE.Scene();

scene.add(box);
let planeGeo = new THREE.PlaneGeometry(100, 100);
let planeMesh = new THREE.Mesh(planeGeo, new THREE.MeshDepthMaterial());
planeMesh.rotation.x -= Math.PI / 2;
planeMesh.position.y -= 0.5;
scene.add(planeMesh);

var Grid = new THREE.GridHelper(100, 100, 0x0a0a0a, 0x000000);
Grid.position.set(0.25, -0.5, 0.25);
scene.add(Grid);


// camera and renderer
var camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.8,
    2.5
);
camera.position.set(1, 1, 1);
camera.lookAt(0, 0, 0);

var renderer = new THREE.WebGLRenderer({
    canvas: myCanvas,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Auto resize windows
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

})

let keyboard = [];

document.body.onkeydown = function(evt) {
    keyboard[evt.key] = true;
}
document.body.onkeyup = function(evt) {
    keyboard[evt.key] = false;
}

function process_keyboard() {
    if (keyboard['d']) {
        camera.position.x += 0.03;
    } else if (keyboard['a']) {
        camera.position.x -= 0.03;
    } else if (keyboard['w']) {
        camera.position.y += 0.03;
    } else if (keyboard['s']) {
        camera.position.y -= 0.03;
    }
}

var render = function() {
    process_keyboard();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();