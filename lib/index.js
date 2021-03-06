import http from 'http';
import Layer from './Layer.js';

export default class Minima {
  /**
   * Initialize a new Minima application instance.
   *
   * @api public
   */

  #layers;

  constructor() {
    this.#layers = [];
  }

  /**
   * Use the middleware function 'fn'.
   *
   * @param {Function} fn
   * @returns {void}
   * @api public
   */
  use(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('middleware must be a function');
    }
    this.#layers.push(new Layer(null, null, fn));
  }

  /**
   * Handle creating an http server.
   *
   * @param {string} port
   * @param {Function} callback
   * @returns {void}
   * @api public
   */
  listen(port, callback) {
    const handler = this.#callback();
    return http.createServer(handler).listen({ port }, callback);
  }

  /**
   * Register a route
   * 
   * @param {string} method 
   * @param {string} url 
   * @param {Function} handler
   * @returns {this}
   * @api public 
   */
  route(method, url, handler) {
    this.#layers.push(new Layer(method, url, handler))
    return this;
  }

  /**
   * Register a route associated with the GET method
   * 
   * @param {string} url 
   * @param {Function} handler 
   * @returns {this}
   */
  get(url, handler) {
    return this.route('GET', url, handler);
  }

  /**
   * Create and return a callback for the native
   * node http server.
   *
   * @returns {Function}
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
   * Execute all middleware passed to app.use().
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Function} callback
   * @returns {void}
   * @api private
   */
  #handle(req, res, callback) {
    let index = 0;

    const next = (err) => {
      if (err) {
        setImmediate(() => callback(err));
        return;
      }
      if (index >= this.#layers.length) {
        setImmediate(() => callback());
        return;
      }

      let layer = this.#layers[index++];
      while (index <= this.#layers.length && !layer.match(req.method, req.url)) {
        layer = this.#layers[index++];
      }

      if (layer == null) {
        setImmediate(() => callback());
        return;
      }

      req.params = { ...layer.params };
      setImmediate(() => {
        try {
          layer.middleware(req, res, next);
        } catch (error) {
          next(error);
        }
      });
    };

    next();
  }
}
