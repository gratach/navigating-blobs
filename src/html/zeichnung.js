/*
 * Provides some type of drawing that can be applyed to Leinwand classes.
 */
export class Zeichnung{
	constructor(){
		this.ebenen = [];
	}
	male(leinwand){
		for(let x of this.ebenen){
			window.breit = leinwand.breit;
			window.hoch = leinwand.hoch;
			x(leinwand.context, leinwand.canvas.width, leinwand.canvas.height);
		}
	}
}
