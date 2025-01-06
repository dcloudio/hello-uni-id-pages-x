// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/
jest.setTimeout(20000)
describe('pages/index/index.uvue', () => {
  let page, currentPage, listItems, platform;
  const platformInfo = process.env.uniTestPlatformInfo.toLocaleLowerCase()
  console.log('platformInfo',platformInfo)
  const isAndroid = platformInfo.startsWith('android')
  const isIos = platformInfo.startsWith('ios')
  const isApp = isAndroid || isIos
  platform = process.env.UNI_UTS_PLATFORM
  console.log('platform',platform)
  beforeAll(async () => {
    page = await program.reLaunch('/pages/index/index')
    await page.waitFor('view')
    listItems = await page.$$('.list-item')
    console.log('listItems',listItems.length)
    await page.waitFor(1000)
  });
  it('openName', async () => {
    const openName = await page.$('.openName-text')
    expect(await openName.text()).toBe('未登录')
  });
  it('text', async () => {
    const itemTexts = await page.$$('.list-item-text')
    expect(await itemTexts[0].text()).toBe('手机验证码登录')
    expect(await itemTexts[1].text()).toBe('账号密码登录')
    console.log('--',platform == "app-plus",isApp)
    if (isApp) {
      expect(await itemTexts[2].text()).toBe('一键登录')
      expect(listItems.length).toBe(3)
    }else{
      expect(listItems.length).toBe(2)
    }
  });
  // it('手机验证码登录', async () => {
  //   // await page.callMethod("toLogin","smsCode")
  //   await listItems[0].tap()
  //   await page.waitFor('view')
  //   await page.waitFor(3000)
  //   currentPage = await program.currentPage()
  //   console.log('currentPage: ', currentPage);
  //   expect(currentPage.path).toBe("uni_modules/uni-id-pages-x/pages/login/login")
  //   expect(currentPage.query.type).toBe("smsCode")
  //   await program.navigateBack()
  //   await page.waitFor(5000)
  // });
  // it('账号密码登录', async () => {
  //   await listItems[1].tap()
  //   // await page.callMethod('toLogin','username')
  //   await page.waitFor('view')
  //   await page.waitFor(1000)
  //   currentPage = await program.currentPage()
  //   console.log('currentPage: ', currentPage);
  //   expect(currentPage.path).toBe("uni_modules/uni-id-pages-x/pages/login/login")
  //   expect(currentPage.query.type).toBe("username")
  // });
});
