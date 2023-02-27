/*
 * A group of partikels and arrows inbetween them, that can be drawn to a leinwand.
 */
export class Herde{
	/*
	 * Creates new herde from array of partikels and arrow links between them.
	 * The Leinwand and dynamik needs to be specified later.
	 */
	constructor(partikels = [], links = []){
		this.partikels = partikels;
		this.links = links;
		this.todonew = false;
		this.leinwand = null;
		this.dynamik = null;
	}
	set_leinwand(leinwand){
		this.leinwand = leinwand;
	}
	set_dynamik(dynamik){
		this.dynamik = dynamik;
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
		for(let x of this.partikels){
			x.draw(leinwand, zeit);
		}
		for(let x of this.links){
			x.draw(leinwand, zeit);
		}
	}
}
