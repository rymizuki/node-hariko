import { ResourceStructure } from './resource'

export class ResourcesStructure {
  public rows: ResourceStructure[] = []

  add(resource: ResourceStructure) {
    this.rows.push(resource)
  }

  createResource(uri_template: string) {
    return new ResourceStructure(uri_template)
  }

  static create() {
    return new ResourcesStructure()
  }
}
