# metalsmith-pinboard

A [Metalsmith](http://www.metalsmith.io/) plugin for retriving and displaying [Pinboard](https://pinboard.in/) bookmarks. 

## Installation

`$ npm install metalsmith-pinboard`

## Usage

Add `metalsmith-pinboard` to your Metalsmith project.

```
let metalsmithPinboard = require('metalsmith-pinboard')

metalsmith.use(metalsmithPinboard());
```

If no options are specified the plugin will pull the contents from the [Pinboard Popular feed](https://feeds.pinboard.in/json/popular).

### Options

The following options are accepted:

```
metalsmith.use(metalsmithPinboard(
    username: 'xyz', // a pinboard username
    tags: ['tag1', 'tag2', 'tag3'], // upto 3 pinboard tags (optional)
    count: 20 // the number of records to retrieve. Pinboard limits this request to 400. (optional)
));
``` 

## License

MIT