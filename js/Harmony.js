define(['lib/functions'], function(fn) {
	function Harmony() {
		this.canvas = this.createCanvas();
		this.context = this.canvas.getContext('2d');
		this.flattenCanvas = this.createCanvas();
		this.trimmedCanvas = this.createCanvas();
		this.$container.append(this.canvas);

		this.populateFromLocalStorage();
	
		this.canvas.addEventListener('mousedown', this.bind(this.onCanvasMouseDown), false);
		this.canvas.addEventListener('touchstart', this.bind(this.onCanvasTouchStart), false);
		this.canvas.addEventListener('mouseup', this.bind(this.finishDrawing), false);
		this.canvas.addEventListener('touchend', this.bind(this.finishDrawing), false);

		this.resize();
	}

	Harmony.prototype = {
		$container: null,
		pressedKeys: {
			alt: false,
			shift: false
		},
		trimBeforeSaving: true,
		allowDrawing: true,
		canvas: null,
		flattenCanvas: null,
		trimmedCanvas: null,
		palette: null,
		brush: {
			current: null,
			types: {
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

		startDrawing: function(x, y) {
			if (this.allowDrawing) {
				this.brush.current.strokeStart(x, y);
				this.trackCanvasMovement();
			}
		},

		finishDrawing: function() {
			this.brush.current.strokeEnd();
			this.forgetCanvasMovement();
			this.resetAutoSave();
		},

		forgetCanvasMovement: function() {
			this.$container.off('mousemove touchmove');
		},

		saveToLocalStorage: function() {
			window.localStorage.canvas = this.canvas.toDataURL('image/png');
		},

		resetAutoSave: function() {
			clearTimeout(this.autoSaveTimeOutId);
			this.autoSaveTimeOutId = setTimeout(this.bind(this.saveToLocalStorage), 2000);
		},

		onCanvasMouseDown: function(event) {
			this.startDrawing(event.offsetX || event.clientX, event.offsetY || event.clientY);
		},

		onCanvasMouseMove: function(event) {
			this.brush.current.stroke(event.offsetX || event.clientX, event.offsetY || event.clientY);
		},

		onCanvasTouchStart: function(event) {
			if (event.touches.length === 1) {
				event.preventDefault();
				this.startDrawing(event.touches[0].clientX, event.touches[0].clientY);
			}
		},

		onCanvasTouchMove: function(event) {
			this.brush.current.stroke(event.touches[0].clientX, event.touches[0].clientY);
		},

		trackCanvasFinger: function() {
			this.$container.on('touchmove', this.bind(function(e) {
				var event = e.originalEvent;
				if (event.touches.length === 1) {
					event.preventDefault();
					this.onCanvasTouchMove(event);
				}
			}, this));
		},

		trackCanvasMouse: function() {
			this.$container.on('mousemove', this.bind(this.onCanvasMouseMove));
		},

		trackCanvasMovement: function() {
			this.trackCanvasMouse();
			this.trackCanvasFinger();
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
