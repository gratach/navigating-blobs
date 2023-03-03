export class Satelite{
	constructor(particle){
		this.particle = particle
	}
	setAngle(angle){
		this.angle = angle
		this.xDirection = Math.sin(angle)
		this.yDirection = Math.cos(angle)
	}
	getCoordinates(){
		return [this.particle.x + this.xDirection * this.particle.width * 0.65, this.particle.y + this.yDirection * this.particle.height * 0.65]
	}
}
