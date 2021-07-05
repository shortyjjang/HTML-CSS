// built from 'webpack.FancyUtils.config.js'
// loaded from 'FancyUtils.js' and exported as global module 'fancymixin'
import React from 'react';
import { schemeless as getSchemelessURL } from './FancyUtils';


export const initialDisplayNone = { display: 'none' }; // DEPRECATED
export const Display = {
    None: { display: 'none' },
    Block: { display: 'block' },
    Inline: { display: 'inline' },
    InlineBlock: { display: 'inline-block' },
    NoneIf(cond) {
        return cond ? Display.None : undefined;
    },
    BlockIf(cond) {
        return cond ? Display.Block : undefined;
    },
    InlineIf(cond) {
        return cond ? Display.Inline : undefined;
    },
    InlineBlockIf(cond) {
        return cond ? Display.InlineBlock : undefined;
    }
};

// Image using background-image
export const BGImage = ({ alt, className, schemeless, url }) => {
    var backgroundImage = '';
    if (url) {
        backgroundImage = `url(${schemeless ? getSchemelessURL(url) : url})`;
    }

    return <img src="/_ui/images/common/blank.gif"
                style={{ backgroundImage }}
                className={className}
                alt={alt} />
}

// measurePointElement = .figure-item.btn-more
// https://app.asana.com/0/260912680807/218844368911219
export function getElementGapFromHeader(measurePointElement/*:Element*/) /*:number*/{
    const $headerFeatured = $('#header .header-featured');
    const $header = $('#header')
    let destHeight = $header.height()
    if ($headerFeatured.attr('data-expanded') === 'true') {
        destHeight += $headerFeatured.height()
    }
    return ~(document.body.scrollTop - $(measurePointElement).offset().top + destHeight) + 1 // convert - => + / + => -, integer
}
