/**
 * @module positioning
 * @description This module implements the logic of positioning the visible elements
 */

/**
 * An class representing the visible screen where the elements are rendered on
 */
export class Court{
	constructor(swarm, canvas){
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
		for(let x of this.swarm.particles){
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
		this.particle = particle
		let court = particle.swarm.court;
		
		/** The x position of the particle */
		this.x = null;
		/** The y position of the particle */
		this.y = null;
		
		this.visible = false;
		this.coming = false;
		this.going = false;
		
		this.animationStartTime = performance.now();
		this.animationDuration = 1000;
		
		this.naturalHeight = court.standardParticleWidth;
		this.naturalWidth = court.standardParticleWidth * court.standardYStretch;
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
			for(let link of this.connections)
				link.checkSatelites();
			this.swarm.court.refresh();
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
			for(let link of this.connections)
				link.checkSatelites();
			this.swarm.court.refresh();
		}
	}
	
	
	/**
	 * Return the two closest points of the elipse of this particle and of one choosen neighbor
	 */
	closestPoints(neighbor, minimalDistance = 0){
		
		// Get distance of particle centers
		x = this.x - neighbor.x;
		y = this.y - neighbor.y;
		let centerDistance = Math.sqrt(x * x + y * y);
		
		//Extract case of identical positions
		if(centerDistance == 0)
			return [[this.x - minimalDistance / 2, this.y], [this.x + minimalDistance / 2, this.y]];
		
		// Find relative part of link line to cut at the this end
		var x = (neighbor.x - this.x) / (this.width / 2);
		var y = (neighbor.y - this.y) / (this.height / 2);
		var fromCut =  1 / Math.sqrt(x * x + y * y);
		if(isNaN(fromCut))
			fromCut = 0;
		
		// Find relative part of link line to cut at the neigbours end
		x = (this.x - neighbor.x) / (neighbor.width / 2);
		y = (this.y - neighbor.y) / (neighbor.height / 2);
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
		thisX = this.x + (neighbor.x - this.x) * fromCut;
		thisY = this.y + (neighbor.y - this.y) * fromCut;
		neighborsX = neighbor.x + (this.x - neighbor.x) * toCut;
		neighborsY = neighbor.y + (this.y - neighbor.y) * toCut;
		
		return [[thisX, thisY], [neighborsX, neighborsY]];
	}
	
	// Internal function to hide a particle
	hide(){
		this.going = false;
		this.visible = false;
		this.swarm.removeParticle(this);
		for(let link of this.connections)
			link.checkSatelites();
	}
	// Internal function to make a particle appear
	show(){
		if(!this.visible){
			this.visible = true;
			
			// Define position by averaging over the satelite representation positions if there are any
			// elsewhise set position to center
			let [x, y] = [0, 0];
			let number = 0;
			for(let link of this.connections){
				let satelite = link.sateliteRepresentation(this);
				if(satelite !== null){
					number += 1;
					let satelitePosition = satelite.getCoordinates();
					x += satelitePosition[0];
					y += satelitePosition[1];
				}
			}
			[this.x, this.y] =  number == 0 ? [this.swarm.court.width / 2, this.swarm.court.height / 2] : [x / number, y / number];
			
			this.swarm.addParticle(this);
		}
	}
}
