class CDNUtils {
    HOSTS = {};

    constructor() {
        // init hosts
        this.makeServer('THINGD_MEDIA', 'thingd-media-ec.thefancy.com');
        this.makeServer('THEFANCY_MEDIA', 'thefancy-media-ec.thefancy.com');
        this.makeServer('RESIZE_IMAGE', 'resize-ec.thefancy.com');
        this.makeServer('STATICFILES', 'static-ec.thefancy.com');
        this.makeServer('FANCY_WEB', 'site-ec.thefancy.com');
    }

    makeServer(type, template) {
        const { HOSTS } = this;
        if (!HOSTS[type]) {
            HOSTS[type] = [];
        }
        HOSTS[type].push(template);
    }

    getResizeURL(url, size, method, isSchemeless, cdn) {
        var parts = window.parseURL(url);
        var fixedName = (/test_default/.test(parts.pathname)) ? 'thingd' : 'thefancy';
        var path = `/resize/${method ? method + '/' : ''}${size}/${fixedName}${parts.pathname}`;

        var resizeUrl;
        if (cdn) {
            resizeUrl = this.getCDNURL(path);
        } else {
            resizeUrl = `${parts.protocol}//${parts.hostname}${path}`;
        }

        if (isSchemeless) {
            resizeUrl = schemeless(resizeUrl);
        }
        return resizeUrl;
    }

    getCDNURL(url) {
        const { HOSTS } = this;
        let candidates;
        const parts = window.parseURL ? window.parseURL(url) : {};
        let path = parts.pathname;

        if (parts.hostname == 's3.amazonaws.com') {
            if (/\/media\.thefancy\.com/.test(parts.pathname)) {
                path = parts.pathname.replace(/^\/media\.thefancy\.com/, '');
                candidates = HOSTS.THEFANCY_MEDIA;
            } else if (/\/media\.thingd\.com/.test(parts.pathname)) {
                path = parts.pathname.replace(/^\/media\.thingd\.com/, '');
                candidates = HOSTS.THINGD_MEDIA;
            }
        } else if (/^\/(test_)?default/.test(path)) {
            candidates = HOSTS.THINGD_MEDIA;
        } else if (/^\/_ui/.test(path)) {
            candidates = HOSTS.FANCY_WEB;
        } else if (/^\/(resize|mark)/.test(path)) {
            candidates = HOSTS.RESIZE_IMAGE;
        } else if (/^\/_static_gen/.test(path)) {
            candidates = HOSTS.STATICFILES;
        } else {
            candidates = HOSTS.THEFANCY_MEDIA;
        }

        const hostname = candidates[sumChars(path.replace(/[^a-zA-Z0-9_]+/g,'')) % candidates.length];

        return '//'+ hostname + path;
    }

    // Get REST URI for given resized_schemeless_image arguments
    // See `fancy.templatetags.resized_images`
    resizedSchemelessImage(url, size, method) {
        // FIXME: some url (like cover image, user image, etc) gives weird url
        //        and `window.parseURL()` attaches it to location.pathname.
        //        This is temporary fix for it
        if (url.match(/^(CoverImages\/|UserImages\/)/)) {
            url = `/${url}`
        }
        return this.getResizeURL(url, size, method, true, true);
    }
}

function sumChars(str) {
    var sum = 0, i, c;
    for (i=0,c=str.length; i < c; i++) {
        sum += str.charCodeAt(i);
    }
    return sum;
}

export function schemeless(url) {
    var match = (typeof url === 'string') && url.match(/[http|https]\:(\/\/.*)/);
    return (match == null) ? url : match[1];
}

export const cdnUtils = new CDNUtils();
