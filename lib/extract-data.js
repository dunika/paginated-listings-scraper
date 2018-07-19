'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractListingData = exports.extractData = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _pickBy2 = require('lodash/fp/pickBy');

var _pickBy3 = _interopRequireDefault(_pickBy2);

var _isFunction2 = require('lodash/fp/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _url = require('url');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO get babel plugin for this

/**
* @param  {string | Function} nextPageSelector
* @param  {string} url
* @param  {Function} $
* @returns {Array}
*/

var getNextPageUrl = function getNextPageUrl(nextPageSelector, $, url) {
  if ((0, _isFunction3.default)(nextPageSelector)) {
    return nextPageSelector($, url);
  }

  var element = $(nextPageSelector);
  if (!element) {
    return null;
  }

  var href = element.attr('href');
  if (!href) {
    return null;
  }

  try {
    return new _url.URL(href).href;
  } catch (error) {
    var _ref = new _url.URL(url),
        origin = _ref.origin;

    return '' + origin + href;
  }
};

var extractText = function extractText(_ref2) {
  var $ = _ref2.$,
      parent = _ref2.parent,
      selector = _ref2.selector;

  var element = parent ? parent.find($(selector)) : $(selector);
  return element.text();
};

var extractData = exports.extractData = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref4) {
    var parent = _ref4.parent,
        html = _ref4.html,
        url = _ref4.url,
        selectors = _ref4.selectors;
    var data;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return _bluebird2.default.reduce((0, _entries2.default)(selectors), function () {
              var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(results, _ref6) {
                var _ref7 = (0, _slicedToArray3.default)(_ref6, 2),
                    key = _ref7[0],
                    selector = _ref7[1];

                var extract, $;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        extract = (0, _isFunction3.default)(selector) ? selector : extractText;
                        $ = _cheerio2.default.load(html);
                        _context.t0 = _extends4.default;
                        _context.t1 = {};
                        _context.t2 = results;
                        _context.t3 = _defineProperty3.default;
                        _context.t4 = {};
                        _context.t5 = key;
                        _context.next = 10;
                        return extract({
                          $: $,
                          parent: parent,
                          url: url
                        });

                      case 10:
                        _context.t6 = _context.sent;
                        _context.t7 = (0, _context.t3)(_context.t4, _context.t5, _context.t6);
                        return _context.abrupt('return', (0, _context.t0)(_context.t1, _context.t2, _context.t7));

                      case 13:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x2, _x3) {
                return _ref5.apply(this, arguments);
              };
            }(), {});

          case 3:
            data = _context2.sent;
            return _context2.abrupt('return', (0, _pickBy3.default)(data));

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2['catch'](0);
            throw new Error('Extraction error: ' + _context2.t0.message);

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 7]]);
  }));

  return function extractData(_x) {
    return _ref3.apply(this, arguments);
  };
}();

/**
* @param  {Function} extract
* @param  {Function} terminate
* @returns {Function}
*/

var withTerminate = function withTerminate(extract, terminate) {
  var state = { hasFinished: false, hasPrinted: false };
  return function extractWithTerminate(cheerioElement, $) {
    state.hasFinished = terminate(cheerioElement);
    if (state.hasFinished) {
      if (!state.hasPrinted) {
        state.hasPrinted = true;
      }
      return null;
    }
    return extract(cheerioElement, $);
  };
};

/**
* @param  {Object} options
* @param  {string | Function} options.dataSelector
* @param  {Function} [options.filter]
* @param  {string} options.html
* @param  {string | Function} options.nextPageSelector
* @param  {string} options.url
* @param  {string} options.parentSelector
* @param  {string | Function} [options.dataSelector]
* @param  {Function} [options.terminate]
* @returns {Array}
*/

var extractListingData = exports.extractListingData = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref9) {
    var dataSelector = _ref9.dataSelector,
        depth = _ref9.depth,
        filter = _ref9.filter,
        html = _ref9.html,
        nextPageSelector = _ref9.nextPageSelector,
        nextRequestOptions = _ref9.nextRequestOptions,
        parentSelector = _ref9.parentSelector,
        terminate = _ref9.terminate,
        url = _ref9.url;
    var $, elements, extractor, extract, data, nextPageUrl;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            $ = _cheerio2.default.load(html);
            elements = $(parentSelector).filter(!filter ? function () {
              return true;
            } : filter);

            if (elements.length) {
              _context3.next = 4;
              break;
            }

            return _context3.abrupt('return', {
              data: null,
              nextPageUrl: getNextPageUrl(nextPageSelector, $, url),
              nextRequestOptions: nextRequestOptions && nextRequestOptions(url, $, depth)
            });

          case 4:
            extractor = (0, _isFunction3.default)(dataSelector) ? dataSelector : extractData;
            extract = terminate ? withTerminate(extractor, terminate) : extractor;
            data = elements.map(function (index, element) {
              var parent = $(element);
              return extract({
                html: html,
                parent: parent,
                selectors: dataSelector,
                url: url
              });
            }).get().filter(function (value) {
              return value;
            });

            // If the length of the data does not match the length of the elements acted on then we can assume
            // that the terminate function returned true

            nextPageUrl = data.length === elements.length ? getNextPageUrl(nextPageSelector, url, $) : null;
            return _context3.abrupt('return', {
              data: data,
              nextPageUrl: nextPageUrl,
              nextRequestOptions: nextRequestOptions && nextRequestOptions(url, $, depth)
            });

          case 9:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  function extractListingData(_x4) {
    return _ref8.apply(this, arguments);
  }

  return extractListingData;
}();