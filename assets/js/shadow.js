import * as THREE from 'three';
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
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize )

    var box = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
    var boxMat = new THREE.MeshLambertMaterial({
        color: 0xFFCC00
    })
    var boxMesh = new THREE.Mesh(box, boxMat);
    boxMesh.position.set(0, -2, 0);
    // boxMesh.rotation.set(45, 0, 0);
    boxMesh.scale.set(1, 1, 1);
    boxMesh.castShadow = true
    scene.add(boxMesh);

    const planeGeometry = new THREE.PlaneGeometry( 2000, 2000 );
	planeGeometry.rotateX( - Math.PI / 2 );
	// const planeMaterial = new THREE.ShadowMaterial( { color: 0xffffff, opacity: 0.2 } );
    const planeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );

	const plane = new THREE.Mesh( planeGeometry, planeMaterial );
	plane.position.y = - 200;
	plane.receiveShadow = true;
	scene.add( plane );

    const helper = new THREE.GridHelper( 2000, 100 );
	helper.position.y = - 199;
	helper.material.opacity = 0.25;
	helper.material.transparent = true;
	scene.add( helper );
        
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener( 'change', render );

    // scene.add( new THREE.AmbientLight( 0xf0f0f0 ) );
	// const light = new THREE.SpotLight( 0xffffff, 1.5 );
	// light.position.set( 0, 1500, 200 );
	// light.angle = Math.PI * 0.2;
	// light.castShadow = true;
	// light.shadow.camera.near = 200;
	// light.shadow.camera.far = 2000;
	// light.shadow.bias = - 0.000222;
	// light.shadow.mapSize.width = 1024;
	// light.shadow.mapSize.height = 1024;
	// scene.add( light );

    var light = new THREE.PointLight(0xFFFFFF, 1, 500);
    light.position.set(0, 1, 0);
    scene.add(light);
    scene.add(new THREE.PointLightHelper(light, 0.1, 0xff0000));

    // Gui();
    
    render();
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