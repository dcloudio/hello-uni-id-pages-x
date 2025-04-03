jest.setTimeout(30000)
const PAGE_PATH_NAME = '/uni_modules/uni-id-pages-x/pages/login/login?type=username'
const PAGE_PATH_SMS = '/uni_modules/uni-id-pages-x/pages/login/login?type=smsCode'
const platformInfo = process.env.uniTestPlatformInfo.toLocaleLowerCase()
const isHarmony = platformInfo.startsWith('harmony')
describe('loginByPwd', () => {
  let page, agreeEl, loginByPwdEl, loginBySmsCodeEl, smsCodeEl, loginSuccess, loginErr;
  beforeAll(async () => {
    platform = process.env.UNI_UTS_PLATFORM
    page = await program.reLaunch(PAGE_PATH_NAME)
    await page.waitFor('view')
  });
  it('切换登录方式：密码登录', async () => {
    expect(await page.data('loginType')).toBe('username')
    const title = await page.$('.pwd-login-title')
    expect(await title.text()).toBe('账号密码登录')
    // ios web 没支持通过标签名取组件，用 class。
    loginByPwdEl = await page.$('.loginByPwdTest')
    await loginByPwdEl.setData({isTest: true })
  });
  async function resetPassword(){
    await loginByPwdEl.setData({
      username: "dcloud88",
      password: "dcloud2023",
      needCaptcha: false
    })
    await page.waitFor(300)
    const res = await loginByPwdEl.callMethod('loginByPwd')
    return res
  }
  it('登录账号', async () => {
    // expect.assertions(2);
    // uni-id-pages-x-loginByPwd --》uni-id-pages-x-agreements--》.agreementsPwdTest 组件中的组件加class用page.$获取数据
    // 兼容微信小程序
    if(process.env.UNI_PLATFORM == 'mp-weixin'){
      agreeEl = await loginByPwdEl.$('#agreementsPwdTest')
    }else{
      agreeEl = await page.$('#agreementsPwdTest')
    }
    expect(await agreeEl.data('needAgreements')).toBe(true)
    // setAgree
    await agreeEl.callMethod('confirm')
    await loginByPwdEl.setData({
      username: "dcloud88",
      password: "dcloud2023",
      needCaptcha: false
    })
    const loginByPwdRes = await loginByPwdEl.callMethod('loginByPwd')
    console.log('账号密码登录结果:', loginByPwdRes);
    if (typeof loginByPwdRes == 'string') {
      expect(loginByPwdRes).toHaveLength(24)
    } else {
      switch (loginByPwdRes.errCode) {
        case 'uni-id-password-error':
          // 密码错误
          const loginByPwdRes1 = await resetPassword()
          console.log('uni-id-password-error: ', loginByPwdRes1);
          break;
        case 'uni-id-captcha-required':
          // 请输入图形验证码
          await loginByPwdEl.setData({
            loginCaptcha: "1234"
          })
          await page.waitFor(300)
          const loginByPwdRes2 = await loginByPwdEl.callMethod('loginByPwd')
          console.log('uni-id-captcha-required: ', loginByPwdRes2);
          if(loginByPwdRes2.errCode == 'uni-id-password-error'){
            const loginByPwdRes3 = await resetPassword()
            console.log('uni-id-password-error: ', loginByPwdRes3);
          }
          break;
        // case 'uni-id-account-not-exists':
        //   const expectStr = ["此账号未注册", "Account does not exists"]
        //   expect(expectStr).toContain(loginByPwdRes.errMsg);
        //   break;
        default:
          console.log('未知错误')
          break;
      }
    }
  });
  it('smsCode-setData', async () => {
    page = await program.redirectTo(PAGE_PATH_SMS)
    await page.waitFor(2000)
    // const fabLogin = await page.$('uni-id-pages-x-fab-login')
    // await fabLogin.tap()
    // console.log('fabLogin: ',await page.data('loginType'));
    expect(await page.data('loginType')).toBe('smsCode')

    // 截图，检验验证码是否正常显示
    if(!isHarmony){
      const image = await program.screenshot({deviceShot: true});
      expect(image).toSaveImageSnapshot();
      await page.waitFor(500);
    }

    loginBySmsCodeEl = await page.$('.loginBySmsCodeTest')
    smsCodeEl = await page.$('.smsCodeSmsTest')
    // smsCodeEl = await loginBySmsCodeEl.$('.smsCodeTest')
    await smsCodeEl.setData({
      mobile: "17755555555",
      sendSmsCaptcha: "1234",
    })
  });

  it('smsCode-agree', async () => {
    // 兼容微信小程序
    if(process.env.UNI_PLATFORM == 'mp-weixin'){
      agreeEl = await loginBySmsCodeEl.$('#agreementsSmsTest')
    }else{
      agreeEl = await page.$('#agreementsSmsTest')
    }
    expect(await agreeEl.data('needAgreements')).toBe(true)
    await agreeEl.callMethod('confirm')
    await page.waitFor(100)
  });

  it('smsCode-callMethod', async () => {
    await smsCodeEl.callMethod('sendSmsCode', true)
    await page.waitFor(500)
    await smsCodeEl.setData({
      smsCode: "123456"
    })
  });

  it('手机验证码', async () => {
    // expect.assertions(1);
    // 等待登录结果
    const startTime = Date.now()
    await page.waitFor(async () => {
      if(Date.now()-startTime >8000){
        console.log('-----------timeout----------')
        return true
      }
      return await loginBySmsCodeEl.data('testState') === true
    })
    loginSuccess = await loginBySmsCodeEl.data('testSuccess')
    console.log('手机验证码登录结果： ', loginSuccess);
    if (typeof loginSuccess == 'string') {
      expect(loginSuccess).toHaveLength(24)
    } else {
      loginErr = await loginBySmsCodeEl.data('testErr')
      console.log('手机验证码登录--失败： ', loginErr);
      switch (loginErr.errCode) {
        case 'uni-id-captcha-required':
          // 请输入图形验证码
          expect(loginErr.errMsg).toBe('请输入图形验证码')
          await loginBySmsCodeEl.setData({
            captcha: "1234"
          })
          break;
        case 'uni-id-account-not-exists':
          expect(loginErr.errMsg).toBe('Account does not exists')
          break;
        case 'uni-id-mobile-verify-code-error':
          expect(loginErr.errMsg).toBe('手机验证码错误或已过期')
          break;
        default:
          console.log('未知错误')
          break;
      }
    }
  });
});
