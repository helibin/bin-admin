import crypto from 'crypto'

export function getMd5(str) {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex')
}
