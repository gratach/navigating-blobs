/**
 * @module analyzing
 * @description This module implements the logic of particles beeing focused
 */

/**
 * Analyzes a web of particles and finds out the distance in steps from the focused elements
 */
export class Analyzer{
	constructor(swarm){
		this.swarm = swarm;
		this.analyzationIndex = 0;
	}
	// Create some unique number to mark the already measured particles
	newAnalyzationIndex(){
		this.analyzationIndex += 1;
		this.analyzationIndex %= 10000000;
		return this.analyzationIndex;
	}
	analyze(){
		let index = this.newAnalyzationIndex();
		for(let x of this.swarm.focusedParticles)
			this.analyzeLayer(x, 0, x, index);
		for(let x of this.swarm.allParticles){
			if(x.analyzationIndex != index){
				x.distance = -1;
				x.closestFocus = null;
			}
		}
		this.swarm.plow.startPlowing();
	}
	analyzeLayer(target, distance, closest, index){
		if(target.analyzationIndex != this.analyzationIndex || distance < target.distance){
			target.distance = distance;
			target.closestFocus = closest;
			target.analyzationIndex = index;
			distance += 1;
			for(let x of target.connections)
				this.analyzeLayer(x.other(target), distance, closest, index)
		}
	}
}