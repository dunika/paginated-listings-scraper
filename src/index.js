import { URL } from 'url';

import composeGetListings from './compose-get-listingss';
import validateOptions from './validate-options';

/**
* @param  {options} Object
* @returns {void}
*/

export default function scrapePaginatedListings(options) {
  validateOptions(options);
  const { url, ...otherOptions } = options;
  const { host, path } = new URL(url);
  composeGetListings({ host, ...otherOptions })(path || '');
}
