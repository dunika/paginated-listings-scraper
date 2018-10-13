const request = require('request-promise-native');
const cheerio = require('cheerio');

const { buildExtractData } = require('./extract-data');

const getPage = async ({
  url,
  loadCheerio = true,
  html: passedHtml,
  ...requestOptions
} = {}) => {
  try {
    if (passedHtml) {
      return {
        html: passedHtml,
        $: cheerio.load(passedHtml),
      };
    }
    const { body: html, request: { uri: { href: resolvedUrl } } } = await request({
      resolveWithFullResponse: true,
      uri: url,
      ...requestOptions,
    });
    if (loadCheerio) {
      const $ = cheerio.load(html);
      return { $, html, resolvedUrl };
    }
    return { html, resolvedUrl };
  } catch (error) {
    throw new Error(`Request error: ${url}
      ${error.message}
    `);
  }
};

module.exports.getPage = getPage;

module.exports.scrapePage = async function scrapePage({
  url,
  selectors,
  html: passedHtml,
  requestOptions,
}) {
  const { html, resolvedUrl, $ } = await getPage({
    url,
    html: passedHtml,
    requestOptions,
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
