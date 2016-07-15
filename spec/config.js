const crypto = require('crypto')

module.exports = {
  prefix: crypto.randomBytes(3).toString('hex') + '/',
  publicUrl: 'http://example.com/',
  token: process.env.DROPBOX_TOKEN
}
