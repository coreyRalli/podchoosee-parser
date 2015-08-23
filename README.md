# podchoosee-parser
A simple utility for parsing podcast feeds in node js.

## Usage

Using podchoosee-parser is super easy: 

#### With promses (with thanks to the awesome Q library)
```
var pp = require('podchoosee-parser');
pp.getSubscriptionPromise('url-of-feed-here', { skip: 0, take: 25, parseSub: true })
.done(function(response) {
	console.log(response.subscription.title);
});
```

#### Or with callbacks... if you like things old-school:
```
var pp = require('podchoosee-parser');
pp.getSubscription('url-of-feed-here', { skip: 0, take: 25, parseSub: true }, function (err, response) {
	if (err) {
		console.log("Something went wrong!");
	} else {
		console.log(response.subscription.title);
	}
});
```

This is what a typical response looks like (in JSON):

```
{
   "subscription":{
      "title":"This Melbournian Life",
      "websiteUrl":"http://thismelbournianlife.com",
      "description":"Stuff happens.",
      "copyright":"Podchoosee",
      "author":"Podchoosee",
      "category":"Comedy",
      "iTunesImageUrl":"http://thismelbournianlife.com/puppy.jpg",
      "isExplict":true,
      "summary":"Stuff happens",
      "subtitle":"",
      "imageUrl":"http://thismelbournianlife.com/puppy.jpg"
   },
   "episodes":[
      {
         "title":"Hanging out by the clocks",
         "episodeWebLink":"http://thismelbournianlife.com/hanging-by-the-clocks",
         "description":"we hang out by the clocks and talk to people",
         "rssGUID":"http://thismelbournianlife.com/hanging-by-the-clocks",
         "mediaThumbnail":"http://thismelbournianlife.com/assets/clocks.png",
         "pubDate":"2015-03-31T07:02:04.000Z",
         "isExplicit":true,
         "subtitle":"",
         "summary":"",
         "mediaType":0,
         "mediaFileUrl":"",
         "mediaFileSize":"53486554"
      }
      ...
   ]
}

```

Most of it is self-explanitory except for a couple of things:

1. ```subtitle``` vs ```summary``` vs ```description```: The ```subtitle``` & ```summary``` properties come from the RSS feed's iTunes tags. ```description``` tends to be a raw (HTML tags and such) output, while the itunes tags are pre-formatted. The ```summary``` tag provides a full description and ```subtitle``` only a single sentence or nothing at all.

2. ```mediaType```: The ```mediaType``` property in the episode object is an interger, with 0 being audio, 1 video and 2 anything else.

3. The ````options```` object parameter in getSubscription/getSubscriptionPromise (optional) takes the following properties (also all optional):
    - `skip (number)` - Will skip parsing specifed amount of episodes starting from the first item node. Ordering by date before skip/take is an upcoming feature. -1 (skip none) is the default.
    - `take (number)` - Will parse only specified amount of episodes after skipping if applicable. -1 (take all) is the default.
    - `parseSub (boolean)` - If false, will skip parsing and including the `subscription` object. True is the default.

## What's Next

- Support for password protected subscriptions
- Sorting and filtering options.

## Dependencies
Podchoosee-Parser uses the following packages:

[Q](https://github.com/kriskowal/q)
[xml-node-lite](https://github.com/hgourvest/node-xml-lite)
[request](https://github.com/request/request)