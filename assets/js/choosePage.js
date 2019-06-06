cc.Class({
	extends: cc.Component,

	properties: {
		characterPrefab: cc.Prefab,
		characterSF: [cc.SpriteFrame],
		characterConfig: cc.JsonAsset,

	},

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {},
	init(g) {
		this._game = g
		this.updateAllUI()

	},
	start() {

	},
	//解锁角色
	unlockCharacter(num) {

	},
	// 随意切换角色
	switchCharacter(num, sf) {
		num = num || 0
		sf = sf || this.characterSF[0]
		this.node.getChildByName('player').getComponent(cc.Sprite).spriteFrame = sf
	},
	// 选择使用角色
	chooseCharacter(num) {
		let data = this.characterConfig.json[+num]
		this.chooseCharacter = data
		this._game.PD.character = num //用来判断技能
		this._game.chooseCharacter(this.node.getChildByName('player').getComponent(cc.Sprite).spriteFrame)
	},
	// -------------- 选择角色页面 ----------------
	showCharacter() {
		let characterData = this.characterConfig.json
		characterData.map((item) => {
			let character = cc.instantiate(this.characterPrefab)
			character.parent = this.node.getChildByName('scrollview').getChildByName('view').getChildByName('container')
			character.getComponent('character').init(this, item)
		})
	},
	// update (dt) {},
});