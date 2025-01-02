// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/
jest.setTimeout(10000)
describe('pages/index/index.uvue', () => {
  let page, currentPage, listItems, platform;
  beforeAll(async () => {
    platform = process.env.UNI_UTS_PLATFORM
    page = await program.reLaunch('/pages/index/index')
    await page.waitFor('view')
    listItems = await page.$$('.list-item')
    console.log('listItems',listItems.length)
  });
  it('openName', async () => {
    const openName = await page.$('.openName-text')
    expect(await openName.text()).toBe('未登录')
  });
  it('text', async () => {
    const itemTexts = await page.$$('.list-item-text')
    expect(await itemTexts[0].text()).toBe('手机验证码登录')
    expect(await itemTexts[1].text()).toBe('账号密码登录')
    if (platform == "app-plus") {
      expect(await itemTexts[2].text()).toBe('一键登录')
    }
  });
  it('手机验证码登录', async () => {
    await listItems[0].tap()
    await page.waitFor('view')
    await page.waitFor(1000)
    currentPage = await program.currentPage()
    console.log('currentPage: ', currentPage);
    expect(currentPage.path).toBe("uni_modules/uni-id-pages-x/pages/login/login")
    expect(currentPage.query.type).toBe("smsCode")
    await program.navigateBack()
    await page.waitFor(5000)
  });
  it('账号密码登录', async () => {
    await listItems[1].tap()
    // await page.callMethod('toLogin','username')
    await page.waitFor('view')
    await page.waitFor(1000)
    currentPage = await program.currentPage()
    console.log('currentPage: ', currentPage);
    expect(currentPage.path).toBe("uni_modules/uni-id-pages-x/pages/login/login")
    expect(currentPage.query.type).toBe("username")
  });
});
