jest.setTimeout(30000)
const PAGE_PATH = '/uni_modules/uni-id-pages-x/pages/userinfo/bindMobile/bindMobile'
describe('bindMobile', () => {
	let page,captcha,smsCodeEl;
	beforeAll(async () => {
		page = await program.navigateTo(PAGE_PATH)
		await page.waitFor('view')
		await page.setData({isTest:true})
		captcha = "1234"
		smsCodeEl = await page.$('#smsCodeTest')
    console.log('smsCodeEl',smsCodeEl)
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

  async function setCaptcha(){
    const needCaptcha = await page.data('needCaptcha')
    if(needCaptcha){
    	await page.setData({captcha:captcha})
    }
  }
  async function setSmsCode(mobile){
    // console.log("data----",await page.data())
    // console.log("smsCodeEl---data",await smsCodeEl.data())
    await smsCodeEl.setData({
    	mobile:mobile,
    	sendSmsCaptcha:captcha
    })
    await page.waitFor(1000)
    await smsCodeEl.setData({
    	smsCode:"123456"
    })
    await setCaptcha()
    await page.waitFor(2000)
  }

  async function getRes(){
    const startTime = Date.now()
    console.log('startTime',startTime)
    console.log('testState-----------',await page.data('testState'))
    // 等待登录结果
    await page.waitFor(async () => {
      // if(Date.now()-startTime >5000){
      //   console.log('-----------timeout----------')
      //   return true
      // }
    	return await page.data('testState') === true
    })
    console.log('afterTime',Date.now())
    console.log('-----------testState',await page.data('testState'))
    const testSuccessRes = await page.data('testSuccess')
    console.log('testSuccessRes: ',testSuccessRes);
    if(testSuccessRes<100){
      return testSuccess
    }else{
      const testErrRes = await page.data('testErr')
      return testErrRes
    }
  }

	it('绑定手机号', async () => {
    const phone1 = generateRandomPhoneNumber()
    console.log('phone1: ',phone1);
    // {mobile: "15566666666", code: "123456", sendSmsCaptcha: "1234"}
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
					break;
				default:
          console.log('未知错误')
					break;
			}
		}
	});
});
