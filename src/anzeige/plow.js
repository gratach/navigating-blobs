/*
 * Helper to remove old particles and replace them by newer ones
 */
export class Plow{
	constructor(herde){
		this.herde = herde;
		this.maxParticles = herde.maxParticles;
		this.waitForPlowing = false;
		this.totalCount = null;
	}
	startPlowing(){
		this.farthestIn = 0;
		this.farthestOut = 0;
		this.closestOut = 100000000;
		this.totalCount = 0;
		for(let x of this.herde.allParticles){
			if(x.solid){
				if(x.distance > this.farthestIn)
					this.farthestIn = x.distance;
				this.totalCount += 1;
			}
			else{
				if(x.distance > this.farthestOut)
					this.farthestOut = x.distance;
				if(x.distance < this.closestOut)
					this.closestOut = x.distance;
			}
		}
		if(!this.waitForPlowing){
				this.waitForPlowing = true;
				setTimeout(()=>{this.plowLayer()}, 0);
		}
	}
	plowLayer(){
		// remove all particles that are unconnected to focus
		for(let x of this.herde.partikels){
			if(x.solid && x.distance == -1){
				x.vanish();
				this.totalCount -= 1;
			}
		}
		
		//remove particles from most outer layer if necessary
		if(this.farthestIn > this.closestOut || this.maxParticles < this.totalCount){
			// find how mutch space is neaded
			let spaceNeaded = this.totalCount - this.maxParticles;
			for(let x of this.herde.allParticles){
				if(!x.solid && x.distance < this.farthestIn)
					spaceNeaded += 1;
			}
			// iterate to remove particles
			for(let x of this.herde.partikels){
				if(spaceNeaded <= 0){
					this.farthestIn += 1;
					break;
				}
				if(x.solid && (x.distance == this.farthestIn)){
					x.vanish();
					this.totalCount -= 1;
					spaceNeaded -= 1;
				}
			}
			this.farthestIn -= 1;
		}
		
		//add particles to lowest layer if necessary
		for(let x of this.herde.allParticles){
			if(this.totalCount >= this.maxParticles){
				this.closestOut -= 1;
				break;
			}
			if(!x.solid && x.distance == this.closestOut){
				x.appear();
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
