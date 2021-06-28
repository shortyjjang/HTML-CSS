/**
 * Common cart script
 *
 * All methods return a promise. You can use them like:
 *
 * Cart.get()
 *     .then(function(data){
 *         // TODO : when get the response
 *     })
 *     .fail(function(err, msg){
 *         // TODO : when the request is failed
 *     })
 *     .always(function(data){
 *         // always do this.
 *     });
 *
 * Cart.add(saleID, quantity, optionID).then(function(data){
 *     console.log(data);
 * });
 *
 * Cart.update(cartItemID, quantity, optionID).then(function(data){
 *     console.log(data);
 * });
 *
 * Cart.remove(cartItemID).then(function(data){
 *     console.log(data);
 * });
 */
(function(global){

function req(param) {
    var promise = {
        _fulfilled: false, _erred: false,
        _fulfillHandlers: [], _errorHandlers: [], _completeHandlers: [],
        _responseArgs: {},
        then: function(success, fail) {
            success = success || function() {};
            fail = fail || function() {};
            if (this._fulfilled) {
                success(this._responseArgs.resp);
            } else if (this._erred) {
                fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t);
            } else {
                this._fulfillHandlers.push(success);
                this._errorHandlers.push(fail);
            }
            return this;
        },
        fail: function(fn) {
            fn = fn || function() {};
            if (this._erred) {
                fail(this._responseArgs.resp, this._responseArgs.msg, this._responseArgs.t);
            } else {
                this._errorHandlers.push(fn);
            }
            return this;
        },
        always: function(fn) {
            fn = fn || function() {};
            if (this._fulfilled || this._erred) {
                fn(this._responseArgs.resp);
            } else {
                this._completeHandlers.push(fn);
            }
            return this;
        },
        success: function(resp) {
            this._responseArgs.resp = resp;
            this._fulfilled = true;
            while (this._fulfillHandlers.length > 0)
                this._fulfillHandlers.shift()(resp);
            while (this._completeHandlers.length > 0)
                this._completeHandlers.shift()(resp);
        },
        error: function(resp, msg, t) {
            this._responseArgs.resp = resp;
            this._responseArgs.msg = msg;
            this._responseArgs.t = t;
            while (this._errorHandlers.length > 0)
                this._errorHandlers.shift()(resp, msg, t);
            while (this._completeHandlers.length > 0)
                this._completeHandlers.shift()(resp);
        }
    };
    reqwest(param).then(function(resp) {
        if (window.ga && window.uses_tracking) {
            try {
                var sent = false;
                ga(function(tracker) {
                    var href = resp.checkout_url, linkerParam = tracker.get('linkerParam');
                    if (href) {
                        if (href.indexOf("?") > 0) href = href + "&" + linkerParam;
                        else href = href + "?" + linkerParam;
                        resp.checkout_url = href;
                    }
                    sent = true;
                    promise.success(resp);
                });
                setTimeout(function() {
                    if (!sent) {
                        promise.success(resp);
                    }
                }, 150);
            } catch(e) {
                promise.success(resp);
            }
        } else {
            promise.success(resp);
        }
    }).fail(function(resp, msg, t) {
        promise.error(resp, msg, t);
    });
    return promise;
}

function get(convert_currency) {
    var url = '/rest-api/v1/carts/saleitem/' + storeID;
    if(convert_currency) url += '?convert_currency=true';
    return req({
        url  : url,
        type : 'json',
        method : 'get'
    });
}

function add(saleID, quantity, optionID, personalization, convert_currency) {
    var params = {seller_id : storeID, sale_id : saleID, quantity : castUInt(quantity, 1)};

    if (optionID) params.option_id = optionID;
    if (personalization) params.personalization = personalization;
    if (convert_currency) params.convert_currency = convert_currency;

    r = req({
        url  : '/rest-api/v1/carts/saleitem/' + storeID,
        type : 'json',
        method : 'post',
        headers : {'X-CSRFToken':csrftoken},
        data : params
    });
        if (window.ga && window.uses_tracking) {
            r.then(function(resp) {
                try {
                    for (var i = 0; i < resp.items.length; ++i) {
                        var item = resp.items[i];
                        if (item.sale_id == params.sale_id && item.option_id == params.option_id) {
                            ga('send', 'event', {
                                eventCategory: 'UserAction',
                                eventAction: 'AddToCart',
                                eventLabel: params.sale_id + (params.option_id?("-"+params.option_id):""),
                                eventValue: params.quantity,
                            });
                            break;
                        }
                    }
                } catch (e) {
                    console.error(e);
                }
                return resp;
            });
        };
        if (window.fbq && window.uses_tracking) {
            r.then(function(resp) {
                try {
                    for (var i = 0; i < resp.items.length; ++i) {
                        var item = resp.items[i];
                        if (item.sale_id == params.sale_id && item.option_id == params.option_id) {
                            fbq('track', 'AddToCart', {
                                content_type: 'product',
                                content_ids: [params.sale_id],
                                value: item.item_price * params.quantity,
                                currency: 'USD'
                            });
                            break;
                        }
                    }
                } catch (e) {
                    console.error(e);
                }
                return resp;
            });
        };
        return r;
};

function update(cartItemID, quantity, optionID, personalization, convert_currency) {
    var params = {seller_id : storeID};

    if (quantity) params.quantity = castUInt(quantity, 1);
    if (optionID) params.option_id = optionID;
    if (personalization) params.personalization = personalization;
    if (convert_currency) params.convert_currency = convert_currency;

    return req({
        url : '/rest-api/v1/carts/saleitem/items/' + cartItemID + '/',
        type : 'json',
        method : 'put',
        headers : {'X-CSRFToken':csrftoken},
        data : params
    });
}

function remove(cartItemID) {
    r = req({
        url : '/rest-api/v1/carts/saleitem/items/' + cartItemID + '/',
        type : 'json',
        method : 'delete',
        headers : {'X-CSRFToken':csrftoken}
    });

        if (window.ga && window.uses_tracking) {
            r.then(function(resp) {
                try {
                    ga('send', 'event', {
                        eventCategory: 'UserAction',
                        eventAction: 'RemoveFromCart',
                    });
                } catch (e) {
                    console.error(e);
                }
                return resp;
            });
        };
    return r
}

function castUInt(v, def) {
    v = parseInt(v);
    if (isNaN(v) || v < 0) v = def;
    return v;
}

global.Cart = {
    get : get,
    add : add,
    update : update,
    remove : remove
};

})(window);


