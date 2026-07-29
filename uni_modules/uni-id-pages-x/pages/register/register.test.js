// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/

const fs = require('fs')
const path = require('path')

const REGISTERED_E2E_TEST_ACCOUNTS_FILE = path.join(
	process.cwd(),
	'.hbuilderx',
	'registered-e2e-test-accounts.json'
)

describe('/uni_modules/uni-id-pages-x/pages/register/register', () => {
	const LOGIN_SUCCESS_REDIRECT_DELAY = 1700
	let page;
	let registeredTestAccountUsername = ''
	let registerStartedAt = 0

	function createTestUsername() {
		return `e2etest${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
	}

	function waitFor(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms)
		})
	}

	function readRegisteredE2eTestAccounts() {
		if (!fs.existsSync(REGISTERED_E2E_TEST_ACCOUNTS_FILE)) {
			return []
		}
		return JSON.parse(fs.readFileSync(REGISTERED_E2E_TEST_ACCOUNTS_FILE, 'utf8'))
	}

	function appendRegisteredE2eTestAccount(account) {
		const accounts = readRegisteredE2eTestAccounts()
		accounts.push(account)
		fs.mkdirSync(path.dirname(REGISTERED_E2E_TEST_ACCOUNTS_FILE), { recursive: true })
		fs.writeFileSync(REGISTERED_E2E_TEST_ACCOUNTS_FILE, JSON.stringify(accounts, null, 2))
	}

	beforeAll(async () => {
		page = await program.navigateTo('/uni_modules/uni-id-pages-x/pages/register/register')
		await page.waitFor('view')
	});

	it('register', async () => {
		// const agreeEl = await page.$('uni-id-pages-x-agreements')
		const agreeEl = await page.$('.agreements-box')
		expect(await agreeEl.data('data.needAgreements')).toBe(true)
		// setAgree
		await agreeEl.callMethod('confirm')
		registeredTestAccountUsername = createTestUsername()
		registerStartedAt = Date.now()
		await page.setData({
			data: {
				username: registeredTestAccountUsername,
				nickname: "",
				password: "dcloud2023",
				captcha: "1234",
				password2: "dcloud2023"
			}
		})
		const registerRes =  await page.callMethod('register')
		console.log('registerRes: ',registerRes);
		let registeredTestAccountUid = ''
		if(typeof registerRes == 'string'){
			expect(registerRes).toHaveLength(24)
			registeredTestAccountUid = registerRes
		} else if(registerRes != null && registerRes.uid){
			expect(registerRes.uid).toHaveLength(24)
			registeredTestAccountUid = registerRes.uid
		} else {
			throw new Error(`register failed: ${JSON.stringify(registerRes)}`)
		}

		appendRegisteredE2eTestAccount({
			uid: registeredTestAccountUid,
			username: registeredTestAccountUsername,
			createdAfter: registerStartedAt
		})
		await waitFor(LOGIN_SUCCESS_REDIRECT_DELAY)
	});

});
