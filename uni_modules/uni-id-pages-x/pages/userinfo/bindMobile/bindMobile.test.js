jest.setTimeout(30000)
const PAGE_PATH = '/uni_modules/uni-id-pages-x/pages/userinfo/bindMobile/bindMobile'
describe('bindMobile', () => {
	let page,captcha,smsCodeEl;
	beforeAll(async () => {
    // 避免页面加载过慢，超过自动化测试框架等待时间超时退出
    await new Promise(((resolve)=>{
      setTimeout(()=>{
        resolve()
      },8000)
    }))
		page = await program.navigateTo(PAGE_PATH)
		await page.waitFor('view')
		await page.setData({isTest:true})
		captcha = "1234"
		smsCodeEl = await page.$('#smsCodeTest')
	});
  // 随机生成手机号
  function generateRandomPhoneNumber() {
    const prefixes = ['130', '131', '132', '133', '134', '135', '136', '137', '138', '139', '150', '151', '152', '153', '155', '156', '157', '158', '159', '180', '181', '182', '183', '184', '185', '186', '187', '188', '189'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const areaCode = Math.floor(1000 + Math.random() * 9000).toString();
    const randomNumber = Math.floor(1000 + Math.random() * 9000).toString();
    const phoneNumber = prefix + areaCode + randomNumber;
    return phoneNumber;
  }

  // 设置验证码
  async function setCaptcha(){
    const needCaptcha = await page.data('needCaptcha')
    if(needCaptcha){
    	await page.setData({captcha:captcha})
    }
  }
  // 设置短信验证码
  async function setSmsCode(mobile){
    await smsCodeEl.setData({
    	mobile:mobile,
    	sendSmsCaptcha:captcha
    })
    await page.waitFor(1000)
    await smsCodeEl.setData({
    	smsCode:"123456"
    })
    await setCaptcha()
  }

  async function getRes(){
    const startTime = Date.now()
    // 等待登录结果
    await page.waitFor(async () => {
      if(Date.now()-startTime >8000){
        console.log('-----------timeout----------')
        return true
      }
    	return await page.data('testState') === true
    })
    const testSuccessRes = await page.data('testSuccess')
    console.log("testSuccessRes：",testSuccessRes,"testState：",await page.data('testState'))
    if(testSuccessRes<100){
      return testSuccessRes
    }else{
      const testErrRes = await page.data('testErr')
      return testErrRes
    }
  }

	it('绑定手机号', async () => {
    const phone1 = generateRandomPhoneNumber()
    console.log('phone1: ',phone1);
    await setSmsCode(phone1)
    const res = await getRes()
    console.log('res: ',res);
		if(res<100){
			console.log('绑定成功');
			expect(res).toBe(0)
			return
		}else{
			switch (res.errCode){
				case 'uni-id-bind-conflict':
					const expectBindStr = ["此账号已被绑定","This account has been bound"]
					expect(expectBindStr).toContain(res.errMsg);
          await setSmsCode(generateRandomPhoneNumber())
          const res1 = await getRes()
          console.log('res1: ',res1);
					break;
				case 'uni-id-mobile-verify-code-error':
					const expectCodeStr = ["手机验证码错误或已过期","Verify code error or expired"]
					expect(expectCodeStr).toContain(res.errMsg);
					break;
				case 'uni-id-captcha-required':
          const requiredStr = ["请输入图形验证码","Captcha required"]
					expect(requiredStr).toContain(res.errMsg)
          await setCaptcha()
          await setSmsCode(generateRandomPhoneNumber())
          const res2 = await getRes()
          console.log('res2: ',res2);
					break;
				default:
          console.log('未知错误')
					break;
			}
		}
	});
});
