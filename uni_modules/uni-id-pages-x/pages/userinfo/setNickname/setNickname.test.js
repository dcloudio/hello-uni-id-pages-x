jest.setTimeout(30000)
const PAGE_PATH = '/uni_modules/uni-id-pages-x/pages/userinfo/setNickname/setNickname'
describe('setNickname', () => {
	let page;
	beforeAll(async () => {
		page = await program.navigateTo(PAGE_PATH)
		await page.waitFor('view')
    await page.setData({'isTest':true})
	});
  // 随机昵称
  function generateRandomString(prefix) {
    var randomNumber = Math.floor(Math.random() * 100);
    var formattedNumber = randomNumber.toString().padStart(2, '0');
    return prefix + formattedNumber;
  }
  it('设置昵称', async () => {
    const nicknameNew = generateRandomString('dcloud');
    console.log('nicknameNew',nicknameNew)
    await page.setData({
      "nickname": nicknameNew
    })
    await page.waitFor(2000)
    console.log('data',await page.data())
    const res = await page.callMethod('setNickname')
    console.log('res',res)
    await page.waitFor(1000)
    expect(res).toBe(1)
  });
});
