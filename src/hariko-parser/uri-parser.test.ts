import assert = require('assert')
import { UriParser } from './uri-parser'

describe('UriParser', () => {
  describe('/path/to', () => {
    it('should be uri entity', () => {
      assert.deepEqual(new UriParser('/path/to').parse(), {
        path: '/path/to',
        template: '/path/to',
        queries: []
      })
    })
  })
  describe('/path/{to}', () => {
    it('should be uri entity', () => {
      assert.deepEqual(new UriParser('/path/{to}').parse(), {
        path: '/path/:to',
        template: '/path/{to}',
        queries: []
      })
    })
  })
  describe('/path/to{?key}', () => {
    it('should be uri entity', () => {
      assert.deepEqual(new UriParser('/path/to{?key}').parse(), {
        path: '/path/to',
        template: '/path/to{?key}',
        queries: ['key']
      })
    })
  })
  describe('/path/{to}{?key}', () => {
    it('should be uri entity', () => {
      assert.deepEqual(new UriParser('/path/{to}{?key}').parse(), {
        path: '/path/:to',
        template: '/path/{to}{?key}',
        queries: ['key']
      })
    })
  })
})
