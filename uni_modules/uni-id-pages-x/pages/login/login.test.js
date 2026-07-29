// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/
const PAGE_PATH = '/uni_modules/uni-id-pages-x/pages/login/login'
const INDEX_PATH = '/pages/index/index'
const TEST_STATE_TIMEOUT = 10000
const TEST_STATE_INTERVAL = 500
const LOGIN_SUCCESS_REDIRECT_DELAY = 1700
const EXPECTED_LOGIN_ERROR_MESSAGES = {
	'uni-id-account-not-exists': ['Account does not exists'],
	'uni-id-mobile-verify-code-error': ['手机验证码错误或已过期', 'Verify code error or expired'],
	'uni-id-captcha-required': ['请输入图形验证码']
}

// 手机验证码登录测试链路：
// 1. 进入登录页后切到 smsCode。
// 2. 自动确认协议，再给短信验证码组件写入手机号和图形验证码。
// 3. 自动化测试不走弹框输入验证码，直接调用测试入口 loginBySmsCodeForTest，入口内部仍调用原 login 方法。
// 4. 登录结果写入组件暴露的 reactive data，测试轮询 data.testState 后验证 data.testSuccess 或 data.testErr。
async function waitForLoginTestState(page, loginBySmsCodeEl) {
	const startTime = Date.now()
	while (Date.now() - startTime < TEST_STATE_TIMEOUT) {
		if (loginBySmsCodeEl == null) {
			return false
		}
		if (await loginBySmsCodeEl.data('data.testState') === true) {
			return true
		}
		await page.waitFor(TEST_STATE_INTERVAL)
	}
	return false
}

function waitFor(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
}

async function openLoginPage() {
	await program.reLaunch(INDEX_PATH)
	await program.navigateTo(PAGE_PATH)
	const currentPage = await program.currentPage()
	await currentPage.waitFor('view')
	return currentPage
}

describe('loginByPwd', () => {
	let page,loginType,agreeEl,loginByPwdEl,loginBySmsCodeEl,smsCodeEl,loginSuccess,loginErr,loginBySmsCodeRes;
	beforeAll(async () => {
		page = await openLoginPage()
		await page.setData({
			data: {
				loginType: "username"
			}
		})
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
		if(typeof loginByPwdRes == 'string'){
			expect(loginByPwdRes).toHaveLength(24)
			await waitFor(LOGIN_SUCCESS_REDIRECT_DELAY)
			return;
		}
		if(loginByPwdRes.uid){
			expect(loginByPwdRes.uid).toHaveLength(24)
			await waitFor(LOGIN_SUCCESS_REDIRECT_DELAY)
			return;
		}else{
			switch (loginByPwdRes.errCode) {
				case 'uni-id-account-not-exists':
					expect(loginByPwdRes.errMsg).toBe('Account does not exists')
					break;
				default:
					console.log('登录账号err')
					break;
			}
		}
	});
	it('smsCode-setData', async () => {
		// 重新从首页进入登录页，避免前一个账号登录用例的延迟 navigateBack 影响页面栈。
		page = await openLoginPage()
		await page.setData({
			data:{
				loginType: "smsCode",
				// smsCode: "123456"
			}
		})
		await page.waitFor(100)
		loginBySmsCodeEl = await page.$('.test-loginBySmsCode')
		expect(loginBySmsCodeEl).toBeTruthy()

		agreeEl = await page.$('.agreements-box')
		console.log('smsCode-agree',agreeEl)
		expect(agreeEl).toBeTruthy()
		expect(await agreeEl.data('data.needAgreements')).toBe(true)
		await agreeEl.callMethod('confirm')
		await page.waitFor(100)

		smsCodeEl = await page.$('.test-smsCode')
		expect(smsCodeEl).toBeTruthy()
		await smsCodeEl.setData({
			data:{
				mobile: "17755555555",
				sendSmsCaptcha: "1234",
				// smsCode: "123456"
			}
		})
		console.log('手机验证码---smsCodeEl:', await smsCodeEl.data());

	});


	it('smsCode-callMethod', async () => {
		// 跳过弹框输入验证码，直接调用组件测试入口触发真实登录逻辑。
		const smsLoginParam = {
			mobile: "17755555555",
			code: "123456",
			sendSmsCaptcha: "1234"
		}
		console.log('手机验证码---smsCodeEl:', await smsCodeEl.data());
		loginBySmsCodeRes = await loginBySmsCodeEl.callMethod('loginBySmsCodeForTest', JSON.stringify(smsLoginParam))
		console.log('手机验证码---loginBySmsCodeRes:', loginBySmsCodeRes);
		await page.waitFor(100)

	});

	it('手机验证码', async () => {
		// 等待组件 reactive data 中的登录结果，并校验成功 uid 或明确错误码。
		const hasLoginResult = await waitForLoginTestState(page, loginBySmsCodeEl)
		if (!hasLoginResult) {
			console.log('手机验证码---等待登录结果超时，testState未变为true');
		}
		expect(hasLoginResult).toBe(true)

		loginSuccess = await loginBySmsCodeEl.data('data.testSuccess')
		console.log('手机验证码---loginSuccess:', loginSuccess);
		if (loginSuccess.uid || (loginBySmsCodeRes != null && loginBySmsCodeRes.uid)) {
			if (loginBySmsCodeRes != null && loginBySmsCodeRes.uid) {
				expect(loginBySmsCodeRes.uid).toHaveLength(24)
			}
			if (loginSuccess.uid) {
				expect(loginSuccess.uid).toHaveLength(24)
			}
			return
		}

		loginErr = await loginBySmsCodeEl.data('data.testErr')
		console.log('手机验证码---loginErr:', loginErr);
		expect(loginErr.errCode).toBeTruthy()
		if (loginBySmsCodeRes != null && loginBySmsCodeRes.errCode) {
			expect(loginBySmsCodeRes.errCode).toBe(loginErr.errCode)
		}

		switch (loginErr.errCode) {
			case 'uni-id-account-not-exists':
				expect(EXPECTED_LOGIN_ERROR_MESSAGES[loginErr.errCode]).toContain(loginErr.errMsg)
				break;
			case 'uni-id-mobile-verify-code-error':
				expect(EXPECTED_LOGIN_ERROR_MESSAGES[loginErr.errCode]).toContain(loginErr.errMsg)
				break;
			case 'uni-id-captcha-required':
				expect(EXPECTED_LOGIN_ERROR_MESSAGES[loginErr.errCode]).toContain(loginErr.errMsg)
				break;
			default:
				expect([
					'uni-id-account-not-exists',
					'uni-id-mobile-verify-code-error',
					'uni-id-captcha-required'
				]).toContain(loginErr.errCode)
				break;
		}
	});
});
