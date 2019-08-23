/* eslint-env mocha */
//import assert = require('assert')
import * as path from 'path'
import * as HarikoParser from '../../../src/hariko-parser'
import { load } from '../../utils/fixture'

describe('case: category is nested', () => {
  it('should be enable parse', () => {
    const content = load(path.join(__dirname, './docs.apib'))
    const result = HarikoParser.parse(content)
    console.log(result)
  })
})
