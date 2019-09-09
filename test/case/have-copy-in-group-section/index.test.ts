/* eslint-env mocha */
import assert = require('assert')
import * as path from 'path'
import * as HarikoParser from '../../../src/hariko-parser'
import { load } from '../../utils/fixture'

describe('case: have a some copy in group section', () => {
  it('should be enable parse', () => {
    const content = load(path.join(__dirname, './docs.apib'))
    const result = HarikoParser.parse(content)
    assert.deepEqual(result, {
      entries: [
        {
          request: {
            method: 'POST',
            uri: {
              path: '/case/05',
              template: '/case/05',
              queries: []
            }
          },
          response: {
            statusCode: 200,
            headers: [{ name: 'Content-Type', value: 'application/json' }],
            body: '{\n  message: "case"\n}\n',
            data: { message: 'case' }
          },
          file: 'case/05-POST.json'
        }
      ],
      warnings: []
    })
  })
})
