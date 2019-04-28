import { HttpResponse } from './http-response'
import { HttpRequest } from './http-request'
import { ProtagonistHttpRequest, ProtagonistHttpResponse } from 'protagonist'
import { TransitionStructure } from './transition'

export class HttpTransaction {
  public request: HttpRequest
  public response: HttpResponse

  constructor(public readonly transition: TransitionStructure) {}

  clone() {
    const http_transaction = new HttpTransaction(this.transition)
    http_transaction.setHttpRequest(this.request.clone())
    http_transaction.setHttpResponse(this.response.clone())
    return http_transaction
  }

  setHttpRequest(request: HttpRequest) {
    this.request = request
  }

  setHttpResponse(response: HttpResponse) {
    this.response = response
  }

  createHttpRequest(data: ProtagonistHttpRequest) {
    return HttpRequest.create(this, data)
  }

  createHttpResponse(data: ProtagonistHttpResponse) {
    return HttpResponse.create(this, data)
  }

  static create(transition: TransitionStructure) {
    return new HttpTransaction(transition)
  }
}
