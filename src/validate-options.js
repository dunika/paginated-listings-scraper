import { isFunction, isPlainObject, isString, isUndefined } from 'lodash/fp';
import { isSafePositiveInteger } from 'is-positive-integer';

/**
* Throws an error if the options do no meet the required criteria
*
* @param  {options} Object
*/

export default function validateOptions(options) {
  if (isPlainObject(options)) {
    throw new Error('Expected options to be an object');
  }
  const { filter, maximiumDepth, parentSelector, selectData, terminate, url } = options;
  if (!isString(url)) {
    throw new Error('Expected url to be a string');
  }
  if (!isString(parentSelector)) {
    throw new Error('Expected parentSelector to be a string');
  }
  if (!isFunction(selectData)) {
    throw new Error('Expected selectData to be a function');
  }
  if (isUndefined(maximiumDepth) && isUndefined(terminate)) {
    throw new Error('Expected maximiumDepth or terminate function to be provided');
  }
  if (!isUndefined(maximiumDepth) && !isSafePositiveInteger(maximiumDepth)) {
    throw new Error('Expected maximiumDepth to be a positive integer');
  }
  if (!isUndefined(terminate) && isFunction(terminate)) {
    throw new Error('Expected terminate to be a function');
  }
  if (!isUndefined(filter) && isFunction(filter)) {
    throw new Error('Expected filter to be a function');
  }
}
