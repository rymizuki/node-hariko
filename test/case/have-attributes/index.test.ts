/* eslint-env mocha */
import assert = require('assert')
import * as path from 'path'
import * as HarikoParser from '../../../src/hariko-parser'
import { load } from '../../utils/fixture'

describe('case: have a some attributes', () => {
  it('should be enable parse', () => {
    const content = load(path.join(__dirname, './docs.apib'))
    const result = HarikoParser.parse(content)
    assert.deepEqual(result, {
      entries: [
        {
          file: 'basic-POST.json',
          request: {
            method: 'POST',
            uri: {
              path: 'basic',
              queries: [],
              template: 'basic'
            }
          },
          response: {
            body:
              "​\n    {\n      id: 1,\n      name: 'tarou',\n      created_at: '2019-09-09 01:01:01'\n    }\n",
            data: {
              created_at: '2019-09-09 01:01:01',
              id: 1,
              name: 'tarou'
            },
            headers: [
              {
                name: 'Content-Type',
                value: 'application/json; charset=utf8'
              }
            ],
            statusCode: 200
          }
        },
        {
          request: {
            method: 'POST',
            uri: {
              path: '/case/03',
              template: '/case/03',
              queries: []
            }
          },
          response: {
            statusCode: 200,
            headers: [
              { name: 'Content-Type', value: 'application/json; charset=utf8' }
            ],
            body:
              "​\n    {\n      id: 1,\n      name: 'tarou',\n      created_at: '2019-09-09 01:01:01'\n    }\n",
            data: {
              created_at: '2019-09-09 01:01:01',
              id: 1,
              name: 'tarou'
            }
          },
          file: 'case/03-POST.json'
        }
      ],
      warnings: []
    })
  })
})
