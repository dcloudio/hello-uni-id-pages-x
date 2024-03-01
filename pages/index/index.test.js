// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/
jest.setTimeout(60000)
describe('pages/index/index.uvue', () => {
  let page, currentPage, listItems, platform;
  beforeAll(async () => {
    platform = process.env.UNI_PLATFORM
    page = await program.reLaunch('/pages/index/index')
    await page.waitFor('view')
    listItems = await page.$$('.list-item')
  });
  it('openName', async () => {
    const openName = await page.$('.openName-text')
    expect(await openName.text()).toBe('未登录')
  });
  it('text', async () => {
    const itemTexts = await page.$$('.list-item-text')
    console.log(await itemTexts[0].text())
    console.log(await itemTexts[1].text())
    expect(await itemTexts[0].text()).toBe('手机验证码登录')
    expect(await itemTexts[1].text()).toBe('账号密码登录')
    // if (platform != "h5") {
    //   console.log(await itemTexts[2].text())
    //   expect(await itemTexts[2].text()).toBe('一键登录')
    // }
  });
  it('手机验证码登录', async () => {
    await listItems[0].tap()
    if(platform == 'h5'){await page.waitFor(20000)}
    currentPage = await program.currentPage()
    console.log('currentPage: ', currentPage);
    expect(currentPage.path).toBe("uni_modules/uni-id-pages-x/pages/login/login")
    expect(currentPage.query.type).toBe("smsCode")
    await program.navigateBack()
  });
  it('账号密码登录', async () => {
    await listItems[1].tap()
    if(platform == 'h5'){await page.waitFor(5000)}
    currentPage = await program.currentPage()
    expect(currentPage.path).toBe("uni_modules/uni-id-pages-x/pages/login/login")
    expect(currentPage.query.type).toBe("username")
  });
});
