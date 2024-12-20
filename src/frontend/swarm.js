/**
 * @module swarm
 * @description This module contains all logic for the frontend. It is acting as a connector of many other modules that are implementing some details.
 */

import {SwarmFocus} from "./focus.js"
import {Plow} from "./plow.js"
import {Dynamic} from "./dynamic.js"
import {SwarmMouseHandler} from "./mouse.js"
import {SwarmSpot} from "./spot.js"
import {SwarmData} from "./data.js"
import {SwarmScreen} from "./screen.js"
import {SwarmImage} from "./image.js"

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
		
		//satellites
		this.satelliteWidth = 10;
		this.satelliteAngleSpeed = 0.1;
		
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
		
		/** Implements logic for canvas beeing handled
		 * @see SwarmScreen
		 */
		this.screen = new SwarmScreen(this, canvas);
		
		/** Implements logic for content beeing drawn to the canvas
		 * @see SwarmMouseHandler
		 */
		this.image = new SwarmImage(this);
		
		/** Implements logic for mouse events beeing handled
		 * @see SwarmMouseHandler
		 */
		this.spot = new SwarmSpot(this);
		
		/** Implements logic for handling of the semantic web
		 * @see SwarmData
		 */
		this.data = new SwarmData(this);
	}
}
