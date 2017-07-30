const { get } = require('caseless-get');

const brotli = (options = {}) => {
  return next => (event, context, callback) => {
    const { headers } = event;

    const acceptEncoding = get(headers, 'Accept-Encoding');

    if (!acceptEncoding) {
      return next(event, context, callback);
    }

    const encodings = acceptEncoding.split(',').map(s => s.trim());
    if (!encodings.includes('br')) {
      return next(event, context, callback);
    }

    /*
     * Try a pre-compressed resource.
     */
    const brotliEvent = Object.assign({}, event);
    brotliEvent.path = event.path + '.br';

    next(brotliEvent, context, (err, result) => {
      if (err) {
        return callback(err);
      }

      /*
       * Serve pre-compressed contents.
       */
      if (result.statusCode !== 404) {
        if (!result.headers) {
          result.headers = {};
        }

        result.headers['Content-Encoding'] = 'br';

        return callback(null, result);
      }

      /*
       * Re-try the original event.
       */
      return next(event, context, callback);
    });
  };
};

/*
 * Exports.
 */
exports.brotli = brotli;
