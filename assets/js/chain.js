cc.Class({
	extends: cc.Component,

	properties: {
		chainLabel: cc.Label,
		chainBar: cc.Sprite,
		chain:0
	},
	// --------------- 连击系统 -------------------
	addChain() {
		this.chain += 1
		this.chainLabel.string=this.chain
		console.log(this.chain)
		this.showChain()
		if (this.chainTimer) {
			clearTimeout(this.chainTimer)
		}
		this.chainTimer=setTimeout(() => {
			this.endChain()
		}, 3000)
	},
	showChain() {
		this.node.active = true
		if (this.chain > 3) {
			this.chainLabel.active = true
			this.chainLabel.string = this.chain
		}
	},
	endChain() {
		this.chain = 0
		this.node.active = false
		this.chainLabel.active = false
	},
	// update (dt) {},
});