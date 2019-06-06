cc.Class({
	extends: cc.Component,

	properties: {},

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {},
	init(g) {
		this._game = g
		this.loadChild()
	},
	loadChild() {
		this.chain = this.node.getChildByName('chain').getComponent('chain')
		this.moneyLabel = this.node.getChildByName('money').getChildByName('label').getComponent(cc.Label)
	},
	start() {

	},
	onGameStart() {

	},
	addChain() {
		this.chain.addChain()
	},
	updateMoney() {
		this.moneyLabel.string="$ "+this._game.PD.money
	},
	updateAllUI(){
		this.updateMoney()
	}
	// update (dt) {},
});