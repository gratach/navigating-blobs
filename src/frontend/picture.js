/**
 * Provides an fullscreen canvas that adds itself to the html body.
 * Accepts a drawing as argument that states what should be drawn in the canvas. 
 */
export class Picture{
	constructor(){
		
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
		window.document.body.appendChild(this.canvas);
	}
	
	
}
