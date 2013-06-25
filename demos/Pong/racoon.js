/*################################################################*\
#|	Product Name: RacoonJS, HTML5 Canvas Game Engine			  |#
#|	Author: Volter9 (mail: volter925@gmail.com)					  |#
#|	Version: v1.0												  |#
#|	Description: A game engine based on HTML5 Canvas technology,  |#
#|				 for creating interactive demos and games.		  |#
\*################################################################*/
/*
	The MIT License (MIT)

	Copyright (c) 2013 Volter9 (volter925@gmail.com)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

// RacoonJS Version
var racoonVersion = function () {return "v1.0";};

/*
*** ATTENTION: ***
	
	Comments for each of the function in this code are not standard.
	Please read passage bellow for full understanding of this format.
	
*** Title ***
	
	Title of the function/class/structure is written in following format:
	"<Name of function/class/structure>:"
	
*** Function, Type and Argument notation ***
	
	-* Functions *-
	Functions are written with "-" in front and then the name of function,
	like this: - or + clear [...]
	
	-* Arguments *-
	Arguments of a function are present in square brackets 
	and labeled with "var" keyword,	for example: [var x, var y]
	
	-* Types *-
	Types are written in format of Action Script, for example: 
	[var x:Number, var y:Number, var arr:Array]
	
	-* Object Notation *-
	Some of the constructors have only one argument; object with different properties,
	"*" (asterisk) is serve to mark property required, "$" (dollar) serve to be optional,
	after property's name following "=" and the type of property.
	The example notation of this function would be: 
	
	- some function [var obj {
		*color = Number,
		*target = Shuttle,
		$quantity = Number
	}]
	
	-* Description *-
	Description is reveal the purpose and usage of the function method,
	it's written like this: * Description: ...
	
	-* Returning *-
	Some methods are returning something, notation which shows return is following after 
	arguments, for example: - func [...] return nothing
	
	-* "Inheritance" *-
	In JS there's no actual inheritance, there's only prototyping.
	"Inheritance" notation would be: B < A (B inherit (take the prototype of) A)
	
*** Instance and "Class" Methods ***
	
	-* Instance Methods *-
	All of the functions which creating the object with specific structure
	are all have instance methods, they're written in the following format:
	- name of the function [var obj {
		*fillColor = String,
		#strokeColor = String
	}]
	
	-* "Class" Methods *-
	In JavaScript there's no classes, so the "Class" methods would be the functions
	that are called from the function name, for example: Vector.max(vec1,vec2)
	The notation of these methods would be: + method name [...]
	
*** PS: If this instruction is not clear written then I'm apologize for my knowledge
	of English language
*/

// Project's Tree:
/*
	- Vector (shortcut vec2):
		+ max
		+ min
		+ angleToVec
		
		- add
		- sub
		- mult
		- div
		
		- angleT
		- angleD
		- unit
		
		- dot
		- sum
		- scalar
		
		- rotate
		- clone
		
		- distance
		- magnitude
		
		- isEqual
		- round
		- isEmpty
	
	- size2vec
	- vecNull
	
	- Circle:
		- vecInside
		- cVSc
		- circleVSaabb
		
	- Size (shortcut size):
		- isNull
	
	- Rect:
		- setSizePos
		- clone
		- setFromRect
		- setRect
		- setPos
		- setSize
		- containVec
		- setMin
		- setMax
		- aabb
		- aabbToLine
	
	- linearGradient
	- radialGradient
	
	- Action:
		- animate
		
	- ScaleTo:
		- animate
		
	- AlphaTo:
		- animate
		
	- AlphaToWithCallback:
		- animate
		
	- Blink:
		- animate
	
	- GameObject:
		- addAction
		- deleteAction
		- deleteAllActions
		
		- setPos
		
		- init
		- onEnter
		- onExit
		
		- play
		- pause
		
		- refresh
		- update
		- updateChildren
		- animate
		
		- draw
		- render
		- renderChildren
		- renderAABB
		
		- addChild
		- removeByName
		- removeByIndex
		- removeFromParent
		- removeAllChildren
		- getChild
		- get
		- convertToNodeSpace
		- mouseHandler
		- keyboardHandler
		
	- Rectangle
	- Polygon
	- Oval
	- Line:
		- setP1
		- setP2
	- Text
	- Scene
	
	- KeyBoard
	- KeyBoardHandler:
		- addHandler
		- removeHandler
		- handle
	- MouseHandler:
		- addHandler
		- removeHandler
		- handle
		
	- Game:
		+ argDef
		+ super
		+ expand
		+ inherit
		
		- showFPS
		- hideFPS
		- setBackground
		- winSize
		- turnOnDebug
		- turnOffDebug
		- start
		- stop
		- addHandler
		- init
		- render
		- update
		- load
*/

// ################
// Basic structures
// ################

