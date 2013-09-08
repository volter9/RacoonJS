// 
// 	The MIT License (MIT)
// 
// 	Copyright (c) 2013 Volter9 (volter925@gmail.com)
// 
// 	Permission is hereby granted, free of charge, to any person obtaining a copy
// 	of this software and associated documentation files (the "Software"), to deal
// 	in the Software without restriction, including without limitation the rights
// 	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// 	copies of the Software, and to permit persons to whom the Software is
// 	furnished to do so, subject to the following conditions:
// 
// 	The above copyright notice and this permission notice shall be included in
// 	all copies or substantial portions of the Software.
// 
// 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// 	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// 	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// 	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// 	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// 	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// 	THE SOFTWARE.
//
var DE = {}; DE.constructor = function DE () {};

(function () {
	var game = {
		coins: localStorage.coins,
		boughts: localStorage.shop,
		started: false,
	};
	DE.game = game;
	
	var ships = [
		{ // Begining
			name: "Дестор",
			fire_angle: Math.PI/4,
			speed: 5.5,
			fire_rate: 25,
			max_ammo_amount: 3,
			armor: 10,
			price: 0,
			image: null,
			ind: 0,
		},{ 
			name: "Делта",
			fire_angle: Math.PI/3,
			speed: 6.5,
			fire_rate: 20,
			max_ammo_amount: 4,
			armor: 15,
			price: 100,
			image: null,
			ind: 1,
		},{
			name: "Свагер",
			fire_angle: Math.PI/2,
			speed: 7.5,
			fire_rate: 15,
			max_ammo_amount: 5,
			armor: 20,
			price: 500,
			image: null,
			ind: 2,
		},{
			name: "Ментор",
			fire_angle: Math.PI/2,
			speed: 9.5,
			fire_rate: 10,
			max_ammo_amount: 6,
			armor: 30,
			price: 1000,
			image: null,
			ind: 3,
		}
	];
	var currentShip = null;
	
	DE.ships = ships;
	
	var levels = [
		{
			size: size(640,1920),
			variance: 0,
			level: 1,
			coins: 1,
			maxAcc: 4,
		},{
			size: size(640,2880),
			variance: 1,
			level: 1,
			coins: 2,
			maxAcc: 4,
		},{
			size: size(640,3840),
			variance: 1,
			level: 2,
			coins: 3,
			maxAcc: 5,
		},{
			size: size(640,4800),
			variance: 2,
			level: 2,
			coins: 3,
			maxAcc: 5,
		},{
			size: size(640,5760),
			variance: 3,
			level: 3,
			coins: 4,
			maxAcc: 6,
		},{
			size: size(640,7200),
			variance: 3,
			level: 3,
			coins: 4,
			maxAcc: 7,
		}
	];
	var currentLevel = null;
	
	function setLevel (ind) {
		currentLevel = levels[ind];
		DE.level = currentLevel;
	};
	
	DE.levels = levels;
	DE.SetLevel = setLevel;
	
	function setShip (ind,image) {
		ships[ind].image = image;
	};
	
	function setCurrentShip (ind) {
		currentShip = ships[ind];
	};
	
	DE.SetShip = setShip;
	DE.SetCurrentShip = setCurrentShip;
	
	// Game
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
					
					if (this.camera.rect.containVec(part.pos)) {
						ctx.fillStyle = part.col;
						ctx.lineWidth = 2;
					
						ctx.beginPath();
					
						ctx.arc(part.pos.x,part.pos.y,part.rad,0,Math.PI*2,true);
					
						ctx.fill();
					}
				}
			}	
		};
		
		RJ.inherit(this,Sparks,RJ.GameObject,obj);
	}
	function Starship (obj) {
		obj.name = "Starship";
		obj.strokeColor = "#fff";
		obj.fillColor = "#000";
		obj.anchor = vec2(0.5,0.5);
		obj.size = size(40,40);
		
		// Ship
		this.ship = currentShip;
		// HP Indicator
		this.health = new RJ.Rectangle({
			pos:vec2(0,obj.size.h + 15),
			size: size(40,5),
			fillColor: "#0f0",
			strokeColor: "rgba(0,0,0,0)",
			nameless: true,
		});
		
		this.circle = new RJ.Circle(obj.pos,20);
		
		this.ammo = 1;
		this.maxAmmo = this.ship.max_ammo_amount;
		
		this.score = 0;
		this.timeout = null;
		this.die = function () {
			var self = this;
			
			this.sparks.addSparks(this.pos,20,30);
			this.removeFromParent();
			this.hp = 0;
			timeout = setTimeout(function () {
				self.game.addChild(self.game.menu);
				self.parent.removeFromParent();
				DE.game.started = false;
				
				self.game.coin[0].removeFromParent();
				self.game.coin[1].removeFromParent();
				self.game.coin[1].text = 0;
			},2000);
		};
		
		this.setPos = function (vec) {
			RJ.super(this).setPos(vec);
			this.circle.pos = vec.clone();
		};
		
		this.image = new RJ.Image({
			nameless: true,
			image: this.ship.image,
			size: size(40,40),
		});
		this.poly = new RJ.Polygon({
			nameless: true,
			pos: vec2(20,37.5),
			radii: vec2(5,5),
			sides: 3,
			angle: Math.PI,
			anchor: vec2(0.5,0.5),
			lineWidth: 1,
		});
		this.poly.running = false;
		
		this.maxHp = this.ship.armor;
		this.hp = this.maxHp;
		this.onEnter = function () {
			this.game.keyboardHandler.addHandler(this);
			this.win = this.game.winSize();
			this.addChild(this.poly);
			this.addChild(this.image);
			this.addChild(this.health);
		};
		
		this.onExit = function () {
			this.game.keyboardHandler.removeHandler(this);
		};
		
		var shooting = false;
		this.keyboardHandler = function (state, key) {
			if (state === "down" && game.started) {
				switch (key) {
					case RJ.KeyBoard.arr_u:
					case RJ.KeyBoard.key_w:
						this.direction.y = -1;
					break;
					
					case RJ.KeyBoard.arr_d:
					case RJ.KeyBoard.key_s:
						this.direction.y = 1;
					break;
					
					case RJ.KeyBoard.arr_l:
					case RJ.KeyBoard.key_a:
						this.direction.x = -1;
					break;
					
					case RJ.KeyBoard.arr_r:
					case RJ.KeyBoard.key_d:
						this.direction.x = 1;
					break;
					
					case RJ.KeyBoard.space:
						if (!shooting) {
							shooting = true;
							time = dur;
						}
					break;
				}
			}
			else if (game.started) {
				switch (key) {
					case RJ.KeyBoard.arr_u:
					case RJ.KeyBoard.key_w:
					case RJ.KeyBoard.arr_d:
					case RJ.KeyBoard.key_s:
						this.direction.y = 0;
					break;
					
					case RJ.KeyBoard.arr_l:
					case RJ.KeyBoard.key_a:
					case RJ.KeyBoard.arr_r:
					case RJ.KeyBoard.key_d:
						this.direction.x = 0;
					break;
					
					case RJ.KeyBoard.space:
						shooting = false;
					break;
				}
			}
			else if (!game.started) {
				if (state == "up" && key == RJ.KeyBoard.space) {
					game.started = true;
				}
			}
		};
		
		this.acc = this.ship.speed*2;
		this.renderAABB = function (ctx) {
			ctx.lineWidth = 2;
			ctx.beginPath();
			
			ctx.arc(this.circle.pos.x,this.circle.pos.y,this.circle.radii,0,Math.PI*2,0);
			
			ctx.stroke();
		};
		
		this.direction = vecNull();
		this.velocity = vecNull();
		
		this.speed = this.ship.speed;
		
		var dur = this.ship.fire_rate;
		var time = 0;
		this.update = function () {
			if (!this.camera) {
				this.camera = this.game.get("Camera");
			}
			
			if (shooting) {
				if (time >= dur) {
					if (this.ammo > 1) {
						for (var i = 0; i < this.ammo; i++) {
							var gap = this.ship.fire_angle;
							var angle = Math.PI+Math.PI/2 - gap/2 + i * (gap/(this.ammo-1));
						
							var pos = this.pos.clone().sub(vec2(0,this.rect.h/2));
							var vel = RJ.Vector.angleToVec(angle).scalar(this.acc);
						
							this.bullets.add(pos,vel,0.75);
						}
					}
					else {
						var pos = this.pos.clone().sub(vec2(0,this.rect.h));
						var vel = vec2(0,-1).scalar(this.acc);
					
						this.bullets.add(pos,vel,0.75);
					}
					
					time = 0;
				}
				
				time++;
			}
			
			if (this.enemyBullets.bullets.length > 0) {
				for (var i = 0; i < this.enemyBullets.bullets.length; i++) {
					var bullet = this.enemyBullets.bullets[i];
					
					if (this.rect.containVec(bullet.pos) && this.hp > 0) {
						this.enemyBullets.delete(bullet.ind);
						this.hp--;
						this.health.rect.w = (this.hp >= 0) ? this.hp/this.maxHp * 40 : 0;
						
						if (this.timeout == null && this.hp == 0) {
							this.die();
						}
					}
				}
			}
			
			if (this.coins.coins.length > 0) {
				for (var d = 0; d < this.coins.coins.length; d++) {
					var coin = this.coins.coins[d];
					
					if (this.circle.circleVSaabb(coin.rect)) {
						if (coin.type == 0) {
							this.score ++;
							this.coin.text = this.score;
						}
						else {
							if (this.ammo < this.maxAmmo) {
								this.ammo++;
							}
							else {
								this.score ++;
								this.coin.text = this.score;
							}
						}
						this.coins.delete(coin.ind);
					}
				}
			}
			
			this.velocity.x *= 0.95;
			this.velocity.y *= 0.95;
			
			if (this.direction.x != 0 && Math.abs(this.velocity.x) <= this.speed+1) {this.velocity.x += this.direction.x;}
			if (this.direction.y != 0 && Math.abs(this.velocity.y) <= this.speed+1) {this.velocity.y += this.direction.y;}
			
			if (Math.abs(this.velocity.y) > 1) {
				this.poly.visual = true;
			}
			else {
				this.poly.visual = false;
			}			
			
			if (this.walls.walls.length > 0) {
				for (var i = 0; i < this.walls.walls.length; i++) {
					var wall = this.walls.walls[i];
					
					if (this.rect.aabb(wall.rect) || (this.velocity.y < 0 && Math.abs(wall.rect.y - this.rect.y + 30) < 2)) {
						this.velocity.y = 0;
						this.setPos(vec2(this.pos.x,wall.rect.y + wall.rect.h + this.rect.h/2 + 1));
					}
				}
			}
			
			if (!this.velocity.isEmpty()) {
				var pos = this.pos.clone();
				pos.add(this.velocity);
				
				if (pos.x < this.rect.w/2) {
					pos.x = this.rect.w/2;
				}
				else if (pos.x > this.win.w-this.rect.w/2) {
					pos.x = this.win.w-this.rect.w/2
				}
				
				if (pos.y < -this.camera.levelSize.h + this.win.h + this.rect.w/2) {
					pos.y = -this.camera.levelSize.h + this.win.h + this.rect.w/2;
				}
				
				if (pos.y > this.win.h-this.rect.h/2) {
					pos.y = this.win.h-this.rect.h/2;
				}
				
				this.setPos(pos);
			}
			
			if (this.lighting.rect.aabb(this.rect)) {
				if (this.timeout == null) {
					this.die();
				}
			}
		};
		
		RJ.inherit(this, Starship, RJ.GameObject, obj);
	}
	function Camera (obj) {
		obj.size = size(640,480);
		obj.pos = vec2(obj.size.w/2,obj.size.h/2);
		obj.anchor = vec2(0.5,0.5);
		obj.name = "Camera";
		
		this.follow = RJ.argDef(obj.follow,null);
		this.follower = RJ.argDef(obj.follower,null);
		this.levelSize = RJ.argDef(obj.level,null);
		this.dir = vec2(0,-1);
		
		this.onEnter = function () {
			this.win = this.game.winSize();
			this.dir.scalar(this.levelSize.h / (this.levelSize.h/10));
		};
		
		var oldPos = vecNull();
		this.update = function () {
			if (game.started) {
				var pos = this.follow.pos.clone();
				if (!oldPos.isEqual(pos)) {
					if (pos.y > this.win.h/2) {
						pos.y = this.win.h/2;
					}
					else if (pos.y < -this.levelSize.h + this.win.h * 1.5) {
						pos.y = -this.levelSize.h + this.win.h * 1.5;
					}
			
					var newPos = pos.clone();
					newPos.x = this.win.w/2;

					var newCamPos = pos.clone();
					newCamPos.x = 0;
					newCamPos.y *= -1;

					newCamPos.y += this.win.h/2;

					this.setPos(newPos);
					this.follower.setPos(newCamPos);
				}
				oldPos = pos;
			}
			else {
				if (!this.dir.isEmpty()) {
					// Up
					var pos = this.pos.clone().add(this.dir);
					if (pos.y > this.win.h/2) {
						pos.y = this.win.h/2;
						this.dir = vecNull();
					}
					else if (pos.y < -this.levelSize.h + this.win.h * 1.5) {
						pos.y = -this.levelSize.h + this.win.h * 1.5;
						this.dir.y *= -1;
					}
			
					var newCamPos = pos.clone();
					newCamPos.x = 0;
					newCamPos.y *= -1;

					newCamPos.y += this.win.h/2;
					
					this.setPos(pos);
					this.follower.setPos(newCamPos);
				}
				else {
					game.started = true;
				}
			}
		};
		
		RJ.inherit(this,Camera,RJ.GameObject,obj);
	}
	function Stars (obj) {
		obj.name = "Stars";
		obj.size = size(640,480);
		obj.fillColor = "#fff";
		
		this.onEnter = function () {
			this.stars = [];
			var win = this.game.winSize();
			
			this.cam = this.game.get("Camera");
			var count = this.cam.levelSize.h / 30;
			var gap = win.w / count;
			for (var i = 0; i < count; i++) {
				this.stars.push(vec2(i * gap,(-this.camera.levelSize.h+win.h) + Math.random() * this.camera.levelSize.h));
			}
		};
		
		this.render = function (ctx) {
			for (var i = 0; i < this.stars.length; i++) {
				var star = this.stars[i];
				
				if (this.cam.rect.containVec(star)) {
					ctx.fillStyle = this.pColor;
					ctx.fillRect(star.x,star.y,2,2);
				}
			}
		};
		
		RJ.inherit(this,Stars,RJ.GameObject,obj);
	}
	function SpaceSaucers (obj) {
		this.saucers = [];
		this.image = RJ.argDef(obj.image,null);
		this.diff = RJ.argDef(obj.difficulty,1);
		obj.strokeColor = "#fff";
		
		this.add = function (pos) {
			var hp;
			if (this.diff <= 1) {
				hp = 2;
			}
			else if (this.diff == 2) {
				hp = 4;
			}
			else {
				hp = 6;
			}
			
			this.saucers.push({
				pos: pos.clone(),
				ind: this.saucers.length,
				dur: 30,
				time:30,
				rot: 0,
				circle: new RJ.Circle(pos.clone(),30),
				hp: hp,
			});
		};
		
		this.renderAABB = function (ctx) {
			ctx.strokeStyle = this.debugColor;
			for (var i = 0; i < this.saucers.length; i++) {
				var saucer = this.saucers[i];
				
				if (saucer.circle.circleVSaabb(this.camera.rect)) {					
					ctx.strokeRect(saucer.pos.x-30,saucer.pos.y-30,60,60);
				}
			}
		}
		
		this.delete = function (ind) {
			this.saucers.splice(ind,1);
			
			for (var i = 0; i < this.saucers.length; i++) {
				this.saucers[i].ind = i;
			}
		};
		
		this.deleteAll = function () {
			this.saucers = [];
		};
		
		this.update = function () {
			for (var i = 0; i < this.saucers.length; i++) {
				var saucer = this.saucers[i];
				
				if (this.bullets.bullets.length > 0) {
					for (var d = 0; d < this.bullets.bullets.length; d++) {
						var bullet = this.bullets.bullets[d];
					
						if (saucer.circle.vecInside(bullet.pos)) {
							if (saucer.hp <= 0) {
								var count = 0;
								if (this.diff <= 1) {
									count = 2;
								}
								else if (this.diff == 2) {
									count = 4;
								}
								else {
									count = 6;
								}
								
								for (var i = 0; i < count; i++) {
									var angle = (i/count) * Math.PI * 2;
									var vel = RJ.Vector.angleToVec(angle).scalar(15);
									var pos = saucer.pos.clone().add(vel);
									
									this.coins.add(pos);
								}
								
								this.delete(saucer.ind);
								this.sparks.addSparks(saucer.pos,5,30,false,2.5);
							}
							saucer.hp--;
							
							this.bullets.delete(bullet.ind);
						}
					}
				}
			
				if (this.lighting.rect.containVec(saucer.pos)) {
					this.delete(saucer.ind);
					this.sparks.addSparks(saucer.pos,5,30,false,5);
				}
				
				if (saucer.circle.circleVSaabb(this.camera.rect)) {
					if (this.player.pos.distance(saucer.pos) < 300 * 300) {
						var angle = saucer.pos.angleT(this.player.pos) - Math.PI;
						var vel = RJ.Vector.angleToVec(angle).scalar(1.5);
					
						if (this.player.pos.distance(saucer.pos) > 40 * 40) {
							saucer.pos.add(vel);
							saucer.circle.pos.add(vel);
						}
					
						if (saucer.time >= saucer.dur) {
							var acc;
							
							if (this.diff <= 1) {
								acc = 3;
							}
							else if (this.diff == 2) {
								acc = 4.5;
							}
							else {
								acc = 7;
							}
							
							this.myBullets.add(saucer.pos.clone(), vel.clone().scalar(acc), 2);
						
							saucer.time = 0;
						}
					
						saucer.time ++;
					}
				
					saucer.rot += 0.05;
				}
			}
		};
		
		this.render = function (ctx) {
			for (var i = 0; i < this.saucers.length; i++) {
				var saucer = this.saucers[i];
				
				if (saucer.circle.circleVSaabb(this.camera.rect)) {
					ctx.save();
					ctx.translate(saucer.pos.x,saucer.pos.y);
					ctx.rotate(saucer.rot);
					
					ctx.drawImage(this.image,-30,-30,60,60);
					
					ctx.restore();
				}
			}
		};
		
		RJ.inherit(this,SpaceSaucers,RJ.GameObject, obj);
	}
	function Towers (obj) {
		this.towers = [];
		this.diff = RJ.argDef(obj.difficulty,1);
		obj.lineWidth = 1;
		obj.strokeColor = "#fff";
		
		this.renderAABB = function (ctx) {
			ctx.strokeStyle = this.debugColor;
			for (var i = 0; i < this.towers.length; i++) {
				var tower = this.towers[i];
				
				if (tower.circle.circleVSaabb(this.camera.rect)) {					
					ctx.strokeRect(tower.pos.x-12,tower.pos.y-12,24,24);
				}
			}
		}
		
		this.add = function (pos) {
			this.towers.push({
				pos: pos.clone(),
				ind: this.towers.length,
				dur: 25,
				time:25,
				circle: new RJ.Circle(pos.clone(),12),
			});
		};
		
		this.delete = function (ind) {
			this.towers.splice(ind,1);
			
			for (var i = 0; i < this.towers.length; i++) {
				this.towers[i].ind = i;
			}
		};
		
		this.deleteAll = function () {
			this.towers = [];
		};
		
		this.update = function () {
			for (var i = 0; i < this.towers.length; i++) {
				var tower = this.towers[i];
				
				if (this.lighting.rect.containVec(tower.pos)) {
					this.delete(tower.ind);
					this.sparks.addSparks(tower.pos,5,12,false,3);
				}
				
				if (tower.circle.circleVSaabb(this.camera.rect)) {
					if (this.player.pos.distance(tower.pos) < 350 * 350) {
						var angle = tower.pos.angleT(this.player.pos) - Math.PI;
						var vel = RJ.Vector.angleToVec(angle);
					
						if (tower.time >= tower.dur) {
							var acc;
							
							if (this.diff <= 1) {
								acc = 7;
							}
							else if (this.diff == 2) {
								acc = 10;
							}
							else {
								acc = 13;
							}
							
							this.myBullets.add(tower.pos.clone(), vel.clone().scalar(acc), 2);
						
							tower.time = 0;
						}
					
						tower.time ++;
					}
				}
			}
		};
		
		this.render = function (ctx) {
			for (var i = 0; i < this.towers.length; i++) {
				var tower = this.towers[i];
				
				if (tower.circle.circleVSaabb(this.camera.rect)) {
					ctx.beginPath();
					
					ctx.arc(tower.pos.x,tower.pos.y,12,0,Math.PI * 2, true);
					
					ctx.fill();
					ctx.stroke();
				}
			}
		};
		
		RJ.inherit(this,Towers,RJ.GameObject, obj);
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
					
					if (this.camera.rect.containVec(bullet.pos)) {
						ctx.fillRect(bullet.pos.x-2,bullet.pos.y-2,4,4);
					}
				}
			}
		};
		
		RJ.inherit(this,Bullets,RJ.GameObject,obj);
	}
	function EnemyBullets(obj) {
		obj.fillColor = "#f00";
		
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
					
					if (this.camera.rect.containVec(bullet.pos)) {
						ctx.fillRect(bullet.pos.x-2,bullet.pos.y,4,4);	
					}
				}
			}
		};
		
		RJ.inherit(this,EnemyBullets,RJ.GameObject,obj);
	}
	function Coins(obj) {
		obj.fillColor = "#000";
		obj.strokeColor = "#fff";
		obj.lineWidth = 1;
		
		this.coins = [];
		this.renderAABB = function (ctx) {
			ctx.strokeStyle = this.debugColor;
			for (var i = 0; i < this.coins.length; i++) {
				var coin = this.coins[i];
				
				if (this.camera.rect.aabb(coin.rect)) {					
					ctx.strokeRect(coin.rect.x,coin.rect.y,20,20);
				}
			}
		}
		
		this.add = function (pos,type) {
			if (!type)
				type = 0;
			
			this.coins.push({
				pos: pos.clone(),
				ang: 0,
				rect: new RJ.Rect(pos.x-10,pos.y-10,20,20),
				ind: this.coins.length,
				type: type
			});
		};
		
		this.deleteAll = function () {
			this.coins = [];
		};
		
		this.delete = function (ind) {
			this.coins.splice(ind,1);
			
			for (var i = 0; i < this.coins.length; i++) {
				this.coins[i].ind = i;
			}
		}
		
		this.update = function () {
			for (var i = 0; i < this.coins.length; i++) {
				var coin = this.coins[i];
				
				coin.ang += 0.05;
				
				if (this.lighting.rect.aabb(coin.rect)) {
					this.delete(coin.ind);
					this.sparks.addSparks(coin.pos,10,10);
				}
			}
		};
		
		this.render = function (ctx) {
			for (var i = 0; i < this.coins.length; i++) {
				var coin = this.coins[i];
				
				if (this.camera.rect.aabb(coin.rect)) {
					if (coin.type == 0) {
						ctx.save();
					
						ctx.translate(coin.pos.x,coin.pos.y);
						ctx.scale(Math.cos(coin.ang),1);
						ctx.beginPath();
					
						ctx.arc(0,0,10,0,Math.PI*2,1);
					
						ctx.fill();
						ctx.stroke();
					
						ctx.strokeRect(-3,-5,6,10);
					
						ctx.restore();
					}
					else {
						ctx.save();
					
						ctx.translate(coin.pos.x,coin.pos.y);
						ctx.scale(Math.cos(coin.ang),1);
						ctx.fillRect(-10,-10,20,20);
						ctx.strokeRect(-10,-10,20,20);
					
						ctx.strokeRect(-5,-5,3,10);
						ctx.strokeRect(3,-5,3,10);
					
						ctx.restore();
					}
				}
			}
		};
		
		RJ.inherit(this,Coins,RJ.GameObject,obj);
	}
	function Lighting (obj) {
		obj.size = size(640,60);
		obj.strokeColor = "#0ff";
		obj.lineWidth = 1;
		
		this.maxAcc = RJ.argDef(obj.acceleration,3);
		this.onEnter = function () {
			this.win = this.game.winSize();
			this.randomness = 60;
			this.acc = 1;
			this.vel = this.maxAcc / 1200;
		};
		
		this.update = function () {
			if (!this.rect.aabb(this.camera.rect)) {
				this.visual = false;
			}
			else {
				this.visual = true;
			}
			
			if (game.started) {
				if (this.acc < this.maxAcc) {
					this.acc += this.vel;
				}
				this.setPos(this.pos.clone().add(vec2(0,-1).scalar(this.acc)));
			}
		};
		
		this.render = function (ctx) {
			ctx.save();
			for (var j = 0; j < 5; j++) {
				ctx.beginPath();
				var gap = 640 / 20;
				for (var i = 0; i < 21; i++) {
					if (i == 0) {
						ctx.moveTo(i * gap,25);
					}
					else if (i == 20) {
						ctx.lineTo(i * gap,25);
					}
					else {
						ctx.lineTo(i * gap,(30 - this.randomness/2) + (Math.random() * this.randomness) >> 0);
					}
				}
			
				ctx.stroke();
			}
			
			ctx.strokeStyle = "#fff";
			ctx.fillRect(-30,0,60,60);
			ctx.strokeRect(-30,0,60,60);
			
			ctx.fillRect(this.win.w-30,0,60,60);
			ctx.strokeRect(this.win.w-30,0,60,60);
			ctx.restore();
		};
		
		RJ.inherit(this,Lighting,RJ.GameObject,obj);
	}
	function Walls(obj) {
		obj = (obj) ? obj : {};
		obj.strokeColor = "#fff";
		obj.lineWidth = 1;
		obj.pos = vecNull();
		obj.size = size(640,480);
		
		this.walls = [];
		this.add = function (y,hp) {
			hp = (!hp) ? 10 : hp;
			
			this.walls.push({
				rect: new RJ.Rect(0,y-15,640,30),
				ind: this.walls.length,
				hp: hp,
			});
		};
		
		this.onEnter = function () {
			this.win = this.game.winSize();
		};
		
		this.delete = function (ind) {
			this.walls.splice(ind,1);
			
			for (var i = 0; i < this.walls.length; i++) {
				this.walls[i].ind = i;
			}
		};
		
		this.update = function () {
			if (this.walls.length > 0) {
				for (var i = 0; i < this.walls.length; i++) {
					var wall = this.walls[i];
					
					if (this.lighting.rect.aabb(wall.rect)) {
						var gap = this.win.w / 20;
						for (var d = 0; d < 20; d++) {
							var pos = vec2(gap/2 + d * gap,wall.rect.y + 15);
							this.sparks.addSparks(pos,5,(d == 0 || d == 20-1) ? 40 : 15,false,2);
						}
						this.delete(wall.ind);
					}
					
					if (this.enemyBullets.bullets.length > 0) {
						for (var g = 0; g < this.enemyBullets.bullets.length; g++) {
							var bullet = this.enemyBullets.bullets[g];
							
							if (wall.rect.containVec(bullet.pos)) {
								this.enemyBullets.delete(bullet.ind);
							}
						}
					}
					
					if (this.bullets.bullets.length > 0) {
						for (var g = 0; g < this.bullets.bullets.length; g++) {
							var bullet = this.bullets.bullets[g];
							
							if (wall.rect.containVec(bullet.pos)) {
								if (wall.hp == 0) {
									var gap = this.win.w / 20;
									for (var d = 0; d < 20; d++) {
										var pos = vec2(gap/2 + d * gap,wall.rect.y + 15);
										this.sparks.addSparks(pos,5,(d == 0 || d == 20-1) ? 40 : 15,false,2);
									}
									this.delete(wall.ind);
								}
								wall.hp --;
								
								this.bullets.delete(bullet.ind);
							}
						}
					}
				}
			}
		}
		
		this.render = function (ctx) {
			if (this.walls.length > 0) {
				for (var i = 0; i < this.walls.length; i++) {
					var wall = this.walls[i];
					
					if (this.camera.rect.aabb(wall.rect)) {
						ctx.fillRect(-5,wall.rect.y,640+10,30);
						ctx.strokeRect(-5,wall.rect.y,640+10,30);
					}
				}
			}
		};
		
		RJ.inherit(this,Walls,RJ.GameObject,obj);
	}
	
	// Menu
	function MenuStars (obj) {
		obj = {};
		obj.name = "MenuStars";
		obj.pos = vec2(320,240);
		obj.anchor = vec2(0.5,0.5);
		obj.size = size(640,480);
		obj.fillColor = "#fff";
		obj.alpha = 0.75;
		
		this.onEnter = function () {
			this.stars = [];
			var win = this.game.winSize();
			
			var count = 50;
			var gap = win.w / count;
			for (var i = 0; i < count; i++) {
				this.stars.push(vec2(i * gap,Math.random() * win.h));
			}
		};
		
		this.update = function () {
			this.angle += 0.0005;
		};
		
		this.render = function (ctx) {
			for (var i = 0; i < this.stars.length; i++) {
				var star = this.stars[i];
				
				ctx.fillStyle = this.pColor;
				ctx.fillRect(star.x,star.y,2,2);
			}
		};
		
		RJ.inherit(this,MenuStars,RJ.GameObject,obj);
	}
	function Menu (obj) {
		this.entries = RJ.argDef(obj.entries,[]);
		var callback = RJ.argDef(obj.callback,function (index) {});
		var shipMenu = RJ.argDef(obj.ship,null);
		var enter = RJ.argDef(obj.enter,null);
		this.currentIndex = 0;
		
		this.onEnter = function () {
			this.game.keyboardHandler.addHandler(this);
			if (enter) {
				enter(this);
			}
		};
		
		this.onExit = function () {
			this.game.keyboardHandler.removeHandler(this);
		};
		
		this.keyboardHandler = function (state, key) {
			if (state == "up" && this.visible) {
				if (key == RJ.KeyBoard.arr_d) {
					if (this.currentIndex < this.entries.length-1) {
						this.currentIndex ++;
					}
					else {
						this.currentIndex = 0;
					}
				}
				else if (key == RJ.KeyBoard.arr_u) {
					if (this.currentIndex == 0) {
						this.currentIndex = this.entries.length - 1;
					}
					else {
						this.currentIndex--;
					}
				}
				
				if (key == RJ.KeyBoard.enter) {
					callback(this.currentIndex);
				}
			}
		};
		
		this.i = 0;
		this.p = 60;
		this.update = function () {
			if (this.i >= this.p) {
				this.i = 0;
			}
			
			this.i++;
		}
		
		this.render = function (ctx) {
			if (this.entries.length > 1) {
				var gap = this.rect.h/(this.entries.length-1);
				for (var i = 0; i < this.entries.length; i++) {
					var entry = this.entries[i];
			
					ctx.font = "15px Courier";
					
					ctx.fillStyle = "#fff";
					
					var boughts = JSON.parse(localStorage.shop);
					if (shipMenu) {
						var bought = boughts[i];
						
						if (i == currentShip.ind) {
							ctx.fillStyle = "#f00";
						}
						else if (!bought && i < this.entries.length-1) {
							ctx.fillStyle = "#888";
						}
					}
					
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					
					var str = (i == this.currentIndex && this.i > this.p/4) ? "[ "+entry+" ]" : entry;
			
					ctx.fillText(str,this.rect.w/2,(i * gap));
				}
			}
			else {
				var entry = this.entries[0];
			
				ctx.font = "15px Courier";
				ctx.fillStyle = "#fff";
				ctx.textAlign = "center";
				if (i > 0 && i < this.entries.length-1) {
					ctx.textBaseline = "middle";
				}
				else if (i == 0) {
					ctx.textBaseline = "top";
				}
				else {
					ctx.textBaseline = "bottom";
				}
		
				var str = (this.i > this.p/4) ? "[ "+entry+" ]" : entry;
		
				ctx.fillText(str,this.rect.w/2,0);
			}
		};
		
		RJ.inherit(this,Menu,RJ.GameObject,obj);
	}
	
	DE.Sparks = Sparks;
	DE.Bullets = Bullets;
	DE.Starship = Starship;
	DE.Camera = Camera;
	DE.Towers = Towers;
	DE.Lighting = Lighting;
	DE.Stars = Stars;
	DE.SpaceSaucers = SpaceSaucers;
	DE.EnemyBullets = EnemyBullets;
	DE.Walls = Walls;
	DE.Coins = Coins;
	
	DE.MenuStars = MenuStars;
	DE.Menu = Menu;
})();