import { ProtagonistParseResult } from 'protagonist'
import { ResourcesStructure } from './resources'
import { AnnotationsStructure } from './annotations'

/**
 * Convert protagonist's parsing result to hariko's structure
 * @param data ProtagonistParseResult
 */
export function build(data: ProtagonistParseResult) {
  const resources = ResourcesStructure.create()
  const annotations = AnnotationsStructure.create()

  data.content[0].content.forEach((content) => {
    if (content.element === 'annotation') {
      annotations.add(content.content)
      return
    }

    const resource = resources.createResource(content.attributes.href.content)

    content.content.forEach((transition_data) => {
      const transition = resource.createTransition(transition_data)

      transition_data.content.forEach((http_transaction_data) => {
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
    resources.add(resource)
  })

  return resources
}
