# pambda-brotli

Serve pre-compressed contents with brotli.

## Installation

```
npm i pambda-brotli -S
```

## Usage

``` javascript
import { compose, createLambda } from 'pambda';
import { serveStatic } from 'pambda-serve-static';
import { brotli } from 'pambda-brotli';

export const handler = createLambda(
  compose(
    /*
     * Enable to serve pre-compressed contents.
     */
    brotli(),

    /*
     * Subsequent pambdas have to serve both non-compressed and pre-compressed files.
     *
     * e.g.
     *   /js/test.js
     *   /js/test.js.br
     */
    serveStatic('public/js', {
      basePath: '/js',
    })
  )
);
```

Run the following commands to make pre-compressed files:

``` shell
# Install `bro` command in Mac
brew install brotoli

# Make a pre-compressed file
bro --input path/to/original --output path/to/original.js
```

## License

MIT
