'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPage = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _extractData = require('./extract-data');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getPage = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var loadCheerio = _ref2.loadCheerio,
        requestOptions = (0, _objectWithoutProperties3.default)(_ref2, ['loadCheerio']);

    var _ref3, html, resolvedUrl, $;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _requestPromiseNative2.default)((0, _extends3.default)({
              resolveWithFullResponse: true,
              uri: url
            }, requestOptions));

          case 3:
            _ref3 = _context.sent;
            html = _ref3.body;
            resolvedUrl = _ref3.request.uri.href;

            if (!loadCheerio) {
              _context.next = 9;
              break;
            }

            $ = _cheerio2.default.load(html);
            return _context.abrupt('return', { $: $, html: html, resolvedUrl: resolvedUrl });

          case 9:
            return _context.abrupt('return', { html: html, resolvedUrl: resolvedUrl });

          case 12:
            _context.prev = 12;
            _context.t0 = _context['catch'](0);
            throw new Error('Request error: ' + url + '\n      ' + _context.t0.message + '\n    ');

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 12]]);
  }));

  return function getPage(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.getPage = getPage;

exports.default = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref5) {
    var url = _ref5.url,
        selectors = _ref5.selectors,
        requestOptions = _ref5.requestOptions;

    var _ref6, html, resolvedUrl, extractData, extractedData;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getPage(url, requestOptions);

          case 2:
            _ref6 = _context2.sent;
            html = _ref6.html;
            resolvedUrl = _ref6.resolvedUrl;

            if (html) {
              _context2.next = 7;
              break;
            }

            throw new Error('No HTML found: ' + resolvedUrl);

          case 7:
            extractData = (0, _extractData.buildExtractData)(selectors);
            _context2.next = 10;
            return extractData({
              html: html,
              selectors: selectors,
              url: resolvedUrl
            });

          case 10:
            extractedData = _context2.sent;
            return _context2.abrupt('return', extractedData);

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  function scrapePage(_x3) {
    return _ref4.apply(this, arguments);
  }

  return scrapePage;
}();