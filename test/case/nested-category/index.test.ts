/* eslint-env mocha */
import assert = require('assert')
import * as path from 'path'
import * as HarikoParser from '../../../src/hariko-parser'
import { load } from '../../utils/fixture'

describe('case: category is nested', () => {
  it('should be enable parse', () => {
    const content = load(path.join(__dirname, './docs.apib'))
    const result = HarikoParser.parse(content)
    assert.deepEqual(result, {
      entries: [
        {
          request: {
            method: 'GET',
            uri: {
              path: '/api/hoge/:key',
              template: '/api/hoge/{key}',
              queries: []
            }
          },
          response: {
            statusCode: 200,
            headers: [
              { name: 'Content-Type', value: 'application/json; charset=utf8' }
            ],
            body:
              "{\n  error: {},\n  contents: [\n    {\n      name: 'HOGE',\n    },\n    {\n      name: 'FUGA',\n    }\n  ]\n}\n",
            data: { error: {}, contents: [{ name: 'HOGE' }, { name: 'FUGA' }] }
          },
          file: 'api/hoge/key-GET.json'
        }
      ],
      warnings: []
    })
  })
})
