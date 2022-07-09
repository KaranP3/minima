import { pathToRegexp } from 'path-to-regexp';

export default class Layer {
  /**
   * Initialize a Layer instance.
   * 
   * Layer acts as the fundamental routing construct. 
   * The middleware pipeline is essentially an array of "Layer" instances
   *
   * @api package
   */

  /**
   * @param {string} method
   * @param {string} url
   * @param {string} middleware
   */
  constructor(method, url, middleware) {
    this.method = method;
    this.middleware = middleware;
    this.params = {};
    if (url) {
      this.keys = [];
      this.url = pathToRegexp(url, this.keys);
    }
  }

  /**
   * Determine if middleware should execute on a given request
   * 
   * @param {*} method
   * @param {*} url
   * @return {boolean}
   * @api package
   */
  match(method, url) {
    if (this.method && this.method !== method) return false;

    if (this.url) {
      const match = this.url.exec(url);
      if (!match) return false;

      this.params = {};
      for (let i = 1; i < match.length; ++i) {
        this.params[this.keys[i - 1].name] = decodeURIComponent(match[i]);
      }
    }

    return true;
  }
}
