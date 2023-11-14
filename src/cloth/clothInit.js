import InstancePoint from './pointsInit.js'
import InstanceSticks from './sticksInit.js'

import Point from './point.js';
import Stick from './stick.js';

export function initCloth(width, height, damping, k, scene)
{
    let completeMesh = [];
    let points = [];

    for(let i = 0; i < width; i++)
    {
        for(let j = 0; j < height; j++)
        {
            points.push(new Point(i,j,0,0.5,false,damping));
        }
    }

    let sticks = []
    let stick;

    for(let i = 0;  i < points.length; i++)
    {
        if (((i+1) % width) != 0) {
            stick = new Stick(points[i], points[i+1], k);
            sticks.push(stick);
        }
         
        if (i < ((points.length-width))) {
            stick = new Stick(points[i], points[i+width], k);
            sticks.push(stick);
        }
    }
    // stick = new Stick(points[0], points[0 + width + 1]);
    // sticks.push(stick);


    for(let i = 0; i < width - 1; i++)
    {
        for(let j = 0; j < height - 1; j++)
        {
            let idx = i + width * j;
            stick = new Stick(points[idx], points[idx + width + 1], k);
            
            sticks.push(stick);
            stick =  new Stick(points[idx + 1], points[idx + width], k);
            sticks.push(stick);
        }
    }


    points[(width*height)-1].setAnchor();
    points[width-1].setAnchor();

    let instancedPoints = new InstancePoint(points, 0.05, scene);
    let instancedSticks = new InstanceSticks(sticks, scene);
    completeMesh.push(instancedPoints);
    completeMesh.push(sticks);
    completeMesh.push(instancedSticks);
    return completeMesh;
}