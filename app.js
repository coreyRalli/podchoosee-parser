﻿var Q = require('q');
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
            var channelNode;
        
            var xml = NodeXMLLite.parseString(response[0].body);
            
            for (var i = 0; i < xml.childs.length; i++) {
                var xmlNode = xml.childs[i];
                
                if (!xmlNode) {
                    continue;
                }
                else {
                    if (typeof xmlNode.name !== "undefined") {
                        if (xmlNode.name === "channel") {
                            channelNode = xmlNode.childs;
                            break;
                        }
                    }
                }
            }
    
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

PodchooseeParser.parseEpisodes = function (xml, options) {
    var deferral = Q.defer();
    
    var o = options || {};
    
    var skipItems = (typeof o.skip == "undefined") ? -1 : o.skip;
    var takeItems = (typeof o.take == "undefined") ? -1 : o.take;
    
    var currentSkip = 0;
    var currentTake = 0;
    
    var episodes = [];

    try {
        var inTakeMode = false;

        for (var n = 0; n < xml.length; n++) {            
            var episode = {};
            
            if (xml[n].name == "item") {
                if (skipItems != -1) {
                    if (currentSkip < skipItems) {
                        currentSkip++;
                        continue;
                    }
                    else if (!inTakeMode) {
                        inTakeMode = true;
                    }
                }
                
                if (inTakeMode) {
                    if (takeItems != -1) {
                        if (currentTake >= takeItems) {
                            break;
                        }
                    }
                }

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
                        case "itunes:author":
                            if (typeof childNodes[i].childs != "undefined") {
                                if (childNodes[i].childs.length > 0)
                                    episode.author = childNodes[i].childs[0];
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

                if (inTakeMode) {
                    currentTake++;
                }
            }
        }
        
        deferral.resolve(episodes);

    }
    catch (e) {
        deferral.reject(e);
    }
    
    return deferral.promise;
}

PodchooseeParser.getSubscription = function (url, options, callback) {
    var subContainer = {
        subscription: null,
        episodes: []
    };
    
    var o = options || {};
    
    var skipCount = (typeof o.skip == "undefined") ? -1 : o.skip;
    var takeCount = (typeof o.take == "undefined") ? -1 : o.take;
    
    var parseSub = (typeof o.parseSub == "undefined") ? true : o.parseSub;
    
    var subXML;
    
    PodchooseeParser.getXML(url)
    .then(function (xml) {
        subXML = xml;

        if (parseSub)
            return PodchooseeParser.parseSubscription(subXML);
        else
            return Q(null);
    })
    .then(function (sub) {
        subContainer.subscription = sub;
        
        return PodchooseeParser.parseEpisodes(subXML);
    })
    .done(function (eps) {
        subContainer.episodes = eps;
        
        callback(null, subContainer);
    }, function (ex) {
        callback(ex, null);
    });
}

PodchooseeParser.getSubscriptionPromise = function (url, options) {
    var deferral = Q.defer();
    
    var o = options || {};
    
    var skipCount = (typeof o.skip == "undefined") ? -1 : o.skip;
    var takeCount = (typeof o.take == "undefined") ? -1 : o.take;
    
    var parseSub = (typeof o.parseSub == "undefined") ? true : o.parseSub;
    
    var subContainer = {
        subscription: null,
        episodes: []
    };
    
    var subXML;
    
    PodchooseeParser.getXML(url)
    .then(function (xml) {
        subXML = xml;
        
        if (parseSub)
            return PodchooseeParser.parseSubscription(subXML);
        else
            return Q(null);
    })
    .then(function (sub) {
        if (sub)
            subContainer.subscription = sub;
        
        return PodchooseeParser.parseEpisodes(subXML, { skip: skipCount, take: takeCount });
    })
    .done(function (eps) {
    subContainer.episodes = eps;
        
    deferral.resolve(subContainer);
    }, function (ex) {
        deferral.reject(ex);
    });
    
    return deferral.promise;
}

PodchooseeParser.getSubscriptionFromXMLStringAsync = function (xmlString, options) {
    return new Q.promise(function (complete, error) {
        var o = options || {};
        
        var skipCount = (typeof o.skip == "undefined") ? -1 : o.skip;
        var takeCount = (typeof o.take == "undefined") ? -1 : o.take;
        
        var parseSub = (typeof o.parseSub == "undefined") ? true : o.parseSub;
        
        var subContainer = {
            subscription: null,
            episodes: []
        };
        
        var xml = NodeXMLLite.parseString(xmlString);

        var channelNode = null;

        for (var i = 0; i < xml.childs.length; i++) {
            var xmlNode = xml.childs[i];
            
            if (!xmlNode) {
                continue;
            }
            else {
                if (typeof xmlNode.name !== "undefined") {
                    if (xmlNode.name === "channel") {
                        channelNode = xmlNode.childs;
                        break;
                    }
                }
            }
        }
        
        var totalItems = 0;
        
        for (var n = 0; n < channelNode.length; n++) {
            if (channelNode[n].name == "item") {
                totalItems++;
            }
        };

        Q(null)
        .then(function () {
            if (parseSub)
                return PodchooseeParser.parseSubscription(channelNode);
            else
                return Q(null);
        })
        .then(function (sub) {
            if (sub)
                subContainer.subscription = sub;
            
            return PodchooseeParser.parseEpisodes(channelNode, { skip: skipCount, take: takeCount });
        })
        .done(function (episodes) {
            subContainer.episodes = episodes;
            subContainer.totalPages = Math.ceil(totalItems / takeCount);
            complete(subContainer);
        }, function (ex) {
            error(ex);
        });
    });
}

module.exports = PodchooseeParser;
