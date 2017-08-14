import { URL } from 'url';

export default (root, nextPageSelector, $) => {
  const href = $(nextPageSelector).attr('href');
  if (!href) {
    return null;
  }
  try {
    const { href: url } = new URL(href);
    return url;
  } catch (error) {
    console.log(error);
    return `${root}${href}`;
  }
};
