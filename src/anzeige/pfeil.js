export class Pfeil{
	constructor(von, zu){
		this.from = von;
		this.to = zu;
		this.from.addConnection(this);
		this.fromSatelite = null;
		this.toSatelite = null;
	}
	draw(leinwand, zeit){
		
		// only draw once per frame
		if(this.lastDrawnFrameNumber != this.herde.frameNumber){
			this.lastDrawnFrameNumber = this.herde.frameNumber;
			
			var ctx = leinwand.context;
			ctx.beginPath();
			let scaleMin = Math.min(this.to.scale, this.from.scale);
			ctx.lineWidth = this.herde.lineWidth * scaleMin;
			
			let [[fromX, fromY], [toX, toY]] = this.from.closestPoints(this.to);
			
			let satX, satY;
			let sateliteWidth = 0;
			
			let fromSateliteActive = Math.max(0, this.from.scale - this.to.scale);
			if(fromSateliteActive > 0){
				if(this.fromSatelite == null)
					this.fromSatelite = this.from.addSatelite();
				[satX, satY] = this.fromSatelite.getCoordinates();
				[fromX, fromY] = [fromX + (satX - fromX) * fromSateliteActive, fromY + (satY - fromY) * fromSateliteActive];
				[satX, satY] = [fromX, fromY];
				sateliteWidth = fromSateliteActive * this.herde.sateliteWidth * this.from.scale;
			}
			else if(this.fromSatelite != null){
				this.from.removeSatelite(this.fromSatelite);
				this.fromSatelite = null;
			}
			
			let toSateliteActive = Math.max(0, this.to.scale - this.from.scale);
			if(toSateliteActive > 0){
				if(this.toSatelite == null)
					this.toSatelite = this.to.addSatelite();
				[satX, satY] = this.toSatelite.getCoordinates();
				[toX, toY] = [toX + (satX - toX) * toSateliteActive, toY + (satY - toY) * toSateliteActive];
				[satX, satY] = [toX, toY];
				sateliteWidth = toSateliteActive * this.herde.sateliteWidth * this.to.scale;
			}
			else if(this.toSatelite !== null){
				this.to.removeSatelite(this.toSatelite);
				this.toSatelite = null;
			}
			
			if(sateliteWidth != 0){
				let sateliteHeight = sateliteWidth * this.herde.yStretch;
				ctx.ellipse(satX, satY, sateliteWidth / 2, sateliteHeight / 2, 0, 0, 2 * Math.PI);
				ctx.fill()
			}
			
			if(!this.from.visible){
				if(this.to.visible && this.toSatelite != null){
					[this.from.x, this.from.y] = [satX, satY];
					console.log("setzeauf", satX, satY);
				}
					
			}
			else if(!this.to.visible){
				if(this.from.visible && this.fromSatelite != null){
					[this.to.x, this.to.y] = [satX, satY];
					console.log("setzeauf", satX, satY);
				}
			}
			else{
				ctx.moveTo(fromX, fromY);
				ctx.lineTo(toX, toY);
				ctx.stroke();
			}
		}
	}
	set_herde(herde){
		this.herde = herde;
		this.lastDrawnFrameNumber = -1;
	}
	handleMouse(e){
		
	}
}
