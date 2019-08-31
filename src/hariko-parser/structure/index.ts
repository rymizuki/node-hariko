import {
  ProtagonistParseResult,
  ProtagonistResource,
  ProtagonistAnnotation,
  ProtagonistCategory
} from 'protagonist'
import { ResourcesStructure } from './resources'
import { AnnotationsStructure } from './annotations'

class Builder {
  private resources: ResourcesStructure
  private annotations: AnnotationsStructure

  constructor() {
    this.resources = ResourcesStructure.create()
    this.annotations = AnnotationsStructure.create()
  }

  build(data: ProtagonistParseResult) {
    this.dispatch(data.content[0].content)
    return this.resources
  }

  private dispatch(
    rows: (ProtagonistAnnotation | ProtagonistResource | ProtagonistCategory)[]
  ) {
    rows.forEach((row) => {
      if (row.element === 'annotation') {
        this.annotations.add(row.content)
        return
      }

      if (row.element === 'resource') {
        this.resources.add(this.createResource(row))
        return
      }

      if (row.element === 'category') {
        this.dispatch(row.content)
        return
      }

      throw new Error(`hariko-parser unsupported element`)
    })
  }

  private createResource(content: ProtagonistResource) {
    const resource = this.resources.createResource(
      content.attributes.href.content
    )

    content.content.forEach((transition_data) => {
      const transition = resource.createTransition(transition_data)

      transition_data.content.forEach((http_transaction_data) => {
        if (http_transaction_data.element == 'copy') {
          return
        }

        const http_transaction = transition.createHttpTransaction()

        http_transaction.setHttpRequest(
          http_transaction.createHttpRequest(http_transaction_data.content[0])
        )
        http_transaction.setHttpResponse(
          http_transaction.createHttpResponse(http_transaction_data.content[1])
        )
        transition.addHttpTransaction(http_transaction)
      })

      resource.addTransition(transition)
    })

    return resource
  }
}

/**
 * Convert protagonist's parsing result to hariko's structure
 * @param data ProtagonistParseResult
 */
export function build(data: ProtagonistParseResult) {
  return new Builder().build(data)
}
