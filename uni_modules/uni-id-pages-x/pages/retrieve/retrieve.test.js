// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/

describe('/uni_modules/uni-id-pages-x/pages/retrieve/retrieve.uvue', () => {

	let page,mobile,captcha,smsCode;
	beforeAll(async () => {
		page = await program.navigateTo('/uni_modules/uni-id-pages-x/pages/retrieve/retrieve')
		await page.waitFor('view')
	});
	
	it('重置密码', async () => {
		mobile = "17766666666"
		captcha = "1234"
		smsCode = "123456"
		const smsCodeEl = await page.$('uni-id-pages-x-smsCode')
		await smsCodeEl.setData({
			mobile,
			captcha
		})
		await page.setData({
			password:"2023dcloud",
			password2:"2023dcloud"
		})
		await page.callMethod('doNext')
		await smsCodeEl.setData({smsCode})
		// 等待登录结果
		await page.waitFor(async () => {
			return await page.data('testState') === true
		}) 
		const testSuccessRes = await page.data('testSuccess')
		// console.log('testSuccessRes: ',testSuccessRes);
		if(testSuccessRes == 0){
			console.log('重置成功');
			expect(testSuccessRes).toBe(0)
			return
		}
		const testErrRes = await page.data('testErr')
		console.log('testErrRes: ',testErrRes);
		switch (testErrRes.errCode){
			case 'uni-id-mobile-verify-code-error':
				const expecVerifytStr = ["手机验证码错误或已过期","Verify code error or expired"]
				expect(expecVerifytStr).toContain(testErrRes.errMsg);
				break;
			case 'uni-id-captcha-required':
				expect(testErrRes.errMsg).toBe('请输入图形验证码');
				break;
			default:
				break;
		}
	});
	
});
