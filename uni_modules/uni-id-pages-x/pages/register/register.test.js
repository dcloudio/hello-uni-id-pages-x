// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/


describe('/uni_modules/uni-id-pages-x/pages/register/register', () => {
	let page;
	beforeAll(async () => {
		page = await program.navigateTo('/uni_modules/uni-id-pages-x/pages/register/register')
		await page.waitFor('view')
	});

	it('register', async () => {
		const agreeEl = await page.$('uni-id-pages-x-agreements')
		expect(await agreeEl.data('needAgreements')).toBe(true)
		// setAgree
		await agreeEl.callMethod('confirm')
		await page.setData({
			username: "dcloud88",
			nickname: "",
			password: "dcloud2023",
			captcha: "1234",
			password2: "dcloud2023"
		})
		await page.callMethod('registerBefore')
		// 等待登录结果
		await page.waitFor(async () => {
			return await page.data('testState') === true
		}) 
		const loginSuccess = await page.data('testSuccess')
		// console.log('loginSuccess: ',loginSuccess);
		if(loginSuccess.errCode === 0){
			expect(loginSuccess.uid).toHaveLength(24)
		}
		const loginErr = await page.data('testErr')
		console.log('loginErr: ',loginErr);
		if(loginErr.errCode){
			switch (loginErr.errCode){
				case 'uni-id-account-exists':
					const expectStr = ["此账号已注册","Account exists"]
					expect(expectStr).toContain(loginErr.errMsg);
					break;
				default:
					console.log('err--')
					break;
			}
		}
	});

});