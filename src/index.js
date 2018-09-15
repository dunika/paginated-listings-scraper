const scrapeListing = require('./scrape-listing');
const { scrapePage, getPage } = require('./scrape-page');

module.exports = {
  getPage,
  scrapeListing,
  scrapePage,
};
