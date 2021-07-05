function maintenanceStatus(e) {
    Amex._settings.maintenanceFlag = e.status, Amex._settings.maintenanceFlag || processAmexTags()
}

function maintenanceStatusError() {}

function processAmexTags() {
    Amex.Utils.stringToBoolean(Amex._settings.disableBtn) || (Amex.UI.createAmexButton(), Amex.UI.associatePopupEvent())
}
var Amex = {
    version: "1.35.4",
    buildDate: "July 31, 2015",
    CLASSES: {},
    $: function(e) {
        return document.getElementById(e)
    },
    log: function(e) {
        window.console && window.console.log(e)
    },
    getElementsByClass: function(e) {
        var t;
        return document.getElementsByClassName ? t = document.getElementsByClassName(e) : document.querySelectorAll && (t = document.querySelectorAll("[class=" + e + "]")), t
    }
};
Amex._settings = {}, String.prototype.trim || (String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "")
}), Amex.Config = {
    Common: {
        namespace: "amex",
        divId: "amex-express-checkout",
        className: "amex-express-checkout"
    }
}, Amex.AllowedValues = {
    theme: {
        1: "desktop",
        2: "mobile",
        3: "mobile-native"
    },
    env: {
        1: "dev",
        2: "qa",
        3: "sandbox",
        4: "production",
        5: "local"
    },
    disable_btn: {
        1: "true",
        2: "false"
    },
    button_color: {
        1: "dark",
        2: "light",
        3: "plain",
        4: "dark-ss",
        5: "dark-xs",
        6: "light-ss",
        7: "light-xs"
    },
    button_size: {
        1: "small",
        2: "medium",
        3: "large"
    }
}, Amex.Dom = {
    appendElement: function(e, t) {
        e.innerHTML += t
    },
    observe: function(e, t, n) {
        e ? e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent("on" + t, n) : Amex.log("Cannot observe on this element")
    },
    observeMultiple: function(e, t, n) {
        for (var i = 0; i < e.length; i++) {
            var o = e[i];
            o ? o.addEventListener ? o.addEventListener(t, n, !1) : o.attachEvent("on" + t, n) : Amex.log("Cannot observe on this element")
        }
    },
    removeObserve: function(e, t, n) {
        e ? e.removeEventListener ? e.removeEventListener(t, n, !1) : e.detachEvent("on" + t, n) : Amex.log("Cannot observe on this element")
    },
    preventDefault: function(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = !1
    },
    containsCss: function(e, t) {
        var n = " " + e.className + " ";
        return n.indexOf(" " + t + " ") >= 0
    },
    addCss: function(e, t) {
        Amex.Dom.containsCss(e, t) || (e.className = e.className + " " + t)
    },
    removeCss: function(e, t) {
        Amex.Dom.containsCss(e, t) && (e.className = e.className.replace(t, ""), Amex.Dom.removeCss(e, t))
    },
    addScript: function(e, t, n) {
        var i = document.createElement("script");
        i.src = t, (-1 === Amex.Browser.ieVersion() || Amex.Browser.ieVersion() > 8) && (i.onerror = n, i.type = e), document.getElementsByTagName("HEAD")[0].appendChild(i)
    },
    addCssStyles: function(e) {
        if ("ie" !== Amex.Browser.getBrowserType()) {
            var t = document.createElement("style");
            t.type = "text/css", t.textContent = e, document.getElementsByTagName("HEAD")[0].appendChild(t)
        } else try {
            document.createStyleSheet().cssText = e
        } catch (n) {
            document.styleSheets[0] && (document.styleSheets[0].cssText += e)
        }
    },
    getAmexDivs: function() {
        var e = Amex.getElementsByClass(Amex.Config.Common.className);
        e = Amex.Utils.toArray(e);
        var t = Amex.$(Amex.Config.Common.divId);
        return void 0 !== t && null !== t && t.getAttribute("class") !== Amex.Config.Common.className && e.push(t), e
    }
}, Amex.Browser = {
    getBrowserType: function() {
        if (!Amex.Browser._browserType)
            for (var e = window.navigator.userAgent.toLowerCase(), t = ["msie", "firefox", "safari", "gecko"], n = ["ie", "mozilla", "safari", "mozilla"], i = 0; i < t.length; i++)
                if (e.indexOf(t[i]) >= 0) {
                    Amex.Browser._browserType = n[i];
                    break
                }
        return Amex.Browser._browserType
    },
    ieVersion: function() {
        var e = -1;
        if ("Microsoft Internet Explorer" === navigator.appName) {
            var t = navigator.userAgent,
                n = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
            null !== n.exec(t) && (e = parseFloat(RegExp.$1))
        }
        return e
    }
}, Amex.Device = {
    isRetinaDisplay: function() {
        if (window.matchMedia) {
            var e = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
            return e && e.matches || window.devicePixelRatio > 1 ? !0 : !1
        }
    }
}, Amex.QueryString = {
    encode: function(e) {
        var t = [];
        for (var n in e) null !== e[n] && "undefined" != typeof e[n] && t.push(encodeURIComponent(n) + "=" + encodeURIComponent(e[n]));
        return t.sort(), t.join("&")
    },
    decode: function(e) {
        var t, n, i = {},
            o = e.split("&");
        for (t = 0; t < o.length; t++) n = o[t].split("=", 2), n && n[0] && (i[decodeURIComponent(n[0])] = decodeURIComponent(n[1]));
        return i
    }
}, Amex.Utils = {
    stringToBoolean: function(e) {
        switch (e.toLowerCase()) {
            case "true":
            case "yes":
            case "1":
                return !0;
            case "false":
            case "no":
            case "0":
            case null:
                return !1;
            default:
                return Boolean(e)
        }
    },
    isEmpty: function(e) {
        return "undefined" == typeof e || null === e || 0 === e.trim().length ? !0 : !1
    },
    copy: function(e, t) {
        for (var n in t) "undefined" == typeof e[n] && (e[n] = t[n]);
        return e
    },
    create: function(e, t) {
        for (var n = window.Amex, i = e ? e.split(".") : [], o = i.length, s = 0; o > s; s++) {
            var a = i[s],
                r = n[a];
            r || (r = t && s + 1 === o ? t : {}, n[a] = r), n = r
        }
        return n
    },
    forEach: function(e, t) {
        if (e)
            if (e.forEach) e.forEach(t);
            else
                for (var n = 0, i = e.length; i > n; n++) t(e[n], n, e)
    },
    windowWidth: function() {
        return self === top ? this.windowInnerWidth() : this.windowOuterWidth() || this.windowScreenWidth()
    },
    windowHeight: function() {
        return self === top ? this.windowInnerHeight() : this.windowOuterHeight() || this.windowScreenHeight()
    },
    windowInnerWidth: function() {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    },
    windowInnerHeight: function() {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    },
    windowOuterWidth: function() {
        return window.outerWidth
    },
    windowOuterHeight: function() {
        return window.outerHeight
    },
    windowScreenWidth: function() {
        return window.screen.width
    },
    windowScreenHeight: function() {
        return window.screen.height
    },
    randomStringGenerator: function(e) {
        for (var t = "", n = function() {
            var e = Math.floor(52 * Math.random());
            return String.fromCharCode(26 > e ? e + 65 : e + 71)
        }; t.length < e;) t += n();
        return t
    },
    toArray: function(e) {
        for (var t = 0, n = []; t < e.length; t++) n.push(e[t]);
        return n
    },
    getImageDimensions: function(e, t) {
        var n = Amex.SDKConfig.get(e).split("-");
        return "mobile-native" === t || "mobile" === t ? n[1].split("*") : n[0].split("*")
    }
}, Amex.URLs = {
    prepareAuthWindowUrl: function() {
        var e = this.getAuthWindowUrl(),
            t = {
                clientId: Amex._settings.clientId,
                contextId: Amex._settings.contextId,
                channel: this.getChannelValue(),
                frameId: Amex._settings.randomFrameId,
                callback: Amex._settings.callback,
                merchantId: Amex._settings.merchantId,
                referer: Amex.URLs.getRefererHost()
            };
        return Amex.Utils.isEmpty(Amex._settings.keyName) || "undefined" == typeof Amex._settings.keyValue || (t[Amex._settings.keyName] = Amex._settings.keyValue), e += "?" + Amex.QueryString.encode(t)
    },
    getRefererHost: function() {
        return location.protocol + "//" + window.location.host
    },
    getProviderHost: function() {
        var e = document.createElement("a");
        return e.href = this.getBlankIframeUrl(), "http:" === e.protocol && "80" === e.port || "" === e.port || "https:" === e.protocol && ("443" === e.port || "" === e.port) ? e.protocol + "//" + e.hostname : e.protocol + "//" + e.host
    },
    getUrl: function(e) {
        var t = "production" === Amex._settings.env ? e : e + "." + Amex._settings.env;
        return Amex.SDKConfig.get(t)
    },
    getAuthWindowUrl: function() {
        return this.getUrl("authentication.window.url")
    },
    getBlankIframeUrl: function() {
        return this.getUrl("amex.iframe.blank.url")
    },
    getMaintenanceServiceUrl: function() {
        return this.getUrl("maintenance.service.url")
    },
    getAmexImageUrl: function() {
        return this.getUrl("amex.images.url")
    },
    getChannelValue: function() {
        switch (Amex._settings.theme) {
            case "responsive":
                return "responsive-web";
            case "mobile":
                return "mobile-web";
            case "desktop":
                return "desktop-web";
            case "mobile-native":
                return "mobile-native"
        }
    }
}, Amex.Object = {
    Class: function(e, t, n) {
        if (Amex.CLASSES[e]) return Amex.CLASSES[e];
        var i = t || function() {};
        return i.prototype = n, i.prototype.constructor = i, Amex.Utils.create(e, i), Amex.CLASSES[e] = i, i
    },
    subclass: function(e, t, n) {
        if (Amex.CLASSES[e]) return Amex.CLASSES[e];
        var i = Amex.Utils.create(t);
        return Amex.Utils.copy(n, i.prototype), Amex.Object.Class(e, function() {
            i.apply && i.apply(this, arguments)
        }, n)
    }
}, Amex.Widget = {
    _tagInfos: [{
        localName: "init",
        className: "Amex.Widget.Tag.Init"
    }, {
        localName: "buy",
        className: "Amex.Widget.Tag.Buy"
    }],
    parse: function(e, t) {
        var n = Amex.Widget._tagInfos;
        if ("undefined" != typeof t) {
            for (var i = 0, o = 0; o < Amex.Widget._tagInfos.length; o++)
                if (Amex.Widget._tagInfos[o].localName === t) {
                    i = o;
                    break
                }
            n = n.slice(i, i + 1)
        }
        Amex.Utils.forEach(n, function(t) {
            t.xmlns || (t.xmlns = Amex.Config.Common.namespace);
            for (var n = Amex.Widget.getDomElements(e, t.xmlns, t.localName), i = 0; i < n.length; i++) Amex.Widget.processElement(n[i], t)
        })
    },
    processElement: function(dom, tagInfo) {
        var fn = eval(tagInfo.className);
        element = dom._element = new fn(dom), element && element.process()
    },
    getDomElements: function(e, t, n) {
        var i = t + ":" + n;
        switch (Amex.Browser.getBrowserType()) {
            case "mozilla":
                return e.getElementsByTagNameNS(document.body.namespaceURI, i);
            case "ie":
                try {
                    var o = document.namespaces;
                    if (o && o[t]) {
                        var s = e.getElementsByTagName(n);
                        if (s.length) return s
                    }
                } catch (a) {}
                return e.getElementsByTagName(i);
            default:
                return e.getElementsByTagName(i)
        }
    }
},
    function() {
        try {
            var e = Amex.Config.Common.namespace;
            if (document.namespaces && !document.namespaces.item[e]) {
                document.namespaces.add(e, "urn:schemas-amexpay-com:" + e, "#default#" + e.toUpperCase());
                for (var t = ["buy", "init"], n = (document.createStyleSheet(), 0); n < t.length; n++) document.createElement(e + ":" + t[n])
            }
        } catch (i) {
            Amex.log("couldn't add namespace")
        }
    }(), Amex.Widget.Tag = {}, Amex.Widget.Tag.Base = function(e) {
    this.dom = e
}, Amex.Widget.Tag.Base.prototype = Amex.Utils.copy({
    getAttribute: function(e, t, n) {
        var i = this.dom.getAttribute(e);
        if (null !== i) {
            var o;
            if (o = n ? i.toLowerCase() : i, "undefined" != typeof Amex.AllowedValues[e]) {
                var s = !1;
                for (key in Amex.AllowedValues[e])
                    if (o === Amex.AllowedValues[e][key]) {
                        s = !0;
                        break
                    }
                return s ? o : t
            }
            return o
        }
        return t
    }
}), Amex.Object.subclass("Widget.Tag.Init", "Widget.Tag.Base", {
    process: function() {
        this.parser()
    },
    parser: function() {
        Amex._settings.clientId = this.getAttribute("client_id"), Amex._settings.merchantId = this.getAttribute("merchant_id"), Amex._settings.theme = this.getAttribute("theme", "desktop", !0), Amex._settings.env = this.getAttribute("env", "production", !0), Amex._settings.disableBtn = this.getAttribute("disable_btn", "false", !0), Amex._settings.buttonColor = this.getAttribute("button_color", "dark", !0), Amex._settings.buttonSize = this.getAttribute("button_size", "", !0), Amex._settings.callback = this.getAttribute("callback")
    }
}), Amex.Object.subclass("Widget.Tag.Buy", "Widget.Tag.Base", {
    process: function() {
        this.parser()
    },
    parser: function() {
        Amex._settings.contextId = this.getAttribute("context_id"), Amex._settings.keyName = this.getAttribute("key_name"), Amex._settings.keyValue = this.getAttribute("key_value")
    }
}), Amex.SDKConfig = {
    init: function(e) {
        this._configs = e
    },
    get: function(e, t) {
        return "undefined" != typeof this._configs[e] ? this._configs[e] : t
    }
}, Amex.UI = {
    addAmexCss: function() {
        Amex.Dom.addCssStyles()
    },
    createAmexButton: function() {
        if (-1 !== window.navigator.userAgent.toLowerCase().indexOf("msie") || window.navigator.appVersion.toLowerCase().indexOf("trident/") > 0) {
            var e = Amex.Utils.randomStringGenerator(8);
            Amex._settings.randomFrameId = e;
            var t = document.createElement("iframe");
            t.frameBorder = 0, t.width = "0px", t.height = "0px", t.id = e, t.name = e, t.setAttribute("src", Amex.URLs.getBlankIframeUrl()), Amex.Dom.getAmexDivs()[0].appendChild(t)
        }
        var n = "/express-checkout-";
        n += "mobile-native" === Amex._settings.theme || "mobile" === Amex._settings.theme ? Amex.Device.isRetinaDisplay() ? "mobile@2x-" : "mobile-" : Amex.Device.isRetinaDisplay() ? "desktop@2x-" : "desktop-", n += Amex._settings.buttonColor, "" !== Amex._settings.buttonSize && (n = n + "-" + Amex._settings.buttonSize), n += ".png";
        var i = Amex.URLs.getAmexImageUrl() + n,
            o = document.createElement("img");
        o.setAttribute("src", i), o.setAttribute("class", "amexExpressCheckOutImage"), o.setAttribute("alt", ""), o.setAttribute("style", "cursor: pointer;");
        var s = Amex.Utils.getImageDimensions(Amex._settings.buttonColor, Amex._settings.theme),
            a = Amex.Dom.getAmexDivs();
        if ("undefined" != typeof a)
            for (var r = 0; r < a.length; r++) {
                var o = document.createElement("img");
                o.setAttribute("src", i), o.setAttribute("class", "amexExpressCheckOutImage"), o.setAttribute("alt", ""), o.setAttribute("style", "cursor: pointer;"), o.setAttribute("width", s[0]), o.setAttribute("height", s[1]), a[r].appendChild(o)
            }
    },
    associatePopupEvent: function() {
        var e = null;
        Amex.Dom.observeMultiple(Amex.getElementsByClass("amexExpressCheckOutImage"), "click", function() {
            if (e && !e.closed) e.focus();
            else {
                var t, n;
                Amex.Utils.windowScreenWidth() <= Amex.SDKConfig.get("mobile.width.cutoff") ? (t = Amex.Utils.windowScreenWidth(), n = Amex.Utils.windowScreenWidth() <= Amex.SDKConfig.get("authentication.window.mobile.height") ? Amex.Utils.windowScreenWidth() : Amex.SDKConfig.get("authentication.window.mobile.height")) : (t = Amex.SDKConfig.get("authentication.window.width"), n = Amex.SDKConfig.get("authentication.window.height"));
                var i = Amex.Utils.windowScreenWidth() - t,
                    o = Amex.Utils.windowScreenHeight() - t,
                    s = window.screenX ? window.screenX : window.screenLeft,
                    a = window.screenY ? window.screenY : window.screenTop;
                self !== top && Amex.Browser.isIE8() && (a = 0), i = s + Amex.Utils.windowWidth() / 2 - t / 2, o = a + Amex.Utils.windowHeight() / 2 - t / 2, Amex.Widget.parse(document, "buy"), e = window.open(Amex.URLs.prepareAuthWindowUrl(), "PayWithAmex", "toolbar=no,menubar=no,location=no,resizable=yes,status=no,top=" + o + ", left=" + i + ",width=" + t + ", height=" + n)
            }
        }), window.addEventListener ? window.addEventListener("message", Amex.response.dataRecievedCallback, !1) : window.attachEvent("onmessage", Amex.response.dataRecievedCallback, !1)
    },
    ie8Fix: function() {
        Amex.Utils.windowInnerWidth() <= Amex.SDKConfig.get("mobile.width.cutoff") ? (Amex.Dom.removeCss(Amex.$(Amex.Config.Common.divId), "desktop"), Amex.Dom.addCss(Amex.$(Amex.Config.Common.divId), "mobile")) : (Amex.Dom.removeCss(Amex.$(Amex.Config.Common.divId), "mobile"), Amex.Dom.addCss(Amex.$(Amex.Config.Common.divId), "desktop"))
    },
    checkMaintenanceStatus: function() {
        Amex._settings.maintenanceFlag = !0;
        var e = {
                clientId: Amex._settings.clientId,
                merchantId: Amex._settings.merchantId,
                q: Math.random()
            },
            t = Amex.URLs.getMaintenanceServiceUrl() + "?" + Amex.QueryString.encode(e);
        Amex.Dom.addScript("application/javascript", t, maintenanceStatusError)
    }
}, Amex.response = {
    dataRecievedCallback: function(e) {
        console.log('event',e);
        console.log('origin', e.origin);
        console.log('Amex.URLs.getProviderHost()',Amex.URLs.getProviderHost());

        console.log('result',e.origin !== Amex.URLs.getProviderHost());
        if (e.origin !== Amex.URLs.getProviderHost()) return void Amex.log("error: origin mismatch");
        if (null !== Amex._settings.callback && "undefined" != typeof Amex._settings.callback && "" !== Amex._settings.callback) {
            var t = window[Amex._settings.callback];
            "function" == typeof t ? t(JSON.parse(e.data)) : Amex.log("error: callback function '" + Amex._settings.callback + "' is not defined")
        } else window.top.location.href = e.data
    }
}, Amex.SDKConfig.init({
    "authentication.window.width": 340,
    "authentication.window.height": 550,
    "mobile.width.cutoff": 660,
    "authentication.window.mobile.height": 828,
    "authentication.window.url": "https://www435.americanexpress.com/connectcheckout/continue",
    "maintenance.service.url": "https://www435.americanexpress.com/connect/maintenancecheck",
    "amex.images.url": "https://icm.aexp-static.com/Internet/IMDC/US_en/RegisteredCard/AmexExpressCheckout/images",
    "amex.iframe.blank.url": "https://www435.americanexpress.com/connect/blank",
    "authentication.window.url.sandbox": "https://qwww435.americanexpress.com/connectcheckout/continue",
    "maintenance.service.url.sandbox": "https://qwww435.americanexpress.com/connect/maintenancecheck",
    "amex.images.url.sandbox": "https://qicm.americanexpress.com/Internet/IMDC/US_en/RegisteredCard/AmexExpressCheckout/images",
    "amex.iframe.blank.url.sandbox": "https://qwww435.americanexpress.com/connect/blank",
    "authentication.window.url.qa": "https://qwww435.americanexpress.com/sbconnectcheckout/continue",
    "maintenance.service.url.qa": "https://qwww435.americanexpress.com/sbconnect/maintenancecheck",
    "amex.images.url.qa": "https://qicm.americanexpress.com/Internet/IMDC/US_en/RegisteredCard/AmexExpressCheckout/images",
    "amex.iframe.blank.url.qa": "https://qwww435.americanexpress.com/sbconnect/blank",
    "authentication.window.url.dev": "https://dcentral1081.intra.aexp.com:8443/connectcheckout/continue",
    "maintenance.service.url.dev": "https://dcentral1081.intra.aexp.com:8443/connect/maintenancecheck",
    "amex.images.url.dev": "https://dicm.intra.aexp.com/Internet/IMDC/US_en/RegisteredCard/AmexExpressCheckout/images",
    "amex.iframe.blank.url.dev": "https://dcentral1081.intra.aexp.com:8443/connect/blank",
    "authentication.window.url.local": "https://localhost:9444/sbconnectcheckout/continue",
    "maintenance.service.url.local": "https://localhost:9444/sbconnect/maintenancecheck",
    "amex.images.url.local": "https://qicm.americanexpress.com/Internet/IMDC/US_en/RegisteredCard/AmexExpressCheckout/images",
    "amex.iframe.blank.url.local": "https://localhost:9444/sbconnect/blank",
    dark: "155*38-120*30",
    light: "155*38-120*30",
    plain: "265*75-288*76",
    "dark-ss": "44*28-44*28",
    "dark-xs": "41*26-41*26",
    "light-ss": "44*28-44*28",
    "light-xs": "41*25-41*25"
}),
    function() {
        if (Amex.Widget.parse(document, "init"), null !== Amex._settings.callback && "undefined" != typeof Amex._settings.callback && "" !== Amex._settings.callback && "function" != typeof window[Amex._settings.callback]) return void Amex.log("error: callback function '" + Amex._settings.callback + "' is undefined.");
        var e = Amex.URLs.getMaintenanceServiceUrl();
        Amex._settings.maintenanceFlag = !0, "undefined" != typeof e && 0 !== e.length && Amex.UI.checkMaintenanceStatus()
    }();