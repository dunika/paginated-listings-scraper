import { URL } from 'url';

import cheerio from 'cheerio';
import { isFunction, isNull } from 'lodash/fp'; // TODO get babel plugin for this

import debug from './utils/debug';
import extractText from './extract-text';

/**
* @param  {string | Function} nextPageSelector
* @param  {string} origin
* @param  {Function} $
* @returns {Array}
*/

const getNextPageUrl = function getNextPageUrl(nextPageSelector, origin, $) {
  if (isFunction) {
    return nextPageSelector(origin, $);
  }
  const href = $(nextPageSelector).attr('href');
  if (!href) {
    return null;
  }
  try {
    return (new URL(href)).href;
  } catch (error) {
    debug(`ERROR: getNextPageUrl - ${error.message}`);
    return `${root}${href}`;
  }
};

/**
* @param  {Object} options
* @param  {string} options.html
* @param  {Function} [options.filter]
* @param  {string | Function} options.nextPageSelector
* @param  {string} options.nextPageSelector
* @param  {string | Function} options.dataSelector
* @param  {string | Function} [options.dataSelector]
* @returns {Array}
*/

export default async function extractData({
  html,
  filter,
  nextPageSelector,
  parentSelector,
  dataSelector,
  terminate,
}) {
  const $ = cheerio.load(html);
  console.log('Extracting listings');

  const elements = $(parentSelector).filter(filter || '');
  console.log(elements);
  if (elements.length) {
    console.log(`No elements found matching ${parentSelector}`);
    return {
      data: null,
      nextPageUrl: getNextPageUrl(root, nextPageSelector, $),
    };
  }

  const extract = isFunction(dataSelector) ? dataSelector : extractText;

  const data = elements.map(() => {
    const element = $(this);
    return !terminate(element) ? extract(element, dataSelector) : null;
  }).get().filter(value => !isNull(value));

  const nextPageUrl = data.length === elements.length ? getNextPageUrl(
    root,
    nextPageSelector,
    $,
  ) : null;

  return {
    data,
    nextPageUrl,
  };
}
