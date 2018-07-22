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

var _scrapePage = require('./scrape-page');

var _extractData = require('./extract-data');

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* Recursively calls its inner function to extract data from each page
* @param  {Object} options
* @param  {string} options.origin
* @param  {number} [options.maximumDepth]
* @param {Function} [options.terminate]
* @returns {Function} getListing
*/

function getListings(_ref) {
  var _this = this;

  var maximumDepth = _ref.maximumDepth,
      url = _ref.url,
      _ref$shouldReturnData = _ref.shouldReturnDataOnError,
      shouldReturnDataOnError = _ref$shouldReturnData === undefined ? false : _ref$shouldReturnData,
      terminate = _ref.terminate,
      otherOptions = (0, _objectWithoutProperties3.default)(_ref, ['maximumDepth', 'url', 'shouldReturnDataOnError', 'terminate']);

  if (!(0, _isNumber3.default)(maximumDepth) && !(0, _isFunction3.default)(terminate)) {
    throw Error('Please provide either a maximumDepth or a a terminate function');
  }

  var getListing = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(requestUrl, requestOptions) {
      var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref3$depth = _ref3.depth,
          depth = _ref3$depth === undefined ? 1 : _ref3$depth;

      var _ref4, html, _ref5, nextRequestOptions, nextPageUrl, data, nextData;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              (0, _debug2.default)('Current page depth: ' + depth);

              if (!((0, _isNumber3.default)(maximumDepth) && depth > maximumDepth)) {
                _context.next = 3;
                break;
              }

              return _context.abrupt('return', []);

            case 3:
              _context.prev = 3;
              _context.next = 6;
              return (0, _scrapePage.getPage)(requestUrl, requestOptions);

            case 6:
              _ref4 = _context.sent;
              html = _ref4.html;
              _context.next = 10;
              return (0, _extractData.extractListingData)((0, _extends3.default)({ depth: depth, html: html, terminate: terminate, url: url }, otherOptions));

            case 10:
              _ref5 = _context.sent;
              nextRequestOptions = _ref5.requestOptions;
              nextPageUrl = _ref5.nextPageUrl;
              data = _ref5.data;

              if (!(nextPageUrl || nextRequestOptions)) {
                _context.next = 19;
                break;
              }

              _context.next = 17;
              return getListing(nextPageUrl, nextRequestOptions, { depth: depth + 1 });

            case 17:
              nextData = _context.sent;
              return _context.abrupt('return', [].concat((0, _toConsumableArray3.default)(data && data), (0, _toConsumableArray3.default)(nextData)));

            case 19:
              return _context.abrupt('return', data);

            case 22:
              _context.prev = 22;
              _context.t0 = _context['catch'](3);

              (0, _debug2.default)('ERROR: getListings: ' + _context.t0.message);

              if (!shouldReturnDataOnError) {
                _context.next = 27;
                break;
              }

              return _context.abrupt('return', []);

            case 27:
              throw new Error(_context.t0);

            case 28:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[3, 22]]);
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
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(options) {
    var url, requestOptions, otherOptions, data;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            url = options.url, requestOptions = options.requestOptions, otherOptions = (0, _objectWithoutProperties3.default)(options, ['url', 'requestOptions']);
            _context2.next = 4;
            return getListings((0, _extends3.default)({ url: url }, otherOptions))(url, requestOptions);

          case 4:
            data = _context2.sent;

            if (!data) {
              (0, _debug2.default)('scrape - no data found');
            } else {
              (0, _debug2.default)('scrape - finished with ' + data.length + ' results');
            }
            return _context2.abrupt('return', data);

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2['catch'](0);

            (0, _debug2.default)('ERROR: scrape: ' + _context2.t0.message);
            throw new Error(_context2.t0);

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 9]]);
  }));

  function scrapeListing(_x4) {
    return _ref6.apply(this, arguments);
  }

  return scrapeListing;
}();