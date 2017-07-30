const test = require('tape');
const { brotli } = require('..');
const { get } = require('caseless-get');

test('test', t => {
  t.plan(6);

  const pambda = brotli();

  const lambda = pambda((event, context, callback) => {
    t.equal(typeof(event.path), 'string');
    t.ok(event.path.endsWith('.br'));

    callback(null, {
      statusCode: 200,
    });
  });

  const event = {
    path: '/test.js',
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
    },
  };

  lambda(event, {}, (err, result) => {
    t.error(err);

    t.equal(result.statusCode, 200);
    t.equal(typeof(result.headers), 'object');
    t.equal(get(result.headers, 'Content-Encoding'), 'br');
  });
});

test('test for retry', t => {
  t.plan(9);

  let step = 0;

  const pambda = brotli();

  const lambda = pambda((event, context, callback) => {
    if (step === 0) {
      t.equal(typeof(event.path), 'string');
      t.ok(event.path.endsWith('.br'));

      step++;

      callback(null, {
        statusCode: 404,
      });
    } else {
      t.equal(typeof(event.path), 'string');
      t.notOk(event.path.endsWith('.br'));

      step++;

      callback(null, {
        statusCode: 200,
        headers: {
        },
      });
    }
  });

  const event = {
    path: '/test.js',
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
    },
  };

  lambda(event, {}, (err, result) => {
    t.error(err);

    t.equal(step, 2);
    t.equal(result.statusCode, 200);
    t.equal(typeof(result.headers), 'object');
    t.notEqual(get(result.headers, 'Content-Encoding'), 'br');
  });
});
