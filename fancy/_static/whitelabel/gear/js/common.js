emailRegEx = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i;

jQuery.cookie = {
	'get' : function(name){
		var regex = new RegExp('(^|[ ;])'+name+'\\s*=\\s*([^\\s;]+)');
		return regex.test(document.cookie)?unescape(RegExp.$2):null;
	},
	'set' : function(name, value, days){
		var expire = new Date();
		expire.setDate(expire.getDate() + (days||0));
		cookie_str = name+'='+escape(value)+(days?';expires='+expire:'');
		cookie_str +='; path=/';
		document.cookie = cookie_str;
	}
}

window.addCommas = function(nStr){
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

window.isRetina = function(){
    return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches)) || (window.devicePixelRatio && window.devicePixelRatio >= 2)) && /(Mac|iPad|iPhone|iPod)/g.test(navigator.userAgent);
}


jQuery.parseString = function(str){
    var args = {};
    str = str.split(/&/g);
    for(var i=0;i<str.length;i++){
        if(/^([^=]+)(?:=(.*))?$/.test(str[i])) args[RegExp.$1] = decodeURIComponent(RegExp.$2);
    }
    return args;
};
location.args = jQuery.parseString(location.search.substr(1));

// template
jQuery.fn.template = function(args) {
    if(!args) args = {};
    var html = jQuery.trim(this.html()).replace(/##(\w+)##/g, function(whole,name){
        return args[name] || '';
    });

    return jQuery(html);
};

jQuery(function($){
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = location.host; // host + port
        var protocol = location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|https?:).*/.test(url));
    }
    $.ajaxPrefilter(function(options, originalOptions, jqXHR){
        if(/^(POST|PUT|DELETE)$/i.test(options.type) && sameOrigin(options.url)){
            var v;
            if (typeof($.cookie) == 'function') {
                v = $.cookie('csrftoken');
            } else {
                v = $.cookie.get('csrftoken');
            }
            if(v && v.length){
                if(!options.headers) options.headers = {};
                options.headers['X-CSRFToken'] = v;
            }
            // prevent cache to avoid iOS6 POST bug
            if (!/[&\?]_=\d+/.test(options.url)) {
                options.url += ((options.url.indexOf('?') > 0)?'&':'?')+'_='+(new Date).getTime();
            }
        }
    });
})

// Gear common libs
window.Gear = (function () {
    'use strict';

    function deselectCurrent() {
        var selection = document.getSelection();
        if (!selection.rangeCount) {
            return function () {};
        }
        var active = document.activeElement;

        var ranges = [];
        for (var i = 0; i < selection.rangeCount; i++) {
            ranges.push(selection.getRangeAt(i));
        }

        switch (active.tagName.toUpperCase()) { // .toUpperCase handles XHTML
            case 'INPUT':
            case 'TEXTAREA':
            active.blur();
            break;

            default:
            active = null;
            break;
        }

        selection.removeAllRanges();
        return function () {
            selection.type === 'Caret' &&
            selection.removeAllRanges();

            if (!selection.rangeCount) {
            ranges.forEach(function(range) {
                selection.addRange(range);
            });
            }

            active &&
            active.focus();
        };
    }

    var cb, reselectPrevious, range, selection, mark;
    function prepareClipboard(text, options){
        var cb, reselectPrevious, range, selection, mark;
        if (!options) { options = {}; }
        cb = options.cb || Function.prototype;
        try {
            reselectPrevious = deselectCurrent();

            range = document.createRange();
            selection = document.getSelection();

            mark = document.createElement('mark');
            mark.textContent = text;
            // used to conserve newline, etc
            mark.style.whiteSpace = 'pre';
            document.body.appendChild(mark);

            range.selectNode(mark);
            selection.addRange(range);
        
        } catch (err) {
            console.warn(err);
        }
    }

    function copyToClipboard(text, options) {

        if(text){
            prepareClipboard(text, options);
        }

        try{
            var successful = document.execCommand('copy');
            
            if (!successful) {
                console.warn('unable to copy via execCommand')
                if(window.clipboardData){
                    window.clipboardData.setData('text/plain', text)
                }
            }
        } catch (err) {
            console.warn(err)
        } finally {
            cb && cb(null);
            if (selection) {
                if (typeof selection.removeRange == 'function') {
                    selection.removeRange(range);
                } else {
                    selection.removeAllRanges();
                }
            }
            if (mark) {
                document.body.removeChild(mark);
            }
            reselectPrevious && reselectPrevious();
        }
    }

    return {
        prepareClipboard: prepareClipboard,
        copyToClipboard: copyToClipboard
    }
})()

$(function(){
    $(document).on('mouseover', '.tooltip', function(){
        $(this).find('em').css('margin-left',-$(this).find('em').outerWidth()/2+'px');
    });
})
