# node-hariko
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

### time

Output the logging time.
By default `false`.

```
hariko -f 'docs/**/*.md' -t
```

## API

## License

MIT

