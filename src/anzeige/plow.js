/*
 * Helper to remove old particles and replace them by newer ones
 */
export class Plow{
	constructor(herde, maxParticles = 5){
		this.herde = herde;
		this.maxParticles = maxParticles;
		this.waitForPlowing = false;
		this.totalCount = null;
	}
	startPlowing(){
		this.farthestIn = 0;
		this.closestOut = 100000000;
		this.totalCount = 0;
		for(let x of this.herde.allParticles){
			if(x.solid){
				if(x.distance > this.farthestIn)
					this.farthestIn = x.distance;
				this.totalCount += 1;
			}
			else
				if(x.distance < this.closestOut)
					this.closestOut = x.distance
		}
		if(!this.waitForPlowing){
				this.waitForPlowing = true;
				setTimeout(()=>{this.plowLayer()}, 0);
		}
	}
	plowLayer(){
		if(this.farthestIn > this.closestOut || this.farthestIn == -1){
			/*// find how mutch space is neaded
			let spaceNeaded = this.totalCount - this.maxParticles;
			for(let x of this,herde.allParticles){
				if(!x.solid && x.distance < 
			}*/
			for(let x of this.herde.partikels){
				if(x.solid && (x.distance == this.farthestIn || x.distance == -1)){
					x.vanish();
					this.totalCount -= 1;
				}
			}
			this.farthestIn -= 1;
			let layerFull = true;
			for(let x of this.herde.allParticles){
				if(this.totalCount >= this.maxParticles){
					layerFull = false;
					break;
				}
				if(!x.solid && x.distance == this.closestOut){
					x.appear()
					this.totalCount += 1;
				}
			}
			if(layerFull){
				this.closestOut += 1;
				if(this.totalCount < this.maxParticles && this.farthestIn < this.closestOut){
					console.log("refill")
					for(let x of this.herde.allParticles){
						if(!x.solid && x.distance == this.closestOut){
							x.appear()
							this.totalCount += 1;
						}
						if(this.totalCount >= this.maxParticles){
							this.waitForPlowing = false;
							return;
						}
					}
					this.closestOut += 1;
				}
			}
			setTimeout(()=>{this.plowLayer()}, 500);
		}
		else if(this.totalCount > this.maxParticles){
			for(let x of this.herde.partikels){
				if(x.solid && (x.distance == this.farthestIn || x.distance == -1)){
					x.vanish();
					this.totalCount -= 1;
				}
				if(this.totalCount <= this.maxParticles){
					this.waitForPlowing = false;
					return
				}
			}
			this.farthestIn -= 1;
			setTimeout(()=>{this.plowLayer()}, 500);
		}
		else if(this.totalCount < this.maxParticles){
			console.log("refill")
			for(let x of this.herde.allParticles){
				if(!x.solid && x.distance == this.closestOut){
					x.appear()
					this.totalCount += 1;
				}
				if(this.totalCount >= this.maxParticles){
					this.waitForPlowing = false;
					return;
				}
			}
			this.closestOut += 1;
			setTimeout(()=>{this.plowLayer()}, 500);
		}
		else
			this.waitForPlowing = false;
	}
}
