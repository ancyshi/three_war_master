cc.Class({
	extends: cc.Component,

	properties: {
		chainLabel: cc.Label,
		chainBar: cc.Sprite,
	},

	// --------------- 连击系统 -------------------
	addChain(g) {
		this.chain += 1
		this.showChain()
		if (this.chainTimer) {
			clearTimeout(this.chainTimer)
		}
		setTimeout(() => {
			this.endChain()
		}, 3000)
	},
	showChain() {
		this.node.active = true
		if (this.chain > 3) {
			this.chainNode.active = true
			this.chainLabel.string = this.chain
		}
	},
	endChain() {
		this.chain += 0
		this.node.active = false
		this.chainNode.active = false
	},
	// update (dt) {},
});