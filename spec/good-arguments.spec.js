'use strict'

const Adapter = require('..')
const config = require('./config')
const { test } = require('tap')

test('should not throw when initialized properly', (t) => {
  t.plan(1)
  t.doesNotThrow(() => new Adapter(config))
})
