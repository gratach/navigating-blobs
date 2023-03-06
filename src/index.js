import {Leinwand} from "./html/leinwand.js";
import {Herde} from "./anzeige/herde.js";
import {Partikel} from "./anzeige/partikel.js";
import {Pfeil} from "./anzeige/pfeil.js";
import {Dynamik} from "./anordnung/dynamik.js"
/*
 * Simple Programm to create some blobs and draw them to a canvas.
 */
var d  = new Dynamik()
var h = new Herde( d);
var p1 = new Partikel(h, "Hallo, Das");
var p2 = new Partikel(h, "ist ein");
var p3 = new Partikel(h, "Test");
var p4 = new Partikel(h, "und");
var p5 = new Partikel(h, "er");
var p6 = new Partikel(h, "geht");
var p7 = new Partikel(h, "noch");
var p8 = new Partikel(h, "weiter");
var p9 = new Partikel(h, "!");
var l1 = new Pfeil(p1, p2);
var l2 = new Pfeil(p2, p3);
var l3 = new Pfeil(p3, p4);
var l4 = new Pfeil(p4, p5);
var l5 = new Pfeil(p5, p6);
var l6 = new Pfeil(p6, p7);
var l7 = new Pfeil(p7, p8);
var l8 = new Pfeil(p8, p9);
var p5 = new Partikel(h, "A");
var p6 = new Partikel(h, "B");
var p7 = new Partikel(h, "C");
var p8 = new Partikel(h, "D");
var p9 = new Partikel(h, "E");
var l5 = new Pfeil(p5, p6);
var l6 = new Pfeil(p6, p7);
var l7 = new Pfeil(p7, p8);
var l8 = new Pfeil(p7, p9);
new Pfeil(p9, p3)
var p5 = new Partikel(h, "er");
var p6 = new Partikel(h, "geht");
var p7 = new Partikel(h, "noch");
var p8 = new Partikel(h, "weiter?");
var p9 = new Partikel(h, "weiter!");
var l5 = new Pfeil(p5, p6);
var l6 = new Pfeil(p6, p7);
var l7 = new Pfeil(p7, p8);
var l8 = new Pfeil(p7, p9);
new Pfeil(p7, p2)
new Pfeil(p8, p3)
h.setFocus(p1, true)
// z.ebenen.push(
// 	(ctx, w, h, zeit) => {
// 		ctx.fillRect(w / 3, h / 3, w / 3, h / 3);
// 		ctx.fillStyle = "rgb(255,0,0)";
// 		ctx.fillText("Hi there " + zeit , w / 2, h / 2);
// 	})
 
var l = new Leinwand(h);
