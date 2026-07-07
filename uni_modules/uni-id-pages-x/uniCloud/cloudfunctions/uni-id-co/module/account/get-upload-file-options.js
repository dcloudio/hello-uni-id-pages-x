const {
  ERROR
} = require('../../common/error')
const {
  isExtStorageEnabled,
  getExtStorageManager
} = require('../../lib/utils/ext-storage')

/**
 * 获取 uni-id 范围内文件的上传参数
 * 前端按返回的 mode 分流：
 *   - mode === 'builtin' → uniCloud.uploadFile({ filePath, cloudPath })
 *   - mode === 'ext'     → uni.uploadFile({ ...uploadFileOptions, filePath })
 * @param {Object} params
 * @param {String} params.cloudPath 云端文件路径
 * @returns {Object} { errCode, mode, cloudPath, fileID?, uploadFileOptions? }
 */
module.exports = async function ({ cloudPath } = {}) {
  if (typeof cloudPath !== 'string' || !cloudPath) {
    throw {
      errCode: ERROR.INVALID_PARAM
    }
  }

  const storageConfig = this.config && this.config.service && this.config.service.storage
  if (!isExtStorageEnabled(storageConfig)) {
    return {
      errCode: 0,
      mode: 'builtin',
      cloudPath
    }
  }

  const extStorageManager = getExtStorageManager(storageConfig)
  const res = await extStorageManager.getUploadFileOptions({ cloudPath })

  return {
    errCode: 0,
    mode: 'ext',
    cloudPath: (res && res.cloudPath) || cloudPath,
    fileID: res && res.fileID,
    uploadFileOptions: res && res.uploadFileOptions
  }
}