/* 
	<Vector> [var x:Number, var y:Number] return Vector
	* Description: vector function which creates vector object with
				   special methods and properties, also this object
				   represents point on the coordinate plane.
		
*/
function Vector(x,y) {
	// Properties
	this.x = x;
	this.y = y;
	/*
		- add [var vec:Vector] return this
		* Description: adds vec:Vector to current instance and return instance
	*/
	this.add = function (vec) {
		this.x += vec.x;
		this.y += vec.y;
		
		return this;
	};
	/*
		- sub [var vec:Vector] return this
		* Description: subtract vec:Vector from current instance and return instance
	*/
	this.sub = function (vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		
		return this;
	};
	/*
		- mult [var vec:Vector] return this
		* Description: multiply current instance by vec:Vector and return instance
	*/
	this.mult = function (vec) {
		this.x *= vec.x;
		this.y *= vec.y;
		
		return this;
	};
	/*
		- div [var num:Number] return this
		* Description: divide current instance by num:Number and return instance
	*/
	this.div = function (num) {
		this.x /= num;
		this.y /= num;
		
		return this;
	};
	/*
		- angleT [var vec:Vector] return Number
		* Description: aTan implementation of angle finding function,
					   return angle between instance and vec:Vector
	*/
	this.angleT = function (vec) {
		var delta = this.clone().sub(vec);
		var angle = Math.atan(delta.y/delta.x);
		
		if (delta.y >= 0 && delta.x < 0) {
			angle = Math.PI + angle;
		}
		else if (delta.y < 0 && delta.x < 0) {
 			angle = Math.PI + angle;
 		}
 		else if (delta.y < 0 && delta.x >= 0) {
 			angle = 2*Math.PI + (-Math.abs(angle));
 		}
 		
 		if (isNaN(angle)) {
 			angle = 0;
 		}
		
		return angle;
	};
	/*
		- angleD [var vec:Vector] return Number
		* Description: dot product implementation of angle finding function,
					   return angle between instance and vec:Vector
	*/
	this.angleD = function (vec) {
		var delta = this.sub(vec);
		var perp = vec2(1,0);
		
		var dot = delta.dot(perp);
		var prod = Math.sqrt(delta.magnitude()) * Math.sqrt(perp.magnitude());
		
		var angle = Math.acos(dot/prod);
		return angle;
	}
	/*
		- unit [] return Vector
		* Description: return unit vector of current instance
	*/
	this.unit = function () {
		var magnitude = this.magnitude();
		var x = (this.x > 0) ? Math.pow(this.x,2)/magnitude : -(Math.pow(this.x,2)/magnitude);
		var y = (this.y > 0) ? Math.pow(this.y,2)/magnitude : -(Math.pow(this.y,2)/magnitude);
		
		return vec2(x,y);
	};
	/* 
		- dot [var vec:Vector] return Number
		* Description: returns dot product between current instance and 
		  vec:Vector
	*/
	this.dot = function (vec) {
		return this.x*vec.x + this.y*vec.y;
	};
	/*
		- sum [] return sum:Number
		* Description: return the sum between x and y of instance
	*/
	this.sum = function () {
		return this.x + this.y;
	};
	/*
		- scalar [var num:Number] return this
		* Description: multiply x and y of current instance by num:Number
					   and then return it
	*/
	this.scalar = function (num) {
		this.x *= num;
		this.y *= num;
		
		return this;
	};
	/*
		- rotate [var rad:Number] return Vector
		* Description: rotating the current instance by rad:Number (in radians or PIs),
					   and then return new rotated vector
	*/
	this.rotate = function (rad) {
		var x = this.x;
		var y = this.y;
		var newX,newY;
		
		with (Math) {
			newX = x*cos(rad) - y*sin(rad);
			newY = x*sin(rad) + y*cos(rad); 
		}
		
		return vec2(newX,newY);
	};
	/*
		- clone [] return Vector
		* Description: cloning the current instance
	*/
	this.clone = function () {
		return vec2(this.x,this.y);
	};
	/*
		- distance [var vec:Vector] return Number
		* Description: return distance between instance and vec:Vector in squared terms
			           (for optimization purposes)
	*/
	this.distance = function (vec) {
		return Math.pow(this.x - vec.x,2) + Math.pow(this.y - vec.y,2);
	};
	/*
		- magnitude [] return Number
		* Description: return distance between instance and vec2(0,0) in squared terms
			           (for optimization purposes)
	*/
	this.magnitude = function () {
		return this.distance(vecNull());
	};
	/*
		- isEqual [var vec:Vector] return Boolean
		* Description: check if instance is equal to vec:Vector
	*/
	this.isEqual = function(vec) {
		return (this.x == vec.x && this.y == vec.y) ? true : false;
	};
	/*
		- round [] return this
		* Description: rounding to whole nearest number vecotr's x and y
	*/
	this.round = function () {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		
		return this;
	};
	/*
		isEmpty [var s:Size] return Boolean
		* Description: creates vector from s:Size given
	*/
	this.isEmpty = function () {
		return (this.x == 0 && this.y == 0) ? true : false;
	}
}

/*
	+ max [var vec1:Vector, var vec2:Vector] return Vector
	* Description: finding max. vector
*/
Vector.max = function (vec1,vec2) {
	return (vec1.sum() >= vec2.sum()) ? vec1 : vec2;
};
/*
	+ min [var vec1:Vector, var vec2:Vector] return Vector
	* Description: finding min. vector
*/
Vector.min = function (vec1,vec2) {
	return (vec1.sum() < vec2.sum()) ? vec1 : vec2;	
};
/*
	+ angleToVec [var rad:Number] return Vector
	* Description: returning direction vector 
*/
Vector.angleToVec = function (rad) {
	var vec = vecNull();
	
	vec.x = Math.cos(rad);
	vec.y = Math.sin(rad);
	
	return vec;
};

/*
	vec2 [var x:Number,var y:Number] return Vector
	* Description: shortcut for "new Vector(x,y)"
*/
function vec2(x,y) {return new Vector(x,y);}
/*
	size2vec [var s:Size] return Vector
	* Description: creates vector from s:Size given
*/
function size2vec(s) {return new Vector(s.w,s.h);}
/*
	vecNull [] return Vector
	* Description: creates empty vector
*/
function vecNull() {return new Vector(0,0);}

/*
	<Circle> [var vec:Vector, var rad:Number] return Circle
	* Description: circle structure which has some geometry utility methods
				   for collision.
*/
function Circle(vec,rad) {
	// Properties
	this.pos = vec;
	this.radii = rad;
	/*
		- vecInside [var vec:Vector] return Boolean
		* Description: this method check if the vector (point) is inside circle
	*/
	this.vecInside = function(vec) {
		var dist = this.pos.clone().distance(vec);
		
		return (dist < Math.pow(this.radii,2));
	}
	/*
		- cVSc [var circ:Circle] return Boolean
		* Description: check for collision (intersection) between this and circ:Circle circles
	*/
	this.cVSc = function (circ) {
		var dist = this.pos.clone().distance(circ.pos);
		
		return (dist < Math.pow(this.radii+circ.radii,2));
	};
	/*
		- circleVSaabb [var rect:Rect] return Boolean
		* Description: check for collision (intersection) between this circle and rect:Rect
					   rectangle
	*/
	this.circleVSaabb = function (rect) {
		var points = [rect.max, rect.min,
					  rect.max.clone().sub(vec2(rect.w,0)),rect.max.clone().sub(vec2(0,rect.h))];
		var closestPoint = null;
		
		var minLength = Math.pow(1000,2);
		for (var i = 0; i < points.length; i++) {
			if (minLength > points[i].distance(this.pos)) {
				minLength = points[i].distance(this.pos);
				closestPoint = points[i];
			}
		}			  
				
		return (minLength < Math.pow(this.radii,2));
	}
}

/*
	<Size> [var w:Number, var h:Number] return Size
	* Description: size structure, consist of width and height 
*/
function Size(w,h) {
	// properties
	this.w = w;
	this.h = h;
	/*
		- isNull [] return Boolean
		* Description: check for empty bool
	*/
	this.isNull = function () {
		return (w == 0 && h == 0) ? true : false;
	};
}
/*
	size [var w:Number, var h:Number] return Size
	* Description: shortcut for new Size(width,height)
*/
function size(w,h) {return new Size(w,h);}

