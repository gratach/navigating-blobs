import {Leinwand} from "./html/leinwand.js";
import {Herde} from "./anzeige/herde.js";
import {Partikel} from "./anzeige/partikel.js";
import {Pfeil} from "./anzeige/pfeil.js";
/*
 * Simple Programm to create some blobs and draw them to a canvas.
 */
var p1 = new Partikel(100, 100, "Hallo Das ist.");
var p2 = new Partikel(500, 500, "Hi");
var l1 = new Pfeil(p1, p2);
var h = new Herde([p1, p2], [l1]);
// z.ebenen.push(
// 	(ctx, w, h, zeit) => {
// 		ctx.fillRect(w / 3, h / 3, w / 3, h / 3);
// 		ctx.fillStyle = "rgb(255,0,0)";
// 		ctx.fillText("Hi there " + zeit , w / 2, h / 2);
// 	})
 
var l = new Leinwand(h);
