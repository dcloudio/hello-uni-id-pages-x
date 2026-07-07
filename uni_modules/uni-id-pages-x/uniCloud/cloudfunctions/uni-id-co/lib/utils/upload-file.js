/**
 * 上传文件到云存储
 * 当 service.storage.mode === 'ext' 时走扩展存储（uni-cloud-ext-storage），否则走内置云存储
 * 用法：await uploadFile.call(this, { cloudPath, fileContent })
 *
 * service.storage 支持字段见 lib/utils/ext-storage.js
 */
const {
  isExtStorageEnabled,
  getExtStorageManager
} = require('./ext-storage')

async function uploadFile ({
  cloudPath,
  fileContent,
  cloudPathAsRealPath,
  allowUpdate
} = {}) {
  const storageConfig = this.config && this.config.service && this.config.service.storage

  if (!isExtStorageEnabled(storageConfig)) {
    return uniCloud.uploadFile({
      cloudPath,
      fileContent,
      cloudPathAsRealPath
    })
  }

  const extStorageManager = getExtStorageManager(storageConfig)

  const uploadOptions = { cloudPath, fileContent }
  if (allowUpdate !== undefined) uploadOptions.allowUpdate = allowUpdate

  return await extStorageManager.uploadFile(uploadOptions)
}

module.exports = uploadFile
