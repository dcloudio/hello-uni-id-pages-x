// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/
const PAGE_PATH = '/uni_modules/uni-id-pages-x/pages/login/login'

describe('loginByPwd', () => {
	let page,loginType,agreeEl,loginByPwdEl,loginBySmsCodeEl,smsCodeEl,loginSuccess,loginErr;
	beforeAll(async () => {
		page = await program.reLaunch(PAGE_PATH)
		await page.waitFor('view')
		// console.log('pageStack: ',await program.pageStack());
		// console.log('currentPage: ',await program.currentPage());
	});

	// it('账号密码登录', async () => {
	// 	expect(await page.data('loginType')).toBe('username')
	// 	const resaa = await page.$('.pwd-login-title')
	// 	expect(await resaa.text()).toBe('账号密码登录')
	// });

	// it('跳转到注册账号页面', async () => {
	// 	await loginByPwdEl.callMethod('toRegister')
	// 	expect((await program.currentPage()).path).toBe(
	// 		'uni_modules/uni-id-pages-x/pages/register/register')
	// 	// 执行 navigateBack 验证是否返回
	// 	expect((await program.navigateBack()).path).toBe('uni_modules/uni-id-pages-x/pages/login/login')
	// });
	// it('跳转到忘记密码页面', async () => {
	// 	await loginByPwdEl.callMethod('toRetrievePwd')
	// 	expect((await program.currentPage()).path).toBe(
	// 		'uni_modules/uni-id-pages-x/pages/retrieve/retrieve')
	// 	expect((await program.navigateBack()).path).toBe('uni_modules/uni-id-pages-x/pages/login/login')
	// });

	it('登录账号', async () => {
		
		agreeEl = await page.$('uni-id-pages-x-agreements')
		expect(await agreeEl.data('needAgreements')).toBe(true)
		
		loginType = await page.data('loginType')
		if (loginType == 'username') {
			loginByPwdEl = await page.$('uni-id-pages-x-loginByPwd')
		}
		// setAgree
		await agreeEl.callMethod('confirm')
		await loginByPwdEl.setData({
			username: "dcloud88",
			password: "dcloud2023",
			needCaptcha: false
		})
		await loginByPwdEl.callMethod('loginByPwd')
		// 等待登录结果
		await page.waitFor(async () => {
			return await loginByPwdEl.data('testState') === true
		})
		loginSuccess = await loginByPwdEl.data('testSuccess')
		console.log('loginSuccess:---1 ', loginSuccess);
		if (loginSuccess.errCode === 0) {
			expect(loginSuccess.uid).toHaveLength(24)
		}
		loginErr = await loginByPwdEl.data('testErr')
		console.log('loginErr:---1 ', loginErr);
		if (loginErr.errCode) {
			switch (loginErr.errCode) {
				case 'uni-id-account-not-exists':
					expect(loginErr.errMsg).toBe('Account does not exists')
					break;
				default:
					console.log('err--')
					break;
			}
		}
	});
	
	
	it('smsCode', async () => {
		page = await program.redirectTo(PAGE_PATH)
		await page.waitFor(1000)
		await page.setData({
			loginType: "smsCode"
		})
		loginBySmsCodeEl = await page.$('uni-id-pages-x-loginBySmsCode')
		smsCodeEl = await page.$('uni-id-pages-x-smsCode')
		await smsCodeEl.setData({
			mobile: "17755555555",
			sendSmsCaptcha: "1234",
		})
		agreeEl = await page.$('uni-id-pages-x-agreements')
		expect(await agreeEl.data('needAgreements')).toBe(true)
		await agreeEl.callMethod('confirm')
	});
	
	
	it('手机验证码', async () => {
		await smsCodeEl.callMethod('sendSmsCode')
		await page.waitFor(500)
		await smsCodeEl.setData({
			smsCode: "123456"
		})
		// 等待登录结果
		await page.waitFor(async () => {
			return await loginBySmsCodeEl.data('testState') === true
		})
		loginSuccess = await loginBySmsCodeEl.data('testSuccess')
		console.log('loginSuccess:---2 ', loginSuccess);
		if (loginSuccess.errCode === 0) {
			expect(loginSuccess.uid).toHaveLength(24)
		}
		loginErr = await loginBySmsCodeEl.data('testErr')
		console.log('loginErr:---2 ', loginErr);
		if (loginErr.errCode) {
			switch (loginErr.errCode) {
				case 'uni-id-account-not-exists':
					expect(loginErr.errMsg).toBe('Account does not exists')
					break;
				case 'uni-id-mobile-verify-code-error':
					expect(loginErr.errMsg).toBe('手机验证码错误或已过期')
					break;
				case 'uni-id-captcha-required':
					expect(loginErr.errMsg).toBe('请输入图形验证码')
					await loginBySmsCodeEl.setData({
						captcha:"1234"
					})
					// await loginBySmsCodeEl.callMethod('smsCodeInput')
					break;
				default:
					console.log('err--')
					break;
			}
		}
	});

});


