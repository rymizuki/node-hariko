import { HttpResponse } from '../../structure/http-response'
import JSON from 'json5'

export class ResponseBuilder {
  constructor(private http_response: HttpResponse) {}

  get status_code() {
    return this.http_response.status_code
  }

  get headers() {
    return this.http_response.headers
  }

  get body() {
    return this.http_response.body
  }

  get data() {
    if (this.http_response.isJsonResponse()) {
      // remove zero width space
      return JSON.parse(this.body.replace(/[\u200B-\u200D\uFEFF]/g, ''))
    }
    return null
  }

  exec() {
    return {
      statusCode: this.status_code,
      headers: this.headers,
      body: this.body,
      data: this.data
    }
  }

  static build(response: HttpResponse) {
    return new ResponseBuilder(response).exec()
  }
}
