/**
 * @module particles
 * @description This module acts as a container for all particle relatet logic.
 */

import {Satelite} from "./satelite.js";
import {ParticleMouseHandler} from "./mouseevents.js";
import {ParticleFocus} from "./focusing.js";
import {Spot} from "./positioning.js";
import {ParticleImage} from "./painting.js";
import {ParticleData} from "./structure.js";
import {ParicleOrbit} from "./orbiting.js";

/** A class wrapping all logic behind a single particle */
export class Particle{
	/*
	 * Creates some text bubble
	 */
	constructor(swarm, text){
		this.swarm = swarm;
		
		/** Implements logic for mouse events beeing handled
		 * @see ParticleMouseHandler
		 */
		this.mouse = new ParticleMouseHandler(this);
		
		/** Implements logic for focus beeing handled
		 * @see ParticleFocus
		 */
		this.focus = new ParticleFocus(this);
		
		/**
		 * Implements logic for positioning the particle on the visible screen
		 * @see Spot
		 */
		this.spot = new Spot(this)
		
		/**
		 * Implements logic for drawing the particle to the screen
		 * @see ParticleImage
		 */
		this.painting = new ParticleImage(this)
		
		/**
		 * Implements logic for handling the semantic web node of this particle
		 * @see ParticleData
		 */
		this.data = new ParticleData(this, text)
		
		/**
		 * Implements logic for handling the orbiting satelites of this particle
		 * @see ParicleOrbit
		 */
		this.orbit = new ParticleOrbit(this, text)
		
		
		this.swarm.allParticles.add(this);
		this.painting.refresh();
	}
}
