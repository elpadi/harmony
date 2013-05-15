define([], function() {

	function Brush(context) {
		this.context = context;
		this.points = [];
	}

	Brush.prototype = {
		context: null,
		points: null,
		count: 0,
		brushSize: 1,
		brushPressure: 1,
		color: [0,0,0],
		prevMouseX: 0,
		prevMouseY: 0,
		
		destroy: function() {
		},

		strokeStart: function(mouseX, mouseY) {
			this.prevMouseX = mouseX;
			this.prevMouseY = mouseY;
		},

		strokeEnd: function() {
		}

	};

	return Brush;

});
