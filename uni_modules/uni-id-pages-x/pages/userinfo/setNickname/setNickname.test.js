// uni-app自动化测试教程: uni-app自动化测试教程: https://uniapp.dcloud.net.cn/worktile/auto/hbuilderx-extension/

describe('/uni_modules/uni-id-pages-x/pages/userinfo/setNickname/setNickname.uvue', () => {

	let page,nickname;
	beforeAll(async () => {
		page = await program.redirectTo('/uni_modules/uni-id-pages-x/pages/userinfo/setNickname/setNickname')
		await page.waitFor('view')
		// console.log('pageStack: ',await program.pageStack());
		// console.log('currentPage: ',await program.currentPage());
	});
	
	it('设置昵称', async () => {
		nickname = await page.data('nickname')
		if(nickname == undefined || nickname == "dcloud99"){
			nickname = "dcloud00"
		}else{
			nickname = "dcloud99"
		}
		console.log('nickname: ',nickname);
		await page.setData({nickname})
		await page.waitFor(300)
		await page.callMethod('setNickname')
		// 等待登录结果
		await page.waitFor(async () => {
			return await page.data('testState') === true
		})
		const resSuccess = await page.data('testSuccess')
		console.log('resSuccess: ', resSuccess);
		if(resSuccess){expect(resSuccess).toBe(1)}
		const resErr = await page.data('testErr')
		console.log('resErr: ', resErr);
		switch (resErr.errCode){
			case 'PERMISSION_ERROR':
				expect(resErr.errMsg).toBe('权限校验未通过，请参考文档：https://uniapp.dcloud.net.cn/uniCloud/schema.html#handler-permission-error')
				break;
			default:
				break;
		}
	});
	
});