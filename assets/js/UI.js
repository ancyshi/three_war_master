cc.Class({
	extends: cc.Component,

	properties: {
	},

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {},
	init(g) {
		this._game=g
		this.loadChild()
	},
	loadChild() {
		this.chain = this.node.getChildByName('chain').getComponent('chain')
	},
	start() {

	},
	onGameStart() {

	},
	addChain() {
		this.chain.addChain()
	}
	// update (dt) {},
});