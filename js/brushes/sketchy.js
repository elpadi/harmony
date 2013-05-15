define(['../Brush'], function(Brush) {

	function Sketchy(context) {
		Brush.call(this, context);
	}

	function A() { }
	A.prototype = Brush.prototype;
	Sketchy.prototype = new A();
	Sketchy.prototype.constructor = Sketchy;

	Sketchy.prototype.stroke = function(mouseX, mouseY) {
		var i, dx, dy, d;

		this.points.push([mouseX, mouseY]);
		this.context.lineWidth = this.lineWidth;
		this.context.strokeStyle = "rgba(" + this.color[0] + ", " + this.color[1] + ", " + this.color[2] + ", " + 0.05 * this.brushPressure + ")";

		this.context.beginPath();
		this.context.moveTo(this.prevMouseX, this.prevMouseY);
		this.context.lineTo(mouseX, mouseY);
		this.context.stroke();

		for (i = 0; i < this.points.length; i++) {
			dx = this.points[i][0] - this.points[this.count][0];
			dy = this.points[i][1] - this.points[this.count][1];
			d = dx * dx + dy * dy;

			if (d < 4000 && Math.random() > (d / 2000)) {
				this.context.beginPath();
				this.context.moveTo( this.points[this.count][0] + (dx * 0.3), this.points[this.count][1] + (dy * 0.3));
				this.context.lineTo( this.points[i][0] - (dx * 0.3), this.points[i][1] - (dy * 0.3));
				this.context.stroke();
			}
		}

		this.prevMouseX = mouseX;
		this.prevMouseY = mouseY;

		this.count ++;
	};

	return Sketchy;

});
