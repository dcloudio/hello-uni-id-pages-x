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
	it('账号密码登录', async () => {
		loginType = await page.data('data.loginType')
		expect(loginType).toBe('username')
		loginByPwdEl = await page.$('.test-loginByPwd')
		console.log('loginByPwdEl',loginByPwdEl)
		const title = await page.$('.pwd-login-title')
		expect(await title.text()).toBe('账号密码登录')
	});
	it('跳转到注册账号页面', async () => {
		await loginByPwdEl.callMethod('toRegister')
		await page.waitFor(500)
		expect((await program.currentPage()).path).toBe(
			'uni_modules/uni-id-pages-x/pages/register/register')
		// 执行 navigateBack 验证是否返回
		expect((await program.navigateBack()).path).toBe('uni_modules/uni-id-pages-x/pages/login/login')
	});
	it('跳转到忘记密码页面', async () => {
		await loginByPwdEl.callMethod('toRetrievePwd')
		await page.waitFor(500)
		expect((await program.currentPage()).path).toBe(
			'uni_modules/uni-id-pages-x/pages/retrieve/retrieve')
		expect((await program.navigateBack()).path).toBe('uni_modules/uni-id-pages-x/pages/login/login')
	});
	it('登录账号', async () => {
		agreeEl = await page.$('.agreements-box')
		expect(await agreeEl.data('data.needAgreements')).toBe(true)
		// setAgree
		await agreeEl.callMethod('confirm')
		await loginByPwdEl.setData({
			data:{
				username: "dcloud88",
				password: "dcloud2023",
				needCaptcha: false
			}
		})
		
		const loginByPwdRes = await loginByPwdEl.callMethod('loginByPwd')
		console.log('登录账号--loginByPwdRes: ',loginByPwdRes);
		if(loginByPwdRes.uid){
			expect(loginByPwdRes.uid).toHaveLength(24)
			return;
		}else{
			switch (loginByPwdRes.errCode) {
				case 'uni-id-account-not-exists':
					expect(loginByPwdRes.errMsg).toBe('Account does not exists')
					break;
				default:
					console.log('err--')
					break;
			}
		}
	});
	it('smsCode-setData', async () => {
		page = await program.redirectTo(PAGE_PATH)
		await page.waitFor(1000)
		await page.setData({
			data: {
				loginType: "smsCode"
			}
		})
		loginBySmsCodeEl = await page.$('.test-loginBySmsCode')
		smsCodeEl = await page.$('.test-smsCode')
		await smsCodeEl.setData({
			data:{
				mobile: "17755555555",
				sendSmsCaptcha: "1234",
			}
		})
		
	});
	
	it('smsCode-agree', async () => {
		agreeEl = await page.$('.agreements-box')
		expect(await agreeEl.data('data.needAgreements')).toBe(true)
		await agreeEl.callMethod('confirm')
		await page.waitFor(100)
	});
	
	it('smsCode-callMethod', async () => {
		await smsCodeEl.callMethod('sendSmsCode')
		await page.waitFor(500)
		await smsCodeEl.setData({
			data:{
				smsCode: "123456"
			}
		})
	});
	
	it('手机验证码', async () => {
		// 等待登录结果
		await page.waitFor(async () => {
			return await loginBySmsCodeEl.data('testState') === true
		})
		loginSuccess = await loginBySmsCodeEl.data('testSuccess')
		console.log('手机验证码---loginSuccess:', loginSuccess);
		if (loginSuccess.errCode === 0) {
			expect(loginSuccess.uid).toHaveLength(24)
		}
		loginErr = await loginBySmsCodeEl.data('testErr')
		console.log('手机验证码---loginErr:', loginErr);
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
					break;
				default:
					console.log('err--')
					break;
			}
		}
	});
});