/*
	<Rect> [var x:Number, var y:Number, var w:Number, var h:Number] return Rect
	* Description: Rect constructor, creates a rect instance which can handle collisions between
				   rect or line.
*/
function Rect(x,y,w,h) {
	// Properties
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.min = vec2(x,y);
	this.max = vec2(x+w,y+h);
	/*
		- setSizePos [var x:Number, var y:Number, var s:Size] return nothing
		* Description: change the position and size of rectangle
	*/
	this.setSizePos = function (x,y,s) {
		this.setPos(x,y);
		this.setSize(s);
	};
	/*
		- clone [] return Rect
		* Description: clone instance rect and return it
	*/
	this.clone = function () {
		return new Rect(this.x,this.y,this.w,this.h);
	};
	/*
		- setFromRect [var rect:Rect] return nothing
		* Description: copy attributes from another rect
	*/
	this.setFromRect = function (rect) {
		this.x = rect.x;
		this.y = rect.y;
		this.w = rect.w;
		this.h = rect.h;
		this.min = rect.min;
		this.max = rect.max;
	};
	/*
		- setRect [var p1:Vector, var p2:Vector] return nothing
		* Description: setting rectangle from two points
	*/
	this.setRect = function (p1,p2) {
		var min = vec2(Math.min(p1.x,p2.x),Math.min(p1.y,p2.y));
		var max = vec2(Math.max(p1.x,p2.x),Math.max(p1.y,p2.y));
		var wid = max.x - min.x;
		var hei = max.y - min.y;
		var x = min.x;
		var y = min.y;
		
		this.x = x;
		this.y = y;
		this.w = wid;
		this.h = hei;
		this.min = min;
		this.max = max;
	};
	/*
		- setPos [var x:Number, var y:Number] return nothing
		* Description: setting position of rectangle
	*/
	this.setPos = function(x,y) {
		this.x = x;
		this.y = y;
		this.min = vec2(x,y);
		this.max = vec2(x+this.w,y+this.h);
	};
	/*
		- setSize [var s:Size] return nothing
		* Description: set size of rectangle
	*/
	this.setSize = function (s) {
		if (!s.isNull()) {
			this.w = Math.abs(s.w);
			this.h = Math.abs(s.h);
			this.setPos(this.x,this.y);
		}
	}
	/*
		- containVec [var vec:Vector] return Boolean
		* Description: return true if vector inside of the box
	*/
	this.containVec = function (vec) {
		if (vec.x < this.max.x && vec.y < this.max.y &&
			vec.x > this.min.x && vec.y > this.min.y ) {
			return true;
		}
		return false;
	};
	/*
		- setMin [var vec:Vector] return this
		* Description: setting min. point of current rectangle
	*/
	this.setMin = function (vec) {
		this.min = vec;
		this.x = vec.x;
		this.y = vec.y;
		this.w = this.max.x - this.min.x;
		this.h = this.max.y - this.min.y;
		
		return this;
	};
	/*
		- setMax [var vec:Vector] return this
		* Description: setting max. point of current rectangle
	*/
	this.setMax = function (vec) {
		this.max = vec;
		this.w = this.max.x - this.min.x;
		this.h = this.max.y - this.min.y;
		
		return this;
	};
	/*
		- aabb [var rect:Rect] return Boolean
		* Description: checks if those two: current and rect:Rect touching each other
	*/
	this.aabb = function (rect) {
		if (this.min.x < rect.max.x && this.min.y < rect.max.y &&
			this.max.x > rect.min.x && this.max.y > rect.min.y) {
			return true;
		}
		
		return false;
	}
	/*
		- aabbToLine [var line {
			*p1 = Vector;
			*p2 = Vector;
		}] return Boolean
		* Description: implementation of Liang-Barsky (http://en.wikipedia.org/wiki/Liang-Barsky)
					   algorithm for line intersection inside of rectangle, which checks if line inside of rectangle
	*/
	this.aabbToLine = function (line) {
		var t0 = 0,t1 = 1;
		var dx = line.p2.x - line.p1.x,dy = line.p2.y - line.p1.y;
		var p, q, r;
	
		for (edge = 0; edge < 4; edge++) {
			if (edge == 0) {
				p = -dx;
				q = -(this.min.x - line.p1.x);
			}
			if (edge == 1) {
				p = dx;
				q = this.max.x - line.p1.x;
			}
			if (edge == 2) {
				p = -dy;
				q = -(this.min.y - line.p1.y);
			}
			if (edge == 3) {
				p = dy;
				q = this.max.y - line.p1.y;
			}
			r = q / p;
	
			if (p == 0 && q < 0) return false;
	
			if (p < 0) {
				if (r > t1) {
					return false;
				} 
				else if (r > t0) {
					t0 = r;
				}
			} else if (p > 0) {
				if (r < t0) {
					return false;
				} 
				else if (r < t1) {
					t1 = r;
				}
			}
		}
		
		return true;
	}
}

// #########
// Gradients
// #########

/*
	linearGradient [var p1:Vector, var p2:Vector, var points:Array] return CanvasGradient
	* Description: creates linear gradient from points given and array of colors
				   example of usage: linearGradient(vec2(0,0),vec2(20,20),[0,"#fff",1,"#000"])
*/
function linearGradient(p1,p2,points) {
	var gradient = RJ.ctx.createLinearGradient(p1.x,p1.y,p2.x,p2.y);
	
	if (points.length/2 == Math.floor(points.length/2)) {
		for (var i = 0; i < points.length; i++) {
			var per = points[i];
			i++;
			var color = points[i];
			gradient.addColorStop(per,color);
		}
	}
	
	return gradient;
}
/*
	radialGradient [var circ1:Circle, var circ2:Circle, var points:Array] return CanvasGradient
	* Description: creates radial gradient from circles given and array of colors
				   example of usage: radialGradient(new Circle(vec2(0,0),20),new Circle(vec2(20,20),40),[0,"#fff",1,"#000"])
*/
function radialGradient(circ1,circ2,points) {
	var gradient = RJ.ctx.createRadialGradient(circ1.pos.x,circ1.pos.y,circ1.radii,
											   circ2.pos.x,circ2.pos.y,circ2.radii);
	
	if (points.length/2 == Math.floor(points.length/2)) {
		for (var i = 0; i < points.length; i++) {
			var per = points[i];
			i++;
			var color = points[i];
			gradient.addColorStop(per,color);
		}
	}
	
	return gradient;
}

// #######
// Actions
// #######

