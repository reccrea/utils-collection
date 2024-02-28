interface globalStorageConfig {
  type: 'localStorage' | 'sessionStorage'
  prefix: string
  expire: number
  isEncrypt: boolean
}
export const storageConfig: globalStorageConfig = {
  //存储类型，localStorage | sessionStorage
  type: 'localStorage',
  //版本号
  prefix: 'utils-collection_0.0.1',
  //过期时间，默认为一天，单位为分钟
  expire: 24 * 60,
  //支持加密、解密数据处理
  isEncrypt: true
}
