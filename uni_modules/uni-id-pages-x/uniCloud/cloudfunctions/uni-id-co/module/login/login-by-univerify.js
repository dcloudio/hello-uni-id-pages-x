const {
  getmobileNumber
} = require('../../lib/utils/univerify')
const {
  preUnifiedLogin,
  postUnifiedLogin
} = require('../../lib/utils/unified-login')
const {
  LOG_TYPE
} = require('../../common/constants')

/**
 * App端一键登录
 * @tutorial https://uniapp.dcloud.net.cn/uniCloud/uni-id-pages-x.html#login-by-univerify
 * @param {Object} params
 * @param {String} params.access_token  APP端一键登录返回的access_token
 * @param {String} params.openid        APP端一键登录返回的openid
 * @param {String} params.inviteCode    邀请码
 * @returns
 */
module.exports = async function (params = {}) {
  const schema = {
    access_token: 'string',
    openid: 'string',
    inviteCode: {
      required: false,
      type: 'string'
    }
  }
  this.middleware.validate(params, schema)
  const {
    // eslint-disable-next-line camelcase
    access_token,
    openid,
    inviteCode
  } = params

  let mobile
  try {
    const mobileInfo = await getmobileNumber.call(this, {
      // eslint-disable-next-line camelcase
      access_token,
      openid
    })
    mobile = mobileInfo.mobileNumber
  } catch (error) {
    await this.middleware.uniIdLog({
      success: false,
      type: LOG_TYPE.LOGIN
    })
    throw error
  }
  const {
    user,
    type
  } = await preUnifiedLogin.call(this, {
    user: {
      mobile
    }
  })
  return postUnifiedLogin.call(this, {
    user,
    extraData: {
      mobile_confirmed: 1
    },
    type,
    inviteCode
  })
}
