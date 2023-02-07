export class Leinwand{
	constructor(zeichnung){
		this.zeichnung = zeichnung;
		
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
		let erneuere = ()=>{
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.zeichnung.male(this);
		};
		window.document.body.onresize = erneuere;
		window.document.body.appendChild(this.canvas);
		erneuere();
	}
}
