/* eslint-env mocha */
import assert = require('assert')
import * as path from 'path'
import * as HarikoParser from '../../../src/hariko-parser'
import { load } from '../../utils/fixture'

describe('case: have a some copy', () => {
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
            body: '{\n  message: "case"\n}\n',
            data: {
              message: 'case'
            },
            headers: [
              {
                name: 'Content-Type',
                value: 'application/json'
              }
            ],
            statusCode: 200
          }
        },
        {
          request: {
            method: 'POST',
            uri: {
              path: '/case/02',
              template: '/case/02',
              queries: []
            }
          },
          response: {
            statusCode: 200,
            headers: [{ name: 'Content-Type', value: 'application/json' }],
            body: '{\n  message: "case"\n}\n',
            data: { message: 'case' }
          },
          file: 'case/02-POST.json'
        }
      ],
      warnings: []
    })
  })
})
