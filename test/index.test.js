import assert from 'assert';
import axios from 'axios';
import cors from 'cors';
import { afterEach, describe, it } from 'mocha';
import Minima from '../lib/index.js';

describe('Minima', () => {
  let server;
  afterEach(() => server && server.close());

  it('works for a basic hello world', async () => {
    const app = new Minima();

    app.use((_, res, next) => {
      res.end('Hello world');
      next();
    });

    server = app.listen('3000');

    const res = await axios.get('http://localhost:3000');
    assert.equal(res.data, 'Hello world');
  });

  it('works with existing express CORS middleware', async () => {
    const app = new Minima();

    app.use(cors());
    app.use((_, res, next) => {
      res.end('With CORS middleware');
      next();
    });

    server = app.listen(3000);

    const res = await axios.get('http://localhost:3000');
    assert.equal(res.headers['access-control-allow-origin'], '*');
    assert.equal(res.data, 'With CORS middleware');
  });
});
