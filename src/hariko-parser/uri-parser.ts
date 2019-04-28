const PARAM_OPERATORS_REG = /\#\+\?\&/g
const PATHNAME_REG = /\{(.*?)\}/g
const URL_SPLIT_REG = /\{?\?/

export class UriParser {
  private path_base: string
  private param_base: string
  constructor(private template: string) {
    const [path, param] = this.template.split(URL_SPLIT_REG)
    this.path_base = path
    this.param_base = param
  }

  /**
   * `/path/{name}{?param}`から`{template, queries, path}`に変換
   */
  parse() {
    return {
      template: this.template,
      queries: this.param_base ? this.parseQuery(this.param_base) : [],
      path: this.parsePathName(this.path_base)
    }
  }

  private parseQuery(param_base: string) {
    return param_base
      .split(/\,|\{|\}/g)
      .map((param) => param.replace(PARAM_OPERATORS_REG, ''))
      .filter((param) => param.length)
      .map((param) => {
        if (!/=/.test(param)) {
          return param
        }
        const [name, value] = param.split(/=/)
        return { name, value: decodeURIComponent(value) }
      })
  }

  /**
   * `/path/{name}`を`/path/:name`に変換
   * @param pathname
   */
  parsePathName(pathname: string) {
    return pathname.replace(PATHNAME_REG, ':$1')
  }
}
