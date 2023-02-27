export class Partikel{
	/*
	 * Creates some text bubble, that is drawn to a buffer
	 */
	constructor(x, y, text){
		this.text = text;
		this.x = x;
		this.y = y;
		this.scale = 1;
		
		// Create buffer
		this.canvas = document.createElement("canvas");
		this.canvas.width = 200;
		this.canvas.height = 120;
		this.context = this.canvas.getContext("2d");
		
		// Draw elipse to buffer
		this.context.lineWidth = 4;
		this.context.fillStyle = "rgb(255,0,0)";
		this.context.beginPath();
		this.context.ellipse(this.canvas.width / 2, this.canvas.height / 2, (this.canvas.width - this.context.lineWidth) / 2, (this.canvas.height - this.context.lineWidth) / 2, 0, 0, 2 * Math.PI);
		this.context.stroke();
		
		// Draw text to buffer
		this.context.fillStyle = "rgb(255,0,0)";
		// Rescale text
		this.context.font = 100 + "px serif";
		var textSize = this.context.measureText(text);
		var textRelativeHeigt = (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) / (this.canvas.height - 3 * this.context.lineWidth);
		var textRelativeWidth = textSize.width / (this.canvas.width - 3 * this.context.lineWidth);
		var textScale = 1 / Math.sqrt(textRelativeHeigt * textRelativeHeigt + textRelativeWidth * textRelativeWidth);
		this.context.font = (100 * textScale) + "px serif";
		// Draw text finally
		this.context.fillText(text , (this.canvas.width - textSize.width * textScale) / 2, this.canvas.height / 2 - textSize.actualBoundingBoxDescent * textScale + (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) * textScale / 2);
	}
	get width(){
		return this.canvas.width * this.scale;
	}
	get height(){
		return this.canvas.height * this.scale;
	}
	draw(leinwand, zeit){
		var ctx = leinwand.context;
		ctx.drawImage(this.canvas, this.x - this.canvas.width * this.scale / 2, this.y - this.canvas.height * this.scale / 2, this.canvas.width * this.scale, this.canvas.height * this.scale);
	}
}
