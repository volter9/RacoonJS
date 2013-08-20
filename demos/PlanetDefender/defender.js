var Defender = {}; Defender.prototype = function Defender() {};

(function () {
	function Sparks(obj) {
		obj.size = size(640,480); 
		obj.pos = vecNull();
		
		this.particles = [];
		this.addSparks = function (pos,count,radii,red,acc) {
			red = (red) ? red : false;
			
			for (var i = 0; i < count; i++) {
				var angle = Math.random() * Math.PI * 2;
				var vel = RJ.Vector.angleToVec(angle).div(2);
				if (acc) {
					vel.scalar(Math.random() * acc);
				}
				var rad = radii/2 + Math.random() * 10;
				var col, randColor;
				if (!red) {
					randColor = (4 + (Math.random() * 5) >> 0).toString(16);
					col = "#"+randColor+randColor+randColor;
				}
				else {
					randColor = (4 + (Math.random() * 5) >> 0).toString(16);
					col = "#f"+randColor+"0";
				}
				
				this.particles.push({
					pos: pos.clone().add(vel.clone().scalar(2)),
					vel: vel,
					rad: rad,
					ind: i,
					col: col
				});
			}
		};
		
		this.delete = function (ind) {
			this.particles.splice(ind,1);
			
			if (this.particles.length > 0) {
				for (var i = 0; i < this.particles.length; i++) {
					this.particles[i].ind = i;
				}
			}
		};
		
		this.update = function () {
			if (this.particles.length > 0) {
				for (var i = 0; i < this.particles.length; i++) {
					var part = this.particles[i];
					
 					part.pos.add(part.vel);
					part.rad -= 0.2;
					
					if (part.rad <= 1) {
						this.delete(part.ind);
					}
				}
			}
		};
		
		this.render = function (ctx) {
			if (this.particles.length > 0) {
				for (var i = 0; i < this.particles.length; i++) {
					var part = this.particles[i];
					
					ctx.fillStyle = part.col;
					ctx.strokeStyle = "#000";
					ctx.lineWidth = 2;
					
					ctx.beginPath();
					
					ctx.arc(part.pos.x,part.pos.y,part.rad,0,Math.PI*2,true);
					
					ctx.fill();
					ctx.stroke();
				}
			}	
		};
		
		RJ.inherit(this,Sparks,RJ.GameObject,obj);
	}
	function Tower(obj) {
		obj.size = size(20,20),
		this.image = new RJ.Image({
			image: obj.image,
			size:size(20,20),
			nameless: true,
		});
		
		this.onEnter = function () {
			this.addChild(this.image);
			this.game.mouseHandler.addHandler(this);
			
			center = size2vec(this.game.winSize()).div(2);
			this.circle = new RJ.Circle(center,60);
		};
		
		var center = vecNull();
		var shooting = false;
		var dur = 7;
		var timer = dur;
		this.mouseHandler = function (state,vec) {
			if (this.running) {
				if (state === "move" && !this.circle.vecInside(vec)) {
					var pos = center.clone();
					var angle = center.angleT(vec);
					var offset = RJ.Vector.angleToVec(angle).scalar(-62);
					pos.add(offset);
				
					this.angle = angle-Math.PI/2;
					this.setPos(pos);
				}
				else if (state === "click") {
					if (this.bullets) {
						shooting = false;
					}
				}
				else if (state === "down") {
					if (this.bullets) {
						shooting = true;
						timer = 10;
					}
				}
			}
		};
		
		this.update = function () {
			if (shooting) {
				if (timer >= dur) {
					var vel = RJ.Vector.angleToVec(this.angle-Math.PI/2).scalar(10);
					var pos = this.pos.clone().add(vel.clone().scalar(2));
					
					this.bullets.add(pos,vel,2);
					
					timer = 0;
				}
				
				timer ++;
			}
		};
		
		this.onExit = function () {
			this.game.mouseHandler.removeHandler(this);
		};
		
		RJ.inherit(this,Tower,RJ.GameObject,obj);
	}
	function Meteors(obj) {
		obj.pos = vecNull();
		obj.size = size(640,480);
		
		this.image = RJ.argDef(obj.image,null);
		var ready = false;
		this.image.onload = function () {
			ready = true;
		};
		
		var meteors = [];
		this.add = function (pos, vel) {
			var met = {
				pos: pos,
				vel: vel,
				radii: 15 + (Math.random() * 15) >> 0,
				rot: Math.random() * (Math.PI * 2),
				ind: meteors.length,
			};
			met.hp = (met.radii / 4) >> 0;
			
			meteors.push(met);
		};
		
		this.count = function () {
			return meteors.length;
		};
		
		this.delete = function (ind) {
			meteors.splice(ind,1);
			
			if (meteors.length > 0) {
				for (var i = 0; i < meteors.length; i++) {
					meteors[i].ind = i;
				}
			}
		};
		
		this.update = function () {
			if (ready) {
				if (meteors.length > 0) {
					for (var i = 0; i < meteors.length; i++) {
						var met = meteors[i];
						
						met.pos.add(met.vel);
						met.rot += 0.005;
						
						for (var j = 0; j < this.bullets.bullets.length; j++) {
							var bul = this.bullets.bullets[j];
							
							var distance = met.pos.distance(bul.pos);
							if (distance < met.radii*met.radii) {
								this.bullets.delete(bul.ind);
								met.hp --;
								
								if (met.hp == 0) {
									this.delete(met.ind);
									this.sparks.addSparks(met.pos,20,met.radii);
								}
							}
						}
						
						if (this.obstacle && this.obstacle.cVSc(met)) {
							this.delete(met.ind);
							this.sparks.addSparks(met.pos,20,met.radii);
							
							if (this.shield) {
								this.shield.hp--;
								this.shield.sColor = "hsl("+(this.shield.hp/this.shield.maxHp*120)+",100%,50%)";
								this.shield.radii = 30 + (this.shield.hp/this.shield.maxHp) * 25;
								this.shield.rect.w = this.shield.rect.h = this.shield.radii * 2;
								
								if (this.planet) {
									var actionTo = new RJ.ScaleBy(0.1,size(0.1,0.1));
									var actionBack = new RJ.ScaleBy(0.1,size(-0.1,-0.1));
									var actionSeq = new RJ.Sequence(actionTo,actionBack);
									
									this.planet.addAction(actionSeq);
								}
								
								if (this.shield.hp == 0) {
									this.sparks.addSparks(size2vec(this.game.winSize()).div(2),300,40,true,5);
									this.game.get("Tower").pause();
									this.game.get("Stars").pause();
									this.game.get("Planet").deleteAllActions();
								}
								
								console.log(this.shield.hp);
							}
						}
					}
				}
			}
		}
		
		this.onEnter = function () {
			win = this.game.winSize();
		}
		
		var win = size(0,0);
		this.render = function (ctx) {
			if (ready) {
				if (meteors.length > 0) {
					for (var i = 0; i < meteors.length; i++) {
						var met = meteors[i];
						
						if ((met.pos.x >= 0-met.radii && met.pos.x <= win.w+met.radii) &&
							(met.pos.y >= 0-met.radii && met.pos.y <= win.h+met.radii)) {
							ctx.save();
							ctx.translate(met.pos.x,met.pos.y);
							ctx.rotate(met.rot);
							
							ctx.drawImage(this.image,-met.radii,-met.radii, met.radii*2-1,met.radii*2-1);
							ctx.restore();
						}
					}
				}
			}
		}
		
		RJ.inherit(this,Meteors, RJ.GameObject, obj);
	}
	function Bullets(obj) {
		this.bullets = [];
		
		this.add = function (pos,vel,dur) {
			var ind = this.bullets.length;
			
			this.bullets[ind] = {
				ind: ind,
				pos: pos,
				vel: vel,
				dur: dur,
				time: 0,
			};
		};
		
		this.delete = function (ind) {
			this.bullets.splice(ind,1);
			
			for (var i = 0; i < this.bullets.length; i++) {
				this.bullets[i].ind = i;
			}
		};
		
		this.update = function () {
			if (this.bullets.length > 0) {
				for (var i = 0; i < this.bullets.length; i++) {
					var bullet = this.bullets[i];
					
					// update
					if (bullet.time < bullet.dur) {
						bullet.pos.add(bullet.vel);
						
						bullet.time += 1/this.game.rate;
					}
					else {
						this.delete(bullet.ind);
					}
				}
			}
		};
		
		this.render = function (ctx) {
			if (this.bullets.length > 0) {
				for (var i = 0; i < this.bullets.length; i++) {
					var bullet = this.bullets[i];
					
					ctx.fillRect(bullet.pos.x-1,bullet.pos.y-1,2,2);
				}
			}
		};
		
		RJ.inherit(this,Bullets,RJ.GameObject,obj);
	}
	function Stars (obj) {
		obj.size = size(640,480);
		this.stars = [];
		this.onEnter = function () {
			var win = this.game.winSize();
			var gap = 10;
			for (var i = 0; i < (win.w / gap) >> 0; i ++) {
				this.stars.push(vec2(i * gap, Math.random() * win.h));
			}
			
			this.addAction(
				new RJ.Infinite(new RJ.RotateBy(10,Math.PI/4))
			);
		};
		
		this.render = function (ctx) {
			for (var i = 0; i < this.stars.length; i++) {
				var star = this.stars[i];
				
				ctx.fillRect(star.x,star.y,2,2);
			}
		};
		
		RJ.inherit(this,Stars,RJ.GameObject,obj);
	}
	
	Defender.Sparks = Sparks;
	Defender.Stars = Stars;
	Defender.Tower = Tower;
	Defender.Meteors = Meteors;
	Defender.Bullets = Bullets;
})();