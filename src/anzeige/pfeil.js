export class Pfeil{
	constructor(von, zu){
		this.from = von;
		this.to = zu;
		this.from.addConnection(this)
	}
	draw(leinwand, zeit){
		var ctx = leinwand.context;
		ctx.beginPath();
		ctx.lineWidth = this.herde.lineWidth;
		
		let [[fromX, fromY], [toX, toY]] = this.from.closestPoints(this.to);
		
		ctx.moveTo(fromX, fromY);
		ctx.lineTo(toX, toY);
		ctx.stroke();
	}
	set_herde(herde){
		this.herde = herde;
	}
}
