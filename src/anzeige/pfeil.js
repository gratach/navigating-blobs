export class Pfeil{
	constructor(von, zu){
		this.from = von;
		this.to = zu;
	}
	draw(leinwand, zeit){
		var ctx = leinwand.context;
		ctx.beginPath();
		ctx.lineWidth = 4;
		
		// Find relative part of link line to cut at the from end
		var x = (this.to.x - this.from.x) / (this.from.width / 2);
		var y = (this.to.y - this.from.y) / (this.from.height / 2);
		var fromCut =  1 / Math.sqrt(x * x + y * y);
		
		// Find relative part of link line to cut at the to end
		x = (this.from.x - this.to.x) / (this.to.width / 2);
		y = (this.from.y - this.to.y) / (this.to.height / 2);
		var toCut =  1 / Math.sqrt(x * x + y * y);
		
		var fromX, fromY, toX, toY;
		
		fromX = this.from.x + (this.to.x - this.from.x) * fromCut;
		fromY = this.from.y + (this.to.y - this.from.y) * fromCut;
		
		toX = this.to.x + (this.from.x - this.to.x) * toCut;
		toY = this.to.y + (this.from.y - this.to.y) * toCut;
		
		ctx.moveTo(fromX, fromY);
		ctx.lineTo(toX, toY);
		ctx.stroke();
	}
}