/*!
 * Reqwest! A general purpose XHR connection manager
 * license MIT (c) Dustin Diaz 2014
 * https://github.com/ded/reqwest
 */
!function(e,t,n){typeof module!="undefined"&&module.exports?module.exports=n():typeof define=="function"&&define.amd?define(n):t[e]=n()}("reqwest",this,function(){function handleReadyState(e,t,n){return function(){if(e._aborted)return n(e.request);e.request&&e.request[readyState]==4&&(e.request.onreadystatechange=noop,twoHundo.test(e.request.status)?t(e.request):n(e.request))}}function setHeaders(e,t){var n=t.headers||{},r;n.Accept=n.Accept||defaultHeaders.accept[t.type]||defaultHeaders.accept["*"];var i=typeof FormData=="function"&&t.data instanceof FormData;!t.crossOrigin&&!n[requestedWith]&&(n[requestedWith]=defaultHeaders.requestedWith),!n[contentType]&&!i&&(n[contentType]=t.contentType||defaultHeaders.contentType);for(r in n)n.hasOwnProperty(r)&&"setRequestHeader"in e&&e.setRequestHeader(r,n[r])}function setCredentials(e,t){typeof t.withCredentials!="undefined"&&typeof e.withCredentials!="undefined"&&(e.withCredentials=!!t.withCredentials)}function generalCallback(e){lastValue=e}function urlappend(e,t){return e+(/\?/.test(e)?"&":"?")+t}function handleJsonp(e,t,n,r){var i=uniqid++,s=e.jsonpCallback||"callback",o=e.jsonpCallbackName||reqwest.getcallbackPrefix(i),u=new RegExp("((^|\\?|&)"+s+")=([^&]+)"),a=r.match(u),f=doc.createElement("script"),l=0,c=navigator.userAgent.indexOf("MSIE 10.0")!==-1;return a?a[3]==="?"?r=r.replace(u,"$1="+o):o=a[3]:r=urlappend(r,s+"="+o),win[o]=generalCallback,f.type="text/javascript",f.src=r,f.async=!0,typeof f.onreadystatechange!="undefined"&&!c&&(f.htmlFor=f.id="_reqwest_"+i),f.onload=f.onreadystatechange=function(){if(f[readyState]&&f[readyState]!=="complete"&&f[readyState]!=="loaded"||l)return!1;f.onload=f.onreadystatechange=null,f.onclick&&f.onclick(),t(lastValue),lastValue=undefined,head.removeChild(f),l=1},head.appendChild(f),{abort:function(){f.onload=f.onreadystatechange=null,n({},"Request is aborted: timeout",{}),lastValue=undefined,head.removeChild(f),l=1}}}function getRequest(e,t){var n=this.o,r=(n.method||"GET").toUpperCase(),i=typeof n=="string"?n:n.url,s=n.processData!==!1&&n.data&&typeof n.data!="string"?reqwest.toQueryString(n.data):n.data||null,o,u=!1;return(n["type"]=="jsonp"||r=="GET")&&s&&(i=urlappend(i,s),s=null),n["type"]=="jsonp"?handleJsonp(n,e,t,i):(o=n.xhr&&n.xhr(n)||xhr(n),o.open(r,i,n.async===!1?!1:!0),setHeaders(o,n),setCredentials(o,n),win[xDomainRequest]&&o instanceof win[xDomainRequest]?(o.onload=e,o.onerror=t,o.onprogress=function(){},u=!0):o.onreadystatechange=handleReadyState(this,e,t),n.before&&n.before(o),u?setTimeout(function(){o.send(s)},200):o.send(s),o)}function Reqwest(e,t){this.o=e,this.fn=t,init.apply(this,arguments)}function setType(e){if(e.match("json"))return"json";if(e.match("javascript"))return"js";if(e.match("text"))return"html";if(e.match("xml"))return"xml"}function init(o,fn){function complete(e){o.timeout&&clearTimeout(self.timeout),self.timeout=null;while(self._completeHandlers.length>0)self._completeHandlers.shift()(e)}function success(resp){var type=o.type||setType(resp.getResponseHeader("Content-Type"));resp=type!=="jsonp"?self.request:resp;var filteredResponse=globalSetupOptions.dataFilter(resp.responseText,type),r=filteredResponse;try{resp.responseText=r}catch(e){}if(r)switch(type){case"json":try{resp=win.JSON?win.JSON.parse(r):eval("("+r+")")}catch(err){return error(resp,"Could not parse JSON in response",err)}break;case"js":resp=eval(r);break;case"html":resp=r;break;case"xml":resp=resp.responseXML&&resp.responseXML.parseError&&resp.responseXML.parseError.errorCode&&resp.responseXML.parseError.reason?null:resp.responseXML}self._responseArgs.resp=resp,self._fulfilled=!0,fn(resp),self._successHandler(resp);while(self._fulfillmentHandlers.length>0)resp=self._fulfillmentHandlers.shift()(resp);complete(resp)}function error(e,t,n){e=self.request,self._responseArgs.resp=e,self._responseArgs.msg=t,self._responseArgs.t=n,self._erred=!0;while(self._errorHandlers.length>0)self._errorHandlers.shift()(e,t,n);complete(e)}this.url=typeof o=="string"?o:o.url,this.timeout=null,this._fulfilled=!1,this._successHandler=function(){},this._fulfillmentHandlers=[],this._errorHandlers=[],this._completeHandlers=[],this._erred=!1,this._responseArgs={};var self=this;fn=fn||function(){},o.timeout&&(this.timeout=setTimeout(function(){self.abort()},o.timeout)),o.success&&(this._successHandler=function(){o.success.apply(o,arguments)}),o.error&&this._errorHandlers.push(function(){o.error.apply(o,arguments)}),o.complete&&this._completeHandlers.push(function(){o.complete.apply(o,arguments)}),this.request=getRequest.call(this,success,error)}function reqwest(e,t){return new Reqwest(e,t)}function normalize(e){return e?e.replace(/\r?\n/g,"\r\n"):""}function serial(e,t){var n=e.name,r=e.tagName.toLowerCase(),i=function(e){e&&!e.disabled&&t(n,normalize(e.attributes.value&&e.attributes.value.specified?e.value:e.text))},s,o,u,a;if(e.disabled||!n)return;switch(r){case"input":/reset|button|image|file/i.test(e.type)||(s=/checkbox/i.test(e.type),o=/radio/i.test(e.type),u=e.value,(!s&&!o||e.checked)&&t(n,normalize(s&&u===""?"on":u)));break;case"textarea":t(n,normalize(e.value));break;case"select":if(e.type.toLowerCase()==="select-one")i(e.selectedIndex>=0?e.options[e.selectedIndex]:null);else for(a=0;e.length&&a<e.length;a++)e.options[a].selected&&i(e.options[a])}}function eachFormElement(){var e=this,t,n,r=function(t,n){var r,i,s;for(r=0;r<n.length;r++){s=t[byTag](n[r]);for(i=0;i<s.length;i++)serial(s[i],e)}};for(n=0;n<arguments.length;n++)t=arguments[n],/input|select|textarea/i.test(t.tagName)&&serial(t,e),r(t,["input","select","textarea"])}function serializeQueryString(){return reqwest.toQueryString(reqwest.serializeArray.apply(null,arguments))}function serializeHash(){var e={};return eachFormElement.apply(function(t,n){t in e?(e[t]&&!isArray(e[t])&&(e[t]=[e[t]]),e[t].push(n)):e[t]=n},arguments),e}function buildParams(e,t,n,r){var i,s,o,u=/\[\]$/;if(isArray(t))for(s=0;t&&s<t.length;s++)o=t[s],n||u.test(e)?r(e,o):buildParams(e+"["+(typeof o=="object"?s:"")+"]",o,n,r);else if(t&&t.toString()==="[object Object]")for(i in t)buildParams(e+"["+i+"]",t[i],n,r);else r(e,t)}var win=window,doc=document,twoHundo=/^(20\d|1223)$/,byTag="getElementsByTagName",readyState="readyState",contentType="Content-Type",requestedWith="X-Requested-With",head=doc[byTag]("head")[0],uniqid=0,callbackPrefix="reqwest_"+ +(new Date),lastValue,xmlHttpRequest="XMLHttpRequest",xDomainRequest="XDomainRequest",noop=function(){},isArray=typeof Array.isArray=="function"?Array.isArray:function(e){return e instanceof Array},defaultHeaders={contentType:"application/x-www-form-urlencoded",requestedWith:xmlHttpRequest,accept:{"*":"text/javascript, text/html, application/xml, text/xml, */*",xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript",js:"application/javascript, text/javascript"}},xhr=function(e){if(e.crossOrigin===!0){var t=win[xmlHttpRequest]?new XMLHttpRequest:null;if(t&&"withCredentials"in t)return t;if(win[xDomainRequest])return new XDomainRequest;throw new Error("Browser does not support cross-origin requests")}return win[xmlHttpRequest]?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP")},globalSetupOptions={dataFilter:function(e){return e}};return Reqwest.prototype={abort:function(){this._aborted=!0,this.request.abort()},retry:function(){init.call(this,this.o,this.fn)},then:function(e,t){return e=e||function(){},t=t||function(){},this._fulfilled?this._responseArgs.resp=e(this._responseArgs.resp):this._erred?t(this._responseArgs.resp,this._responseArgs.msg,this._responseArgs.t):(this._fulfillmentHandlers.push(e),this._errorHandlers.push(t)),this},always:function(e){return this._fulfilled||this._erred?e(this._responseArgs.resp):this._completeHandlers.push(e),this},fail:function(e){return this._erred?e(this._responseArgs.resp,this._responseArgs.msg,this._responseArgs.t):this._errorHandlers.push(e),this},"catch":function(e){return this.fail(e)}},reqwest.serializeArray=function(){var e=[];return eachFormElement.apply(function(t,n){e.push({name:t,value:n})},arguments),e},reqwest.serialize=function(){if(arguments.length===0)return"";var e,t,n=Array.prototype.slice.call(arguments,0);return e=n.pop(),e&&e.nodeType&&n.push(e)&&(e=null),e&&(e=e.type),e=="map"?t=serializeHash:e=="array"?t=reqwest.serializeArray:t=serializeQueryString,t.apply(null,n)},reqwest.toQueryString=function(e,t){var n,r,i=t||!1,s=[],o=encodeURIComponent,u=function(e,t){t="function"==typeof t?t():t==null?"":t,s[s.length]=o(e)+"="+o(t)};if(isArray(e))for(r=0;e&&r<e.length;r++)u(e[r].name,e[r].value);else for(n in e)e.hasOwnProperty(n)&&buildParams(n,e[n],i,u);return s.join("&").replace(/%20/g,"+")},reqwest.getcallbackPrefix=function(){return callbackPrefix},reqwest.compat=function(e,t){return e&&(e.type&&(e.method=e.type)&&delete e.type,e.dataType&&(e.type=e.dataType),e.jsonpCallback&&(e.jsonpCallbackName=e.jsonpCallback)&&delete e.jsonpCallback,e.jsonp&&(e.jsonpCallback=e.jsonp)),new Reqwest(e,t)},reqwest.ajaxSetup=function(e){e=e||{};for(var t in e)globalSetupOptions[t]=e[t]},reqwest})
