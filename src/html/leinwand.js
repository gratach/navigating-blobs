/**
 * Provides an fullscreen canvas that adds itself to the html body.
 * Accepts a drawing as argument that states what should be drawn in the canvas. 
 */
export class Leinwand{
	constructor(drawing){
		this.drawing = drawing;
		this.drawing.set_leinwand(this);
		
		this.styles = document.createElement("style");
		this.styles.innerText = `
		* {
			box-sizing: border-box; 
			margin : 0;
			border : 0;
			padding : 0;
			overflow : hidden;
		}`;
		window.document.head.appendChild(this.styles);
		
		this.canvas = document.createElement("canvas");
		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";
		this.context = this.canvas.getContext("2d")
		let skaliere = ()=>{
			this.width = window.innerWidth;
			this.canvas.width = this.width;
			this.height = window.innerHeight;
			this.canvas.height = this.height;
			this.refresh();
		};
		let mousemove = (e)=>{
			let rect = this.canvas.getBoundingClientRect();
			this.drawing.mouseMove({
				"x" : (e.clientX - rect.left) * this.canvas.width / rect.width,
				"y" : (e.clientY - rect.top) * this.canvas.height / rect.height
			})
		}
		this.canvas.onmousemove = mousemove;
		this.todonew = false;
		window.document.body.onresize = skaliere;
		window.document.body.appendChild(this.canvas);
		skaliere();
	}
	
	/*
	 * To be called when the drawing has changed and neads to be refreshed.
	 */
	refresh(){
		if(!this.todonew){
			this.todonew = true;
			window.requestAnimationFrame((zeit)=>this.frame(zeit));
		}
	}
	/*
	 * Do not call this function directly
	 */
	frame(zeit){
		this.todonew = false;
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.drawing.draw(this, zeit);
	}
}