/*
	<Action> [var duration:Number] return Action
	* Description: "Abstract" "class" of Action in 
*/
function Action(dur) {
	// Propeties
	this.duration = dur;
	this.counter = 0;
	this.owner = null;
	this.index = 0;
	/*
		- animate [var dt:Number] return nothing
		* Description: method updates the action
	*/
	this.animate = function (dt) {
		// Override in subclasses
	};
}
/*
	<ScaleTo> [var dur:Number, var siz:Size] return ScaleTo < Action
	* Description: Scale object to siz:Size
*/
function ScaleTo(dur,siz) {
	// Properties
	this.size = siz;
	this.initSize = size(0,0);
	// Already saw the definition
	this.animate = function (dt) {
		dt = 1/RJ.rate;
		if (this.initSize.isNull()) {
			this.initSize = size(this.owner.scale.w,this.owner.scale.h);
		}
		
		this.counter+=dt;
		var delta = size((this.size.w-this.initSize.w)/this.duration/RJ.rate,
							 (this.size.h-this.initSize.h)/this.duration/RJ.rate);
		
		if (this.counter > this.duration) {
			this.owner.scale = this.size;
			this.owner.deleteAction(this.index);
		}
		else {		
			this.owner.scale.w += delta.w;
			this.owner.scale.h += delta.h;
		}
	}
	
	this.__proto__ = new Action(dur);
	this.__proto__.constructor = ScaleTo;
}
/*
	<AlphaTo> [var dur:Number, var alpha:Number] return AlphaTo < Action
	* Description: Changing object's opacity to alpha:Number
*/
function AlphaTo(dur,alpha) {
	// Properties
	this.alpha = alpha;
	this.initAlpha = 0;
	// ...
	this.animate = function (dt) {
		dt /= new Game().rate;
		if (this.initAlpha == 0) {
			this.initAlpha = this.owner.opacity;
		}
		
		this.counter+=dt;
		var delta = (this.alpha-this.initAlpha)/this.duration/new Game().rate;
		
		if (this.counter > this.duration) {
			this.owner.opacity = this.alpha;
			this.owner.deleteAction(this.index);
		}
		else {
			this.owner.opacity += delta;
		}
	}
	
	this.__proto__ = new Action(dur);
	this.__proto__.constructor = AlphaTo;
}
/*
	<AlphaToWithCallback> [var dur:Number, var alpha:Number, var t:Function] return AlphaToWithCallback < Action
	* Description: Changing object's opacity to alpha:Number and when it finished, call t:Function
*/
function AlphaToWithCallback(dur,alpha,t) {
	// Properties
	this.alpha = alpha;
	this.initAlpha = 0;
	this.target = t;
	// ...
	this.animate = function (dt) {
		dt /= new Game().rate;
		if (this.initAlpha == 0) {
			this.initAlpha = this.owner.opacity;
		}
		
		this.counter+=dt;
		var delta = (this.alpha-this.initAlpha)/this.duration/new Game().rate;
		
		if (this.counter > this.duration) {
			this.owner.opacity = this.alpha;
			this.owner.deleteAction(this.index);
			this.target();
		}
		else {
			this.owner.opacity += delta;
		}
	}
	
	this.__proto__ = new Action(dur);
	this.__proto__.constructor = AlphaToWithCallback;
}
/*
	<Blink> [var dur:Number, var alpha:Number, var t:Function] return Blink < Action
	* Description: Make object blinking (changes every 5 frames opacity from 1 to 0 and back to 1 and then 0
*/
function Blink() {
	this.counter = 0;
	this.delay = 15;
	// ...
	this.animate = function (dt) {
		this.counter++;
		
		if (this.counter >= this.delay) {
			if (this.owner.opacity == 1) {
				this.owner.opacity = 0;
			}
			else {
				this.owner.opacity = 1;
			}
			
			this.counter = 0;
		}
	};
	
	this.__proto__ = new Action(0);
	this.__proto__.constructor = Blink;
}
/*
	<RotateTo> [var dur:Number, var alpha:Number, var t:Function] return RotateTo < Action
	* Description: Animate Rotation
*/
function RotateTo(dur,angle) {
	this.counter = 0;
	this.angle = angle;
	this.initAngle = 0;
	// ...
	this.animate = function (dt) {
		dt = 1/RJ.rate;
		
		this.counter+= dt;
		if (this.initAngle == 0 && this.owner.angle != 0) {
			this.initAngle = this.owner.angle % (Math.PI*2);
		}
		
		var delta;
		if (this.initAngle < Math.PI) {
			delta = (this.angle-this.initAngle)/this.duration/RJ.rate;
		}
		else {
			delta = ((Math.PI*2)-this.initAngle)/this.duration/RJ.rate;			
		}
		
		if (this.counter > this.duration) {
			this.owner.angle = this.angle;
			this.owner.deleteAction(this.index);
		}
		else {
			this.owner.angle += delta;
		}
	};
	
	this.__proto__ = new Action(dur);
	this.__proto__.constructor = RotateTo;
}

// ###########
// Game Object
// ###########

