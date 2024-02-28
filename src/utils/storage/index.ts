import { storageConfig } from './config'
import { encrypt, decrypt } from './encry'

const autoAddPreFix = (key: string) => {
  //添加前缀，保持浏览器Application视图唯一性
  const prefix = storageConfig.prefix || ''
  return `${prefix}_${key}`
}

//设定值
export const setStorage = (key: string, value: any, expire: number = 24 * 60): boolean => {
  if (value === '' || value === null || value === undefined) {
    //空值重置
    value = null
  }
  if (isNaN(expire) || expire < 0) {
    //过期时间值合理性判断
    throw new Error('Expire must be a number')
  }
  const data = {
    //存储值
    value,
    //存储日期
    time: Date.now(),
    //过期时间
    expire: Date.now() + 1000 * 60 * expire
  }
  //是否需要加密，判断装载加密数据或原数据
  window[storageConfig.type].setItem(
    autoAddPreFix(key),
    storageConfig.isEncrypt ? encrypt(JSON.stringify(data)) : JSON.stringify(data)
  )
  return true
}

//获取指定值
export const getStorage = (key: string) => {
  if (storageConfig.prefix) {
    key = autoAddPreFix(key)
  }
  if (!window[storageConfig.type].getItem(key)) {
    //不存在判断
    return null
  }
  const storageVal = storageConfig.isEncrypt
    ? JSON.parse(decrypt(window[storageConfig.type].getItem(key) as string))
    : JSON.parse(window[storageConfig.type].getItem(key) as string)
  const now = Date.now()
  if (now >= storageVal.expire) {
    //过期销毁
    removeStorage(key)
    return null
    //不过期回值
  } else {
    return storageVal.value
  }
}

//获取所有值
export const getAllStorage = () => {
  const storageList: any = {}
  const keys = Object.keys(window[storageConfig.type])
  keys.forEach((key) => {
    const value = getStorage(key)
    if (value !== null) {
      //如果值没有过期，加入到列表中
      storageList[key] = value
    }
  })
  return storageList
}

//获取值列表长度
export const getStorageLength = () => {
  return window[storageConfig.type].length
}

//删除值
export const removeStorage = (key: string) => {
  if (storageConfig.prefix) {
    key = autoAddPreFix(key)
  }
  window[storageConfig.type].removeItem(key)
}

// 清空存储列表
export const clearStorage = () => {
  window[storageConfig.type].clear()
}
