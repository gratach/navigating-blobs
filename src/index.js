import {Leinwand} from "./html/leinwand.js";
import {Zeichnung} from "./html/zeichnung.js";
var z = new Zeichnung();
z.ebenen.push(
	(ctx, w, h) => {
		ctx.fillRect(w / 3, h / 3, w / 3, h / 3);
		ctx.fillStyle = "rgb(255,0,0)";
		ctx.fillText("Hi there", w / 2, h / 2);
	})
var l = new Leinwand(z);
