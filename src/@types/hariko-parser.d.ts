declare module 'hariko-parser' {
  export type HttpRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS'

  export interface HarikoParserResult {
    entries: Entry[]
    warnings: Warning[]
  }

  export interface Entry {
    file: string
    request: {
      method: HttpRequestMethod
      uri: {
        path: string
        template: string
        queries: (string | { name: string; value: string })[]
      }
    }
    response: {
      statusCode: number
      headers: { name: string; value: string }[]
      body: string
      data: null | any
    }
  }

  export interface Warning {
    code: number
    location: { index: number; length: number }[]
    message: string
  }
}
