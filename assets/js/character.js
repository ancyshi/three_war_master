cc.Class({
  extends: cc.Component,

  properties: {
    sprite: cc.Sprite
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},
  init(c, data) {
    this._choosePage = c
    this.data = data
    this.isHave = c._game.PD.characters.some(item => {
      item == data.number
    })
    this.sprite.spriteFrame = c.characterSF[this.data.number]
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
    this._choosePage.switchCharacter(this.data.number, this.sprite.spriteFrame)
  },
  // update (dt) {},
});