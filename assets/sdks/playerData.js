/**
 * @des 处理用户数据
 */
let isWeChat = (cc.sys.platform == cc.sys.WECHAT_GAME);
let PlayerData = {
	/**
	 * 存储数据
	 * @param {*} key 标识
	 * @param {*} value 值
	 */
	saveData(key, value) {
		key = key || 'playerData'
		value = JSON.stringify(value)

		if (isWeChat) {
			wx.setStorageSync({
				key: key,
				value: value
			})
		} else {
			cc.sys.localStorage.setItem(key, value)
		}
	},
	/**
	 * 检测是否是第一次游戏
	 */
	isFirstTime() {
		let isFirst = false
		if (isWeChat && !wx.getStorageSync('isFirst')) {
			wx.setStorageSync({
				key: 'isFirst',
				value: "1"
			})
			isFirst = true
		} else if (!cc.sys.localStorage.getItem('isFirst')) {
			cc.sys.localStorage.setItem('isFirst', "1")
			isFirst = true
		}
		return false
	},
	/**
	 * 加载数据 先于第一次检测
	 * @param {*} key 返回玩家数据
	 */
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
			return wx.getStorageSync('isFirst') ?JSON.parse(wx.getStorageSync(key))  : initPlayerData
		} else {
			return cc.sys.localStorage.getItem('isFirst') ?JSON.parse(cc.sys.localStorage.getItem(key))  : initPlayerData
		}
	},

	/**
	 * @des 获取最高分
	 */
	getHighestScore() {

	},
}
export default PlayerData;