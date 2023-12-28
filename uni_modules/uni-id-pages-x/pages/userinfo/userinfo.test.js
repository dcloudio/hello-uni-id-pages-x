// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/

describe('/uni_modules/uni-id-pages-x/pages/userinfo/userinfo.uvue', () => {
	let page;
	beforeAll(async () => {
		page = await program.navigateTo('/uni_modules/uni-id-pages-x/pages/userinfo/userinfo')
		await page.waitFor('view')
		// console.log("pageStack",await program.pageStack())
	});
	it('昵称', async () => {
		const values = await page.$$('.value')
		await page.waitFor(500)
		console.log('values:--0 ',await values[0].text());
		console.log('values:--1',await values[1].text());
		expect(["dcloud99","dcloud00"]).toContain(await values[0].text())
		expect(await values[1].text()).toHaveLength(11)
	});
	it('退出登录', async () => {
		await page.waitFor(1000)
		const titleList = await page.$$('.title')
		expect(titleList.length).toBe(6)
		expect(await titleList[5].text()).toBe('退出登录')
		await page.callMethod('logout')
		// console.log("currentPage",await program.currentPage())
	});
});
