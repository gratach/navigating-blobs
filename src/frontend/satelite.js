export class Satelite{
	constructor(particle, connection){
		this.particle = particle
		this.connection  = connection;
		this.angle = null;
		this.xDirection = 1;
		this.yDirection = 0;
	}
	setDestinationAngle(angle){
		this.destinationAngle = angle;
		if(this.angle == null)
			this.angle = angle;
		let gap = this.angle - this.destinationAngle;
		gap = ((gap % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
		if(gap > Math.PI)
			gap -= 2 * Math.PI;
		let angleSpeed = this.particle.swarm.sateliteAngleSpeed;
		if(Math.abs(gap) >= angleSpeed){
			this.angle += gap < 0 ? angleSpeed : -angleSpeed;
			this.particle.swarm.court.refresh();
		}
		else
			this.angle = this.destinationAngle;
		this.angle = ((this.angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
		this.xDirection = Math.sin(this.angle);
		this.yDirection = Math.cos(this.angle);
	}
	getCoordinates(){
		return [this.particle.x + this.xDirection * this.particle.width * 0.65, this.particle.y + this.yDirection * this.particle.height * 0.65]
	}
}
