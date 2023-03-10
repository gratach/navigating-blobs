/**
 * @module structure
 * @description This module implements the logic of handling the data structures of the semantic web
 */


/**
 * Class representing a node of the semantic web
 * This class is an extension for the swarm class
 */
export class SwarmData{
	constructor(swarm){
		this.swarm = swarm;
		this.allParticles = new Set();
	}
	addParticle(particle){
		this.allParticles.add(particle);
	}
}


/**
 * Class representing a node of the semantic web
 * This class is an extension for the particle class
 */
export class ParticleData{
	constructor(particle, text){
		this.particle = particle;
		
		this.text = text;
		this.connections = new Set();
		
	}
	/**
	 * This neads to be called by the arrow constructor to report that a new connection has been added to this particle
	 */
	addConnection(connection){
		this.connections.add(connection);
	}
	
	/**
	 * Returns whether this particle is connected to an other particle by an arrow
	 */
	connectedWith(neighbor){
		for(let connection of this.connections)
			if(connection.data.from === neighbor || connection.data.to === neighbor)
				return true;
		return false;
	}
}

/**
 * Class representing a connection of the semantic web
 * This class is an extension for the arrow class
 */
export class ArrowData{
	constructor(arrow, fromParticle, toParticle){
		this.arrow = arrow;
		
		/** The particle where the arrow is pointing from */
		this.from = fromParticle;
		/** The particle where the arrow points at */
		this.to = toParticle;
		
		
		this.from.data.addConnection(arrow);
		this.to.data.addConnection(arrow);
		
		
	}
	/** The return the other particle involved in this connection */
	other(particle){
		if(particle === this.from)
			return this.to;
		if(particle === this.to)
			return this.from;
	}
}
