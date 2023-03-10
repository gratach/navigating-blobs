/**
 * @module mouseevents
 * @description This module implements the logic of all mouse activities beeing handled
 */

/**
 * The handler for global mouse events
 */
export class SwarmMouseHandler{
	constructor(swarm){
		/** The swarm containing this class */
		this.swarm = swarm
		
		/** Bool to show if the mouse has doubleclicked recently */
		this.doubleclicked = false;
		
		/** Bool to show if the mouse has clicked recently (This is not triggered on doubleclick)*/
		this.clicked = false;
		
		/** x position of mouse */
		this.x = undefined;
		
		/** y position of mouse */
		this.y = undefined;
		
		this.justclicked = false;
		this.secondClick = false;
		this.internally = false;
	}
	
	
	/**
	 * Function to handle mousedown event on canvas
	 */
	mouseDown(e){
		if(!this.secondClick){
			if(this.justclicked){
				this.secondClick = true;
				// Trigger doubleclick event
				this.mouseEvent(e, false, true);
			}
			else{
				this.justclicked = true;
				setTimeout(()=>{
					this.justclicked = false;
					if(!this.secondClick){
						// Trigger click event
						this.mouseEvent(e, true);
					}
					this.secondClick = false;
				}, 200)
			}
		}
	}
	
	/**
	 * Function to handle mousemove event on canvas
	 */
	mouseMove(e){
		this.mouseEvent(e)
	}
	
	/**
	 * Function to trigger all mouse related interactions
	 */
	handleMouse(){
		if(!this.internally){
			this.clicked = false;
			this.doubleclicked = false;
		}
		for(let x of this.swarm.spot.visualParticles){
			x.mouse.handleMouse();
		}
	}
	
	mouseEvent(e, click = false, doubleclick = false){
		let rect = this.swarm.screen.canvas.getBoundingClientRect();
		this.x = (e.clientX - rect.left) * this.swarm.screen.canvas.width / rect.width;
		this.y = (e.clientY - rect.top) * this.swarm.screen.canvas.height / rect.height;
		this.clicked = click;
		this.doubleclicked = doubleclick;
		this.internally = true;
		this.handleMouse();
		this.internally = false;
	}
	
}

/**
 * The handler for mouse events of one single particle
 */
export class ParticleMouseHandler{
	constructor(particle){
		this.particle = particle;
		this.swarm = particle.swarm;
		this.hover = false;
	}
	/**
	 * Checks if the mouse is hovering over particle and sets this.hover flag if so
	 */
	handleMouse(){
		let inside;
		if(this.swarm.mouse.x === null)
			inside = false;
		else{
			let relativeX = (this.swarm.mouse.x - this.particle.spot.x) * 2 / this.particle.spot.width;
			let relativeY = (this.swarm.mouse.y - this.particle.spot.y) * 2 / this.particle.spot.height;
			inside = relativeX * relativeX + relativeY * relativeY < 1;
		}
		if(inside){
			if(this.swarm.mouse.clicked){
				this.particle.focus.stealFocus();
				this.particle.image.refresh();
			}
			else if(this.swarm.mouse.doubleclicked){
				if(this.particle.focus.focused){
					if(this.swarm.focus.countFocus() > 1){
						this.particle.focus.setFocus(false);
						this.particle.image.refresh();
					}
				}
				else{
					this.particle.focus.setMainFocus(this.particle);
					this.particle.image.refresh();
				}
			}
		}
		if(inside != this.hover){
			this.particle.image.refresh();
		}
		this.hover = inside;
	}
}
