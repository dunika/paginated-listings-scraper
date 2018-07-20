import request from 'request-promise-native';
import cheerio from 'cheerio';

import { buildExtractData } from './extract-data';

export const getPage = async (url, { loadCheerio, ...requestOptions }) => {
  try {
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

export default async function scrapePage({
  url,
  selectors,
  requestOptions,
}) {
  const { html, resolvedUrl } = await getPage(url, requestOptions);
  if (!html) {
    throw new Error(`No HTML found: ${resolvedUrl}`);
  }
  const extractData = buildExtractData(selectors);
  const extractedData = await extractData({
    html,
    selectors,
    url: resolvedUrl,
  });

  return extractedData;
}
