/**
 * @module structure
 * @description This module implements the logic of handling the data structures of the semantic web
 */

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
			if(connection.from === neighbor || connection.to === neighbor)
				return true;
		return false;
	}
}

/**
 * Class representing a connection of the semantic web
 * This class is an extension for the arrow class
 */
export class ArrowData{
	constructor(fromParticle, toParticle){
		this.particle = particle;
		
		/** The particle where the arrow is pointing from */
		this.from = fromParticle;
		/** The particle where the arrow points at */
		this.to = toParticle;
		
	}
	
	other(particle){
		if(particle === this.from)
			return this.to;
		if(particle === this.to)
			return this.from;
	}
}
