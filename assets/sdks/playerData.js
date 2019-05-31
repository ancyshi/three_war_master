/**
 * @des 处理用户数据
 */
let isWeChat = (cc.sys.platform == cc.sys.WECHAT_GAME);
let PlayerData = {
	saveData(key, value) {
		key = key || 'playerData'
		if (isWeChat) {

		} else {
			cc.sys.localStorage.setItem(key, value)
		}
	},
	isFirstTime() {
		return cc.sys.localStorage.getItem('isPlayed')
	},
	loadData(key) {
		key = key || 'playerData'
		let initPlayerData = {
			level: 1,
			money: 0,
			atk: 1,
			blood: 10,
			character: 0, //当前选择的人 0为默认
			characters: [], //对应的是否拥有角色
		}
		if (isWeChat) {

		} else {
			return JSON.parse(cc.sys.localStorage.getItem(key)) || initPlayerData
		}
	},

	/**
	 * @des 获取最高分
	 */
	getHighestScore() {

	},
}
export default PlayerData;