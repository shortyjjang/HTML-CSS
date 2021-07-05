import {
    ThingV1Response,
    ThingObject,
    FancyUserConfig,
    SalesResponse,
} from "ftypes";
import { BaseSyntheticEvent } from "react";

const __KEY__ = '__F';

const { _ } = window;

window.requestIdleCallback = window.requestIdleCallback || function(cb: Function, ...args: any[]) {
    window.setTimeout(cb, 0, ...args);
};

// Polyfills
Number.isNaN = Number.isNaN || function isNaN(value) {
    return value !== value;
};

Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
           isFinite(value) &&
           Math.floor(value) === value;
};

// https://ponyfoo.com/articles/ecmascript-string-padding
export function padStart(text: string, max: number, mask: string) {
  const cur = text.length;
  if (max <= cur) {
    return text;
  }
  const masked = max - cur;
  let filler = String(mask) || ' ';
  while (filler.length < masked) {
    filler += filler;
  }
  const fillerSlice = filler.slice(0, masked);
  return fillerSlice + text;
}

export function zfill(text: string, max: number) {
    return padStart(text, max, '0');
}

// Select element or create element via selector
export function selectOrCreate(selector:string, container: Element = document.body, element: string = 'div'): Element {
    var attr;
    var attrValue;
    if (selector[0] === '.') {
        attr = 'class';
        var classNames = selector.split('.').filter(e=>e);
        if (classNames.length > 1) { // .abc.def
            attrValue = classNames.join(' ');
        } else { // .abc
            attrValue = selector.substr(1);
        }
    } else if (selector[0] === '#') {
        attr = 'id';
        attrValue = selector.substr(1);
    } else {
        // TODO: error handling - redirect to the page
        throw new Error('non-recognized selector:' + selector);
    }

    var target = $(container).find(selector).get(0);
    if (target == null) {
        target = $(`<${element} ${attr}="${attrValue}" />`).appendTo(container).get(0);
    }
    return target;
}

interface URLMeta {
    href?: string | null;
    type?: string;
    id?: string;
}
const thingRegex = /^\/(sales|things)\/(\d+)/;
export function extractMetaFromURL(url: string) {
    url = stripDomain(url);
    const match = url.match(thingRegex); // ["/(sales|things)/1234", "sales", "1234"] | null
    const ret: URLMeta = {};
    if (match != null) {
        ret.href = stripURL(url); // Stripped relative URL
        ret.type = match[1];      // either { 'sales' | 'things' }
        ret.id = match[2];        // Integer
    }
    return ret;
}

const articleRegex = /^\/(articles)\/([^\?]+)/;
export function extractMetaFromArticleURL(url: string) {
    url = stripDomain(url);
    const match = url.match(articleRegex); // ["/articles/test", "articles", "test"] | null
    const ret: URLMeta = {};
    if (match != null) {
        ret.href = stripURL(url); // Stripped relative URL
        ret.type = match[1];      // always { 'article' }
        ret.id = match[2];        // String
    }
    return ret;
}

function createElementParser(url: string) {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    return a;
}

function stripDomain(url: string) {
    if (url) {
        const parser = createElementParser(url);
        let result = parser.pathname + parser.search + parser.hash;
        // IE FIX
        if (result.indexOf('/') !== 0) {
            result = '/' + result
        }
        return result
    } else {
        return '/';
    }
}

export function getObjectTypeFromUrl(url: string) {
    const path = stripDomain(url);
    if (thingRegex.test(path)) {
        return 'Thing';
    } else if (articleRegex.test(path)) {
        return 'Article';
    } else {
        return null;
    }
}

// Due to <a href=# /> -> a.pathname = location.pathname, we need cleaner
export function getPathname(aElement: HTMLAnchorElement) {
    if (aElement.pathname === location.pathname) {
        return '';
    } else {
        return aElement.pathname;
    }
}

// http://domain/things/1234 => /things/1234
// deprecated, use stripDomain()
function stripURL(url: string) {
    const stripped = stripDomain(url);
    if (stripped) {
        return stripped;
    } else {
        return null;
    }
}

export function floatFormatMinusTwo(number: number) {
    // simulates effect of floatformat:-2|intcomma
    var num = numberFormat(number, 2);
    var splitted = numberFormat(number, 2).split('.');
    if (splitted[1] === '00') {
        return splitted[0];
    } else return num;
}

// Either empty or null/undefined; Python-side falsy values like {}, []
export function isEmpty(obj: any) : boolean {
    return obj == null ||
           obj === ''  ||
           (obj instanceof Array && obj.length === 0) ||
           (typeof obj === 'object' && Object.getOwnPropertyNames(obj).length === 0);
}

