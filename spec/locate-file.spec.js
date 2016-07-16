'use strict'

const Adapter = require('..')
const config = require('./config')
const { test } = require('tap')

test('should support the direct/proxied file locations', (t) => {
  t.plan(2)

  function args () {
    return Object.assign({}, config)
  }

  t.test('direct', (t) => {
    const box = new Adapter(args())
    t.plan(1)
    t.equal(
      box.getFileLocation({}, 'bar'),
      `http://example.com/${config.prefix}bar`
    )
  })

  t.test('proxied', (t) => {
    const box = new Adapter(Object.assign(args(), { publicUrl: () => false }))
    t.plan(2)
    const got = box.getFileLocation({}, 'foo')
    const want = '/files/foo'
    t.type(got, 'string', 'returns a string')
    t.ok(got.endsWith(want), `${got} should end with ${want}`)
  })
})
