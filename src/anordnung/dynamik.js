export class Dynamik{
	constructor(){
		this.movement = []
		this.borderPotential = (distance) => {
			let raw = 1 / distance / distance * 20000;
			return raw < 10 ? raw : 10;
		};
		this.partikelPotential = (xDistance, yDistance) => {
			let squareDistance = xDistance * xDistance + yDistance * yDistance;
			let strength = 100;
			let rawReturn = [ - xDistance * strength / squareDistance,  - yDistance * strength / squareDistance]
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
			this.movement[i][0] += this.borderPotential(partikel.x - partikel.width / 2) - this.borderPotential(this.herde.width - partikel.width / 2 - partikel.x);
			this.movement[i][1] += this.borderPotential(partikel.y - partikel.height / 2) - this.borderPotential(this.herde.height - partikel.height / 2 - partikel.y);
		}
		// Add repelling force between partikels
		for(let i = 0; i < this.movement.length; i++){
			for(let j = i + 1; j < this.movement.length; j++){
				let partikel1 = this.herde.partikels[i];
				let partikel2 = this.herde.partikels[j];
				let [[x1, y1], [x2, y2]] = partikel1.closestPoints(partikel2)
				let [xPush, yPush] = this.partikelPotential(x2 - x1, y2 - y1);
				this.movement[i][0] += xPush;
				this.movement[i][1] += yPush;
				this.movement[j][0] -= xPush;
				this.movement[j][1] -= yPush;
			}
		}
		
		
		let keepGoing = false;
		// Shift partikel position
		for(var i = 0; i < this.movement.length; i++){
			console.log(this.movement[i][0], this.movement[i][1])
			let partikel = this.herde.partikels[i];
			partikel.x += this.movement[i][0];
			partikel.y += this.movement[i][1];
			if(Math.abs(this.movement[i][0]) > 0.5 || Math.abs(this.movement[i][1]) > 0.5){
				keepGoing = true;
			}
		}
		if(keepGoing){
			this.herde.refresh()
		}
	}
	set_herde(herde){
		this.herde = herde;
	}
}
