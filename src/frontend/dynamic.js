export class Dynamic{
	constructor(swarm){
		this.movement = [];
		this.swarm = swarm;
		this.borderPotential = (distance, strength) => {
			if(distance < 0)
				return 10;
			let raw = 1 / distance / distance * 20000;
			return (raw < 10 ? raw : 10) * strength;
		};
		this.particlePotential = (xDistance, yDistance, strength) => {
			let squareDistance = xDistance * xDistance + yDistance * yDistance;
			strength *= 100;
			if(squareDistance == 0) throw "err";
			let rawReturn = [ - xDistance * strength / squareDistance,  - yDistance * strength / squareDistance];
			return rawReturn
		};
		this.connectionPotential = (xDistance, yDistance, strength) => {
			let squareDistance = xDistance * xDistance + yDistance * yDistance;
			strength *= 100;
			if(squareDistance == 0) throw "err";
			let formula = strength / squareDistance - 0.05;
			let rawReturn = [ - xDistance * formula,  - yDistance * formula];
			return rawReturn
		};
	}
	rearange(){
		if(this.movement.length != this.swarm.particles.length)
			this.movement = new Array(this.swarm.particles.length)
			
		// Set movement to zero
		for(let i = 0; i < this.movement.length; i++){
			this.movement[i] = [0, 0];
		}	
		// Add repelling force from border
		for(let i = 0; i < this.movement.length; i++){
			let particle = this.swarm.particles[i];
			this.movement[i][0] += this.borderPotential(particle.x - particle.width / 2, particle.scale) - this.borderPotential(this.swarm.width - particle.width / 2 - particle.x, particle.scale);
			this.movement[i][1] += this.borderPotential(particle.y - particle.height / 2, particle.scale) - this.borderPotential(this.swarm.height - particle.height / 2 - particle.y, particle.scale);
		}
		// Add repelling force between particles
		for(let i = 0; i < this.movement.length; i++){
			for(let j = i + 1; j < this.movement.length; j++){
				let particle1 = this.swarm.particles[i];
				let particle2 = this.swarm.particles[j];
				let [[x1, y1], [x2, y2]] = particle1.closestPoints(particle2, 1);
				let [xPush, yPush] = particle1.connectedWith(particle2) ? this.connectionPotential(x2 - x1, y2 - y1, particle1.scale * particle2.scale) : this.particlePotential(x2 - x1, y2 - y1, particle1.scale * particle2.scale);
				this.movement[i][0] += xPush;
				this.movement[i][1] += yPush;
				this.movement[j][0] -= xPush;
				this.movement[j][1] -= yPush;
			}
		}
		
		
		let keepGoing = false;
		// Shift particle position
		for(var i = 0; i < this.movement.length; i++){
			let particle = this.swarm.particles[i];
			particle.x += this.movement[i][0];
			particle.y += this.movement[i][1];
			if(Math.abs(this.movement[i][0]) > 0.5 || Math.abs(this.movement[i][1]) > 0.5){
				keepGoing = true;
			}
		}
		if(keepGoing){
			this.swarm.refresh();
		}
		
		for(let x of this.swarm.particles)
			x.updateSateliteAngles();
	}
}
