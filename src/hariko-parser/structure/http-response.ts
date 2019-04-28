import { ProtagonistHttpResponse } from 'protagonist'
import { HttpTransaction } from './http-transaction'

export class HttpResponse {
  constructor(
    public readonly http_transaction: HttpTransaction,
    private _status_code: number,
    private _headers: HttpResponseHeaders,
    public body: string
  ) {}

  get status_code() {
    return Number(this._status_code)
  }

  get headers() {
    return this._headers.toJson()
  }

  clone() {
    return new HttpResponse(
      this.http_transaction,
      this._status_code,
      this._headers.clone(),
      this.body
    )
  }

  isJsonResponse() {
    const content_type = this._headers.get('Content-Type')
    if (content_type && /json/.test(content_type)) {
      return true
    }
    return false
  }

  static create(
    http_transaction: HttpTransaction,
    data: ProtagonistHttpResponse
  ) {
    return new HttpResponse(
      http_transaction,
      data.attributes.statusCode.content,
      HttpResponseHeaders.create(data),
      data.content[0].content
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

  indexOf(name: string) {
    for (let i = 0; i < this.rows.length; i++) {
      if (this.rows[i].name === name) return i
    }
    return -1
  }

  toJson() {
    return this.rows.map(({ name, value }) => ({ name, value }))
  }

  static create(data: ProtagonistHttpResponse) {
    const headers = new HttpResponseHeaders()
    data.attributes.headers.content.forEach((member) => {
      headers.set(member.content.key.content, member.content.value.content)
    })
    headers.set('Content-Type', data.content[0].attributes.contentType.content)
    return headers
  }
}