/*
	<GameObject> [var obj {
		*pos = Vector,
		*size = Size,
		*fillColor = String (hex color),
		*strokeColor = String (hex color),
		$angle = Number (radians),
		$opacity = Number (0.0 to 1.0),
		$lineWidth = Number,
		$scale = Size,
		$anchor = Vector,
		$init = Function,
		$enter = Function,
		$exit = Function,
		$update = Function,
		$render = Function,
		$debugColor = String (hex color)
		*name = String,
		*nameless = Boolean, (only if you want it nameless)
		$mouseHandler = Function,
		$keyboardHandler = Function
	}] return GameObject
	* Description: Creating GameObject the most important object in this game engine.
				   It's basis of every game object in the game. 
*/
function GameObject(obj) {
	// Properties
	// ------------------
	// Default Properties
	if (!obj.pos) {
		obj.pos = vecNull();
	}
	if (!obj.size) {
		obj.size = size(10,10)
	}
	if (!obj.fillColor) {
		obj.fillColor = "#000";
	}
	if (!obj.strokeColor) {
		obj.strokeColor = "#fff";
	}
	
	if (obj.anchor) {
		obj.anchor.x = (obj.anchor.x > 1) ? 1 : ((obj.anchor.x < 0) ? 0 : obj.anchor.x);
		obj.anchor.y = (obj.anchor.y > 1) ? 1 : ((obj.anchor.y < 0) ? 0 : obj.anchor.y);
	}
	
	this.ctx = null;
	this.parent = null;
	// Actions
	this.actions = [];
	/*
		- addAction [var act:Action] return nothing
		* Description: adds action to array of actions and after entering 
					   "animate" it.
	*/
	this.addAction = function (act) {
		act.owner = this;
		act.index = this.actions.length;
		this.actions[this.actions.length] = act;
	}
	/*
		- deleteAction [var ind:Number] return nothing
		* Description: delete action on index ind:Number from this game object
	*/
	this.deleteAction = function (ind) {
		this.actions.splice(ind,1);
		
		for (var i = 0; i < this.actions.length; i++) {
			this.actions[i].index = i;
		}
	};
	/*
		- deleteAllActions [] return nothing
		* Description: delete all actions in this game object
	*/
	this.deleteAllActions = function () {
		if (this.actions.length != 0) {
			this.actions = [];
		}
	};
	// Ctx properties
	this.pColor = obj.fillColor;
	this.sColor = obj.strokeColor;
	this.angle = Game.argDef(obj.angle,0);
	this.opacity = Game.argDef(obj.alpha,1);
	this.lWidth = Game.argDef(obj.lineWidth,2);
	this.scale = (obj.scale && !obj.scale.isNull()) ? obj.scale : size(1,1);
	// Position and BB
	this.pos = obj.pos;
	this.anchor = Game.argDef(obj.anchor,vec2(0,0));
	this.rect = (this.anchor.isEmpty()) ? new Rect(obj.pos.x,obj.pos.y,obj.size.w,obj.size.h) : new Rect(obj.pos.x-(this.anchor.x * obj.size.w),obj.pos.y-(this.anchor.y * obj.size.h),obj.size.w,obj.size.h);
	/*
		- setPos [var vec:Vector] return nothing
		* Description: setting the position of game object
	*/
	this.setPos = function (vec) {
		this.pos = vec2(vec.x,vec.y);
		this.rect.setPos(vec.x-(this.anchor.x * (this.rect.w)),vec.y-(this.anchor.y * (this.rect.h)));
	};
	// Initialization
	/*
		- init [] return nothing
		* Description: it's doing initialization for custom game objects
	*/
	this.init = Game.argDef(obj.init,function () {
		
	});
	// Enter/Exit Triggers
	/*
		- onEnter [] return nothing
		* Description: fires when entering (when it added to another running object)
	*/
	this.onEnter = Game.argDef(obj.enter,function () {
		// Implement in subclasses
	});
	/*
		- onExit [] return nothing
		* Description: fires when exiting (when it deleted from another running object)
	*/
	this.onExit = Game.argDef(obj.exit,function () {
		// Implement in subclasses
	});
	// Pause/Play
	this.running = true;
	this.visible = true;
	/*
		- play [] return nothing
		* Description: if object isn't running then it's play it's update function
	*/
	this.play = function () {
		this.running = true;
	};
	/*
		- pause [] return nothing
		* Description: if object is running then it's pause it's update function
	*/
	this.pause = function () {
		this.running = false;
	};
	// Update method
	/*
		- refresh [var dt:Number] return nothing
		* Description: update the game object and its children
	*/
	this.refresh = function (dt) {
		if (this.running && this.visible) {
			this.update(dt);
			this.updateChildren(dt);
		}
	};
	/*
		- update [var dt:Number] return nothing
		* Description: here you update custom properties, like collision, movement and etc.
	*/
	this.update = (obj.update) ? obj.update : function (dt) {
		// Override in subclass
	};
	/*
		- updateChildren [] return nothing
		* Description: updates game object's children
	*/
	this.updateChildren = function (dt) {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].refresh(dt);
		}
		this.animate(dt);
	};
	/*
		- animate [] return nothing
		* Description: delete all actions in this game object
	*/
	this.animate = function (dt) {
		if (this.actions.length != 0) {
			for (var i = 0; i < this.actions.length; i++) {
				this.actions[i].animate(dt);
			}
		}	
	};
	// Rendering
	/*
		- draw [var ctx:CanvasRenderingContext2D] return nothing
		* Description: setting some properties and rendering game object and its children
	*/
	this.draw = function (ctx) {
		if (this.visible) {
			ctx.save();
			ctx.translate(this.pos.x,this.pos.y);
			ctx.rotate(this.angle);
			ctx.scale(this.scale.w,this.scale.h);
			ctx.globalAlpha = this.opacity;
			ctx.lineWidth = this.lWidth;
			ctx.fillStyle = this.pColor;
			ctx.strokeStyle = this.sColor;
			
			ctx.translate(-this.rect.w*this.anchor.x,
						  -this.rect.h*this.anchor.y)
			this.render(ctx);
			this.renderChildren(ctx);
			
			ctx.restore();
		}
	}
	/*
		- render [var ctx:CanvasRenderingContext2D] return nothing
		* Description: custom render
	*/
	this.render = Game.argDef(obj.render,function (ctx) {
		// Override in subclass
	});
	/*
		- renderChildren [var ctx:CanvasRenderingContext2D] return nothing
		* Description: rendering game object's children
	*/
	this.renderChildren = function (ctx) {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].draw(ctx);
			if (new Game().debug) {
				this.children[i].renderAABB(ctx);
			}
		}
	};
	// Debug
	this.debugColor = Game.argDef(obj.debugColor,"#0f0");
	/*
		- renderAABB [var ctx:CanvasRenderingContext2D] return nothing
		* Description: rendering debug information as AABB and name of object
	*/
	this.renderAABB = function (ctx) {
		ctx.lineWidth = 2;
		ctx.strokeStyle = this.debugColor;
		ctx.strokeRect(this.rect.x,this.rect.y,
					   this.rect.w,this.rect.h);
		ctx.strokeStyle = "#f00";
		ctx.lineWidth = 1;
		ctx.strokeRect(this.pos.x-2,this.pos.y-2,4,4);
		
		if (this.name.length > 0) {
			ctx.font = "10px Arial";
			ctx.textBaseline = "bottom";
			ctx.textAligb = "left";
			ctx.fillStyle = "#fff";
			
			ctx.fillText(this.name,this.pos.x+5,this.pos.y+5);
		}
	};
	// Children and children management
	this.nameless = (obj.nameless == true) ? true : false;
	this.name = (obj.name && !this.nameless) ? obj.name : "";
	this.children = [];
	this.childrenName = {};
	this.index = -1;
	/*
		- addChild [var obj:GameObject] return nothing
		* Description: add obj in children of this game object
	*/
	this.addChild = function (obj) {
		// Please don't override
		if (obj instanceof GameObject) {
			obj.index = this.children.length;
			
			this.children[this.children.length] = obj;
			this.children[this.children.length-1].parent = this;
			this.children[this.children.length-1].ctx = this.ctx;
			
			if ((this.childrenName[obj.name] == null ||
				this.childrenName[obj.name] == undefined) &&
				!RJ.isReservedName(obj.name) && !obj.nameless) {
				
				if (this.children[this.children.length-1].name.length == 0) {
					this.children[this.children.length-1].name = "name-"+new Game().increaseCounter();
				}
				this.childrenName[obj.name] = obj;
				
				new Game().reserveName(obj.name);
				new Game().registerObject(obj);
			}
			else if(RJ.isReservedName(obj.name)) {
				throw new Error('name "'+obj.name+'" is already reserved, please change name of this object!');
				return;
			}
			
			this.children[this.children.length-1].onEnter();
		}
	};
	/*
		- removeByName [var name:String] return nothing
		* Description: finding game object in children with name "name:String"
					   and deleting it
	*/
	this.removeByName = function (name) {
		if (name.length != 0) {
			var child = this.childrenName[name];
			
			delete this.children[child.index];
			
			this.children.splice(child.index,1);
			
			for (var i = 0; i < this.children.length; i++) {
				this.children[i].index = i;
			}
			
			if (!child.nameless) {
				new Game().remove(child.name);
				new Game().removeReservedName(child.name);
			}
		}
	};
	/*
		- removeByIndex [var ind:Number] return nothing
		* Description: deleting object by index inside of this game object
	*/
	this.removeByIndex = function (ind) {
		if (this.children[ind] != null || this.children[ind] != undefined) {
			this.children[ind].onExit();
			
			if (!this.children[ind].nameless) {
				new Game().remove(this.children[ind].name);
				new Game().removeReservedName(this.children[ind].name);
			}
			
			if (this.children[ind].children != 0) {
				this.children[ind].removeAllChildren();
			}
			
			delete this.childrenName[this.children[ind].name];
			delete this.children[ind];
			
			this.children.splice(ind,1);
			
			for (var i = 0; i < this.children.length; i++) {
				this.children[i].index = i;
			}
		}
	};
	/*
		- removeFromParent [] return nothing
		* Description: removing this object from parent (each object has parent)
	*/
	this.removeFromParent = function () {
		this.parent.removeByIndex(this.index);
	};
	/*
		- removeAllChildren [] return nothing
		* Description: removing all children from this game object
	*/
	this.removeAllChildren = function () {
		if (this.children.length != 0) {
			while (this.children[0] != undefined) {
				this.removeByIndex(0);
			}
		}
	};
	/*
		- getChild [var ind:Number] return GameObject
		* Description: get children on index ind:Number
	*/
	this.getChild = function (ind) {
		if (this.children[ind] != null) {
			return this.children[ind];
		}
	};
	/*
		- get [var name:String] return GameObject
		* Description: get children by name in this game object
	*/
	this.get = function (name) {
		if (this.childrenName[name] != null) {
			return this.childrenName[name];
		}
	};
	/*
		- convertToNodeSpace [var vec:Vector] return Vector
		* Description: converting vec:Vector to local space
	*/
	this.convertToNodeSpace = function (vec) {
		var retVec = vec.clone();
		retVec.sub(this.pos);
		return retVec;
	};
	// Mouse
	/*
		- mouseHandler [var state:String, var vec:Vector] return nothing
		* Description: handle mouse events: onclick, onmousedown and onmousemove
	*/
	this.mouseHandler = Game.argDef(obj.mouseHandler,function (state,vec) {
		// Override in subclasses
	});
	// Keyboard
	/*
		- keyboardHandler [var state:String, var key:Number] return nothing
		* Description: handle keyboard events: onkeydown and onkeyup
	*/
	this.keyboardHandler = Game.argDef(obj.keyboardHandler,function (state,key) {
		// Override in subclasses
	});
	
	this.init();
}

