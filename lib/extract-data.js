'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractListingData = exports.buildExtractData = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* @param  {string | Function} nextPageSelector
* @param  {string} url
* @param  {Function} $
* @returns {Array}
*/

var getNextPageUrl = function getNextPageUrl(nextPageSelector, $, url, depth) {
  if ((0, _isFunction3.default)(nextPageSelector)) {
    return nextPageSelector({ $: $, depth: depth, url: url });
  }

  var element = $(nextPageSelector);
  if (!element) {
    (0, _debug2.default)('getNextPageUrl - no element found for nextPageSelector ' + nextPageSelector);
    return null;
  }

  var href = element.attr('href');
  if (!href) {
    return null;
  }

  try {
    var nextPageUrl = new _url.URL(href).href;
    (0, _debug2.default)('getNextPageUrl - returned ' + url);
    return nextPageUrl;
  } catch (error) {
    var _ref = new _url.URL(url),
        origin = _ref.origin;

    return '' + origin + href;
  }
}; // TODO get babel plugin for this

var extractText = function extractText(_ref2) {
  var $ = _ref2.$,
      parent = _ref2.parent,
      selector = _ref2.selector;

  var element = parent ? parent.find($(selector)) : $(selector);
  return element.text().trim();
};

var buildExtractData = exports.buildExtractData = function buildExtractData(selectors) {
  return function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref4) {
      var parent = _ref4.parent,
          html = _ref4.html,
          url = _ref4.url;
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

                  var extract, $, result;
                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          extract = (0, _isFunction3.default)(selector) ? selector : extractText;
                          $ = _cheerio2.default.load(html);
                          _context.next = 4;
                          return extract({ $: $, parent: parent, url: url });

                        case 4:
                          result = _context.sent;
                          return _context.abrupt('return', (0, _extends4.default)({}, results, (0, _defineProperty3.default)({}, key, result)));

                        case 6:
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

              (0, _debug2.default)('Extacction Error - ' + _context2.t0.message);
              throw new Error('Extraction error: ' + url + '\n      ' + _context2.t0.message + '\n    ');

            case 11:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined, [[0, 7]]);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }();
};

/**
* @param  {Function} extract
* @param  {Function} terminate
* @returns {Function}
*/

var withTerminate = function withTerminate(extract, terminate) {
  var state = { hasFinished: false, hasPrinted: false };
  return function () {
    var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(_ref9) {
      var html = _ref9.html,
          parent = _ref9.parent,
          url = _ref9.url;
      var $, data;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              $ = _cheerio2.default.load(html);

              state.hasFinished = terminate(parent, $);

              if (!state.hasFinished) {
                _context3.next = 5;
                break;
              }

              if (!state.hasPrinted) {
                (0, _debug2.default)('extractData - terminated');
                state.hasPrinted = true;
              }
              return _context3.abrupt('return', null);

            case 5:
              _context3.next = 7;
              return extract({ html: html, parent: parent, url: url });

            case 7:
              data = _context3.sent;
              return _context3.abrupt('return', data);

            case 9:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function extractWithTerminate(_x4) {
      return _ref8.apply(this, arguments);
    }

    return extractWithTerminate;
  }();
};

var buildDataSelectorExtractor = function buildDataSelectorExtractor(dataSelector) {
  return function (_ref10) {
    var html = _ref10.html,
        rest = (0, _objectWithoutProperties3.default)(_ref10, ['html']);

    var $ = _cheerio2.default.load(html);
    return dataSelector((0, _extends4.default)({ $: $ }, rest));
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
  var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(_ref12) {
    var _this = this;

    var dataSelector = _ref12.dataSelector,
        depth = _ref12.depth,
        filter = _ref12.filter,
        html = _ref12.html,
        nextPageSelector = _ref12.nextPageSelector,
        nextRequestOptions = _ref12.nextRequestOptions,
        parentSelector = _ref12.parentSelector,
        terminate = _ref12.terminate,
        url = _ref12.url;
    var $, elements, extractor, extract, parents, data, nextPageUrl;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            $ = _cheerio2.default.load(html);
            elements = $(parentSelector).filter(!filter ? function () {
              return true;
            } : filter);

            if (elements.length) {
              _context5.next = 5;
              break;
            }

            (0, _debug2.default)('No elements found matching ' + parentSelector);
            return _context5.abrupt('return', {
              data: null,
              nextPageUrl: getNextPageUrl(nextPageSelector, $, url, depth),
              nextRequestOptions: nextRequestOptions && nextRequestOptions($, url, depth)
            });

          case 5:
            extractor = (0, _isFunction3.default)(dataSelector) ? buildDataSelectorExtractor(dataSelector) : buildExtractData(dataSelector);
            extract = terminate ? withTerminate(extractor, terminate) : extractor;
            parents = elements.map(function (index, element) {
              return $(element);
            }).get();
            data = _bluebird2.default.map(parents, function () {
              var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(parent) {
                var extractedData;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        _context4.next = 2;
                        return extract({
                          html: html,
                          parent: parent,
                          url: url
                        });

                      case 2:
                        extractedData = _context4.sent;
                        return _context4.abrupt('return', extractedData);

                      case 4:
                      case 'end':
                        return _context4.stop();
                    }
                  }
                }, _callee4, _this);
              }));

              return function (_x6) {
                return _ref13.apply(this, arguments);
              };
            }()).filter(Boolean);
            // If the length of the data does not match the length of the elements acted on then we can assume
            // that the terminate function returned true

            nextPageUrl = data.length === elements.length ? getNextPageUrl(nextPageSelector, url, $) : null;
            return _context5.abrupt('return', {
              data: data,
              nextPageUrl: nextPageUrl,
              nextRequestOptions: nextRequestOptions && nextRequestOptions(url, $, depth)
            });

          case 11:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  function extractListingData(_x5) {
    return _ref11.apply(this, arguments);
  }

  return extractListingData;
}();