'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _isFunction2 = require('lodash/fp/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _isNumber2 = require('lodash/fp/isNumber');

var _isNumber3 = _interopRequireDefault(_isNumber2);

var _url = require('url');

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _debug = require('./utils/debug');

var _debug2 = _interopRequireDefault(_debug);

var _extractData = require('./extract-data');

var _extractData2 = _interopRequireDefault(_extractData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* Recursively calls its inner function to extract data from each page
* @param  {Object} options
* @param  {string} options.origin
* @param  {number} [options.maximiumDepth]
* @param {Function} [options.terminate]
* @returns {Function} getListing
*/

function getListings(_ref) {
  var _this = this;

  var maximiumDepth = _ref.maximiumDepth,
      origin = _ref.origin,
      _ref$shouldReturnData = _ref.shouldReturnDataOnError,
      shouldReturnDataOnError = _ref$shouldReturnData === undefined ? false : _ref$shouldReturnData,
      terminate = _ref.terminate,
      requestOptions = _ref.requestOptions,
      otherOptions = (0, _objectWithoutProperties3.default)(_ref, ['maximiumDepth', 'origin', 'shouldReturnDataOnError', 'terminate', 'requestOptions']);

  if (!(0, _isNumber3.default)(maximiumDepth) && !(0, _isFunction3.default)(terminate)) {
    throw Error('Please provide either a maximiumDepth or a a terminate function');
  }
  var getListing = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url, _ref3) {
      var _ref3$depth = _ref3.depth,
          depth = _ref3$depth === undefined ? 1 : _ref3$depth,
          requestOptions = _ref3.requestOptions;

      var html, _ref4, nextPageUrl, data, nextData;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              (0, _debug2.default)('Current page depth: ' + depth);

              if (!((0, _isNumber3.default)(maximiumDepth) && depth > maximiumDepth)) {
                _context.next = 3;
                break;
              }

              return _context.abrupt('return', []);

            case 3:
              _context.prev = 3;

              (0, _debug2.default)('Getting listings from ' + url);
              _context.next = 7;
              return (0, _requestPromiseNative2.default)((0, _extends3.default)({ url: url }, requestOptions));

            case 7:
              html = _context.sent;
              _context.next = 10;
              return (0, _extractData2.default)((0, _extends3.default)({ html: html, origin: origin, terminate: terminate }, otherOptions));

            case 10:
              _ref4 = _context.sent;
              nextPageUrl = _ref4.nextPageUrl;
              data = _ref4.data;

              if (!nextPageUrl) {
                _context.next = 18;
                break;
              }

              _context.next = 16;
              return getListing(nextPageUrl, { depth: depth + 1 });

            case 16:
              nextData = _context.sent;
              return _context.abrupt('return', [].concat((0, _toConsumableArray3.default)(data && data), (0, _toConsumableArray3.default)(nextData)));

            case 18:
              return _context.abrupt('return', data);

            case 21:
              _context.prev = 21;
              _context.t0 = _context['catch'](3);

              (0, _debug2.default)('ERROR: getListings: ' + _context.t0.message);

              if (!shouldReturnDataOnError) {
                _context.next = 26;
                break;
              }

              return _context.abrupt('return', []);

            case 26:
              throw new Error(_context.t0);

            case 27:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[3, 21]]);
    }));

    return function getListing(_x, _x2) {
      return _ref2.apply(this, arguments);
    };
  }();
  return getListing;
}

/**
* @param  {Object} options
* @param  {string} options.url
* @param  {Object} [options.requestOptions]
* @returns {void}
*/

exports.default = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(options) {
    var url, requestOptions, otherOptions, _ref6, origin, data;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            url = options.url, requestOptions = options.requestOptions, otherOptions = (0, _objectWithoutProperties3.default)(options, ['url', 'requestOptions']);
            _ref6 = new _url.URL(url), origin = _ref6.origin;
            _context2.next = 5;
            return getListings((0, _extends3.default)({ origin: origin }, otherOptions))(url, { requestOptions: requestOptions });

          case 5:
            data = _context2.sent;

            if (!data) {
              (0, _debug2.default)('scrape - no data found');
            } else {
              (0, _debug2.default)('scrape - finished with ' + data.length + ' results');
            }
            return _context2.abrupt('return', data);

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2['catch'](0);

            (0, _debug2.default)('ERROR: scrape: ' + _context2.t0.message);
            throw new Error(_context2.t0);

          case 14:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 10]]);
  }));

  function scrape(_x3) {
    return _ref5.apply(this, arguments);
  }

  return scrape;
}();