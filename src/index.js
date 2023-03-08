import {Picture} from "./frontend/picture.js";
import {Swarm} from "./frontend/swarm.js";
import {Particle} from "./frontend/particle.js";
import {Arrow} from "./frontend/arrow.js";
import {Dynamik} from "./frontend/dynamic.js"
/*
 * Simple Programm to create some blobs and draw them to a canvas.
 */
var h = new Swarm();
var p1 = new Particle(h, "Hallo, Das");
var p2 = new Particle(h, "ist ein");
var p3 = new Particle(h, "Test");
var p4 = new Particle(h, "und");
var p5 = new Particle(h, "er");
var p6 = new Particle(h, "geht");
var p7 = new Particle(h, "noch");
var p8 = new Particle(h, "weiter");
var p9 = new Particle(h, "!");
var l1 = new Arrow(p1, p2);
var l2 = new Arrow(p2, p3);
var l3 = new Arrow(p3, p4);
var l4 = new Arrow(p4, p5);
var l5 = new Arrow(p5, p6);
var l6 = new Arrow(p6, p7);
var l7 = new Arrow(p7, p8);
var l8 = new Arrow(p8, p9);
var p5 = new Particle(h, "A");
var p6 = new Particle(h, "B");
var p7 = new Particle(h, "C");
var p8 = new Particle(h, "D");
var p9 = new Particle(h, "E");
var l5 = new Arrow(p5, p6);
var l6 = new Arrow(p6, p7);
var l7 = new Arrow(p7, p8);
var l8 = new Arrow(p7, p9);
new Arrow(p9, p3)
var p5 = new Particle(h, "er");
var p6 = new Particle(h, "geht");
var p7 = new Particle(h, "noch");
var p8 = new Particle(h, "weiter?");
var p9 = new Particle(h, "weiter!");
var l5 = new Arrow(p5, p6);
var l6 = new Arrow(p6, p7);
var l7 = new Arrow(p7, p8);
var l8 = new Arrow(p7, p9);
new Arrow(p7, p2)
new Arrow(p8, p3)
h.setFocus(p1, true)
// z.ebenen.push(
// 	(ctx, w, h, zeit) => {
// 		ctx.fillRect(w / 3, h / 3, w / 3, h / 3);
// 		ctx.fillStyle = "rgb(255,0,0)";
// 		ctx.fillText("Hi there " + zeit , w / 2, h / 2);
// 	})
 
var l = new Picture(h);
