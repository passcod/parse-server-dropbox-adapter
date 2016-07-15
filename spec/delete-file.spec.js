'use strict'

const Adapter = require('..')
const config = require('./config')
const crypto = require('crypto')
const { test } = require('tap')

const filename = 'delete-file'
const content = crypto.randomBytes(32).toString('base64')

test('should delete files', (t) => {
  t.plan(3)
  const adapter = new Adapter(config)
  return adapter.createFile(filename, content, 'text/plain')
  .then(() => {
    t.pass('write reports success')
    return adapter.deleteFile(filename)
    .then(() => {
      t.pass('delete reports success')
      return adapter.getFileData(filename)
      .then((data) => {
        t.fail('file still exists')
      }, (err) => {
        t.comment(err)
        t.pass('file confirmed gone')
      })
    }, (err) => {
      t.comment(err)
      t.fail('delete reports failure')
    })
  }, (err) => {
    t.comment(err)
    t.fail('write reports failure')
  })
})
