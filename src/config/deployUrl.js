/**
 * @description 请求基础路径
 */
let baseUrl = ''

/**
 * @description 附件上传地址
 */
let uploadUrl = ''

// 区分环境
let env = process.env.NODE_ENV === 'development'
  ? 'development'
  : process.env.VUE_APP_TITLE === 'develop'
    ? 'develop'
    : process.env.VUE_APP_TITLE === 'test'
      ? 'test'
      : 'production'

switch (env) {
  case 'development': // 本地环境
    baseUrl = 'http://192.168.1.160'
    uploadUrl = ''
    break
  case 'develop': // 开发线上环境
    baseUrl = ''
    uploadUrl = ''
    break
  case 'test': // 测试环境
    baseUrl = ''
    uploadUrl = ''
    break
  case 'production': // 生产环境
    baseUrl = ''
    uploadUrl = ''
    break
}

// export default baseUrl
export {
  baseUrl,
  uploadUrl
}
