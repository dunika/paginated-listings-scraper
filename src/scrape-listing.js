import request from 'request-promise-native';
import { isNumber, isFunction } from 'lodash/fp';

import { extractListingData } from './extract-data';

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
  url,
  shouldReturnDataOnError = false,
  terminate,
  ...otherOptions
}) {
  if (!isNumber(maximiumDepth) && !isFunction(terminate)) {
    throw Error('Please provide either a maximiumDepth or a a terminate function');
  }

  const getListing = async (requestOptions, { depth = 1 } = {}) => {
    if (isNumber(maximiumDepth) && depth > maximiumDepth) {
      return [];
    }
    try {
      const html = await request(requestOptions);
      const {
        requestOptions: nextRequestOptions,
        nextPageUrl,
        data,
      } = await extractListingData({ depth, html, url, terminate, ...otherOptions });

      if (nextPageUrl || nextRequestOptions) {
        const nextData = await getListing({
          url: nextPageUrl,
          ...nextRequestOptions,
        }, { depth: depth + 1 });
        return [...data && data, ...nextData];
      }
      return data;
    } catch (error) {
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
    const data = await getListings({ url, ...otherOptions })({ url, ...requestOptions });
    return data;
  } catch (error) {
    throw new Error(error);
  }
}
