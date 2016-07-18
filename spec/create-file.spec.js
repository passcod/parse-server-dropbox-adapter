'use strict'

const Adapter = require('..')
const config = require('./config')
const crypto = require('crypto')
const { test } = require('tap')

test('should write & read files', (t) => {
  const filename = 'create-file'
  const content = crypto.randomBytes(32).toString('base64')

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

test('should write files with spaces', (t) => {
  const filename = 'Screenshot from 2016-06-24.png'
  const content = crypto.randomBytes(32).toString('base64')

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

test('should write files with colons', (t) => {
  const filename = 'Screenshot-14:51:32.png'
  const content = crypto.randomBytes(32).toString('base64')

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

test('should write files with URL encoding', (t) => {
  const filename = 'Screenshot%20from%202016-06-24%2014%3A51%3A32.png'
  const content = crypto.randomBytes(32).toString('base64')

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
