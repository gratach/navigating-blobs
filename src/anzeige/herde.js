import {Analyzer} from "./analyzer.js"
import {Plow} from "./plow.js"
/*
 * A group of partikels and arrows inbetween them, that can be drawn to a leinwand.
 */
export class Herde{
	/*
	 * Creates new herde from array of partikels and arrow links between them.
	 * The Leinwand and dynamik needs to be specified later.
	 */
	constructor( dynamik){
		this.partikels = [];
		this.allParticles = new Set();
		this.links = [];
		this.lineWidth = 4;
		this.sateliteWidth = 30;
		this.yStretch = 0.7;
		this.todonew = false;
		this.leinwand = null;
		this.dynamik = dynamik;
		this.noMouse = {"x" : null, "y" : null}
		this.mousePosition = this.noMouse;
		this.frameNumber = 0;
		
		this.focusedParticles = [];
		this.mainFocus = null;
		this.analyzer = new Analyzer(this)
		
		this.plow = new Plow(this)
		
		dynamik.set_herde(this);
	}
	//set focus value of particle to true or false
	setFocus(particle, focusValue, analyze = true){
		if(this.focused != focusValue){
			if(focusValue){
				this.focusedParticles.push(particle);
			}
			else{
				this.focusedParticles.splice(this.focusedParticles.indexOf(particle), 1);
				if(this.mainFocus === particle){
					this.mainFocus = null;
					particle.mainFocus = false;
				}
			}
			particle.focused = focusValue;
			particle.refresh();
			if(analyze)
				this.analyzer.analyze()
		}
	}
	setMainFocus(particle, analyze = true){
		this.setFocus(particle, true, false);
		if(this.mainFocus !== null)
			this.mainFocus.mainFocus = false;
		this.mainFocus = particle;
		particle.mainFocus = true;
		if(analyze)
			this.analyzer.analyze()
	}
	stealFocus(particle){
		if(particle.closestFocus !== null){
			this.setFocus(particle.closestFocus, false, false);
		}
		this.setMainFocus(particle);
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
	addParticle(particle){
		if(this.partikels.indexOf(particle) == -1){
			this.partikels.push(particle);
		}
	}
	removeParticle(particle){
		let index = this.partikels.indexOf(particle);
		if(index != -1){
			this.partikels.splice(index, 1);
		}
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
