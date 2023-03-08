/**
 * @module visibility
 * @description This module implements the logic of the visible elements that are beeing rendered to the screen
 */

/**
 * An class representing the visible screen where the elements are rendered on
 */
export class Court{
	constructor(swarm, canvas){
		this.swarm = swarm;
		/** The canvas element */
		this.canvas = canvas;
		/** The context 2d of the canvas */
		this.context = this.canvas.getContext("2d");
		canvas.onmousedown = (e)=>{this.swarm.mouse.mouseDown(e)};
		canvas.onmousemove = (e)=>{this.swarm.mouse.mouseMove(e)};
		this.todonew = false;
		canvas.onresize = ()=>{this.onResize()};
		
		/** The width of the canvas in pixel */
		this.width = null;
		
		/** The height of the canvas in pixel */
		this.height = null;
		
		/** An unique item that identifyes the current frame. This can be helpfull´ to prevent that elements are been drawn twice. */
		this.frameItem = 0;
		
		this.onResize()
	}
	
	/**
	 * Trigger the next frame to redraw the canvas - do nothing if the next frame has already been triggered and will happen soon
	 */
	refresh(){
		if(!this.todonew){
			this.todonew = true;
			window.requestAnimationFrame((zeit)=>this.draw(zeit));
		}
	}
	
	onResize(){
		this.width = window.innerWidth;
		this.canvas.width = this.width;
		this.height = window.innerHeight;
		this.canvas.height = this.height;
		this.refresh();
	}
	
	draw(zeit){
		console.log("draw")
		this.todonew = false;
		
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
		
		this.swarm.dynamic.rearange();
		this.swarm.mouse.handleMouse();
		for(let x of this.swarm.particles){
			x.draw(zeit);
		}
		this.frameItem += 1;
	}
}
