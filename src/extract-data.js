import { URL } from 'url';

import Bluebird from 'bluebird';
import cheerio from 'cheerio';
import { isFunction, pickBy } from 'lodash/fp'; // TODO get babel plugin for this

/**
* @param  {string | Function} nextPageSelector
* @param  {string} url
* @param  {Function} $
* @returns {Array}
*/

const getNextPageUrl = function getNextPageUrl(nextPageSelector, $, url) {
  if (isFunction(nextPageSelector)) {
    return nextPageSelector($, url);
  }

  const element = $(nextPageSelector);
  if (!element) {
    return null;
  }

  const href = element.attr('href');
  if (!href) {
    return null;
  }

  try {
    return new URL(href).href;
  } catch (error) {
    const { origin } = new URL(url);
    return `${origin}${href}`;
  }
};


const extractText = ({ $, parent, selector }) => {
  const element = parent ? parent.find($(selector)) : $(selector);
  return element.text();
};

export const extractData = async ({
  parent,
  html,
  url,
  selectors,
}) => {
  try {
    const data = await Bluebird.reduce(
      Object.entries(selectors),
      async (results, [key, selector]) => {
        const extract = isFunction(selector) ? selector : extractText;
        const $ = cheerio.load(html);
        return {
          ...results,
          [key]: await extract({
            $,
            parent,
            url,
          }),
        };
      }, {},
    );
    return pickBy(data);
  } catch (error) {
    throw new Error(`Extraction error: ${error.message}`);
  }
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

export const extractListingData = async function extractListingData({
  dataSelector,
  depth,
  filter,
  html,
  nextPageSelector,
  nextRequestOptions,
  parentSelector,
  terminate,
  url,
}) {
  const $ = cheerio.load(html);
  const elements = $(parentSelector).filter(!filter ? () => true : filter);

  if (!elements.length) {
    return {
      data: null,
      nextPageUrl: getNextPageUrl(nextPageSelector, $, url),
      nextRequestOptions: nextRequestOptions && nextRequestOptions(url, $, depth),
    };
  }

  const extractor = isFunction(dataSelector) ? dataSelector : extractData;

  const extract = terminate ? withTerminate(extractor, terminate) : extractor;

  const data = elements.map((index, element) => {
    const parent = $(element);
    return extract({
      html,
      parent,
      selectors: dataSelector,
      url,
    });
  }).get().filter(value => value);

  // If the length of the data does not match the length of the elements acted on then we can assume
  // that the terminate function returned true
  const nextPageUrl = data.length === elements.length ? getNextPageUrl(
    nextPageSelector,
    url,
    $,
  ) : null;

  return {
    data,
    nextPageUrl,
    nextRequestOptions: nextRequestOptions && nextRequestOptions(url, $, depth),
  };
};
