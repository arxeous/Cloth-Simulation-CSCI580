import * as THREE from 'three';


const gravity = -1;
export default class Point 
{

    constructor(x,y,z, mass, anchor)
    {
        this.position = new THREE.Vector3(x,y,z);
        this.PrevPosition = new THREE.Vector3(x,y,z);
        this.mass = mass;
        this.anchor = anchor;

        if(!this.anchor)
        {
            this.color = 0xffffff;
        }
        else
        {
            this.color = 0x4b91c5
        }
        

    }

    setPrevPos(X,Y,Z)
    {
        this.PrevPosition = new THREE.Vector3(X,Y,Z);
    }

    setAnchor()
    {
        this.anchor = !this.anchor;

        if(!this.anchor)
        {
            this.color = 0xffffff;
        }
        else
        {
            this.color = 0x4b91c5
        }
    }

    updatePos(dt)
    {
        if(!this.anchor)
        {
            let Vel = new THREE.Vector3((this.position.x - this.PrevPosition.x), (this.position.y - this.PrevPosition.y), (this.position.z - this.PrevPosition.z));

            this.PrevPosition = this.position.clone();

            let Acc = new THREE.Vector3(0, gravity / this.mass, 0);

            this.position.x += Vel.x + Acc.x * (dt*dt);
            this.position.y += Vel.y + Acc.y * (dt*dt);
            this.position.z += Vel.z + Acc.z * (dt*dt);

        }
    }


}