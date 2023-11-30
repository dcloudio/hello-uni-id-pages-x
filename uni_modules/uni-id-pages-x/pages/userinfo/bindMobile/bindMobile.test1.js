// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/
jest.setTimeout(20000)
describe('/uni_modules/uni-id-pages-x/pages/userinfo/bindMobile/bindMobile.uvue', () => {
	let page,captcha,smsCodeEl;
	beforeAll(async () => {
		page = await program.navigateTo('/uni_modules/uni-id-pages-x/pages/userinfo/bindMobile/bindMobile')
		await page.waitFor('view')
		await page.setData({isTest:true})
		console.log("isTest",await page.data('isTest'))
		captcha = "1234"
		smsCodeEl = await page.$('uni-id-pages-x-smsCode')
	});
	it('setData', async () => {
		await smsCodeEl.setData({
			mobile:"17766666666",
			sendSmsCaptcha:captcha
		})
		await page.waitFor(1000)
		await smsCodeEl.setData({
			smsCode:"123456"
		})
	});
	
	it('setData--captcha', async () => {
		const needCaptcha = await page.data('needCaptcha')
		if(needCaptcha){
			await page.setData({captcha:captcha})
		}
	});
	
	it('绑定手机号', async () => {
		await page.waitFor(1000)
		// 等待登录结果
		await page.waitFor(async () => {
			return await page.data('testState') === true
		}) 
		const testSuccessRes = await page.data('testSuccess')
		console.log('testSuccessRes: ',testSuccessRes);
		if(testSuccessRes<100){
			console.log('绑定成功');
			expect(testSuccessRes).toBe(0)
			return
		}else{
			const testErrRes = await page.data('testErr')
			console.log('testErrRes: ',testErrRes);
			switch (testErrRes.errCode){
				case 'uni-id-bind-conflict':
					const expectBindStr = ["此账号已被绑定","This account has been bound"]
					expect(expectBindStr).toContain(testErrRes.errMsg);
					break;
				case 'uni-id-mobile-verify-code-error':
					const expectCodeStr = ["手机验证码错误或已过期","Verify code error or expired"]
					expect(expectCodeStr).toContain(testErrRes.errMsg);
					break;
				case 'uni-id-captcha-required':
					expect(testErrRes.errMsg).toBe('请输入图形验证码')
					break;
				default:
					break;
			}
		}
	});
});
