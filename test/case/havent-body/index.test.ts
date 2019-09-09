/* eslint-env mocha */
import assert = require('assert')
import * as path from 'path'
import * as HarikoParser from '../../../src/hariko-parser'
import { load } from '../../utils/fixture'

describe('case: have not body contents', () => {
  it('should be enable parse', () => {
    const content = load(path.join(__dirname, './docs.apib'))
    const result = HarikoParser.parse(content)
    assert.deepEqual(result, {
      entries: [
        {
          file: 'case/04-POST.json',
          request: {
            method: 'POST',
            uri: {
              path: '/case/04',
              queries: [],
              template: '/case/04'
            }
          },
          response: {
            body: '',
            data: {},
            headers: [
              {
                name: 'Content-Type',
                value: 'application/json'
              }
            ],
            statusCode: 200
          }
        }
      ],
      warnings: []
    })
  })
})