// ############
// BASIC Shapes
// ############

/*
	<Rectangle> [var obj {
		... (look at <GameObject>),
	}] return Rectangle < GameObject
	* Description: Rectangle shape, "inherit" from GameObject
*/
function Rectangle(obj) {
	// ...
	this.render = function (ctx) {
		ctx.fillRect(0,0,this.rect.w,this.rect.h);
		ctx.strokeRect(0,0,this.rect.w,this.rect.h);
	};
	
	Game.inherit(this,Rectangle,GameObject,obj);
}
/*
	<Polygon> [var obj {
		... (look at <GameObject>),
		*sides = Number,
		*radii = Vector,
	}] return Polygon < GameObject
	* Description: Polygon shape, "inherit" from GameObject
*/
function Polygon(obj) {
	this.sides = (obj.sides && obj.sides >= 3) ? obj.sides : 3;
	this.radii = (obj.radii) ? obj.radii : vec2(10,10);
	var points = [];
	obj.size = size(this.radii.x*2,this.radii.y*2);
	
	this.onEnter = function () {
		for (var i = 0; i < this.sides; i++) {
			var angle = (i/this.sides) * (Math.PI*2) - Math.PI/2;
			points[i] = vec2(Math.cos(angle),Math.sin(angle)).mult(this.radii).add(vec2(this.radii.x,this.radii.y))
		}
	};
	
	this.render = function (ctx) {
		ctx.beginPath();
		var angle = -Math.PI/2;
		
		for (var i = 0; i < this.sides; i++) {
			var point = points[i];
			
			if (i == 0) {
				ctx.moveTo(point.x,point.y);
			}
			else {
				ctx.lineTo(point.x,point.y);
			}
			
			angle += Math.PI*2/this.sides;
		}
		
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	};
	
	Game.inherit(this,Polygon,GameObject,obj);
}
/*
	<Oval> [var obj {
		... (look at <GameObject>),
		*radii = Number,
	}] return Oval < GameObject
	* Description: Oval (Circle) shape, "inherit" from GameObject
*/
function Oval(obj) {
	this.radii = (obj.radii) ? obj.radii : 10;
	obj.size = size(this.radii*2,this.radii*2);
	
	this.render = function (ctx) {
		ctx.beginPath();
		
		ctx.arc(this.radii, this.radii, this.radii, 0, Math.PI*2, true);
		
		ctx.fill();
		ctx.stroke();
	};
	
	Game.inherit(this, Oval, GameObject, obj);
}
/*
	<Line> [var obj {
		... (look at <GameObject>),
		*p1 = Vector,
		*p2 = Vector
	}] return Line < GameObject
	* Description: Line shape, drawing from p1:Vector to p2:Vector, "inherit" from GameObject
*/
function Line(obj) {
	this.p1 = obj.p1 ? obj.p1 : vecNull();
	this.p2 = obj.p2 ? obj.p2 : vecNull();
	
	/*
		- setP1 [var vec:Vector] return nothing
		* Description: setting first point
	*/
	this.setP1 = function (vec) {
		var dX = this.p2.x-vec.x;
		var dY = this.p2.y-vec.y

		this.rect.x = vec.x;
		this.rect.y = vec.y;
		
		this.rect.w = dX;
		this.rect.h = dY;
		this.p1 = vec;
	};
	/*
		- setP2 [var vec:Vector] return nothing
		* Description: setting second point
	*/
	this.setP2 = function (vec) {
		var dX = this.p1.x-vec.x;
		var dY = this.p1.y-vec.y

		this.rect.x = vec.x;
		this.rect.y = vec.y;
		
		this.rect.w = dX;
		this.rect.h = dY;
		this.p2 = vec;
	};
	this.render = function (ctx) {
		ctx.strokeStyle = this.pColor;
		ctx.lineWidth = 2;
		ctx.lineCap = "round";
		ctx.beginPath();
		
		ctx.moveTo(this.p1.x,this.p1.y);
		ctx.lineTo(this.p2.x,this.p2.y);
		
		ctx.stroke();
	};
	
	Game.inherit(this,Line,GameObject,obj);
}
/*
	<Text> [var obj {
		... (look at <GameObject>),
		*font = String,
		*fontSize = Number,
		*text = String,
		$textAlign = String,
	}] return Text < GameObject
	* Description: Text object, drawing text, "inherit" from GameObject
*/
function Text(obj) {
	this.font = (obj.font) ? obj.font : "Arial";
	this.fontSize = (obj.fontSize) ? obj.fontSize : 14;
	this.text = (obj.text) ? obj.text : "";
	this.textAlign = Game.argDef(obj.align,"left");
	
	RJ.ctx.font = this.fontSize+"px "+this.font;
	
	obj.size = size(RJ.ctx.measureText(this.text).width, this.fontSize);
	
	this.render = function (ctx) {
		ctx.font = this.fontSize+"px "+this.font;
		ctx.textAlign = this.textAlign;
		ctx.textBaseline = "top";
		
		var substrings = this.text.toString().split("\n");
		var longest = "";
		
		if (substrings.length == 1) {
			ctx.fillText(this.text,0,0);
			longest = this.text;
		}
		else if	(substrings.length > 1) {
			for (var i = 0; i < substrings.length; i++) {
				var substr = substrings[i];
				
				if (longest.length < substr.length) {
					longest = substr;
				}
				
				if (this.textAlign == "left") {
					ctx.fillText(substr,0,i*(this.fontSize+4));
				}
				else if (this.textAlign == "center") {
					ctx.fillText(substr,0,i*(this.fontSize+4));
				}
			}
		}
		
		if (ctx.measureText(longest).width != this.rect.w) {
			this.rect.w = ctx.measureText(longest).width;
		}
	}
	
	Game.inherit(this,Text,GameObject,obj);
};

