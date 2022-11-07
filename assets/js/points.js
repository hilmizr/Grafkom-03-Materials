import * as THREE from 'https://threejs.org/build/three.module.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

    const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5);

    camera.position.z = 2;

    const scene = new THREE.Scene();

    const vertices = [];

    for ( let i = 0; i < 10000; i ++ ) {

        const x = THREE.MathUtils.randFloatSpread( 2000 );
        const y = THREE.MathUtils.randFloatSpread( 2000 );
        const z = THREE.MathUtils.randFloatSpread( 2000 );

        vertices.push( x, y, z );

    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    const material = new THREE.PointsMaterial( { color: 0x888888 } );

    const points = new THREE.Points( geometry, material );

    //const light = new THREE.DirectionalLight(0xFFFFFF, 1);

    //light.position.set(-1, 2, 4);

    scene.add(points);
    //scene.add(light);

    renderer.render(scene, camera);

    /*
    function render(time) {
        time *= 0.001;
        cube.rotation.x = time;
        cube.rotation.y = time;

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
    */
}

main();