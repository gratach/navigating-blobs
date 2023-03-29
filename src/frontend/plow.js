/**
 * @module plowing
 * @description This module implements the logic of particles appearing and disappearing on screen
 */

/**
 * Helper to remove old particles and replace them by newer ones
 */
export class Plow{
	constructor(swarm){
		this.swarm = swarm;
		/** The maximal particle number */
		this.maxParticles = 12;
		this.waitForPlowing = false;
		this.totalCount = null;
	}
	
	/** set the maximal particle number */
	setMaxParticles(value){
		this.maxParticles = maximalParticleNumber();
		this.startPlowing();
	}
	/**
	 * Remove old particles and replace them by newer ones
	 */
	startPlowing(){
		this.farthestIn = 0;
		this.farthestOut = 0;
		this.closestOut = 100000000;
		this.totalCount = 0;
		for(let x of this.swarm.data.allParticles){
			if(x.spot.solid){
				if(x.focus.distance > this.farthestIn)
					this.farthestIn = x.focus.distance;
				this.totalCount += 1;
			}
			else{
				if(x.focus.distance > this.farthestOut)
					this.farthestOut = x.focus.distance;
				if(x.focus.distance != -1 && x.focus.distance < this.closestOut)
					this.closestOut = x.focus.distance;
			}
		}
		if(!this.waitForPlowing){
				this.waitForPlowing = true;
				setTimeout(()=>{this.plowLayer()}, 0);
		}
	}
	plowLayer(){
		// remove all particles that are unconnected to focus
		for(let x of this.swarm.spot.visualParticles){
			if(x.spot.solid && x.focus.distance == -1){
				x.spot.vanish();
				this.totalCount -= 1;
			}
		}
		
		//remove particles from most outer layer if necessary
		if(this.farthestIn > this.closestOut || this.maxParticles < this.totalCount){
			// find how mutch space is neaded
			let spaceNeaded = this.totalCount - this.maxParticles;
			for(let x of this.swarm.data.allParticles){
				if(!x.spot.solid && x.focus.distance < this.farthestIn)
					spaceNeaded += 1;
			}
			// iterate to remove particles
			for(let x of this.swarm.spot.visualParticles){
				if(spaceNeaded <= 0){
					this.farthestIn += 1;
					break;
				}
				if(x.spot.solid && (x.focus.distance == this.farthestIn)){
					x.spot.vanish();
					this.totalCount -= 1;
					spaceNeaded -= 1;
				}
			}
			this.farthestIn -= 1;
		}
		
		//add particles to lowest layer if necessary
		console.log(this.closestOut)
		for(let x of this.swarm.data.allParticles){
			if(this.totalCount >= this.maxParticles){
				this.closestOut -= 1;
				break;
			}
			if(!x.spot.solid && x.focus.distance == this.closestOut){
				x.spot.appear();
				this.totalCount += 1;
			}
		}
		this.closestOut += 1;
		
		//repeat if necessary;
		if(this.closestOut < this.farthestIn || this.maxParticles < this.totalCount || (this.maxParticles > this.totalCount && this.closestOut <= this.farthestOut))
			setTimeout(()=>{this.plowLayer()}, 500);
		else
			this.waitForPlowing = false;
	}
}
