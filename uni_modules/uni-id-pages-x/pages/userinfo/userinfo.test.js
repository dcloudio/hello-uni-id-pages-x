// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/

describe('/uni_modules/uni-id-pages-x/pages/userinfo/userinfo.uvue', () => {
	let page;
	beforeAll(async () => {
		page = await program.navigateTo('/uni_modules/uni-id-pages-x/pages/userinfo/userinfo')
		await page.waitFor('view')
	});
	it('昵称', async () => {
		const values = await page.$$('.value')
		expect(["dcloud99","dcloud00"]).toContain(await values[0].text())
		expect(await values[1].text()).toHaveLength(11)
	});
	it('退出登录', async () => {
		const logoutElement = await page.$('.logout')
		expect(await logoutElement.text()).toBe('退出登录')
		await page.callMethod('logout')
	});
});