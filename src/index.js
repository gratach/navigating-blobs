import {Leinwand} from "./html/leinwand.js";
import {Herde} from "./anzeige/herde.js";
import {Partikel} from "./anzeige/partikel.js";
import {Pfeil} from "./anzeige/pfeil.js";
import {Dynamik} from "./anordnung/dynamik.js"
/*
 * Simple Programm to create some blobs and draw them to a canvas.
 */
var p1 = new Partikel(100, 100, "Hallo, Das");
var p2 = new Partikel(100, 100, "ist ein");
var p3 = new Partikel(100, 600, "Test");
var p4 = new Partikel(500, 100, "und");
var p5 = new Partikel(500, 300, "er");
var p6 = new Partikel(500, 600, "geht");
var p7 = new Partikel(900, 100, "noch");
var p8 = new Partikel(900, 300, "weiter?");
var p9 = new Partikel(900, 600, "weiter!");
p8.vanish();
p9.vanish();
setTimeout(()=>{p8.appear()}, 1500);
var l1 = new Pfeil(p1, p2);
var l2 = new Pfeil(p2, p3);
var l3 = new Pfeil(p3, p4);
var l4 = new Pfeil(p4, p5);
var l5 = new Pfeil(p5, p6);
var l6 = new Pfeil(p6, p7);
var l7 = new Pfeil(p7, p8);
var l8 = new Pfeil(p7, p9);
var d  = new Dynamik()
var h = new Herde([p1, p2, p3, p4, p5, p6, p7, p8, p9], [l1, l2, l3, l4, l5, l6, l7, l8], d);
// z.ebenen.push(
// 	(ctx, w, h, zeit) => {
// 		ctx.fillRect(w / 3, h / 3, w / 3, h / 3);
// 		ctx.fillStyle = "rgb(255,0,0)";
// 		ctx.fillText("Hi there " + zeit , w / 2, h / 2);
// 	})
 
var l = new Leinwand(h);
