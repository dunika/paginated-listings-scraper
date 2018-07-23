import { isNumber, isFunction } from 'lodash/fp';

import { getPage } from './scrape-page';
import { extractListingData } from './extract-data';
import debug from './debug';

/**
* Recursively calls its inner function to extract data from each page
* @param  {Object} options
* @param  {string} options.origin
* @param  {number} [options.maximumDepth]
* @param {Function} [options.terminate]
* @returns {Function} getListing
*/

function getListings({
  maximumDepth,
  url,
  shouldReturnDataOnError = false,
  terminate,
  ...otherOptions
}) {
  if (!isNumber(maximumDepth) && !isFunction(terminate)) {
    throw Error('Please provide either a maximumDepth or a a terminate function');
  }

  const getListing = async (requestUrl, requestOptions, { depth = 1 } = {}) => {
    debug(`Current page depth: ${depth}`);
    if (isNumber(maximumDepth) && depth > maximumDepth) {
      return [];
    }
    try {
      const { html } = await getPage(requestUrl, requestOptions);
      const {
        requestOptions: nextRequestOptions,
        nextPageUrl,
        data,
      } = await extractListingData({ depth, html, terminate, url, ...otherOptions });

      if (nextPageUrl || nextRequestOptions) {
        const nextData = await getListing(nextPageUrl, nextRequestOptions, { depth: depth + 1 });
        return [...data && data, ...nextData];
      }
      return data;
    } catch (error) {
      debug(`Error: ${error.message}`);
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

export default async function scrapeListing(options) {
  try {
    const { url, requestOptions, ...otherOptions } = options;
    const requestUrl = url || requestOptions.url;
    const data = await getListings({ requestUrl, ...otherOptions })(requestUrl, requestOptions);
    if (!data) {
      debug('No data found');
    } else {
      debug(`Finished with ${data.length} results`);
    }
    return data;
  } catch (error) {
    debug(`Error: ${error.message}`);
    throw new Error(error);
  }
}
