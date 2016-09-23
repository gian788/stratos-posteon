'use strict';

/*!
 * Module dependencies.
 */
var _ = require('lodash');
var fs = require('fs');

var path = require('path');
var render = require('stratos-render');
var posteon = require('posteon');
var ejs = require('ejs');


function StratosPosteon () {
  this.options = {};
  this.render = render;
}

/**
 * Sets options
 *
 * # Example:
 *
 *   stratosPosteon.set('debug', true)
 *
 * @param {String} key
 * @param {String|Function} value
 * @api public
 */

StratosPosteon.prototype.set = function(key, value) {
  if (arguments.length === 1) {
    return this.options[key];
  }

  this.options[key] = value;
  return this;
};

/**
 * Gets options
 *
 * # Example:
 *
 *   stratosPosteon.get('test') // returns the 'test' value
 *
 * @param {String} key
 * @api public
 */

StratosPosteon.prototype.get = StratosPosteon.prototype.set;

/**
 * Init StratosPosteon
 *
 * # Example:
 *
 *   posteon.init()
 *
 *   stratosPosteon.init({..})
 *
 * @param {Object} options
 * @method init
 * @api public
 */

StratosPosteon.prototype.init = function(options) {
  this.options = _.merge(options, this.options);
  posteon.init(this.options);
};

/**
 * Add render filter
 *
 * # Example:
 *
 *   stratosPosteon.addFilter(date)
 *
 * @param {String} name
 * @param {Function} filter
 * @api public
 */

StratosPosteon.prototype.addFilter = function(name, filter) {
  ejs.filters[name] = filter;
};

/**
 * Add render filters
 *
 * # Example:
 *
 *   stratosPosteon.addFilters(filters)
 *
 * @param {Array} filters
 * @api public
 */

StratosPosteon.prototype.addFilters = function(filters) {
  for (var i in filters) {
    this.addFilter(i, filters[i]);
  }
};

/**
 * Load and add render filters form a directory
 *
 * # Example:
 *
 *   stratosPosteon.loadFilters(pathToFiltersDirectory)
 *
 * @param {String} dir
 * @param {Function} callback
 * @api public
 */

StratosPosteon.prototype.loadFilters = function(dir, callback) {
  var self = this;
  var filters = {};

  fs.readdir(dir, function(err, files){
    if (err) {
      if (callback) {
        return callback(err);
      }
      throw err;
    }

    for (var f in files) {
      if (!files.hasOwnProperty(f)) {
        continue;
      }
      var name = files[f];
      if (!fs.statSync(dir + '/' + name).isDirectory() && name.indexOf('.js') !== -1) {
        filters[name.substring(0, name.length - 3)] = require(path.join(dir, name));
      }
    }
    if (ejs) {
      self.addFilters(filters);
    }
    if (callback) {
      callback();
    }
  });
};

/**
 * Send a message
 *
 * # Example:
 *
 *   stratosPosteon.send({name: 'sendgrid', apiKey: 'YOUR_APYKEY'}, {to: {name: 'John', email: 'john@dra.it'}, from: {name: 'Postie Pigeon', email: 'postie.pigeon@dra.it'}, html: 'Hello John!'});
 *
 * @param {Object} data
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */

StratosPosteon.prototype.send = function (options, callback) {
  if (options.html) {
    return posteon.send(options.provider, options, callback);
  }
  var renderOptions = {
    template: options.template,
    layout: options.layout,
  };
  render.renderTemplate(options.data, renderOptions, function (err, html, text) {
    if (err) {
      return callback(err);
    }
    options.html = html;
    if (text) {
      options.text = text;
    }
    options.data = undefined;
    posteon.send(options.provider, options, callback);
  });
};


StratosPosteon.prototype.addProvider = function (provider) {
  posteon.addProvider(provider);
};


module.exports = new StratosPosteon();
