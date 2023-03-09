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
		
		this.swarm = swarm;
		/** The canvas element */
		this.canvas = canvas;
		/** The context 2d of the canvas */
		this.context = this.canvas.getContext("2d");
		canvas.onmousedown = (e)=>{this.swarm.mouse.mouseDown(e)};
		canvas.onmousemove = (e)=>{this.swarm.mouse.mouseMove(e)};
		this.todonew = false;
		canvas.onresize = ()=>{this.onResize()};
		
		/** The width of the canvas in pixel */
		this.width = null;
		
		/** The height of the canvas in pixel */
		this.height = null;
		
		/** An unique item that identifyes the current frame. This can be helpfull´ to prevent that elements are been drawn twice. */
		this.frameItem = 0;
		
		this.standardParticleWidth = 150;
		this.standardYStretch = 0.7;
		
		this.onResize()
	}
	
	addVisualParticle(particle){
		if(this.particles.indexOf(particle) == -1){
			this.particles.push(particle);
		}
	}
	removeVisualParticle(particle){
		let index = this.particles.indexOf(particle);
		if(index != -1){
			this.particles.splice(index, 1);
		}
	}
	
	/**
	 * Trigger the next frame to redraw the canvas - do nothing if the next frame has already been triggered and will happen soon
	 */
	refresh(){
		if(!this.todonew){
			this.todonew = true;
			window.requestAnimationFrame((zeit)=>this.draw(zeit));
		}
	}
	
	onResize(){
		this.width = window.innerWidth;
		this.canvas.width = this.width;
		this.height = window.innerHeight;
		this.canvas.height = this.height;
		this.refresh();
	}
	
	draw(zeit){
		console.log("draw")
		this.todonew = false;
		
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
		
		this.swarm.dynamic.rearange();
		this.swarm.mouse.handleMouse();
		for(let x of this.visualParticles){
			x.draw(zeit);
		}
		this.frameItem += 1;
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
		
		this.visible = false;
		this.coming = false;
		this.going = false;
		
		this.animationStartTime = performance.now();
		this.animationDuration = 1000;
		
		/** The natural height of the particle */
		this.naturalHeight = spot.standardParticleWidth;
		/** The natural width of the particle */
		this.naturalWidth = spot.standardParticleWidth * spot.standardYStretch;
		/** The scale of the paricle relative to the natural size */
		this.scale = 0;
	}
	
	/** The total width of the particle */
	get width(){
		return naturalWidth * scale;
	}
	/** The total height of the particle */
	get height(){
		return naturalHeight * scale;
	}
	/** Set the position of the paricle without triggering anything */
	setPosition(x, y){
		this.x = x;
		this.y = y;
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
				link.orbit.checkSatelites();
			this.swarm.spot.refresh();
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
				link.orbit.checkSatelites();
			this.swarm.spot.refresh();
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
		this.swarm.removeVisualParticle(this);
		for(let link of this.particle.data.connections)
			link.orbit.checkSatelites();
	}
	// Internal function to make a particle appear
	show(){
		if(!this.visible){
			this.visible = true;
			
			// Define position by averaging over the satelite representation positions if there are any
			// elsewhise set position to center
			let [x, y] = [0, 0];
			let number = 0;
			for(let link of this.particle.data.connections){
				let satelite = link.orbit.sateliteRepresentation(this);
				if(satelite !== null){
					number += 1;
					let satelitePosition = satelite.getCoordinates();
					x += satelitePosition[0];
					y += satelitePosition[1];
				}
			}
			[this.x, this.y] =  number == 0 ? [this.swarm.spot.width / 2, this.swarm.spot.height / 2] : [x / number, y / number];
			
			this.swarm.addVisualParticle(this);
		}
	}
}
