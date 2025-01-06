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
    console.log('原来的nickname: ', await page.data('nickname'));
    const nicknameNew = generateRandomString('dcloud');
    await page.setData({
      "nickname": nicknameNew
    })
    console.log("新的nickname", await page.data('nickname'));
    await page.waitFor(2000)
    const res = await page.callMethod('setNickname')
    console.log('更新结果: ', res);
    expect(res).toBe(1)
  });
});
