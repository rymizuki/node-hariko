import { UriParser } from '../../uri-parser'
import { HttpRequest } from '../../structure/http-request'

export class RequestBuilder {
  constructor(
    private http_request: HttpRequest,
    private base_uri_template?: string
  ) {}

  exec() {
    const method = this.http_request.method
    const uri_template = this.base_uri_template
      ? this.base_uri_template
      : this.http_request.uri_template

    const uri = new UriParser(uri_template).parse()

    return {
      method,
      uri: {
        path: uri.path,
        template: uri.template,
        queries: uri.queries as (string | { name: string; value: string })[]
      }
    }
  }

  static build(request: HttpRequest, base_uri_template?: string) {
    return new RequestBuilder(request, base_uri_template).exec()
  }
}
