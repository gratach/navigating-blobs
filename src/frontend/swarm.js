import {SwarmFocus} from "./focusing.js"
import {Plow} from "./plowing.js"
import {Dynamic} from "./dynamic.js"
import {SwarmMouseHandler} from "./mouseevents.js"
import {Court} from "./visibility.js"
/**
 * @module swarm
 * @description This module contains all logic for the frontend. It is acting as a connector of many other modules that are implementing some details.
 */

/**
 * Container class for all logic that is necessary to handle a group of particles linked by arrows, draw them to screen and manage user interaction
 */
export class Swarm{
	/**
	 * Creates new swarm from array of particles and arrow links between them.
	 * The Leinwand and dynamic needs to be specified later.
	 * 
	 */
	constructor(canvas){
		//court
		this.particles = [];
		
		//memory
		this.allParticles = new Set();
		
		//drawing
		this.lineWidth = 4;
		this.yStretch = 0.7;
		this.particleWidth = 150;
		
		this.sateliteWidth = 10;
		this.sateliteAngleSpeed = 0.1;
		
		/** 
		 * Implements logic for rearanging the particles on screen and making them move
		 * @see Dynamic
		 */
		this.dynamic = new Dynamic(this);
		
		/** 
		 * Implements logic for measuring the particles distance to the closest focused particle
		 * @see SwarmFocus
		 */
		this.focus = new SwarmFocus(this);
		
		/** Implements logic for letting relevant particles appear at the visible screen and and making irrelevant particles vanish from there
		 * @see Plow.Plow
		 */
		this.plow = new Plow(this);
		
		/** Implements logic for mouse events beeing handled
		 * @see Plow
		 */
		this.mouse = new SwarmMouseHandler(this);
		
		/** Implements logic for mouse events beeing handled
		 * @see SwarmMouseHandler
		 */
		this.court = new Court(this, canvas);
	}
	addParticle(particle){
		if(this.particles.indexOf(particle) == -1){
			this.particles.push(particle);
		}
	}
	removeParticle(particle){
		let index = this.particles.indexOf(particle);
		if(index != -1){
			this.particles.splice(index, 1);
		}
	}
}
