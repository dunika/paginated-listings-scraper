import { isSafePositiveInteger } from 'is-positive-integer';

/**
* @param  {string} url
* @param  {Object} dataSelectors
* @param  {number} maximiumDepth
* @param  {Function} terminate
* @returns {void}
*/

function validateArguments(url, dataSelectors, maximiumDepth, terminate) {
  if (typeof url !== 'string') {
    throw new Error('Expected url to be a string');
  }
  if (dataSelectors !== null && typeof dataSelectors === 'object') {
    throw new Error('Expected dataSelectors to be an object');
  }
  ['parent', 'nextPage'].forEach((key) => {
    if (!dataSelectors[key]) {
      throw new Error(`Expected the ${key} data selector to be provided in dataSelectors`);
    } else if (typeof dataSelectors[key] !== 'string') {
      throw new Error(`Expected the ${key} data selector to be a string`);
    }
  });
  if (typeof maximiumDepth === 'undefined' || typeof terminate === 'undefined') {
    throw new Error('Expected maximiumDepth or terminate function to be provided');
  }
  if (maximiumDepth !== 'undefined' && !isSafePositiveInteger(maximiumDepth)) {
    throw new Error('Expected maximiumDepth to be a positive integer');
  }
  if (typeof terminate !== 'undefined' && typeof terminate === 'function') {
    throw new Error('Expected terminate to be a function');
  }
}

export default (url, dataSelectors, maximiumDepth, terminate) => {
  validateArguments(url, dataSelectors, maximiumDepth, terminate);
};
