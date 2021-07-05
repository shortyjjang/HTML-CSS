window.usernameRegEx = /^[a-zA-Z0-9_]+$/;
window.emailRegEx = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i;

String.prototype.escape_html = function() {
    var map = { "&": "amp", "<": "lt", ">": "gt", '"': "quot" };
    return this.replace(/&|<|>|\"/g, function(c) {
        return map[c] ? "&" + map[c] + ";" : c;
    });
};

$.escapeHTML = function(s) {
    var m = { "&": "amp", "<": "lt", ">": "gt", '"': "quot" };
    return s.replace(/&|<|>|\"/g, function(c) {
        return m[c] ? "&" + m[c] + ";" : c;
    });
};

if (typeof String.prototype.trim == "undefined") {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "");
    };
}

String.prototype.is_int = function() {
    return parseFloat(this) == parseInt(this) && !isNaN(this);
};

Number.prototype.toCurrency = function(n) {
    if (parseFloat(this) == parseInt(this)) {
        return this.toString();
    }
    return this.toFixed(n);
};

/**
 * Create a namespace if it doesn't exist and return it.
 */
function namespace(name) {
    var names = name.split("."),
        theLast = window,
        i = -1;
    while (names[++i]) {
        if (!(names[i] in theLast)) theLast[names[i]] = {};
        theLast = theLast[names[i]];
    }

    return theLast;
}

/**
 * parse a given URL
 */
function parseURL(url) {
    var fn = arguments.callee;
    if (!fn.anchor) fn.anchor = document.createElement("a");
    fn.anchor.setAttribute("href", url);

    return {
        protocol: fn.anchor.protocol,
        host: fn.anchor.host,
        hostname: fn.anchor.hostname,
        port: fn.anchor.port,
        pathname: fn.anchor.pathname.replace(/^\/?/, "/"),
        hash: fn.anchor.hash,
        search: fn.anchor.search
    };
}

// parse query string - equivalent to parse_string php function
jQuery.parseString = function(str) {
    var args = {};
    str = str.split(/&/g);
    for (var i = 0; i < str.length; i++) {
        if (/^([^=]+)(?:=(.*))?$/.test(str[i])) args[RegExp.$1] = decodeURIComponent(RegExp.$2);
    }
    return args;
};
location.args = jQuery.parseString(location.search.substr(1));

function date_created_since(date_str) {
    try {
        var dstr = date_str.replace(" ", "T");
        var nDate = new Date(dstr);
        var now = new Date();
        var seconds = Math.round((now - nDate) / 1000);
        var mins = Math.floor(seconds / 60);
        var hours = Math.floor(mins / 60);
        var days = Math.floor(hours / 24);

        if (days > 7) return days + " days";
        if (days == 7) return "a week";
        if (days == 1) return "a day";
        if (days > 1) return days + " days";
        if (hours == 1) return "an hour";
        if (hours > 1) return hours + " hours";
        if (mins == 1) return "a min";
        if (mins > 1) return mins + " min";
        if (seconds == 1) return "a sec";
        if (seconds > 1) return seconds + " sec";
        return "Now";
    } catch (err) {
        return "";
    }
}

window.intword = function(num) {
    if (num < 1000) {
        return num;
    } else if ((num < 1000) ^ 2) {
        return (num / 1000).toFixed(1) + "K";
    } else if ((num < 1000) ^ 3) {
        return (num / 1000 / 1000).toFixed(1) + "M";
    }
};

// jquery cookie
jQuery.cookie = {
    get: function(name) {
        var regex = new RegExp("(^|[ ;])" + name + "\\s*=\\s*([^\\s;]+)");
        return regex.test(document.cookie) ? unescape(RegExp.$2) : null;
    },
    set: function(name, value, days) {
        var expire = new Date();
        expire.setDate(expire.getDate() + (days || 0));
        cookie_str = name + "=" + escape(value) + (days ? ";expires=" + expire : "");
        cookie_str += "; path=/";
        document.cookie = cookie_str;
    }
};

window.addCommas = function(nStr) {
    nStr += "";
    x = nStr.split(".");
    x1 = x[0];
    x2 = x.length > 1 ? "." + x[1] : "";
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
    }
    return x1 + x2;
};

window.to_price_string = function(nStr) {
    if (parseInt(nStr) == parseFloat(nStr)) {
        nStr = parseInt(nStr).toString();
    }
    return addCommas(nStr);
};

window.numberFormat = function(num) {
    var regex = /(\d)(\d{3})([,\.]|$)/,
        parts;

    num += ""; // convert to string
    if (window.numberType === 2) {
        num = num.replace(/,/g, ".").replace(/ /g, "");
    }
    parts = num.replace(/,/g, "").split(".");
    parts[0] = parts[0].replace(/\d(?=(\d{3})+$)/g, "$&,");
    parts[1] = parts[1] ? "." + parts[1] : "";

    return parts[0] + parts[1];
};

window.scrollToElement = function(elem, top) {
    var pos = elem.offset().top;
    if (top != undefined) pos -= top;
    $("html, body").animate({ scrollTop: pos + "px" }, "fast");
};

$.fn.disable = function(b) {
    if (b == undefined) b = true;
    this.prop("disabled", b);
    b ? this.addClass("disabled") : this.removeClass("disabled");
    return this;
};

jQuery(function($) {
    if (navigator.platform.indexOf("Win") != -1) {
        $("body").addClass("winOS");
    }
    if ('ontouchstart' in document.documentElement ) {
        $("body").addClass("ipad");
    }
    $(".auto-enable-on-load")
        .removeClass("loading")
        .removeAttr("disabled");
});
