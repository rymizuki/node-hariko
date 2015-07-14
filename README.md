# node-hariko[![Build Status](https://travis-ci.org/rymizuki/node-hariko.svg?branch=master)](https://travis-ci.org/rymizuki/node-hariko)
Mock Server that implements the API Blueprint specification.

## Get started

### Installation

```
npm install -g https://github.com/rymizuki/node-hariko
```

### Usage

```
hariko\
  -f <glob expression to your md files>\
  -p <server port>
```

## Examples

### for CLI

```shell
hariko -f 'docs/**/*.md' -p 8080 -w
```

### for Node.js

```javascript
var hariko = require('hariko');
hariko.start({
  file: 'docs/**/*.md',
  watch: true
}, function () {
  console.log('Starting hariko server.');
});
```

## CLI Options

### file

Filename in the node-glob format of API Blueprint.

```
hariko -f 'docs/**/*.md'
```

### exclude

Exclude filename in the node-glob format.

```
hariko -f 'docs/**/*.md'\
       --exclude 'docs/metadata.md'\
       --exclude 'docs/overview.md'
```

### port

Port number of API Server.
By default `3000`.

```
hariko -f 'docs/**/*.md' -p 8000
```

### host

Hostname of API Server.
By default `localhost`

```
hariko -f 'docs/**/*.md' --host '0.0.0.0'
```

### watch

Watching changes for markdown files.
By default `false`.

```
hariko -f 'docs/**/*.md' -w
```

This `watch` we have been using the [gaze](https://github.com/shama/gaze).
If you want to exit the `watch` is, enter `Ctrl + C`.

### output

Output in the form of HarikoReosurce to JSON.

```
hariko -f 'docs/**/*.md' -o 'api/'
```

When output option is enabled,
the server can perform realtime data changes because reading JSON.

### proxy

A origin for proxy request.
By default `false`.

```
hariko -f 'docs/**/*.md' --proxy 'http://localhost:8100'
```

### verbose

Output the verbose log.
By default `false`.

```
hariko -f 'docs/**/*.md' -v
```

### log-level

set to log level.

```
hariko -f 'docs/**/*.md' --log-level debug
```

### time

Output the logging time.
By default `false`.

```
hariko -f 'docs/**/*.md' -t
```

## API

```javascript
var hariko = require('hariko');
```

### hariko.start(options [, startCalleback]);

- options
  - SEE ALSO [CLI Option's section](#cli-options)
- startCallback
  - execute when server listening

```
hariko.start({file: 'docs/**/*.md'}, function () {
  console.log('hariko started!');
});
```

## License

MIT

