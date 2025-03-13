jest.setTimeout(10000)
const PAGE_PATH = '/uni_modules/uni-id-pages-x/pages/register/register'
describe('register', () => {
	let page;
	beforeAll(async () => {
		page = await program.reLaunch(PAGE_PATH)
		await page.waitFor('view')
	});
	it('register', async () => {
    expect.assertions(2);
    // console.log("agreements-root",await page.$('.agreements-root'))
		// const agreeEl = await page.$('uni-id-pages-x-agreements')
    const agreeEl = await page.$('.agreementsTest')
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
		// console.log('registerRes: ',registerRes);
		if(typeof registerRes == 'string'){
			expect(registerRes).toHaveLength(24)
			return
		}else{
			switch (registerRes.errCode){
				case 'uni-id-account-exists':
					const accountStr = ["此账号已注册","Account exists"]
					expect(accountStr).toContain(registerRes.errMsg);
					break;
        case 'uni-captcha-verify-fail':
        	const captchaStr = ["验证码错误","Account exists"]
        	expect(captchaStr).toContain(registerRes.errMsg);
        	break;
        case 'SYS_ERR':
        	const SYSStr = ["系统错误","request system error"]
        	expect(SYSStr).toContain(registerRes.errMsg);
        	break;
				default:
					console.log('未知错误')
					break;
			}
		}
	});
});
