'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPage = exports.scrapePage = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _url = require('url');

var _scrapeListing = require('./scrape-listing');

var _scrapeListing2 = _interopRequireDefault(_scrapeListing);

var _scrapePage = require('./scrape-page');

var _scrapePage2 = _interopRequireDefault(_scrapePage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _scrapeListing2.default;
exports.scrapePage = _scrapePage2.default;
exports.getPage = _scrapePage.getPage;


var url = 'https://ie.indeed.com/jobs?q=&l=${name}&sort=date';

var lad = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var listings;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _scrapeListing2.default)({
              maximumDepth: 2,
              parentSelector: '.row.result',
              dataSelector: {
                company: '.company',
                location: '.location',
                salaryMin: '.snip span.no-wrap'
                // title: ({ $, parent }) => $(getTitleSelector(parent)).text(),
                // url: ({ $, parent }) => {
                //   const { origin } = new URL(url);
                //   return `${origin}${parent.find($(getTitleSelector(parent))).attr('href')}`;
                // },
              },
              url: 'https://ie.indeed.com/jobs?q=&l=${name}&sort=date',
              nextPageSelector: function nextPageSelector(_ref2) {
                var $ = _ref2.$;

                var _ref3 = new _url.URL(url),
                    origin = _ref3.origin;

                var href = $('.pagination a:last-child').attr('href');
                return href ? '' + origin + href : null;
              }
            });

          case 2:
            listings = _context.sent;

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function lad() {
    return _ref.apply(this, arguments);
  };
}();

lad();