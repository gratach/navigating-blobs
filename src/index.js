import {Leinwand} from "./html/leinwand.js";
import {Herde} from "./anzeige/herde.js";
import {Partikel} from "./anzeige/partikel.js";
import {Pfeil} from "./anzeige/pfeil.js";
import {Dynamik} from "./anordnung/dynamik.js"
/*
 * Simple Programm to create some blobs and draw them to a canvas.
 */
var p1 = new Partikel(400, 100, "Hallo, Das");
var p2 = new Partikel(500, 500, "ist ein");
var p3 = new Partikel(100, 400, "Test");
var l1 = new Pfeil(p1, p2);
var l2 = new Pfeil(p2, p3);
var d  = new Dynamik()
var h = new Herde([p1, p2, p3], [l1, l2], d);
// z.ebenen.push(
// 	(ctx, w, h, zeit) => {
// 		ctx.fillRect(w / 3, h / 3, w / 3, h / 3);
// 		ctx.fillStyle = "rgb(255,0,0)";
// 		ctx.fillText("Hi there " + zeit , w / 2, h / 2);
// 	})
 
var l = new Leinwand(h);
