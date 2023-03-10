/**
 * @module positioning
 * @description This module implements the logic of positioning the visible elements
 */

/**
 * An class representing the visible screen where the elements are positioned on
 */
export class SwarmSpot{
	constructor(swarm, canvas){
		this.visualParticles = [];
		
		this.standardParticleWidth = 150;
		this.standardYStretch = 0.7;
	}
	
	addVisualParticle(particle){
		if(this.visualParticles.indexOf(particle) == -1){
			this.visualParticles.push(particle);
		}
	}
	removeVisualParticle(particle){
		let index = this.visualParticles.indexOf(particle);
		if(index != -1){
			this.visualParticles.splice(index, 1);
		}
	}
}

/**
 * Representation of the physical position of a particle on the screen
 * This class is an extension for the particle class
 */
export class Spot{
	constructor(particle){
		this.particle = particle;
		this.swarm = particle.swarm;
		let spot = particle.swarm.spot;
		
		/** The x position of the particle */
		this.x = null;
		/** The y position of the particle */
		this.y = null;
		
		/** Bool to indicate if the particle is currently visible */
		this.visible = false;
		/** Bool to indicate if the particle is currently appearing */
		this.coming = false;
		/** Bool to indicate if the particle is currently vanishing */
		this.going = false;
		
		this.animationStartTime = performance.now();
		this.animationDuration = 1000;
		
		/** The natural height of the particle */
		this.naturalHeight = spot.standardParticleWidth * spot.standardYStretch;
		/** The natural width of the particle */
		this.naturalWidth = spot.standardParticleWidth;
		/** The scale of the paricle relative to the natural size */
		this.scale = 0;
	}
	
	/** The total width of the particle */
	get width(){
		return this.naturalWidth * this.scale;
	}
	/** The total height of the particle */
	get height(){
		return this.naturalHeight * this.scale;
	}
	/** Set the position of the paricle without triggering anything */
	setPosition(x, y){
		this.x = x;
		this.y = y;
	}
	
	/**
	 * Change the scale of the paricle if it is coming or going
	 */
	updateScale(){
		let time = performance.now();
		// Handle the coming or going animation scale change
		if(this.coming){
			this.scale = (time - this.animationStartTime) / this.animationDuration;
			if(this.scale < 0)
				this.scale = 0;
			if(this.scale >= 1){
				this.coming = false;
				this.scale = 1;
			}
			else
				this.swarm.screen.refresh(); // Continue animation
		}
		else if(this.going){
			this.scale = 1 - (time - this.animationStartTime) / this.animationDuration;
			if(this.scale > 1)
				this.scale = 1;
			// Hide particle and remove from swarm if going animation is complete
			if(this.scale <= 0){
				this.scale = 0;
				this.hide();
			}
			else
				this.swarm.screen.refresh(); // Continue animation
		}
		else 
			this.scale = 1;
	}
	
	// Start the process of making a particle vanish
	vanish(){
		if(this.visible){
			if(this.coming){
				let now = performance.now();
				this.animationStartTime = now + now - this.animationStartTime - this.animationDuration;
			}
			else
				this.animationStartTime = performance.now();
			this.coming = false;
			this.going = true;
			for(let link of this.particle.data.connections)
				link.orbit.checkSatellites();
			this.swarm.screen.refresh();
		}
	}
	
	// Start the process of making a particle appear
	appear(){
		if(!this.visible || this.going){
			this.show();
			if(this.going){
				let now = performance.now();
				this.animationStartTime = now + now - this.animationStartTime - this.animationDuration;
			}
			else
				this.animationStartTime = performance.now();
			this.coming = true;
			this.going = false;
			for(let link of this.particle.data.connections)
				link.orbit.checkSatellites();
			this.swarm.screen.refresh();
		}
	}
	
	/**
	 * Returns if the particle is visible and will not vanish soon 
	 */
	get solid(){
		return this.visible && !this.going
	}
	
	
	/**
	 * Return the two closest points of the elipse of this particle and of one choosen neighbor
	 */
	closestPoints(neighbor, minimalDistance = 0){
		let neighborSpot = neighbor.spot;
		
		// Get distance of particle centers
		x = this.x - neighborSpot.x;
		y = this.y - neighborSpot.y;
		let centerDistance = Math.sqrt(x * x + y * y);
		
		//Extract case of identical positions
		if(centerDistance == 0)
			return [[this.x - minimalDistance / 2, this.y], [this.x + minimalDistance / 2, this.y]];
		
		// Find relative part of link line to cut at the this end
		var x = (neighborSpot.x - this.x) / (this.width / 2);
		var y = (neighborSpot.y - this.y) / (this.height / 2);
		var fromCut =  1 / Math.sqrt(x * x + y * y);
		if(isNaN(fromCut))
			fromCut = 0;
		
		// Find relative part of link line to cut at the neigbours end
		x = (this.x - neighborSpot.x) / (neighborSpot.width / 2);
		y = (this.y - neighborSpot.y) / (neighborSpot.height / 2);
		var toCut =  1 / Math.sqrt(x * x + y * y);
		if(isNaN(toCut))
			toCut = 0;
		
		// handle case of overlapping particles
		let overlap = toCut + fromCut - 1 + minimalDistance / centerDistance;
		if(overlap > 0){
			[fromCut, toCut] = [fromCut - overlap / 2, toCut - overlap / 2];
		}
		
		// construct return value
		var thisX, thisY, neighborsX, neighborsY;
		thisX = this.x + (neighborSpot.x - this.x) * fromCut;
		thisY = this.y + (neighborSpot.y - this.y) * fromCut;
		neighborsX = neighborSpot.x + (this.x - neighborSpot.x) * toCut;
		neighborsY = neighborSpot.y + (this.y - neighborSpot.y) * toCut;
		
		return [[thisX, thisY], [neighborsX, neighborsY]];
	}
	
	// Internal function to hide a particle
	hide(){
		this.going = false;
		this.visible = false;
		this.swarm.spot.removeVisualParticle(this.particle);
		for(let link of this.particle.data.connections)
			link.orbit.checkSatellites();
	}
	// Internal function to make a particle appear
	show(){
		if(!this.visible){
			this.visible = true;
			
			// Define position by averaging over the satellite representation positions if there are any
			// elsewhise set position to center
			let [x, y] = [0, 0];
			let number = 0;
			for(let link of this.particle.data.connections){
				let satellite = link.orbit.satelliteRepresentation(this.particle);
				if(satellite !== null){
					number += 1;
					let satellitePosition = satellite.getCoordinates();
					x += satellitePosition[0];
					y += satellitePosition[1];
				}
			}
			[this.x, this.y] = number == 0 ? [this.swarm.screen.width / 2, this.swarm.screen.height / 2] : [x / number, y / number];
			
			this.swarm.spot.addVisualParticle(this.particle);
		}
	}
}
