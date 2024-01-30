// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/
const PAGE_PATH = '/uni_modules/uni-id-pages-x/pages/userinfo/userinfo'
describe('userinfo', () => {
	let page,login;
	beforeAll(async () => {
		page = await program.navigateTo(PAGE_PATH)
		await page.waitFor('view')
		// console.log("pageStack",await program.pageStack())
	});
  it('是否登录', async () => {
    login = await page.callMethod('getIsLogin')
    console.log('login',login);
    if(login){await page.setData({showLoginManage:true})}
  });
	it('昵称', async () => {
    if(!login)return
		const values = await page.$$('.value')
		await page.waitFor(500)
		console.log('values:--0 ',await values[0].text());
		console.log('values:--1',await values[1].text());
		expect(["dcloud99","dcloud00"]).toContain(await values[0].text())
		expect(await values[1].text()).toHaveLength(11)
	});
	it('退出登录', async () => {
		await page.waitFor(1000)
    if(!login)return
		const titleList = await page.$$('.title')
		expect(titleList.length).toBe(6)
		expect(await titleList[5].text()).toBe('退出登录')
		await page.callMethod('logout')
	});
});
