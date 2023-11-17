/**
 * 刷新token
 * @tutorial https://uniapp.dcloud.net.cn/uniCloud/uni-id-pages-x.html#refresh-token
 */
module.exports = async function () {
  const refreshTokenRes = await this.uniIdCommon.refreshToken({
    token: this.getUniversalUniIdToken()
  })
  const {
    errCode,
    token,
    tokenExpired
  } = refreshTokenRes
  if (errCode) {
    throw refreshTokenRes
  }
  return {
    errCode: 0,
    newToken: {
      token,
      tokenExpired
    }
  }
}
