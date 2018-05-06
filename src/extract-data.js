import { URL } from 'url';

import cheerio from 'cheerio';
import { isFunction } from 'lodash/fp'; // TODO get babel plugin for this

import debug from './utils/debug';

/**
* @param  {string | Function} nextPageSelector
* @param  {string} origin
* @param  {Function} $
* @returns {Array}
*/

const getNextPageUrl = function getNextPageUrl(nextPageSelector, origin, $) {
  if (isFunction(nextPageSelector)) {
    return nextPageSelector(origin, $);
  }

  const element = $(nextPageSelector);
  if (!element) {
    debug(`getNextPageUrl - no element found for nextPageSelector ${nextPageSelector}`);
    return null;
  }

  const href = element.attr('href');
  if (!href) {
    debug(`getNextPageUrl - no href attribute found for nextPageSelector ${nextPageSelector}`);
    return null;
  }

  try {
    const { href: url } = new URL(href);
    debug(`getNextPageUrl - returned ${url}`);
    return url;
  } catch (error) {
    debug(`getNextPageUrl - returned ${origin}${href}`);
    return `${origin}${href}`;
  }
};


/**
* @param  {string | Function} dataSelector
* @param  {Object} element
* @param  {Function} $
* @returns {Object}
*/

const buildExtractText = function buildExtractText(dataSelector) {
  return function extractText(parent, $) {
    return Object.entries(dataSelector).reduce((data, [name, selector]) => {
      const element = parent.find($(selector));
      let text = null;
      if (!element.length) {
        debug(`extractText - no element found for dataSelector { ${name} : '${selector}' }`);
      } else {
        text = element.text();
        if (!text) {
          debug(`extractText - no text found for dataSelector { ${name} : '${selector}' }`);
        }
      }
      debug(`extractText - text found for dataSelector ${name}`);
      return {
        ...data,
        [name]: text || null,
      };
    }, {});
  };
};

/**
* @param  {Function} extract
* @param  {Function} terminate
* @returns {Function}
*/

const withTerminate = (extract, terminate) => {
  const state = { hasFinished: false, hasPrinted: false };
  return function extractWithTerminate(cheerioElement, $) {
    state.hasFinished = terminate(cheerioElement);
    if (state.hasFinished) {
      if (!state.hasPrinted) {
        debug('extractData - terminated');
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

export default async function extractData({
  dataSelector,
  depth,
  filter,
  html,
  nextPageSelector,
  origin,
  parentSelector,
  terminate,
  nextRequestOptions,
}) {
  const $ = cheerio.load(html);
  const elements = $(parentSelector).filter(!filter ? () => true : filter);
  if (!elements.length) {
    debug(`No elements found matching ${parentSelector}`);
    return {
      data: null,
      nextPageUrl: getNextPageUrl(nextPageSelector, origin, $, depth),
      nextRequestOptions: nextRequestOptions && nextRequestOptions(origin, $, depth),
    };
  }
  const extractor = isFunction(dataSelector) ? dataSelector : buildExtractText(dataSelector);

  const extract = terminate ? withTerminate(extractor, terminate) : extractor;
  const data = elements.map((index, element) => {
    const cheerioElement = $(element);
    return extract(cheerioElement, $);
  }).get().filter(value => value);

  // If the length of the data does not match the length of the elements acted on then we can assume
  // that the terminate function return true
  const nextPageUrl = data.length === elements.length ? getNextPageUrl(
    nextPageSelector,
    origin,
    $,
  ) : null;

  return {
    data,
    nextPageUrl,
    nextRequestOptions: nextRequestOptions && nextRequestOptions(origin, $, depth),
  };
}
