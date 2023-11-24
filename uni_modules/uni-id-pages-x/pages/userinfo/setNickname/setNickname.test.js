// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/

describe('/uni_modules/uni-id-pages-x/pages/userinfo/setNickname/setNickname.uvue', () => {
	let page,nickname;
	beforeAll(async () => {
		page = await program.redirectTo('/uni_modules/uni-id-pages-x/pages/userinfo/setNickname/setNickname')
		await page.waitFor('view')
	});
	it('设置昵称', async () => {
		// expect.assertions(1);
		nickname = await page.data('nickname')
		console.log('nickname: ',nickname,nickname == null);
		if(!nickname || nickname == "dcloud99"){
			nickname = "dcloud00";
		}else{
			nickname = "dcloud99";  
		}
		await page.setData({nickname})
		await page.waitFor(300)
		const res = await page.callMethod('setNickname')
		console.log('res: ',nickname,res);
		// expect(res).toBe(1)
	});
});