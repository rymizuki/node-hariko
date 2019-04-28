import { ProtagonistHttpRequest } from 'protagonist'
import { HttpTransaction } from './http-transaction'

export type HttpRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS'

export class HttpRequest {
  constructor(
    public readonly http_transaction: HttpTransaction,
    public method: HttpRequestMethod,
    private orig_uri_template: string | null
  ) {}

  get uri_template() {
    return this.orig_uri_template
      ? this.orig_uri_template
      : this.http_transaction.transition.resource.uri_template
  }

  clone() {
    return new HttpRequest(
      this.http_transaction,
      this.method,
      this.orig_uri_template
    )
  }

  hasSpecificUri() {
    return this.orig_uri_template !== null
  }

  static create(
    http_transaction: HttpTransaction,
    data: ProtagonistHttpRequest
  ) {
    let method = data.attributes.method.content
    let uri_template = data.meta ? data.meta.title.content : null

    // split method and path from `GET /path/to`
    if (
      uri_template &&
      uri_template.match(/^(GET|POST|PUT|DELETE|OPTIONS)\s*(.+)$/)
    ) {
      method = RegExp.$1 as HttpRequestMethod
      uri_template = RegExp.$2
    }

    return new HttpRequest(http_transaction, method, uri_template)
  }
}
