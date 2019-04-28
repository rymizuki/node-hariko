import * as path from 'path'
import { HttpTransaction } from '../../structure/http-transaction'
import { ResponseBuilder } from './response-builder'
import { RequestBuilder } from './request-builder'
import { HttpRequestMethod } from '../../structure/http-request'

export class EntryBuilder {
  constructor(
    private http_transaction: HttpTransaction,
    private base_uri_template?: string
  ) {}

  exec() {
    const request = this.buildRequest()
    const response = this.buildResponse()
    return {
      request,
      response,
      file: this.buildFile(
        request.method,
        request.uri.path,
        request.uri.queries
      )
    }
  }

  buildRequest() {
    return RequestBuilder.build(
      this.http_transaction.request,
      this.base_uri_template
    )
  }

  buildResponse() {
    return ResponseBuilder.build(this.http_transaction.response)
  }

  buildFile(
    method: HttpRequestMethod,
    uri_path: string,
    uri_queries: (string | { name: string; value: string })[]
  ) {
    const path_fragments = uri_path.replace(/:/g, '').split(/\//)
    const queries = uri_queries.reduce((prev, query) => {
      if ('string' === typeof query) {
        prev.push(query)
      } else {
        prev.push(`${query.name}=${encodeURIComponent(query.value)}`)
      }
      return prev
    }, [])
    const querystring = queries.length ? `?${queries.join('&')}` : ''
    const basename = `${path_fragments.pop() ||
      'index'}${querystring}-${method}.json`
    const dirname = path.join.apply(path, path_fragments)
    return path.join(dirname, basename)
  }

  static build(http_transaction: HttpTransaction) {
    return new EntryBuilder(http_transaction).exec()
  }

  static buildAbstractly(http_transaction: HttpTransaction) {
    const uri_template = http_transaction.transition.resource.uri_template
    return new EntryBuilder(http_transaction, uri_template).exec()
  }
}
