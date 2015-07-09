import glob               from 'glob';
import * as BakerResource from './resource';
import * as BakerServer   from './server';

export class Baker {
  constructor (argv) {
    this.resource = null;
    this.options = {
      exclude:  argv.exclude,
      port:     argv.port,
      host:     argv.host
    };
    this.files   = this._parseGlob(argv.file);
  }
  _parseGlob (includes) {
    return glob.sync(includes, {ignore: this.options.exclude});
  }
  bake() {
    this.resource = BakerResource.create(this.files);
    var entries = this.resource.toJSON();
    BakerServer.create(entries, {
      port: this.options.port,
      host: this.options.host
    }).start();
  }
}

export function create (argv) {
  return new Baker(argv);
}


