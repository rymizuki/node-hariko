export class AnnotationsStructure {
  private rows = []

  add(annotation) {
    this.rows.push(annotation)
  }

  toJson() {
    return []
  }

  static create() {
    return new AnnotationsStructure()
  }
}
