/**
 * 扩展存储 (uni-cloud-ext-storage) 共享工具
 * 包含友好 require 校验与 manager 创建逻辑，供 upload / getTempFileURL 等场景复用
 */
const EXT_STORAGE_TIP = '已配置扩展存储 (service.storage.mode = "ext")，但未关联 uni-cloud-ext-storage 扩展库。请右键云函数 uni-id-co → 管理公共模块或扩展库依赖 → 勾选 uni-cloud-ext-storage'

/**
 * 判断是否使用扩展存储
 * service.storage.mode === 'ext' 时视为使用扩展存储
 */
function isExtStorageEnabled (storageConfig) {
  return !!(storageConfig && storageConfig.mode === 'ext')
}

/**
 * 创建扩展存储 manager
 * @param {Object} storageConfig service.storage 配置
 * @returns extStorageManager 实例
 */
function getExtStorageManager (storageConfig) {
  if (!isExtStorageEnabled(storageConfig)) {
    throw new Error('未配置使用扩展存储 (service.storage.mode !== "ext")')
  }
  const { provider, domain, bucketName, bucketSecret } = storageConfig
  if (!provider) {
    throw new Error('缺少配置项: service.storage.provider')
  }
  if (!domain) {
    throw new Error('缺少配置项: service.storage.domain')
  }

  const options = { provider, domain }
  if (bucketName) options.bucketName = bucketName
  if (bucketSecret) options.bucketSecret = bucketSecret

  try {
    return uniCloud.getExtStorageManager(options)
  } catch (error) {
    const errMsg = (error && error.message) || String(error)
    if (errMsg.includes('getExtStorageManager由uni-cloud-ext-storage扩展库提供')) {
      throw new Error(EXT_STORAGE_TIP)
    }
    throw error
  }
}

module.exports = {
  EXT_STORAGE_TIP,
  isExtStorageEnabled,
  getExtStorageManager
}
