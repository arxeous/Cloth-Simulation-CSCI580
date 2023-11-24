import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { initCloth } from '../cloth/clothInit';
import gx1 from '../../textures/gx1.jpg'    
import gx2 from '../../textures/gx2.jpg'
import gy1 from '../../textures/gy1.jpg'
import gy2 from '../../textures/gy2.jpg'
import gz1 from '../../textures/gz1.jpg'
import gz2 from '../../textures/gz2.jpg'
import gr1 from '../../textures/grass_1.jpg'
import { GUI } from 'lil-gui';

// Three js uses webgl as the underlying graphics renderer, we set that up here
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

let initPoints, initSticks, shapeGeometry;
let clock, container, scene, camera, orbit,axesHelper, order;
let ball;
let width = 10; 
let height = 10;
let damping = 0.98;
let k = 0.1;

window.onload = function () {
    init();
    clothInitialization();
    ballInitialization();
    testAnimation();
}

consoleGui = {
    wind: 0,
    windAngle: 0,
    addBall: false,
    changeMass: 1
}


function init()
{
    clock = new THREE.Clock();
    renderer.setSize(window.innerWidth, window.innerHeight);

    container = document.getElementById('canvas');
    container.appendChild(renderer.domElement);

    // We need a scene and a camera, if we want to even view something in the first place. Set that up here
    scene = new THREE.Scene();
    //const loader = new THREE.TextureLoader();

    //Create texture for background
    const loader = new THREE.CubeTextureLoader();
    const textureCube = loader.load( [gx2, gx1, gy1, gy2, gz1, gz2] );
    scene.background = textureCube;
    
    //Create a floor for the scene
    const texture = new THREE.TextureLoader().load(gr1);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 20, 20 );
    const geometry = new THREE.PlaneGeometry( 1000, 1000 );
    const material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.BackSide} );
    floor = new THREE.Mesh( geometry, material );
    floor.rotation.x += 1.5708;
    floor.translateZ(0.5);
    scene.add( floor );

    // FOV, Aspect ratio, near plane clipping plane, far plane clipping plane
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth/window.innerHeight,
        0.1,
        1000
    );
    // Set the camera to some default position
    camera.position.set(20, 5, 15);

    // OrbitControls is what allows us to control the camera using the mouse. 
    // The library may have to be changed by us when considering being able to click on menus
    // without moving the camera, etc.
    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.zoomToCursor = true;
    orbit.maxDistance = 50;
    //orbit.maxPolarAngle = 1.5;

    // testing gui to see if it appears
    const gui = new GUI();
    gui.add(consoleGui, 'wind', 0, 30).name("Wind Velocity");
    gui.add(consoleGui, 'windAngle', 0, 360).name("Wind Angle");
    gui.add(consoleGui, 'addBall').name("Show ball");
    gui.add(consoleGui, 'changeMass', 0.1, 7.0 ).name("Particle Mass");

    // Renders an axes on screen for us to have a point of reference
    axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

}



// Animation function, updates the box with some spin about arbitrary axes
function testAnimation()
{
    requestAnimationFrame(testAnimation);
    let dt = clock.getDelta();

    if(dt > 1/5)
    {
        dt = 0
    }
    initPoints.updatePoints(dt, consoleGui.changeMass, consoleGui.wind, consoleGui.windAngle);
    initSticks.updateSticks();
    
    for(let i = 0; i < order.length; i++)
    {
        let idx = order[i];
        let pos = initPoints.points[idx].position;
        shapeGeometry.attributes.position.setXYZ(i,pos.x, pos.y, pos.z );
    }

    shapeGeometry.attributes.position.needsUpdate = true;

    shapeGeometry.computeVertexNormals();


    var diff = new THREE.Vector3();
    for (
        particles = initPoints.points, i = 0, il = particles.length;
        i < il;
        i++
      ) {
        particle = particles[i];
        var pos = particle.position;
        diff.subVectors(pos, ball.position);
        if (diff.length() < 2) {
          // collided
          diff.normalize().multiplyScalar(2);
          pos.copy(ball.position).add(diff);
        }
      }
    //update is what is watching and tracking the mouse movements/click. 
    //cant have movement wihtout it
    orbit.update();

    // Renders scene using camera
    renderer.render(scene, camera);
    
}


function clothInitialization()
{
    let cloth = initCloth(width, height, damping, k, scene, consoleGui.changeMass);
    initPoints = cloth[0];
    sticks = cloth[1];
    initSticks = cloth[2];
    points = initPoints.points;
    let pos = [];
    let squares = (width - 1) * (height - 1);
    order = [];
    for(let i = 0; i < points.length; i++)
    {
        if(i + 1 < squares + (height - 1))
        {
            if(((i+1) % width) != 0)
            {
                // Triangle 1
                pos.push(points[i].position);
                pos.push(points[i+1].position);
                pos.push(points[i+width].position);

                order.push(i);
                order.push(i+1);
                order.push(i+width);

                // Triangle 2
                pos.push(points[i+1].position);
                pos.push(points[i+width].position);
                pos.push(points[i+width+1].position);

                order.push(i+1);
                order.push(i+width);
                order.push(i+width+1);

            }
        }
    }

    shapeGeometry = new THREE.BufferGeometry();
    shapeGeometry.setFromPoints(pos);

    shapeGeometry.computeVertexNormals();
    shapeGeometry.computeBoundingBox();
    var material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});

    shape = new THREE.Mesh(shapeGeometry, material);

    scene.add(shape);
    


}





function ballInitialization(){
    var ballGeo = new THREE.SphereGeometry(2);
    var ballMaterial = new THREE.MeshBasicMaterial();

    sphere = new THREE.Mesh(ballGeo, ballMaterial);
    sphere.position.x += 5;
    sphere.position.y += 5;
    sphere.position.z += 5;
    ball = sphere;
    scene.add(sphere);
}