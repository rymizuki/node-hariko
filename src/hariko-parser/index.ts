import * as protagonist from 'protagonist'

import { HarikoParserResult } from 'hariko-parser'
import * as structure from './structure'
import * as conversion from './conversion'

export class HarikoParser {
  parse(markdown: string): HarikoParserResult {
    const protagonistResult = protagonist.parseSync(markdown, {
      generateSourceMap: false,
      requireBlueprintName: false
    })

    const resources = structure.build(protagonistResult)

    return conversion.convert(resources)
  }
}

export function parse(markdown: string) {
  return new HarikoParser().parse(markdown)
}
