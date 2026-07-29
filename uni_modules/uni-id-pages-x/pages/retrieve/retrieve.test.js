// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/
const TEST_STATE_TIMEOUT = 10000
const TEST_STATE_INTERVAL = 500
const RESET_SUCCESS_REDIRECT_DELAY = 1700
const INDEX_PATH = '/pages/index/index'
const PAGE_PATH = '/uni_modules/uni-id-pages-x/pages/retrieve/retrieve'
const RESET_PASSWORD = 'dcloud2023'
const RESET_PWD_IMAGE_CAPTCHA = '1234'
const SEND_SMS_CODE_CREATED_CODES = [0, 'uni-id-invalid-sms-template-id']

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

describe('/uni_modules/uni-id-pages-x/pages/retrieve/retrieve.uvue', () => {

	let page,mobile,sendSmsCaptcha,smsCode,resetPwdImageCaptchaRes,sendResetPwdSmsCodeRes,resetPwdBySmsRes;
	beforeAll(async () => {
		await program.reLaunch(INDEX_PATH)
		page = await program.navigateTo(PAGE_PATH)
		await page.waitFor('view')
	});
	it('重置密码', async () => {
		mobile = "17766666666"
		sendSmsCaptcha = "1234"
		smsCode = "123456"
		const resetPwdParam = {
			mobile,
			code: smsCode,
			sendSmsCaptcha
		}
		sendResetPwdSmsCodeRes = await page.callMethod(
			'sendResetPwdSmsCodeForTest',
			JSON.stringify(resetPwdParam)
		)
		console.log('sendResetPwdSmsCodeRes: ',sendResetPwdSmsCodeRes);
		expect(sendResetPwdSmsCodeRes).toBeTruthy()
		expect(SEND_SMS_CODE_CREATED_CODES).toContain(sendResetPwdSmsCodeRes.errCode)

		resetPwdImageCaptchaRes = await page.callMethod('createResetPwdImageCaptchaForTest')
		console.log('resetPwdImageCaptchaRes: ',resetPwdImageCaptchaRes);
		expect(resetPwdImageCaptchaRes).toBeTruthy()
		expect(resetPwdImageCaptchaRes.errCode).toBe(0)

		resetPwdBySmsRes = await page.callMethod(
			'resetPwdBySmsForTest',
			JSON.stringify(resetPwdParam),
			RESET_PASSWORD,
			RESET_PASSWORD,
			RESET_PWD_IMAGE_CAPTCHA
		)
		console.log('resetPwdBySmsRes: ',resetPwdBySmsRes);
		await page.waitFor(100)
		//等待登录结果
		const hasResetPwdResult = await waitForTestState(page)
		expect(hasResetPwdResult).toBe(true)
		expect(resetPwdBySmsRes).toBeTruthy()
		expect(resetPwdBySmsRes.errCode).toBe(0)
		const testSuccessRes = await page.data('data.testSuccess')
		console.log('重置成功');
		expect(testSuccessRes).toBe(0)
		await waitForMs(RESET_SUCCESS_REDIRECT_DELAY)
		
	});
	
});
