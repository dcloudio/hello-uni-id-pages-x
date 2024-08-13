// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/
jest.setTimeout(20000)
const PAGE_PATH = '/uni_modules/uni-id-pages-x/pages/retrieve/retrieve'
describe('retrieve', () => {
	let page,mobile,captcha,smsCode,smsCodeEl;
	beforeAll(async () => {
		page = await program.navigateTo(PAGE_PATH)
		await page.waitFor('view')
		await page.setData({isTest:true})
		smsCodeEl = await page.$('.smsCodeTest')
    await page.waitFor(1000)
    // mobile = "17766666666"
    // sendSmsCaptcha = "1234"
    // smsCode = "123456"
	});
	it('重置密码-setData', async () => {
		await smsCodeEl.setData({
			mobile:"17755555555",
			sendSmsCaptcha:"1234"
		})
		await page.setData({
			password:"2023dcloud",
			password2:"2023dcloud"
		})
		await smsCodeEl.setData({smsCode:"123456"})
	});
  async function getRes(){
    const startTime = Date.now()
    await page.waitFor(500)
    await page.callMethod('doNext')
    //等待登录结果
    await page.waitFor(async () => {
      if(Date.now()-startTime >10000){
        console.log('-----------timeout----------')
        return true
      }
    	return await page.data('testState') === true
    })
    const testSuccessRes = await page.data('testSuccess')
    if(testSuccessRes<100){
      return testSuccessRes
    }else{
      const testErrRes = await page.data('testErr')
      return testErrRes
    }
  }
	it('重置密码', async () => {
    expect.assertions(1);
    const res = await getRes()
    console.log('res: ',res);
		if(res < 100){
			console.log('重置成功');
			expect(res).toBe(0)
			return
		}else{
			switch (res.errCode){
				case 'uni-id-mobile-verify-code-error':
					const expecVerifytStr = ["手机验证码错误或已过期","Verify code error or expired"]
					expect(expecVerifytStr).toContain(res.errMsg);
					break;
				case 'uni-id-captcha-required':
          const requiredStr = ["请输入图形验证码","Captcha required"]
					expect(requiredStr).toContain(res.errMsg)
          await page.setData({captcha:captcha})
          const res1 = await getRes()
          console.log('res1: ',res1);
					break;
				default:
					break;
			}
		}
	});

});
