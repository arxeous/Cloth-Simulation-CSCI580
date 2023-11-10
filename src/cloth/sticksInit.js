import * as THREE from 'three';

export default class InitSticks
{
    constructor(sticks, scene)
    {
        this.sticks = sticks;
        console.log(this.sticks.length);
        this.geometry = new THREE.BufferGeometry();
        let initialPos = sticks.reduce((positions, stick) => positions.concat(stick.p1.position.toArray(), stick.p2.position.toArray()), []);
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(initialPos, 3));
        this.material = new THREE.LineBasicMaterial({ color: 0x4b91c5 });
        this.bundle  = new THREE.LineSegments(this.geometry, this.material);

        scene.add(this.bundle);
        
    }

    updateSticks()
    {
        let updatedPos = []; 
        this.sticks.forEach(stick =>
            {
                stick.update();
                //stick.updatePos();
                updatedPos.push(stick.p1.position.toArray(), stick.p2.position.toArray());
            } 
        );
        
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(updatedPos.flat(), 3));
    }

}