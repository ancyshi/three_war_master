cc.Class({
  extends: cc.Component,

  properties: {
    sprite: cc.Sprite
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},
  init(g, data) {
    this._game = g
    this.data = data
    this.isHave = g.PD.characters.some(item => {
      item == data.number
    })
    this.sprite.spriteFrame = g.characterSF[this.data.number]
  },
  start() {

  },
  closeChoose() {
    this.getChildByName('choose').active = false
    this.getChildByName('choosebg').active = false
  },
  openChoose() {
    this.getChildByName('choose').active = true
    this.getChildByName('choosebg').active = true
  },
  chooseCharacter() {
    this._game.switchCharacter(this.data.number, this.sprite.spriteFrame)
  },
  // update (dt) {},
});