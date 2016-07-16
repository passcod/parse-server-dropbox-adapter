const crypto = require('crypto')

module.exports = {
  prefix: crypto.randomBytes(3).toString('hex') + '/',
  publicUrl: (prefix, name, join) => join('http://example.com', `${prefix}${name}`),
  token: process.env.DROPBOX_TOKEN
}
