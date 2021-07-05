// This module deals with outside of React context (mostly raw DOM) with observing DOM structure and 
// do sub'd actions when React-context actions fires.
import { dedupeArray } from 'fancyutils';

/*
if (process.env.NODE_ENV !== 'production') {
    window.__assert = true;
}

function assert(a,b) {
    if (window.__assert) console.assert(a,b)
}
*/

function findFancyButton(id)/*:jQuery?*/ {
    if (typeof id === 'string') {
        const domCache = thingsDomCache[id];
        if (typeof domCache === 'object') {
            return $(domCache);
        } else if (domCache === false) {
            // NOOP
        } else {
            const $query = $(`#container-wrapper a[href^="/things/${id}"]:visible`);
            if ($query.length > 0) {
                const containers = dedupeArray(
                    $query.map((i, e) => {
                        return $(e).closest('div.figure-item').get(0)
                    }).toArray()
                );
                if (containers && containers.length > 0) {
                    const $btn = $(containers[0]).find('button.fancy, button.fancyd, a.fancyd, a.fancy');
                    if ($btn.length > 0) {
                        thingsDomCache[id] = $btn[0];
                        return $btn;
                    }
                }
            }
            // If not returned
            thingsDomCache[id] = false;
        }
    }
}

function findArticleFancyButton(id)/*:jQuery?*/ {
    if (typeof id === 'string') {
        const domCache = thingsDomCache[id];
        if (typeof domCache === 'object') {
            return $(domCache);
        } else if (domCache === false) {
            // NOOP
        } else {
            const $query = $(`#container-wrapper a[href^="/articles/${id}"]:visible`);
            if ($query.length > 0) {
                const containers = dedupeArray(
                    $query.map((i, e) => {
                        return $(e).closest('div.article_item').get(0)
                    }).toArray()
                );
                if (containers && containers.length > 0) {
                    const $btn = $(containers[0]).find('button.fancy, button.fancyd, a.fancyd, a.fancy');
                    if ($btn.length > 0) {
                        thingsDomCache[id] = $btn[0];
                        return $btn;
                    }
                }
            }
            // If not returned
            thingsDomCache[id] = false;
        }
    }
}

// via thing id 
const thingsDomCache = {};

function toggleFancyButton($btn, fancyd) {
    $btn.removeClass('fancy').removeClass('fancyd');
    $btn.addClass(fancyd ? 'fancyd' : 'fancy');
}

function replaceFancyCount($btn, fancyd, fc) {
    // Fancy | Fancy'd
    if ($btn.text().toLowerCase().indexOf('fancy') >= 0) {
        $btn.html(`<span><i></i></span> ${fancyd ? 'Fancy\'d' : 'Fancy'}`);
    // Fancy count
    } else {
        $btn.html(`<span><i></i></span> ${fc}`);
    }
}

export function onFancyButtonUpdate(id/*:string*/, fancyd/*:boolean*/, fc/*:string*/) {
    const $btn = findFancyButton(id);
    if ($btn && $btn.length > 0) {
        toggleFancyButton($btn, fancyd);
        replaceFancyCount($btn, fancyd, fc);
    }
}

export function onArticleFancyButtonUpdate(id/*:string*/, fancyd/*:boolean*/, fc/*:string*/) {
    const $btn = findArticleFancyButton(id);
    if ($btn && $btn.length > 0) {
        toggleFancyButton($btn, fancyd);
        replaceFancyCount($btn, fancyd, fc);
    }
}
