if (typeof HTMLCanvasElement !== 'undefined') {
	HTMLCanvasElement.prototype.getContext = function getContext() {
		return {
			canvas: this,
			clearRect() {},
			fillRect() {},
			beginPath() {},
			moveTo() {},
			lineTo() {},
			stroke() {},
			arc() {},
			closePath() {},
			fill() {},
			save() {},
			restore() {},
			setTransform() {},
			translate() {},
			scale() {},
			rotate() {},
			fillText() {},
			measureText() {
				return { width: 0 };
			},
		};
	};
}
