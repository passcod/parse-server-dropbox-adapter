/* @flow */
'use strict'

const assert = require('assert')
const bufferFrom /* : (b: string|Buffer) => Buffer */ = require('./buffer-from')
const Dropbox = require('dropbox')
const request = require('request')
const urljoin = require('url-join')

class RateLimited extends Error {
  /* :: delay: number; */

  constructor (delay /* : number|string */) {
    super()
    this.delay = (+delay) * 1000
    this.message = `Request has been rate limited, delay ${this.delay}`
  }

  wait () /* : Promise<void> */ {
    return new Promise((resolve) => {
      setTimeout(resolve, this.delay)
    })
  }
}

class DropboxError extends Error {
  /* :: details: ?Object; */

  constructor (obj /* : string | Object */) {
    super()

    if (typeof obj === 'string') {
      try {
        obj = JSON.parse(obj)
      } catch (ignoredError) {
        obj = { error_summary: obj, error: null }
      }
    }

    this.message = obj.error_summary
    this.details = obj.error
  }
}

class Adapter {
  /* :: static default: Class<Adapter>; */
  /* :: static DropboxError: Class<DropboxError>; */

  /* :: dropbox: Dropbox; */
  /* :: token: string; */
  /* :: prefix: string; */
  /* :: publicUrl: (name: string) => string; */
  /* :: request: Class<request>; */

  constructor (options /* : Object */ = {}) {
    let {
      token, prefix, publicUrl
    } = Object.assign({ prefix: '' }, options)

    assert(token, 'Argument required: token')
    assert(publicUrl, 'Argument required: publicUrl')

    if (prefix.length > 0 && !prefix.startsWith('/')) {
      prefix = `/${prefix}`
    }

    Object.assign(this, {
      dropbox: new Dropbox({ accessToken: token }),
      prefix,
      publicUrl,
      request: request.defaults({
        baseUrl: 'https://content.dropboxapi.com/2/files/',
        gzip: true,
        headers: { Authorization: `Bearer ${token}` },
        strictSSL: true,
        time: true
      }),
      token
    })
  }

  createFile (
    name /* : string */,
    data /* : string|Buffer */
  ) /* : Promise<void> */ {
    return new Promise((resolve, reject) =>
      this.request.post({
        url: '/upload',
        body: data,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Dropbox-API-Arg': JSON.stringify({
            mode: 'overwrite',
            path: `${this.prefix}${name}`
          })
        }
      }, (err, resp, body) => {
        if (err) { return reject(err) }

        const code = resp.statusCode
        if (code >= 200 && code < 400) { return resolve() }
        if (code === 429) {
          return reject(new RateLimited(resp.headers['retry-after']))
        }

        try {
          reject(new DropboxError(JSON.parse(body)))
        } catch (err) {
          reject(new DropboxError({ error_summary: body }))
        }
      })
    ).catch((err) => {
      if (err instanceof RateLimited) {
        return err.wait().then(() => this.createFile(name, data))
      } else {
        return Promise.reject(err)
      }
    })
  }

  deleteFile (name /* : string */) /* : Promise<void> */ {
    return this.dropbox.filesDelete({
      path: `${this.prefix}${name}`
    })
  }

  getFileData (name /* : string */) /* : Promise<Buffer> */ {
    return new Promise((resolve, reject) => {
      const stream = this.request({
        url: '/download',
        headers: {
          'Dropbox-API-Arg': JSON.stringify({
            path: `${this.prefix}${name}`
          })
        }
      })

      stream.on('error', reject)
      stream.on('response', (resp) => {
        stream.pause()
        const code = resp.statusCode
        if (code >= 200 && code < 400) { return resolve(stream) }
        if (code === 429) {
          return reject(new RateLimited(resp.headers['retry-after']))
        }

        let err = resp.headers['Dropbox-API-Result']
        try {
          err = JSON.parse(err)
        } catch (ignoredError) {
          err = { error_summary: err }
        }

        reject(new DropboxError(err))
      })
    })
    .catch((err) => {
      if (err instanceof RateLimited) {
        return err.wait().then(() => this.getFileData(name))
      } else {
        return Promise.reject(err)
      }
    })
    .then((stream) => new Promise((resolve) => {
      const buflist = []
      stream.on('data', (chunk) => {
        buflist.push(bufferFrom(chunk))
      })
      stream.on('end', () => {
        resolve(Buffer.concat(buflist))
      })
      stream.resume()
    }))
  }

  getFileLocation (config /* : Object */, name /* : string */) /* : string */ {
    const parts = this.publicUrl(name)
      ? [this.publicUrl(name), `${this.prefix}${name}`]
      : [config.mount, 'files', config.applicationId, encodeURIComponent(name)]
    return urljoin(...parts)
  }
}

module.exports = Adapter
module.exports.default = Adapter
module.exports.DropboxError = DropboxError
