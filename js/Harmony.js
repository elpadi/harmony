define(['lib/functions','./Palette','./Controls','./brushes/Sketchy','./brushes/LongFur'], function(fn, Palette, Controls, Sketchy, LongFur) {
	function Harmony() {
		this.canvas = this.createCanvas();
		this.context = this.canvas.getContext('2d');
		this.flattenCanvas = this.createCanvas();
		this.trimmedCanvas = this.createCanvas();
		this.$container.append(this.canvas);

		this.palette = new Palette();
		this.brush.current = new Sketchy(this.context);

		this.controls = new Controls(this, this.$container.find('.harmony__controls'));

		this.populateFromLocalStorage();
	
		this.canvas.addEventListener('mousedown', this.bind(this.onCanvasMouseDown), false);
		this.canvas.addEventListener('mouseup', this.bind(this.onCanvasMouseUp), false);

		this.resize();
	}

	Harmony.prototype = {
		$container: null,
		pressedKeys: {
			alt: false,
			shift: false
		},
		trimBeforeSaving: true,
		canvas: null,
		flattenCanvas: null,
		trimmedCanvas: null,
		palette: null,
		brush: {
			current: null,
			types: {
				sketchy: Sketchy,
				longfur: LongFur
			}
		},
		foregroundColorSelector: null,
		backgroundColorSelector: null,
		menu: null,
		
		createCanvas: function() {
			var canvas = document.createElement('canvas');
			return canvas;
		},

		changeBrush: function(name) {
			if (name in this.brush.types) {
				this.brush.current = new this.brush.types[name](this.context);
			}
		},

		populateFromLocalStorage: function() {
			var ls = window.localStorage;
			var image;
			if (('canvas' in ls) && ls.canvas) {
				image = new Image();
				image.addEventListener("load", this.bind(function(event) {
					image.removeEventListener(event.type, arguments.callee, false);
					this.context.drawImage(image, 0, 0);
				}, false));
				image.src = ls.canvas;			
			}
			if (('brushColor' in ls) && ls.brushColor) {
				this.brushColor = ls.brushColor;
			}
			if (('backgroundColor' in ls) && ls.backgroundColor) {
				this.backgroundColor = ls.backgroundColor;
			}
		},

		trackCanvasMouse: function() {
			this.$container.on('mousemove', this.bind(this.onCanvasMouseMove));
		},

		forgetCanvasMouse: function() {
			this.$container.off('mousemove');
		},

		resetAutoSave: function() {
			clearTimeout(this.autoSaveTimeOutId);
			this.autoSaveTimeOutId = setTimeout(this.bind(this.saveToLocalStorage), 2000);
		},

		onCanvasMouseDown: function(event) {
			this.brush.current.strokeStart(event.offsetX, event.offsetY);
			this.trackCanvasMouse();
		},

		onCanvasMouseMove: function(event) {
			this.brush.current.stroke(event.offsetX, event.offsetY);
		},

		onCanvasMouseUp: function() {
			this.brush.current.strokeEnd();
			this.forgetCanvasMouse();
			this.resetAutoSave();
		},

		saveToLocalStorage: function() {
			window.localStorage.canvas = this.canvas.toDataURL('image/png');
		},

		flatten: function() {
			var context = this.flattenCanvas.getContext("2d");
			context.fillStyle = '#FFFFFF';
			context.fillRect(0, 0, this.canvas.width, this.canvas.height);
			context.drawImage(this.canvas, 0, 0);
		},

		trimFlatCanvas: function() {
			var context = this.flattenCanvas.getContext("2d"),
				data = context.getImageData(0, 0, this.canvas.width, this.canvas.height).data,
				topLeft = { x: this.canvas.width, y: this.canvas.height },
				bottomRight = { x: 0, y: 0 },
				row = 1, col = 0
			;
			while (row < this.canvas.height) {
				col = 0;
				while (col < this.canvas.width) {
					if (data[((this.canvas.width * row) + col) * 4] !== 255
						|| data[((this.canvas.width * row) + col) * 4 + 1] !== 255
						|| data[((this.canvas.width * row) + col) * 4 + 2] !== 255
					) {
						topLeft.x = Math.min(topLeft.x, col);
						topLeft.y = Math.min(topLeft.y, row);
						bottomRight.x = Math.max(bottomRight.x, col);
						bottomRight.y = Math.max(bottomRight.y, row);
					}
					col++;
				}
				row++;
			}
			this.trimmedCanvas.width = bottomRight.x - topLeft.x;
			this.trimmedCanvas.height = bottomRight.y - topLeft.y;
			this.trimmedCanvas.getContext('2d').drawImage(
				this.flattenCanvas,
				topLeft.x,
				topLeft.y,
				this.trimmedCanvas.width,
				this.trimmedCanvas.height,
				0,
				0,
				this.trimmedCanvas.width,
				this.trimmedCanvas.height
			);
		},

		resize: function() {
			this.canvas.width = this.flattenCanvas.width = this.$container.width();
			this.canvas.height = this.flattenCanvas.height = this.$container.height();
		},

		bind: function(f) {
			return fn.bind(f, this);
		},

		clear: function() {
			if (confirm("Are you sure?")) {
				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.saveToLocalStorage();
			}
		},

		save: function() {
			this.flatten();
			if (this.trimBeforeSaving) {
				this.trimFlatCanvas();
			}
		}

	};

	return Harmony;
});
