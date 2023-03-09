/**
 * @module drawing
 * @description This module implements the logic of drawing the visual elements to the canvas
 */


/**
 * Class representing the painted image of a particle
 * This class is an extension for the particle class
 */
export class ParticleImage{
	constructor(particle){
		this.particle = particle;
		this.todonew = true;
		this.canvas = null;
	}
	
	/**
	 * To be called when the apperance of the particle has changed and the drawing neads to be refreshed
	 */
	refresh(){
		if(!this.todonew && this.swarm != null){
			this.todonew = true;
			this.swarm.court.refresh();
		}
	}
	
	draw(time){
		if(this.visible){
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
					this.swarm.court.refresh(); // Continue animation
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
					this.swarm.court.refresh(); // Continue animation
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
				this.context.lineWidth = this.swarm.lineWidth;
				this.context.fillStyle = this.particle.mouse.hover ? "rgb(0,255,0)" : "rgb(100,100,255)";
				this.context.beginPath();
				this.context.ellipse(this.canvas.width / 2, this.canvas.height / 2, (this.canvas.width - this.context.lineWidth) / 2, (this.canvas.height - this.context.lineWidth) / 2, 0, 0, 2 * Math.PI);
				this.context.fill();
				this.context.strokeStyle = this.focus.focused ? "rgb(255,0,0)" : "rgb(0,0,0)"
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
		var ctx = this.swarm.court.context;
		ctx.drawImage(this.canvas, this.x - this.canvas.width * this.scale / 2, this.y - this.canvas.height * this.scale / 2, this.canvas.width * this.scale, this.canvas.height * this.scale);
		
		ctx.fillStyle = "rgb(255,255,0)";
		
		
		// Draw all the links conecting to this particle
		for(let x of this.connections)
			x.draw(time);
	}
	
	get bufferHeight(){
		return Math.round(this.bufferWidth * this.swarm.yStretch);
	}
}


/**
 * Class representing the painted image of a arrow
 * This class is an extension for the arrow class
 */
export class ArrowImage{
	constructor(arrow){
		this.arrow = this.arrow;
	}
	draw(zeit){
		
		// only draw once per frame
		if(this.lastDrawnFrameNumber != this.swarm.court.frameItem){
			this.lastDrawnFrameNumber = this.swarm.court.frameItem;
			
			var ctx = this.swarm.court.context;
			ctx.beginPath();
			let scaleMin = Math.min(this.to.scale, this.from.scale);
			ctx.lineWidth = this.swarm.lineWidth * scaleMin;
			
			let [[fromX, fromY], [toX, toY]] = this.from.closestPoints(this.to);
			
			let satX, satY;
			let sateliteWidth = 0;
			
			let fromSateliteScale = Math.max(0, this.from.scale - this.to.scale);
			if(fromSateliteScale > 0){
				[satX, satY] = this.fromSatelite.getCoordinates();
				[fromX, fromY] = [fromX + (satX - fromX) * fromSateliteScale, fromY + (satY - fromY) * fromSateliteScale];
				[satX, satY] = [fromX, fromY];
				sateliteWidth = fromSateliteScale * this.swarm.sateliteWidth * this.from.scale;
			}
			if(this.fromSatelite != null && this.to.visible && !this.to.going && !this.to.coming){
				this.from.removeSatelite(this.fromSatelite);
				this.fromSatelite = null;
			}
			
			let toSateliteScale = Math.max(0, this.to.scale - this.from.scale);
			if(toSateliteScale > 0){
				[satX, satY] = this.toSatelite.getCoordinates();
				[toX, toY] = [toX + (satX - toX) * toSateliteScale, toY + (satY - toY) * toSateliteScale];
				[satX, satY] = [toX, toY];
				sateliteWidth = toSateliteScale * this.swarm.sateliteWidth * this.to.scale;
			}
			if(this.toSatelite != null && this.from.visible && !this.from.going && !this.from.coming){
				this.to.removeSatelite(this.toSatelite);
				this.toSatelite = null;
			}
			
			if(sateliteWidth != 0){
				let sateliteHeight = sateliteWidth * this.swarm.yStretch;
				ctx.fillStyle = "rgb(0,0,0)";
				ctx.ellipse(satX, satY, sateliteWidth / 2, sateliteHeight / 2, 0, 0, 2 * Math.PI);
				ctx.fill();
			}
			
			if(this.from.visible && this.to.visible){
				ctx.moveTo(fromX, fromY);
				ctx.lineTo(toX, toY);
				ctx.stroke();
			}
		}
	}
}
