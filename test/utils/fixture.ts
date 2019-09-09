import * as fs from 'fs'

export function load(file_path: string) {
  return fs.readFileSync(file_path, 'utf8')
}
