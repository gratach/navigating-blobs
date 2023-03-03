/*
 * A group of partikels and arrows inbetween them, that can be drawn to a leinwand.
 */
export class Herde{
	/*
	 * Creates new herde from array of partikels and arrow links between them.
	 * The Leinwand and dynamik needs to be specified later.
	 */
	constructor(partikels, links, dynamik){
		this.partikels = partikels;
		this.links = links;
		for(let x of this.partikels){
			x.set_herde(this);
		}
		for(let x of this.links){
			x.set_herde(this);
		}
		this.lineWidth = 4;
		this.sateliteWidth = 30;
		this.yStretch = 0.7;
		this.todonew = false;
		this.leinwand = null;
		this.dynamik = dynamik;
		this.noMouse = {"x" : null, "y" : null}
		this.mousePosition = this.noMouse
		this.frameNumber = 0;
		dynamik.set_herde(this);
	}
	get width(){
		return this.leinwand.width
	}
	get height(){
		return this.leinwand.height
	}
	set_leinwand(leinwand){
		this.leinwand = leinwand;
	}
	/*
	 * To be called when the apperance of blobs and arrows have changed.
	 */
	refresh(){
		if(!this.todonew && this.leinwand != null){
			this.todonew = true;
			this.leinwand.refresh();
		}
	}
	/*
	 * This function has to be called by the leinwand to redraw the szenario.
	 */
	draw(leinwand, zeit){
		this.todonew = false;
		this.dynamik.rearange()
		this.handleMouse()
		for(let x of this.partikels){
			x.draw(leinwand, zeit);
		}
		this.frameNumber += 1;
	}
	
	mouseEvent(e){
		this.mousePosition = [e.x, e.y]
		this.handleMouse(e.klick, e.doubleklick)
	}
	
	handleMouse(klick = false, doubleklick = false){
		let e = {
			x : this.mousePosition[0],
			y : this.mousePosition[1],
			klick : klick,
			doubleklick : doubleklick
		}
		for(let x of this.partikels){
			x.handleMouse(e);
		}
		for(let x of this.links){
			x.handleMouse(e);
		}
	}
}
