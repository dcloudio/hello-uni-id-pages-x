// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/
jest.setTimeout(30000)
const PAGE_PATH = '/uni_modules/uni-id-pages-x/pages/login/login'
describe('loginByPwd', () => {
  let page, agreeEl, loginByPwdEl, loginBySmsCodeEl, smsCodeEl, loginSuccess, loginErr;
  beforeAll(async () => {
    page = await program.reLaunch(PAGE_PATH)
    await page.waitFor('view')
    console.log("UNI_PLATFORM: ",process.env.UNI_UTS_PLATFORM);
    console.log("data:----0 ",await page.data());
  });
  it('切换登录方式：密码登录', async () => {
    await page.setData({
      loginType: "username"
    })
    console.log("data:----2",await page.data());
    expect(await page.data('loginType')).toBe('username')
    const title = await page.$('.pwd-login-title')
    expect(await title.text()).toBe('账号密码登录')
    // ios web 没支持通过标签名取组件，用 class。
    loginByPwdEl = await page.$('.loginByPwdTest')
    console.log("loginByPwdEl", loginByPwdEl)
    await loginByPwdEl.setData({isTest: true })
    // console.log("isTest", await loginByPwdEl.data('isTest'))
  });
  it('跳转到注册账号页面', async () => {
    await loginByPwdEl.callMethod('toRegister')
    await page.waitFor(1000)
    expect((await program.currentPage()).path).toBe(
      'uni_modules/uni-id-pages-x/pages/register/register')
    expect((await program.navigateBack()).path).toBe('uni_modules/uni-id-pages-x/pages/login/login')
  });
  it('跳转到忘记密码页面', async () => {
    await loginByPwdEl.callMethod('toRetrievePwd')
    await page.waitFor(1000)
    expect((await program.currentPage()).path).toBe(
      'uni_modules/uni-id-pages-x/pages/retrieve/retrieve')
    expect((await program.navigateBack()).path).toBe('uni_modules/uni-id-pages-x/pages/login/login')
  });
  it('登录账号', async () => {
    // uni-id-pages-x-loginByPwd --》uni-id-pages-x-agreements--》.agreementsPwdTest 组件中的组件加class用page.$获取数据
    agreeEl = await page.$('.agreementsPwdTest')
    console.log('agreeEl',agreeEl)
    console.log('agreeEl------------',await agreeEl.data())
    console.log('page------------',await page.data())
    expect(await agreeEl.data('needAgreements')).toBe(true)
    // setAgree
    await agreeEl.callMethod('confirm')
    await loginByPwdEl.setData({
      username: "dcloud88",
      password: "dcloud2023",
      needCaptcha: false
    })
    const loginByPwdRes = await loginByPwdEl.callMethod('loginByPwd')
    console.log('loginByPwdRes: ', loginByPwdRes);
    if (typeof loginByPwdRes == 'string') {
      await page.waitFor(2000)
      expect(loginByPwdRes).toHaveLength(24)
    } else {
      switch (loginByPwdRes.errCode) {
        case 'uni-id-account-not-exists':
          const expectStr = ["此账号未注册", "Account does not exists"]
          expect(expectStr).toContain(loginByPwdRes.errMsg);
          break;
        case 'uni-id-password-error':
          expect(loginByPwdRes.errMsg).toBe('密码错误')
          break;
        case 'uni-id-captcha-required':
          expect(loginByPwdRes.errMsg).toBe('请输入图形验证码')
          break;
        default:
          console.log('err--')
          break;
      }
    }
  });
  // it('smsCode-setData', async () => {
  //   page = await program.redirectTo(PAGE_PATH)
  //   await page.waitFor(2000)
  //   // const fabLogin = await page.$('uni-id-pages-x-fab-login')
  //   // await fabLogin.tap()
  //   // console.log('fabLogin: ',await page.data('loginType'));
  //   await page.setData({
  //     loginType: "smsCode"
  //   })
  //   loginBySmsCodeEl = await page.$('.loginBySmsCodeTest')
  //   smsCodeEl = await page.$('.smsCodeSmsTest')
  //   console.log('smsCodeEl',smsCodeEl,await smsCodeEl.data())
  //   // smsCodeEl = await loginBySmsCodeEl.$('.smsCodeTest')
  //   await smsCodeEl.setData({
  //     mobile: "17755555555",
  //     sendSmsCaptcha: "1234",
  //   })
  // });

  // it('smsCode-agree', async () => {
  //   agreeEl = await page.$('.agreementsSmsTest')
  //   console.log('agreeEl---2',agreeEl)
  //   expect(await agreeEl.data('needAgreements')).toBe(true)
  //   await agreeEl.callMethod('confirm')
  //   await page.waitFor(100)
  // });

  // it('smsCode-callMethod', async () => {
  //   await smsCodeEl.callMethod('sendSmsCode', true)
  //   await page.waitFor(500)
  //   await smsCodeEl.setData({
  //     smsCode: "123456"
  //   })
  // });

  // it('手机验证码', async () => {
  //   // 等待登录结果
  //   const startTime = Date.now()
  //   await page.waitFor(async () => {
  //     if(Date.now()-startTime >10000){
  //       console.log('-----------timeout----------')
  //       return true
  //     }
  //     return await loginBySmsCodeEl.data('testState') === true
  //   })
  //   loginSuccess = await loginBySmsCodeEl.data('testSuccess')
  //   console.log('loginSuccess:---2 ', loginSuccess);
  //   if (typeof loginSuccess == 'string') {
  //     expect(loginSuccess).toHaveLength(24)
  //     return
  //   } else {
  //     loginErr = await loginBySmsCodeEl.data('testErr')
  //     console.log('loginErr:---2 ', loginErr);
  //     switch (loginErr.errCode) {
  //       case 'uni-id-account-not-exists':
  //         expect(loginErr.errMsg).toBe('Account does not exists')
  //         break;
  //       case 'uni-id-mobile-verify-code-error':
  //         expect(loginErr.errMsg).toBe('手机验证码错误或已过期')
  //         break;
  //       case 'uni-id-captcha-required':
  //         expect(loginErr.errMsg).toBe('请输入图形验证码')
  //         await loginBySmsCodeEl.setData({
  //           captcha: "1234"
  //         })
  //         break;
  //       default:
  //         console.log('err--')
  //         break;
  //     }
  //   }
  // });
});
