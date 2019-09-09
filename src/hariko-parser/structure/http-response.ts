import { ProtagonistHttpResponse } from 'protagonist'
import { HttpTransaction } from './http-transaction'

export class HttpResponse {
  constructor(
    public readonly http_transaction: HttpTransaction,
    private orig_status_code: number,
    private orig_headers: HttpResponseHeaders,
    public body: string
  ) {}

  get status_code() {
    return Number(this.orig_status_code)
  }

  get headers() {
    return this.orig_headers.toJson()
  }

  clone() {
    return new HttpResponse(
      this.http_transaction,
      this.orig_status_code,
      this.orig_headers.clone(),
      this.body
    )
  }

  isJsonResponse() {
    const content_type = this.orig_headers.get('Content-Type')
    if (content_type && /json/.test(content_type)) {
      return true
    }
    return false
  }

  static create(
    http_transaction: HttpTransaction,
    data: ProtagonistHttpResponse
  ) {
    const status = data.attributes ? data.attributes.statusCode.content : 200
    const messageBody = data.content.find((content) => {
      return (
        content.element === 'asset' &&
        content.meta &&
        content.meta.classes.content[0].content === 'messageBody'
      )
    })

    if (messageBody) {
      const headers = new HttpResponseHeaders()
      headers.set('Content-Type', messageBody.attributes.contentType.content)

      return new HttpResponse(
        http_transaction,
        status,
        headers,
        messageBody.content
      )
    }

    return new HttpResponse(
      http_transaction,
      status,
      HttpResponseHeaders.create(data),
      data.content.length ? data.content[0].content : ''
    )
  }
}

export class HttpResponseHeaders {
  private rows: { name: string; value: string }[] = []

  clone() {
    const headers = new HttpResponseHeaders()
    this.rows.forEach(({ name, value }) => headers.set(name, value))
    return headers
  }

  set(name: string, value: string) {
    const index = this.indexOf(name)
    if (index >= 0) {
      this.rows[index].value = value
    } else {
      this.rows.push({ name, value })
    }
  }

  get(name: string): string | null {
    const index = this.indexOf(name)
    const header = this.rows[index]
    return header ? header.value : null
  }

  hasContentType() {
    return this.indexOf('Content-Type') >= 0
  }

  indexOf(name: string) {
    for (let i = 0; i < this.rows.length; i += 1) {
      if (this.rows[i].name === name) return i
    }
    return -1
  }

  toJson() {
    return this.rows.map(({ name, value }) => ({ name, value }))
  }

  static create(data: ProtagonistHttpResponse) {
    const headers = new HttpResponseHeaders()
    if (!data.attributes) {
      return headers
    }
    data.attributes.headers.content.forEach((member) => {
      headers.set(member.content.key.content, member.content.value.content)
    })
    if (!headers.hasContentType()) {
      headers.set(
        'Content-Type',
        data.content[0].attributes.contentType.content
      )
    }
    return headers
  }
}
