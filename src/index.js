import {Picture} from "./frontend/picture.js";
import {Swarm} from "./frontend/swarm.js";
import {Particle} from "./frontend/particle.js";
import {Arrow} from "./frontend/arrow.js";
import {Dynamik} from "./frontend/dynamic.js"
/*
 * Simple Programm to create some blobs and draw them to a canvas.
 */

var l = new Picture();
var h = new Swarm(l.canvas);
var debablo = new Particle(h, "Debablo");

var klick = new Particle(h, "Klicken");
new Arrow(debablo, klick);
var fokuswechsel = new Particle(h, "-> Fokus ändern");
new Arrow(klick, fokuswechsel);

var doppelklick = new Particle(h, "Doppelklicken");
new Arrow(debablo, doppelklick);
var fokusneu = new Particle(h, "-> neuer Fokus");
new Arrow(doppelklick, fokusneu);

var netz = new Particle(h, "Semantisches Netz");
new Arrow(debablo, netz);
var semantik = new Particle(h, "Didaktik");
new Arrow(netz, semantik);
var link = new Particle(h, "Verknüpfungen");
new Arrow(netz, link);
var knoten = new Particle(h, "Knotenpunkte");
new Arrow(netz, knoten);

var graph = new Particle(h, "Mathematischer Graph");
new Arrow(netz, graph);
var mathematik = new Particle(h, "Mathematik");
new Arrow(graph, mathematik);

var disziplinen = new Particle(h, "Disziplinen");
new Arrow(semantik, disziplinen);
new Arrow(mathematik, disziplinen);

var physik = new Particle(h, "Physik");
new Arrow(physik, disziplinen);
var informatik = new Particle(h, "Informatik");
new Arrow(informatik, disziplinen);

var programmieren = new Particle(h, "Programmieren");
new Arrow(informatik, programmieren);
var software = new Particle(h, "Software");
new Arrow(programmieren, software);

var webanwendung = new Particle(h, "Webanwendung");
new Arrow(software, webanwendung);
new Arrow(debablo, webanwendung);
var backend = new Particle(h, "Backend");
new Arrow(backend, webanwendung);
var frontend = new Particle(h, "Frontend");
new Arrow(frontend, webanwendung);

var computer = new Particle(h, "Computer");
new Arrow(informatik, computer);
var server = new Particle(h, "Server");
new Arrow(server, computer);
new Arrow(server, backend);

var browser = new Particle(h, "Browser");
new Arrow(frontend, browser);
new Arrow(software, browser);

var internet = new Particle(h, "Internet");
new Arrow(webanwendung, internet);
var daten = new Particle(h, "Daten");
new Arrow(daten, internet);

var strom = new Particle(h, "Strom");
new Arrow(strom, computer);
new Arrow(strom, physik);

var hardware = new Particle(h, "Hardware");
new Arrow(computer, hardware);
new Arrow(software, hardware);

var bildschirm = new Particle(h, "Bildschirm");
new Arrow(bildschirm, hardware);
var maus = new Particle(h, "Maus");
new Arrow(maus, hardware);
new Arrow(maus, klick);
new Arrow(maus, doppelklick);
var tastatur = new Particle(h, "Tastatur");
new Arrow(tastatur, hardware);





h.focus.setFocus(debablo, true);
// z.ebenen.push(
// 	(ctx, w, h, zeit) => {
// 		ctx.fillRect(w / 3, h / 3, w / 3, h / 3);
// 		ctx.fillStyle = "rgb(255,0,0)";
// 		ctx.fillText("Hi there " + zeit , w / 2, h / 2);
// 	})
 
