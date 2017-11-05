'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _isFunction2 = require('lodash/fp/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _url = require('url');

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _debug = require('./utils/debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @param  {string | Function} nextPageSelector
* @param  {string} origin
* @param  {Function} $
* @returns {Array}
*/

var getNextPageUrl = function getNextPageUrl(nextPageSelector, origin, $) {
  if ((0, _isFunction3.default)(nextPageSelector)) {
    return nextPageSelector(origin, $);
  }

  var element = $(nextPageSelector);
  if (!element) {
    (0, _debug2.default)('getNextPageUrl - no element found for nextPageSelector ' + nextPageSelector);
    return null;
  }

  var href = element.attr('href');
  if (!href) {
    (0, _debug2.default)('getNextPageUrl - no href attribute found for nextPageSelector ' + nextPageSelector);
    return null;
  }

  try {
    var _ref = new _url.URL(href),
        url = _ref.href;

    (0, _debug2.default)('getNextPageUrl - returned ' + url);
    return url;
  } catch (error) {
    (0, _debug2.default)('getNextPageUrl - returned ' + origin + href);
    return '' + origin + href;
  }
};

/**
* @param  {string | Function} dataSelector
* @param  {Object} element
* @param  {Function} $
* @returns {Object}
*/

// TODO get babel plugin for this

var buildExtractText = function buildExtractText(dataSelector) {
  return function extractText(parent, $) {
    return (0, _entries2.default)(dataSelector).reduce(function (data, _ref2) {
      var _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
          name = _ref3[0],
          selector = _ref3[1];

      var element = parent.find($(selector));
      var text = null;
      if (!element.length) {
        (0, _debug2.default)('extractText - no element found for dataSelector { ' + name + ' : \'' + selector + '\' }');
      } else {
        text = element.text();
        if (!text) {
          (0, _debug2.default)('extractText - no text found for dataSelector { ' + name + ' : \'' + selector + '\' }');
        }
      }
      (0, _debug2.default)('extractText - text found for dataSelector ' + name);
      return (0, _extends4.default)({}, data, (0, _defineProperty3.default)({}, name, text || null));
    }, {});
  };
};

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
        (0, _debug2.default)('extractData - terminated');
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
* @param  {string} options.origin
* @param  {string} options.parentSelector
* @param  {string | Function} [options.dataSelector]
* @param  {Function} [options.terminate]
* @returns {Array}
*/

exports.default = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(_ref5) {
    var dataSelector = _ref5.dataSelector,
        filter = _ref5.filter,
        html = _ref5.html,
        nextPageSelector = _ref5.nextPageSelector,
        origin = _ref5.origin,
        parentSelector = _ref5.parentSelector,
        terminate = _ref5.terminate;
    var $, elements, extractor, extract, data, nextPageUrl;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            $ = _cheerio2.default.load(html);
            elements = $(parentSelector).filter(!filter ? function () {
              return true;
            } : filter);

            if (elements.length) {
              _context.next = 5;
              break;
            }

            (0, _debug2.default)('No elements found matching ' + parentSelector);
            return _context.abrupt('return', {
              data: null,
              nextPageUrl: getNextPageUrl(nextPageSelector, origin, $)
            });

          case 5:
            extractor = (0, _isFunction3.default)(dataSelector) ? dataSelector : buildExtractText(dataSelector);
            extract = terminate ? withTerminate(extractor, terminate) : extractor;
            data = elements.map(function (index, element) {
              var cheerioElement = $(element);
              return extract(cheerioElement, $);
            }).get().filter(function (value) {
              return value;
            });

            // If the length of the data does not match the length of the elements acted on then we can assume
            // that the terminate function return true

            nextPageUrl = data.length === elements.length ? getNextPageUrl(nextPageSelector, origin, $) : null;
            return _context.abrupt('return', {
              data: data,
              nextPageUrl: nextPageUrl
            });

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  function extractData(_x) {
    return _ref4.apply(this, arguments);
  }

  return extractData;
}();