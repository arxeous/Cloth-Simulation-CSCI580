export default class Stick
{
    constructor(p1,p2)
    {
        this.p1 = p1;
        this.p2 = p2;
        this.color = 0x4b91c5
        this.length = this.getLength();
        
    }

    getLength()
    {
        let dx = this.p2.position.x - this.p1.position.x;
        let dy = this.p2.position.y - this.p1.position.y;
        let dz = this.p2.position.z - this.p1.position.z;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    updatePos()
    {
        let dx = this.p2.position.x - this.p1.position.x;
        let dy = this.p2.position.y - this.p1.position.y;
        let dz = this.p2.position.z - this.p1.position.z;
        let dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        let diff = this.length - dist;
        let percent = (diff/dist) / 2;

        let offsetX = dx * percent;
        let offsetY = dy * percent;
        let offsetZ = dz * percent;

        if(!this.p1.anchor)
        {
            this.p1.position.x -= offsetX;
            this.p1.position.y -= offsetY;
            this.p1.position.z -= offsetZ;
        }

        if(!this.p2.anchor)
        {
            this.p2.position.x += offsetX;
            this.p2.position.y += offsetY;
            this.p2.position.z += offsetZ;
        }

    }
}