import request from 'request-promise-native';

import extractListingData from './extract-listing-data';

export default function composeGetListings({ host, maximiumDepth, ...otherOptions }) {
  const getListings = async (path, depth = 1) => {
    if (depth > maximiumDepth) {
      return [];
    }
    const url = `${host}${path}`;
    try {
      console.log(`Getting listings from ${url}`);
      const html = await request(url);
      const { nextPage, listings } = await extractListingData({ host, html, ...otherOptions });
      if (nextPage) {
        const nextListings = await getListings(nextPage, depth + 1);
        return [...listings, ...nextListings];
      }
      return listings;
    } catch (error) {
      console.log(`ERROR: Scrap - Jobs - getListings: ${error.message}`);
      return [];
    }
  };
  return getListings;
}
