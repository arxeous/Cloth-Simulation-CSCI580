import * as THREE from 'three';

const object = new THREE.Object3D();

export default class InitPoint
{
    constructor(points, radius, scene)
    {
        this.points = points;
        let sphere = new THREE.SphereGeometry(radius, 16, 16);
        let material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});

        this.mesh = new THREE.InstancedMesh(sphere, material, this.points.length);
        console.log(this.points.length);
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        scene.add(this.mesh);
    }

    updatePoints(dt)
    {
        for(let i = 0; i < this.points.length; i++)
        {
            let point = this.points[i];
            point.updatePos(dt);
            object.position.set(point.position.x, point.position.y, point.position.z);    
            object.updateMatrix();
            this.mesh.setMatrixAt(i, object.matrix);
            let color = new THREE.Color(point.color);
            this.mesh.setColorAt(i, color);
        }
        this.mesh.instanceMatrix.needsUpdate = true;
        this.mesh.instanceColor.needsUpdate = true;
    }
}