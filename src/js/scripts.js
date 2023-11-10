import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { initCloth } from '../cloth/clothInit';




// Three js uses webgl as the underlying graphics renderer, we set that up here
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);


let initPoints, initSticks, shapeGeometry;
let clock, container, scene, camera, orbit,axesHelper, order;
let width = 10; 
let height = 10;
let damping = 0.98;
let k = 0.1;

window.onload = function () {
    init();
    clothInitialization();
    testAnimation();
}


function init()
{
    clock = new THREE.Clock();
    renderer.setSize(window.innerWidth, window.innerHeight);

    container = document.getElementById('canvas');
    container.appendChild(renderer.domElement);

    // We need a scene and a camera, if we want to even view something in the first place. Set that up here
    scene = new THREE.Scene();
    // FOV, Aspect ratio, near plane clipping plane, far plane clipping plane
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth/window.innerHeight,
        0.1,
        1000
    );
    // Set the camera to some default position
    camera.position.set(1, 2, 5);

    // OrbitControls is what allows us to control the camera using the mouse. 
    // The library may have to be changed by us when considering being able to click on menus
    // without moving the camera, etc.
    orbit = new OrbitControls(camera, renderer.domElement);
    
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
    initPoints.updatePoints(dt);
    initSticks.updateSticks();
    
    for(let i = 0; i < order.length; i++)
    {
        let idx = order[i];
        let pos = initPoints.points[idx].position;
        shapeGeometry.attributes.position.setXYZ(i,pos.x, pos.y, pos.z );
    }

    shapeGeometry.attributes.position.needsUpdate = true;

    shapeGeometry.computeVertexNormals();

    //update is what is watching and tracking the mouse movements/click. 
    //cant have movement wihtout it
    orbit.update();

    // Renders scene using camera
    renderer.render(scene, camera);
    
}


function clothInitialization()
{

    let cloth = initCloth(width, height, damping, k, scene );
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


