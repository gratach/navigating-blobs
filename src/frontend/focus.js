/**
 * @module focusing
 * @description This module implements the logic of particles beeing focused
 */

/**
 * An extension class for the swarm class that analyzes a web of particles and finds out the distance in steps from the focused elements.
 * @see Swarm
 */
export class SwarmFocus{
	constructor(swarm){
		this.swarm = swarm;
		this.analyzationIndex = 0;
		
		this.focusedParticles = [];
		this.mainFocus = null;
	}
	// Create some unique number to mark the already measured particles
	newAnalyzationIndex(){
		this.analyzationIndex += 1;
		this.analyzationIndex %= 10000000;
		return this.analyzationIndex;
	}
	/**
	 * Return the number of focused particles
	 */
	countFocus(){
		return this.focusedParticles.length
	}
	/**
	 * Returns the particle that is in main focus
	 */
	getMainFocus(){
		return this.mainFocus;
	}
	
	/**
	 * Analyze all particles and calculate their distance to the focused particles. Execute startPlowing afterwards.
	 */
	analyze(){
		let index = this.newAnalyzationIndex();
		for(let x of this.focusedParticles)
			this.analyzeLayer(x, 0, x, index);
		for(let x of this.swarm.data.allParticles){
			if(x.focus.analyzationIndex != index){
				x.focus.distance = -1;
				x.focus.closestFocus = null;
			}
		}
		this.swarm.plow.startPlowing();
	}
	analyzeLayer(target, distance, closest, index){
		if(target.focus.analyzationIndex != this.analyzationIndex || distance < target.focus.distance){
			target.focus.distance = distance;
			target.focus.closestFocus = closest;
			target.focus.analyzationIndex = index;
			distance += 1;
			for(let x of target.data.connections)
				this.analyzeLayer(x.data.other(target), distance, closest, index)
		}
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
						this.mainFocus.focus.mainFocus = true;
					}
					else
						this.mainFocus = null;
					particle.mainFocus = false;
				}
			}
			particle.focus.focused = focusValue;
			particle.image.refresh();
			if(analyze)
				this.analyze();
		}
	}
}

/**
 * Contains information if this particle is focused
 */
export class ParticleFocus{
	constructor(particle){
		this.focused = false;
		this.mainFocus = false;
		this.closestFocus = null;
		this.particle = particle;
		this.swarm = particle.swarm;
		this.analyzationIndex = null;
		this.distance = -1;
	}
	/** returns true if particle is in focus */
	isFocused(){
		return this.focused;
	}
	/** returns true if particle is the main focus */
	isMainFocus(){
		return this.mainFocus;
	}
	/** Sets focus of particle to the argument */
	setFocus(value){
		this.swarm.focus.setFocus(this.particle, value);
	}
	/** Steals the focus from the currently closest focused particle */
	stealFocus(){
		console.log("steal focus")
		if(this.closestFocus !== null){
			this.swarm.focus.setFocus(this.closestFocus, false, false);
		}
		this.setMainFocus();
	}
	
	
	setMainFocus(){
		this.swarm.focus.setFocus(this.particle, true, false);
		if(this.swarm.focus.mainFocus !== null)
			this.swarm.focus.mainFocus.focus.mainFocus = false;
		this.swarm.focus.mainFocus = this.particle;
		this.mainFocus = true;
		this.swarm.focus.analyze()
	}
}
