declare module 'protagonist' {
  export function parseSync(
    markdown: string,
    options?: {
      requireBlueprintName?: boolean
      generateSourceMap?: boolean
    }
  ): ProtagonistParseResult

  export type ProtagonistParseResult = {
    element: 'parseResult'
    content: ProtagonistCategory[]
  }

  export type ProtagonistCategory = {
    element: 'category'
    content: (
      | ProtagonistCategory
      | ProtagonistResource
      | ProtagonistAnnotation)[]
  }

  export type ProtagonistAnnotation = {
    element: 'annotation'
    attributes: {
      code: {
        element: 'number'
        content: number
      }
      sourceMap: {
        element: 'array'
        content: {
          element: 'number'
          attributes: {
            line: {
              element: 'number'
              content: number
            }
            column: {
              element: 'number'
              content: number
            }
          }
          content: number
        }[]
      }
    }
    content: string
  }

  export type ProtagonistResource = {
    element: 'resource'
    attributes: {
      href: {
        element: 'string'
        content: string
      }
    }
    content: ProtagonistTransition[]
  }
  export type ProtagonistTransition = {
    element: 'transition'
    meta: {
      title: {
        element: 'string'
        content: string
      }
    }
    content: (
      | {
          element: 'httpTransaction'
          content: [ProtagonistHttpRequest, ProtagonistHttpResponse]
        }
      | {
          element: 'copy'
          content: any
        })[]
  }
  export type ProtagonistHttpRequest = {
    element: 'httpRequest'
    meta?: {
      title: {
        element: 'string'
        content: string
      }
    }
    attributes: {
      method: {
        element: 'string'
        content: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS'
      }
    }
    content: []
  }
  export type ProtagonistHttpResponse = {
    element: 'httpResponse'
    attributes?: {
      statusCode: {
        element: 'number'
        content: number
      }
      headers: {
        element: 'httpHeader'
        content: {
          element: 'member'
          content: {
            key: { element: 'string'; content: string }
            value: { element: 'string'; content: string }
          }
        }[]
      }
    }
    content: {
      element: 'asset'
      attributes: {
        contentType: {
          element: 'string'
          content: string
        }
      }
      content: string
    }[]
  }
}