// #####
// SCENE
// #####

/*
	<Scene> [var obj {
		... (look at <GameObject>),
		*init = Function
	}] return Scene < GameObject
	* Description: Scene, special type of game object, kind of container for objects
*/
function Scene(obj) {	
	this.handleMouse = true;
	this.debugColor = "#4bf";
	this.setPos = null;
	
	var args = Game.expand(obj,{
		name: (obj.name) ? obj.name : "",
		pos: vecNull(),
		size: new Game().winSize(),
		enter: obj.enter,
		exit: obj.exit,
	});
	args.init = null;
	
	Game.inherit(this,Scene,GameObject,args);
	
	if (obj.init) {
		obj.init(this);
	}
}

// #########################
// Handling Keyboard & Mouse
// #########################

/*
	KeyBoard
	* Description: object contain different keycodes for keyboard handlers,
				   you can compare keycodes like this:
				   if (key == KeyBoard.key_w) {
				       // it's W key
				   }
*/
var KeyBoard = {
	bckspc: 8, // Backspace
	enter: 13, // Enter
	shift: 16, // Shift
	ctrl:  17, // Control
	alt:   18, // Alt
	esc:   27, // Escape
	space: 32, // Space
	arr_l: 37, // Arrow Left
	arr_u: 38, // Arrow Up
	arr_r: 39, // Arrow Right
	arr_d: 40, // Arrow Down
	key_a: 65, // Key "A"
	key_d: 68, // Key "D"
	key_s: 83, // Key "S"
	key_w: 87, // Key "W"
}

/*
	<KeyBoardHandler> [] return KeyBoardHandler
	* Description: (Singleton class) Keyboard handler, you could add handlers or remove handlers when they aren't necessary more
*/
function KeyBoardHandler () {
	if (!KeyBoardHandler.__instance) {
		KeyBoardHandler.__instance = this;
		
		var handlers = {};
		/*
			- addHandler [var obj:GameObject] return nothing
			* Description: adding handler (it usually obj.keyboardHandler)
		*/
		KeyBoardHandler.__instance.addHandler = function (obj) {
			if (obj instanceof GameObject) {
				if (handlers[obj.name] == null) {
					handlers[obj.name] = obj;
				}
				else {
					throw new Error(obj.name+" is already handling by KeyBoardHandler")
				}
			}
		};
		/*
			- removeHandler [var obj:GameObject] return nothing
			* Description: remove handler (it usually obj.keyboardHandler)
		*/
		KeyBoardHandler.__instance.removeHandler = function (obj) {
			if (obj.length != 0 && handlers[obj.name]) {
				delete handlers[obj.name];
			}
		};
		/*
			- handle [var obj:GameObject] return nothing
			* Description: handling handlers
		*/
		KeyBoardHandler.__instance.handle = function (state, e) {			
			for (var name in handlers) {
				handlers[name].keyboardHandler(state, e.keyCode);
			}
		};
	}
	else {return KeyBoardHandler.__instance;}
};

/*
	<MouseHandler> [] return MouseHandler
	* Description: (Singleton) Mouse handler, you could add handlers or remove handlers when they aren't necessary more
*/
function MouseHandler () {
	if (!MouseHandler.__instance) {
		MouseHandler.__instance = this;
		
		var handlers = {};
		/*
			- addHandler [var obj:GameObject] return nothing
			* Description: adding handler (it usually obj.mouseHandler)
		*/
		MouseHandler.__instance.addHandler = function (obj) {
			if (obj instanceof GameObject) {
				if (handlers[obj.name] == null) {
					handlers[obj.name] = obj;
				}
				else {
					throw new Error(obj.name+" is already handling by MouseHandler")
				}
			}
		};
		/*
			- removeHandler [var obj:GameObject] return nothing
			* Description: remove handler (it usually obj.mouseHandler)
		*/
		MouseHandler.__instance.removeHandler = function (obj) {
			if (obj.name.length != 0 && handlers[obj.name]) {
		 		delete handlers[obj.name];
			}
		};
		/*
			- handle [var obj:GameObject] return nothing
			* Description: handling handlers
		*/
		MouseHandler.__instance.handle = function (state, e) {
			e.preventDefault();
			for (var name in handlers) {
				var canvas = RJ.canvas;
				var margin = size2vec(size(canvas.offsetLeft,canvas.offsetTop));
				margin.sub(vec2(0,document.getElementsByTagName("html")[0].scrollTop));
				var cursor = vec2(e.clientX,e.clientY).sub(margin);
				
				handlers[name].mouseHandler(state, cursor);
			}
		};
	}
	else {return MouseHandler.__instance;}
};

// ####
// GAME
// ####

