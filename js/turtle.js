var turtle = window.turtle = new (function() {
	var colors = [
		'black',
		'blue',
		'green',
		'cyan',
		'red',
		'magenta',
		'yellow',
		'gray',
	];

	// The turtle's current state
	var state = {
		x: 320,
		y: 160,
		theta: 0,
		color: 0,
		pendown: true
	};

	function pickColor(i) {
		return colors[i % colors.length];
	}

	function addDegrees(a, b) {
		var c = (a + b) % 360;
		if (c < 0) {
			c += 360;
		}
		return c;
	}

	var paper, turtleRep;

	this.init = function() {
		paper = new Raphael('gfx', 640, 380);
		turtleRep = paper.path([
			'M', -8, 10,
			'L', 0, -10,
			'L', 8, 10,
			'Z'
		]);
		turtleRep.attr('fill', pickColor(state.color));

		turtleRep.translate(state.x, state.y);
		turtleRep.rotate(state.theta);
		
		$('#run').click(function() {
			var program = $('#editor').val();
			turtle.evaluate(program);
		});
	}
	
	var commands = {
		forward: function(dist) {
			var thetaRad = Raphael.rad(state.theta),
				dx = Math.sin(thetaRad) * dist,
				dy = Math.cos(thetaRad) * dist * -1,
				newx = state.x + dx,
				newy = state.y + dy;

			turtleRep.translate(0, dist * -1);

			if (state.pendown) {
				paper.path([
					'M', state.x, state.y,
					'L', newx, newy
				]).attr('stroke', pickColor(state.color));
			}

			state.x = newx;
			state.y = newy;
		},
		back: function(dist) {
			commands.forward(-1 * dist);
		},
		right: function(deg) {
			state.theta = addDegrees(state.theta, deg);
			turtleRep.rotate(deg);
		},
		left: function(deg) {
			commands.right(-1 * deg);
		},
		color: function(color) {
			state.color = color;
			turtleRep.attr('fill', pickColor(color));
		},
		penup: function() {
			state.pendown = false;
		},
		pendown: function() {
			state.pendown = true;
		}
	};
	commands.f = commands.fd = commands.forward;
	commands.b = commands.bk = commands.back;
	commands.r = commands.rt = commands.right;
	commands.l = commands.lt = commands.left;
	commands.pu = commands.penup;
	commands.pd = commands.pendown;

	this.evaluate = function(str) {
		var tokens = str.split(/\s+/);
		for (var i = 0; i < tokens.length; i++) {
			var cmd = tokens[i];

			// hack hack
			if (commands[cmd] === commands.penup || commands[cmd] === commands.pendown) {
				commands[cmd]();
			} else {
				param = parseInt(tokens[++i]);
				commands[cmd](param);
			}
		}
	}
});

