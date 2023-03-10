/**
 * @module orbiting
 * @description This module implements the logic of satellite spots surrounding the particles
 */


/**
 * An orbit of a particle that can contain satellites
 */
export class ParticleOrbit{
	constructor(particle){
		this.particle = particle;
		
		this.satellites = [];
	}
	
	addSatellite(link){
		let satellite = new Satellite(this.particle, link);
		this.satellites.push(satellite);
		return satellite;
	}
	removeSatellite(satellite){
		let indexOf = this.satellites.indexOf(satellite);
		if(indexOf != -1)
			this.satellites.splice(indexOf, 1);
	}
	updateSatelliteAngles(){
		let angle = 0;
		for(let x of this.particle.data.connections){
			let other = x.data.other(this.particle)
			if(other.spot.visible && !other.spot.coming && !other.spot.going){
				angle += Math.atan2(other.spot.x - this.particle.spot.x, other.spot.y - this.particle.spot.y);
			}
		}
		let offset = Math.PI * 2 / this.satellites.length;
		angle += offset / 2;
		for(let x of this.satellites){
			x.setDestinationAngle(angle);
			angle += offset;
		}
	}
}


/**
 * An orbit of a connection containing one satellite for each end
 */
export class ArrowOrbit{
	constructor(arrow){
		this.arrow = arrow;
		this.fromSatellite = null;
		this.toSatellite = null;
	}
	
	// Manages the existance of satellites
	checkSatellites(){
		let fromParticle = this.arrow.data.from;
		let toParticle = this.arrow.data.to;
		let fromSatelitShouldExist = fromParticle.spot.visible && (!toParticle.spot.visible || toParticle.spot.coming || toParticle.spot.going);
		if(fromSatelitShouldExist && this.fromSatellite == null)
			this.fromSatellite = fromParticle.orbit.addSatellite(this);
		else if(!fromSatelitShouldExist && this.fromSatellite != null){
			fromParticle.orbit.removeSatellite(this.fromSatellite);
			this.fromSatellite = null;
		}
			
		let toSatelitShouldExist = toParticle.spot.visible && (!fromParticle.spot.visible || fromParticle.spot.coming || fromParticle.spot.going);
		if(toSatelitShouldExist && this.toSatellite == null)
			this.toSatellite = toParticle.orbit.addSatellite(this);
		else if(!toSatelitShouldExist && this.toSatellite != null){
			toParticle.orbit.removeSatellite(this.toSatellite);
			this.toSatellite = null;
		}
	}
	
	// Get the satellite representing this particle if anny
	satelliteRepresentation(particle){
		if(this.arrow.data.from === particle)
			return this.toSatellite;
		if(this.arrow.data.to === particle)
			return this.fromSatellite;
		return null;
	}
}

/**
 * A single satellite spot that represents a connection of a particle
 */
export class Satellite{
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
		let angleSpeed = this.particle.swarm.satelliteAngleSpeed;
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
