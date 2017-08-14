import cheerio from 'cheerio';
import { isPlainObject } from 'lodash/fp';

import getNextPageUrl from './get-next-page-url';
import extractListingsData from './extract-listing-data';

export default async ({
  html,
  filter,
  nextPageSelector,
  parentSelector,
  selectData,
  terminate,
}) => {
  const $ = cheerio.load(html);
  console.log('Extracting listings');

  const elements = $(parentSelector);
  if (elements.length) {
    console.log(`No elements found matching ${parentSelector}`);
    return {};
  }

  const filteredElements = elements.filter(filter || '');

  const results = filteredElements.map((index, element) => {
    if (!terminate($)) {
      const data = selectData($, $(element));
      if (!isPlainObject(data)) {
        throw new Error('Expected the return from selectData to be an object');
      }
      return data;
    }
    return { finished: true };
  }).get();

  return results.reduce(({ listings, nextPageUrl }, { finished, ...listing }) => {
    if (!finished) {
      return {
        listings: [
          ...listings,
          listing,
        ],
        nextPageUrl,
      };
    }
    return {
      listings,
      nextPageUrl: null,
    };
  }, { listings: [], nextPageUrl: getNextPageUrl(root, nextPageSelector, $) });
};
