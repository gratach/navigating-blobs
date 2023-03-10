/**
 * @module drawing
 * @description This module implements the logic of drawing the visual elements to the canvas
 */

/**
 * Class representing the painted image of the whole canvas
 * This class is an extension for the swarm class
 */
export class SwarmImage{
	constructor(swarm, canvas){
		this.swarm = swarm
		
		//drawing
		this.lineWidth = 4;
	}
	/**
	 * Draw the whole swarm to the canvas at a given time
	 */
	draw(zeit){
		for(let x of this.swarm.spot.visualParticles){
			x.image.draw(zeit);
		}
	}
}

/**
 * Class representing the painted image of a particle
 * This class is an extension for the particle class´
 */
export class ParticleImage{
	constructor(particle){
		this.particle = particle;
		this.swarm = particle.swarm;
		this.todonew = true;
		this.canvas = null;
	}
	
	/**
	 * To be called when the apperance of the particle has changed and the drawing neads to be refreshed
	 */
	refresh(){
		if(!this.todonew && this.swarm != null){
			this.todonew = true;
			this.swarm.screen.refresh();
		}
	}
	
	draw(time){
		if(this.particle.spot.visible){
			this.particle.spot.updateScale();
		}
				
		// Draw text bubble to buffer if necessary
		if(this.todonew){
			this.todonew = false;
			
			if(this.particle.spot.visible){
				
		
				// Create buffer if necessary
				if(this.canvas == null || this.canvas.width != this.particle.spot.naturalWidth || this.canvas.height != this.particle.spot.naturalHeight){
					this.canvas = document.createElement("canvas");
					this.canvas.width = this.particle.spot.naturalWidth;
					this.canvas.height = this.particle.spot.naturalHeight;
					this.context = this.canvas.getContext("2d");
				}
				
				
				// Draw elipse to buffer
				this.context.lineWidth = this.swarm.image.lineWidth;
				this.context.fillStyle = this.particle.mouse.hover ? "rgb(0,255,0)" : "rgb(100,100,255)";
				this.context.beginPath();
				this.context.ellipse(this.canvas.width / 2, this.canvas.height / 2, (this.canvas.width - this.context.lineWidth) / 2, (this.canvas.height - this.context.lineWidth) / 2, 0, 0, 2 * Math.PI);
				this.context.fill();
				this.context.strokeStyle = this.particle.focus.focused ? "rgb(255,0,0)" : "rgb(0,0,0)"
				this.context.stroke();
				
				// Draw text to buffer
				this.context.fillStyle = "rgb(0,0,0)";
				// Rescale text
				this.context.font = 100 + "px serif";
				var textSize = this.context.measureText(this.particle.data.text);
				var textRelativeHeigt = (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) / (this.canvas.height - 3 * this.context.lineWidth);
				var textRelativeWidth = textSize.width / (this.canvas.width - 3 * this.context.lineWidth);
				var textScale = 1 / Math.sqrt(textRelativeHeigt * textRelativeHeigt + textRelativeWidth * textRelativeWidth);
				this.context.font = (100 * textScale) + "px serif";
				// Draw text finally
				this.context.fillText(this.particle.data.text , (this.canvas.width - textSize.width * textScale) / 2, this.canvas.height / 2 - textSize.actualBoundingBoxDescent * textScale + (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) * textScale / 2);
			}
			
		}
		let ctx = this.swarm.screen.context;
		let scale = this.particle.spot.scale;
		ctx.drawImage(this.canvas, this.particle.spot.x - this.canvas.width * this.particle.spot.scale / 2, this.particle.spot.y - this.canvas.height * scale / 2, this.canvas.width * scale, this.canvas.height * scale);
		
		ctx.fillStyle = "rgb(255,255,0)";
		
		
		// Draw all the links conecting to this particle
		for(let x of this.particle.data.connections)
			x.image.draw(time);
	}
}


/**
 * Class representing the painted image of a arrow
 * This class is an extension for the arrow class
 */
export class ArrowImage{
	constructor(arrow){
		this.arrow = arrow;
		this.swarm = arrow.swarm;
		
		this.lastDrawnFrameNumber = null;
	}
	draw(zeit){
		// only draw once per frame
		if(this.lastDrawnFrameNumber != this.swarm.screen.frameItem){
			this.lastDrawnFrameNumber = this.swarm.screen.frameItem;
			
			let toParticle = this.arrow.data.to;
			let fromParticle = this.arrow.data.from;
			let toSpot = toParticle.spot;
			let fromSpot = fromParticle.spot;
			let fromSatellite = this.arrow.orbit.fromSatellite;
			let toSatellite = this.arrow.orbit.toSatellite;
			
			var ctx = this.swarm.screen.context;
			ctx.beginPath();
			let scaleMin = Math.min(toSpot.scale, fromSpot.scale);
			ctx.lineWidth = this.swarm.image.lineWidth * scaleMin;
			
			let [[fromX, fromY], [toX, toY]] = fromSpot.closestPoints(toParticle);
			
			let satX, satY;
			let satelliteWidth = 0;
			
			let fromSatelliteScale = Math.max(0, fromSpot.scale - toSpot.scale);
			if(fromSatelliteScale > 0){
				[satX, satY] = fromSatellite.getCoordinates();
				[fromX, fromY] = [fromX + (satX - fromX) * fromSatelliteScale, fromY + (satY - fromY) * fromSatelliteScale];
				[satX, satY] = [fromX, fromY];
				satelliteWidth = fromSatelliteScale * this.swarm.satelliteWidth * fromSpot.scale;
			}
			if(fromSatellite != null && toSpot.visible && !toSpot.going && !toSpot.coming){
				fromParticle.orbit.removeSatellite(fromSatellite);
				this.arrow.orbit.fromSatellite = null;
			}
			
			let toSatelliteScale = Math.max(0, toSpot.scale - fromSpot.scale);
			if(toSatelliteScale > 0){
				[satX, satY] = toSatellite.getCoordinates();
				[toX, toY] = [toX + (satX - toX) * toSatelliteScale, toY + (satY - toY) * toSatelliteScale];
				[satX, satY] = [toX, toY];
				satelliteWidth = toSatelliteScale * this.swarm.satelliteWidth * toSpot.scale;
			}
			if(toSatellite != null && fromSpot.visible && !fromSpot.going && !fromSpot.coming){
				toParticle.orbit.removeSatellite(toSatellite);
				this.arrow.orbit.toSatellite = null;
			}
			
			if(satelliteWidth != 0){
				let satelliteHeight = satelliteWidth * this.swarm.spot.standardYStretch;
				ctx.fillStyle = "rgb(0,0,0)";
				ctx.ellipse(satX, satY, satelliteWidth / 2, satelliteHeight / 2, 0, 0, 2 * Math.PI);
				ctx.fill();
			}
			
			if(fromSpot.visible && toSpot.visible){
				ctx.moveTo(fromX, fromY);
				ctx.lineTo(toX, toY);
				ctx.stroke();
			}
		}
	}
}
