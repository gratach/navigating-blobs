/**
 * @module orbiting
 * @description This module implements the logic of satelite spots surrounding the particles
 */


/**
 * An orbit of a particle that can contain satelites
 */
export class ParticleOrbit{
	constructor(particle){
		this.particle = particle;
		
		this.satelites = [];
	}
	
	addSatelite(link){
		let satelite = new Satelite(this, link);
		this.satelites.push(satelite);
		return satelite;
	}
	removeSatelite(satelite){
		let indexOf = this.satelites.indexOf(satelite);
		if(indexOf != -1)
			this.satelites.splice(indexOf, 1);
	}
	updateSateliteAngles(){
		let angle = 0;
		for(let x of this.connections){
			let other = x.other(this)
			if(other.visible && !other.coming && !other.going){
				angle += Math.atan2(other.x - this.x, other.y - this.y);
			}
		}
		let offset = Math.PI * 2 / this.satelites.length;
		angle += offset / 2;
		for(let x of this.satelites){
			x.setDestinationAngle(angle);
			angle += offset;
		}
	}
}


/**
 * An orbit of a connection containing one satelite for each end
 */
export class ArrowOrbit{
	constructor(arrow){
		this.arrow = arrow;
		this.fromSatelite = null;
		this.toSatelite = null;
	}
	
	// Manages the existance of satelites
	checkSatelites(){
		let fromSatelitShouldExist = this.from.visible && (!this.to.visible || this.to.coming || this.to.going);
		if(fromSatelitShouldExist && this.fromSatelite == null)
			this.fromSatelite = this.from.addSatelite(this);
		else if(!fromSatelitShouldExist && this.fromSatelite != null){
			this.from.removeSatelite(this.fromSatelite);
			this.fromSatelite = null;
		}
			
		let toSatelitShouldExist = this.to.visible && (!this.from.visible || this.from.coming || this.from.going);
		if(toSatelitShouldExist && this.toSatelite == null)
			this.toSatelite = this.to.addSatelite(this);
		else if(!toSatelitShouldExist && this.toSatelite != null){
			this.to.removeSatelite(this.toSatelite);
			this.toSatelite = null;
		}
	}
	
	// Get the satelite representing this particle if anny
	sateliteRepresentation(particle){
		if(this.from === particle)
			return this.toSatelite;
		if(this.to === particle)
			return this.fromSatelite;
		return null;
	}
}

/**
 * A single satelite spot that represents a connection of a particle
 */
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
			this.particle.swarm.spot.refresh();
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
