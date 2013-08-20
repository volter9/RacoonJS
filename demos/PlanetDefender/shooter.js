var Shooter = {}; Shooter.constructor = function Shooter() {};

(function shooter() {
	function Button (obj) {
		this.hover = RJ.argDef(obj.hover,null);
		this.label = RJ.argDef(obj.text,"");
		this.selector = RJ.argDef(obj.selector,function selector() {});
		
		this.render = function (ctx) {
			ctx.fillRect(0,0,this.rect.w,this.rect.h);
			ctx.strokeRect(0,0,this.rect.w,this.rect.h);
			
			ctx.font = "14px Verdana";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			
			ctx.fillStyle = "#fff";
			ctx.fillText(this.label,this.rect.w/2,this.rect.h/2);
		};
		
		this.onEnter = function () {
			new RJ.MouseHandler().addHandler(this);
		};
		this.onExit = function () {
			new RJ.MouseHandler().removeHandler(this);
		};
		
		this.mouseHandler = function (state, vec) {
			if (state == "click") {
				if (this.rect.containVec(vec)) {
					this.selector();
				}
			}
			else if (state == "move" && this.rect.containVec(vec)) {
				if (this.hover != null) {
					this.hover();
				}
			}
		};
				
		RJ.inherit(this, Button, RJ.GameObject, obj);
	}	
	function Bullets(obj) {
		this.bullets = [];
		
		this.add = function (pos,vel,dur,wall) {
			var ind = this.bullets.length;
			var wall = (wall != undefined) ? wall : true;
			
			this.bullets[ind] = {
				ind: ind,
				pos: pos,
				vel: vel,
				dur: dur,
				time: 0,
				wall: wall,
			};
		};
		this.tilePos = function (pos) {
			var x = pos.x / this.grid.blockSize.w << 0;
			var y = pos.y / this.grid.blockSize.h << 0;
			
			x = (x < 0) ? 0 : ((x > this.grid.size.w-1) ? this.grid.size.w-1 : x);
			y = (y < 0) ? 0 : ((y > this.grid.size.h-1) ? this.grid.size.h-1 : y);
			
			return vec2(x,y);
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
						
						if (bullet.wall) {
							var tilePos = this.tilePos(bullet.pos);
							if (this.grid.cells[tilePos.x][tilePos.y] == 1) {
								this.delete(bullet.ind);
							}
						}
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
	function Player(obj) {
		this.hp = 10;
		this.speed = 2;
		this.gun = new RJ.Rectangle({
			pos: vec2(7.5,5),
			anchor: vec2(0.5,0),
			size: size(7,15),
			nameless: true,
		});
		this.person = new RJ.Oval({
			radii: 7.5,
			pos: vec2(0,0),
			strokeColor: "#0f0",
			nameless: true,
		});
		this.circle = new RJ.Circle(obj.pos,obj.size.w/2);
		this.setPos = function (vec) {
			RJ.super(this).setPos(vec);
			this.circle.pos = vec;
		};
		this.renderAABB = function (ctx) {
			ctx.strokeStyle = "#f00";
			ctx.beginPath();
			
			ctx.arc(this.circle.pos.x,this.circle.pos.y,this.circle.radii,0,Math.PI*2,true);
			
			ctx.stroke();
		};
		
		this.tilePos = function (pos) {
			var x = pos.x / this.grid.blockSize.w << 0;
			var y = pos.y / this.grid.blockSize.h << 0;
			
			x = (x < 0) ? 0 : ((x > this.grid.size.w-1) ? this.grid.size.w-1 : x);
			y = (y < 0) ? 0 : ((y > this.grid.size.h-1) ? this.grid.size.h-1 : y);
			
			return vec2(x,y);
		};
		
		this.onEnter = function () {
			this.addChild(this.gun);
			this.addChild(this.person);
			
			this.grid = this.game.get("Grid");
			this.aabb = [];
			for (var x = 0; x < this.grid.size.w; x++) {
				this.aabb[x] = [];
				for (var y = 0; y < this.grid.size.h; y++) {
					if (this.grid.cells[x][y] == 1 || (x == 10 && y == 5)) {
						this.aabb[x][y] = new RJ.Rect(x * this.grid.blockSize.w, y * this.grid.blockSize.h,this.grid.blockSize.w,this.grid.blockSize.h);
					}
					else {
						this.aabb[x][y] = null;
					}
				}	
			}
			
			this.setPos(vec2(this.grid.rect.w/2,this.grid.rect.h/2));
			
			new RJ.KeyBoardHandler().addHandler(this);
		};
		this.onExit = function () {
			new RJ.KeyBoardHandler().removeHandler(this);
		};
		
		this.direction = vec2(0,0);
		this.keyboardHandler = function (state,key) {
			if (state === "down") {
				var speed = this.speed;
				if (key == RJ.KeyBoard.key_a) {
					this.direction.x = -speed;
				}
				if(key == RJ.KeyBoard.key_d) {
					this.direction.x = speed;
				}
				
				if (key == RJ.KeyBoard.key_w) {
					this.direction.y = -speed;
				}
				if (key == RJ.KeyBoard.key_s) {
					this.direction.y = speed;
				}
			}
			else if (state === "up") {
				if (key == RJ.KeyBoard.key_a || key == RJ.KeyBoard.key_d) {
					this.direction.x = 0;
				}
				if (key == RJ.KeyBoard.key_w || key == RJ.KeyBoard.key_s) {
					this.direction.y = 0;
				}
			}
		};
		
		var win = RJ.CurrentGame.winSize();
		this.update = function () {
			var blockDirection = {x: 0, y: 0};
			
			if (this.zombies == undefined) {
				this.zombies = this.game.get("Zombies");
			}
			else {
				for (var i = 0; i < this.zombies.children.length; i++) {
					var zomb = this.zombies.children[i];
					
					if (zomb.circle.cVSc(this.circle) && this.hp >= 0 && !zomb.dying) {
						this.hp--;
						zomb.hp = 0;
						zomb.dying = true;
						
						break;
					}
					else if (this.hp < 0) {
						this.game.stop();
					}
				}
			}
			
			this.person.sColor = "hsl("+(120 * (this.hp/10))+",100%,50%)";
			
			if (this.aabb) {
				var tilePos = this.tilePos(this.pos);
				
				var t = (tilePos.y > 0) ? this.aabb[tilePos.x][tilePos.y-1] : null;
				var b = (tilePos.y < this.grid.size.h - 1) ? this.aabb[tilePos.x][tilePos.y+1] : null;
				
				var l = (tilePos.x > 0) ? this.aabb[tilePos.x-1][tilePos.y] : null;
				var r = (tilePos.x < this.grid.size.w - 1) ? this.aabb[tilePos.x+1][tilePos.y] : null;
				
				if (t != null && this.rect.aabb(t)) {
					blockDirection.y = -1;
				}
				else if (b != null && this.rect.aabb(b)) {
					blockDirection.y = 1;
				}
				
				if (l != null && this.rect.aabb(l)) {
					blockDirection.x = -1;
				}
				else if (r != null && this.rect.aabb(r)) {
					blockDirection.x = 1;
				}
			}
			
			if (this.pos.x < 0) {
				this.setPos(vec2(0,this.pos.y));
			}
			else if (this.pos.x > this.grid.rect.w) {
				this.setPos(vec2(this.grid.rect.w,this.pos.y));
			}
			
			if (this.pos.y < 0) {
				this.setPos(vec2(this.pos.x,0));
			}
			else if (this.pos.y > this.grid.rect.h) {
				this.setPos(vec2(this.pos.x, this.grid.rect.h));
			}
			
			var dir = this.direction.clone();
			if (blockDirection.x == -1 && this.direction.x < 0) {
				dir.x = 0;
			}
			else if (blockDirection.x == 1 && this.direction.x > 0) {
				dir.x = 0;
			}
			
			if (blockDirection.y == -1 && this.direction.y < 0) {
				dir.y = 0;
			}
			else if (blockDirection.y == 1 && this.direction.y > 0) {
				dir.y = 0;
			}
			
			if (this.pos.x > win.w/2 && this.pos.x < this.grid.rect.w-win.w/2) {
				var cameraPos = vec2(-this.pos.x+win.w/2,this.parent.pos.y);
				this.parent.pos = cameraPos;
			}
			
			if (this.pos.y > win.h/2 && this.pos.y < this.grid.rect.h-win.h/2) {
				var cameraPos = vec2(this.parent.pos.x,-this.pos.y+win.h/2);
				this.parent.pos = cameraPos;
			}
			
			this.setPos(this.pos.clone().add(dir));
		};
		
		RJ.inherit(this,Player,RJ.GameObject,obj);
	}
	function Cursor (obj) {
		this.onEnter = function () {
			new RJ.MouseHandler().addHandler(this);
		};
		this.onExit = function () {
			new RJ.MouseHandler().removeHandler(this);
		};
		
		this.relPos = vecNull();
		this.mouseHandler = function (state,vec) {
			if (state === "move") {
				this.relPos = vec;
				
				var player = this.game.get("Player");
				player.point = this.pos;
			}
			else if (state === "down") {
				shooting = true;
			}
			else if (state === "click") {
				shooting = false;
			}
		};
		
		var shooting = false;
		this.dur = 20;
		var time = this.dur;
		this.update = function () {
			var player = this.game.get("Player");
			var relativePos = this.pos.clone().sub(player.parent.pos);
			this.angle = relativePos.angleT(player.pos);
			
			var relPos = this.relPos.clone();
			if (this.pos.x !== relPos.x || this.pos.y !== relPos.y) {
				this.setPos(relPos);
			}
			if (player.parent.running) {	
				player.angle = this.angle - Math.PI/2;
			}
			
			if (!this.gameStats.break) {
				if (shooting && player.parent.running) {
					time++;
				
					if (time >= this.dur) {
						var vel = RJ.Vector.angleToVec(this.angle).scalar(10);
						var pos = player.pos.clone().add(vel);
					
						this.game.get("Bullets").add(pos,vel,2);
						time = 0;
					}
				}
				else {
					time = this.dur;
				}
			}
		};
		
		this.render = function (ctx) {
			ctx.beginPath();
			ctx.arc(this.rect.w/2,this.rect.h/2,this.rect.w/2.5,0,Math.PI*2,true);
			ctx.stroke();
			
			for (var i = 0; i < Math.PI*2; i += Math.PI/2) {
				ctx.beginPath();
				
				ctx.moveTo(15*Math.cos(i)+this.rect.w/2,15*Math.sin(i)+this.rect.h/2);
				ctx.lineTo(7*Math.cos(i)+this.rect.w/2,7*Math.sin(i)+this.rect.h/2);
				
				ctx.stroke();
			}
			
			ctx.strokeStyle = "#fff"
			ctx.strokeRect(this.rect.w/2-1,this.rect.h/2-1,2,2);
		};
		
		RJ.inherit(this,Cursor,RJ.GameObject,obj);
	}
	function Zombie (obj) {
		this.spawnTime = RJ.argDef(obj.spawnTime,0);
		this.maxHp = RJ.argDef(obj.hp, 5)
		this.hp = this.maxHp;
		
		this.dying = false;
		this.circle = new RJ.Circle(obj.pos,obj.size.w/2);
		this.zombie = new RJ.Oval({
			radii: obj.size.w/2,
			strokeColor: "hsl(120,100%,50%)",
			fillColor: "#000",
			nameless: true,
			lineWidth: 3
		});
		
		this.setPos = function (vec) {
			RJ.super(this).setPos(vec);
			
			this.circle.pos = vec;
		};
		
		this.tilePos = function (pos) {
			var x = pos.x / this.grid.blockSize.w << 0;
			var y = pos.y / this.grid.blockSize.h << 0;
			
			x = (x < 0) ? 0 : ((x > this.grid.size.w-1) ? this.grid.size.w-1 : x);
			y = (y < 0) ? 0 : ((y > this.grid.size.h-1) ? this.grid.size.h-1 : y);
			
			return vec2(x,y);
		};
		
		this.onEnter = function () {
			this.addChild(this.zombie);
			this.zombie.opacity = 0;
			
			this.grid = this.game.get("Grid");
			this.bullets = this.game.get("Bullets");
			
			this.spawnTime *= this.game.rate;
		};
		
		this.debColor = "#"+(Math.round(Math.random() * 4095).toString(16));
		this.renderAABB = function (ctx) {
			if (this.path) {
				ctx.strokeStyle = this.debColor;
				ctx.lineWidth   = 1;
				ctx.beginPath();
				for (var i = 0; i < this.path.length; i++) {
					var dat = this.path[i];
					var x   = dat.x * this.grid.blockSize.w + this.grid.blockSize.w/2;
					var y   = dat.y * this.grid.blockSize.h + this.grid.blockSize.h/2;
					
					if (i == 0) {
						ctx.moveTo(x,y);
					}
					else {
						ctx.lineTo(x,y);
					}
				}
				ctx.stroke();
			}
		};
		
		this.step = 0;
		this.spawn = 0;
		this.speed = RJ.argDef(obj.speed,1);
		this.velocity = vecNull();
		this.update = function () {
			if (this.spawn >= this.spawnTime) {
				if (!this.dying) {
					var dist = this.pos.distance(this.player.pos);
				
					for (var i = 0; i < this.bullets.bullets.length; i++) {
						var bullet = this.bullets.bullets[i];
				
						if (this.circle.vecInside(bullet.pos)) {
							this.bullets.delete(bullet.ind);
					
							this.hp--;
					
							if (this.hp < 0) {
								this.dying = true;
							}
							this.GameStats.money += 2;
					
							this.zombie.sColor = "hsl("+(120 * (this.hp/this.maxHp))+",100%,50%)";
						}
					}
				
					if (this.path && this.step < this.path.length) {					
						var curStep = this.path[this.step];
						var stepPos = vec2(curStep.x * this.grid.blockSize.w + this.grid.blockSize.w/2,curStep.y * this.grid.blockSize.h + this.grid.blockSize.h/2);
						var distance = this.pos.distance(stepPos);
					
						if (distance < Math.pow(this.speed,2)) {
							this.step++;
							this.setPos(stepPos);
						}
						else {
							var angle = this.pos.angleT(stepPos);
							var vel = RJ.Vector.angleToVec(angle).scalar(this.speed).round();
							var pos = this.pos.clone().sub(vel);
						
							this.velocity = vel;
							this.setPos(pos);
						}
					}
					else {
						this.path = null;
					}
				
					if (this.path == null) {
						this.dying = true;
					}
				
					if (dist < Math.pow(200,2)) {
						var opacity = 1 - (dist / Math.pow(200,2)) * 0.9;
					
						this.zombie.opacity = opacity;
					}
					else {
						this.zombie.opacity = 0.1;
					}
				}
				else {
					if (this.zombie.actions.length == 0 && this.zombie.opacity != 0) {
						this.zombie.addAction(new RJ.AlphaTo(1,0));
						this.addAction(new RJ.ScaleTo(1,size(0.5,0.5)));
					}
				
					if (this.zombie.opacity < 0.1) {
						this.zombie.opacity = 0;
					}
				
					if (this.zombie.opacity == 0) {
						this.zombie.opacity = 0;
						this.removeFromParent();
					}
				
					this.zombie.sColor = "hsl("+(120 * (this.hp/10))+",100%,50%)";
				}
			}
			else {
				this.spawn ++;
			}
		};
		
		RJ.inherit(this,Zombie,RJ.GameObject,obj);
	}
	function Tower (obj) {
		this.base = new RJ.Oval({
			pos: vec2(2,2),
			radii: 8,
			achor: vec2(0,0),
			nameless: true,
			strokeColor: RJ.argDef(obj.strokeColor,"#fff")
		});
		
		var maxDist = 200*200;
		this.seekNearestTarget = function () {
			var minDist = 201*201;
			var tempZomb = null;
			if (this.zombies.children.length > 0) {
				for (var i = 0; i < this.zombies.children.length; i++) {
					var zombie = this.zombies.children[i];
				
					var dist = this.pos.distance(zombie.pos);
					if (dist < minDist && !zombie.dying) {
						minDist = dist;
						tempZomb = zombie;
					}
				}
				
				if (tempZomb != null) {
					this.target = tempZomb;
				}
			}
			else {
				this.target = null;
			}
		};
		
		this.renderAABB = function (ctx) {
			ctx.beginPath();
			ctx.arc(this.pos.x,this.pos.y,200,0,Math.PI*2,true);
			ctx.stroke();
		};
		
		this.target = null;
		this.onEnter = function () {
			this.addChild(this.base);
			
			this.bullets = this.game.get("Bullets");
			this.zombies = this.game.get("Zombies");
		};
		
		this.dur = RJ.argDef(obj.dur,20);
		this.time = this.dur+1;
		this.update = function () {
			
			this.seekNearestTarget();
			
			if (this.target) {
				if (this.target.dying || this.target.hp < 0) {
					this.target = null;
					this.time = 0;
				}
				
				if (this.target) {
					var pos = this.target.pos.clone().add(this.target.velocity);
					
					var angle = this.pos.angleT(pos)-Math.PI;
					this.angle = angle+Math.PI/2;
				}
				
				if (this.time > this.dur) {
					var vel = RJ.Vector.angleToVec(angle).scalar(10);
					var pos = this.pos.clone().add(vel);
					
					this.bullets.add(pos,vel,2,false);
					
					this.time = 0;
				}
				
				this.time ++;
			}
			else {
				this.time = this.dur+1;
			}
		};
		
		this.render = function (ctx) {
			ctx.fillRect(7,-5,6,18);
			ctx.strokeRect(7,-5,6,18);
		};
		
		RJ.inherit(this,Tower,RJ.GameObject,obj);
	}
	function AdvancedTower(obj) {
		obj.strokeColor = "#0f0";
		obj.dur = 15;
		
		RJ.inherit(this,AdvancedTower,Tower,obj);
	};
	function SuperTower(obj) {
		obj.strokeColor = "#f00";
		obj.dur = 10;
		
		RJ.inherit(this,SuperTower,Tower,obj);
	};
	function Grid(obj) {
		this.size = RJ.argDef(obj.dimension,size(32,24))
		this.blockSize = RJ.argDef(obj.blockSize,size(20,20));
		this.cells = [];
		
		this.init = function () {
			for (var x = 0; x < this.size.w; x++) {
				this.cells[x] = [];
				for (var y = 0; y < this.size.h; y++) {
					this.cells[x][y] = 0;
					
					if (x == 0 || y == 0 || x == this.size.w-1 || y == this.size.h-1) {
						this.cells[x][y] = 1;
					}
				}
			}
			
			this.drawRect(10,10,11,11,true);
			this.drawRect(this.size.w-21,10,11,11,true);
			this.drawRect(10,this.size.h-21,11,11,true);
			this.drawRect(this.size.w-21,this.size.h-21,11,11,true);
			this.drawRect(this.size.w/2 - 4,this.size.h/2 - 4,8,8,true);
			
			this.drawRect(this.size.w-27,this.size.h-11,6,1);
			this.drawRect(this.size.w-27,10,6,1);
			
			this.drawRect(10,21,1,6);
			this.drawRect(this.size.w-11,21,1,6);
			
			this.drawRect(0,0,11,11);
			this.drawRect(this.size.w-11,this.size.h-11,11,11);
			
			var cX = (this.size.w/2) >> 0;
			var cY = (this.size.h/2) >> 0;
			
			// Free center cells for player
			this.cells[cX][cY] = 0;
			this.cells[cX-1][cY-1] = 0;
			this.cells[cX-1][cY] = 0;
			this.cells[cX][cY-1] = 0;
			
			// Free space for 
			this.cells[10][5] = 0;
			this.cells[this.size.w-11][this.size.h-6] = 0;
		};
		
		this.onEnter = function () {
			this.rect.setSize(size(this.size.w * this.blockSize.w,this.size.h * this.blockSize.h));
			this.winSize = this.game.winSize();
		};
		
		this.drawEllipse = function (x,y,r,a,t) {				
			for (var i = 0; i < t; i += Math.PI/45) {
				var vel = RJ.Vector.angleToVec(i + a).scalar(r).round();
				var pos = vec2(x,y).add(vel);
				
				this.cells[pos.x][pos.y] = 1;
			}
		};
		this.drawRect = function (x,y,w,h) {
			var holes = (arguments[4]) ? arguments[4] : false;
			var perimeter = w*2 + h*2;
			var direction = vec2(1,0);
			var lX = x;
			var lY = y;
			var i = 0;
			var j = 0;
			var k = 0;
			
			while (j < perimeter) {
				var side = (k%2 == 0) ? w-1 : h-1;
				if (i < side) {
					this.cells[lX][lY] = 1;
					if (holes) {
						if (side % 2 == 0) {
							if (i == ((side/2) >> 0)) {
								this.cells[lX][lY] = 0;
							}
						}
						else {
							if (i == (side/2 >> 0) || i == (side/2 >> 0)+1) {
								this.cells[lX][lY] = 0;
							}
						}
					}
					
					lX += direction.x;
					lY += direction.y;
					
					i++;
					j++;
				}
				else {
					direction = direction.rotate(Math.PI/2).round();
					
					i = 0;
					k++;
				}
			}
		}
		
		this.render = function (ctx) {
			for (var x = 0; x < this.size.w; x++) {
				for (var y = 0; y < this.size.h; y++) {
					if (this.cells[x][y] == 1) {
						ctx.fillRect(x * this.blockSize.w,y * this.blockSize.h, this.blockSize.w, this.blockSize.h);
						ctx.strokeRect(x * this.blockSize.w,y * this.blockSize.h, this.blockSize.w, this.blockSize.h);
					}
				}
			}
		}
		
		this.init();
		RJ.inherit(this,Grid,RJ.GameObject,obj);
	}
	function PathFinder(map) {
		this.map = [];
		this.random = true;
		this.randomTimes = 20;
		
		this.init = function () {
			for (var x = 0; x < map.length; x++) {
				this.map[x] = [];
				for (var y = 0; y < map[x].length; y++) {
					this.map[x][y] = {x: x,y: y};
					this.map[x][y].type = map[x][y];
				}
			}
		};
		
		this.manhattanDist = function (p1,p2) {
			var mD1 = Math.abs(p1.x-p2.x);
			var mD2 = Math.abs(p1.y-p2.y);
			
			return mD1 + mD2;
		};
		
		this.getNeighbors = function (data,obj) {
			var ret = [], x = obj.x, y = obj.y;
			
			// if (data[x-1] && data[x][y-1]) {
// 				if (data[x-1][y-1]) {
// 					ret.push(data[x-1][y-1]);
// 				}
// 			}
// 			if (data[x+1] && data[x][y-1]) {
// 				if (data[x+1][y-1]) {
// 					ret.push(data[x+1][y-1]);
// 				}
// 			}
// 			if (data[x-1] && data[x][y-1]) {
// 				if (data[x-1][y-1]) {
// 					ret.push(data[x-1][y-1]);
// 				}
// 			}
// 			if (data[x-1] && data[x][y+1]) {
// 				if (data[x-1][y+1]) {
// 					ret.push(data[x-1][y+1]);
// 				}
// 			}
			
			if (data[x-1] && data[x-1][y]) {
				ret.push(data[x-1][y]);
			}
			if (data[x+1] && data[x+1][y]) {
				ret.push(data[x+1][y]);
			}
			if (data[x][y-1]) {
				ret.push(data[x][y-1]);
			}
			if (data[x][y+1]) {
				ret.push(data[x][y+1]);
			}
			
			return ret;
		};
		
		this.sortByF = function (a,b) {
			var a1 = a.f;
			var b1 = b.f;
	
			return ((a1 < b1) ? 1 : ((a1 > b1) ? -1 : 0));
		};
		
		this.findPath = function (start,end) {
			var openList = [];
			var firstNode = {};
			
			for (var x = 0; x < this.map.length; x++) {
				for (var y = 0; y < this.map[0].length; y++) {
					this.map[x][y].g = 0;
					this.map[x][y].h = 0;
					this.map[x][y].f = 0;
					this.map[x][y].open = false;
					this.map[x][y].closed = false;
					this.map[x][y].parent = null;
				}
			}
			
			firstNode.parent = null;
			firstNode.g = 0;
			firstNode.x = start.x;
			firstNode.y = start.y;
			firstNode.h = this.manhattanDist(firstNode,end);
			firstNode.f = firstNode.g + firstNode.h;
			firstNode.open = true;
			
			openList.push(firstNode);
			
			while(openList.length > 0) {
				var curNode = openList.pop();
		
				if(curNode.x === end.x && curNode.y === end.y){
					var cur = curNode,
						path = [];
			
					while(cur.parent) {
						path.push(cur);
						cur = cur.parent;
					}
					path.push(cur);
					this.randomTimes = 20;
					
					return path.reverse();
				}
				else{
					curNode.closed = true;
					curNode.open = false;
			
					var neighbors = this.getNeighbors(this.map, curNode);   
					for(var i = 0; i < neighbors.length; i++){
						var neighbor = neighbors[i];
						if(neighbor.closed || neighbor.type !== 0){
							continue;   
						}
				
						var gScore;
						if (this.random && this.randomTimes > 0) {
							gScore = curNode.g + Math.floor(Math.random() * 3);
							this.randomTimes--;
						}
						else {
							gScore = curNode.g + 1;
						}
						
						var betterGScore = false;
				
						if(!neighbor.open){
							betterGScore = true;
							neighbor.h = this.manhattanDist(neighbor, end);
							neighbor.open = true;
							openList.push(neighbor);
							openList.sort(this.sortByF);
						}else if(gScore < neighbor.g){
							betterGScore = true;
						}
				
						if(betterGScore){
							neighbor.parent = curNode;
							neighbor.g = gScore;
							neighbor.f = neighbor.g + neighbor.h;
							openList.sort(this.sortByF);
						}
					}
				}
			}
		};
		
		this.init();
	};
	
	Shooter.Button = Button;
	Shooter.Player = Player;
	Shooter.Cursor = Cursor;
	Shooter.Bullets = Bullets;
	Shooter.Zombie = Zombie;
	Shooter.Tower = Tower;
	Shooter.AdvancedTower = AdvancedTower;
	Shooter.SuperTower = SuperTower;
	Shooter.PathFinder = PathFinder;
	Shooter.Grid = Grid;
})();