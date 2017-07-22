/**
 * request resource
 * @return {[type]} [description]
 */
var Fiddler_Resource = function(){
    "use strict";
    var _request = {};
    var resource = Fiddler.implement({}, Fiddler.CustEvent);

    var parentRequestId = 0;
    Fiddler.mix(resource, {
        clearResource: function(){
            _request = {};
        },
        add: function(data, type){
            var requestId = data.requestId;
            data[type + "Time"] = data.timeStamp;
            if (!(requestId in _request)) {
                _request[requestId] = {};
                Fiddler.mix(_request[requestId], data);
            }else{
                for(var name in data){
                    _request[requestId][name] = data[name];
                }
            };
            if (type == 'onCompleted') {
                var resourceType = _request[requestId].type;
                var method = _request[requestId].method;
                if (resourceType == "main_frame" && method == "GET" ) {
                    parentRequestId = requestId;
                    _request[requestId].parentRequestId = 0;
                }else{
                    _request[requestId].parentRequestId = parentRequestId;
                }
                //content-size
                _request[requestId].size = 0;
                var responseHeaders = _request[requestId].responseHeaders || [];
                responseHeaders.some(function(item){
                    if (item.name == 'Content-Length') {
                        _request[requestId].size = item.value;
                        return true;
                    };
                });
                //cookie
                var requestHeaders = _request[requestId].requestHeaders || [];
                var cookie = '';
                requestHeaders.some(function(item){
                    if (item.name == 'Cookie') {
                        cookie = item.value;
                        return true;
                    };
                });
                if (cookie) {
                    _request[requestId].cookieSize = cookie.length;
                    var cookieObj = {};
                    cookie = cookie.split(/;\s*/g);
                    cookie.forEach(function(item){
                        item = item.split('=');
                        cookieObj[item[0]] = unescape(item[1]);
                    });
                    _request[requestId].cookieLength = cookie.length;
                    _request[requestId].cookie = cookieObj;
                };

                var urlInfo = Fiddler.getUrlDetail(data.url);
                Fiddler.mix(_request[requestId], urlInfo, true);
                this.fire("onCompleted", _request[requestId]);
            };
        },
        getItem: function(requestId){
            return _request[requestId] || {};
        },
        getResoure: function(){
            return _request;
        },
        getContent: function(requestId){
            var deferred = when.defer();
            var detail = _request[requestId];
            if (detail.content) {
                return deferred.resolve(detail.content);
            }else{
                Fiddler_File.getRemoteFile(requestId).then(function(data){
                    _request[requestId].content = data;
                    deferred.resolve(data);
                })
            }
            return deferred.promise;
        },
        setContent: function(url, content){
            if (!content) {
                return false;
            };
            var getRequestId = 0;
            for(var requestId in _request){
                if (_request[requestId]['url'] === url) {
                    getRequestId = requestId;
                };
            };
            if (getRequestId) {
                _request[getRequestId].content = content;
                _request[getRequestId].size = content.length;
            };
        },
        getImgRect: function(url, oldUrl, deferred){
            if (!deferred) {
                deferred = when.defer();
            };
            var img = new Image();
            var self = this;
            img.onload = function(){
                deferred.resolve({
                    width: this.width,
                    height: this.height,
                    old: url === oldUrl
                })
            };
            img.onerror = function(){
                if (url == oldUrl) {
                    deferred.resolve({
                        width: this.width,
                        height: this.height
                    })
                }else{
                    return self.getImgRect(oldUrl, oldUrl, deferred);
                }
            }
            img.src = url;
            return deferred.promise;
        },
        getImgUrl: function(requestId){
            var detail = _request[requestId];
            var content = detail.content;
            var ext = Fiddler.getFileExt(detail.url);
            if (ext && content) {
                var prefix = content.substr(100);
                var regexp = /^[\w\+\/\=]+$/;
                if (!regexp.test(prefix)) {
                    content = Base64.encode(content);
                };
                return "data:image/"+ext+";base64," + content;
            };
            return detail.url;
        },
        getSize: function(requestId){
            var deferred = when.defer();
            var detail = _request[requestId];
            if (detail.size) {
                return deferred.resolve(detail.size);
            }else{
                if (detail.content) {
                    _request[requestId].size = detail.content.length;
                    return deferred.resolve(_request[requestId].size);
                };
                var self = this;
                this.getContent(requestId).then(function(){
                    return self.getSize(requestId);
                }).then(function(size){
                    deferred.resolve(size);
                })
            }
            return deferred.promise;
        },
        getQueryData: function(url){
            var queryUrl = Fiddler.queryUrl(url) || {};
            var ret = {
                data: null,
                length: 0
            }
            for(var name in queryUrl){
                if (queryUrl[name] && queryUrl[name].join) {
                    queryUrl[name] = "[" + queryUrl[name].join(", ") + "]";
                };
                ret.length++;
            };
            if (ret.length) {
                ret.data = queryUrl;
            };
            return ret;
        }
    })
    return resource;
}()