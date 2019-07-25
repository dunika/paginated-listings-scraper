const { isNumber, isFunction } = require('lodash/fp');

const { getPage } = require('./scrape-page');
const { extractListingData } = require('./extract-data');
const debug = require('./debug');

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
  terminate,
  html: passedHtml,
  ...otherOptions
}) {
  if (!isNumber(maximumDepth) && !isFunction(terminate)) {
    throw Error('Please provide either a maximumDepth or a a terminate function');
  }

  const getListing = async (requestUrl, requestOptions = {}, { depth = 1 } = {}) => {
    if (isNumber(maximumDepth) && depth > maximumDepth) {
      debug(`Maximum depth reached: ${depth}`);
      return [];
    }
    debug(`Current page depth: ${depth}`);
    const { html } = await getPage({
      ...requestOptions,
      url: requestUrl || requestOptions.url,
      html: passedHtml,
      loadCheerio: false,
    });
    const {
        nextRequestOptions,
        nextPageUrl,
        data,
      } = await extractListingData({ depth, html, terminate, url, ...otherOptions });

    if (nextPageUrl || nextRequestOptions) {
      const nextData = await getListing(nextPageUrl, nextRequestOptions, { depth: depth + 1 });
      return [...data && data, ...nextData];
    }
    return data;
  };
  return getListing;
}


/**
* @param  {Object} options
* @param  {string} options.url
* @param  {Object} [options.requestOptions]
* @returns {void}
*/

module.exports = async function scrapeListing({
  url,
  requestOptions = {},
  html,
  ...otherOptions
}) {
  try {
    const requestUrl = !html ? url || requestOptions.url : '';
    const data = await getListings({
      requestUrl,
      html,
      ...otherOptions,
    })(requestUrl, requestOptions);
    if (!data) {
      debug('No data found');
    } else {
      debug(`Finished with ${data.length} results`);
    }
    return data;
  } catch (error) {
    debug(`Error: ${error.message}`);
    throw error;
  }
};
