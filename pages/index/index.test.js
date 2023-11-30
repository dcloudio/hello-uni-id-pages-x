// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/

describe('pages/index/index.uvue', () => {

	let page,currentPage,listItems;
	beforeAll(async () => {
		// page = await program.reLaunch('/pages/index/index')
		page = await program.currentPage()
		await page.waitFor('view')
		listItems = await page.$$('.list-item')
	});
	
	it('openName', async () => {
		const openName = await page.$('.openName-text')
		expect(await openName.text()).toBe('未登录')
	});
	
	it('text', async () => {
		const itemTexts = await page.$$('.list-item-text')
		expect(await itemTexts[0].text()).toBe('手机验证码登录')
		expect(await itemTexts[1].text()).toBe('账号密码登录')
	});
	it('手机验证码登录', async () => {
		await listItems[0].tap()
		currentPage = await program.currentPage()
		// console.log('currentPage: ',await program.currentPage());
		expect(currentPage.path).toBe("uni_modules/uni-id-pages-x/pages/login/login")
		expect(currentPage.query.type).toBe("smsCode")
		await program.navigateBack()
	});
	it('账号密码登录', async () => {
		await listItems[1].tap()
		currentPage = await program.currentPage()
		expect(currentPage.path).toBe("uni_modules/uni-id-pages-x/pages/login/login")
		expect(currentPage.query.type).toBe("username")
	});
});

