# podchoosee-parser
A simple utility for parsing podcast feeds for node js.

## Usage

Using podchoosee-parser is super easy: 

#####With promses (with thanks to the awesome Q library)
```
var pp = require('podchoosee-parser');
pp.getSubscriptionPromise('url-of-feed-here')
.done(function(response) {
	console.log(response.subscription.title);
});
```

#####Or with callbacks... if you like things old-school:
```
var pp = require('podchoosee-parser');
pp.getSubscription('url-of-feed-here', function (err, response) {
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
      "title":"Hollywood Handbook",
      "websiteUrl":"http://www.earwolf.com/show/hollywood-handbook/",
      "description":"Hollywood Handbook is an insider's guide to achieving your showbiz dreams from two A-List it-boys who are living theirs. Hayes and Sean provide an exclusive VIP backstage pass into Tinseltown politics, answer questions from unsuccessful listeners, and bring in famous guests to discuss their craft and how they became what they are (famous).",
      "copyright":"Earwolf Media, LLC",
      "author":"Earwolf",
      "category":"Comedy",
      "iTunesImageUrl":"http://cdn.earwolf.com/wp-content/uploads/2013/09/HollywoodHandbook_1600x1600_Cover1.jpg",
      "isExplict":true,
      "summary":"Hollywood Handbook is an insider's guide to achieving your showbiz dreams from two A-List it-boys who are living theirs. Hayes and Sean provide an exclusive VIP backstage pass into Tinseltown politics, answer questions from unsuccessful listeners, and bring in famous guests to discuss their craft and how they became what they are (famous).",
      "subtitle":"",
      "imageUrl":"http://cdn.earwolf.com/wp-content/uploads/2013/09/HollywoodHandbook_1600x1600_Cover1.jpg"
   },
   "episodes":[
      {
         "title":"The ScuzzMan, Dom's Close Friend",
         "episodeWebLink":"http://www.earwolf.com/episode/the-scuzzman-doms-close-friend/",
         "description":"With Hayes gone, Sean brings in his assistant Dom to fill the void and showers him with apologies in exchange for the exciting golden-hairedguest he booked. Then, Dom's friend The ScuzzMan joins them to discuss Volleyball: A Real Underdog Story. Fina...",
         "rssGUID":"http://www.earwolf.com/episode/the-scuzzman-doms-close-friend/",
         "mediaThumbnail":"http://cdn.earwolf.com/wp-content/uploads/2013/09/HollywoodHandbook_1600x1600_Cover1.jpg",
         "pubDate":"2015-03-31T07:02:04.000Z",
         "isExplicit":true,
         "subtitle":"With Hayes gone, Sean brings in his assistant Dom to fill the void and showers him with apologies in exchange for the exciting golden-hairedguest he booked. Then, Dom's friend The ScuzzMan joins them to discuss Volleyball: A Real Underdog Story. Fina...",
         "summary":"With Hayes gone, Sean brings in his assistant Dom to fill the void and showers him with apologies in exchange for the exciting golden-hairedguest he booked. Then, Dom's friend The ScuzzMan joins them to discuss Volleyball: A Real Underdog Story. Finally, the Popcorn Gallery is back to ask some Goldie Hawn-themed questions.  ",
         "mediaType":0,
         "mediaFileUrl":"http://feeds.soundcloud.com/stream/198524608-hollywoodhandbook-the-scuzzman-doms-close-friend.mp3",
         "mediaFileSize":"53486554"
      }
      ...
   ]
}

```

Most of it is self-explanitory except for a couple of things:

1. ```subtitle``` vs ```summary``` vs ```description```: The ```subtitle``` & ```summary``` properties come from the RSS feed's iTunes tags. ```description``` tends to be a raw (HTML tags and such) output, while the itunes tags are pre-formatted. The ```summary`` tag provides a full description and ```subtitle``` only a single sentence or nothing at all.

2. ```mediaType```: The ```mediaType``` property in the episode object is a interger, with 0 being audio, 1 video and 2 anything else.


## Dependencies
Podchoosee-Parser uses the following packages:

[Q](https://github.com/kriskowal/q)
[xml-node-lite](https://github.com/hgourvest/node-xml-lite)
[request](https://github.com/request/request)