// uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/

const fs = require('fs')
const path = require('path')

const PAGE_PATH = '/pages/test-account-cleaner/test-account-cleaner'
const REGISTERED_E2E_TEST_ACCOUNTS_FILE = path.join(
	process.cwd(),
	'.hbuilderx',
	'registered-e2e-test-accounts.json'
)

function readRegisteredE2eTestAccounts() {
	if (!fs.existsSync(REGISTERED_E2E_TEST_ACCOUNTS_FILE)) {
		return []
	}
	return JSON.parse(fs.readFileSync(REGISTERED_E2E_TEST_ACCOUNTS_FILE, 'utf8'))
}

function writeRemainingRegisteredE2eTestAccounts(accounts) {
	if (accounts.length === 0) {
		if (fs.existsSync(REGISTERED_E2E_TEST_ACCOUNTS_FILE)) {
			fs.unlinkSync(REGISTERED_E2E_TEST_ACCOUNTS_FILE)
		}
		return
	}
	fs.mkdirSync(path.dirname(REGISTERED_E2E_TEST_ACCOUNTS_FILE), { recursive: true })
	fs.writeFileSync(REGISTERED_E2E_TEST_ACCOUNTS_FILE, JSON.stringify(accounts, null, 2))
}

describe('/pages/test-account-cleaner/test-account-cleaner', () => {
	let page;

	beforeAll(async () => {
		page = await program.reLaunch(PAGE_PATH)
		await page.waitFor('view')
	});

	it('delete registered e2e test accounts', async () => {
		const accounts = readRegisteredE2eTestAccounts()
		const remainingAccounts = []
		const failedResults = []

		for (const account of accounts) {
			const deleteAccountRes = await page.callMethod('deleteRegisteredE2eTestAccount', JSON.stringify(account))
			console.log('deleteRegisteredE2eTestAccountRes: ', deleteAccountRes)
			if (deleteAccountRes == null || deleteAccountRes.errCode !== 0) {
				remainingAccounts.push(account)
				failedResults.push({
					account,
					result: deleteAccountRes
				})
			}
		}

		writeRemainingRegisteredE2eTestAccounts(remainingAccounts)
		if (failedResults.length > 0) {
			throw new Error(`delete registered e2e test accounts failed: ${JSON.stringify(failedResults)}`)
		}

		expect(remainingAccounts).toHaveLength(0)
	});
});
