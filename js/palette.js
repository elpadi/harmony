define(['lib/math/math','./ColorSelector'], function(math, ColorSelector) {

	var POLAR_GRADIENT_TURNS = 3;

	function Palette() {
		this.init();
		this.foregroundColorSelector = new ColorSelector(this.canvas);
		this.backgroundColorSelector = new ColorSelector(this.canvas);
	}

	Palette.prototype = {
		canvas: null,
		context: null,
		gradient: null,
		foregroundColorSelector: null,
		backgroundColorSelector: null,
		dimensions: { width: 250, height: 250 },
		polarGradientRadius: 90,

		drawPolarGradient: function(offsetx, offsety) {
			var angle, angle_cos, angle_sin;
			var count = POLAR_GRADIENT_TURNS * 360;
			var count_inverse = 1 / count;
			var radius = 90;

			for (i = 0; i < count; i++) {
				angle = math.deg2rad(i / POLAR_GRADIENT_TURNS);
				angle_cos = Math.cos(angle);
				angle_sin = Math.sin(angle);

				this.context.strokeStyle = "hsl(" + Math.floor((i * count_inverse) * 360) + ", 100%, 50%)";
				this.context.beginPath();
				this.context.moveTo(angle_cos + offsetx, angle_sin + offsety);
				this.context.lineTo(angle_cos * this.polarGradientRadius + offsetx, angle_sin * this.polarGradientRadius + offsety);
				this.context.stroke();
			}
		},

		getGradient: function() {
			var offsetx = this.canvas.width / 2;
			var offsety = this.canvas.height / 2;
			
			this.drawPolarGradient(offsetx, offsety);
			this.gradient = this.context.createRadialGradient(offsetx, offsetx, 0, offsetx, offsetx, this.polarGradientRadius);
			this.gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
			this.gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
		},

		setupCanvas: function() {
			this.canvas = document.createElement("canvas");
			this.canvas.width = this.dimensions.width
			this.canvas.height = this.dimensions.height;

			this.context = this.canvas.getContext("2d");
			this.context.lineWidth = 1;
		},

		init: function() {
			this.setupCanvas();
			this.gradient = this.getGradient();

			this.context.fillStyle = this.gradient;
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}

	};

	return Palette;

});
