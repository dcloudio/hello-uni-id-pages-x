// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/

describe('pages/index/index.uvue', () => {

	const LOGIN_PATH = "uni_modules/uni-id-pages-x/pages/login/login"
	const INDEX_PATH = '/pages/index/index'
	const WAIT_PAGE_TIMEOUT = 3000
	const WAIT_PAGE_INTERVAL = 100

	let page,currentPage,listItems;
	beforeAll(async () => {
		page = await program.reLaunch(INDEX_PATH)
		await page.waitFor('view')
		listItems = await page.$$('.list-item')
	});

	function waitForMs(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms)
		})
	}

	async function waitForCurrentPagePath(path) {
		const startTime = Date.now()
		let currentPage = await program.currentPage()
		while (Date.now() - startTime < WAIT_PAGE_TIMEOUT) {
			currentPage = await program.currentPage()
			if (currentPage.path === path) {
				return currentPage
			}
			await waitForMs(WAIT_PAGE_INTERVAL)
		}
		return currentPage
	}
	
	it('text', async () => {
		const itemTexts = await page.$$('.list-item-text')
		expect(await itemTexts[0].text()).toBe('手机验证码登录')
		expect(await itemTexts[1].text()).toBe('账号密码登录')
	});
	it('手机验证码登录', async () => {
		await listItems[0].tap()
		currentPage = await waitForCurrentPagePath(LOGIN_PATH)
		console.log('await program.currentPage(): ',await program.currentPage());
		expect(currentPage.path).toBe(LOGIN_PATH)
		expect(currentPage.query.type).toBe("smsCode")
		await program.navigateBack()
		page = await program.currentPage()
		await page.waitFor('view')
		listItems = await page.$$('.list-item')
	});
	it('账号密码登录', async () => {
		expect(await page.data('pageData.loginType')).toBe('nickname')
		await listItems[1].tap()
		console.log('await program.currentPage(): ',await program.currentPage());
		currentPage = await waitForCurrentPagePath(LOGIN_PATH)
		expect(currentPage.path).toBe(LOGIN_PATH)
		expect(currentPage.query.type).toBe("username")
	});
});
