const got = require('got');
const cheerio = require('cheerio');
const UserAgent = require('user-agents');

const buildRequestOptions = ({ deviceCategory, headers, https, ...passedOptions } = {}) => {
  const deviceCategory = passedOptions?.deviceCategory || 'desktop'

  const userAgent = new UserAgent({
    deviceCategory: deviceCategory,
  });

  const defaultRequestOptions = {
    decompress: false,
    timeout: 10000,
    https: {
      rejectUnauthorized: false,
      ...https
    },
    headers: {
      'user-agent': userAgent.toString(),
      'accept-language': 'en-US,en',
      ...headers,
    },
    ...passedOptions
  };
}

const { buildExtractData } = require('./extract-data');

const getPage = async ({
  url,
  loadCheerio = true,
  html: passedHtml,
  ...requestOptions
} = {}) => {
  if (passedHtml) {
    return {
      html: passedHtml,
      $: cheerio.load(passedHtml),
    };
  }
  const { body: html, url: resolvedUrl } = await got(url, requestOptions);
  if (loadCheerio) {
    const $ = cheerio.load(html);
    return { $, html, resolvedUrl };
  }
  return { html, resolvedUrl };
};

module.exports.getPage = getPage;

module.exports.scrapePage = async function scrapePage({
  url,
  selectors,
  html: passedHtml,
  requestOptions: passedRequestOptions,
}) {
  const requestOptions = buildRequestOptions(passedRequestOptions)
  const { html, resolvedUrl, $ } = await getPage({
    url,
    html: passedHtml,
    ...requestOptions,
  });
  if (!html) {
    throw new Error(`No HTML found: ${resolvedUrl}`);
  }
  const extractData = buildExtractData(selectors);
  const extractedData = await extractData({
    $,
    html,
    selectors,
    url: resolvedUrl,
  });

  return extractedData;
};
