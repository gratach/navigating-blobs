import {Satelite} from "./satelite.js";

export class Partikel{
	/*
	 * Creates some text bubble
	 */
	constructor(herde, x, y, text){
		this.todonew = true;
		
		this.text = text;
		this.x = x;
		this.y = y;
		this.scale = 1;
		this.bufferWidth = 200;
		this.canvas = null;
		this.connections = new Set();
		this.hover = false;
		
		this.visible = false;
		this.coming = false;
		this.going = false;
		this.animationStartTime = performance.now()
		this.animationDuration = 1000;
		
		this.satelites = []
		
		this.focused = false;
		
		this.herde = herde;
		this.herde.allParticles.add(this)
		this.refresh();
		
		//used by analyzer
		this.analyzationIndex = null;
		this.distance = -1;
		this.closestFocus = null;
	}
	delete(){
		this.herde.allParticles.delete(this)
		throw "TODO implement"
	}
	/*
	 * To be called when the apperance of the partikel has changed.
	 */
	refresh(){
		if(!this.todonew && this.herde != null){
			this.todonew = true;
			this.herde.refresh();
		}
	}
	get bufferHeight(){
		return Math.round(this.bufferWidth * this.herde.yStretch);
	}
	get width(){
		return this.bufferWidth * this.scale;
	}
	get height(){
		return this.bufferHeight * this.scale;
	}
	vanish(){
		if(this.visible){
			this.coming = false;
			this.going = true;
			this.animationStartTime = performance.now();
			this.herde.refresh();
		}
	}
	appear(){
		if(!this.visible || this.going){
			if(!this.visible){
				this.herde.addParticle(this)
			}
			this.coming = true;
			this.going = false
			this.visible = true;
			this.animationStartTime = performance.now();
			this.herde.refresh();
		}
	}
	get solid(){
		return this.visible && !this.going
	}
	draw(leinwand, time){
		if(this.visible){
			// Handle the coming or going animation scale change
			if(this.coming){
				this.scale = (time - this.animationStartTime) / this.animationDuration;
				if(this.scale >= 1){
					this.coming = false;
					this.scale = 1
				}
				else
					this.herde.refresh() // Continue animation
			}
			else if(this.going){
				this.scale = 1 - (time - this.animationStartTime) / this.animationDuration;
				// Hide particle and remove from herde if going animation is complete
				if(this.scale <= 0){
					this.going = false;
					this.visible = false;
					this.scale = 0;
					this.herde.removeParticle(this)
				}
				else
					this.herde.refresh() // Continue animation
			}
			else 
				this.scale = 1;
		}
				
		// Draw text bubble to buffer if necessary
		if(this.todonew){
			this.todonew = false;
			
			if(this.visible){
				
		
				// Create buffer if necessary
				if(this.canvas == null || this.canvas.width != this.bufferWidth || this.canvas.height != this.bufferHeight){
					this.canvas = document.createElement("canvas");
					this.canvas.width = this.bufferWidth;
					this.canvas.height = this.bufferHeight;
					this.context = this.canvas.getContext("2d");
				}
				
				
				// Draw elipse to buffer
				this.context.lineWidth = this.herde.lineWidth;
				this.context.fillStyle = this.hover ? "rgb(0,255,0)" : "rgb(100,100,255)";
				this.context.beginPath();
				this.context.ellipse(this.canvas.width / 2, this.canvas.height / 2, (this.canvas.width - this.context.lineWidth) / 2, (this.canvas.height - this.context.lineWidth) / 2, 0, 0, 2 * Math.PI);
				this.context.fill();
				this.context.strokeStyle = this.focused ? "rgb(255,0,0)" : "rgb(0,0,0)"
				this.context.stroke();
				
				// Draw text to buffer
				this.context.fillStyle = "rgb(0,0,0)";
				// Rescale text
				this.context.font = 100 + "px serif";
				var textSize = this.context.measureText(this.text);
				var textRelativeHeigt = (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) / (this.canvas.height - 3 * this.context.lineWidth);
				var textRelativeWidth = textSize.width / (this.canvas.width - 3 * this.context.lineWidth);
				var textScale = 1 / Math.sqrt(textRelativeHeigt * textRelativeHeigt + textRelativeWidth * textRelativeWidth);
				this.context.font = (100 * textScale) + "px serif";
				// Draw text finally
				this.context.fillText(this.text , (this.canvas.width - textSize.width * textScale) / 2, this.canvas.height / 2 - textSize.actualBoundingBoxDescent * textScale + (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) * textScale / 2);
			}
			
		}
		var ctx = leinwand.context;
		ctx.drawImage(this.canvas, this.x - this.canvas.width * this.scale / 2, this.y - this.canvas.height * this.scale / 2, this.canvas.width * this.scale, this.canvas.height * this.scale);
		
		ctx.fillStyle = "rgb(255,255,0)";
		ctx.fillText("" + this.distance, this.x, this.y);
		
		
		// Draw all the links conecting to this particle
		for(let x of this.connections)
			x.draw(leinwand, time)
	}
	/*
	 * return the two closest points of the elipse of this partikel and of one choosen neighbor
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
		
		return [[thisX, thisY], [neighborsX, neighborsY]]
	}
	
	/*
	 * Dont call this directly
	 */
	addConnection(connection){
		this.connections.add(connection)
	}
	
	/*
	 * Returns whether this partikel is connected to an other partikel by an pfeil
	 */
	connectedWith(neighbor){
		for(let connection of this.connections)
			if(connection.from === neighbor || connection.to === neighbor)
				return true
		return false
	}
	
	/*
	 * Checks if the mouse is hovering over partikel and sets this.hover flag if so
	 */
	handleMouse(e){
		let inside;
		if(e.x === null)
			inside = false;
		else{
			let relativeX = (e.x - this.x) * 2 / this.width;
			let relativeY = (e.y - this.y) * 2 / this.height;
			inside = relativeX * relativeX + relativeY * relativeY < 1;
		}
		if(inside){
			if(e.klick){
				this.herde.stealFocus(this);
				this.refresh()
			}
		}
		if(inside != this.hover){
			this.refresh()
		}
		this.hover = inside;
	}
	
	addSatelite(){
		let satelite = new Satelite(this)
		this.satelites.push(satelite);
		this.updateSateliteAngles();
		return satelite;
	}
	removeSatelite(satelite){
		let indexOf = this.satelites.indexOf(satelite);
		if(!indexOf == -1){
			this.satelites.splice(indexOf, 1);
			this.updateSateliteAngles();
		}
	}
	updateSateliteAngles(){
		let offset = Math.PI * 2 / this.satelites.length;
		let angle = 0;
		for(let x of this.satelites){
			x.setAngle(angle)
			angle += offset;
		}
	}
}
