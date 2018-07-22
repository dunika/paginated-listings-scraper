
import { URL } from 'url';

import scrapeListing from './scrape-listing';
import scrapePage, { getPage } from './scrape-page';

export default scrapeListing;

export {
  scrapePage,
  getPage,
};

const url = 'https://ie.indeed.com/jobs?q=&l=${name}&sort=date';


const lad = async () => {
  const listings = await scrapeListing({
    maximumDepth: 2,
    parentSelector: '.row.result',
    dataSelector: {
      company: '.company',
      location: '.location',
      salaryMin: '.snip span.no-wrap',
      // title: ({ $, parent }) => $(getTitleSelector(parent)).text(),
      // url: ({ $, parent }) => {
      //   const { origin } = new URL(url);
      //   return `${origin}${parent.find($(getTitleSelector(parent))).attr('href')}`;
      // },
    },
    url: 'https://ie.indeed.com/jobs?q=&l=${name}&sort=date',
    nextPageSelector({ $ }) {
      const { origin } = new URL(url);
      const href = $('.pagination a:last-child').attr('href');
      return href ? `${origin}${href}` : null;
    },
  });
};

lad()
;
