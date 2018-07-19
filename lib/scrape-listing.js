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

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _extractData = require('./extract-data');

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
      url = _ref.url,
      _ref$shouldReturnData = _ref.shouldReturnDataOnError,
      shouldReturnDataOnError = _ref$shouldReturnData === undefined ? false : _ref$shouldReturnData,
      terminate = _ref.terminate,
      otherOptions = (0, _objectWithoutProperties3.default)(_ref, ['maximiumDepth', 'url', 'shouldReturnDataOnError', 'terminate']);

  if (!(0, _isNumber3.default)(maximiumDepth) && !(0, _isFunction3.default)(terminate)) {
    throw Error('Please provide either a maximiumDepth or a a terminate function');
  }

  var getListing = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(requestOptions) {
      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref3$depth = _ref3.depth,
          depth = _ref3$depth === undefined ? 1 : _ref3$depth;

      var html, _ref4, nextRequestOptions, nextPageUrl, data, nextData;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!((0, _isNumber3.default)(maximiumDepth) && depth > maximiumDepth)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return', []);

            case 2:
              _context.prev = 2;
              _context.next = 5;
              return (0, _requestPromiseNative2.default)(requestOptions);

            case 5:
              html = _context.sent;
              _context.next = 8;
              return (0, _extractData.extractListingData)((0, _extends3.default)({ depth: depth, html: html, url: url, terminate: terminate }, otherOptions));

            case 8:
              _ref4 = _context.sent;
              nextRequestOptions = _ref4.requestOptions;
              nextPageUrl = _ref4.nextPageUrl;
              data = _ref4.data;

              if (!(nextPageUrl || nextRequestOptions)) {
                _context.next = 17;
                break;
              }

              _context.next = 15;
              return getListing((0, _extends3.default)({
                url: nextPageUrl
              }, nextRequestOptions), { depth: depth + 1 });

            case 15:
              nextData = _context.sent;
              return _context.abrupt('return', [].concat((0, _toConsumableArray3.default)(data && data), (0, _toConsumableArray3.default)(nextData)));

            case 17:
              return _context.abrupt('return', data);

            case 20:
              _context.prev = 20;
              _context.t0 = _context['catch'](2);

              if (!shouldReturnDataOnError) {
                _context.next = 24;
                break;
              }

              return _context.abrupt('return', []);

            case 24:
              throw new Error(_context.t0);

            case 25:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[2, 20]]);
    }));

    return function getListing(_x) {
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
    var url, requestOptions, otherOptions, data;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            url = options.url, requestOptions = options.requestOptions, otherOptions = (0, _objectWithoutProperties3.default)(options, ['url', 'requestOptions']);
            _context2.next = 4;
            return getListings((0, _extends3.default)({ url: url }, otherOptions))((0, _extends3.default)({ url: url }, requestOptions));

          case 4:
            data = _context2.sent;
            return _context2.abrupt('return', data);

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2['catch'](0);
            throw new Error(_context2.t0);

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 8]]);
  }));

  function scrapeListing(_x3) {
    return _ref5.apply(this, arguments);
  }

  return scrapeListing;
}();