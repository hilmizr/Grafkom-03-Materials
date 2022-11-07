import * as THREE from "three";
import { OrbitControls } from "orbitControls";
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.17/+esm';

let scene, camera, renderer, controls;

let material, sprite;

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set( 0, 1, 2 );

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize )

    const cat = new THREE.TextureLoader().load( './assets/img/cat.png');

    material = new THREE.SpriteMaterial( { map: cat, color: 0xffffff} );
    sprite = new THREE.Sprite( material );
    
    sprite.position.set( 0,0,0 );

    scene.add( sprite );

    let planeGeo = new THREE.PlaneGeometry(100, 100);
    let planeMesh = new THREE.Mesh(planeGeo, new THREE.MeshStandardMaterial({ color: 0xffffff }));
    planeMesh.rotation.x -= Math.PI / 2;
    planeMesh.position.y -= 0.5;
    scene.add(planeMesh);

    var Grid = new THREE.GridHelper(100, 100, 0x0a0a0a, 0x000000);
    Grid.position.set(0, -0.5, 0);
    scene.add(Grid);
        
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener( 'change', render );

    var light = new THREE.PointLight(0xFFFFFF, 1, 500);
    light.position.set(0, 2, 0);
    scene.add(light);
    scene.add(new THREE.PointLightHelper(light, 0.5, 0xff0000));

    Gui();
    

}

function Gui() {
    let kendali = new Object();
    kendali.x = 0;
    kendali.y = 2;
    kendali.z = 2;

    var options = {
        spriteReset: function() {
            sprite.position.set(0, 0, 0);
            material.rotation = 0;
        },
        lightReset: function() {
            kendali.x = 0;
            kendali.y = 2;
            kendali.z = 2;
        },
    };

    let gui = new GUI();
    const lightFolder = gui.addFolder('Light');
    lightFolder.add(kendali, "x", -4, 4, 0.1);
    lightFolder.add(kendali, "y", 0, 4);
    lightFolder.add(kendali, "z", -4, 4);
    lightFolder.open()

    lightFolder.add(options, 'lightReset').name('Reset').listen();

    const spriteFolder = gui.addFolder('Sprite');

    const rotateFolder = spriteFolder.addFolder('Rotation')
    rotateFolder.add(material, 'rotation', 0, Math.PI * 2)
    rotateFolder.open()

    const posFolder = spriteFolder.addFolder('Position')
    posFolder.add(sprite.position, 'x', -4, 4)
    posFolder.add(sprite.position, 'y', 0, 4)
    posFolder.add(sprite.position, 'z', -4, 4)
    posFolder.open()

    let attFlag = 0;
    let attCheck = spriteFolder.add(material, "sizeAttenuation", true, false).onChange((value) => {
        if (attFlag == 0) {
            material.sizeAttenuation = true;
            material.needsUpdate = true;
            attFlag = 1;
        } else if (attFlag == 1) {
            material.sizeAttenuation = false;
            material.needsUpdate = true;
            attFlag = 0;
        }
    });

    spriteFolder.open()
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();
}

function render() {
    renderer.render( scene, camera );
}