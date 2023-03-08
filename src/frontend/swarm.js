import {Analyzer} from "./analyzing.js"
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
		this.particles = [];
		this.allParticles = new Set();
		this.links = [];
		this.lineWidth = 4;
		this.yStretch = 0.7;
		this.particleWidth = 150;
		this.todonew = false;
		this.leinwand = null;
		this.noMouse = {"x" : null, "y" : null}
		this.mousePosition = this.noMouse;
		
		this.maxParticles = 10;
		this.sateliteWidth = 10;
		this.sateliteAngleSpeed = 0.1;
		
		this.focusedParticles = [];
		this.mainFocus = null;
		
		/** 
		 * Implements logic for rearanging the particles on screen and making them move
		 * @see Dynamic
		 */
		this.dynamic = new Dynamic(this);
		
		/** 
		 * Implements logic for measuring the particles distance to the closest focused particle
		 * @see Analyzer
		 */
		this.analyzer = new Analyzer(this);
		
		/** Implements logic for letting relevant particles appear at the visible screen and and making irrelevant particles vanish from there
		 * @see Plow
		 */
		this.plow = new Plow(this);
		
		/** Implements logic for mouse events beeing handled
		 * @see Plow
		 */
		this.mouse = new SwarmMouseHandler(this);
		
		/** Implements logic for mouse events beeing handled
		 * @see Plow
		 */
		this.court = new Court(this, canvas);
	}
	//set focus value of particle to true or false
	setFocus(particle, focusValue, analyze = true){
		if(this.focused != focusValue){
			if(focusValue){
				this.focusedParticles.push(particle);
			}
			else{
				this.focusedParticles.splice(this.focusedParticles.indexOf(particle), 1);
				if(this.mainFocus === particle){
					if(this.focusedParticles.length > 0){
						this.mainFocus = this.focusedParticles[0];
						this.mainFocus.mainFocus = true;
					}
					else
						this.mainFocus = null;
					particle.mainFocus = false;
				}
			}
			particle.focused = focusValue;
			particle.refresh();
			if(analyze)
				this.analyzer.analyze();
		}
	}
	setMainFocus(particle, analyze = true){
		this.setFocus(particle, true, false);
		if(this.mainFocus !== null)
			this.mainFocus.mainFocus = false;
		this.mainFocus = particle;
		particle.mainFocus = true;
		if(analyze)
			this.analyzer.analyze()
	}
	stealFocus(particle){
		console.log("steal focus")
		if(particle.closestFocus !== null){
			this.setFocus(particle.closestFocus, false, false);
		}
		this.setMainFocus(particle);
	}
	set_leinwand(leinwand){
		this.leinwand = leinwand;
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
