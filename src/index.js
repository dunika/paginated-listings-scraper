import { URL } from 'url';

import request from 'request-promise-native';
import { isNumber, isFunction } from 'lodash/fp';

import debug from './utils/debug';
import extractData from './extract-data';

/**
* Recursively calls its inner function to extract data from each page
* @param  {Object} options
* @param  {string} options.origin
* @param  {number} [options.maximiumDepth]
* @param {Function} [options.terminate]
* @returns {Function} getListing
*/

function getListings({
  maximiumDepth,
  origin,
  shouldReturnDataOnError = false,
  terminate,
  requestOptions,
  ...otherOptions
}) {
  if (!isNumber(maximiumDepth) && !isFunction(terminate)) {
    throw Error('Please provide either a maximiumDepth or a a terminate function');
  }
  const getListing = async (url, { depth = 1, requestOptions }) => {
    debug(`Current page depth: ${depth}`);
    if (isNumber(maximiumDepth) && depth > maximiumDepth) {
      return [];
    }
    try {
      debug(`Getting listings from ${url}`);
      const html = await request({ url, ...requestOptions });
      const { nextPageUrl, data } = await extractData({ html, origin, terminate, ...otherOptions });
      if (nextPageUrl) {
        const nextData = await getListing(nextPageUrl, { depth: depth + 1 });
        return [...data && data, ...nextData];
      }
      return data;
    } catch (error) {
      debug(`ERROR: getListings: ${error.message}`);
      if (shouldReturnDataOnError) {
        return [];
      }
      throw new Error(error);
    }
  };
  return getListing;
}


/**
* @param  {Object} options
* @param  {string} options.url
* @param  {Object} [options.requestOptions]
* @returns {void}
*/

export default async function scrape(options) {
  try {
    const { url, requestOptions, ...otherOptions } = options;
    const { origin } = new URL(url);
    const data = await getListings({ origin, ...otherOptions })(url, { requestOptions });
    if (!data) {
      debug('scrape - no data found');
    } else {
      debug(`scrape - finished with ${data.length} results`);
    }
    return data;
  } catch (error) {
    debug(`ERROR: scrape: ${error.message}`);
    throw new Error(error);
  }
}
