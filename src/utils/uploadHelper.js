import OSS from 'ali-oss'
import axios from 'axios'
import * as t from './index'
import store from '../store'

const cacheKey = t.genCacheKey('bigFile', 'stsToken', store.getters.user.id)

// 申请STS令牌
async function applySTSToken(self) {
  if (!sessionStorage.getItem(cacheKey)) {
    const { data } = await self.$api.Auth.applySTSToken('stsToken')
    sessionStorage.setItem(cacheKey, t.jsonStringify(data.sts_token))
  }

  const cacheToken = t.jsonParse(sessionStorage.getItem(cacheKey))
  if (t.isEmpty(cacheToken) || new Date(cacheToken.Expiration).getTime() < Date.now()) {
    const { data } = await self.$api.Auth.applySTSToken('stsToken')
    sessionStorage.setItem(cacheKey, t.jsonStringify(data.sts_token))

    return data.sts_token
  }
  return cacheToken
}

// OSS上传
export async function stsUpload(ossPath, file, self) {
  try {
    const credentials = await applySTSToken(self)
    const stsClient = new OSS({
      accessKeyId: credentials.AccessKeyId,
      accessKeySecret: credentials.AccessKeySecret,
      stsToken: credentials.SecurityToken,
      region: store.getters.env.oss.region,
      bucket: store.getters.env.oss.bucket,
    })
    self.stsOSS = stsClient
    self.showProgress = true

    const filename = Date.now() + '-' + t.genRandStr(8).toLocaleLowerCase() + '.' + file.name.split('.').slice(-1)[0]
    const ossObject = ossPath + filename
    await stsClient.put(ossObject, file)

    return filename
  } catch (ex) {
    if (ex.code && ['InvalidAccessKeyId', 'SecurityTokenExpired', 'AccessDenied'].includes(ex.code)) {
      sessionStorage.removeItem(cacheKey)
      await applySTSToken(self)
      return await this.stsUpload(ossPath, file, self)
    }
    if (self.stsOSS && self.stsOSS.isCancel()) {
      throw '用户取消上传'
    }
    throw ex
  }
}

// OSS上传-断点续传
export async function stsMultipartUpload(ossPath, file, self) {
  const checkpointKey = t.genCacheKey('checkpoint', 'stsMultipartUpload', store.getters.user.id, ossPath)
  try {
    const credentials = await applySTSToken(self)
    const stsClient = new OSS({
      accessKeyId: credentials.AccessKeyId,
      accessKeySecret: credentials.AccessKeySecret,
      stsToken: credentials.SecurityToken,
      region: store.getters.env.oss.region,
      bucket: store.getters.env.oss.bucket,
    })
    self.stsOSS = stsClient
    self.showProgress = true

    // 读取断点
    let checkpoint = t.jsonParse(sessionStorage.getItem(checkpointKey)) || {}
    checkpoint.file = file // file还原

    // 分片上传
    const filename = Date.now() + '-' + t.genRandStr(8).toLocaleLowerCase() + '.' + file.name.split('.').slice(-1)[0]
    const ossObject = ossPath + filename
    await stsClient.multipartUpload(ossObject, file, {
      parallel: 3,
      partSize: 1024 * 1024, // 1M
      checkpoint,
      progress: async (p, cpt) => {
        self.progress = Math.round(p * 10000) / 100
        sessionStorage.setItem(checkpointKey, t.jsonStringify(cpt))

        checkpoint = cpt
      },
      meta: {
        year: new Date().getFullYear(),
        user: store.getters.user.id,
      },
    })

    // 上传成功清除断点
    sessionStorage.removeItem(checkpointKey)

    return filename
  } catch (ex) {
    if (ex.code && ['InvalidAccessKeyId', 'SecurityTokenExpired', 'AccessDenied'].includes(ex.code)) {
      sessionStorage.removeItem(cacheKey)
      await applySTSToken(self)
      return await this.stsMultipartUpload(ossPath, file, self)
    }
    if (self.stsOSS && self.stsOSS.isCancel()) {
      throw '用户取消上传'
    }

    if (ex.code && ['NoSuchUpload', 'InvalidPart', 'EntityTooSmall'].includes(ex.code)) {
      sessionStorage.removeItem(checkpointKey)
    }
    throw ex
  }
}

// 本地直传-上传
export async function localUpload(url, params, self) {
  const formData = new FormData() // 创建form对象
  for (const p in params) {
    formData.append(p, params[p])
  }

  self.axiosSource = axios.CancelToken.source()
  self.showProgress = true

  return new Promise((resolve, reject) => {
    axios
      .post(url, formData, {
        onUploadProgress: event => {
          let percent = Math.round((event.loaded / event.total) * 10000) / 100
          if (percent > 99) {
            percent = 99.99
          }
          self.progress = percent
        },
        headers: { 'x-auth-token': store.getters.token },
        cancelToken: self.axiosSource.token,
      })
      .then(({ data }) => {
        resolve(data)
      })
      .catch(({ response }) => {
        reject(response.data && response.data.msg)
      })
  })
}

// OSS下载
export async function stsDownload(ossPath, options, self) {
  try {
    const credentials = await applySTSToken(self)
    const stsClient = new OSS({
      accessKeyId: credentials.AccessKeyId,
      accessKeySecret: credentials.AccessKeySecret,
      stsToken: credentials.SecurityToken,
      region: store.getters.env.oss.region,
      bucket: store.getters.env.oss.bucket,
    })

    return await stsClient.signatureUrl(ossPath, options)
  } catch (ex) {
    if (ex.code && ['InvalidAccessKeyId', 'SecurityTokenExpired', 'AccessDenied'].includes(ex.code)) {
      sessionStorage.removeItem(cacheKey)
      await applySTSToken(self)
      return await this.stsDownload(ossPath, options, self)
    }
    if (self.stsOSS && self.stsOSS.isCancel()) {
      throw '用户取消下载'
    }
    throw ex
  }
}
