define(['../Brush'], function(Brush) {

	function Fur(context) {
		Brush.call(this, context);
	}

	function A() { }
	A.prototype = Brush.prototype;
	Fur.prototype = new A();
	Fur.prototype.constructor = Fur;

	Fur.prototype.stroke = function(mouseX, mouseY) {
		var i, dx, dy, d;

		this.points.push([mouseX, mouseY]);
		this.context.lineWidth = this.brushSize;
		this.context.strokeStyle = "rgba(" + this.color[0] + ", " + this.color[1] + ", " + this.color[2] + ", " + 0.05 * this.brushPressure + ")";
		
		this.context.beginPath();
		this.context.moveTo(this.prevMouseX, this.prevMouseY);
		this.context.lineTo(mouseX, mouseY);
		this.context.stroke();

		for (i = 0; i < this.points.length; i++) {
			dx = this.points[i][0] - this.points[this.count][0];
			dy = this.points[i][1] - this.points[this.count][1];
			d = dx * dx + dy * dy;

			if (d < 2000 && Math.random() > d / 2000) {
				this.context.beginPath();
				this.context.moveTo( mouseX + (dx * 0.5), mouseY + (dy * 0.5));
				this.context.lineTo( mouseX - (dx * 0.5), mouseY - (dy * 0.5));
				this.context.stroke();
			}
		}

		this.prevMouseX = mouseX;
		this.prevMouseY = mouseY;

		this.count ++;
	};

	return Fur;

});
