define(['../Brush'], function(Brush) {

	function LongFur(context) {
		Brush.call(this, context);
		this.context.globalCompositeOperation = 'source-over';
	}

	function A() { }
	A.prototype = Brush.prototype;
	LongFur.prototype = new A();
	LongFur.prototype.constructor = LongFur;

	LongFur.prototype.stroke = function(mouseX, mouseY) {
		var i, size, dx, dy, d;

		this.points.push([mouseX, mouseY]);
		this.context.lineWidth = this.brushSize;
		this.context.strokeStyle = "rgba(" + this.color[0] + ", " + this.color[1] + ", " + this.color[2] + ", " + 0.05 * this.brushPressure + ")";

		for (i = 0; i < this.points.length; i++) {
			size = -Math.random();
			dx = this.points[i][0] - this.points[this.count][0];
			dy = this.points[i][1] - this.points[this.count][1];
			d = dx * dx + dy * dy;

			if (d < 4000 && Math.random() > d / 4000) {
				this.context.beginPath();
				this.context.moveTo( this.points[this.count][0] + (dx * size), this.points[this.count][1] + (dy * size));
				this.context.lineTo( this.points[i][0] - (dx * size) + Math.random() * 2, this.points[i][1] - (dy * size) + Math.random() * 2);
				this.context.stroke();
			}
		}

		this.count ++;
	};

	return LongFur;

});
