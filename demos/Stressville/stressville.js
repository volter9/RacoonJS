var SV = {}; SV.constructor = function SV() {};

(function () {
	function Decorations(obj) {
		obj = (obj) ? obj : {};
		obj.name = "";
		obj.pos = vecNull();
		obj.size = size(0,0);
		
		this.image = RJ.argDef(obj.image,null);
		this.mouseHandler = function (state,vec) {
			if (state == 'click') {
				vec.sub(this.parent.pos);
				for (var i = 0; i < this.nodes.length; i++) {
					var node = this.nodes[i];
					
					if (vec.x > node.pos.x && vec.y > node.pos.y &&
						vec.x < node.pos.x + node.size.w * 4 && vec.y < node.pos.y + node.size.h * 4) {
						if (this.player.pos.distance(node.pos.clone().add(vec2(node.size.w*2,node.size.h*2))) < 300 * 300) {
							node.call();
						}
					}
				}
			}
		};
		
		var self = this;
		this.onEnter = function () {
			// Restroom
			// Toilet
			this.add({
				name: "Toilet",
				pos: vec2(0,192),
				clip: vec2(0,0),
				size: size(16,32),
				used: 2,
				call: function () {
					if (this.used > 0) {
						self.player.stress += 10;
						this.used --;
					}
				}
			});
			
			// Sour
			this.add({
				name: "Sour",
				pos: vec2(64,192),
				clip: vec2(16,0),
				size: size(16,16),
				call: function () {
					
				}
			});
			
			// Shelf (restroom)
			this.add({
				name: "rShelf",
				pos: vec2(64,100),
				clip: vec2(16,32),
				size: size(16,16),
				open: 1,
				used: 1,
				call: function () {
					if (this.open > 0) {
						this.clip = vec2(128,0);
						this.open --;
					}
					else if (this.used > 0) {
						this.clip = vec2(64,0);
						self.player.stress -= 25;
						this.used --;
					}
				}
			});
			
			// Door
			this.add({
				name: "Door",
				pos: vec2(256,128),
				clip: vec2(32,0),
				size: size(16,32),
				call: function () {
					
				}
			});
			
			// Kitchen
			// Refrigerator
			this.add({
				name: "Refrigerator",
				pos: vec2(448,96),
				clip: vec2(48,0),
				size: size(16,48),
				open: 1,
				used: 1,
				call: function () {
					if (this.open > 0) {
						this.clip = vec2(144,0);
						this.open --;
					}
					else if (this.used > 0) {
						this.clip = vec2(112,0);
						self.player.stress += 25;
						this.used --;
					}
				}
			});
			
			// Upper shelves
			this.add({
				name: "Upper left shelf",
				pos: vec2(512,128),
				clip: vec2(0,32),
				size: size(16,16),
				open: 1,
				used: 1,
				call: function () {
					if (this.open > 0) {
						this.clip = vec2(128,16);
						this.open --;
					}
					else if (this.used > 0) {
						this.clip = vec2(32,32);
						self.player.suicide();
						this.used --;
					}
				}
			});
			this.add({
				name: "Upper middle shelf",
				pos: vec2(576,128),
				clip: vec2(16,16),
				size: size(16,16),
				open: 1,
				used: 1,
				call: function () {
					if (this.open > 0) {
						this.clip = vec2(128,32);
						this.open --;
					}
					else if (this.used > 0) {
						this.clip = vec2(32,32);
						self.player.suicide();
						this.used --;
					}
				},
			});
			this.add({
				name: "Upper right shelf",
				pos: vec2(640,128),
				clip: vec2(0,32),
				size: size(16,16),
				call: function () {
					
				}
			});
			
			// Lower shelves
			this.add({
				name: "Lower left shelf",
				pos: vec2(512,160),
				clip: vec2(0,48),
				size: size(16,32),
				call: function () {
					
				}
			});
			this.add({
				name: "Lower middle shelf",
				pos: vec2(576,160),
				clip: vec2(16,48),
				size: size(16,32),
				call: function () {
					
				}
			});
			this.add({
				name: "Lower right shelf",
				pos: vec2(640,160),
				clip: vec2(32,48),
				size: size(16,32),
				call: function () {
					
				}
			});
			
			// Living room
			this.add({
				name: "Bed",
				pos: vec2(768,192),
				clip: vec2(48,48),
				size: size(32,32),
				used: 3,
				call: function () {
					if (this.used > 0) {
						self.player.stress += 20;
						this.used --;
					}
				},
			});
			
			this.add({
				name: "Computer",
				pos: vec2(964,192),
				clip: vec2(80,0),
				size: size(32,32),
				used: 3,
				call: function () {
					if (this.used > 0) {
						var rand = Math.random() * 2;
						if (rand > 0.5) {
							self.player.stress += 20;
						}
						else {
							self.player.stress -= 10;
						}
						
						this.used --;
					}
				},
			});
			
			this.add({
				name: "Shelf",
				pos: vec2(1152,192),
				clip: vec2(80,48),
				size: size(32,32),
				call: function () {
					console.log('Hello, I\'m a Shelf');
				}
			});
			
			this.game.mouseHandler.addHandler(this);
		};
		
		this.nodeRender = function (node,ctx) {
			ctx.drawImage(this.image,node.clip.x,node.clip.y,
									 node.size.w,node.size.h,
									 node.pos.x,node.pos.y,
									 node.size.w*4,node.size.h*4);
		};
		
		RJ.inherit(this,Decorations,RJ.NodedElement,obj);
	}
	
	function Player(obj) {
		obj.size = size(64,128);
		
		this.timer = 10800;
		this.tilePos = function () {
			var pos = this.pos.clone().sub(vec2(0,256));
			pos.div(64);
			pos.x = pos.x >> 0;
			pos.y = pos.y >> 0;
			
			return pos;
		};
		
		// Utility functions
		this.stress = -10;
		this.maxStressed = -100;
		this.suicide = function (how) {
			console.log('suicide!!!');
			this.suicidic = true;
			
			this.method = (Math.random() * 2) >> 0;
		};
		this.suicidic = false;
		this.method = null;
		
		this.image = RJ.argDef(obj.image,null);
		this.onEnter = function () {
			this.index = 0;
			this.game.mouseHandler.addHandler(this);
			this.level = this.game.get('Level');
			this.pathFinder = new PathFinder(this.level.map);
		};
		
		// Mouse
		this.mouseHandler = function (state, vec) {
			if (state == 'click') {
				if (vec.y >= 256 && vec.y <= 448) {
					vec.sub(vec2(0,256));
					vec.sub(this.parent.pos);
					vec.div(64);
					
					vec.x = vec.x << 0;
					vec.y = vec.y << 0;
					
					if (vec.x < 0) {
						vec.x = 0;
					}
					else if(vec.x > 22) {
						vec.x = 22;
					}
					
					var playerTilePos = this.pos.clone().sub(vec2(0,256)).div(64);
					playerTilePos.x = playerTilePos.x << 0;
					playerTilePos.y = playerTilePos.y << 0;
					
					if (this.path == null && !playerTilePos.isEqual(vec)) {						
						this.path = this.pathFinder.findPath(playerTilePos,vec);
						if (this.path != undefined) {
							this.run = true;
						}
					}
				}
			}
		};
		
		this.path = null;
		this.org = vec2(0,256);
		this.renderAABB = function (ctx) {
			if (this.path) {
				for (var i = 0; i < this.path.length; i++) {
					var cell = this.path[i];
					
					ctx.fillStyle = "#0f0";
					ctx.fillRect(2+this.org.x+(64 * cell.x),2+this.org.y+(64 * cell.y),60,60);
				}
			}
		};
		
		this.update = function () {
			if (this.timer > 0) {
				this.timer -= 2;
				
				if ((this.timer % 600) < 4) {
					this.stress --;
				}
			}
			else {
				this.timer = 0;
				if (this.stress >= 0) {
					this.win();
				}
				else {
					this.suicide();
				}
			}
			
			if (this.stress > 100) {
				this.stress = 100;
			}
			
			if (this.suicidic) {
				if (this.path == null && !this.tilePos().isEqual(vec2(4,0))) {
					this.path = this.pathFinder.findPath(this.tilePos(),vec2(4,0));
					this.run = true;
				}
				else if (this.tilePos().isEqual(vec2(4,0))) {
					this.game.get('GUI').removeFromParent();
					this.parent.removeFromParent();
				}
			}
			
			if (this.stress < this.maxStressed + 1) {
				this.suicide();
			}
			
			
			
			if (this.path) {
				var destPos = {x:32+this.path[this.index].x*64,y:32+this.path[this.index].y*64};
				destPos.y += 256;
				
				if (this.pos.distance(destPos) > 2) {
					var angle = this.pos.angleT(destPos)-Math.PI;
					var vel = RJ.Vector.angleToVec(angle).scalar(2);
					
					this.setPos(this.pos.clone().add(vel));
				}
				else {
					this.index ++;
					if (this.index == this.path.length) {
						this.path = null;
						this.index = 0;
						this.run = false;
						this.ind = 0;
					}
				}
			}
			
			if (this.run) {
				this.time ++;
			}
			else {
				if (this.ind == 1) {
					this.time ++;
				}
				else {
					this.time += 0.08;
				}
			}
			
			if (this.time > this.dur) {
				if (this.run) {
					if (this.sin == 0) {
						this.ind = 3;
						this.sin ++;
					}
					else {
						this.ind = 2;
						this.sin --;
					}
				}
				else {
					if (this.sin == 0) {
						this.ind = 0;
						this.sin ++;
					}
					else {
						this.ind = 1;
						this.sin --;
					}
				}
				
				this.time = 0;
			}
			
			if (this.pos.x >= 320 && this.pos.x < 1154) {
				var pos = this.pos.clone().sub(vec2(320,0));
				pos.y = 0;
				
				if (pos.x > 1154) {
					pos.x = 1154;
				}
				
				this.parent.setPos(pos.clone().scalar(-1));
			}
		};
		
		this.ind = 0;
		this.time = 0;
		this.dur = 10;
		this.sin = 0;
		this.run = false;
		this.render = function (ctx) {
			ctx.drawImage(this.image,14*this.ind,0,14,32,4,0,56,128);
		};
		
		RJ.inherit(this,Player,RJ.GameObject,obj);
	}
	
	function Level(obj) {
		obj.crop = null;
		obj.size = size(640,480);
		obj.pos = vecNull();
		
		this.map = [];
		
		this.init = function () {
			for (var x = 0; x < 23; x++) {
				this.map[x] = [];
				for (var y = 0; y < 3; y++) {
					this.map[x][y] = 0;
				}
			}
		};
		
		this.onEnter = function () {
			this.init();
			this.map[0][0] = 1;
			this.map[1][0] = 1;
			this.map[2][0] = 1;
			this.map[2][1] = 1;
			
			this.map[7][0] = 1;
			this.map[8][0] = 1;
			this.map[9][0] = 1;
			this.map[10][0] = 1;
			
			this.map[6][0] = 1;
			this.map[6][1] = 1;
			
			this.map[11][0] = 1;
			this.map[11][1] = 1;
			this.map[12][0] = 1;
			this.map[13][0] = 1;
			this.map[15][0] = 1;
			this.map[16][0] = 1;
			this.map[15][1] = 1;
			this.map[16][1] = 1;
			this.map[18][0] = 1;
			this.map[19][0] = 1;
			
			this.map[20][0] = 1;
			this.map[20][1] = 1;
		};
		
		this.org = vec2(0,256);
		this.renderAABB = function (ctx) {
			for (var x = 0; x < 23; x++) {
				for (var y = 0; y < 3; y++) {
					var cell = this.map[x][y];
					if (cell == 1) {
						ctx.strokeStyle = "#00f";
					}
					else {
						ctx.strokeStyle = "#f00";
					}
					
					ctx.strokeRect(2+this.org.x+(64 * x),2+this.org.y+(64 * y),60,60);
				}
			}
		}
		
		this.render = function (ctx) {
			ctx.drawImage(this.image,0,0,1472,480);
		}
		
		RJ.inherit(this,Level,RJ.Image,obj);
	}
	
	function Timebar(obj) {
		this.player = null;
		this.onEnter = function () {
			this.player = this.game.get('Player');
		};
		
		this.render = function (ctx) {
			ctx.drawImage(this.image,0,8,23,8,0,0,92,32);
			
			var time = this.player.timer / 10800;
			ctx.drawImage(this.image,32,0,19*time,4,4,12,76*time,16);
			
			ctx.drawImage(this.image,0,24,27,8,96,0,108,32);
		};
		
		RJ.inherit(this,Timebar,RJ.Image,obj);
	}
	
	function Stressbar(obj) {
		this.player = null;
		this.onEnter = function () {
			this.player = this.game.get('Player');
		};
		
		this.render = function (ctx) {
			ctx.drawImage(this.image,0,0,23,8,0,0,92,32);
			
			var side = this.player.stress / 100;
			
			if (side >= 0) {
				ctx.drawImage(this.image,32,4,10*side,4,44 - 40 * side,4,40*side,16);
			}
			else {
				ctx.drawImage(this.image,41,4,11*Math.abs(side),4,40,4,44*Math.abs(side),16);
			}
			
			ctx.drawImage(this.image,0,16,43,8,96,0,172,32);
		};
		
		RJ.inherit(this,Stressbar,RJ.Image,obj);
	}
	
	function PathFinder(map) {
		this.map = [];
		
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
				
						var gScore = curNode.g + 1;
						
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
	
	SV.Decorations = Decorations;
	SV.Player = Player;
	SV.Level = Level;
	SV.PathFinder = PathFinder;
	SV.Stressbar = Stressbar;
	SV.Timebar = Timebar;
})();