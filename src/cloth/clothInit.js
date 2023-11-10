import InstancePoint from './pointsInit.js'

import Point from './point.js';
import Stick from './stick.js';

export function initCloth(width, height, scene)
{
    let completeMesh = [];
    let points = [];

    for(let i = 0; i < width; i++)
    {
        for(let j = 0; j < height; j++)
        {
            points.push(new Point(i,j,0,1,false));
        }
    }

    let sticks = []
    let stick;

    for(let i = 0;  i < points.length; i++)
    {
        if (((i+1) % width) != 0) {
            stick = new Stick(points[i], points[i+1]);
            sticks.push(stick);
        }
         
        if (i < ((points.length-width))) {
            stick = new Stick(points[i], points[i+width]);
            sticks.push(stick);
        }
    }


    points[(width*height)-1].setAnchor();
    points[width-1].setAnchor();

    let instancedPoints = new InstancePoint(points, 0.05, scene);
    completeMesh.push(instancedPoints);
    completeMesh.push(sticks);
    return completeMesh;
}