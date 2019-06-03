var utils = require('utils')
var AC = require('action')
var playerData = require('playerData')
cc.Class({
	extends: cc.Component,

	properties: {
		status: 0, //0未开始游戏 1游戏开始 2游戏结束
		dialogs: [cc.Node], //0 开始页面 1失败页面 2指导页面
		player: cc.Node,
		target: cc.Node,
		gap: cc.Node,
		UI: cc.Node,
		config: cc.JsonAsset,
		levelData: cc.JsonAsset,
		characterPrefab: cc.Prefab,
		characterConfig: cc.JsonAsset,
		characterSF: [cc.SpriteFrame],
	},
	// ------------- 生命周期和触摸事件 ------------------
	level: 0,
	progress: 0,
	onLoad() {
		var manager = cc.director.getCollisionManager();
		manager.enabled = true;
		let canvas = cc.director.getScene().getChildByName('Canvas')
		utils.setDesignResolution()
		canvas.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
		canvas.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
		canvas.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
		this.loadRes()
	},
	loadRes() {
		//	this.chain=this.UI.getChildByName('chain').getComponent('chain')
	},
	init() {

	},
	start() {
		this.config = this.config.json
		this.showPage(0)
		this.loadData()
	},
	// 加载数据
	loadData() {
		this.PD = playerData.loadData() //获取存档数据
		console.log(this.PD)
		// todo :页面数据绑定 金币 关卡数
		this.showCharacter()
		this.switchCharacter()
	},
	_onTouchBegin(event) {
		if (this.playerStatus == 2 && this.status == 1) {
			this.playerGetBigger = true
		}
	},
	_onTouchEnd(event) {
		if (this.playerGetBigger == true && this.status == 1) {
			this.playerGetBigger = false
			this.playerStatus = 1
		}
	},

	_onTouchCancel(event) {},
	playerStatus: 0, //0 无操作状态  1 冲刺状态 2 返回状态 3失败反弹
	update() {
		if (this.status == 1 || this.status == 2) {
			switch (this.playerStatus) {
				case 0:
					break;
				case 1:
					this.playerRush()
					break;
				case 2:
					this.playerBack()
					break;
				case 3:
					this.failRebound()
					break
			}
		}
	},

	onPlayerCollision(other, self) {
		if (this.playerStatus == 1) {
			switch (other.node.group) {
				case 'target':
					if (this.checkIsBig(this.player, other.node)) {
						this.successPunch()
					} else {
						this.gameOver()
					}
					break
				case 'gap':
					this.gameOver()
					break
			}
		}
	},

	checkSkill() {
		// 用于判断人物角色技能
	},
	checkAkt() {
		// 用于制作怪物血量
	},
	// -------------- 选择角色页面 ----------------
	showCharacter() {
		let characterData = this.characterConfig.json
		characterData.map((item) => {
			let character = cc.instantiate(this.characterPrefab)
			character.parent = this.dialogs[3].getChildByName('scrollview').getChildByName('view').getChildByName('container')
			character.getComponent('character').init(this, item)
		})
	},
	//动态切换角色
	unlockCharacter(num) {

	},
	switchCharacter(num, sf) {
		num = num || 0
		sf = sf || this.characterSF[0]
		this.PD.character = num //用来判断技能
		this.dialogs[3].getChildByName('player').getComponent(cc.Sprite).spriteFrame = sf
		this.player.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = sf
	},
	chooseCharacter(num) {
		let data = this.characterConfig.json[+num]
		this.player.getChildByName('sprite').getComponent(cc.Sprite).spriteFrame = ''
	},
	// -------------- 游戏进程 -------------------
	gameStart() {
		this.status = 1
		this.playerStatus = 2
		this.initGameLevel()
		this.showPage(1)
	},
	gameRestart() {
		if (this.status = 2) {
			this.status = 1
			this.operateDialog(2, 0)
			this.init()
			this.gameStart()
		}
	},
	initGameLevel() {
		this.LD = this.levelData.json[0] //暂时只使用第一个数据
		this.initTarget(0)
		this.initGamePos()
	},
	onLevelSuccess() {
		this.operateDialog(4, 1)
	},
	initTarget(type) {
		this.target.width = this.target.height = 100 * (Math.random() * 1.5 + 0.5)
		this.gapWeight = 100 * (Math.random() * 1.5 + 0.005 * (100 - this.PD.level)) + this.target.width
	},
	levelUp() {
		this.operateDialog(4, 0)
		this.PD.level++
		playerData.saveData(null, this.PD)
		this.gameStart()
	},
	initGamePos() {
		let targetAction = cc.moveTo(0.4, 0, window.winSize.height / 2 - this.config.targetOriginPos)
		this.target.runAction(targetAction)
		let action1 = cc.moveBy(0.3, 0, -300)
		let action2 = cc.fadeOut(0.3)
		let action3 = cc.moveTo(0.3, 0, window.winSize.height / 2 - this.config.gapOriginPos)
		let action4 = cc.fadeIn(0.3)
		let gapAction = cc.sequence(cc.spawn(action1, action2), cc.callFunc(() => {
			this.gap.getChildByName('left').x = -window.winSize.width - this.gap.getChildByName('left').width / 2
			this.gap.getChildByName('right').x = +window.winSize.width + this.gap.getChildByName('right').width / 2
			this.gap.y = window.winSize.height + this.gap.height
			let actionLeft = cc.moveTo(0.3, -this.gapWeight / 2, 0)
			let actionRight = cc.moveTo(0.3, this.gapWeight / 2, 0)
			this.gap.getChildByName('left').runAction(actionLeft)
			this.gap.getChildByName('right').runAction(actionRight)
		}), cc.spawn(action3, action4))
		this.gap.runAction(gapAction)
	},
	gameOver() {
		if (this.status == 1 && this.playerStatus == 1) {
			this.status = 2
			this.playerStatus = 3
			this.operateDialog(2, 1)
		}
	},

	successPunch() {
		this.playerStatus = 2
		let action = cc.moveBy(0.1, 0, window.winSize.height / 2 + this.target.height)
		if (this.isSuccess()) {
			this.onLevelSuccess()
		} else {
			this.target.runAction(cc.sequence(action, cc.callFunc(() => {
				this.initTarget(0)
				this.initGamePos()
				this.chain.addChain(this)
			})))
		}
	},
	isSuccess() {

		return false
	},

	// -------------- 页面更换 -------------------
	/**
	 * 操作弹框
	 * @param {*} target 传Node则直接操作Node 传数字则去dialogs中取对应的
	 * @param {*} operation 操作方式 1打开 0关闭
	 */
	operateDialog(target, operation) {
		let action = ''
		if (typeof (target) == 'number') {
			target = this.dialogs[target]
		}
		if (operation) {
			target.scale = 0.5
			target.active = true
			action = AC.popOut(0.5)
		} else {
			action = cc.sequence(AC.popIn(0.5), cc.callFunc(() => {
				target.active = false
			}))
		}
		target.runAction(action)
	},
	openDialogBtn(e, d) {
		this.operateDialog(+d, 1)
	},
	closeDialogBtn(e, d) {
		this.operateDialog(+d, 0)
	},
	showPageBtn(e, d) {
		this.showPage(+d)
	},
	showPage(num) {
		this.closeAllDialogs(+num)
		this.operateDialog(+num, 1)
	},
	closeAllDialogs(num) {
		for (let i = 0; i < this.dialogs.length; i++) {
			if (num == i || (i == 1 && num != 0)) continue
			this.operateDialog(i, 0)
		}
	},
	//--------------- 实现方法 -----------------
	playerRush() {
		this.player.y += 20 * (this.player.scale - 1) * 0.5 + 40
	},
	playerBack() {
		if (this.playerGetBigger) {
			this.player.scale = this.player.scale > this.config.maxScale ? this.config.maxScale : this.player.scale + 0.05 * this.config.increaseMultiple
		} else {
			this.player.scale = this.player.scale < 1 ? 1 : this.player.scale - 0.05 * this.config.reduceMultiple
		}
		if (this.player.y > -window.winSize.height / 2 + this.config.targetOriginPos) {
			this.player.y -= (this.player.y + window.winSize.height / 2 - this.config.playerOriginPos) / 50
		} else {
			this.player.y = -window.winSize.height / 2 + this.config.targetOriginPos
		}
	},
	failRebound() {
		if (this.player.y > -window.winSize.height / 2 + this.config.targetOriginPos) {
			this.player.y -= (this.player.y + window.winSize.height / 2 - this.config.playerOriginPos) / 100
		} else {
			this.player.y = -window.winSize.height / 2 + this.config.playerOriginPos
		}
	},
	checkIsBig(frist, last) {
		return frist.width * frist.scale > last.width * last.scale
	},
});