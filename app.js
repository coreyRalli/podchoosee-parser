var Q = require('q');
var Request = require('request');
var NodeXMLLite = require('node-xml-lite');

var PodchooseeParser = function () {

};

PodchooseeParser.userAgent = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0";
PodchooseeParser.getXML = function (uri) {
    var deferral = Q.defer();
    
    var requestPromiseWrapper = Q.denodeify(Request);
    
    requestPromiseWrapper(uri, { headers: { "User-Agent" : PodchooseeParser.userAgent } })
        .done(function (response) {
        var xml = NodeXMLLite.parseString(response[0].body);
        
        var channelNode = xml.childs[0].childs;
        
        deferral.resolve(channelNode);
    }, function (ex) {
        deferral.reject(ex);
    });
    
    return deferral.promise;
}
PodchooseeParser.parseSubscription = function (xml) {
    var deferral = Q.defer();
    
    var subscription = {};
    
    try {
        for (var n = 0; n < xml.length; n++) {
            if (xml[n].name == "item") {
                break;
            } else {
                switch (xml[n].name) {
                    case "title":
                        if (typeof xml[n].childs != "undefined") {
                            if (xml[n].childs.length > 0)
                                subscription.title = xml[n].childs[0];
                        }
                        break;
                    case "link":
                        if (typeof xml[n].childs != "undefined") {
                            if (xml[n].childs.length > 0)
                                subscription.websiteUrl = xml[n].childs[0];
                        }
                        break;
                    case "copyright":
                        if (typeof xml[n].childs != "undefined") {
                            if (xml[n].childs.length > 0)
                                subscription.copyright = xml[n].childs[0];
                        }
                        break;
                    case "itunes:author":
                        if (typeof xml[n].childs != "undefined") {
                            if (xml[n].childs.length > 0)
                                subscription.author = xml[n].childs[0];
                        }
                        break;
                    case "description":
                        if (typeof xml[n].childs != "undefined") {
                            if (xml[n].childs.length > 0)
                                subscription.description = xml[n].childs[0];
                        }
                        break;
                    case "itunes:summary":
                        if (typeof xml[n].childs != "undefined") {
                            if (xml[n].childs.length > 0)
                                subscription.summary = xml[n].childs[0];
                        }
                        break;
                    case "itunes:subtitle":
                        if (typeof xml[n].childs != "undefined") {
                            if (xml[n].childs.length > 0)
                                subscription.subtitle = xml[n].childs[0];
                        }
                        break;
                    case "itunes:category":
                        if (typeof xml[n].attrib != "undefined") {
                            if (typeof xml[n].attrib.text != "undefined")
                                subscription.category = xml[n].attrib.text;
                        }
                        break;
                    case "image":
                        if (typeof xml[n].childs != "undefined") {
                            if (xml[n].length > 0 && typeof xml[n].childs[0].childs != "undefined") {
                                if (xml[n].childs[0].childs.length > 0)
                                    subscription.imageUrl = xml[n].childs[0].childs[0];
                            }
                        }
                        break;
                    case "itunes:image":
                        if (typeof xml[n].attrib != "undefined") {
                            if (typeof xml[n].attrib.href != "undefined")
                                subscription.iTunesImageUrl = xml[n].attrib.href;                          
                        }
                        break;
                    case "itunes:explicit":
                        if (typeof xml[n].attrib != "undefined") {
                            if (xml[n].childs.length > 0)                 
                                subscription.isExplict = (xml[n].childs[0] == "Yes") ? true : false;
                        }
                        break;
                    case "media:thumbnail":
                        if (typeof xml[n].attrib != "undefined") {
                            if (typeof xml[n].attrib.url != "undefined")
                                subscription.mediaThumbnail = xml[n].attrib.url;
                        }
                        break;
                }
            }
        }
        
        deferral.resolve(subscription);
    }
        catch (e) {
        deferral.reject(e);
    }
    
    return deferral.promise;
}
PodchooseeParser.parseEpisodes = function (xml) {
    var deferral = Q.defer();
    
    var episodes = [];
    
    try {
        for (var n = 0; n < xml.length; n++) {
            var episode = {};
            
            if (xml[n].name == "item") {
                var childNodes = xml[n].childs
                
                for (var i = 0; i < childNodes.length; i++) {
                    switch (childNodes[i].name) {
                        case "title":
                            if (typeof childNodes[i].childs != "undefined") {
                               if (childNodes[i].childs.length > 0)
                                    episode.title = childNodes[i].childs[0];
                            }
                            break;
                        case "link":
                            if (typeof childNodes[i].childs != "undefined") {
                                if (childNodes[i].childs.length > 0)
                                    episode.episodeWebLink = childNodes[i].childs[0];
                            }
                            break;
                        case "description":
                            if (typeof childNodes[i].childs != "undefined") {
                                if (childNodes[i].childs.length > 0)
                                    episode.description = childNodes[i].childs[0];
                            }
                            break;
                        case "itunes:summary":
                            if (typeof childNodes[i].childs != "undefined") {
                                if (childNodes[i].childs.length > 0)
                                    episode.summary = childNodes[i].childs[0];
                            }
                            break;
                        case "itunes:subtitle":
                            if (typeof childNodes[i].childs != "undefined") {
                                if (childNodes[i].childs.length > 0)
                                    episode.subtitle = childNodes[i].childs[0];
                            }
                            break;
                        case "guid":
                            if (typeof childNodes[i].childs != "undefined") {
                                if (childNodes[i].childs.length > 0)
                                    episode.rssGUID = childNodes[i].childs[0];
                            }
                            break;
                        case "enclosure":
                            if (typeof childNodes[i].attrib.type != "undefined") {
                                var type = childNodes[i].attrib.type;
                                
                                if (type.lastIndexOf("audio", 0) === 0) { episode.mediaType = 0; }
                                else if (type.lastIndexOf("video", 0) === 0) { episode.mediaType = 1; }
                                else { episode.mediaType = 2; }
                            }
                            
                            if (typeof childNodes[i].attrib.url != "undefined") {
                                episode.mediaFileUrl = childNodes[i].attrib.url;
                            }
                            
                            if (typeof childNodes[i].attrib.length != "undefined") {
                                episode.mediaFileSize = childNodes[i].attrib.length;
                            }
                            break;

                        case "pubDate":
                        
                            if (typeof childNodes[i].childs != "undefined") {
                                var d = new Date(childNodes[i].childs[0]);
                                
                                var convertedString = d.toISOString();
                                
                                episode.pubDate = convertedString;
                                
                                episode.pubDateMilliseconds = d.getTime();
                            }
                            
                            break;

                        case "media:thumbnail":
                            if (typeof childNodes[i].attrib.url != "undefined")
                                episode.mediaThumbnail = childNodes[i].attrib.url;
                            break;

                        case "itunes:explicit":
                            if (typeof childNodes[i].childs != "undefined") {
                                if (childNodes[i].childs.length > 0)
                                    episode.isExplicit = (childNodes[i].childs[0] == "Yes") ? true : false;
                            }
                            break;

                        case "image":
                            if (typeof childNodes[i].childs != "undefined") {
                                if (childNodes[i].childs.length > 0 &&
                                     typeof childNodes[i].childs[0].childs != "undefined") {
                                         
                                    if (childNodes[i].childs[0].childs.length > 0)
                                        episode.episodeImageUrl = childNodes[i].childs[0].childs[0];
                                }
                            }                        
                            
                            break;
                    }
                }
                
                episodes.push(episode);
            }
        }
        
        deferral.resolve(episodes);

    }
    catch (e) {
        deferral.reject(e);
    }
    
    return deferral.promise;
}

