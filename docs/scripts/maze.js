function setup() {
	document.getElementById("mazeSection").style.display="inherit";
	maze.build('RB');
}
	
var maze = {
	height: 0,
	width: 0,
	body: "",
	build: function(type) {
		var num = parseInt(document.getElementById('mazeSize').value);
		this.mazeInit(num,1);
		if (type == 'RB') this.RBMaze();
	},
	mazeInit: function(size,speed) {
		this.width = fib(size) * 2 + 1;
		this.height = fib(size + 1) * 2 + 1;
		this.body = document.getElementById("boxmaze");
		this.body.innerHTML = "";

		var mazeText = "";
		for (var i = 0; i < maze.width; i++) {
			// maze.style.backgroundColor = red;
			mazeText += '<div class="boxrow">';
			for (var j = 0; j < maze.height; j++) {
				if (i%2 == 1 && j%2 == 1) {
					mazeText +='<div class="box cell"></div>';
				}
				else {
					// console.log(mazeText);
					mazeText += '<div class="box wall"></div>';
				}
			}
			mazeText += '</div>';
		}
		this.body.innerHTML = mazeText;

		this.body.children[1].children[0].classList = "box cell";
		this.body.children[maze.width-2].children[maze.height-1].classList = "box cell";
	},
	RBMaze() {
		stack = [];

		var n=Math.floor(Math.random()*(this.height-1));
		var m=Math.floor(Math.random()*(this.width-1));
		if (n%2==0) n++;
		if (m%2==0) m++;

		stack.push(m*this.height+n);


		// var count=0;
		var curr, next, x, y, nx, ny;
		var pos; // possible positions to travel to
		while (stack.length) {
			curr = stack.pop();

			x = Math.floor(curr/this.height);
			y = curr%this.height;
			// This can mean it can have visited in its class more than once. 
			// This should not be an issue
			if (!this.body.children[x].children[y].classList.contains('visited'))
				this.body.children[x].children[y].classList += ' visited';

			pos = this.getPos(curr, 2, [], ["visited"]);		

			if (pos.length  == 0) continue;
			if (pos.length > 1) stack.push(curr); 
			
			next = getRandom(pos);
			stack.push(next);

			nx = Math.floor(next/this.height);
			ny = next%this.height;

			if (!this.body.children[nx].children[ny].classList.contains('visited'))
				this.body.children[nx].children[ny].classList += ' visited';

			this.body.children[(x+nx)/2].children[(y+ny)/2].classList = 'box cell';
			// console.log(stack);
			// if (count++ > 110) {
			// 	console.log("manual");
			// 	break;
			// }
		}
	},
	getPos: function(cord, scale, contained, notContained) {
		var options = [];

		var x=Math.floor(cord/this.height);
		// console.log(x);
		var y=cord%this.height;
		var deltas = [{x:-1,y:0},{x:1,y:0},{x:0,y:-1},{x:0,y:1}];
		
		var classes;
		var passing;

		for (var i=0;i<deltas.length;i++) {
			try {
				dx = deltas[i].x*scale;
				dy = deltas[i].y*scale;
				
				classes = this.body.children[x+dx].children[y+dy].classList;
				passing = true;

				// make sure it contains all in contained
				for (var j=0;j<contained.length && passing;j++) {
					if (!classes.contains(contained[j])) passing = false;
				}

				// make sure it doesn't contain any in notContained 
				for (var j=0;j<notContained.length && passing;j++) {
					if (classes.contains(notContained[j])) passing = false;
				}

				if (passing) options.push(cord + dx*this.height + dy);
			} catch (err){continue;}
		}
		return options;
	},
	solve: function() {
		var end = (this.height*(this.width-2)+this.height-1);
		if (this.body.children[1].children[0].classList.contains("solution")) return;

		var stack = [];
		stack.push(this.height);

		var curr,x,y,next;
		while (stack.length) {
			curr = stack.pop();
			x = Math.floor(curr/this.height);
			y = Math.floor(curr%this.height);

			if (!this.body.children[x].children[y].classList.contains("solution"))
				this.body.children[x].children[y].classList += " solution";

			if (curr == end) {
				return;
			}

			pos = this.getPos(curr,1,["cell"],["solution","deadend"]);
			
			if (pos.length == 0) {
				// dead end
				this.body.children[x].children[y].classList += " deadend";
				continue;
			}
			stack.push(curr); // reinsert for backtracking purposes

			next = getRandom(pos);
			stack.push(next);
		}
	}
};

function disableButtons() {
	var buttons = document.getElementsByTagName("button");
	for (var i=0;i<buttons.length;i++) {
		buttons[i].style.cursor = "wait";
		buttons[i].style.backgroundColor = "grey";
		buttons[i].disabled = true;
	}
}

function enableButtons() {
	var buttons = document.getElementsByTagName("button");
	for (var i=0;i<buttons.length;i++) {
		buttons[i].disabled = false;
		buttons[i].style.cursor = "pointer";
		buttons[i].style.backgroundColor = "#008CBA";
	}
}

// non recursive fibonacci
// time complexity n :)
function fib(n) {
	if (n < 2) return 1;
	var fib1 = 1, fib2 = 1, fib3;
	for (var i = 1; i < n; i++) {
		fib3 = fib1 + fib2;
		fib1 = fib2;
		fib2 = fib3;
	}
	return fib3;
}

// recursive fibonacci
// time complexity is like roughly 2^n :(
function recursiveFib(n) {
	if (n < 2) return 1;
	return recursiveFib(n-1) + recursiveFib(n-2);
}

// for updating slider value
function updateVal(valId, id) {
	document.getElementById(id).value = document.getElementById(valId).value;
}

function getRandom(array) {
	// assume array has something in it
	return array[Math.floor(Math.random()*array.length)];
}