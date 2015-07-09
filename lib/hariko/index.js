import * as Baker from './hariko';

export function start (argv) {
  var baker = Baker.create(argv);
  baker.bake();
}