PodchooseeParser.getSubscription = function (url, callback) {
    var subContainer = {
        subscription: null,
        episodes: []
    };
    
    var subXML;
    
    PodchooseeParser.getXML(url)
    .then(function (xml) {
        subXML = xml;
        return PodchooseeParser.parseSubscription(subXML);
    })
    .then(function (sub) {
        subContainer.subscription = sub;
        
        return PodchooseeParser.parseEpisodes(subXML);
    })
    .done(function (eps) {
        subContainer.episodes = eps;
        
        callback(null, subContainer);
    }, function (ex) {
        callback(ex);
    });
}
PodchooseeParser.getSubscriptionPromise = function (url) {
    var deferral = Q.defer();
    
    var subContainer = {
        subscription: null,
        episodes: []
    };
    
    var subXML;
    
    PodchooseeParser.getXML(url)
    .then(function (xml) {
        subXML = xml;

        return PodchooseeParser.parseSubscription(subXML);
    })
    .then(function (sub) {
        subContainer.subscription = sub;
        
        return PodchooseeParser.parseEpisodes(subXML);
    })
    .done(function (eps) {
    subContainer.episodes = eps;
        
    deferral.resolve(subContainer);
    }, function (ex) {
        deferral.reject(ex);
    });
    
    return deferral.promise;
}


module.exports = PodchooseeParser;

