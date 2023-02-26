export class Partikel{
	constructor(x, y, text){
		this.text = text;
		this.x = x;
		this.y = y;
		this.canvas = document.createElement("canvas");
		this.canvas.width = 500;
		this.canvas.height = 300;
		this.context = this.canvas.getContext("2d");
		this.context.lineWidth = 10;
		this.context.fillStyle = "rgb(255,0,0)";
		this.context.beginPath();
		this.context.ellipse(this.canvas.width / 2, this.canvas.height / 2, (this.canvas.width - this.context.lineWidth) / 2, (this.canvas.height - this.context.lineWidth) / 2, 0, 0, 2 * Math.PI);
		this.context.stroke();
		this.context.fillStyle = "rgb(255,0,0)";
		//this.context.fillRect(0, 0, 10, 10);
		this.context.font = 100 + "px serif";
		var textSize = this.context.measureText(text);
		var textRelativeHeigt = (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) / (this.canvas.height - 3 * this.context.lineWidth);
		var textRelativeWidth = textSize.width / (this.canvas.width - 3 * this.context.lineWidth);
		var textScale = 1 / Math.sqrt(textRelativeHeigt * textRelativeHeigt + textRelativeWidth * textRelativeWidth);
		//alert([textSize.fontBoundingBoxAscent, textSize.fontBoundingBoxDescent, textRelativeWidth, textRelativeHeigt, textRelativeRadius]);
		console.log(textSize)
		this.context.font = (100 * textScale) + "px serif";
		this.context.fillText(text , (this.canvas.width - textSize.width * textScale) / 2, this.canvas.height / 2 - textSize.actualBoundingBoxDescent * textScale + (textSize.actualBoundingBoxAscent + textSize.actualBoundingBoxDescent) * textScale / 2);
	}
	draw(leinwand, zeit){
		var ctx = leinwand.context;
		ctx.drawImage(this.canvas, this.x, this.y, this.canvas.width, this.canvas.height);
	}
}
