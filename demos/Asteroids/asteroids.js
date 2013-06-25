/*
	Name: External file of Asteroids demo
	Author: Volter9 <volter925@gmail.com>
	Version: v1.0
	Requirements: RacoonJS v1.0 >
	Description: Set of "classes" which are making the game.
*/

function repeat(str,count) {
	if (str.length > 0 && typeof(str) == "string") {
		var result = "";
		
		for (var i = 0; i < count; i++) {
			result += str;
		}
		
		return result;
	}
}
function Button(obj) {
	this.label = Game.argDef(obj.label,"");
	this.target = Game.argDef(obj.target,null);
	this.pColor = "#000";
	this.sColor = "#fff";
	this.lWid = 2;

	this.debugColor = "#1e8";

	this.render = function (ctx) {
		var center = vec2(this.rect.w/2,this.rect.h/2);
		ctx.fillRect(0,0,
					 this.rect.w,this.rect.h);
		ctx.strokeRect(0,0,
					 this.rect.w,this.rect.h);

		ctx.font = "14px Arial";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.fillStyle = this.sColor;
		ctx.lineWidth = 0.5;

		ctx.fillText(this.label,center.x,center.y);
		ctx.strokeText(this.label,center.x,center.y);
	};

	this.onEnter = function () {
		RJ.mouseHandler.addHandler(this);
	}
	
	this.onExit = function () {
		RJ.mouseHandler.removeHandler(this);
	}
	
	this.mouseHandler = function (state, vec) {
		if (state == "click" && this.rect.containVec(vec)) {
			this.target(this);
		}
		else {
			return;
		}
	};
	
	Game.inherit(this,Button,GameObject,obj)
}
function Shuttle(obj) {
	this.velocity = vecNull();
	this.bullCount = 1;
	this.triangle = new Polygon({
		pos: vec2(5,5),
		strokeColor: "#fff",
		fillColor: "#000",
		sides: 3,
		radii: vec2(5,10),
		anchor: vec2(0.5,0.5),
		lineWidth: 1,
		debugColor: "#ff0",
		nameless: true
	});
	this.radiator = new Polygon({
		pos: vec2(5,15),
		strokeColor: "#fff",
		fillColor: "#000",
		sides: 3,
		radii: vec2(4,5),
		anchor: vec2(0.5,0),
		lineWidth: 1,
		angle: Math.PI,
		debugColor: "#ff0",
		nameless: true
	});
	this.shield = new Oval({
		anchor: vec2(0.5,0.5),
		pos: vec2(5,5),
		radii: 15,
		nameless: true,
		fillColor: "rgba(0,0,0,0)",
		lineWidth: 1,
		strokeColor: "#fff",
	});
	this.shield.addAction(new Blink());
	
	this.circle = new Circle(obj.pos,this.shield.radii);
	this.invulnerable = true;
	
	obj.anchor = vec2(0.5,0.5);
	
	this.setPos = function (vec) {
		Game.super(this).setPos(vec);
		this.circle.pos = vec;
	}
	this.mouseControl = (obj.mouse == "yes") ? true : false;
	this.mouseCursor = size2vec(RJ.winSize()).div(2);
	this.onEnter = function () {
		if (!this.mouseControl) {
			RJ.keyboardHandler.addHandler(this);
		}
		else {
			RJ.keyboardHandler.addHandler(this);
			RJ.mouseHandler.addHandler(this);
		}
		
		this.radiator.visible = false;
		
		this.addChild(this.radiator);
		this.addChild(this.triangle);
		this.addChild(this.shield);
	};
	this.onExit = function () {
		RJ.keyboardHandler.removeHandler(this);
		RJ.mouseHandler.removeHandler(this);
	};
	
	var setInvulernable = function (shuttle) {
		shuttle.sTime = 0;
		shuttle.invulnerable = true;
		shuttle.shield.visible = true;
		shuttle.shield.addAction(new Blink());
	};
	
	var turnLeft = false;
	var turnRight = false;
	var speedUp = false;
	var shoot = false;
	
	var self = this;
	this.mouseHandler = function (state,vec) {
		if (this.mouseControl) {
			if (state == "down") {
				shoot = true;
			}
			else if (state == "move") {	
				this.mouseCursor = vec;
			}
			else if (state == "click") {
				shoot = false;
			}
		}
	};
	
	this.keyboardHandler = function (state,key) {
		if (!this.disable) {
			if (state == "down") {
				switch (key) {
					case KeyBoard.arr_l:
						if (!this.mouseControl) {
							turnLeft = true;
							turnRight =false;
							speedUp =  false;
						}
					break;
				
					case KeyBoard.arr_r:
						if (!this.mouseControl) {
							turnLeft = false;
							turnRight =true;
							speedUp =  false;
						}
					break;
				
					case KeyBoard.arr_u:
						if (!this.mouseControl) {
							turnLeft = false;
							turnRight= false;
							speedUp  = true;
							this.radiator.visible = true;
						}
					break;
					
					case KeyBoard.space:
						if (!this.mouseControl) {
							shoot = true;
						}
						else {
							speedUp = true;
							this.radiator.visible = true;
						}
					break;
				}
			}
			else if (state == "up") {
				switch (key) {
					case KeyBoard.arr_l:
						if (!this.mouseControl) {
							turnLeft = false;
							turnRight = false;
							speedUp = false;
						}
					break;
				
					case KeyBoard.arr_r:
						if (!this.mouseControl) {
							turnLeft = false;
							turnRight = false;
							speedUp = false;
						}
					break;
				
					case KeyBoard.arr_u:
						if (!this.mouseControl) {
							turnLeft = false;
							turnRight = false;
							speedUp = false;
							this.radiator.visible = false;
						}
					break;
				
					case KeyBoard.space:
						if (!this.mouseControl) {
							shoot = false;
						}
						else {
							speedUp = false;
							this.radiator.visible = false;
						}
					break;
				}
			}
		}
	};
	
	var winSize = RJ.winSize();
	this.total = 5;
	this.hitPoints = this.total;
	this.disable = false;
	// Delay
	this.delay = 10;
	this.time = this.delay;
	// Shield Delay
	this.sDelay = RJ.rate * 3;
	this.sTime = 0;
	// Respawning
	this.respawning = false;
	var respawn = function (shuttle) {
		shuttle.sTime = 0;
		shuttle.invulnerable = true;
		shuttle.hitPoints = shuttle.total;
		shuttle.triangle.addAction(new Blink());
		shuttle.radiator.addAction(new Blink());
		if (shuttle.radiator.visible) {
			shuttle.radiator.visible = false;
		}
		shuttle.disable = true;
		shuttle.lfBar.current--;
		
		shoot = false;
		turnLeft = false;
		turnRight = false;
		speedUp = false;					
		
		setTimeout(function () {
			setInvulernable(shuttle);
			
			shuttle.deleteAction(0);
			shuttle.setPos(size2vec(winSize).div(2));
			shuttle.triangle.deleteAction(0);
			shuttle.radiator.deleteAction(0);
			shuttle.velocity = vecNull();
			shuttle.keyboardHandler("down",KeyBoard.arr_u);
			shuttle.disable = false;
			shuttle.angle = 0;
		},1000);
	}
	var timer = 0;
	
	this.update = function (dt) {
		if (this.time < this.delay) {
			this.time++;
		}
		
		if (shoot) {
			if (timer == -1) {
				timer = 5;
			}
			timer++;
			
		}
		else {
			timer = -1;
		}
		
		if (timer > 5) {
			with (Math){
				if (this.bullCount == 1) {
					var angle = self.angle - Math.PI/2;
					
					RJ.get("Bullets").addBullet(self.pos.clone(),vec2(cos(angle),sin(angle)));
				}
				else if(this.bullCount > 1) {
					for (var i = 0; i < this.bullCount; i++) {
						var angle = self.angle - Math.PI/2
					
						var sector = Math.PI/10;
						var startAngle = angle - sector/2;
						var diff = sector / (this.bullCount-1);
					
						var direction = vec2(cos(startAngle+(diff*i)),sin(startAngle+(diff*i)));
					
						RJ.get("Bullets").addBullet(self.pos.clone(),direction);
					}
				}
			}
			
			timer = 0;
		}
		
		if (this.sTime < this.sDelay) {
			this.sTime++;
		}
		else if (this.sTime == this.sDelay && !this.respawning) {
			this.invulnerable = false;
			this.shield.deleteAction(0);
			this.shield.visible = false;
		}
		
		if (this.velocity.x != 0 || this.velocity.y != 0) {
			this.velocity.scalar(0.993);
			this.setPos(this.pos.clone().add(this.velocity));
		}
		
		if (this.asteroids == undefined) {
			this.asteroids = RJ.get("Asteroids");
		}
		
		if (this.lfBar == undefined) {
			this.lfBar = RJ.get("lfBar");
		}
		
		if (!this.disable) {
			if (turnLeft) {
				this.angle -= Math.PI/40;
			}
			else if (turnRight) {
				this.angle += Math.PI/40;
			}
			else if (speedUp) {
				with (Math) {
					var angle = this.angle-PI/2;
				
					this.velocity.add(vec2(cos(angle),sin(angle)).scalar(0.2));
				}
			}
		}
		
		if (this.mouseControl) {
			var angle = this.pos.angleT(this.mouseCursor) - Math.PI/2;
				
			this.angle = angle;
		}
		
		if (this.hitPoints <= 0) {
			respawn(this);
		}
		
		if (this.pos.x < -15) {
			this.setPos(vec2(winSize.w+14,this.pos.y));
		}
		else if (this.pos.x > winSize.w+15) {
			this.setPos(vec2(-14,this.pos.y));
		}
		
		if (this.pos.y < -15) {
			this.setPos(vec2(this.pos.x,winSize.h+14));
		}
		else if (this.pos.y > winSize.h+15) {
			this.setPos(vec2(this.pos.x,-14));
		}
		
		if (this.asteroids.children.length > 0) {
			for (var i = 0; i < this.asteroids.children.length; i++) {
				var asteroid = this.asteroids.children[i];
				
				if ((asteroid.circle.circleVSaabb(this.rect) && !this.invulnerable) ||
					(asteroid.circle.cVSc(this.circle) && this.invulnerable)) {
					var angle = this.pos.angleT(asteroid.circle.pos);								
					this.velocity = Vector.angleToVec(angle);
					asteroid.velocity = Vector.angleToVec(angle).rotate(Math.PI).scalar(asteroid.acc);
					
					if (this.time == this.delay && !this.invulnerable) {
						this.hitPoints--;
						this.time = 0;
					}
				}
			}
		}
	}
	Game.inherit(this,Shuttle,GameObject,obj);
}
function SpaceSky(obj) {
	obj.render = null;
	
	var stars = [];
	
	this.count = (obj.count) ? obj.count : 50;
	this.win = RJ.winSize();
	
	this.onEnter = function () {
		for (var i = 0; i < this.count; i++) {
			stars[i] = vec2(10 + Math.round(i * ((this.win.w-20)/this.count)),10+(Math.round(Math.random() * (this.win.h-20))));
		}
	};
	
	this.opacity = 0.65;
	this.pColor = "#fff";
	this.render = function (ctx) {
		for (var i = 0; i < this.count; i++) {
			ctx.fillRect(stars[i].x,stars[i].y,2,2);
		}
	};
	
	Game.inherit(this,SpaceSky,GameObject,obj);
}
function Crush(obj) {
	obj.size = size(0,0);
	this.rad = Game.argDef(obj.rad,2)
	this.oval = new Oval({
		anchor: vec2(0.5,0.5),
		pos: vec2(5,5),
		radii: 10,
		nameless: true,
		fillColor: "#000",
		lineWidth: 2,
		strokeColor: "#fff",
		nameless: true,
	});
	
	this.onEnter = function () {
		this.addChild(this.oval);
		this.oval.addAction(new ScaleTo(1,size(this.rad,this.rad)));
		this.oval.addAction(new AlphaTo(1,0));
	};
	
	this.update = function (dt) {
		if (this.oval.scale.w == this.rad && this.oval.scale.h == this.rad) {
			this.removeFromParent();
		}
	};
	
	Game.inherit(this,Crush,GameObject,obj);
}
function Bullets(obj) {
	this.bullets = [];
	this.addBullet = function (vec,dir) {
		var index = this.bullets.length;
		
		this.bullets[index] = {
			pos: vec,
			dir: dir.scalar(15),
			time: 0,
			dur: 1,
			ind: index
		}
	}
	
	this.removeBullet = function (ind) {
		this.bullets[ind] = null;
		this.bullets.splice(ind,1);
		
		for (var i = 0; i < this.bullets.length; i++) {
			this.bullets[i].ind = i;
		}
	}
	
	this.render = function (ctx) {
		if (this.bullets.length > 0) {
			for (var i = 0; i < this.bullets.length; i++) {
				var bullet = this.bullets[i];
				
				ctx.fillStyle = "#0ff";
				ctx.fillRect(bullet.pos.x-1,bullet.pos.y-1,2,2);
			}
		}
	}
	
	this.update = function (dt) {
		if (this.bullets.length > 0) {
			for (var i = 0; i < this.bullets.length; i++) {
				var bullet = this.bullets[i];
				
				bullet.time += 1/RJ.rate;
				bullet.pos.add(bullet.dir);
				
				if (bullet.time >= bullet.dur) {
					this.removeBullet(bullet.ind);
				}
			}
		}
	}
	
	Game.inherit(this,Bullets,GameObject,obj);
}
function Bullet(obj) {
	this.direction = obj.direction ? obj.direction.scalar(15) : vec2(1,0);
	this.container = RJ.get("Bullets");
	this.duration = 1;
	this.time = 0;
	
	var winSize = RJ.winSize();
	this.update = function () {
		if (this.time < this.duration) {
			var pos = this.pos.clone().add(this.direction);
		
			this.setPos(pos);
		}
		else {
			RJ.get("scoreBar").subScore(1);
			this.removeFromParent();
		}
		
		this.time += 1/RJ.rate;
		
		if (this.pos.x < -15) {
			this.setPos(vec2(winSize.w+14,this.pos.y));
		}
		else if (this.pos.x > winSize.w+15) {
			this.setPos(vec2(-14,this.pos.y));
		}
	
		if (this.pos.y < -15) {
			this.setPos(vec2(this.pos.x,winSize.h+14));
		}
		else if (this.pos.y > winSize.h+15) {
			this.setPos(vec2(this.pos.x,-14));
		}
	};
	
	this.render = function (ctx) {
		ctx.fillRect(0,0,this.rect.w,this.rect.h);
	};
	
	Game.inherit(this,Bullet,GameObject,obj);
}
function Asteroid(obj) {
	this.velocity = obj.velocity ? obj.velocity : vec2(1 - Math.random()*2,1 - Math.random()*2);
	
	var siz = obj.size;
	this.acc = obj.acc ? obj.acc : 2;
	this.container = RJ.get("Asteroids");
	this.poly = new Polygon({
		pos: vec2(siz.w/2,siz.h/2),
		strokeColor: "#fff",
		fillColor: "#000",
		sides: Math.round(siz.w/10),
		anchor: vec2(0.5,0.5),
		radii: vec2(siz.w/2,siz.h/2),
		lineWidth: 2,
		debugColor: "#f0f",
		nameless: true,
	});
	this.type = this.poly.sides;
	this.hitPoints = this.type * 2;
	this.circle = new Circle(vec2(siz.w/2,siz.h/2).add(obj.pos),this.poly.radii.x-5);
	this.setPos = function (vec) {
		this.pos = vec;
		this.rect.setPos(vec.x,vec.y);
		this.circle.pos = this.pos.clone().add(vec2(this.rect.w/2,this.rect.h/2));
	}
	
	this.onEnter = function () {
		this.addChild(this.poly);
	};
	
	var winSize = RJ.winSize();
	this.update = function (dt) {
		this.poly.angle += Math.PI/360;
		this.velocity.scalar(1.001);
		
		if (this.bullets == undefined) {
			this.bullets = RJ.get("Bullets").bullets;
		}
		
		var pos = this.pos.clone().add(this.velocity);
		this.setPos(pos);
		
		if (this.pos.x < 0 && this.velocity.x < 0) {
			this.velocity.x *= -1;
		}
		else if (this.pos.x > winSize.w-this.rect.w && this.velocity.x > 0) {
			this.velocity.x *= -1;
		}
	
		if (this.pos.y < 0 && this.velocity.y < 0) {
			this.velocity.y *= -1;
		}
		else if (this.pos.y > winSize.h-this.rect.h && this.velocity.y > 0) {
			this.velocity.y *= -1;
		}
		
		if (this.container.children.length != 0) {
			for (var i = 0; i < this.container.children.length; i++) {
				if (i != this.index) {
					var asteroid = this.container.getChild(i);
					
					if (asteroid.circle.cVSc(this.circle)) {
						var angle = this.circle.pos.angleT(asteroid.circle.pos);
						
						this.velocity = Vector.angleToVec(angle).scalar(this.acc);
						this.hitPoints -= 1;
						
						break;
					}
				}
			}
		}
		
		if (this.bullets.length != 0) {
			for (var i = 0; i < this.bullets.length; i++) {
				var bullet = this.bullets[i];
		
				if (this.circle.vecInside(bullet.pos)) {
					if (this.hitPoints > 0) {
						this.hitPoints -= 1;
					}
					
					if(this.hitPoints == 0) {
						RJ.get("scoreBar").addScore(this.type * 100);
					}
			
					RJ.get("Bullets").removeBullet(bullet.ind);
					RJ.get("scoreBar").addScore(this.type * 5);
					
					break;
				}
			}
		}
		
		if (this.hitPoints <= 0) {
			if (this.type >= 5) {
				var angle = this.circle.pos.angleT(RJ.get("Shuttle").pos);
				var vec = Vector.angleToVec(angle);
			
				var dirOne = vec.clone().rotate(Math.PI/4).scalar(2);
				var dirTwo = vec.clone().rotate(-Math.PI/4).scalar(2);
			
				var meteorOne = new Asteroid({
					pos: this.pos.clone().add(dirOne.clone().scalar(4*(this.type-2))),
					size: size((this.type-2) * 10,(this.type-2) * 10),
					nameless: true,
					velocity: dirOne,
				});
				var meteorTwo = new Asteroid({
					pos: this.pos.clone().add(dirTwo.clone().scalar(4*(this.type-2))),
					size: size((this.type-2) * 10,(this.type-2) * 10),
					nameless: true,
					velocity: dirTwo,
				});
				
				this.container.addChild(meteorOne);
				this.container.addChild(meteorTwo);
			}
			
			RJ.get("Crushes").addChild(new Crush({
				pos: this.pos.clone().add(vec2(this.poly.radii.x,this.poly.radii.y)),
				anchor: vec2(0.5,0.5),
				rad: this.type / 2,
				nameless: true,
			}));
			
			this.removeFromParent();
		}
		
		var da = ((this.type * 2) - this.hitPoints)/(this.type * 2);
		var hxStr = Math.round(8 * da).toString(16);
		
		this.poly.pColor = "#"+repeat(hxStr,3);
	};
	
	Game.inherit(this,Asteroid,GameObject,obj)
}
function HealthBar(obj) {
	this.total = (obj.total) ? obj.total : 0;
	this.object = (obj.target) ? obj.target : null;
	this.width = 100;
	
	obj.alpha = 0.75;
	obj.size = size(100,20);
	obj.fillColor = linearGradient(vec2(0,0),vec2(0,20),[0.1,"#f00",1,"#000"]);
	obj.strokeColor = "#fff";
	this.update = function (dt) {
		if (this.object.hitPoints / this.total >= 0) {
			this.width = 100 * (this.object.hitPoints / this.total);
		}
	};
	
	this.render = function (ctx) {
		ctx.fillRect(0,0,this.width,this.rect.h);
		ctx.strokeRect(0,0,this.rect.w,this.rect.h);
	};
	
	Game.inherit(this, HealthBar, GameObject, obj);
}
function LifeIndicator(obj) {
	this.total = (obj.total) ? obj.total : 3;
	this.current = this.total;
	
	obj.size = size(100,20);
	obj.fillColor = "rgba(0,0,0,0.5)";
	obj.strokeColor = "#fff";
	
	this.onEnter = function () {
		for (var i = 0; i < this.total; i++) {
			this.addChild(new Polygon({
				sides: 3,
				anchor: vec2(0.5,0.5),
				pos: vec2(15 + (100/this.total * i) , 12),
				radii: vec2(5,9),
				fillColor: "#000",
				strokeColor: "#fff",
				lineWidth: 1,
				nameless: true
			}));
		}
	}
	
	this.render = function (ctx) {
		ctx.fillRect(0,0,this.rect.w,this.rect.h);
		ctx.strokeRect(0,0,this.rect.w,this.rect.h);
	};
	
	this.update = function (dt) {
		var u = this.total - this.current;
		for (var i = 0; i < this.children.length; i++) {
			var elem = this.getChild(i);
			
			if (u > 0) {
				elem.visible = false;
			}
			else {
				elem.visible = true;
			}
			
			u--;
		}
	};
	
	Game.inherit(this,LifeIndicator,GameObject,obj);
}
function ScoreCounter(obj) {
	var score = 0;
	
	obj.size = size(100,20);
	
	this.addScore = function (num) { score += num; }
	this.subScore = function (num) { if (score > 0) {score -= num;} }
	this.clearScore = function () { score = 0; }
	this.getScore = function () { return score; }
	
	this.text = new Text({
		pos: size2vec(obj.size).div(2).sub(vec2(0,2)),
		anchor: vec2(0.5,0.5),
		fillColor: "#fff",
		font: "Verdana",
		text: "0",
		fontSize: 12,
		nameless: true,
	});
	this.rectangle = new Rectangle({
		size: size(100,20),
		fillColor: "rgba(0,0,0,0.5)",
		strokeColor: "#fff",
		nameless: true
	});
	
	this.onEnter = function () {
		this.addChild(this.rectangle);
		this.addChild(this.text);
	};
	
	this.update = function () {
		if (parseInt(this.text.text) != score) {
			this.text.text = score;
		}
	};
	
	Game.inherit(this,ScoreCounter,GameObject,obj);
}