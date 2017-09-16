# Paginated Listings Scraper


Extract listings data from paginated web pages. 

It uses [Cheerio](https://github.com/cheeriojs/cheerio) to access the DOM

If you are using Chome you can get an accurate CSS selector for a given element quite easily. See this [Stack Overflow answer](https://stackoverflow.com/a/30381787/1552404)

For debugging set the `DEBUG=paginated-listings-scraper` environment variable

`note: named functions are favored over the shorter arrow syntax to aid in debugging`

##Example usage

```
  const options = {
    dataSelector: {
      text: '.text-block',
      title: 'h3',
    },
    filter: '.row.blank',
    maximiumDepth: 3,
    nextPageSelector: 'a.next-page',
    parentSelector: '.row',
    terminate: (element, $) => element.find($('.bad-apple')).length,
    url: 'http://paginatedlisitings.com',
  };

  const data = await scrape(options);

// data = [{ title: 'Old McDonald', text: 'Had a farm', } ...]
```


##Options

###url

The url of the page you wish to scrape. Ideally this should be a paginated page consisting of elements in a list format. |IT uses `request-native-promise` to fetch the page. See [request](https://github.com/request/request)

###parentSelector

The CSS selector of the elements you wish to interate over. Each element found matching this selector will be mapped using dataSelector to extract the specified data. See [cheerio selectors](https://github.com/cheeriojs/cheerio#selectors), [cheerio find](https://github.com/cheeriojs/cheerio#findselector) and [cheerio map](https://github.com/cheeriojs/cheerio#filter-selector---filter-selection---filter-element---filter-functionindex-element-) 

###dataSelector

Used to extract data from the elements returned from `parentSelector`. Can be either a function or an object of keys in the form `{ name: cssSelector }`. If an object is used it will iterate over each of its keys and extract the text contained within the element returned by the css selector. It will return each item as an object in the form `{ name: data }`.

If a function is used it will recieve the element currently being acted on as a cheerio element as well as the  cheerio function created from the DOM as arguments which will allow you to select whatever data you need.

```
  dataSelector(element, $) {
    return element.find($('#sweet.sweet.data')).text()
  }
```

See [cheerio selectors](https://github.com/cheeriojs/cheerio#selectors) and [cheerio find](https://github.com/cheeriojs/cheerio#findselector)

The returned value from this will be added to an array which will eventually be returned by the scraper

###nextPageSelector

Gets the url of the next page to be scraped. Can be either a CSS selector or a function. If a selector is used it gets the href propery of the element. If the href is not a valid url than it assumes it is a path and concaninates this with the origin of the url that was initially passed in as the `url` option

If you need something more custom then this then use a function. The function will recieve the origin taken from the original Url and the loaded Cheerio DOM as an argument which will allow you to select whatever you want from the page. 

```
  nextPageSelector(origin, $) {
    return `${origin}${$('a.hard-to-get').attr('data-hidden-href')}
  }

```

This function should return a Url which will be used to request the next page to be scraped. See [cheerio selectors](https://github.com/cheeriojs/cheerio#selectors) and [cheerio find](https://github.com/cheeriojs/cheerio#findselector)

###maximiumDepth (optional if terminate function is provided)

The page number at which the scraper will stop. If set to 0 no pages will be scraped. Must be a number

###terminate (optional if maximiumDepth is provided)

A function that is run to determine whether or not to stop scraping. It is acted on each element returned by the `parentSelector`. It recieves the element currently being acted on as a cheerio element as well as the cheerio function created from the DOM as an arguments

```
  terminate(element, $) {
    return !!element.attr('data-important-confiential-stuff')
  }
```

Must return something truthy or falsey. See [cheerio selectors](https://github.com/cheeriojs/cheerio#selectors)

###filter

Can be either a CSS selector or a function. It is used to filter out unwanted elements before the inital iteration takes place. See [cheerio filter](https://github.com/cheeriojs/cheerio#filter-selector---filter-selection---filter-element---filter-functionindex-element-) for explanation and example usage 


###shouldReturnDataOnError (default = false)

States whether or not it should return the data its collected so far when it encounters an error while scraping a page. This will mean no error will be propogated so be careful. If you need to see whats going on turn on `debug` mode (see above)