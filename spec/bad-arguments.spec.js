'use strict'

const Adapter = require('..')
const { AssertionError } = require('assert')
const { test } = require('tap')

test('should throw when not initialized properly', (t) => {
  t.plan(2)

  function required (name, fn) {
    t.test(`argument ${name} is required`, (t) => {
      t.plan(2)
      try { fn() } catch (err) {
        t.type(err, AssertionError)
        t.equal(err.message, `Argument required: ${name}`)
      }
    })
  }

  required('token', () => new Adapter())

  required('publicUrl', () => new Adapter({
    token: 'token'
  }))
})
