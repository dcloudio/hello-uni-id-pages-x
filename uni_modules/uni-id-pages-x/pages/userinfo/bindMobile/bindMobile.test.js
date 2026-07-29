// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/
const TEST_STATE_TIMEOUT = 10000
const TEST_STATE_INTERVAL = 500
const CAPTCHA_REQUIRED_MESSAGES = ['请输入图形验证码', 'Captcha required']

async function waitForTestState(page) {
	const startTime = Date.now()
	while (Date.now() - startTime < TEST_STATE_TIMEOUT) {
		if (await page.data('data.testState') === true) {
			return true
		}
		await page.waitFor(TEST_STATE_INTERVAL)
	}
	return false
}

function waitForMs(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms)
	})
}

describe('/uni_modules/uni-id-pages-x/pages/userinfo/bindMobile/bindMobile.uvue', () => {

	let page,mobile,captcha,smsCode,bindMobileBySmsRes;
	beforeAll(async () => {
		page = await program.navigateTo('/uni_modules/uni-id-pages-x/pages/userinfo/bindMobile/bindMobile')
		await page.waitFor('view')
	});
	it('setData', async () => {
		mobile = "17766666666"
		captcha = "1234"
		smsCode = "123456"
		const bindMobileParam = {
			mobile,
			code: smsCode,
			sendSmsCaptcha: captcha
		}
		bindMobileBySmsRes = await page.callMethod('bindMobileBySmsForTest', JSON.stringify(bindMobileParam))
		console.log('bindMobileBySmsRes: ',bindMobileBySmsRes);
		await page.waitFor(100)
	});
	it('绑定手机号', async () => {
		if (bindMobileBySmsRes != null) {
			if (bindMobileBySmsRes.errCode == 0) {
				console.log('绑定成功');
				expect(bindMobileBySmsRes.errCode).toBe(0)
				await waitForMs(400)
				return
			}
			if (bindMobileBySmsRes.errCode) {
				assertBindMobileError(bindMobileBySmsRes)
				return
			}
		}

		// 等待登录结果
		const hasBindResult = await waitForTestState(page)
		expect(hasBindResult).toBe(true)
		const testSuccessRes = await page.data('data.testSuccess')
		if (testSuccessRes == 0 || (bindMobileBySmsRes != null && bindMobileBySmsRes.errCode == 0)) {
			console.log('绑定成功');
			expect(testSuccessRes).toBe(0)
			await waitForMs(400)
			return
		}
		const testErrRes = await page.data('data.testErr')
		console.log('testErrRes: ',testErrRes);
		assertBindMobileError(testErrRes)
	});
});

function assertBindMobileError(error) {
	switch (error.errCode){
		case 'uni-id-bind-conflict':
			const expectBindStr = ["此账号已被绑定","This account has been bound"]
			expect(expectBindStr).toContain(error.errMsg);
			break;
		case 'uni-id-mobile-verify-code-error':
			const expectCodeStr = ["手机验证码错误或已过期","Verify code error or expired"]
			expect(expectCodeStr).toContain(error.errMsg);
			break;
		case 'uni-id-captcha-required':
			expect(CAPTCHA_REQUIRED_MESSAGES).toContain(error.errMsg)
			break;
		default:
			expect([
				'uni-id-bind-conflict',
				'uni-id-mobile-verify-code-error',
				'uni-id-captcha-required'
			]).toContain(error.errCode)
			break;
	}
}
