# Paginated Listings Scraper

Extract listings data from paginated web pages. 

It uses [Cheerio](https://github.com/cheeriojs/cheerio) in order to access the DOM which implements a subset of JQuery and selects elements in exactly the same way.

Options

url

The url of the page you wish to scrape. Ideally this should be a paginated page consisting of elements in a list format. 

parentSelector

The CSS selector of the element you wish to interate over. Each element found matching this selector will map using dataSelector to extract the specified data. See [cheerio map](https://github.com/cheeriojs/cheerio#filter-selector---filter-selection---filter-element---filter-functionindex-element-) for a better understaning of how this works

maximiumDepth

The page number at which the scraper will stop. If set to 0 no pages will be scraped. Must be a number

filter (optional)

Can be either a CSS selector or a function. It is used to filter out unwanted elements before the inital iteration takes place. See [cheerio filter](https://github.com/cheeriojs/cheerio#filter-selector---filter-selection---filter-element---filter-functionindex-element-) for explanation and example usage 

nextPageSelector
Can be either a CSS selector or a function. 

If a CSS selector is used it will extract the elements ```href``` attribute and use that to make the next request. 

If you need something more custom then this then use a function. The function will receve the loaded Cheerio DOM as an argument which will allow you to select whatever you want from the page. This function should return a url string which will be used to make the next request. See [Cheerio Selectors](https://github.com/cheeriojs/cheerio#selectors)