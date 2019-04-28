import { HttpTransaction } from './http-transaction'
import { ProtagonistTransition } from 'protagonist'
import { ResourceStructure } from './resource'

export class TransitionStructure {
  public http_transactions: HttpTransaction[] = []

  constructor(
    public readonly resource: ResourceStructure,
    public title: string
  ) {}

  hasMultipleRequest() {
    for (let i = 0; i < this.http_transactions.length; i++) {
      const request = this.http_transactions[i].request
      if (request.hasSpecificUri()) return true
    }
    return false
  }

  addHttpTransaction(http_transaction: HttpTransaction) {
    this.http_transactions.push(http_transaction)
  }

  createHttpTransaction() {
    return HttpTransaction.create(this)
  }

  static create(resource: ResourceStructure, data: ProtagonistTransition) {
    const title = data.meta.title.content
    return new TransitionStructure(resource, title)
  }
}