/*
	<Game> [] return Game
	* Description: (Singleton) Almighty Game object, do most of the work.
*/
function Game() {
	var lastTime = new Date().getTime();
	var init;
	var fps = 0;
	if (!Game.__instance) {
		Game.__instance = this;
		init = function () {
			var childrenByNames = {};
			var globalCounter = 0;
			var displayFPS = false;
			/*
				- showFPS [] return nothing
				* Description: display FPS
			*/
			Game.__instance.showFPS = function () {
				displayFPS = true;
			};
			/*
				- hideFPS [] return nothing
				* Description: hide FPS
			*/
			Game.__instance.hideFPS = function () {
				displayFPS = false;
			};
			Game.__instance.mouseHandler = new MouseHandler();
			Game.__instance.keyboardHandler = new KeyBoardHandler();
			// *SERVICE FUNCTIONS: DON'T USE THEM
			// *THEY'RE START HERE
			Game.__instance.increaseCounter = function () {
				return globalCounter++;
			};
			// Object Registration
			Game.__instance.amountOfObjects = function () {
				return Object.keys(childrenByNames).length;
			};
			Game.__instance.registerObject = function (obj) {
				if (obj.name.length != 0) {
					childrenByNames[obj.name] = obj;
				}
			};
			Game.__instance.get = function (name) {
				if (name.length != 0) {
					if (this.isReservedName(name)) {
						return childrenByNames[name];
					}
				}
			};
			Game.__instance.remove = function (name) {
				if (name.length != 0) {
					var i = 0;
					for (var childName in childrenByNames) {
						if (name == childName) {
							delete childrenByNames[childName];
							
							break;
						}
						i++;
					}
				}
			};
			// Name Reservation
			var reservedNames = {};
			Game.__instance.reserveName = function (name) {
				reservedNames[name] = name;
			};
			Game.__instance.isReservedName = function (name) {
				if (reservedNames[name]) {
					return true;
				}
				
				return false;
			};
			Game.__instance.removeReservedName = function (name) {
				if (name.length != 0) {
					var i = 0;
					for (var childName in reservedNames) {
						if (name == childName) {
							delete reservedNames[childName];
							
							break;
						}
						i++;
					}
				}
			}
			// *AND ENDING HERE
			Game.__instance.actions = null;
			Game.__instance.addAction = null;
			Game.__instance.pColor = "#000";
			/*
				- setBackground [var color:String or CanvasGradient] return nothing
				* Description: changing background, it could be color (hexadecimal) or gradient
			*/
			Game.__instance.setBackground = function (color) {
				this.pColor = color;
			};
			Game.__instance.__proto__ = new GameObject({
				pos: vecNull(),
				size: size(0,0)
			});
			Game.__instance.__proto__.constructor = Game;
			/*
				- winSize [] return Size
				* Description: returning the window's size (canvas' rect)
			*/
			Game.__instance.winSize = function () {
				return size(this.rect.w,this.rect.h);
			};
			Game.__instance.canvas = null;
			// Debug
			Game.__instance.debug = false;
			/*
				- turnOnDebug [] return nothing
				* Description: switching on debug mode
			*/
			Game.__instance.turnOnDebug = function () {
				this.debug = true;
			};
			/*
				- turnOffDebug [] return nothing
				* Description: switching off debug mode
			*/
			Game.__instance.turnOffDebug = function () {
				this.debug = false;
			};
			// Start/Pause
			Game.__instance.rate = 0;
			Game.__instance.running = false;
			/*
				- start [] return nothing
				* Description: start the game if it's paused
			*/
			Game.__instance.start = function (r) {
				if (this.rate == 0) {
					this.rate = r;
				}
				
				if (!this.running) {
					this.running = true;
					this.timer = setInterval(function () {
						Game.__instance.update(0);
						Game.__instance.render(Game.__instance.ctx);
					},1000/this.rate);
				}
			};
			/*
				- stop [] return nothing
				* Description: stops the game if it's playing
			*/
			Game.__instance.stop = function () {
				if (this.running) {
					this.running = false;
					clearInterval(this.timer);
				}
			};
			/*
				- addHandler [var name:String, var func:Function] return nothing
				* Description: setting handler on document
			*/
			Game.__instance.addHandler = function (name,func) {
				if (!handlers[name]) {
					document.addEventListener(name,func);
					
					handlers[name] = func;
				}
				else {
					throw new Error(name+" is already handling by 'document'");
				}
			};
			var handlers = {};
			/*
				- init [var props {
					*canvas = String (ID of canvas element),
					*rate = Number (FPS),
					*size = Size (width and height of window)
				}] return nothing
				* Description: initialization of Game
			*/
			Game.__instance.init = function (props) {
				this.canvas = document.getElementById(props.canvas);
				this.ctx = this.canvas.getContext("2d");
				this.parent = null;
		
				if (!props.size.isNull()) {
					this.rect.setSize(props.size);
					this.canvas.width = props.size.w;
					this.canvas.height = props.size.h;
				}
		
				this.start(props.rate);
				this.addHandler("mousedown",function(e) {RJ.mouseHandler.handle("down",e);});
				this.addHandler("mousemove",function(e) {RJ.mouseHandler.handle("move",e);});
				this.addHandler("click",	function(e) {RJ.mouseHandler.handle("click",e)});
				this.addHandler("keydown",	function(e) {RJ.keyboardHandler.handle("down",e);});
				this.addHandler("keyup",	function(e) {RJ.keyboardHandler.handle("up",e);});
			};
			// Rendering
			/*
				- render [var ctx:CanvasRenderingContext2D] return nothing
				* Description: the same thing as in GameObject
			*/
			Game.__instance.render = function (ctx) {
				ctx.clearRect(0,0,this.rect.w,this.rect.h);
				ctx.fillStyle = this.pColor;
				ctx.fillRect(0,0,this.rect.w,this.rect.h);
				
				for (var i = 0; i < this.children.length; i++) {
					this.children[i].draw(ctx);
					if (new Game().debug) {
						this.children[i].renderAABB(ctx);
					}
				}
				
				if (displayFPS) {
					ctx.font = "14px Arial";
					ctx.fillStyle = "#fff";
					ctx.textAlign = "left";
					ctx.textBaseline = "bottom";
					ctx.fillText(fps.toFixed(1),5,this.rect.h - 5);
				}
			};
			// Updating
			/*
				- update [var dt:Number] return nothing
				* Description: the same thing as in GameObject
			*/
			Game.__instance.update = function () {
				fps = (new Date().getTime() - lastTime) / (1000/this.rate);
				var dt = 2 - fps;
				fps *= this.rate;
				fps = this.rate * 2 - fps;
				fps = (fps <= 0) ? 0 : fps;
		
				for (var i = 0; i < this.children.length; i++) {
					this.children[i].refresh(dt);
				}
				lastTime = new Date().getTime();
			};
			// Loading
			/*
				- load [var func:Function] return nothing
				* Description: something like jQ.ready
			*/
			Game.__instance.load = function (func) {
				if (true) {
					this.addHandler("DOMContentLoaded",function () {func(RJ);});
				}
			};
		};
		
		init();
	}
	else return Game.__instance;
}

/*
	+ argDef [var arg:AnyType, var def:AnyType] return nothing
	* Description: if arg is equals to undefined then return def (default)
*/
Game.argDef = function (arg,def) {
	return (arg) ? arg : def;
}
/*
	+ super [var obj:GameObject] return Object
	* Description: returns obj's prototype if it's exist
*/
Game.super = function (obj) {
	return obj.__proto__;
}
/*
	+ expand [var expand:Object, var obj:Object] return nothing
	* Description: extend expand:Object by obj:Object
*/
Game.expand = function (expand,obj) {
	var newObject = {};
	
	for (var key in expand) {
		newObject[key] = expand[key];
	}
	
	for (var key in obj) {
		newObject[key] = obj[key];
	}
	
	return newObject;
};
/*
	+ inherit [var child:Object, var constructor:Function, var parent:Object, var args:Object] return nothing
	* Description: inherit child:Object by parent:Object
*/
Game.inherit = function (child,constructor,parent,args) {
	delete args["render"];
	
	child.__proto__ = new parent(args);
	child.__proto__.constructor = constructor;
};

// Making for RacoonJS global shortcut
// instead of "new Game()" each time
window.RJ = new Game();