export function setCaretPos(element: HTMLInputElement, position: number) {
    element.focus();
    if (element.setSelectionRange){
        element.setSelectionRange(position, position);
    } else if (element.createTextRange) {
        var range = element.createTextRange();
        range.moveEnd('character', position);
        range.collapse(false);
        range.select();
    }
};

export function getCaretPos(element: HTMLInputElement) {
    if (element.selectionStart) {
        return element.selectionStart;
    } else if (document.selection) {
        var range = document.selection.createRange();
        range.moveStart('character', -element.value.length);
        return range.text.length;
    } else {
        return -1;
    }
}

export var KEYS = {
    TAB: 9,
    ENTER: 13,
    SPACE: 32,
    ESC: 27,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    SEMICOLON: 186,
    COMMA: 188 // ,
};

// Using DOM high-level event triggering system for React to recognize event
export function triggerEvent(DOMRef: Element, eventName: string, data: Object) {
    var event;
    if (data) {
        event = new CustomEvent(eventName, {
            'bubbles'    : true, // Whether the event will bubble up through the DOM or not
            'cancelable' : true, // Whether the event may be canceled or not
            'detail': data
        });
    } else {
        event = new Event(eventName, {
            'bubbles'    : true, // Whether the event will bubble up through the DOM or not
            'cancelable' : true  // Whether the event may be canceled or not
        });
    }
    return DOMRef.dispatchEvent(event);
}

// Deep merge for reducers
export function update(state: unknown, next: unknown) {
    var args = [true, {}, state];
    if (next) {
        args.push(next)
    }
    return $.extend.apply(null, args);
}

// 'Shallow merge'
export function updateShallow(state: unknown, next: unknown) {
    var args = [{}, state];
    if (next) {
        args.push(next)
    }
    return _.extend.apply(null, args);
}

export function getDisplay(display: unknown) {
    return {
        display: display ? 'block' : 'none'
    };
}

// '<a>b</a>' => 'b'
export function stripTags(html: string) {
    var div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || null;
}

export function isPlainLeftClick(event: JQueryEventObject) : boolean {
    return !(event.button !== 0 || event.altKey || event.metaKey || event.ctrlKey || event.shiftKey);
}

function testLegacyContextLocation() {
    try {
        // Root - /
        if (location.pathname === '/' && $('#container-wrapper .timeline').length > 0) {
            return true;
        // Search page - /search?q=foo
        } else if (/\/search\?q\=/.test(location.href)) {
            return true;
        // User page - /foo
        } else if (
            $('#container-wrapper .wrapper-content.profile-section').length > 0 &&
            /^\/((?!\/).)*$/.test(location.pathname)
        ) {
            return true;
        } else if ('/shop' === location.pathname || /^\/shop\/.*/.test(location.pathname)) {
            return true;
        // <username | shopname>/lists/<id>
        // <shopname>/collection/<id>
        } else if (
            /.*\/list\/\d+/.test(location.pathname) ||
            /.*\/collection\/\d+/.test(location.pathname)
        ) {
            return true;
        }
    } catch(e) {}

    return false;
}

let _isHomepage: boolean;
export function isHomepage() {
    if (_isHomepage == null) {
        _isHomepage = location.pathname === '/'
    }
    return _isHomepage;
}

let _isStream: boolean;
export function isStream() {
    if (_isStream == null) {
        return _isStream = testLegacyContextLocation();
    } else {
        return _isStream;
    }
}

export function promisifiedFetchImage(src: string, resolveCallback: any, timeout: number) {
    const deferred = $.Deferred();
    deferred.then(resolveCallback);

    if (timeout) {
        setTimeout(function () { deferred.resolve() }, timeout);
    }

    const img = new Image();
    img.onload = () => { deferred.resolve(); };
    img.onerror = () => { deferred.resolve(); };
    img.src = src;
}

export function debounceUntilTimeout(fun: Function, delay: number, context = null) {
    let timer: any;
    return function delayedFunctionWrapper(...args: unknown[]) {
        clearTimeout(timer);
        args.unshift(context);
        timer = setTimeout(fun.bind.apply(fun, args), delay);
    };
}

export function debounceEventUntilTimeout(eventHandler: Function, delay: number) {
    let timer: any;
    return (e: BaseSyntheticEvent) => {
        e.persist();
        clearTimeout(timer);
        timer = setTimeout(() => eventHandler(e), delay);
    }
}

