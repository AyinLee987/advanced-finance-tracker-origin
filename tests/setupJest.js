beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('financeTrackerLang', 'en');
});


if (typeof global.TextEncoder === 'undefined') {
	const { TextEncoder, TextDecoder } = require('util');
	global.TextEncoder = TextEncoder;
	global.TextDecoder = TextDecoder;
}

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
