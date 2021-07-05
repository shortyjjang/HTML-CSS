import { isEmpty } from 'fancyutils';


export function getDescription(article) {
    return article.description;
}

export function formatPrice(amount) {
    var newPrice = amount.toFixed(2) + '';
    var regex = /(\d)(\d{3})([,\.]|$)/;
    while (regex.test(newPrice)) {
        newPrice = newPrice.replace(regex, '$1,$2$3');
    }
    if (window.numberType === 2) {
        newPrice = newPrice.replace(/,/g, ' ').replace(/\./g, ',');
    }
    return newPrice;
}

export function getSafeNameProp({ emojified_name, name }) {
    if (emojified_name) {
        return { dangerouslySetInnerHTML: { __html: emojified_name } };
    } else {
        return { children: name };
    }
}

function salesAvailable(thing) {
    if (!isEmpty(thing.sales)) {
        return thing.sales_available;
    }
    return false;
}

export function getThingName(thing) {
    if (thing.type === 'giftcard') {
        return gettext('Fancy Gift Card');
    } else if (salesAvailable(thing)) {
        return thing.sales.name;
    } else {
        return thing.name;
    }
}