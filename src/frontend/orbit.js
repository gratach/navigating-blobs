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
		let satelite = new Satelite(this.particle, link);
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
		for(let x of this.particle.data.connections){
			let other = x.data.other(this.particle)
			if(other.spot.visible && !other.spot.coming && !other.spot.going){
				angle += Math.atan2(other.spot.x - this.particle.spot.x, other.spot.y - this.particle.spot.y);
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
		let fromParticle = this.arrow.data.from;
		let toParticle = this.arrow.data.to;
		let fromSatelitShouldExist = fromParticle.spot.visible && (!toParticle.spot.visible || toParticle.spot.coming || toParticle.spot.going);
		if(fromSatelitShouldExist && this.fromSatelite == null)
			this.fromSatelite = fromParticle.orbit.addSatelite(this);
		else if(!fromSatelitShouldExist && this.fromSatelite != null){
			fromParticle.orbit.removeSatelite(this.fromSatelite);
			this.fromSatelite = null;
		}
			
		let toSatelitShouldExist = toParticle.spot.visible && (!fromParticle.spot.visible || fromParticle.spot.coming || fromParticle.spot.going);
		if(toSatelitShouldExist && this.toSatelite == null)
			this.toSatelite = toParticle.orbit.addSatelite(this);
		else if(!toSatelitShouldExist && this.toSatelite != null){
			toParticle.orbit.removeSatelite(this.toSatelite);
			this.toSatelite = null;
		}
	}
	
	// Get the satelite representing this particle if anny
	sateliteRepresentation(particle){
		if(this.arrow.data.from === particle)
			return this.toSatelite;
		if(this.arrow.data.to === particle)
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
		console.log(angle)
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
			this.particle.swarm.screen.refresh();
		}
		else
			this.angle = this.destinationAngle;
		this.angle = ((this.angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
		this.xDirection = Math.sin(this.angle);
		this.yDirection = Math.cos(this.angle);
	}
	getCoordinates(){
		return [this.particle.spot.x + this.xDirection * this.particle.spot.width * 0.65, this.particle.spot.y + this.yDirection * this.particle.spot.height * 0.65]
	}
}
