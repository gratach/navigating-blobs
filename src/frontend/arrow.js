export class Arrow{
	constructor(von, zu){
		this.from = von;
		this.to = zu;
		this.swarm = von.swarm;
		this.from.addConnection(this);
		this.to.addConnection(this);
		this.fromSatelite = null;
		this.toSatelite = null;
	}
	other(particle){
		if(particle === this.from)
			return this.to;
		if(particle === this.to)
			return this.from;
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
	
	// Manages the existance of satelites
	checkSatelites(){
		let fromSatelitShouldExist = this.from.visible && (!this.to.visible || this.to.coming || this.to.going);
		if(fromSatelitShouldExist && this.fromSatelite == null)
			this.fromSatelite = this.from.addSatelite(this);
		else if(!fromSatelitShouldExist && this.fromSatelite != null){
			this.from.removeSatelite(this.fromSatelite);
			this.fromSatelite = null;
		}
			
		let toSatelitShouldExist = this.to.visible && (!this.from.visible || this.from.coming || this.from.going);
		if(toSatelitShouldExist && this.toSatelite == null)
			this.toSatelite = this.to.addSatelite(this);
		else if(!toSatelitShouldExist && this.toSatelite != null){
			this.to.removeSatelite(this.toSatelite);
			this.toSatelite = null;
		}
	}
	
	// Get the satelite representing this particle if anny
	sateliteRepresentation(particle){
		if(this.from === particle)
			return this.toSatelite;
		if(this.to === particle)
			return this.fromSatelite;
		return null;
	}
	set_swarm(swarm){
		this.swarm = swarm;
		this.lastDrawnFrameNumber = -1;
	}
	handleMouse(){
		
	}
}
