'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _requestPromiseNative = require('request-promise-native');

var _requestPromiseNative2 = _interopRequireDefault(_requestPromiseNative);

var _extractData = require('./extract-data');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getPage = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url, requestOptions) {
    var _ref2, html, resolvedUrl;

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
            _ref2 = _context.sent;
            html = _ref2.body;
            resolvedUrl = _ref2.request.uri.href;
            return _context.abrupt('return', { html: html, resolvedUrl: resolvedUrl });

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](0);
            throw new Error('Request error: ' + _context.t0.message);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 9]]);
  }));

  return function getPage(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(_ref4) {
    var url = _ref4.url,
        selectors = _ref4.selectors,
        requestOptions = _ref4.requestOptions;

    var _ref5, html, resolvedUrl, extractedData;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getPage(url, requestOptions);

          case 2:
            _ref5 = _context2.sent;
            html = _ref5.html;
            resolvedUrl = _ref5.resolvedUrl;

            if (html) {
              _context2.next = 7;
              break;
            }

            throw new Error('No HTML found: ' + resolvedUrl);

          case 7:
            _context2.next = 9;
            return (0, _extractData.extractData)({
              html: html,
              selectors: selectors,
              url: resolvedUrl
            });

          case 9:
            extractedData = _context2.sent;
            return _context2.abrupt('return', extractedData);

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  function scrapePage(_x3) {
    return _ref3.apply(this, arguments);
  }

  return scrapePage;
}();