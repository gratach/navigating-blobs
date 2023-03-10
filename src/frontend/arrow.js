/**
 * @module arrow
 * @description This module acts as a container for all arrow relatet logic.
 */

import {ArrowData} from "./data.js";
import {ArrowOrbit} from "./orbit.js";
import {ArrowImage} from "./image.js";

/** A class wrapping all logic behind a arrow between two particles */
export class Arrow{
	constructor(fromParticle, toParticle){
		this.swarm = fromParticle.swarm;
		
		/**
		 * Implements logic for handling the semantic web connection of this arrow
		 * @see ArrowData
		 */
		this.data = new ArrowData(this, fromParticle, toParticle);
		
		/**
		 * Implements logic for handling the satellites of this connection
		 * @see ArrowOrbit
		 */
		this.orbit = new ArrowOrbit(this);
		
		/**
		 * Implements logic for handling the satellites of this connection
		 * @see ArrowImage
		 */
		this.image = new ArrowImage(this);
	}
}
