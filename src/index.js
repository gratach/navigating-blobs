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
var p1 = new Partikel(h, 100, 100, "Hallo, Das");
var p2 = new Partikel(h, 100, 100, "ist ein");
var p3 = new Partikel(h, 100, 600, "Test");
var p4 = new Partikel(h, 500, 100, "und");
var p5 = new Partikel(h, 500, 300, "er");
var p6 = new Partikel(h, 500, 600, "geht");
var p7 = new Partikel(h, 900, 100, "noch");
var p8 = new Partikel(h, 900, 300, "weiter?");
var p9 = new Partikel(h, 900, 600, "weiter!");
p1.appear();
p2.appear();
p3.appear();
p4.appear();
p5.appear();
p6.appear();
p7.appear();
p8.appear();
p9.appear();
setTimeout(()=>{p8.vanish()}, 1500);
var l1 = new Pfeil(p1, p2);
var l2 = new Pfeil(p2, p3);
var l3 = new Pfeil(p3, p4);
var l4 = new Pfeil(p4, p5);
var l5 = new Pfeil(p5, p6);
var l6 = new Pfeil(p6, p7);
var l7 = new Pfeil(p7, p8);
var l8 = new Pfeil(p7, p9);
h.setFocus(p1, true)
// z.ebenen.push(
// 	(ctx, w, h, zeit) => {
// 		ctx.fillRect(w / 3, h / 3, w / 3, h / 3);
// 		ctx.fillStyle = "rgb(255,0,0)";
// 		ctx.fillText("Hi there " + zeit , w / 2, h / 2);
// 	})
 
var l = new Leinwand(h);
