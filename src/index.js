import { URL } from 'url';

import request from 'request-promise-native';

import debug from './utils/debug';
import extractData from './extract-data';

/**
* @param  {Object} options
* @param  {string} options.origin
* @param  {number} options.maximiumDepth
* @returns {Function} getListing
*/

function getListings({ origin, maximiumDepth, ...otherOptions }) {
  /**
  * Recursively extractes data from each page
  * @param  {string} path
  * @param  {number} depth
  * @returns {Array}
  */

  const getListing = async (path, depth = 1) => {
    debug(`Current page depth: ${depth}`);
    if (!isNaN(maximiumDepth) && depth > maximiumDepth) {
      return [];
    }
    try {
      const url = `${origin}${path}`;
      debug(`Getting listings from ${url}`);
      const html = await request(url);
      const { nextPageUrl, data } = await extractData({ html, origin, ...otherOptions });
      if (nextPageUrl) {
        const nextData = await getListing(nextPageUrl, depth + 1);
        return [...data, ...nextData];
      }
      debug('No url for found for next page ');
      return data;
    } catch (error) {
      debug(`ERROR: getListings: ${error.message}`);
      return [];
    }
  };
  return getListing;
}


/**
* @param  {Object} options
* @param  {string} options.url
* @returns {void}
*/

export default function scrape(options) {
  const { url, ...otherOptions } = options;
  const { origin, pathname, search } = new URL(url);
  getListings({ origin, ...otherOptions })(`${pathname}${search}`);
}

scrape({
  parentSelector: '.row.result',
  url: 'https://www.indeed.co.uk/jobs?l=county+Fermanagh&sort=date',
});
