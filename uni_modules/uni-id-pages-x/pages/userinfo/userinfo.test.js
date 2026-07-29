// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/

describe('/uni_modules/uni-id-pages-x/pages/userinfo/userinfo.uvue', () => {
	let page;
	beforeAll(async () => {
		page = await program.navigateTo('/uni_modules/uni-id-pages-x/pages/userinfo/userinfo')
		await page.waitFor('view')
	});
	it('昵称', async () => {
		const values = await page.$$('.item-value')
		expect(values.length).toBeGreaterThanOrEqual(1)
		expect(["dcloud99","dcloud00"]).toContain(await values[0].text())
	});
	it('退出登录', async () => {
		const titleList = await page.$$('.item-title')
		expect(titleList.length).toBe(5)
		expect(await titleList[4].text()).toBe('退出登录')
		await page.callMethod('logout')
		await new Promise((resolve) => {
			setTimeout(resolve, 1500)
		})
	});
});