const numberUnitPostfixes = ['', 'K', 'M', 'B', 'T'];
export function getConciseNumberString(_num: string | number) {
    let num = Number(_num);
    if (_.isNaN(num) || !_.isNumber(num)) {
        return ''
    }
    let pos = 0
    while (num > 1000) {
        num = num / 1000
        pos += 1
    }
    if (num % 1 !== 0) { // has some number after decimal point, i.e.) 10.5
        return num.toFixed(1) + numberUnitPostfixes[pos]
    } else { // integer i.e.) 10
        return String(num) + numberUnitPostfixes[pos]
    }
}

// humanize.js
export function numberFormat(number: number, decimals: number, decPoint?: string, thousandsSep?: string) : string {
    decimals = isNaN(decimals) ? 2 : Math.abs(decimals);
    decPoint = (decPoint === undefined) ? '.' : decPoint;
    thousandsSep = (thousandsSep === undefined) ? ',' : thousandsSep;

    var sign = number < 0 ? '-' : '';
    number = Math.abs(+number || 0);

    var intPartNum = parseInt(number.toFixed(decimals), 10);
    var intPart = intPartNum + '';
    var j = intPart.length > 3 ? intPart.length % 3 : 0;

    return sign + (j ? intPart.substr(0, j) + thousandsSep : '') + intPart.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep) + (decimals ? decPoint + Math.abs(number - intPartNum).toFixed(decimals).slice(2) : '');
}

// Number formatting utility i.e) 0.1 => 10%
export function proportionFormat(number: string | number, isFixed: boolean) : string {
    const num = Number(number);
    if (_.isNumber(num) && !_.isNaN(num)) {
        if (isFixed) {
            return (num * 100).toFixed(0) + '%';
        } else {
            return (num * 100) + '%';
        }
    } else {
        return '';
    }
}

export function isStaticPage() : boolean {
    return document.body.className.indexOf('static-ot') !== -1;
}

export function isStaticArticlePage() : boolean {
    return document.body.className.indexOf('static-article') !== -1;
}

// http://stackoverflow.com/questions/6393943/convert-javascript-string-in-dot-notation-into-an-object-reference
export function index(obj: Object, is: string, value : any): any {
    if (typeof is == 'string') {
        return index(obj, is.split('.'), value);
    } else if (is.length === 1 && value !== undefined) {
        obj[is[0]] = value;
        return value;
    } else if (is.length === 0) {
        return obj;
    } else if (obj[is[0]] !== undefined) {
        return index(obj[is[0]], is.slice(1), value);
    } else {
        // was unable to reach via selector
    }
}

// export function dateFormat(format, datetime) {
//     return $.datepicker ? $.datepicker.formatDate(format, datetime) : datetime;
// }

export function log(...args: unknown[]) {
    if (process.env.NODE_ENV !== 'production') {
        console.debug.apply(console, args);
    }
}

export function isVisible(elm: Element) {
    const vpH = $(window).height(); // Viewport Height
    const st = $(window).scrollTop(); // Scroll Top
    const $elm = $(elm);
    const offset= $elm.offset();
    const elementHeight = $elm.height();

    if (offset !== undefined && vpH !== undefined && st !== undefined && elementHeight !== undefined) {
        const y = offset.top;
        return ((y < (vpH + st)) && (y > (st - elementHeight)));
    }
}

// http://stackoverflow.com/a/32533637/1189421
// Object deduping / boxed value is not supported.
export function dedupeArray(vals: any[]): unknown[] | null {
    if (vals) {
        return vals.sort().reduce((a, b) => {
            if (b !== a[0]) {
                a.unshift(b);
            }
            return a;
        }, []);
    } else {
        return null;
    }
}

// Access global state
export function getFancyDepsRoot() {
    window[__KEY__] = window[__KEY__] || {};
    return window[__KEY__];
}

// eitherFancy('jQuery', $ => $(...)); -> $(...)
export function eitherFancy(namespace: string, doWith = (Deps: any) => Deps) /*:object? */{
    if (window[__KEY__]) {
        if (window[__KEY__][namespace]) {
            return doWith(window[__KEY__][namespace]);
        }
    } else {
        getFancyDepsRoot();
    }
    return null;
}

export function didClickOn($targ: JQuery, selector: string) {
    return $targ.parents(selector).length > 0 ||
           $targ.is(selector);
}

