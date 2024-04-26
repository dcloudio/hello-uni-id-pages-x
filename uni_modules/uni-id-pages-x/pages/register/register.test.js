// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/
jest.setTimeout(20000)
const PAGE_PATH = '/uni_modules/uni-id-pages-x/pages/register/register'
describe('register', () => {
	let page;
	beforeAll(async () => {
		page = await program.navigateTo(PAGE_PATH)
		await page.waitFor('view')
		await page.setData({isTest: true})
		console.log("isTest",await page.data('isTest'))
	});
	it('register', async () => {
    expect.assertions(2);
		const agreeEl = await page.$('uni-id-pages-x-agreements')
    console.log("agreeEl",agreeEl)
    console.log("data----needAgreements",await agreeEl.data('needAgreements'))
    await page.waitFor(1000)
		expect(await agreeEl.data('needAgreements')).toBe(true)
		// setAgree
		await agreeEl.callMethod('confirm')
    await page.waitFor(1000)
		await page.setData({
			username: "dcloud88",
			nickname: "",
			password: "dcloud2023",
			captcha: "1234",
			password2: "dcloud2023"
		})
		const registerRes =  await page.callMethod('register')
		console.log('registerRes: ',registerRes);
		if(typeof registerRes == 'string'){
			expect(registerRes).toHaveLength(24)
			return
		}else{
			switch (registerRes.errCode){
				case 'uni-id-account-exists':
					const expectStr = ["此账号已注册","Account exists"]
					expect(expectStr).toContain(registerRes.errMsg);
					break;
				default:
					console.log('err--')
					break;
			}
		}
	});
});
