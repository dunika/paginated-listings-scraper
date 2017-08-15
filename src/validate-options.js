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

  const {
    filter,  // Optional. Can be either a string or a function
    nextPageSelector, // Optional. Can be either a string or a function
    maximiumDepth, // Required if terminate is undefined. Must be a positive integer
    parentSelector, // Required. Must be a string
    dataSelector, // Required. Can be either a plain object or a function
    terminate, // Required if maximiumDepth is undefined. Must be a positive integer
    url, // Required. Must be a string
  } = options;

  if (!isUndefined(filter) && (!isString(filter) || !isFunction(filter))) {
    throw new Error('Expected filter to be a function');
  }
  if (!isUndefined(filter) && (!isString(nextPageSelector) && !isFunction(nextPageSelector))) {
    throw new Error('Expected filter to be a function');
  }
  if (!isUndefined(maximiumDepth) && !isSafePositiveInteger(maximiumDepth)) {
    throw new Error('Expected maximiumDepth to be a positive integer');
  }
  if (isUndefined(maximiumDepth) && isUndefined(terminate)) {
    throw new Error('Expected maximiumDepth or terminate function to be provided');
  }
  if (!isString(parentSelector)) {
    throw new Error('Expected parentSelector to be a string');
  }
  if (!isPlainObject(dataSelector) || !isFunction(dataSelector)) {
    throw new Error('Expected selectData to be a function');
  }
  if (!isUndefined(terminate) && isFunction(terminate)) {
    throw new Error('Expected terminate to be a function');
  }
  if (!isString(url)) {
    throw new Error('Expected url to be a string');
  }
}
