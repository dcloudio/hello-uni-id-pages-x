// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/

describe('pages/index/index.uvue', () => {

	let page,currentPage;
	beforeAll(async () => {
		// page = await program.reLaunch('/pages/index/index')
		page = await program.currentPage()
		await page.waitFor('view')
	});
	
	it('账号密码登录', async () => {
		const type = await page.data('loginType')
		expect(type).toBe('username')
		await page.callMethod('toLogin')
		currentPage = await program.currentPage()
		expect(currentPage.path).toBe("uni_modules/uni-id-pages-x/pages/login/login")
		expect(currentPage.query.type).toBe("username")
	});
	
	it('手机验证码', async () => {
		await page.setData({
			loginType:"smsCode"
		})
		await page.callMethod('toLogin')
		currentPage = await program.currentPage()
		expect(currentPage.path).toBe("uni_modules/uni-id-pages-x/pages/login/login")
		expect(currentPage.query.type).toBe("smsCode")
	});
	
});

