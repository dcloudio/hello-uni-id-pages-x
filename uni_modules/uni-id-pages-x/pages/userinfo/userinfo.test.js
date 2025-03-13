// 从index页面跳到userinfo页面，设置showLoginManage=true
const PAGE_PATH = '/uni_modules/uni-id-pages-x/pages/userinfo/userinfo?showLoginManage=true'
describe('userinfo', () => {
	let page,login;
	beforeAll(async () => {
		page = await program.navigateTo(PAGE_PATH)
		await page.waitFor('view')
    login = await page.callMethod('getIsLogin')
	});
  if (!login) {
    it('未登录', async () => {
      expect(1).toBe(1)
    })
    return
  }
	it('昵称-手机号', async () => {
		const values = await page.$$('.value')
		await page.waitFor(500)
    if(values.length == 2){
      // 昵称
      expect(await values[0].text()).toBeTruthy();
      // 手机号
      expect(await values[1].text()).toHaveLength(11)
    }
	});
	it('退出登录', async () => {
		await page.waitFor(1000)
		const titleList = await page.$$('.title')
		expect(titleList.length).toBe(6)
		expect(await titleList[5].text()).toBe('退出登录')
		await page.callMethod('logout')
	});
});
