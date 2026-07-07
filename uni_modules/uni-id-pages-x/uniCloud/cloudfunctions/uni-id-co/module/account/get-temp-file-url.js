const {
  ERROR
} = require('../../common/error')
const {
  isExtStorageEnabled,
  getExtStorageManager
} = require('../../lib/utils/ext-storage')

/**
 * 获取 uni-id 范围内文件的临时访问链接
 * 内置存储 (cloud://) 由前端 uniCloud.getTempFileURL 直接换链，无需走该接口
 * 扩展存储 (qiniu:// 等) 必须经云端 extStorageManager.getTempFileURL
 * @param {Object} params
 * @param {String} params.fileID  文件 fileID（扩展存储 URI 或 cloud://）
 * @returns {Object} { errCode, tempFileURL }
 */
module.exports = async function ({ fileID } = {}) {
  if (typeof fileID !== 'string' || !fileID) {
    throw {
      errCode: ERROR.INVALID_PARAM
    }
  }

  let tempFileURL
  if (fileID.startsWith('cloud://')) {
    const res = await uniCloud.getTempFileURL({ fileList: [fileID] })
    tempFileURL = res && res.fileList && res.fileList[0] && res.fileList[0].tempFileURL
  } else if (fileID.startsWith('http://') || fileID.startsWith('https://')) {
    tempFileURL = fileID
  } else {
    const storageConfig = this.config && this.config.service && this.config.service.storage
    if (!isExtStorageEnabled(storageConfig)) {
      throw new Error(`无法解析 fileID "${fileID}": 未配置使用扩展存储 (service.storage.mode !== "ext")`)
    }
    const extStorageManager = getExtStorageManager(storageConfig)
    const res = await extStorageManager.getTempFileURL({ fileList: [fileID] })
    tempFileURL = res && res.fileList && res.fileList[0] && res.fileList[0].tempFileURL
  }

  return {
    errCode: 0,
    tempFileURL
  }
}
