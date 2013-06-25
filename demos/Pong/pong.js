function Ball(obj) {
	obj.anchor = vec2(0.5,0.5);
	obj.size = size(10,10);
	obj.enter = null;
	
	this.platforms = Game.argDef(obj.platforms,[]);
	this.acceleration = 10;
	
	var angle = Math.random() * (Math.PI * 2);
	this.velocity = vec2(Math.cos(angle),Math.sin(angle)).scalar(this.acceleration);
	this.rectangle = new Rectangle({
		size: obj.size,
		fillColor: "#fff",
		lineWidth: 0,
		nameless: true,
	});
	
	this.onEnter = function () {
		this.addChild(this.rectangle);
		respawn();
	};
	
	var self = this;
	var win = RJ.winSize();
	var respawn = function (dir) {
		if (typeof(dir) == "string") {
			dir = (dir.length > 0) ? dir : "left";
		}
		
		var direction = 0;
		var bound = RJ.get("Boundary");
		if (dir != "") {
			if (dir == "left") {
				direction = -1;
				RJ.get("Score").addBScore();
			}
			else if (dir == "right") {
				direction = 1;
				RJ.get("Score").addPScore();
			}
			
			if (bound.pos.x+30*direction > 60 && bound.pos.x+30*direction < win.w-60) {
				bound.setPos(bound.pos.clone().add(vec2(30*direction,0)));
			}
		}
		
		self.setPos(bound.pos.clone().add(vec2(0,win.h/2)));
		self.pause();
	
		setTimeout(function () {
			self.play();
			self.acceleration = 10;
			
			if (dir == undefined) {
				direction = (Math.round(Math.random()) == 0) ? 1 : -1;
			}
			self.velocity = vec2(direction*10,0);
		},1500);
	};
	this.update = function () {
		var pos = this.pos.clone().add(this.velocity);
		
		this.setPos(pos);
		
		if (this.pos.x+50 < 0) {
			respawn("left");
		}
		else if(this.pos.x-50 > win.w) {
			respawn("right");
		}
		
		if (this.pos.y-this.rect.h/2 < 0) {
			this.velocity.y = Math.abs(this.velocity.y);
		}
		else if(this.pos.y+this.rect.h/2 > win.h) {
			this.velocity.y = -Math.abs(this.velocity.y);
		}
		
		if (this.platforms.length != 0) {
			for (var i = 0; i < this.platforms.length; i++) {
				var platform = this.platforms[i];
				
				if (this.rect.aabb(platform.rect)) {
					var angle = this.pos.angleT(platform.pos);
					
					this.acceleration++;
					this.velocity = Vector.angleToVec(angle).scalar(this.acceleration);
				}
			}
		}
	};
	
	Game.inherit(this,Ball,GameObject,obj);
}
function Racket(obj) {
	obj.size = size(10,60);
	obj.anchor = vec2(0,0.5);
	obj.fillColor = "#fff";
	
	this.onEnter = function () {
		RJ.mouseHandler.addHandler(this);
	};
	
	this.onExit = function () {
		RJ.mouseHandler.removeHandler(this);
	};
	
	var win = RJ.winSize();
	this.mouseHandler = function (state, vec) {
		if (state === "move" && this.parent.running) {
			vec = vec2(vec.x,vec.y);
			if (this.parent.angle % Math.PI*2 != 0) {
				vec.sub(size2vec(win).div(2)); 
				vec = vec.rotate(-this.parent.angle);
				vec.scalar(4/3);
				vec.add(size2vec(win).div(2)); 
			}
			
			this.setPos(vec2(this.pos.x,vec.y));
			
			if (vec.y > win.h-this.rect.h/1.5) {
				this.setPos(vec2(this.pos.x,win.h-this.rect.h/1.5));
			}
			else if (vec.y < this.rect.h/1.5) {
				this.setPos(vec2(this.pos.x,this.rect.h/1.5));
			}
		}
	};
	
	Game.inherit(this, Racket, Rectangle, obj);
}
function BRacket(obj) {
	obj.size = size(10,60);
	obj.anchor = vec2(1,0.5);
	obj.fillColor = "#fff";
	
	var win = RJ.winSize();
	
	this.ball = Game.argDef(obj.ball,null);
	this.update = function (dt) {
		if (this.ball.pos.x > win.w/2) {			
			if (this.pos.y < this.ball.pos.y-5 || this.pos.y > this.ball.pos.y+5) {
				var pos = this.pos.clone();
				
				var acc = (this.ball.acceleration/1.5 <= 15) ? this.ball.acceleration/1.5 : 15;
				var dy = this.pos.y-this.ball.pos.y;
				pos.add(vec2(0,-dy/Math.abs(dy)*acc));
			
				this.setPos(pos);
			}
			
			if (this.pos.y > win.h-this.rect.h/1.5) {
				this.setPos(vec2(this.pos.x,win.h-this.rect.h/1.5));
			}
			else if (this.pos.y < this.rect.h/1.5) {
				this.setPos(vec2(this.pos.x,this.rect.h/1.5));
			}
		}
		
		if (!this.ball.running) {
			if (this.pos.y > win.h/2 + 2 || this.pos.y < win.h/2 - 2) {
				var pos = this.pos.clone();
			
				var dy = this.pos.y-win.h/2;
				pos.add(vec2(0,-dy/Math.abs(dy)*4));
			
				this.setPos(pos);
			}
		}
	}
	
	Game.inherit(this, Racket, Rectangle, obj);
}
function CustomText(obj) {
	obj.size = size(0,0);
	obj.lineWidth = 6;
	obj.strokeColor = "#fff";
	this.letterSize = size(20,30);
	this.render = function (ctx) {
		ctx.lineCap = "square";
		var string = new String(this.text);
		if (string.length > 0) {
			for (var i = 0; i < string.length; i++) {
				var num = string[i];
				
				ctx.beginPath();
				if (num == 0) {
					ctx.moveTo(i*(this.letterSize.w+10),0);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),0);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h);
					ctx.lineTo(i*(this.letterSize.w+10),this.letterSize.h);
					ctx.lineTo(i*(this.letterSize.w+10),0);
				}
				else  if (num == 1) {
					ctx.moveTo(this.letterSize.w+i*(this.letterSize.w+10),0);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h);
				}
				else  if (num == 2) {
					ctx.moveTo(i*(this.letterSize.w+10),0);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),0);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h/2);
					ctx.lineTo(i*(this.letterSize.w+10),this.letterSize.h/2);
					ctx.lineTo(i*(this.letterSize.w+10),this.letterSize.h);
 					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h);
				}
				else  if (num == 3) {
					ctx.moveTo(i*(this.letterSize.w+10),0);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),0);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h/2);
					ctx.lineTo(i*(this.letterSize.w+10)-3,this.letterSize.h/2);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h/2);
 					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h);
 					ctx.lineTo(i*(this.letterSize.w+10),this.letterSize.h);
				}
				else  if (num == 4) {
					ctx.moveTo(i*(this.letterSize.w+10),0);
					ctx.lineTo(i*(this.letterSize.w+10),this.letterSize.h/2);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h/2);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),0-3);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h);
				}
				else  if (num == 5) {
					ctx.moveTo(this.letterSize.w+i*(this.letterSize.w+10),0);
					ctx.lineTo(i*(this.letterSize.w+10),0);
					ctx.lineTo(i*(this.letterSize.w+10),this.letterSize.h/2);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h/2);
 					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h);
 					ctx.lineTo(i*(this.letterSize.w+10),this.letterSize.h);
				}
				else  if (num == 6) {
					ctx.moveTo(this.letterSize.w+i*(this.letterSize.w+10),0);
					ctx.lineTo(i*(this.letterSize.w+10),0);
					ctx.lineTo(i*(this.letterSize.w+10),this.letterSize.h/2);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h/2);
 					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h);
 					ctx.lineTo(i*(this.letterSize.w+10),this.letterSize.h);
 					ctx.lineTo(i*(this.letterSize.w+10),this.letterSize.h/2);
				}
				else  if (num == 7) {
					ctx.moveTo(i*(this.letterSize.w+10),0);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),0);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h);
				}
				else  if (num == 8) {
					ctx.moveTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h/2);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),0);
					ctx.lineTo(i*(this.letterSize.w+10),0);
					ctx.lineTo(i*(this.letterSize.w+10),this.letterSize.h/2);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h/2);
 					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h);
 					ctx.lineTo(i*(this.letterSize.w+10),this.letterSize.h);
 					ctx.lineTo(i*(this.letterSize.w+10),this.letterSize.h/2);
				}
				else  if (num == 9) {
					ctx.moveTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h/2);
					ctx.lineTo(i*(this.letterSize.w+10),this.letterSize.h/2);
					ctx.lineTo(i*(this.letterSize.w+10),0);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),0);
					ctx.lineTo(this.letterSize.w+i*(this.letterSize.w+10),this.letterSize.h);
					ctx.lineTo(i*(this.letterSize.w+10),this.letterSize.h);
				}
				ctx.stroke();
			}
			
			this.rect.w = string.length * 20 + string.length * 10;
		}
	}
	
	Game.inherit(this, CustomText, Text, obj);
}
function Score() {
	var obj = {};
	
	var self = this;
	var win = RJ.winSize();
	obj.pos = vec2(win.w/2,10);
	obj.anchor = vec2(0.5,0);
	obj.size = size(300,40);
	obj.name = "Score";
	
	this.pNum = new CustomText({
		text: "0",
		pos: vec2(0,0),
	});
	
	this.bNum = new CustomText({
		text: "0",
		pos: vec2(obj.size.w,0),
		anchor: vec2(1,0)
	});
	
	this.onEnter = function () {
		this.addChild(this.pNum);
		this.addChild(this.bNum);
	};
	
	this.scores = [0,0];
	this.addPScore = function () {
		this.scores[0]++;
		this.pNum.text = this.scores[0];
	};
	this.addBScore = function () {
		this.scores[1]++;
		this.bNum.text = this.scores[1];
	};
	
	Game.inherit(this, Score, GameObject, obj);
}