export const xmlUtil = {
    isSuccess(xml: string) {
        const sc = $(xml).find("status_code");
        return sc.length > 0 && sc.text() === '1';
    },
    isFail(xml: string) {
        const sc = $(xml).find("status_code");
        return sc.length > 0 && sc.text() === '0';
    }
};

export function MP(...args: unknown[]) {
    if (process.env.NODE_ENV === 'production') {
        window.track_event && window.track_event(...args)
    }
}

// ?a=1 -> ['a', '1']
export function getLocationArgPairs(key: string, originalArgStr:string=location.search) {
    const argStr = originalArgStr.substr(1, originalArgStr.length);
    if (argStr) {
        const args = argStr.split('&').map(e => e.split('='));
        if (key) {
            let ret;
            args.some(argPair => {
                if (argPair[0] === key) {
                    ret = argPair;
                }
            });
            if (ret) {
                return ret;
            }
        } else {
            return args;
        }
    }
}

export function formatDuration(value: string | number) {
    if (value == null) {
        // console.warn('formatDuration: undefined value', value)
        return '00:00';
    }
    const val = Number(value);
    if (_.isNaN(val)) {
        // console.warn('formatDuration: value causing NaN', value)
        return '00:00';
    }
    const remainder = (val % 3600) | 0;
    const minutes = (remainder / 60) | 0;
    const seconds = (remainder % 60) | 0;
    return `${zfill(String(minutes), 2)}:${zfill(String(seconds), 2)}`;
}

export function minmax(value: number, lb: number, ub: number) {
    return Math.max(Math.min(value, ub), lb);
}

export { openPopup, closePopup, renderPopup } from './PopupHelper';
export { cdnUtils, schemeless } from './CDNUtils';

export function mergeObjectArgs(args: unknown[]) {
    return args.reduce((p, n)=> $.extend(true, p, n), null);
}


function closestUntil(startingElement: Element | null, targetElement : Element | null): Element | null {
    let start = startingElement;
    while (start != null) {
        if (start === targetElement) return targetElement;
        if (start === document.body || start === document.documentElement) {
            return null;
        }
        start = start.parentElement;
    }
    return null;
}

export class ClickOutside {
    eventKey: string = '';
    component?: import('react').Component = undefined;
    popupElementRefKey: string = '';

    constructor({ component, popupElementRefKey = 'popupElement' } : { component: import('react').Component, popupElementRefKey: string }) {
        const key = Math.random().toString().substr(2, 8);
        this.eventKey = "click.attachClickOutside" + key;
        this.component = component;
        this.popupElementRefKey = popupElementRefKey;
    }

    attached = false;
    handleAttach = (closePopupFunction: Function) => {
        if (this.attached || closePopupFunction == null) {
            return;
        }
        const { component, eventKey, handleDetach, popupElementRefKey } = this;
        $(document.body).on(eventKey, function(event: JQueryOldTriggeredEvent) {
            if (!event.isTrigger &&
                $.contains(document.body, event.target) && // check if element exists on DOM
                closestUntil(event.target, component[popupElementRefKey]) === null // is target element exist below popup element?
            ) {
                closePopupFunction(component);
                handleDetach();
            }
        });
        this.attached = true;
    }

    handleDetach = () => {
        $(document.body).off(this.eventKey);
        this.attached = false;
    }

    destroy() {
        delete this.component;
        this.handleDetach();
    }
}

export { copyToClipboard } from './CopyToClipboard'

export function isClipboardSupported() : boolean {
    return document.queryCommandSupported != null && document.queryCommandSupported('copy');
}

function isSaleResponse(sales: SalesResponse[]) : sales is SalesResponse[] {
    return sales != null && sales[0] != null;
}

