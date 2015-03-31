var Q = require('q');
var Request = require('request');
var NodeXMLLite = require('node-xml-lite');

var PodchooseeParser = function () {

};

PodchooseeParser.prototype = (function () {
    function getXML(uri) {
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
    
    function parseSubscription(xml) {
        var deferral = Q.defer();
        
        var subscription = {};
        
        try {
            for (var n = 0; n < xml.length; n++) {
                if (xml[n].name == "item") {
                    break;
                } else {
                    switch (xml[n].name) {
                        case "title":
                            subscription.title = xml[n].childs[0];
                            break;
                        case "link":
                            subscription.websiteUrl = xml[n].childs[0];
                            break;
                        case "copyright":
                            subscription.copyright = xml[n].childs[0];
                            break;
                        case "itunes:author":
                            subscription.author = xml[n].childs[0];
                            break;
                        case "description":
                            subscription.description = xml[n].childs[0];
                            break;
                        case "itunes:summary":
                            subscription.summary = xml[n].childs[0];
                            break;
                        case "itunes:subtitle":
                            subscription.subtitle = xml[n].childs[0];
                            break;
                        case "itunes:category":
                            subscription.category = xml[n].attrib.text;
                            break;
                        case "image":
                            subscription.imageUrl = xml[n].childs[0].childs[0];
                            break;
                        case "itunes:image":
                            subscription.iTunesImageUrl = xml[n].attrib.href;
                            break;
                        case "itunes:explicit":
                            subscription.isExplict = (xml[n].childs[0] == "Yes") ? true : false;
                            break;
                        case "media:thumbnail":
                            subscription.mediaThumbnail = xml[n].attrib.url;
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
    
    function parseEpisode(xml) {
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
                                episode.title = childNodes[i].childs[0];
                                break;
                            case "link":
                                episode.episodeWebLink = childNodes[i].childs[0];
                                break;
                            case "description":
                                episode.description = childNodes[i].childs[0];
                                break;
                            case "itunes:summary":
                                episode.summary = childNodes[i].childs[0];
                                break;
                            case "itunes:subtitle":
                                episode.subtitle = childNodes[i].childs[0];
                                break;
                            case "guid":
                                episode.rssGUID = childNodes[i].childs[0];
                                break;
                            case "enclosure":
                                var type = childNodes[i].attrib.type;
                                
                                if (type.lastIndexOf("audio", 0) === 0) { episode.mediaType = 0; }
                                else if (type.lastIndexOf("video", 0) === 0) { episode.mediaType = 1; }
                                else { episode.mediaType = 2; }
                                
                                episode.mediaFileUrl = childNodes[i].attrib.url;
                                
                                episode.mediaFileSize = childNodes[i].attrib.length;
                                
                                break;

                            case "pubDate":
                                var d = new Date(childNodes[i].childs[0]);
                                
                                var convertedString = d.toISOString();
                                
                                episode.pubDate = convertedString;
                                
                                break;

                            case "media:thumbnail":
                                episode.mediaThumbnail = childNodes[i].attrib.url;
                                break;

                            case "itunes:explicit":
                                episode.isExplicit = (childNodes[i].childs[0] == "Yes") ? true : false;
                                break;

                            case "image":
                                episode.episodeImageUrl = childNodes[i].childs[0].childs[0];
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
        var deferral = Q.defer();
        
        var episodes = [];
        
        try {
            for (var n = 0; n < xml.length; n++) {
                var episode = new Episode();
                
                if (xml[n].name == "item") {
                    var childNodes = xml[n].childs
                    
                    for (var i = 0; i < childNodes.length; i++) {
                        switch (childNodes[i].name) {
                            case "title":
                                episode.title = childNodes[i].childs[0];
                                break;
                            case "link":
                                episode.episodeWebLink = childNodes[i].childs[0];
                                break;
                            case "description":
                                episode.description = childNodes[i].childs[0];
                                break;
                            case "itunes:summary":
                                episode.summary = childNodes[i].childs[0];
                                break;
                            case "itunes:subtitle":
                                episode.subtitle = childNodes[i].childs[0];
                                break;
                            case "guid":
                                episode.rssGUID = childNodes[i].childs[0];
                                break;
                            case "enclosure":
                                var type = childNodes[i].attrib.type;
                                
                                if (type.lastIndexOf("audio", 0) === 0) { episode.mediaType = 0; }
                                else if (type.lastIndexOf("video", 0) === 0) { episode.mediaType = 1; }
                                else { episode.mediaType = 2; }
                                
                                episode.mediaFileUrl = childNodes[i].attrib.url;
                                
                                episode.mediaFileSize = childNodes[i].attrib.length;
                                
                                break;

                            case "pubDate":
                                var d = new Date(childNodes[i].childs[0]);
                                
                                var convertedString = d.toISOString();
                                
                                episode.pubDate = convertedString;
                                
                                break;

                            case "media:thumbnail":
                                episode.mediaThumbnail = childNodes[i].attrib.url;
                                break;

                            case "itunes:explicit":
                                episode.isExplicit = (childNodes[i].childs[0] == "Yes") ? true : false;
                                break;

                            case "image":
                                episode.episodeImageUrl = childNodes[i].childs[0].childs[0];
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
    }
    
    return ({
        getSubscription: function (url, callback) {
            var subContainer = {
                subscription: null,
                episodes: []
            };

            getXML(url)
            .then(function (xml) {
                return parseSubscription(xml);
            })
            .then(function (sub) {
                subContainer.subscription = sub;
                
                return parseEpisode(xml);
            })
            .done(function (eps) {
                subContainer.episodes = eps;

                callback(null, subContainer);
            }, function (ex) {
                callback(ex);
            });
        },
        getSubscriptionPromise: function (url) {
            var deferral = Q.defer();
            
            var subContainer = {
                subscription: null,
                episodes: []
            };
            
            getXML(url)
            .then(function (xml) {
                return parseSubscription(xml);
            })
            .then(function (sub) {
                subContainer.subscription = sub;
                
                return parseEpisode(xml);
            })
            .done(function (eps) {
                subContainer.episodes = eps;
                
                deferral.resolve(subContainer);
            }, function (ex) {
                deferral.reject(ex);
            });

            return deferral.promise;
        }
    });
});

PodchooseeParser.userAgent = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0";

module.exports = PodchooseeParser;

