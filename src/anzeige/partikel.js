export class Partikel{
	/*
	 * Creates some text bubble
	 */
	constructor(x, y, text){
		this.todonew = true;
		
		this.text = text;
		this.x = x;
		this.y = y;
		this.scale = 1;
		this.bufferWidth = 200;
		this.canvas = null;
		this.connections = new Set();
		this.hover = false;
	}
	set_herde(herde){
		this.herde = herde;
		this.refresh();
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
	draw(leinwand, zeit){
		// Draw text bubble to buffer if necessary
		if(this.todonew){
			this.todonew = false;
		
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
		var ctx = leinwand.context;
		ctx.drawImage(this.canvas, this.x - this.canvas.width * this.scale / 2, this.y - this.canvas.height * this.scale / 2, this.canvas.width * this.scale, this.canvas.height * this.scale);
	}
	/*
	 * return the two closest points of the elipse of this partikel and of one choosen neighbor
	 */
	closestPoints(neighbor){
		// Find relative part of link line to cut at the this end
		var x = (neighbor.x - this.x) / (this.width / 2);
		var y = (neighbor.y - this.y) / (this.height / 2);
		var fromCut =  1 / Math.sqrt(x * x + y * y);
		
		// Find relative part of link line to cut at the neigbours end
		x = (this.x - neighbor.x) / (neighbor.width / 2);
		y = (this.y - neighbor.y) / (neighbor.height / 2);
		var toCut =  1 / Math.sqrt(x * x + y * y);
		
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
	
	handleMouse(e){
		let inside;
		if(e.x === null)
			inside = false;
		else{
			let relativeX = (e.x - this.x) * 2 / this.width;
			let relativeY = (e.y - this.y) * 2 / this.height;
			inside = relativeX * relativeX + relativeY * relativeY < 1;
		}
		if(inside != this.hover){
			this.refresh()
		}
		this.hover = inside;
	}
}
