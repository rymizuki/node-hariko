import fs             from 'fs';
import _              from 'lodash';
import protagonist    from 'protagonist';
import JSON           from 'json5';
import * as uriParser from '../uri-parser';

export class BakerResource {
  constructor(files) {
    this.files = files;
    this._data = {};
    this.warnings = [];
    this.ensureFiles();
  }
  ensureFiles() {
    this._data = this._parse(this._loadFile());
  }
  _loadFile () {
    return _.chain(this.files)
      .map(function (filepath) {
        return fs.readFileSync(filepath).toString();
      })
      .join('')
      .value();
  }
  _parse (rawdata) {
    var data = protagonist.parseSync(rawdata);
    var apiResource = [];

    if (data.warnings)
      this.warnings = data.warnings;

    for (let i = 0; i < data.ast.resourceGroups.length; i++) {
      let resourceGroup = data.ast.resourceGroups[i];
      for (let ii = 0; ii < resourceGroup.resources.length; ii++) {
        let resource = resourceGroup.resources[ii];

        for (let iii = 0; iii < resource.actions.length; iii++) {
          let action = resource.actions[iii];

          for (let iiii = 0; iiii < action.examples.length; iiii++) {
            let example = action.examples[iiii];

            for (let iiiii = 0; iiiii < example.responses.length; iiiii++) {
              let response = example.responses[iiiii];
              let method      = action.method,
                  uri         = uriParser.parse(resource.uriTemplate),
                  statusCode  = 200,
                  headers     = response.headers,
                  data        = JSON.parse(response.body);
              apiResource.push({
                request:  { method, uri },
                response: { statusCode, headers, data }
              });
            }
          }
        }
      }
    }

    return apiResource;
  }
  toJSON () {
    return this._data;
  }
}

export function create (files) {
  return new BakerResource(files);
}
