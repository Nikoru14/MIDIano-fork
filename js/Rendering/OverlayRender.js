export class OverlayRender {
	constructor(ctx) {
		this.ctx = ctx
		this.overlays = []
	}
	resize(windowWidth, windowHeight) {
		this.windowWidth = windowWidth
		this.windowHeight = windowHeight
	}
	addOverlay(message, duration) {
		let totalDuration = duration
		this.overlays.push({ message, totalDuration, duration })
	}
	render() {
		for (let i = this.overlays.length - 1; i >= 0; i--) {
			let overlay = this.overlays[i]
			overlay.duration--
			if (overlay.duration < 0) {
				this.overlays.splice(i, 1)
			}
		}

		if (this.overlays.length) {
			this.globalAlpha = this.setAlphaForOverlay(
				this.overlays[this.overlays.length - 1]
			)
			this.ctx.fillStyle = "rgba(0,0,0,0.9)"
			this.ctx.fillRect(0, 0, this.windowWidth, this.windowHeight)
		}
		for (let i = 0; i < this.overlays.length; i++) {
			let overlay = this.overlays[i]

			this.setAlphaForOverlay(overlay)

			this.ctx.font = "32px 'Source Sans Pro', sans-serif"
			this.ctx.fillStyle = "white"

			let wd = this.ctx.measureText(overlay.message).width
			this.ctx.fillText(
				overlay.message,
				this.windowWidth / 2 - wd / 2,
				this.windowHeight / 4 + i * 40
			)
		}
	}

	setAlphaForOverlay(overlay) {
		let ratio = 1 - overlay.duration / overlay.totalDuration
		if (ratio < 0.1) {
			this.ctx.globalAlpha = ratio / 0.1
		} else {
			this.ctx.globalAlpha = (0.9 - (ratio - 0.1)) / 0.9
		}
		return ratio
	}
}
