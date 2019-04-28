import { TransitionStructure } from './transition'
import { ProtagonistTransition } from 'protagonist'

export class ResourceStructure {
  public readonly transitions: TransitionStructure[] = []
  constructor(public readonly uri_template: string) {}

  addTransition(transition: TransitionStructure) {
    this.transitions.push(transition)
  }

  createTransition(data: ProtagonistTransition) {
    return TransitionStructure.create(this, data)
  }

  static create(uri_template: string) {
    return new ResourceStructure(uri_template)
  }
}
