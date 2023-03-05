export class Dynamik{
	constructor(){
		this.movement = []
		this.borderPotential = (distance, strength) => {
			if(distance < 0)
				return 10;
			let raw = 1 / distance / distance * 20000;
			return (raw < 10 ? raw : 10) * strength;
		};
		this.partikelPotential = (xDistance, yDistance, strength) => {
			let squareDistance = xDistance * xDistance + yDistance * yDistance;
			if(squareDistance == 0)
				alert("=0")
			strength *= 100;
			if(squareDistance == 0) throw "err";
			let rawReturn = [ - xDistance * strength / squareDistance,  - yDistance * strength / squareDistance];
			if(isNaN(rawReturn[0] * rawReturn[1]))
				alert("potpar")
			return rawReturn
		};
		this.connectionPotential = (xDistance, yDistance, strength) => {
			let squareDistance = xDistance * xDistance + yDistance * yDistance;
			strength *= 100;
			if(squareDistance == 0) throw "err";
			let formula = strength / squareDistance - 0.01;
			let rawReturn = [ - xDistance * formula,  - yDistance * formula];
			if(isNaN(rawReturn[0] * rawReturn[1]))
				alert("potcon")
			return rawReturn
		};
	}
	rearange(){
		if(this.movement.length != this.herde.partikels.length)
			this.movement = new Array(this.herde.partikels.length)
			
		// Set movement to zero
		for(let i = 0; i < this.movement.length; i++){
			this.movement[i] = [0, 0]
		}	
		// Add repelling force from border
		for(let i = 0; i < this.movement.length; i++){
			let partikel = this.herde.partikels[i];
			this.movement[i][0] += this.borderPotential(partikel.x - partikel.width / 2, partikel.scale) - this.borderPotential(this.herde.width - partikel.width / 2 - partikel.x, partikel.scale);
			this.movement[i][1] += this.borderPotential(partikel.y - partikel.height / 2, partikel.scale) - this.borderPotential(this.herde.height - partikel.height / 2 - partikel.y, partikel.scale);
		}
		// Add repelling force between partikels
		for(let i = 0; i < this.movement.length; i++){
			for(let j = i + 1; j < this.movement.length; j++){
				let partikel1 = this.herde.partikels[i];
				let partikel2 = this.herde.partikels[j];
				let [[x1, y1], [x2, y2]] = partikel1.closestPoints(partikel2, 1)
				let [xPush, yPush] = partikel1.connectedWith(partikel2) ? this.connectionPotential(x2 - x1, y2 - y1, partikel1.scale * partikel2.scale) : this.partikelPotential(x2 - x1, y2 - y1, partikel1.scale * partikel2.scale);
				this.movement[i][0] += xPush;
				this.movement[i][1] += yPush;
				this.movement[j][0] -= xPush;
				this.movement[j][1] -= yPush;
			}
		}
		
		
		let keepGoing = false;
		// Shift partikel position
		for(var i = 0; i < this.movement.length; i++){
			let partikel = this.herde.partikels[i];
			partikel.x += this.movement[i][0];
			partikel.y += this.movement[i][1];
			if(Math.abs(this.movement[i][0]) > 0.5 || Math.abs(this.movement[i][1]) > 0.5){
				keepGoing = true;
			}
			if(isNaN(partikel.x))
				alert("partik")
		}
		if(keepGoing){
			this.herde.refresh()
		}
		
		for(let x of this.herde.partikels)
			x.updateSateliteAngles();
	}
	set_herde(herde){
		this.herde = herde;
	}
}