// Adapt server response (thing.to_v1 -> rest API)
export function convertThingsV1ToRest(things: ThingV1Response[]): ThingObject[] {
    return things.map((thing: ThingV1Response) => {
        const converted: ThingObject = Object.assign({
            sales_available: false,
            id: thing.id_str,
            name: thing.name,
            fancyd: thing["fancy'd"],
            thumb_image_url_310: thing.thumb_image_url_310,
            thumb_image_url_558: thing.thumb_image_url_558,
            fancyd_count: thing.fancys,
            image: {
                src: thing.image_url,
                width: thing.image_url_width,
                height: thing.image_url_height
            },
            owner: thing.user,
            html_url: window.parseURL(thing.url).pathname,
            fancyd_users: thing.fancyd_users,
            sales: thing.sales,
        }, thing);

        const { sales } = thing;
        if (isSaleResponse(sales)) {
            const sales: SalesResponse = thing.sales[0];
            if (sales.id == null && sales.sale_id != null) {
                sales.id = sales.sale_id
            }
            // converted.sales.waiting = sales.waiting;
            converted.sales = sales;
            converted.sales.quantity = sales.remaining_quantity;
            converted.sales.price = sales.fancy_price;
            converted.sales_available = sales.available_for_sale;
        } else {
            converted.sales = null;
        }

        // Flag for cache
        converted.isCrawled = true;
        return converted;
    });
}
export function isElementOutsideViewport(element: Element, excludingElement: { element: Element, type: string }) {
    let elementRect = element.getBoundingClientRect();
    let upperBound = 0;
    let leftBound = 0;
    if (excludingElement) {
        const { element, type } = excludingElement;
        if(element){
            const exclusionRect = element.getBoundingClientRect();
            if (type === 'top') {
                upperBound = exclusionRect.bottom; // exclusion on top of el (header, etc)
            } else if (type === 'left') {
                leftBound = exclusionRect.right; // exclusion on left of el (sidebar, etc)
            } // right, bottom is TODO
        }
    }
    const html = document.documentElement
    const lowerBound = window.innerHeight || html.clientHeight
    const rightBound = window.innerWidth || html.clientWidth
    const { bottom, top, left, right } = elementRect

    return (
        (top <= upperBound && bottom <= upperBound) ||
        (top >= lowerBound && bottom >= upperBound) ||
        (left <= leftBound && right <= leftBound) ||
        (left >= rightBound && right >= rightBound)
    );
}

let _FancyUser : FancyUserConfig = {
    loggedIn: false,
    merchant: false,
    id: null,
};

if (window.__FancyUser) {
    Object.assign(_FancyUser, window.__FancyUser);
}
export const FancyUser = _FancyUser;

const locationHostname = `${location.protocol}//${location.hostname}`
export function stripPathname(href: string) {
    const sp = href.split(locationHostname)
    return sp.length > 1 ? sp[1] : sp[0]
}

// https://gist.github.com/ijy/6094414
export function cartesianProductOf(...args) {
    return _.reduce(args, (a, b) => {
        return _.flatten(_.map(a, (x) => {
            return _.map(b, (y) => {
                return x.concat([y]);
            });
        }), true);
    }, [ [] ]);
}

export function jQueryPromiseAll(arrayOfPromises: Array<Promise<unknown>>) {
    return jQuery.when.apply(jQuery, arrayOfPromises).then(function() {
        return Array.prototype.slice.call(arguments, 0);
    });
}

const _loaded = {};
export function loadCss(AppName: string) {
    const B = window.Bundle;
    if (_loaded[AppName]) {
        return;
    }
    if (B && B.cssToLoad && B.cssToLoad[AppName] && B.cssToLoad[AppName].length > 0) {
        while (B.cssToLoad[AppName].length > 0) {
            const nextUrl = B.cssToLoad[AppName].pop();
            $(document.head).append(`<link href="${nextUrl}" rel="stylesheet">`);
            _loaded[AppName] = true;
        }
    }
}

const _alertify = window.alertify || {
    alert(...args: unknown[]) { window.alert(...args); },
    prompt(message: string, fn?: Function | undefined, placeholder?: string | undefined, cssClass?: string | undefined) {
        if (fn) {
            let msg : string | undefined | null;
            if (placeholder) {
                msg = window.prompt(message, placeholder)
            } else {
                msg = window.prompt(message)
            }
            if (msg === null) {
                fn(false);
            } else {
                fn(true, msg);
            }
        } 
    },
    confirm(message: string, fn?: Function | undefined, cssClass?: string | undefined) {
        if (fn) {
            fn(window.confirm(message));
        }
    },
    set: function() {},
    labels: { ok: 'OK', cancel: 'Cancel' },
};
export const alertify = _alertify;

// https://code.jquery.com/jquery-3.3.1.js
export function escapeSelector(sel: string) { // $.escapeSelector()
    var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g;
    var fcssescape = function(ch: string, asCodePoint: boolean) {
        if (asCodePoint) {
            // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
            if (ch === "\0") {
                return "\uFFFD";
            }
            // Control characters and (dependent upon position) numbers get escaped as code points
            return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
        }
        // Other potentially-special ASCII characters get backslash-escaped
        return "\\" + ch;
    };

    return (sel + '').replace(rcssescape, fcssescape);
};

let isSafari_cac : undefined | boolean;
export const isSafari = () => {
    if (isSafari_cac === undefined) {
        isSafari_cac = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
    return isSafari_cac;
};
