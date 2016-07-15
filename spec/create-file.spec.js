'use strict'

const Adapter = require('..')
const config = require('./config')
const crypto = require('crypto')
const { test } = require('tap')

const filename = 'create-file'
const content = crypto.randomBytes(32).toString('base64')

test('should write & read files', (t) => {
  t.plan(2)
  const adapter = new Adapter(config)
  return adapter.createFile(filename, content, 'text/plain')
  .then(() => {
    t.pass('write reports success')
    return adapter.getFileData(filename)
    .then((data) => {
      t.equal(content, data.toString(), 'read reports same data out')
    }, (err) => {
      t.comment(err)
      t.fail('read reports failure')
    })
  }, (err) => {
    t.comment(err)
    t.fail('write reports failure')
  })
})
