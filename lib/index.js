import http from 'http';

export default class Minima {
  /**
   * Initialize a new Minima instance
   *
   * @api public
   */

  #middleware;

  constructor() {
    this.#middleware = [];
  }

  /**
   * Use the middleware function 'fn'.
   *
   * @param {Function} fn
   * @return {void}
   * @api public
   */
  use(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('middleware must be a function');
    }
    this.#middleware.push(fn);
  }

  /**
   * Handle creating an http server
   *
   * @param {string} port
   * @param {Function} callback
   * @return {void}
   * @api public
   */
  listen(port, callback) {
    const handler = this.#callback();
    return http.createServer(handler).listen({ port }, callback);
  }

  /**
   * Create and return a callback for the native
   * node http server
   *
   * @return {Function}
   * @api private
   */
  #callback() {
    const handler = (req, res) => {
      this.#handle(req, res, (err) => {
        if (err) {
          res.writeHead(500);
          res.end('Internal server error');
        }
      });
    };

    return handler;
  }

  /**
   * Execute all middleware passed to app.use()
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} callback
   * @return {void}
   * @api private
   */
  #handle(req, res, callback) {
    let index = 0;

    const next = (err) => {
      if (err) {
        setImmediate(() => callback(err));
        return;
      }
      if (index >= this.#middleware.length) {
        setImmediate(() => callback());
        return;
      }

      const layer = this.#middleware[index++];
      setImmediate(() => {
        try {
          layer(req, res, next);
        } catch (error) {
          next(error);
        }
      });
    };

    next();
  }
}
